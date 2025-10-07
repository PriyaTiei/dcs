// const pool = require('../connections/postgresDB');

// // Get all station tool map records
// const getStationToolMap = async (req, res) => {
//     try {
//         const query = `
//             SELECT station, folder, tool_name 
//             FROM station_tool_map 
//             ORDER BY 
//                 CASE 
//                     WHEN station ~ '^[0-9]+$' THEN LPAD(station, 10, '0')
//                     ELSE station 
//                 END,
//                 LPAD(folder, 10, '0')
//         `;
        
//         const result = await pool.query(query);
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching station tool map:', error);
//         res.status(500).json({ 
//             message: 'Error fetching station tool map data' 
//         });
//     }
// };

// // Add new station tool map record
// const addStationToolMap = async (req, res) => {
//     try {
//         const { station, folder, tool_name } = req.body;

//         // Validation
//         if (!station || !folder || !tool_name) {
//             return res.status(400).json({ 
//                 message: 'Station, folder, and tool_name are required' 
//             });
//         }

//         // Validate station format if it's numeric
//         if (/^\d+$/.test(station)) {
//             const stationNum = parseInt(station);
//             if (stationNum < 1 || stationNum > 65) {
//                 return res.status(400).json({ 
//                     message: 'Station number must be between 001 and 065' 
//                 });
//             }
//             // Format station with leading zeros
//             const formattedStation = stationNum.toString().padStart(3, '0');
            
//             // Check if combination already exists
//             const checkQuery = `
//                 SELECT * FROM station_tool_map 
//                 WHERE station = $1 AND folder = $2
//             `;
//             const checkResult = await pool.query(checkQuery, [formattedStation, folder]);
            
//             if (checkResult.rows.length > 0) {
//                 return res.status(400).json({ 
//                     message: 'Station and folder combination already exists' 
//                 });
//             }

//             const insertQuery = `
//                 INSERT INTO station_tool_map (station, folder, tool_name) 
//                 VALUES ($1, $2, $3) 
//                 RETURNING *
//             `;
            
//             const result = await pool.query(insertQuery, [formattedStation, folder, tool_name]);
//             res.status(201).json(result.rows[0]);
//         } else {
//             // For non-numeric stations, use as-is
//             const checkQuery = `
//                 SELECT * FROM station_tool_map 
//                 WHERE station = $1 AND folder = $2
//             `;
//             const checkResult = await pool.query(checkQuery, [station, folder]);
            
//             if (checkResult.rows.length > 0) {
//                 return res.status(400).json({ 
//                     message: 'Station and folder combination already exists' 
//                 });
//             }

//             const insertQuery = `
//                 INSERT INTO station_tool_map (station, folder, tool_name) 
//                 VALUES ($1, $2, $3) 
//                 RETURNING *
//             `;
            
//             const result = await pool.query(insertQuery, [station, folder, tool_name]);
//             res.status(201).json(result.rows[0]);
//         }
//     } catch (error) {
//         console.error('Error adding station tool map:', error);
//         res.status(500).json({ 
//             message: 'Error adding station tool map record' 
//         });
//     }
// };

// // Update station tool map record
// const updateStationToolMap = async (req, res) => {
//     try {
//         const { oldStation, oldFolder } = req.params;
//         const { station, folder, tool_name } = req.body;

//         // Validation
//         if (!station || !folder || !tool_name) {
//             return res.status(400).json({ 
//                 message: 'Station, folder, and tool_name are required' 
//             });
//         }

//         // Validate station format if it's numeric
//         let formattedStation = station;
//         if (/^\d+$/.test(station)) {
//             const stationNum = parseInt(station);
//             if (stationNum < 1 || stationNum > 65) {
//                 return res.status(400).json({ 
//                     message: 'Station number must be between 001 and 065' 
//                 });
//             }
//             formattedStation = stationNum.toString().padStart(3, '0');
//         }

//         // Check if the old record exists
//         const checkOldQuery = `
//             SELECT * FROM station_tool_map 
//             WHERE station = $1 AND folder = $2
//         `;
//         const oldResult = await pool.query(checkOldQuery, [oldStation, oldFolder]);
        
//         if (oldResult.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'Record not found' 
//             });
//         }

//         // If station or folder is being changed, check if new combination already exists
//         if (formattedStation !== oldStation || folder !== oldFolder) {
//             const checkNewQuery = `
//                 SELECT * FROM station_tool_map 
//                 WHERE station = $1 AND folder = $2
//             `;
//             const newResult = await pool.query(checkNewQuery, [formattedStation, folder]);
            
//             if (newResult.rows.length > 0) {
//                 return res.status(400).json({ 
//                     message: 'New station and folder combination already exists' 
//                 });
//             }
//         }

//         const updateQuery = `
//             UPDATE station_tool_map 
//             SET station = $1, folder = $2, tool_name = $3 
//             WHERE station = $4 AND folder = $5 
//             RETURNING *
//         `;
        
//         const result = await pool.query(updateQuery, [
//             formattedStation, folder, tool_name, oldStation, oldFolder
//         ]);
        
//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'Record not found' 
//             });
//         }
        
//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error('Error updating station tool map:', error);
//         res.status(500).json({ 
//             message: 'Error updating station tool map record' 
//         });
//     }
// };

// // Delete station tool map record
// const deleteStationToolMap = async (req, res) => {
//     try {
//         const { station, folder } = req.params;
        
//         const deleteQuery = `
//             DELETE FROM station_tool_map 
//             WHERE station = $1 AND folder = $2 
//             RETURNING *
//         `;
        
//         const result = await pool.query(deleteQuery, [station, folder]);
        
//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'Record not found' 
//             });
//         }
        
