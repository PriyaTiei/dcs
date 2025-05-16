// // Original code by gargi

// const pool = require('../connections/postgresDB');

// const getImpactWrenchData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             WITH all_tools AS (
//                 SELECT station, tool_name, folder FROM station_tool_map
//             )
//             SELECT 
//                 at.station,
//                 at.tool_name,
//                 COALESCE(fv.tightening_datetime, sav.tightening_datetime, fv2.tightening_datetime, fv3.tightening_datetime) AS tightening_datetime,
//                 COALESCE(fv.work_no, sav.work_no, fv2.work_no, fv3.work_no) AS work_no,
//                 COALESCE(fv.axis_number, sav.axis_number, fv2.axis_number, fv3.axis_number) AS axis_number,
//                 COALESCE(fv.count, sav.count, fv2.count, fv3.count) AS count,
//                 COALESCE(fv.torque, sav.torque, fv2.torque, fv3.torque) AS torque,
//                 COALESCE(fv.angle, sav.angle, fv2.angle, fv3.angle) AS angle,
//                 COALESCE(fv.number_of_pulses, sav.number_of_pulses, fv2.number_of_pulses, fv3.number_of_pulses) AS number_of_pulses,
//                 COALESCE(fv.tightening_time, sav.tightening_time, fv2.tightening_time, fv3.tightening_time) AS tightening_time,
//                 COALESCE(fv.free_run_angle, sav.free_run_angle, fv2.free_run_angle, fv3.free_run_angle) AS free_run_angle,
//                 COALESCE(fv.snug_angle, sav.snug_angle, fv2.snug_angle, fv3.snug_angle) AS snug_angle,
//                 COALESCE(fv.torque_angle_change, sav.torque_angle_change, fv2.torque_angle_change, fv3.torque_angle_change) AS torque_angle_change,
//                 COALESCE(fv.judgement, sav.judgement, fv2.judgement, fv3.judgement) AS judgement
//             FROM all_tools at
//             LEFT JOIN sub_assy_values sav
//                 ON at.folder = sav.folder 
//                 AND CAST(at.station AS TEXT) = CAST(sav.station_number AS TEXT) 
//                 AND sav.engine_number = $1
//             LEFT JOIN final_values fv 
//                 ON at.folder = fv.folder 
//                 AND CAST(at.station AS TEXT) = CAST(fv.station_number AS TEXT) 
//                 AND fv.engine_number = $1
//             LEFT JOIN final_values_two fv2 
//                 ON at.folder = fv2.folder 
//                 AND CAST(at.station AS TEXT) = CAST(fv2.station_number AS TEXT) 
//                 AND fv2.engine_number = $1
//             LEFT JOIN final_values_three fv3 
//                 ON at.folder = fv3.folder 
//                 AND CAST(at.station AS TEXT) = CAST(fv3.station_number AS TEXT) 
//                 AND fv3.engine_number = $1
//             ORDER BY at.station;
//         `;

//         console.log('Executing Query for Engine No:', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching impact wrench data' 
//         });
//     }
// };

// module.exports = {
//     getImpactWrenchData
// };






// const pool = require('../connections/postgresDB');
// const axios = require('axios');

// const getImpactWrenchData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         // First, fetch the station tool map
//         const toolMapQuery = `
//             SELECT station, tool_name, folder 
//             FROM station_tool_map
//         `;
        
//         const toolMapResult = await pool.query(toolMapQuery);
//         const stationToolMap = toolMapResult.rows;
        
//         // Get engine tracking data
//         const trackingQuery = `
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

//         // Process all tracking data and get torque data for each
//         const processedData = await Promise.all(
//             result.rows.map(async (row) => {
//                 const { station_number, arrival_time, engine_number } = row;

//                 const date = new Date(arrival_time);
//                 const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

//                 const url = `http://10.82.126.73:8121/api/torque-data?station=${station_number}&date=${formattedDate}`;

//                 try {
//                     const torqueResponse = await axios.get(url);
                    
//                     // Filter torque data to only include rows within 72 seconds of arrival_time
//                     const arrivalTimeMs = new Date(arrival_time).getTime();
//                     const windowMs = 72 * 1000; // 72 seconds in milliseconds
                    
//                     const filteredTorqueData = torqueResponse.data.data.filter(item => {
//                         if (!item["Reception date/time"]) return false;
                        
//                         const receptionTime = new Date(item["Reception date/time"]).getTime();
//                         return Math.abs(receptionTime - arrivalTimeMs) <= windowMs;
//                     });
                    
