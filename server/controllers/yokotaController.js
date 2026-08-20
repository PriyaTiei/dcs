// const pool = require('../connections/postgresDB');
// const axios = require('axios');

// const getYokotaData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         // Get engine tracking data for the searched engine
//         const trackingQuery = `
//             WITH all_tracking AS (
//                 SELECT 'engine_tracking' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking
//                 UNION ALL
//                 SELECT 'engine_tracking_two' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking_two
//                 UNION ALL
//                 SELECT 'engine_tracking_three' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking_three
//             )
//             SELECT 
//                 engine_number,
//                 arrival_time_str,
//                 arrival_time,
//                 station_number
//             FROM all_tracking
//             WHERE engine_number = $1
//             ORDER BY arrival_time DESC;
//         `;

//         console.log('Executing Query for Engine No:', engineNo);

//         const result = await pool.query(trackingQuery, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No data found for this engine number' 
//             });
//         }

//         // Get all tracking data for time window calculation
//         const allTrackingQuery = `
//             WITH all_tracking AS (
//                 SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number FROM engine_tracking
//                 UNION ALL
//                 SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number FROM engine_tracking_two
//                 UNION ALL
//                 SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number FROM engine_tracking_three
//             )
//             SELECT 
//                 engine_number,
//                 arrival_time,
//                 station_number
//             FROM all_tracking
//             ORDER BY station_number, arrival_time;
//         `;

//         const allTrackingResult = await pool.query(allTrackingQuery);
//         const allTrackingData = allTrackingResult.rows;

//         // Process all tracking data and get Yokota data for each station
//         const processedData = await Promise.all(
//             result.rows.map(async (row) => {
//                 const { station_number, arrival_time, arrival_time_str, engine_number } = row;
                
//                 console.log(`Raw arrival time from DB: ${arrival_time_str}`);

//                 // Find the next engine arrival time for this station
//                 const currentStationData = allTrackingData.filter(
//                     item => item.station_number.toString() === station_number.toString()
//                 );
                
//                 // Sort by arrival_time to find the next arrival after our engine
//                 const sortedStationData = currentStationData.sort((a, b) => 
//                     new Date(a.arrival_time) - new Date(b.arrival_time)
//                 );
                
//                 // Find current engine's index in the sorted data
//                 const currentEngineIndex = sortedStationData.findIndex(
//                     item => item.engine_number === engine_number && 
//                            new Date(item.arrival_time).getTime() === new Date(arrival_time).getTime()
//                 );
                
//                 // Both DB and Yokota data are in IST, so no timezone conversion needed
//                 let startTime = new Date(arrival_time);
//                 let endTime;
//                 let useTimeWindow = false;
                
//                 // Check if there's a next engine at this station
//                 if (currentEngineIndex !== -1 && currentEngineIndex < sortedStationData.length - 1) {
//                     endTime = new Date(sortedStationData[currentEngineIndex + 1].arrival_time);
//                     useTimeWindow = true;
//                     console.log(`Station ${station_number}: Using time window from ${startTime.toISOString()} to ${endTime.toISOString()} (IST)`);
//                 } else {
//                     // Fallback to 72-second window
//                     endTime = new Date(startTime.getTime() + 72 * 1000);
//                     console.log(`Station ${station_number}: Using 72-second fallback window from ${startTime.toISOString()} to ${endTime.toISOString()} (IST)`);
//                 }
                
//                 console.log(`Station ${station_number}: Time window from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}`);

//                 // Format arrival time for API - use the string version from database
//                 const url = `http://10.82.126.73:8127/api/station/${station_number}/date/${arrival_time_str}`;
                
//                 console.log(`API URL: ${url}`);

//                 try {
//                     const yokotaResponse = await axios.get(url);
                    
//                     // Filter Yokota data to only include rows within the calculated time window
//                     const startTimeMs = startTime.getTime();
//                     const endTimeMs = endTime.getTime();
//                     const arrivalDate = startTime.toDateString(); // Get the date for comparison
                    
//                     console.log(`Filtering for date: ${arrivalDate}, time window: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`);
                    
//                     const filteredYokotaData = yokotaResponse.data.data.filter(item => {
//                         if (!item["timeDate"]) {
//                             console.log('Missing timeDate for item:', item);
//                             return false;
//                         }
                        
//                         try {
//                             // Parse timeDate format "05/30 05:35:40" with current year
//                             const currentYear = new Date().getFullYear();
//                             const timeDateParts = item["timeDate"].split(' ');
                            
//                             if (timeDateParts.length !== 2) {
//                                 console.log('Invalid timeDate format:', item["timeDate"]);
//                                 return false;
//                             }
                            
