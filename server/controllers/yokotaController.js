const pool = require('../connections/postgresDB');
const axios = require('axios');
const http = require('http');

// Resilient HTTP Keep-Alive Agent for Yokota API communication
const httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 30,
    maxFreeSockets: 10,
    timeout: 10000
});

const yokotaClient = axios.create({
    httpAgent,
    timeout: 10000, // 10-second safe timeout
    validateStatus: (status) => status < 500 // Do not throw on 404s
});

// In-Memory Fast Cache for Station Yokota API Data (60-second TTL)
const dcsYokotaApiCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute
const MAX_CACHE_ENTRIES = 200;

// Master Dictionary of Yokota Tool tightening stations from production status sheet
const MASTER_YOKOTA_TOOL_MAP = [
    { contr_no: "12", station: "20", folder: "0257", alt_folder: "257", tool_name: "EX-VVT - (YOKOTA)", line: "CHS" },
    { contr_no: "12", station: "Cam housing sub assy", folder: "0257", alt_folder: "257", tool_name: "EX-VVT - (YOKOTA)", line: "CHS" },
    { contr_no: "12", station: "CHS", folder: "0257", alt_folder: "257", tool_name: "EX-VVT - (YOKOTA)", line: "CHS" },
    { contr_no: "35", station: "53", folder: "0103", alt_folder: "103", tool_name: "IGNITION COIL BOLT - (YOKOTA)", line: "MK3" },
    { contr_no: "37", station: "21", folder: "0230", alt_folder: "230", tool_name: "WATER INLET HOUSING - (YOKOTA)", line: "MK3" },
    { contr_no: "37", station: "43", folder: "0230", alt_folder: "230", tool_name: "WATER INLET HOUSING - (YOKOTA)", line: "MK3" },
    { contr_no: "39", station: "17", folder: "0039", alt_folder: "39", tool_name: "WATER BYPASS OUTLET BOLT (YOKOTA)", line: "MK1" },
    { contr_no: "45", station: "58", folder: "0250", alt_folder: "250", tool_name: "I/M BOLT & NUT - (YOKOTA)", line: "MK3" },
    { contr_no: "49", station: "45", folder: "0104", alt_folder: "104", tool_name: "THROTTOLE BODY BOLT", line: "MK2" },
    { contr_no: "50", station: "61", folder: "0255", alt_folder: "255", tool_name: "EGR PIPE BOLT - (YOKOTA)", line: "MK3" },
    { contr_no: "51", station: "60", folder: "0240", alt_folder: "240", tool_name: "EGR VALVE BOLT (CHS) - (YOKOTA)", line: "MK3" },
    { contr_no: "53", station: "59", folder: "0053", alt_folder: "53", tool_name: "EGR COOLER BOLT & NUT- (YOKOTA)", line: "MK3" },
    { contr_no: "70", station: "61", folder: "0102", alt_folder: "102", tool_name: "I/M BKT BOLT (IN MANI) (YOKOTA)", line: "MK3" }
];

// Helper to resolve Yokota tools for a station, combining database entries with master dictionary
function getYokotaToolsForStation(stationNumber, dbToolMap) {
    const stnStr = String(stationNumber).trim();
    
    // 1. Find master tools configured for this station
    const masterTools = MASTER_YOKOTA_TOOL_MAP.filter(tool => {
        const toolStn = String(tool.station).trim();
        if (toolStn.toUpperCase() === stnStr.toUpperCase()) return true;
        if (/^\d+$/.test(toolStn) && /^\d+$/.test(stnStr)) {
            return parseInt(toolStn, 10) === parseInt(stnStr, 10);
        }
        return false;
    });

    const resolvedTools = [...masterTools];
    const seenFolders = new Set(resolvedTools.map(t => String(t.folder).replace(/^0+/, '')));

    // 2. Add any custom tools from DB that aren't already in master
    if (Array.isArray(dbToolMap)) {
        dbToolMap.forEach(dbTool => {
            const dbStn = String(dbTool.station).trim();
            const matchesStn = (dbStn.toUpperCase() === stnStr.toUpperCase()) ||
                (/^\d+$/.test(dbStn) && /^\d+$/.test(stnStr) && parseInt(dbStn, 10) === parseInt(stnStr, 10));

            if (matchesStn) {
                const normFolder = String(dbTool.folder).replace(/^0+/, '');
                if (!seenFolders.has(normFolder)) {
                    resolvedTools.push(dbTool);
                    seenFolders.add(normFolder);
                }
            }
        });
    }

    return resolvedTools;
}

// Helper to compare folder codes robustly (handles leading zeros, case, whitespace)
function isFolderMatch(apiFolder, dbFolder) {
    if (apiFolder == null || dbFolder == null) return false;
    const a = String(apiFolder).trim().toUpperCase();
    const b = String(dbFolder).trim().toUpperCase();
    if (a === b) return true;

    const numA = a.replace(/^0+/, '');
    const numB = b.replace(/^0+/, '');
    if (numA !== '' && numA === numB) return true;

    return false;
}