//                     // Find tools for this station
//                     const stationTools = stationToolMap.filter(
//                         tool => tool.station.toString() === station_number.toString()
//                     );
                    
//                     // Combine the data in the required format
//                     return stationTools.map(tool => {
//                         // Find matching torque data for this tool's folder
//                         const toolData = filteredTorqueData.filter(item => 
//                             item.folder === tool.folder
//                         );
                        
//                         // If there's torque data for this tool, map it to our desired format
//                         return toolData.map(item => ({
//                             station: station_number,
//                             tool_name: tool.tool_name,
//                             tightening_datetime: item["Tightening date/time"],
//                             work_no: item["WorkNO."],
//                             axis_number: item["Axis number"],
//                             count: item["Count"],
//                             torque: item["Torque"],
//                             angle: item["Angle"],
//                             number_of_pulses: parseInt(item["Number of pulses"] || "0"),
//                             tightening_time: parseInt(item["Tightening time"] || "0"),
//                             free_run_angle: item["Free run angle"],
//                             snug_angle: item["Snug angle"],
//                             torque_angle_change: item["Torque angle change"],
//                             judgement: item["Judgement"]
//                         }));
//                     }).flat(); // Flatten the array of arrays
                    
//                 } catch (torqueErr) {
//                     console.warn(`Torque API error for station ${station_number} on ${formattedDate}:`, torqueErr.message);
//                     return []; // Return empty array if torque API fails
//                 }
//             })
//         );

//         // Flatten all results into a single array
//         const finalData = processedData.flat();
        
//         if (finalData.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No matching torque data found for this engine number' 
//             });
//         }

//         res.json(finalData);

//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching engine tracking data' 
//         });
//     }
// };

// module.exports = {
//     getImpactWrenchData
// };










const pool = require('../connections/postgresDB');
const axios = require('axios');

const getImpactWrenchData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        // First, fetch the station tool map
        const toolMapQuery = `
            SELECT station, tool_name, folder 
            FROM station_tool_map
        `;
        
        const toolMapResult = await pool.query(toolMapQuery);
        const stationToolMap = toolMapResult.rows;
        
        // Get engine tracking data
        const trackingQuery = `
            WITH all_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number FROM engine_tracking
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number FROM engine_tracking_two
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number FROM engine_tracking_three
            )
            SELECT 
                engine_number,
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

        // Track all unique stations in the tracking data
        const trackedStations = new Set(result.rows.map(row => row.station_number.toString()));
        
        // Process all tracking data and get torque data for each station
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number } = row;

                const date = new Date(arrival_time);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                const url = `http://10.82.126.73:8121/api/torque-data?station=${station_number}&date=${formattedDate}`;

                try {
                    const torqueResponse = await axios.get(url);
                    
                    // Filter torque data to only include rows within 72 seconds of arrival_time
                    const arrivalTimeMs = new Date(arrival_time).getTime();
                    const windowMs = 72 * 1000; // 72 seconds in milliseconds
                    
                    const filteredTorqueData = torqueResponse.data.data.filter(item => {
                        if (!item["Reception date/time"]) return false;
                        
                        const receptionTime = new Date(item["Reception date/time"]).getTime();
                        return Math.abs(receptionTime - arrivalTimeMs) <= windowMs;
                    });
                    
                    // Find tools for this station
                    const stationTools = stationToolMap.filter(
                        tool => tool.station.toString() === station_number.toString()
                    );
                    
                    // Create entries for tools with data
                    const toolDataEntries = stationTools.flatMap(tool => {
                        // Find matching torque data for this tool's folder
                        const toolData = filteredTorqueData.filter(item => 
                            item.folder === tool.folder
                        );
                        
                        if (toolData.length > 0) {
                            // Map torque data to our desired format
                            return toolData.map(item => ({
                                station: station_number,
                                tool_name: tool.tool_name,
                                tightening_datetime: item["Tightening date/time"],
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
                    console.warn(`Torque API error for station ${station_number} on ${formattedDate}:`, torqueErr.message);
                    
                    // Even if API fails, return null entries for all tools for this station
                    const stationTools = stationToolMap.filter(
                        tool => tool.station.toString() === station_number.toString()
                    );
                    
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
                }
            })
        );

        // Flatten all results into a single array
        const finalData = processedData.flat();
        
        // Also include tools from stations that weren't in the tracking data
        const allStations = stationToolMap.map(tool => tool.station.toString());
        const missingStations = [...new Set(allStations)].filter(
            station => !trackedStations.has(station)
        );
        
        // Add null entries for tools from missing stations
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
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching engine tracking data' 
        });
    }
};

module.exports = {
    getImpactWrenchData
};