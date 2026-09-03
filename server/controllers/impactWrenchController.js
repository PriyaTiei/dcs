const pool = require('../connections/postgresDB');
const axios = require('axios');
const http = require('http');

// Resilient HTTP Keep-Alive Agent for torque API communication
const httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 30,
    maxFreeSockets: 10,
    timeout: 10000
});

const torqueClient = axios.create({
    httpAgent,
    timeout: 10000, // 10-second safe timeout
    validateStatus: (status) => status < 500 // Do not throw on 404s
});

// In-Memory Fast Cache for Station Torque API Data (60-second TTL)
const dcsTorqueApiCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute
const MAX_CACHE_ENTRIES = 200;

// Complete Verified Master Map from UEC-4800 Controller & Status Sheet
const MASTER_URYU_TOOL_MAP = [
    { contr_no: "1", station: "28", folder: "016", tool_name: "Ex manifold stud", line: "MK1" },
    { contr_no: "2", station: "Cam housing sub assy", folder: "005", tool_name: "Cam cap bolt", line: "CHS" },
    { contr_no: "3", station: "Cam housing sub assy", folder: "006", tool_name: "D4 lifter guide", line: "CHS" },
    { contr_no: "4", station: "Block sub assy", folder: "007", tool_name: "Oil jet bolt (Nozzle No.1)", line: "BS" },
    { contr_no: "5", station: "51", folder: "017", tool_name: "Knock sensor bolt", line: "MK3" },
    { contr_no: "6", station: "Block sub assy", folder: "015", tool_name: "Oil pump bolt", line: "BS" },
    { contr_no: "7", station: "Block sub assy", folder: "040", tool_name: "Oil strainer bolt", line: "BS" },
    { contr_no: "8", station: "Block sub assy", folder: "001", tool_name: "Crank case bolt", line: "BS" },
    { contr_no: "10", station: "1", folder: "059", tool_name: "Oil Pan drain bolt", line: "MK1" },
    { contr_no: "11", station: "46", folder: "020", tool_name: "Vacuum pump bolt", line: "MK2" },
    { contr_no: "12", station: "Cam housing sub assy", folder: "008", tool_name: "EX-VVT", line: "CHS" },
    { contr_no: "15", station: "31", folder: "021", tool_name: "Ex/In VVT solenoid bolt", line: "MK1" },
    { contr_no: "16", station: "23", folder: "022", tool_name: "Chain Tensioner nut", line: "MK1" },
    { contr_no: "17", station: "23", folder: "023", tool_name: "Chain Tensioner bolt", line: "MK1" },
    { contr_no: "18", station: "21", folder: "024", tool_name: "Chain support (slipper)bolt", line: "MK1" },
    { contr_no: "19", station: "21", folder: "025", tool_name: "Chain damper bolt", line: "MK1" },
    { contr_no: "20", station: "23", folder: "026", tool_name: "Oil Pump Sprocket bolt", line: "MK1" },
    { contr_no: "21", station: "1", folder: "027", tool_name: "Oil filter union", line: "MK1" },
    { contr_no: "23", station: "Block sub assy", folder: "018", tool_name: "Hydraulic oil sensor bolt", line: "BS" },
    { contr_no: "24", station: "46", folder: "029", tool_name: "Oil level gauge guide", line: "MK2" },
    { contr_no: "25", station: "46", folder: "019", tool_name: "PCV case bolt", line: "MK2" },
    { contr_no: "26", station: "Head sub assy", folder: "012", tool_name: "D4 delivery pipe bolt", line: "HS" },
    { contr_no: "27", station: "57", folder: "030", tool_name: "Fuel pressurs sensor holder bolt", line: "MK3" },
    { contr_no: "28", station: "52", folder: "031", tool_name: "D4 pump bolt", line: "MK3" },
    { contr_no: "29", station: "55", folder: "032", tool_name: "Fuel pipe stay bolt", line: "MK3" },
    { contr_no: "30", station: "Head sub assy", folder: "011", tool_name: "Low pressure fuel delivery pipe", line: "HS" },
    { contr_no: "31", station: "Head sub assy", folder: "010", tool_name: "Fuel press. sensor holder (Port)", line: "HS" },
    { contr_no: "32", station: "52", folder: "033", tool_name: "Wire harness bkt nut", line: "MK3" },
    { contr_no: "33", station: "52", folder: "034", tool_name: "Wire harness bkt bolt Base", line: "MK3" },
    { contr_no: "34", station: "22", folder: "035", tool_name: "Wire harness bkt bolt thermostat", line: "MK1" },
    { contr_no: "35", station: "53", folder: "036", tool_name: "Ingnition coil bolt", line: "MK3" },
    { contr_no: "36", station: "43", folder: "014", tool_name: "Water inlet pipe bolt", line: "SPS" },
    { contr_no: "37", station: "43", folder: "037", tool_name: "Water inlet housing", line: "MK3" },
    { contr_no: "38", station: "28", folder: "038", tool_name: "Water outlet bolt", line: "MK1" },
    { contr_no: "39", station: "17", folder: "039", tool_name: "Water bypass outlet", line: "MK1" },
    { contr_no: "41", station: "56", folder: "041", tool_name: "Water bypass hose no.1 bolt", line: "MK3" },
    { contr_no: "42", station: "59", folder: "042", tool_name: "Water bypass pipe no.2 bolt", line: "MK3" },
    { contr_no: "43", station: "62", folder: "043", tool_name: "Water bypass plug", line: "MK3" },
    { contr_no: "44", station: "62", folder: "044", tool_name: "Heat insulation bolt", line: "MK3" },
    { contr_no: "45", station: "58", folder: "045", tool_name: "Intake manifold bolt & nut", line: "MK3" },
    { contr_no: "46", station: "58", folder: "046", tool_name: "Delivery guard bolt", line: "MK3" },
    { contr_no: "47", station: "61", folder: "047", tool_name: "Intake manifold stay bolt M8", line: "MK3" },
    { contr_no: "48", station: "61", folder: "048", tool_name: "Intake manifold stay bolt M6", line: "MK3" },
    { contr_no: "49", station: "45", folder: "049", tool_name: "Throttle body bolt", line: "MK2" },
    { contr_no: "50", station: "61", folder: "020", tool_name: "EGR pipe bolt", line: "MK3" },
    { contr_no: "51", station: "60", folder: "051", tool_name: "EGR valve bolt", line: "MK3" },
    { contr_no: "52", station: "59", folder: "052", tool_name: "EGR adaptor bolt", line: "MK3" },
    { contr_no: "53", station: "59", folder: "053", tool_name: "EGR Cooler bolt", line: "MK3" },
    { contr_no: "54", station: "59", folder: "013", tool_name: "EGR cooler (SPS)", line: "SPS" },
    { contr_no: "56", station: "26", folder: "054", tool_name: "V-Rib Belt Tensioner", line: "MK1" },
    { contr_no: "57", station: "58", folder: "055", tool_name: "Engine hanger No.1 bolt", line: "MK3" },
    { contr_no: "58", station: "61", folder: "058", tool_name: "Engine hanger No.2 bolt", line: "MK3" },
    { contr_no: "59", station: "7", folder: "057", tool_name: "HV damper bolt", line: "MK1" },
    { contr_no: "60", station: "51", folder: "058", tool_name: "NE sensor", line: "MK3" },
    { contr_no: "62", station: "62", folder: "063", tool_name: "Wire hrns bkt (EGR cooler)", line: "MK3" },
    { contr_no: "64", station: "22", folder: "062", tool_name: "Wire hrns bkt (Crank Case)", line: "MK1" },
    { contr_no: "65", station: "Cam housing sub assy", folder: "009", tool_name: "Wireharness Bkt (CHS)", line: "CHS" },
    { contr_no: "69", station: "26", folder: "060", tool_name: "Front oil seal press fit height", line: "MK1" },
    { contr_no: "70", station: "61", folder: "061", tool_name: "Intake manifold bracket bolt", line: "MK3" },
    { contr_no: "71", station: "51", folder: "064", tool_name: "Knock Control Sensor (1.5L)", line: "MK3" },
    { contr_no: "72", station: "7", folder: "072", tool_name: "Wire Hrns BKT HV", line: "MK1" }
];