// Helper to safely parse date string from Yokota records using arrival timestamp's year
function parseYokotaTimestamp(timeDateStr, referenceYear) {
    if (!timeDateStr || typeof timeDateStr !== 'string') return null;
    const cleanStr = timeDateStr.trim();

    // 1. Full ISO or standard datetime (YYYY-MM-DD HH:MM:SS or YYYY/MM/DD HH:MM:SS)
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(cleanStr)) {
        const iso = cleanStr.replace(/\//g, '-');
        const d = new Date(iso);
        if (!isNaN(d.getTime())) return d;
    }

    // 2. Yokota standard format "MM/DD HH:MM:SS" or "MM/DD HH:MM:SS.ssssss"
    const parts = cleanStr.split(' ');
    if (parts.length >= 2) {
        const monthDay = parts[0];
        const timePart = parts[1];
        const md = monthDay.split('/');
        if (md.length === 2) {
            const month = md[0].padStart(2, '0');
            const day = md[1].padStart(2, '0');
            const year = referenceYear || new Date().getFullYear();
            const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);
            if (!isNaN(dateObj.getTime())) return dateObj;
        }
    }

    const fallback = new Date(cleanStr);
    if (!isNaN(fallback.getTime())) return fallback;

    return null;
}

// Select matching Yokota records for a specific tool and arrival window
function matchYokotaRecords(rawYokotaData, arrivalTime, nextArrivalTime, toolFolder) {
    const startTime = new Date(arrivalTime);
    if (isNaN(startTime.getTime())) return [];

    const arrivalYear = startTime.getFullYear();
    const arrivalDateStr = startTime.toDateString();

    // 60-second pre-arrival buffer for RFID scan jitter & controller clock drift
    const cycleStartMs = startTime.getTime() - 60000;

    let cycleEndMs;
    if (nextArrivalTime) {
        const nextTime = new Date(nextArrivalTime).getTime();
        // Cap single-station window to at most 240s to prevent grabbing far-future engines
        cycleEndMs = Math.min(nextTime + 30000, startTime.getTime() + 240000);
    } else {
        cycleEndMs = startTime.getTime() + 150000; // 2.5 minutes default single-station cycle
    }

    // 1. Filter by folder if specified in tool mapping
    let candidates = rawYokotaData;
    if (toolFolder) {
        const folderMatches = rawYokotaData.filter(item => isFolderMatch(item.folder, toolFolder));
        if (folderMatches.length > 0) {
            candidates = folderMatches;
        }
    }

    // 2. Filter by date and cycle window
    const windowMatches = candidates.filter(item => {
        if (!item.timeDate) return false;
        const itemDate = parseYokotaTimestamp(item.timeDate, arrivalYear);
        if (!itemDate) return false;

        return itemDate.toDateString() === arrivalDateStr &&
               itemDate.getTime() >= cycleStartMs &&
               itemDate.getTime() <= cycleEndMs;
    });

    if (windowMatches.length === 0) return [];

    // 3. Sort chronologically
    windowMatches.sort((a, b) => {
        const timeA = (parseYokotaTimestamp(a.timeDate, arrivalYear) || new Date(0)).getTime();
        const timeB = (parseYokotaTimestamp(b.timeDate, arrivalYear) || new Date(0)).getTime();
        return timeA - timeB;
    });

    // 4. Group into clusters where items in a cluster are within 45s of each other (multi-bolt tightening)
    const clusters = [];
    let currentCluster = [];

    for (let i = 0; i < windowMatches.length; i++) {
        const item = windowMatches[i];
        const itemTime = (parseYokotaTimestamp(item.timeDate, arrivalYear) || new Date(0)).getTime();

        if (currentCluster.length === 0) {
            currentCluster.push({ item, itemTime });
        } else {
            const lastTime = currentCluster[currentCluster.length - 1].itemTime;
            if (itemTime - lastTime <= 45000) {
                // Same cycle / multi-bolt count
                currentCluster.push({ item, itemTime });
            } else {
                // New cycle (subsequent engine)
                clusters.push(currentCluster);
                currentCluster = [{ item, itemTime }];
            }
        }
    }
    if (currentCluster.length > 0) {
        clusters.push(currentCluster);
    }

    // 5. Find the cluster closest to startTime
    let bestCluster = clusters[0];
    let minDiff = Math.abs(bestCluster[0].itemTime - startTime.getTime());

    for (let i = 1; i < clusters.length; i++) {
        const diff = Math.abs(clusters[i][0].itemTime - startTime.getTime());
        if (diff < minDiff) {
            minDiff = diff;
            bestCluster = clusters[i];
        }
    }

    return bestCluster.map(c => c.item);
}

