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

        const trackingQuery = `
    WITH all_tracking AS (
        SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking
        UNION ALL
        SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two
        UNION ALL
        SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three
        UNION ALL
        SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy
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

        const minArrivalTime = result.rows[result.rows.length - 1].arrival_time;
        const maxArrivalTime = result.rows[0].arrival_time;

        const allTrackingQuery = `
            WITH all_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
                UNION ALL
                SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy WHERE arrival_time >= ($1::timestamp - INTERVAL '2 hours') AND arrival_time <= ($2::timestamp + INTERVAL '2 hours')
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

        // Track all unique stations in the tracking data
        const trackedStations = new Set(result.rows.map(row => row.station_number.toString()));

        // Process all tracking data and get torque data for each station
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number } = row;

                // Find the next engine arrival time for this station
                const currentStationData = allTrackingData.filter(
                    item => item.station_number.toString() === station_number.toString()
                );

                // Sort by arrival_time to find the next arrival after our engine
                const sortedStationData = currentStationData.sort((a, b) =>
                    new Date(a.arrival_time) - new Date(b.arrival_time)
                );

                // Find current engine's index in the sorted data
                const currentEngineIndex = sortedStationData.findIndex(
                    item => item.engine_number === engine_number &&
                        new Date(item.arrival_time).getTime() === new Date(arrival_time).getTime()
                );

                let startTime = new Date(arrival_time);
                let endTime;
                let useTimeWindow = false;

                // Check if there's a next engine at this station
                if (currentEngineIndex !== -1 && currentEngineIndex < sortedStationData.length - 1) {
                    endTime = new Date(sortedStationData[currentEngineIndex + 1].arrival_time);
                    useTimeWindow = true;
                    console.log(`Station ${station_number}: Using time window from ${startTime.toISOString()} to ${endTime.toISOString()}`);
                } else {
                    // Fallback to 72-second window
                    endTime = new Date(startTime.getTime() + 72 * 1000);
                    console.log(`Station ${station_number}: Using 72-second fallback window from ${startTime.toISOString()} to ${endTime.toISOString()}`);
                }

                // Check if arrival date is today
                const arrivalDateObj = new Date(arrival_time);
                const todayObj = new Date();
                const isToday = arrivalDateObj.getFullYear() === todayObj.getFullYear() &&
                                arrivalDateObj.getMonth() === todayObj.getMonth() &&
                                arrivalDateObj.getDate() === todayObj.getDate();

                if (isToday) {
                    console.log(`Station ${station_number}: Engine arrived today - skipping external API call.`);
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
                        judgement: "⚡ Live assembly in progress. Today's tool data will be available after shift completion or via Date Range Search."
                    }));
                }

                const date = new Date(arrival_time);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const formattedDate = `${year}${month}${day}`;

                const url = `http://10.82.126.73:8121/api/torque-data?station=${station_number}&date=${formattedDate}`;

                try {
                    const torqueResponse = await axios.get(url, { timeout: 3000 });

                    console.log('================================');
                    console.log('Engine:', engineNo);
                    console.log('Station:', station_number);
                    console.log('API URL:', url);
                    console.log('Torque data count:', torqueResponse.data?.length);
                    console.log('First record:', torqueResponse.data?.[0]);
                    console.log('================================');

                    const rawTorqueData = torqueResponse.data?.data || [];
                    console.log(`Station ${station_number}: Received ${rawTorqueData.length} raw torque records from mounted CSV files`);

                    // Find tools for this station
                    const stationTools = stationToolMap.filter(
                        tool => tool.station.toString() === station_number.toString()
                    );

                    // Create entries for tools with data
                    const toolDataEntries = stationTools.flatMap(tool => {
                        // Find matching torque data for this tool's folder
                        const toolData = rawTorqueData.filter(item =>
                            item.folder === tool.folder || 
                            item.folder === tool.folder.padStart(3, '0') ||
                            item.folder === String(parseInt(tool.folder, 10))
                        );

                        if (toolData.length > 0) {
                            // Map torque data to our desired format
                            return toolData.map(item => ({
                                station: station_number,
                                tool_name: tool.tool_name,
                                tightening_datetime: item["Tightening date/time"] || item["Reception date/time"] || null,
                                work_no: item["WorkNO."] !== undefined ? item["WorkNO."] : null,
                                axis_number: item["Axis number"] !== undefined ? item["Axis number"] : null,
                                count: item["Count"] !== undefined ? item["Count"] : null,
                                torque: item["Torque"] !== undefined ? item["Torque"] : null,
                                angle: item["Angle"] !== undefined ? item["Angle"] : null,
                                number_of_pulses: parseInt(item["Number of pulses"] || "0"),
                                tightening_time: parseInt(item["Tightening time"] || "0"),
                                free_run_angle: item["Free run angle"] !== undefined ? item["Free run angle"] : null,
                                snug_angle: item["Snug angle"] !== undefined ? item["Snug angle"] : null,
                                torque_angle_change: item["Torque angle change"] !== undefined ? item["Torque angle change"] : null,
                                judgement: item["Judgement"] !== undefined ? item["Judgement"] : null
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
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
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

        // Validate required parameters
        if (!startDate || !endDate) {
            return res.status(400).json({
                message: 'Both startDate and endDate are required as query parameters (format: YYYY-MM-DD)'
            });
        }

        // Validate date format
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

        console.log(`Fetching data for station ${stationNumber} from ${startDate} to ${endDate}`);

        // First, fetch the station tool map for the specific station
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

        // Get all engines that visited this station within the date range
        const trackingQuery = `
            WITH all_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three
                UNION ALL
                SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy
            )
            SELECT 
                engine_number,
                arrival_time,
                station_number
            FROM all_tracking
            WHERE station_number = $1
            AND arrival_time >= $2
            AND arrival_time <= $3
            ORDER BY arrival_time DESC;
        `;

        const result = await pool.query(trackingQuery, [
            stationNumber,
            startDate + ' 00:00:00',
            endDate + ' 23:59:59'
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: `No engines found for station ${stationNumber} between ${startDate} and ${endDate}`
            });
        }

        console.log(`Found ${result.rows.length} engine visits for station ${stationNumber}`);

        // Get all tracking data for the station to calculate time windows
        const allStationTrackingQuery = `
            WITH all_tracking AS (
                SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking
                UNION ALL
                SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two
                UNION ALL
                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three
                UNION ALL
                SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy
            )
            SELECT 
                engine_number,
                arrival_time,
                station_number
            FROM all_tracking
            WHERE station_number = $1
            ORDER BY arrival_time;
        `;

        const allStationTrackingResult = await pool.query(allStationTrackingQuery, [stationNumber]);
        const allStationTrackingData = allStationTrackingResult.rows;

        // Process each engine visit and get torque data
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number } = row;

                // Find the next engine arrival time for this station
                const sortedStationData = allStationTrackingData.sort((a, b) =>
                    new Date(a.arrival_time) - new Date(b.arrival_time)
                );

                // Find current engine's index in the sorted data
                const currentEngineIndex = sortedStationData.findIndex(
                    item => item.engine_number === engine_number &&
                        new Date(item.arrival_time).getTime() === new Date(arrival_time).getTime()
                );

                let startTime = new Date(arrival_time);
                let endTime;

                // Check if there's a next engine at this station
                if (currentEngineIndex !== -1 && currentEngineIndex < sortedStationData.length - 1) {
                    endTime = new Date(sortedStationData[currentEngineIndex + 1].arrival_time);
                    console.log(`Engine ${engine_number}: Using time window from ${startTime.toISOString()} to ${endTime.toISOString()}`);
                } else {
                    // Fallback to 72-second window
                    endTime = new Date(startTime.getTime() + 72 * 1000);
                    console.log(`Engine ${engine_number}: Using 72-second fallback window from ${startTime.toISOString()} to ${endTime.toISOString()}`);
                }

                const date = new Date(arrival_time);
                const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '');

                const url = `http://10.82.126.73:8121/api/torque-data?station=${station_number}&date=${formattedDate}`;

                try {
                    const torqueResponse = await axios.get(url);

                    // Filter torque data to only include rows within the calculated time window AND same date
                    const startTimeMs = startTime.getTime();
                    const endTimeMs = endTime.getTime();
                    const arrivalDate = new Date(arrival_time).toDateString();

                    const filteredTorqueData = torqueResponse.data.data.filter(item => {
                        if (!item["Reception date/time"]) return false;

                        const receptionDateTime = new Date(item["Reception date/time"]);
                        const receptionTime = receptionDateTime.getTime();
                        const receptionDate = receptionDateTime.toDateString();

                        // Check both date match AND time window
                        return receptionDate === arrivalDate &&
                            receptionTime >= startTimeMs &&
                            receptionTime <= endTimeMs;
                    });

                    console.log(`Engine ${engine_number}: Found ${filteredTorqueData.length} torque records in time window`);

                    // Create entries for tools with data
                    const toolDataEntries = stationToolMap.flatMap(tool => {
                        // Find matching torque data for this tool's folder
                        const toolData = filteredTorqueData.filter(item =>
                            item.folder === tool.folder
                        );

                        if (toolData.length > 0) {
                            // Map torque data to our desired format
                            return toolData.map(item => ({
                                engine_number: engine_number,
                                arrival_time: arrival_time,
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
                    console.warn(`Torque API error for engine ${engine_number} at station ${station_number} on ${formattedDate}:`, torqueErr.message);

                    // Even if API fails, return null entries for all tools for this engine
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

        // Flatten all results into a single array
        const finalData = processedData.flat();

        // Group data by engine number for better organization
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
        console.error('Database error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Error fetching torque data by date range and station',
            error: error.message
        });
    }
};

module.exports = {
    getImpactWrenchData, // Keep the original function
    getTorqueDataByDateRange // Add the new function
};