// const pool = require('../connections/postgresDB');

// const getImpactWrenchData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             WITH merged_results AS (
//                 -- Fetch from sub_assy_values
//                 SELECT  
//                     stm.station,
//                     stm.tool_name,  
//                     sa.tightening_datetime,
//                     sa.work_no,
//                     sa.axis_number,
//                     sa.count,
//                     sa.torque,
//                     sa.angle,
//                     sa.number_of_pulses,
//                     sa.tightening_time,
//                     sa.free_run_angle,
//                     sa.snug_angle,
//                     sa.torque_angle_change,
//                     sa.judgement
//                 FROM station_tool_map stm
//                 LEFT JOIN sub_assy_values sav
//                 ON stm.folder = sa.folder
//                 AND CAST(stm.station AS TEXT) = CAST(sav.station_number AS TEXT)
//                 AND sa.engine_number = $1

//                 UNION  

//                 -- Fetch from final_values
//                 SELECT  
//                     stm.station,
//                     stm.tool_name,  
//                     fv.tightening_datetime,
//                     fv.work_no,
//                     fv.axis_number,
//                     fv.count,
//                     fv.torque,
//                     fv.angle,
//                     fv.number_of_pulses,
//                     fv.tightening_time,
//                     fv.free_run_angle,
//                     fv.snug_angle,
//                     fv.torque_angle_change,
//                     fv.judgement
//                 FROM station_tool_map stm
//                 LEFT JOIN final_values fv
//                 ON stm.folder = fv.folder
//                 AND CAST(stm.station AS TEXT) = CAST(fv.station_number AS TEXT)
//                 AND fv.engine_number = $1

//                 UNION  

//                 -- Fetch from final_values_two
//                 SELECT  
//                     stm.station,
//                     stm.tool_name,  
//                     fv2.tightening_datetime,
//                     fv2.work_no,
//                     fv2.axis_number,
//                     fv2.count,
//                     fv2.torque,
//                     fv2.angle,
//                     fv2.number_of_pulses,
//                     fv2.tightening_time,
//                     fv2.free_run_angle,
//                     fv2.snug_angle,
//                     fv2.torque_angle_change,
//                     fv2.judgement
//                 FROM station_tool_map stm
//                 LEFT JOIN final_values_two fv2
//                 ON stm.folder = fv2.folder
//                 AND CAST(stm.station AS TEXT) = CAST(fv2.station_number AS TEXT)
//                 AND fv2.engine_number = $1

//                 UNION  

//                 -- Fetch from final_values_three
//                 SELECT  
//                     stm.station,
//                     stm.tool_name,  
//                     fv3.tightening_datetime,
//                     fv3.work_no,
//                     fv3.axis_number,
//                     fv3.count,
//                     fv3.torque,
//                     fv3.angle,
//                     fv3.number_of_pulses,
//                     fv3.tightening_time,
//                     fv3.free_run_angle,
//                     fv3.snug_angle,
//                     fv3.torque_angle_change,
//                     fv3.judgement
//                 FROM station_tool_map stm
//                 LEFT JOIN final_values_three fv3
//                 ON stm.folder = fv3.folder
//                 AND CAST(stm.station AS TEXT) = CAST(fv3.station_number AS TEXT)
//                 AND fv3.engine_number = $1
//             )
//             SELECT DISTINCT 
//                 station,
//                 tool_name,
//                 tightening_datetime,
//                 work_no,
//                 axis_number,
//                 count,
//                 torque, 
//                 angle,
//                 number_of_pulses,
//                 tightening_time,
//                 free_run_angle,
//                 snug_angle,
//                 torque_angle_change,               
//                 judgement
//             FROM merged_results
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


const pool = require('../connections/postgresDB');

const getImpactWrenchData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            WITH all_tools AS (
                SELECT station, tool_name, folder FROM station_tool_map
            )
            SELECT 
                at.station,
                at.tool_name,
                COALESCE(fv.tightening_datetime, sav.tightening_datetime, fv2.tightening_datetime, fv3.tightening_datetime) AS tightening_datetime,
                COALESCE(fv.work_no, sav.work_no, fv2.work_no, fv3.work_no) AS work_no,
                COALESCE(fv.axis_number, sav.axis_number, fv2.axis_number, fv3.axis_number) AS axis_number,
                COALESCE(fv.count, sav.count, fv2.count, fv3.count) AS count,
                COALESCE(fv.torque, sav.torque, fv2.torque, fv3.torque) AS torque,
                COALESCE(fv.angle, sav.angle, fv2.angle, fv3.angle) AS angle,
                COALESCE(fv.number_of_pulses, sav.number_of_pulses, fv2.number_of_pulses, fv3.number_of_pulses) AS number_of_pulses,
                COALESCE(fv.tightening_time, sav.tightening_time, fv2.tightening_time, fv3.tightening_time) AS tightening_time,
                COALESCE(fv.free_run_angle, sav.free_run_angle, fv2.free_run_angle, fv3.free_run_angle) AS free_run_angle,
                COALESCE(fv.snug_angle, sav.snug_angle, fv2.snug_angle, fv3.snug_angle) AS snug_angle,
                COALESCE(fv.torque_angle_change, sav.torque_angle_change, fv2.torque_angle_change, fv3.torque_angle_change) AS torque_angle_change,
                COALESCE(fv.judgement, sav.judgement, fv2.judgement, fv3.judgement) AS judgement
            FROM all_tools at
            LEFT JOIN sub_assy_values sav
                ON at.folder = sav.folder 
                AND CAST(at.station AS TEXT) = CAST(sav.station_number AS TEXT) 
                AND sav.engine_number = $1
            LEFT JOIN final_values fv 
                ON at.folder = fv.folder 
                AND CAST(at.station AS TEXT) = CAST(fv.station_number AS TEXT) 
                AND fv.engine_number = $1
            LEFT JOIN final_values_two fv2 
                ON at.folder = fv2.folder 
                AND CAST(at.station AS TEXT) = CAST(fv2.station_number AS TEXT) 
                AND fv2.engine_number = $1
            LEFT JOIN final_values_three fv3 
                ON at.folder = fv3.folder 
                AND CAST(at.station AS TEXT) = CAST(fv3.station_number AS TEXT) 
                AND fv3.engine_number = $1
            ORDER BY at.station;
        `;

        console.log('Executing Query for Engine No:', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching impact wrench data' 
        });
    }
};

module.exports = {
    getImpactWrenchData
};