async function fetchYokotaStationData(stationNumber, formattedDate, arrivalTime, nextArrivalTime) {
    const timeKey = arrivalTime ? new Date(arrivalTime).toISOString() : 'full';
    const cacheKey = `${stationNumber}_${formattedDate}_${timeKey}`;
    const cached = dcsYokotaApiCache.get(cacheKey);

    if (cached && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
        return cached.data;
    }

    let url = `http://10.82.126.73:8127/api/station/${stationNumber}/date/${formattedDate}`;
    if (arrivalTime) {
        url += `?startTime=${encodeURIComponent(new Date(arrivalTime).toISOString())}`;
        if (nextArrivalTime) {
            url += `&nextTime=${encodeURIComponent(new Date(nextArrivalTime).toISOString())}`;
        }
    }

    try {
        const yokotaResponse = await yokotaClient.get(url);
        const data = (yokotaResponse.status === 404 || !yokotaResponse.data || !Array.isArray(yokotaResponse.data.data))
            ? []
            : yokotaResponse.data.data;

        if (dcsYokotaApiCache.size > MAX_CACHE_ENTRIES) {
            const oldestKey = dcsYokotaApiCache.keys().next().value;
            dcsYokotaApiCache.delete(oldestKey);
        }

        dcsYokotaApiCache.set(cacheKey, {
            cachedAt: Date.now(),
            data: data
        });

        return data;
    } catch (err) {
        return [];
    }
}

const getYokotaData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        // 1. Fetch station tool map from PostgreSQL (with fallback to master dictionary)
        let stationToolMap = [];
        try {
            const toolMapResult = await pool.query(`
                SELECT station, tool_name, folder 
                FROM station_tool_map
            `);
            stationToolMap = toolMapResult.rows || [];
        } catch (mapErr) {
            console.error('Error fetching station_tool_map from database:', mapErr.message);
        }

        // 2. Query target engine tracking arrivals with SQL-computed next arrival window in < 2ms
        const trackingWithWindowQuery = `
            WITH target_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number::text as station_number FROM engine_tracking WHERE engine_number = $1
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number::text as station_number FROM engine_tracking_two WHERE engine_number = $1
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number::text as station_number FROM engine_tracking_three WHERE engine_number = $1
                UNION ALL
                SELECT 'sub_assy' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_name as station_number FROM sub_assy WHERE engine_number = $1
            )
            SELECT 
                tt.engine_number,
                tt.arrival_time_str,
                tt.arrival_time,
                tt.station_number,
                (
                    SELECT MIN(all_t.arrival_time)
                    FROM (
                        SELECT station_number::text as stn, arrival_time FROM engine_tracking WHERE station_number::text = tt.station_number AND arrival_time > tt.arrival_time
                        UNION ALL
                        SELECT station_number::text as stn, arrival_time FROM engine_tracking_two WHERE station_number::text = tt.station_number AND arrival_time > tt.arrival_time
                        UNION ALL
                        SELECT station_number::text as stn, arrival_time FROM engine_tracking_three WHERE station_number::text = tt.station_number AND arrival_time > tt.arrival_time
                        UNION ALL
                        SELECT station_name as stn, arrival_time FROM sub_assy WHERE station_name = tt.station_number AND arrival_time > tt.arrival_time
                    ) all_t
                ) AS next_arrival_time
            FROM target_tracking tt
            ORDER BY tt.arrival_time DESC;
        `;

        console.log('Executing Yokota Query for Engine No:', engineNo);
        const result = await pool.query(trackingWithWindowQuery, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No data found for this engine number' 
            });
        }

        // Process each station visit for this engine
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number, next_arrival_time } = row;

                // Resolve all Yokota tools for this station (from DB or Master Dictionary)
                const stationTools = getYokotaToolsForStation(station_number, stationToolMap);

                // If station has no mapped Yokota tools, skip it
                if (stationTools.length === 0) {
                    return [];
                }

                const date = new Date(arrival_time);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                try {
                    // Fetch station data via high-speed windowed fetch
                    const rawYokotaData = await fetchYokotaStationData(station_number, formattedDate, arrival_time, next_arrival_time);

                    if (!rawYokotaData || rawYokotaData.length === 0) {
                        return [];
                    }

                    // Match records for each tool mapped to this station
                    const toolDataEntries = stationTools.flatMap(tool => {
                        const matchedRecords = matchYokotaRecords(rawYokotaData, arrival_time, next_arrival_time, tool.folder);

                        if (matchedRecords.length === 0) {
                            return [];
                        }

                        return matchedRecords.map(item => ({
                            engine_number: engine_number,
                            station: station_number,
                            folder: item.folder,
                            program: item.program,
                            unknownValue1: item.unknownValue1,
                            torqueDuplicate: item.torqueDuplicate,
                            unknownValue2: item.unknownValue2,
                            unknownValue3: item.unknownValue3,
                            unknownValue4: item.unknownValue4,
                            unknownValue5: item.unknownValue5,
                            torque: item.torque,
                            judgement: item.judgement,
                            timeDate: item.timeDate,
                            tool_name: tool.tool_name
                        }));
                    });

                    return toolDataEntries;

                } catch (yokotaErr) {
                    return [];
                }
            })
        );

        const finalData = processedData.flat();
        res.json(finalData);

    } catch (error) {
        console.error('Database error in getYokotaData:', error.message);
        res.status(500).json({ 
            message: 'Error fetching engine tracking data',
            error: error.message 
        });
    }
};

module.exports = {
    getYokotaData
};