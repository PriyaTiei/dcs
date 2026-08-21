const pool = require('../connections/postgresDB');
const axios = require('axios');
const http = require('http');

// Resilient HTTP Keep-Alive Agent for Yokota API communication
const httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: 20,
    maxFreeSockets: 5,
    timeout: 5000
});

const yokotaClient = axios.create({
    httpAgent,
    timeout: 3000, // 3-second hard timeout
    validateStatus: (status) => status < 500 // Do not throw on 404s
});

// In-Memory Fast Cache for Station Yokota API Data (60-second TTL)
const dcsYokotaApiCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute
const MAX_CACHE_ENTRIES = 100;

async function fetchYokotaStationData(stationNumber, arrivalTimeStr) {
    const cacheKey = `${stationNumber}_${arrivalTimeStr}`;
    const cached = dcsYokotaApiCache.get(cacheKey);

    if (cached && (Date.now() - cached.cachedAt < CACHE_TTL_MS)) {
        return cached.data;
    }

    const url = `http://10.82.126.73:8127/api/station/${stationNumber}/date/${arrivalTimeStr}`;
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

// Critical stations supported by Yokota API
const criticalStations = [61, 60, 58, 20, 21];

const toolNameMapping = {
    61: "EGR PIPE TIGHTENING",
    60: "EGR VALVE TIGHTENING", 
    58: "INTAKE MANIFOLD",
    20: "VVT BOLT TIGHTENING",
    21: "WATER INLET HOUSING"
};

const getYokotaData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        // Query target engine tracking arrivals with SQL-computed next arrival window in < 2ms
        const trackingWithWindowQuery = `
            WITH target_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking WHERE engine_number = $1
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking_two WHERE engine_number = $1
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking_three WHERE engine_number = $1
            )
            SELECT 
                tt.engine_number,
                tt.arrival_time_str,
                tt.arrival_time,
                tt.station_number,
                (
                    SELECT MIN(all_t.arrival_time)
                    FROM (
                        SELECT station_number, arrival_time FROM engine_tracking WHERE station_number = tt.station_number AND arrival_time > tt.arrival_time
                        UNION ALL
                        SELECT station_number, arrival_time FROM engine_tracking_two WHERE station_number = tt.station_number AND arrival_time > tt.arrival_time
                        UNION ALL
                        SELECT station_number, arrival_time FROM engine_tracking_three WHERE station_number = tt.station_number AND arrival_time > tt.arrival_time
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

        // Process each station visit for this engine
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, arrival_time_str, engine_number, next_arrival_time } = row;
                const stationNum = parseInt(station_number);
                const isCritical = criticalStations.includes(stationNum);

                // Helper to return null entry for critical stations
                const createNullEntry = () => [{
                    engine_number: engine_number,
                    station: station_number,
                    folder: null,
                    program: null,
                    unknownValue1: null,
                    torqueDuplicate: null,
                    unknownValue2: null,
                    unknownValue3: null,
                    unknownValue4: null,
                    unknownValue5: null,
                    torque: null,
                    judgement: null,
                    timeDate: null,
                    tool_name: toolNameMapping[station_number] || null
                }];

                // If station is not a Yokota station, return empty (will be filtered out)
                if (!isCritical) {
                    return [];
                }

                const startTime = new Date(arrival_time);
                let endTime;

                if (next_arrival_time) {
                    endTime = new Date(next_arrival_time);
                } else {
                    endTime = new Date(startTime.getTime() + 72 * 1000);
                }

                try {
                    const rawYokotaData = await fetchYokotaStationData(station_number, arrival_time_str);

                    if (!rawYokotaData || rawYokotaData.length === 0) {
                        return createNullEntry();
                    }

                    const startTimeMs = startTime.getTime();
                    const endTimeMs = endTime.getTime();
                    const arrivalDate = startTime.toDateString();

                    const filteredYokotaData = rawYokotaData.filter(item => {
                        if (!item["timeDate"]) return false;

                        try {
                            const currentYear = new Date().getFullYear();
                            const timeDateParts = item["timeDate"].split(' ');
                            if (timeDateParts.length !== 2) return false;

                            const [monthDay, time] = timeDateParts;
                            const monthDayParts = monthDay.split('/');
                            if (monthDayParts.length !== 2) return false;

                            const [month, day] = monthDayParts;
                            if (!month || !day || isNaN(parseInt(month)) || isNaN(parseInt(day))) return false;

                            const dateTimeStr = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
                            const recordDateTime = new Date(dateTimeStr);
                            if (isNaN(recordDateTime.getTime())) return false;

                            const recordTime = recordDateTime.getTime();
                            const recordDate = recordDateTime.toDateString();

                            return recordDate === arrivalDate && 
                                   recordTime >= startTimeMs && 
                                   recordTime <= endTimeMs;
                        } catch {
                            return false;
                        }
                    });

                    if (filteredYokotaData.length === 0) {
                        return isCritical ? createNullEntry() : [];
                    }

                    return filteredYokotaData.map(item => ({
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
                        tool_name: toolNameMapping[station_number] || null
                    }));

                } catch (yokotaErr) {
                    return isCritical ? createNullEntry() : [];
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