//                             const [monthDay, time] = timeDateParts;
//                             const monthDayParts = monthDay.split('/');
                            
//                             if (monthDayParts.length !== 2) {
//                                 console.log('Invalid monthDay format:', monthDay);
//                                 return false;
//                             }
                            
//                             const [month, day] = monthDayParts;
                            
//                             // Check if month and day are valid
//                             if (!month || !day) {
//                                 console.log('Missing month or day:', { month, day, original: item["timeDate"] });
//                                 return false;
//                             }
                            
//                             // Ensure month and day are numeric
//                             if (isNaN(parseInt(month)) || isNaN(parseInt(day))) {
//                                 console.log('Non-numeric month or day:', { month, day, original: item["timeDate"] });
//                                 return false;
//                             }
                            
//                             // Construct datetime (both DB and Yokota data are in IST)
//                             const dateTimeStr = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${time}`;
//                             const recordDateTime = new Date(dateTimeStr);
                            
//                             // Check if the parsed date is valid
//                             if (isNaN(recordDateTime.getTime())) {
//                                 console.log('Invalid parsed date:', dateTimeStr, 'from original:', item["timeDate"]);
//                                 return false;
//                             }
                            
//                             const recordTime = recordDateTime.getTime();
//                             const recordDate = recordDateTime.toDateString();
                            
//                             // Check both date match AND time window
//                             const isWithinWindow = recordDate === arrivalDate && 
//                                                   recordTime >= startTimeMs && 
//                                                   recordTime <= endTimeMs;
                            
//                             if (isWithinWindow) {
//                                 console.log(`✓ Found matching record: ${item["timeDate"]} -> ${dateTimeStr} (within window)`);
//                             } else {
//                                 // Optional: log why it didn't match (comment out if too verbose)
//                                 if (recordDate === arrivalDate) {
//                                     console.log(`✗ Record ${item["timeDate"]} on correct date but outside time window: ${new Date(recordTime).toLocaleTimeString()} not in ${startTime.toLocaleTimeString()}-${endTime.toLocaleTimeString()}`);
//                                 }
//                             }
                            
//                             return isWithinWindow;
                            
//                         } catch (parseError) {
//                             console.error('Error parsing timeDate:', item["timeDate"], 'Error:', parseError.message);
//                             return false;
//                         }
//                     });
                    
//                     console.log(`Station ${station_number}: Found ${filteredYokotaData.length} Yokota records in time window out of ${yokotaResponse.data.data.length} total records`);
                    
//                     // Map all filtered Yokota data and add engine number
//                     return filteredYokotaData.map(item => ({
//                         engine_number: engine_number,
//                         station: station_number,
//                         folder: item.folder,
//                         program: item.program,
//                         unknownValue1: item.unknownValue1,
//                         torqueDuplicate: item.torqueDuplicate,
//                         unknownValue2: item.unknownValue2,
//                         unknownValue3: item.unknownValue3,
//                         unknownValue4: item.unknownValue4,
//                         unknownValue5: item.unknownValue5,
//                         torque: item.torque,
//                         judgement: item.judgement,
//                         timeDate: item.timeDate
//                     }));
                    
//                 } catch (yokotaErr) {
//                     console.warn(`Yokota API error for station ${station_number} at ${arrival_time_str}:`, yokotaErr.message);
//                     console.warn(`Full error:`, yokotaErr.response?.data || yokotaErr.message);
                    
//                     // Return empty array if API fails
//                     return [];
//                 }
//             })
//         );

//         // Flatten all results into a single array
//         const finalData = processedData.flat();

//         res.json(finalData);

//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching engine tracking data' 
//         });
//     }
// };

// module.exports = {
//     getYokotaData
// };



const pool = require('../connections/postgresDB');
const axios = require('axios');

