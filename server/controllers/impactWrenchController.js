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
// Avoids duplicate HTTP requests across consecutive engine searches
const dcsTorqueApiCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute
const MAX_CACHE_ENTRIES = 200;

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
    // If next_arrival_time is known, engine leaves around next_arrival_time.
    // Otherwise, default cycle duration is 90 seconds.
    let cycleEndMs;
    if (nextArrivalTime) {
        const nextTime = new Date(nextArrivalTime).getTime();
        // Cap single-station window to at most 180s to prevent grabbing far-future engines
        cycleEndMs = Math.min(nextTime + 10000, startTime.getTime() + 180000);
    } else {
        cycleEndMs = startTime.getTime() + 90000;
    }

    const cycleStartMs = startTime.getTime() - 20000; // 20s pre-arrival buffer for RFID scan jitter

    // 1. Filter by folder match first
    const folderMatches = rawTorqueData.filter(item => isFolderMatch(item.folder, tool.folder));
    if (folderMatches.length === 0) return [];

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

    if (windowMatches.length === 0) return [];

    // 3. Deduplicate / isolate target engine's tightening sequence
    // Sort chronologically
    windowMatches.sort((a, b) => {
        const timeA = (parseTorqueTimestamp(a["Tightening date/time"]) || parseTorqueTimestamp(a["Reception date/time"]) || new Date(0)).getTime();
        const timeB = (parseTorqueTimestamp(b["Tightening date/time"]) || parseTorqueTimestamp(b["Reception date/time"]) || new Date(0)).getTime();
        return timeA - timeB;
    });

    // Group into clusters where items in a cluster are within 35s of each other (multi-bolt tightening)
    const clusters = [];
    let currentCluster = [];

    for (let i = 0; i < windowMatches.length; i++) {
        const item = windowMatches[i];
        const itemTime = (parseTorqueTimestamp(item["Tightening date/time"]) || parseTorqueTimestamp(item["Reception date/time"]) || new Date(0)).getTime();

        if (currentCluster.length === 0) {
            currentCluster.push({ item, itemTime });
        } else {
            const lastTime = currentCluster[currentCluster.length - 1].itemTime;
            if (itemTime - lastTime <= 35000) {
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

    return bestCluster.map(c => c.item);
}

async function fetchStationTorqueData(stationNumber, formattedDate) {
    const cacheKey = `${stationNumber}_${formattedDate}`;
    const cached = dcsTorqueApiCache.get(cacheKey);

    if (cached && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
        return cached.data;
    }

    const url = `http://10.82.126.73:8121/api/torque-data?station=${stationNumber}&date=${formattedDate}`;
    try {
        const torqueResponse = await torqueClient.get(url);
        const data = (torqueResponse.status === 404 || !torqueResponse.data || !Array.isArray(torqueResponse.data.data))
            ? []
            : torqueResponse.data.data;

        if (dcsTorqueApiCache.size > MAX_CACHE_ENTRIES) {
            const oldestKey = dcsTorqueApiCache.keys().next().value;
            dcsTorqueApiCache.delete(oldestKey);
        }

        dcsTorqueApiCache.set(cacheKey, {
            cachedAt: Date.now(),
            data: data
        });

        return data;
    } catch (err) {
        return [];
    }
}

const getImpactWrenchData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        // 1. Fetch station tool map
        const toolMapQuery = `
            SELECT station, tool_name, folder 
            FROM station_tool_map
        `;
        const toolMapResult = await pool.query(toolMapQuery);
        const stationToolMap = toolMapResult.rows;

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

        // Track unique stations visited by this engine
        const trackedStations = new Set(result.rows.map(row => row.station_number.toString()));

        // 3. Process each station visited by this engine
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number, next_arrival_time } = row;

                // Find tools for this station
                const stationTools = stationToolMap.filter(
                    tool => tool.station.toString() === station_number.toString()
                );

                // Helper to create null tool entries when no data or no tools
                const createNullEntries = () => {
                    if (stationTools.length === 0) return [];
                    return stationTools.map(tool => ({
                        station: station_number,
                        tool_name: tool.tool_name,
                        tightening_datetime: null,
                        work_no: null,
                        axis_number: null,
                        count: null,
                        torque: null,
                        angle: null,
                        number_of_pulses: null,
                        tightening_time: null,
                        free_run_angle: null,
                        snug_angle: null,
                        torque_angle_change: null,
                        judgement: null
                    }));
                };

                // If station has no mapped torque tools, return immediately without network call
                if (stationTools.length === 0) {
                    return [];
                }

                const date = new Date(arrival_time);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                try {
                    // Fetch station data via cached/deduplicated fetch
                    const rawTorqueData = await fetchStationTorqueData(station_number, formattedDate);

                    if (!rawTorqueData || rawTorqueData.length === 0) {
                        return createNullEntries();
                    }

                    // Match entries for each tool using robust matching & cycle deduplication
                    const toolDataEntries = stationTools.flatMap(tool => {
                        const matchedRecords = matchToolRecords(rawTorqueData, tool, arrival_time, next_arrival_time);

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

                        // For tools without data, return null entry
                        return [{
                            station: station_number,
                            tool_name: tool.tool_name,
                            tightening_datetime: null,
                            work_no: null,
                            axis_number: null,
                            count: null,
                            torque: null,
                            angle: null,
                            number_of_pulses: null,
                            tightening_time: null,
                            free_run_angle: null,
                            snug_angle: null,
                            torque_angle_change: null,
                            judgement: null
                        }];
                    });

                    return toolDataEntries;

                } catch (torqueErr) {
                    return createNullEntries();
                }
            })
        );

        const finalData = processedData.flat();

        // Include tools from stations in stationToolMap that weren't visited in tracking data
        const allStations = stationToolMap.map(tool => tool.station.toString());
        const missingStations = [...new Set(allStations)].filter(
            station => !trackedStations.has(station)
        );

        missingStations.forEach(station => {
            const stationTools = stationToolMap.filter(
                tool => tool.station.toString() === station
            );

            stationTools.forEach(tool => {
                finalData.push({
                    station: station,
                    tool_name: tool.tool_name,
                    tightening_datetime: null,
                    work_no: null,
                    axis_number: null,
                    count: null,
                    torque: null,
                    angle: null,
                    number_of_pulses: null,
                    tightening_time: null,
                    free_run_angle: null,
                    snug_angle: null,
                    torque_angle_change: null,
                    judgement: null
                });
            });
        });

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

        // 1. Fetch station tool map for specific station
        const toolMapQuery = `
            SELECT station, tool_name, folder 
            FROM station_tool_map
            WHERE station = $1
        `;
        const toolMapResult = await pool.query(toolMapQuery, [stationNumber]);
        const stationToolMap = toolMapResult.rows;

        if (stationToolMap.length === 0) {
            return res.status(404).json({
                message: `No tools found for station ${stationNumber}`
            });
        }

        // 2. Query engine visits with next-arrival window directly in SQL
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
                const url = `http://10.82.126.73:8121/api/torque-data?station=${station_number}&date=${formattedDate}`;

                try {
                    const torqueResponse = await torqueClient.get(url);

                    if (torqueResponse.status === 404 || !torqueResponse.data || !Array.isArray(torqueResponse.data.data)) {
                        return stationToolMap.map(tool => ({
                            engine_number: engine_number,
                            arrival_time: arrival_time,
                            station: station_number,
                            tool_name: tool.tool_name,
                            tightening_datetime: null,
                            work_no: null,
                            axis_number: null,
                            count: null,
                            torque: null,
                            angle: null,
                            number_of_pulses: null,
                            tightening_time: null,
                            free_run_angle: null,
                            snug_angle: null,
                            torque_angle_change: null,
                            judgement: null
                        }));
                    }

                    const rawTorqueData = torqueResponse.data.data;

                    const toolDataEntries = stationToolMap.flatMap(tool => {
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

                        return [{
                            engine_number: engine_number,
                            arrival_time: arrival_time,
                            station: station_number,
                            tool_name: tool.tool_name,
                            tightening_datetime: null,
                            work_no: null,
                            axis_number: null,
                            count: null,
                            torque: null,
                            angle: null,
                            number_of_pulses: null,
                            tightening_time: null,
                            free_run_angle: null,
                            snug_angle: null,
                            torque_angle_change: null,
                            judgement: null
                        }];
                    });

                    return toolDataEntries;

                } catch (torqueErr) {
                    return stationToolMap.map(tool => ({
                        engine_number: engine_number,
                        arrival_time: arrival_time,
                        station: station_number,
                        tool_name: tool.tool_name,
                        tightening_datetime: null,
                        work_no: null,
                        axis_number: null,
                        count: null,
                        torque: null,
                        angle: null,
                        number_of_pulses: null,
                        tightening_time: null,
                        free_run_angle: null,
                        snug_angle: null,
                        torque_angle_change: null,
                        judgement: null
                    }));
                }
            })
        );

        const finalData = processedData.flat();

        const groupedData = finalData.reduce((acc, item) => {
            if (!acc[item.engine_number]) {
                acc[item.engine_number] = {
                    engine_number: item.engine_number,
                    arrival_time: item.arrival_time,
                    station: item.station,
                    tools: []
                };
            }

            acc[item.engine_number].tools.push({
                tool_name: item.tool_name,
                tightening_datetime: item.tightening_datetime,
                work_no: item.work_no,
                axis_number: item.axis_number,
                count: item.count,
                torque: item.torque,
                angle: item.angle,
                number_of_pulses: item.number_of_pulses,
                tightening_time: item.tightening_time,
                free_run_angle: item.free_run_angle,
                snug_angle: item.snug_angle,
                torque_angle_change: item.torque_angle_change,
                judgement: item.judgement
            });

            return acc;
        }, {});

        const response = {
            station_number: stationNumber,
            date_range: {
                start_date: startDate,
                end_date: endDate
            },
            total_engines: Object.keys(groupedData).length,
            engines: Object.values(groupedData)
        };

        res.json(response);

    } catch (error) {
        console.error('Database error in getTorqueDataByDateRange:', error.message);
        res.status(500).json({
            message: 'Error fetching torque data by date range and station',
            error: error.message
        });
    }
};

module.exports = {
    getImpactWrenchData,
    getTorqueDataByDateRange
};