//         res.json({ 
//             message: 'Record deleted successfully',
//             deletedRecord: result.rows[0]
//         });
//     } catch (error) {
//         console.error('Error deleting station tool map:', error);
//         res.status(500).json({ 
//             message: 'Error deleting station tool map record' 
//         });
//     }
// };

// module.exports = {
//     getStationToolMap,
//     addStationToolMap,
//     updateStationToolMap,
//     deleteStationToolMap
// };


const pool = require('../connections/postgresDB');

// Get all station tool map records
const getStationToolMap = async (req, res) => {
    try {
        const query = `
            SELECT station, folder, tool_name 
            FROM station_tool_map 
            ORDER BY 
                station,
                CASE 
                    WHEN folder ~ '^[0-9]+$' THEN LPAD(folder, 10, '0')
                    ELSE folder 
                END
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching station tool map:', error);
        res.status(500).json({ 
            message: 'Error fetching station tool map data' 
        });
    }
};

// Add new station tool map record
const addStationToolMap = async (req, res) => {
    try {
        const { station, folder, tool_name } = req.body;

        // Validation
        if (!station || !folder || !tool_name) {
            return res.status(400).json({ 
                message: 'Station, folder, and tool_name are required' 
            });
        }

        // Validate folder format if it's numeric
        if (/^\d+$/.test(folder)) {
            const folderNum = parseInt(folder);
            if (folderNum < 1 || folderNum > 65) {
                return res.status(400).json({ 
                    message: 'Folder number must be between 001 and 065' 
                });
            }
            // Format folder with leading zeros
            const formattedFolder = folderNum.toString().padStart(3, '0');
            
            // Check if combination already exists
            const checkQuery = `
                SELECT * FROM station_tool_map 
                WHERE station = $1 AND folder = $2
            `;
            const checkResult = await pool.query(checkQuery, [station, formattedFolder]);
            
            if (checkResult.rows.length > 0) {
                return res.status(400).json({ 
                    message: 'Station and folder combination already exists' 
                });
            }

            const insertQuery = `
                INSERT INTO station_tool_map (station, folder, tool_name) 
                VALUES ($1, $2, $3) 
                RETURNING *
            `;
            
            const result = await pool.query(insertQuery, [station, formattedFolder, tool_name]);
            res.status(201).json(result.rows[0]);
        } else {
            // For non-numeric folders, use as-is
            const checkQuery = `
                SELECT * FROM station_tool_map 
                WHERE station = $1 AND folder = $2
            `;
            const checkResult = await pool.query(checkQuery, [station, folder]);
            
            if (checkResult.rows.length > 0) {
                return res.status(400).json({ 
                    message: 'Station and folder combination already exists' 
                });
            }

            const insertQuery = `
                INSERT INTO station_tool_map (station, folder, tool_name) 
                VALUES ($1, $2, $3) 
                RETURNING *
            `;
            
            const result = await pool.query(insertQuery, [station, folder, tool_name]);
            res.status(201).json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error adding station tool map:', error);
        res.status(500).json({ 
            message: 'Error adding station tool map record' 
        });
    }
};

// Update station tool map record
const updateStationToolMap = async (req, res) => {
    try {
        const { oldStation, oldFolder } = req.params;
        const { station, folder, tool_name } = req.body;

        // Validation
        if (!station || !folder || !tool_name) {
            return res.status(400).json({ 
                message: 'Station, folder, and tool_name are required' 
            });
        }

        // Validate folder format if it's numeric
        let formattedFolder = folder;
        if (/^\d+$/.test(folder)) {
            const folderNum = parseInt(folder);
            if (folderNum < 1 || folderNum > 65) {
                return res.status(400).json({ 
                    message: 'Folder number must be between 001 and 065' 
                });
            }
            formattedFolder = folderNum.toString().padStart(3, '0');
        }

        // Check if the old record exists
        const checkOldQuery = `
            SELECT * FROM station_tool_map 
            WHERE station = $1 AND folder = $2
        `;
        const oldResult = await pool.query(checkOldQuery, [oldStation, oldFolder]);
        
        if (oldResult.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Record not found' 
            });
        }

        // If station or folder is being changed, check if new combination already exists
        if (station !== oldStation || formattedFolder !== oldFolder) {
            const checkNewQuery = `
                SELECT * FROM station_tool_map 
                WHERE station = $1 AND folder = $2
            `;
            const newResult = await pool.query(checkNewQuery, [station, formattedFolder]);
            
            if (newResult.rows.length > 0) {
                return res.status(400).json({ 
                    message: 'New station and folder combination already exists' 
                });
            }
        }

        const updateQuery = `
            UPDATE station_tool_map 
            SET station = $1, folder = $2, tool_name = $3 
            WHERE station = $4 AND folder = $5 
            RETURNING *
        `;
        
        const result = await pool.query(updateQuery, [
            station, formattedFolder, tool_name, oldStation, oldFolder
        ]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Record not found' 
            });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating station tool map:', error);
        res.status(500).json({ 
            message: 'Error updating station tool map record' 
        });
    }
};

// Delete station tool map record
const deleteStationToolMap = async (req, res) => {
    try {
        const { station, folder } = req.params;
        
        const deleteQuery = `
            DELETE FROM station_tool_map 
            WHERE station = $1 AND folder = $2 
            RETURNING *
        `;
        
        const result = await pool.query(deleteQuery, [station, folder]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Record not found' 
            });
        }
        
        res.json({ 
            message: 'Record deleted successfully',
            deletedRecord: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting station tool map:', error);
        res.status(500).json({ 
            message: 'Error deleting station tool map record' 
        });
    }
};

module.exports = {
    getStationToolMap,
    addStationToolMap,
    updateStationToolMap,
    deleteStationToolMap
};