const getYokotaData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        // Get engine tracking data for the searched engine
        const trackingQuery = `
            WITH all_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking_two
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time::text as arrival_time_str, arrival_time, station_number FROM engine_tracking_three
            )
            SELECT 
                engine_number,
                arrival_time_str,
                arrival_time,
                station_number
            FROM all_tracking
            WHERE engine_number = $1
            ORDER BY arrival_time DESC;
        `;

        console.log('Executing Query for Engine No:', engineNo);

        const result = await pool.query(trackingQuery, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No data found for this engine number' 
            });
        }

        const minArrivalTime = result.rows[result.rows.length - 1].arrival_time;
        const maxArrivalTime = result.rows[0].arrival_time;

        // Get all tracking data for time window calculation
        const allTrackingQuery = `
            WITH all_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number FROM engine_tracking WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number FROM engine_tracking_two WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number FROM engine_tracking_three WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
            )
            SELECT 
                engine_number,
                arrival_time,
                station_number
            FROM all_tracking
            ORDER BY station_number, arrival_time;
        `;

        const allTrackingResult = await pool.query(allTrackingQuery, [minArrivalTime, maxArrivalTime]);
        const allTrackingData = allTrackingResult.rows;

        // Define stations that should return null if no data found
        const criticalStations = [61, 60, 58, 20, 21];
        
        // Define tool names mapping
        const toolNameMapping = {
            61: "EGR PIPE TIGHTENING",
            60: "EGR VALVE TIGHTENING", 
            58: "INTAKE MANIFOLD",
            20: "VVT BOLT TIGHTENING",
            21: "WATER INLET HOUSING"
        };

        // Process all tracking data and get Yokota data for each station
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, arrival_time_str, engine_number } = row;

                // Support both UTC and local IST timezone offsets (+5:30)
                const startTime = new Date(arrival_time);
                const utcTimeMs = startTime.getTime();
                const istOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 mins
                const istTimeMs = utcTimeMs + istOffsetMs;

                // 15-minute window for station stay matching
                const windowMs = 15 * 60 * 1000;
                const bufferMs = 5 * 60 * 1000;

                // Check if arrival date is today
                const arrivalDateObj = new Date(arrival_time);
                const todayObj = new Date();
                const isToday =
                    arrivalDateObj.getFullYear() === todayObj.getFullYear() &&
                    arrivalDateObj.getMonth() === todayObj.getMonth() &&
                    arrivalDateObj.getDate() === todayObj.getDate();

                if (isToday) {
                    return [{
                        engine_number,
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
                        judgement: "⚡ Live assembly in progress. Today's tool data will be available after shift completion or via Date Range Search.",
                        timeDate: null,
                        tool_name: toolNameMapping[station_number] || null
                    }];
                }

                // Format date parameter as YYYY-MM-DD for Yokota API
                const dateOnly = arrival_time_str ? arrival_time_str.split(' ')[0] : new Date(arrival_time).toISOString().split('T')[0];
                const url = `http://10.82.126.73:8127/api/station/${station_number}/date/${dateOnly}`;
                console.log(`Station ${station_number} Yokota URL:`, url);

                try {
                    const yokotaResponse = await axios.get(url, { timeout: 5000 });
                    const apiData = yokotaResponse?.data?.data || [];

                    const filteredYokotaData = apiData.filter(item => {
                        if (!item || !item.timeDate) return false;

                        try {
                            const timeDateStr = item.timeDate.trim();
                            let recordDateTime;

                            // Format: 2025-05-30 05:35:40
                            if (timeDateStr.includes('-')) {
                                recordDateTime = new Date(timeDateStr.replace(' ', 'T'));
                            } else {
                                // Format: 05/30 05:35:40
                                const split = timeDateStr.split(' ');
                                if (split.length !== 2) return false;

                                const [monthDay, time] = split;
                                const md = monthDay.split('/');
                                if (md.length !== 2) return false;

                                const year = startTime.getFullYear();
                                const month = md[0].padStart(2, '0');
                                const day = md[1].padStart(2, '0');
                                recordDateTime = new Date(`${year}-${month}-${day}T${time}`);
                            }

                            if (!recordDateTime || isNaN(recordDateTime.getTime())) return false;

                            const recordTime = recordDateTime.getTime();
                            
                            // Match against UTC window or IST local time window
                            const matchesUtc = recordTime >= (utcTimeMs - bufferMs) && recordTime <= (utcTimeMs + windowMs);
                            const matchesIst = recordTime >= (istTimeMs - bufferMs) && recordTime <= (istTimeMs + windowMs);
                            const isMatch = matchesUtc || matchesIst;

                            if (isMatch) {
                                console.log(`MATCH: ${item.timeDate} -> Torque ${item.torque}`);
                            }

                            return isMatch;
                        } catch (err) {
                            console.error("Date Parse Error:", item.timeDate, err.message);
                            return false;
                        }
                    });

                    console.log(`Station ${station_number}: ${filteredYokotaData.length} records matched out of ${apiData.length}`);

                    // If critical station and no record found
                    if (filteredYokotaData.length === 0 && criticalStations.includes(parseInt(station_number))) {
                        return [{
                            engine_number,
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
                    }

                    return filteredYokotaData.map(item => ({
                        engine_number,
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
                    console.error(`Station ${station_number}`, yokotaErr.message);

                    if (criticalStations.includes(parseInt(station_number))) {
                        return [{
                            engine_number,
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
                    }

                    return [];
                }
            })
        );

        // Flatten all results into a single array
        const finalData = processedData.flat();

        res.json(finalData);

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching engine tracking data' 
        });
    }
};

module.exports = {
    getYokotaData
};