// Helper to resolve all tools for a station, combining DB overrides with Master Dictionary
function getToolsForStation(stationNumber, dbToolMap) {
    const stnStr = String(stationNumber).trim();

    // 1. Find master tools configured for this station
    const masterTools = MASTER_URYU_TOOL_MAP.filter(tool => {
        const toolStn = String(tool.station).trim();
        if (toolStn.toUpperCase() === stnStr.toUpperCase()) return true;
        // Check numeric equivalence
        if (/^\d+$/.test(toolStn) && /^\d+$/.test(stnStr)) {
            return parseInt(toolStn, 10) === parseInt(stnStr, 10);
        }
        return false;
    });

    // 2. Build final list, correcting known DB folder swaps if present
    const resolvedTools = [...masterTools];
    const seenFolders = new Set(resolvedTools.map(t => String(t.folder).replace(/^0+/, '')));

    // Add any extra custom tools from DB that aren't already in master
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

// Helper to compare folder codes robustly (handles leading zeros, case, whitespace, prefix)
function isFolderMatch(apiFolder, dbFolder) {
    if (apiFolder == null || dbFolder == null) return false;
    const a = String(apiFolder).trim().toUpperCase();
    const b = String(dbFolder).trim().toUpperCase();
    if (a === b) return true;

    // Numeric comparison ignoring leading zeros (e.g., "043" vs "43")
    const numA = a.replace(/^0+/, '');
    const numB = b.replace(/^0+/, '');
    if (numA !== '' && numA === numB) return true;

    // Prefix normalization (e.g., "F043" vs "043")
    const cleanA = a.replace(/^[A-Z]/, '').replace(/^0+/, '');
    const cleanB = b.replace(/^[A-Z]/, '').replace(/^0+/, '');
    if (cleanA !== '' && cleanA === cleanB) return true;

    return false;
}

// Helper to safely parse date string from torque record
function parseTorqueTimestamp(dateStr) {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const cleanStr = dateStr.trim();
    const parsed = new Date(cleanStr);
    if (!isNaN(parsed.getTime())) return parsed;

    // Handle "YYYY/MM/DD HH:mm:ss" format
    const isoStr = cleanStr.replace(/\//g, '-');
    const parsedIso = new Date(isoStr);
    if (!isNaN(parsedIso.getTime())) return parsedIso;

    return null;
}

// Select matching torque records for a specific tool and arrival window
function matchToolRecords(rawTorqueData, tool, arrivalTime, nextArrivalTime) {
    const startTime = new Date(arrivalTime);
    if (isNaN(startTime.getTime())) return [];

    const arrivalDateStr = startTime.toDateString();

    // Base cycle window: engine arrives at startTime.
    // 60-second pre-arrival buffer for RFID scan jitter & controller clock drift
    const cycleStartMs =
        startTime.getTime() - (10 * 60 * 1000);

    const cycleEndMs =
        startTime.getTime() + (10 * 60 * 1000);

    // 1. Filter by folder match first
    const folderMatches = rawTorqueData.filter(item =>
        isFolderMatch(item.folder, tool.folder)
    );

    console.log(
        `[FOLDER-DEBUG] Tool=${tool.tool_name} ` +
        `Station=${tool.station} ` +
        `ExpectedFolder=${tool.folder}`
    );

    console.log(
        `[FOLDER-DEBUG] Tool=${tool.tool_name} ` +
        `AvailableFolders=${[...new Set(rawTorqueData.map(r => r.folder))].join(",")}`
    );

    if (tool.station === "61") {
        console.log(
            `[ST61] Tool=${tool.tool_name} ` +
            `ExpectedFolder=${tool.folder}`
        );

        console.log(
            `[ST61] AvailableFolders=${[...new Set(rawTorqueData.map(r => r.folder))].join(",")}`
        );
    }

    if (folderMatches.length === 0) {
        console.log(
            `[ST61] NO MATCH Tool=${tool.tool_name} ExpectedFolder=${tool.folder}`
        );
        return [];
    }

    console.log(
        `[MATCH-DEBUG] Tool=${tool.tool_name} ` +
        `Folder=${tool.folder} ` +
        `FolderMatches=${folderMatches.length}`
    );
    // 2. Filter by date and time window
    // Prioritize "Tightening date/time", with fallback to "Reception date/time"
    const windowMatches = folderMatches.filter(item => {
        const tightDate = parseTorqueTimestamp(item["Tightening date/time"]);
        const receptDate = parseTorqueTimestamp(item["Reception date/time"]);

        // Check if either timestamp matches the arrival date & cycle window
        const matchesTightening = tightDate &&
            tightDate.toDateString() === arrivalDateStr &&
            tightDate.getTime() >= cycleStartMs &&
            tightDate.getTime() <= cycleEndMs;

        const matchesReception = receptDate &&
            receptDate.toDateString() === arrivalDateStr &&
            receptDate.getTime() >= cycleStartMs &&
            receptDate.getTime() <= cycleEndMs;

        return matchesTightening || matchesReception;
    });
    console.log(
        `[MATCH-DEBUG] Tool=${tool.tool_name} ` +
        `WindowMatches=${windowMatches.length} ` +
        `Arrival=${arrivalTime}`
    );
    if (windowMatches.length === 0) {
        console.log(
            `[MATCH-DEBUG] Tool=${tool.tool_name} ` +
            `WindowMatches=0 ` +
            `Arrival=${arrivalTime}`
        );
        return [];
    }

    // 3. Deduplicate / isolate target engine's tightening sequence
    // Sort chronologically
    windowMatches.sort((a, b) => {
        const timeA = (parseTorqueTimestamp(a["Tightening date/time"]) || parseTorqueTimestamp(a["Reception date/time"]) || new Date(0)).getTime();
        const timeB = (parseTorqueTimestamp(b["Tightening date/time"]) || parseTorqueTimestamp(b["Reception date/time"]) || new Date(0)).getTime();
        return timeA - timeB;
    });

    // Group into clusters where items in a cluster are within 45s of each other (multi-bolt tightening)
    const clusters = [];
    let currentCluster = [];

    for (let i = 0; i < windowMatches.length; i++) {
        const item = windowMatches[i];
        const itemTime = (parseTorqueTimestamp(item["Tightening date/time"]) || parseTorqueTimestamp(item["Reception date/time"]) || new Date(0)).getTime();

        if (currentCluster.length === 0) {
            currentCluster.push({ item, itemTime });
        }
        else {
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

    console.log(`[MATCH-DEBUG] Tool=${tool.tool_name} ` + `Clusters=${clusters.length}`);
    // Find the cluster closest to startTime
    let bestCluster = clusters[0];
    let minDiff = Math.abs(bestCluster[0].itemTime - startTime.getTime());

    for (let i = 1; i < clusters.length; i++) {
        const diff = Math.abs(clusters[i][0].itemTime - startTime.getTime());
        if (diff < minDiff) {
            minDiff = diff;
            bestCluster = clusters[i];
        }
    }
    console.log(
        `[MATCH-DEBUG] Tool=${tool.tool_name} ` +
        `Returned=${bestCluster.length}`
    );
    return bestCluster.map(c => c.item);
}

async function fetchStationTorqueData(
    stationNumber,
    formattedDate,
    arrivalTime,
    nextArrivalTime
) {
    const timeKey = arrivalTime
        ? new Date(arrivalTime).toISOString()
        : 'full';

    const cacheKey = `${stationNumber}_${formattedDate}_${timeKey}`;

    const cached = dcsTorqueApiCache.get(cacheKey);

    if (
        cached &&
        (Date.now() - cached.cachedAt < CACHE_TTL_MS)
    ) {
        return cached.data;
    }

    let url =
    `http://10.82.126.73:8121/api/torque-data` +
    `?station=${stationNumber}` +
    `&date=${formattedDate}`;

    if (arrivalTime) {
        url += `&startTime=${encodeURIComponent(
            new Date(arrivalTime).toISOString()
        )}`;

        if (nextArrivalTime) {
            url += `&nextTime=${encodeURIComponent(
                new Date(nextArrivalTime).toISOString()
            )}`;
        }
    }

    console.log("[TORQUE-URL]", url);

    try {
        const torqueResponse = await torqueClient.get(url);

        const data =
            torqueResponse.status === 404 ||
                !torqueResponse.data ||
                !Array.isArray(torqueResponse.data.data)
                ? []
                : torqueResponse.data.data;

        console.log(
            `[TORQUE API] Station=${stationNumber} Records=${data.length}`
        );

        console.log(
            `[TORQUE API] Folders=${[
                ...new Set(data.map(r => r.folder))
            ].join(",")}`
        );

        if (dcsTorqueApiCache.size > MAX_CACHE_ENTRIES) {
            const oldestKey =
                dcsTorqueApiCache.keys().next().value;

            dcsTorqueApiCache.delete(oldestKey);
        }

        dcsTorqueApiCache.set(cacheKey, {
            cachedAt: Date.now(),
            data
        });

        return data;
    } catch (err) {
        console.error(
            `[TORQUE API ERROR] Station=${stationNumber}`,
            err.message
        );

        return [];
    }
}

const getImpactWrenchData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        // 1. Fetch station tool map from DB (with safe fallback)
        let dbStationToolMap = [];
        try {
            const toolMapQuery = `SELECT station, tool_name, folder FROM station_tool_map`;
            const toolMapResult = await pool.query(toolMapQuery);
            dbStationToolMap = toolMapResult.rows || [];
        } catch (dbErr) {
            console.warn('Warning fetching station_tool_map, using Master Dictionary:', dbErr.message);
        }

        // 2. Query target engine arrivals with SQL-computed next arrival window in < 2ms
        const trackingWithWindowQuery = `
            WITH target_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking WHERE engine_number = $1
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two WHERE engine_number = $1
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three WHERE engine_number = $1
                UNION ALL
                SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy WHERE engine_number = $1
            )
            SELECT 
                tt.engine_number,
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

        console.log('Executing Query for Engine No:', engineNo);
        const result = await pool.query(trackingWithWindowQuery, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No data found for this engine number'
            });
        }

        // 3. Process each station visited by this engine
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number, next_arrival_time } = row;

                // Find tools for this station using Master Dictionary + DB overrides
                const stationTools = getToolsForStation(station_number, dbStationToolMap);

                // If station has no mapped torque tools, return immediately without network call
                if (stationTools.length === 0) {
                    return [];
                }

                const date = new Date(arrival_time);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                try {
                    // Fetch station data via high-speed windowed fetch
                    const rawTorqueData = await fetchStationTorqueData(station_number, formattedDate, arrival_time, next_arrival_time);

                    if (!rawTorqueData || rawTorqueData.length === 0) {
                        return [];
                    }
                    console.log(
                        `[TORQUE] Station=${station_number} Date=${formattedDate}`
                    );
                    // Match entries for each tool using robust matching & cycle deduplication
                    const toolDataEntries = stationTools.flatMap(tool => {
                        const matchedRecords = matchToolRecords(rawTorqueData, tool, arrival_time, next_arrival_time);
                        console.log(
                            `[MATCH] Tool=${tool.tool_name} Records=${matchedRecords.length}`
                        );
                        if (matchedRecords.length > 0) {
                            return matchedRecords.map(item => ({
                                station: station_number,
                                tool_name: tool.tool_name,
                                tightening_datetime: item["Tightening date/time"] || item["Reception date/time"],
                                work_no: item["WorkNO."],
                                axis_number: item["Axis number"],
                                count: item["Count"],
                                torque: item["Torque"],
                                angle: item["Angle"],
                                number_of_pulses: parseInt(item["Number of pulses"] || "0"),
                                tightening_time: parseInt(item["Tightening time"] || "0"),
                                free_run_angle: item["Free run angle"],
                                snug_angle: item["Snug angle"],
                                torque_angle_change: item["Torque angle change"],
                                judgement: item["Judgement"]
                            }));
                        }

                        // Skip tools without data
                        return [];
                    });

                    return toolDataEntries;

                } catch (torqueErr) {
                    return [];
                }
            })
        );

        const finalData = processedData.flat();
        res.json(finalData);

    } catch (error) {
        console.error('Database error in getImpactWrenchData:', error.message);
        res.status(500).json({
            message: 'Error fetching engine tracking data',
            error: error.message
        });
    }
};

const getTorqueDataByDateRange = async (req, res) => {
    try {
        const { stationNumber } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: 'Both startDate and endDate are required as query parameters (format: YYYY-MM-DD)'
            });
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            return res.status(400).json({
                message: 'Invalid date format. Please use YYYY-MM-DD format'
            });
        }

        if (startDateObj > endDateObj) {
            return res.status(400).json({
                message: 'Start date cannot be later than end date'
            });
        }

        // 1. Fetch station tool map for specific station (with Master Map fallback)
        let dbToolMap = [];
        try {
            const toolMapQuery = `
                SELECT station, tool_name, folder 
                FROM station_tool_map
                WHERE station = $1
            `;
            const toolMapResult = await pool.query(toolMapQuery, [stationNumber]);
            dbToolMap = toolMapResult.rows || [];
        } catch (dbErr) {
            console.warn('Warning fetching station_tool_map, using Master Dictionary:', dbErr.message);
        }

        const stationTools = getToolsForStation(stationNumber, dbToolMap);

        if (stationTools.length === 0) {
            return res.status(404).json({
                message: `No tools mapped for station ${stationNumber}`
            });
        }

        // 2. Query station tracking arrivals with SQL-computed next arrival window in < 2ms
        const trackingWithWindowQuery = `
            WITH station_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking WHERE station_number::text = $1 AND arrival_time >= $2 AND arrival_time <= $3
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two WHERE station_number::text = $1 AND arrival_time >= $2 AND arrival_time <= $3
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three WHERE station_number::text = $1 AND arrival_time >= $2 AND arrival_time <= $3
                UNION ALL
                SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy WHERE station_name = $1 AND arrival_time >= $2 AND arrival_time <= $3
            )
            SELECT 
                st.engine_number,
                st.arrival_time,
                st.station_number,
                (
                    SELECT MIN(all_t.arrival_time)
                    FROM (
                        SELECT station_number::text as stn, arrival_time FROM engine_tracking WHERE station_number::text = $1 AND arrival_time > st.arrival_time
                        UNION ALL
                        SELECT station_number::text as stn, arrival_time FROM engine_tracking_two WHERE station_number::text = $1 AND arrival_time > st.arrival_time
                        UNION ALL
                        SELECT station_number::text as stn, arrival_time FROM engine_tracking_three WHERE station_number::text = $1 AND arrival_time > st.arrival_time
                        UNION ALL
                        SELECT station_name as stn, arrival_time FROM sub_assy WHERE station_name = $1 AND arrival_time > st.arrival_time
                    ) all_t
                ) AS next_arrival_time
            FROM station_tracking st
            ORDER BY st.arrival_time DESC;
        `;

        const result = await pool.query(trackingWithWindowQuery, [
            stationNumber,
            startDate + ' 00:00:00',
            endDate + ' 23:59:59'
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: `No engines found for station ${stationNumber} between ${startDate} and ${endDate}`
            });
        }

        // 3. Process each engine visit
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number, next_arrival_time } = row;

                const date = new Date(arrival_time);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                try {
                    const rawTorqueData = await fetchStationTorqueData(station_number, formattedDate, arrival_time, next_arrival_time);

                    if (!rawTorqueData || rawTorqueData.length === 0) {
                        return [];
                    }

                    const toolDataEntries = stationTools.flatMap(tool => {
                        const matchedRecords = matchToolRecords(rawTorqueData, tool, arrival_time, next_arrival_time);

                        if (matchedRecords.length > 0) {
                            return matchedRecords.map(item => ({
                                engine_number: engine_number,
                                arrival_time: arrival_time,
                                station: station_number,
                                tool_name: tool.tool_name,
                                tightening_datetime: item["Tightening date/time"] || item["Reception date/time"],
                                work_no: item["WorkNO."],
                                axis_number: item["Axis number"],
                                count: item["Count"],
                                torque: item["Torque"],
                                angle: item["Angle"],
                                number_of_pulses: parseInt(item["Number of pulses"] || "0"),
                                tightening_time: parseInt(item["Tightening time"] || "0"),
                                free_run_angle: item["Free run angle"],
                                snug_angle: item["Snug angle"],
                                torque_angle_change: item["Torque angle change"],
                                judgement: item["Judgement"]
                            }));
                        }

                        return [];
                    });

                    return toolDataEntries;

                } catch (torqueErr) {
                    return [];
                }
            })
        );

        const finalData = processedData.flat();
        res.json(finalData);

    } catch (error) {
        console.error('Database error in getTorqueDataByDateRange:', error.message);
        res.status(500).json({
            message: 'Error fetching torque data by date range',
            error: error.message
        });
    }
};

module.exports = {
    getImpactWrenchData,
    getTorqueDataByDateRange
};
