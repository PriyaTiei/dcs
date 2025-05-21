// const pool = require('../connections/postgresDB');



// const getIgCoil_ChainCoverData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT ig_coil_sl_no, time_of_scan
//             FROM ig_coil_chain_cover
//             WHERE engine_number = $1
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
//             message: 'Error fetching data' 
//         });
//     }
// };


// const getConnectingRodData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT connecting_rod_sl_no, time_of_scan
//             FROM connectingrod
//             WHERE engine_number = $1
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
//             message: 'Error fetching data' 
//         });
//     }
// };






// const getChainCoverData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT chain_cover_sl_no, engine_number, scan_time
//             FROM public.chain_cover
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Chain Cover Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No chain cover data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching chain case data' 
//         });
//     }
// };


// // Controller for fetching chain case data
// const getChainCaseData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.chaincase_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Chain Case Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No chain case data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching chain case data' 
//         });
//     }
// };

// // Controller for fetching fuel delivery pipe data
// const getFuelDeliveryPipeData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.fueldeliverypipe_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Fuel Delivery Pipe Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No fuel delivery pipe data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching fuel delivery pipe data' 
//         });
//     }
// };

// // Controller for fetching PCV data
// const getPCVData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.pcv_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for PCV Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No pcv data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching pcv data' 
//         });
//     }
// };

// // Controller for fetching wire harness data
// const getWireHarnessData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.wireharness_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Wire Harness Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No wire harness data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching wire harness data' 
//         });
//     }
// };

// const getCamHousingData = async (req, res) => {
//     try {
//         const { camhousingSN } = req.params;

//         // Query to get camhousing_exhaust and camhousing_intake
//         const query = `
//             SELECT cam_shaft_intake_sl_no, cam_shaft_exhaust_sl_no
//             FROM camshaft_rfid
//             WHERE cam_housing_sl_no = $1
//         `;

//         console.log('Executing Query for CamHousing Data (CamHousing SN):', camhousingSN);

//         const result = await pool.query(query, [camhousingSN]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No CamHousing data found for this CamHousing S/N'
//             });
//         }

//         res.json(result.rows[0]); // Return the first row (latest record)
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching CamHousing data'
//         });
//     }
// };


// const getPortInjectorData = async (req, res) => {
//     try {
//         const { headSN } = req.params;

//         // Query to get port_injector_sl_no and time_of_scan
//         const query = `
//             SELECT port_injector_sl_no, time_of_scan
//             FROM port_injector
//             WHERE head_sl_no = $1
//         `;

//         console.log('Executing Query for Port Injector Data (Head S/N):', headSN);

//         const result = await pool.query(query, [headSN]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No Port Injector data found for this Head S/N'
//             });
//         }

//         res.json(result.rows[0]); // Return the first row (latest record)
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching Port Injector data'
//         });
//     }
// };




// module.exports = { 
//     getIgCoil_ChainCoverData, 
//     getChainCaseData, 
//     getFuelDeliveryPipeData,
//     getPCVData,
//     getWireHarnessData,
//     getCamHousingData, 
//     getChainCoverData,
//     getConnectingRodData,
//     getPortInjectorData,
// };






// const pool = require('../connections/postgresDB');

// const fs = require('fs');
// const path = require('path');


// const getIgCoil_ChainCoverData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT ig_coil_sl_no, time_of_scan
//             FROM ig_coil_chain_cover
//             WHERE engine_number = $1
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
//             message: 'Error fetching data' 
//         });
//     }
// };


// const getConnectingRodData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT connecting_rod_sl_no, time_of_scan
//             FROM connectingrod
//             WHERE engine_number = $1
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
//             message: 'Error fetching data' 
//         });
//     }
// };






// const getChainCoverData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT chain_cover_sl_no, engine_number, scan_time
//             FROM public.chain_cover
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Chain Cover Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No chain cover data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching chain case data' 
//         });
//     }
// };


// // Controller for fetching chain case data
// const getChainCaseData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.chaincase_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Chain Case Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No chain case data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching chain case data' 
//         });
//     }
// };

// // Controller for fetching fuel delivery pipe data
// const getFuelDeliveryPipeData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.fueldeliverypipe_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Fuel Delivery Pipe Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No fuel delivery pipe data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching fuel delivery pipe data' 
//         });
//     }
// };

// // Controller for fetching PCV data
// const getPCVData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.pcv_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for PCV Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No pcv data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching pcv data' 
//         });
//     }
// };

// // Controller for fetching wire harness data
// const getWireHarnessData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT part_number, engine_number, scan_time
//             FROM public.wireharness_final
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Wire Harness Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No wire harness data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching wire harness data' 
//         });
//     }
// };

// const getCamHousingData = async (req, res) => {
//     try {
//         const { camhousingSN } = req.params;

//         // Query to get camhousing_exhaust and camhousing_intake
//         const query = `
//             SELECT cam_shaft_intake_sl_no, cam_shaft_exhaust_sl_no
//             FROM camshaft_rfid
//             WHERE cam_housing_sl_no = $1
//         `;

//         console.log('Executing Query for CamHousing Data (CamHousing SN):', camhousingSN);

//         const result = await pool.query(query, [camhousingSN]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No CamHousing data found for this CamHousing S/N'
//             });
//         }

//         res.json(result.rows[0]); // Return the first row (latest record)
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching CamHousing data'
//         });
//     }
// };


// const getPortInjectorData = async (req, res) => {
//     try {
//         const { headSN } = req.params;

//         // Query to get port_injector_sl_no and time_of_scan
//         const query = `
//             SELECT port_injector_sl_no, time_of_scan
//             FROM port_injector
//             WHERE head_sl_no = $1
//         `;

//         console.log('Executing Query for Port Injector Data (Head S/N):', headSN);

//         const result = await pool.query(query, [headSN]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No Port Injector data found for this Head S/N'
//             });
//         }

//         res.json(result.rows[0]); // Return the first row (latest record)
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching Port Injector data'
//         });
//     }
// };

// const getChainCaseImageByEngineNumber = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         // Query to get arrival_time where engine_number matches and station_number is 17
//         const query = `
//             SELECT arrival_time
//             FROM engine_tracking
//             WHERE engine_number = $1 AND station_number = 17
//             ORDER BY arrival_time DESC
//             LIMIT 1
//         `;
        
//         console.log('Executing Query to find chaincase image for Engine No:', engineNo);
        
//         const result = await pool.query(query, [engineNo]);
        
//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No chaincase record found for this engine number at station 17'
//             });
//         }
        
//         // Get arrival time from result
//         const arrivalTime = result.rows[0].arrival_time;
//         console.log('Found arrival time:', arrivalTime);
        
//         // Format date parts for folder structure (YYYY_MM_DD_0)
//         const year = arrivalTime.getFullYear();
//         const month = String(arrivalTime.getMonth() + 1).padStart(2, '0');
//         const day = String(arrivalTime.getDate()).padStart(2, '0');
//         const folderDateFormat = `${year}_${month}_${day}_0`;
        
//         console.log('Folder date format:', folderDateFormat);
        
//         // Format time parts for file name matching (HH_MM_SS)
//         const hours = String(arrivalTime.getHours()).padStart(2, '0');
//         const minutes = String(arrivalTime.getMinutes()).padStart(2, '0');
//         const seconds = String(arrivalTime.getSeconds()).padStart(2, '0');
        
//         // IMPORTANT: Use Linux path format for accessing Windows shares
//         // The Windows share must be mounted on the Linux system
        
//         // Option 1: If the share is already mounted as a CIFS mount on your Ubuntu server
//         // Example: mounted at /mnt/windowsshareimages
//         const baseSharePath = '/mnt/windowsshareimages';
//         const specificPath = `${baseSharePath}/casecover/${folderDateFormat}`;
        
//         // Option 2: If using direct SMB access via a library like samba-client
//         // This would require additional NPM packages
        
//         console.log('Looking for images in path:', specificPath);
        
//         // Target time string for filename matching
//         const targetTimeString = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
        
//         try {
//             // First check if the directory exists
//             if (!fs.existsSync(specificPath)) {
//                 console.error(`Directory does not exist: ${specificPath}`);
//                 return res.status(404).json({
//                     message: 'Directory not found',
//                     path: specificPath,
//                     suggestion: 'The Windows share may not be properly mounted on the Ubuntu server.'
//                 });
//             }
            
//             // List all files in the directory
//             const files = fs.readdirSync(specificPath);
//             console.log(`Found ${files.length} files in directory`);
            
//             // Filter for image files
//             const imageFiles = files.filter(file => {
//                 return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg');
//             });
            
//             console.log(`Found ${imageFiles.length} image files`);
            
//             if (imageFiles.length === 0) {
//                 return res.status(404).json({
//                     message: 'No image files found in the target directory'
//                 });
//             }
            
//             // Find exact match first
//             let matchedFile = imageFiles.find(file => file.includes(targetTimeString));
//             console.log(`Exact match found: ${matchedFile ? 'Yes' : 'No'}`);
            
//             // If no exact match, find the closest file by timestamp
//             if (!matchedFile) {
//                 console.log('Looking for closest match by timestamp');
//                 const targetTime = new Date(arrivalTime).getTime();
                
//                 let closestFile = null;
//                 let smallestDiff = Infinity;
                
//                 for (const file of imageFiles) {
//                     try {
//                         // Extract timestamp from filename like "NG2025_04_07_07_51_04.jpg"
//                         const fileNameParts = file.split('.');
//                         const baseName = fileNameParts[0];
//                         const timeStr = baseName.replace(/^NG/, '');
                        
//                         console.log(`Processing file: ${file}, Time string: ${timeStr}`);
                        
//                         // Parse the file timestamp
//                         const [fileYear, fileMonth, fileDay, fileHour, fileMin, fileSec] = timeStr.split('_');
                        
//                         if (!fileYear || !fileMonth || !fileDay || !fileHour || !fileMin || !fileSec) {
//                             console.log(`Skipping file with invalid format: ${file}`);
//                             continue;
//                         }
                        
//                         const fileDate = new Date(
//                             parseInt(fileYear),
//                             parseInt(fileMonth) - 1,
//                             parseInt(fileDay),
//                             parseInt(fileHour),
//                             parseInt(fileMin),
//                             parseInt(fileSec)
//                         );
                        
//                         if (isNaN(fileDate.getTime())) {
//                             console.log(`Invalid date from file: ${file}`);
//                             continue;
//                         }
                        
//                         const fileTime = fileDate.getTime();
//                         const diff = Math.abs(fileTime - targetTime);
                        
//                         console.log(`File: ${file}, Time diff: ${diff}`);
                        
//                         if (diff < smallestDiff) {
//                             smallestDiff = diff;
//                             closestFile = file;
//                             console.log(`New closest file: ${file}, diff: ${diff}`);
//                         }
//                     } catch (parseError) {
//                         console.error(`Error parsing file: ${file}`, parseError);
//                     }
//                 }
                
//                 matchedFile = closestFile;
//             }
            
//             if (!matchedFile) {
//                 return res.status(404).json({
//                     message: 'Could not find a matching image file'
//                 });
//             }
            
//             console.log(`Selected file: ${matchedFile}`);
            
//             // Construct full path to the image - use path.join for proper path formatting
//             const imagePath = path.join(specificPath, matchedFile);
//             console.log(`Full image path: ${imagePath}`);
            
            




//             res.sendFile(imagePath, {
//                 headers: {
//                   'Content-Type': 'image/jpeg' // or 'image/png' depending on your files
//                 }
//               }, (err) => {
//                 if (err) {
//                   console.error('Error sending file:', err);
//                   res.status(500).json({ message: 'Error sending image file' });
//                 }
//               });
              
            
            
//         } catch (error) {
//             console.error('File system error:', error);
//             res.status(500).json({
//                 message: 'Error accessing the image directory',
//                 error: error.message,
//                 path: specificPath
//             });
//         }
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching chaincase image data',
//             error: error.message
//         });
//     }
// };


// module.exports = { 
//     getIgCoil_ChainCoverData, 
//     getChainCaseData, 
//     getFuelDeliveryPipeData,
//     getPCVData,
//     getWireHarnessData,
//     getCamHousingData, 
//     getChainCoverData,
//     getConnectingRodData,
//     getPortInjectorData,
//     getChainCaseImageByEngineNumber,
// };





// const pool = require('../connections/postgresDB');
// const fs = require('fs');
// const path = require('path');

// // Function to find the closest matching part based on arrival time
// const findClosestPartMatch = async (engineNo, trackingTable, stationNumber, partTable, timeWindowSeconds = 40) => {
//     try {
//         // Step 1: Find arrival time from tracking table
//         const trackingQuery = `
//             SELECT arrival_time
//             FROM ${trackingTable}
//             WHERE engine_number = $1 AND station_number = $2
//             ORDER BY arrival_time DESC
//             LIMIT 1
//         `;
        
//         console.log(`Looking for engine ${engineNo} at station ${stationNumber} in ${trackingTable}`);
//         const trackingResult = await pool.query(trackingQuery, [engineNo, stationNumber]);
        
//         if (trackingResult.rows.length === 0) {
//             return { 
//                 found: false, 
//                 message: `No tracking data found for engine ${engineNo} at station ${stationNumber}` 
//             };
//         }
        
//         const arrivalTime = trackingResult.rows[0].arrival_time;
//         console.log(`Found arrival time: ${arrivalTime}`);
        
//         // Step 2: Find closest part record within the time window
//         const partQuery = `
//             SELECT part_number, scan_time, 
//                    ABS(EXTRACT(EPOCH FROM (scan_time - $1))) as time_diff
//             FROM ${partTable}
//             WHERE ABS(EXTRACT(EPOCH FROM (scan_time - $1))) <= $2
//             ORDER BY time_diff ASC
//             LIMIT 1
//         `;
        
//         console.log(`Looking for closest part in ${partTable} around time ${arrivalTime}`);
//         const partResult = await pool.query(partQuery, [arrivalTime, timeWindowSeconds]);
        
//         if (partResult.rows.length === 0) {
//             return { 
//                 found: false, 
//                 message: `No part found within ${timeWindowSeconds} seconds of arrival time` 
//             };
//         }
        
//         console.log(`Found matching part: ${partResult.rows[0].part_number}`);
//         return {
//             found: true,
//             data: partResult.rows[0]
//         };
        
//     } catch (error) {
//         console.error('Error in findClosestPartMatch:', error);
//         return { 
//             found: false, 
//             message: `Database error: ${error.message}` 
//         };
//     }
// };

// // Controller for fetching chain case data with improved time-based matching
// const getChainCaseData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         const result = await findClosestPartMatch(
//             engineNo,
//             'engine_tracking',   // tracking table
//             17,                  // station number
//             'chaincase',         // part table
//             40                   // time window in seconds
//         );
        
//         if (!result.found) {
//             return res.status(404).json({ message: result.message });
//         }
        
//         res.json([{
//             part_number: result.data.part_number,
//             engine_number: engineNo,
//             scan_time: result.data.scan_time
//         }]);
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching chain case data',
//             error: error.message
//         });
//     }
// };

// // Controller for fetching fuel delivery pipe data
// const getFuelDeliveryPipeData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         const result = await findClosestPartMatch(
//             engineNo,
//             'engine_tracking_three',  // tracking table
//             55,                       // station number
//             'fueldeliverypipe',       // part table
//             40                        // time window in seconds
//         );
        
//         if (!result.found) {
//             return res.status(404).json({ message: result.message });
//         }
        
//         res.json([{
//             part_number: result.data.part_number,
//             engine_number: engineNo,
//             scan_time: result.data.scan_time
//         }]);
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching fuel delivery pipe data',
//             error: error.message
//         });
//     }
// };

// // Controller for fetching PCV data
// const getPCVData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         const result = await findClosestPartMatch(
//             engineNo,
//             'engine_tracking_three',  // tracking table
//             51,                       // station number
//             'pcv',                    // part table
//             40                        // time window in seconds
//         );
        
//         if (!result.found) {
//             return res.status(404).json({ message: result.message });
//         }
        
//         res.json([{
//             part_number: result.data.part_number,
//             engine_number: engineNo,
//             scan_time: result.data.scan_time
//         }]);
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching PCV data',
//             error: error.message
//         });
//     }
// };

// // Controller for fetching wire harness data
// const getWireHarnessData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         const result = await findClosestPartMatch(
//             engineNo,
//             'engine_tracking_three',  // tracking table
//             53,                       // station number
//             'wireharness',            // part table
//             40                        // time window in seconds
//         );
        
//         if (!result.found) {
//             return res.status(404).json({ message: result.message });
//         }
        
//         res.json([{
//             part_number: result.data.part_number,
//             engine_number: engineNo,
//             scan_time: result.data.scan_time
//         }]);
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching wire harness data',
//             error: error.message
//         });
//     }
// };

// // Keep existing functions
// const getIgCoil_ChainCoverData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT ig_coil_sl_no, time_of_scan
//             FROM ig_coil_chain_cover
//             WHERE engine_number = $1
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
//             message: 'Error fetching data' 
//         });
//     }
// };

// const getConnectingRodData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT connecting_rod_sl_no, time_of_scan
//             FROM connectingrod
//             WHERE engine_number = $1
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
//             message: 'Error fetching data' 
//         });
//     }
// };

// const getChainCoverData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;

//         const query = `
//             SELECT chain_cover_sl_no, engine_number, scan_time
//             FROM public.chain_cover
//             WHERE engine_number = $1
//             ORDER BY scan_time DESC
//         `;

//         console.log('Executing Query for Chain Cover Data (Engine No):', engineNo);

//         const result = await pool.query(query, [engineNo]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ 
//                 message: 'No chain cover data found for this engine number' 
//             });
//         }

//         res.json(result.rows);
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching chain case data' 
//         });
//     }
// };

// const getCamHousingData = async (req, res) => {
//     try {
//         const { camhousingSN } = req.params;

//         // Query to get camhousing_exhaust and camhousing_intake
//         const query = `
//             SELECT cam_shaft_intake_sl_no, cam_shaft_exhaust_sl_no
//             FROM camshaft_rfid
//             WHERE cam_housing_sl_no = $1
//         `;

//         console.log('Executing Query for CamHousing Data (CamHousing SN):', camhousingSN);

//         const result = await pool.query(query, [camhousingSN]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No CamHousing data found for this CamHousing S/N'
//             });
//         }

//         res.json(result.rows[0]); // Return the first row (latest record)
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching CamHousing data'
//         });
//     }
// };

// const getPortInjectorData = async (req, res) => {
//     try {
//         const { headSN } = req.params;

//         // Query to get port_injector_sl_no and time_of_scan
//         const query = `
//             SELECT port_injector_sl_no, time_of_scan
//             FROM port_injector
//             WHERE head_sl_no = $1
//         `;

//         console.log('Executing Query for Port Injector Data (Head S/N):', headSN);

//         const result = await pool.query(query, [headSN]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No Port Injector data found for this Head S/N'
//             });
//         }

//         res.json(result.rows[0]); // Return the first row (latest record)
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching Port Injector data'
//         });
//     }
// };

// const getChainCaseImageByEngineNumber = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         // Query to get arrival_time where engine_number matches and station_number is 17
//         const query = `
//             SELECT arrival_time
//             FROM engine_tracking
//             WHERE engine_number = $1 AND station_number = 17
//             ORDER BY arrival_time DESC
//             LIMIT 1
//         `;
        
//         console.log('Executing Query to find chaincase image for Engine No:', engineNo);
        
//         const result = await pool.query(query, [engineNo]);
        
//         if (result.rows.length === 0) {
//             return res.status(404).json({
//                 message: 'No chaincase record found for this engine number at station 17'
//             });
//         }
        
//         // Get arrival time from result
//         const arrivalTime = result.rows[0].arrival_time;
//         console.log('Found arrival time:', arrivalTime);
        
//         // Format date parts for folder structure (YYYY_MM_DD_0)
//         const year = arrivalTime.getFullYear();
//         const month = String(arrivalTime.getMonth() + 1).padStart(2, '0');
//         const day = String(arrivalTime.getDate()).padStart(2, '0');
//         const folderDateFormat = `${year}_${month}_${day}_0`;
        
//         console.log('Folder date format:', folderDateFormat);
        
//         // Format time parts for file name matching (HH_MM_SS)
//         const hours = String(arrivalTime.getHours()).padStart(2, '0');
//         const minutes = String(arrivalTime.getMinutes()).padStart(2, '0');
//         const seconds = String(arrivalTime.getSeconds()).padStart(2, '0');
        
//         // IMPORTANT: Use Linux path format for accessing Windows shares
//         // The Windows share must be mounted on the Linux system
        
//         // Option 1: If the share is already mounted as a CIFS mount on your Ubuntu server
//         // Example: mounted at /mnt/windowsshareimages
//         const baseSharePath = '/mnt/windowsshareimages';
//         const specificPath = `${baseSharePath}/casecover/${folderDateFormat}`;
        
//         // Option 2: If using direct SMB access via a library like samba-client
//         // This would require additional NPM packages
        
//         console.log('Looking for images in path:', specificPath);
        
//         // Target time string for filename matching
//         const targetTimeString = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
        
//         try {
//             // First check if the directory exists
//             if (!fs.existsSync(specificPath)) {
//                 console.error(`Directory does not exist: ${specificPath}`);
//                 return res.status(404).json({
//                     message: 'Directory not found',
//                     path: specificPath,
//                     suggestion: 'The Windows share may not be properly mounted on the Ubuntu server.'
//                 });
//             }
            
//             // List all files in the directory
//             const files = fs.readdirSync(specificPath);
//             console.log(`Found ${files.length} files in directory`);
            
//             // Filter for image files
//             const imageFiles = files.filter(file => {
//                 return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg');
//             });
            
//             console.log(`Found ${imageFiles.length} image files`);
            
//             if (imageFiles.length === 0) {
//                 return res.status(404).json({
//                     message: 'No image files found in the target directory'
//                 });
//             }
            
//             // Find exact match first
//             let matchedFile = imageFiles.find(file => file.includes(targetTimeString));
//             console.log(`Exact match found: ${matchedFile ? 'Yes' : 'No'}`);
            
//             // If no exact match, find the closest file by timestamp
//             if (!matchedFile) {
//                 console.log('Looking for closest match by timestamp');
//                 const targetTime = new Date(arrivalTime).getTime();
                
//                 let closestFile = null;
//                 let smallestDiff = Infinity;
                
//                 for (const file of imageFiles) {
//                     try {
//                         // Extract timestamp from filename like "NG2025_04_07_07_51_04.jpg"
//                         const fileNameParts = file.split('.');
//                         const baseName = fileNameParts[0];
//                         const timeStr = baseName.replace(/^NG/, '');
                        
//                         console.log(`Processing file: ${file}, Time string: ${timeStr}`);
                        
//                         // Parse the file timestamp
//                         const [fileYear, fileMonth, fileDay, fileHour, fileMin, fileSec] = timeStr.split('_');
                        
//                         if (!fileYear || !fileMonth || !fileDay || !fileHour || !fileMin || !fileSec) {
//                             console.log(`Skipping file with invalid format: ${file}`);
//                             continue;
//                         }
                        
//                         const fileDate = new Date(
//                             parseInt(fileYear),
//                             parseInt(fileMonth) - 1,
//                             parseInt(fileDay),
//                             parseInt(fileHour),
//                             parseInt(fileMin),
//                             parseInt(fileSec)
//                         );
                        
//                         if (isNaN(fileDate.getTime())) {
//                             console.log(`Invalid date from file: ${file}`);
//                             continue;
//                         }
                        
//                         const fileTime = fileDate.getTime();
//                         const diff = Math.abs(fileTime - targetTime);
                        
//                         console.log(`File: ${file}, Time diff: ${diff}`);
                        
//                         if (diff < smallestDiff) {
//                             smallestDiff = diff;
//                             closestFile = file;
//                             console.log(`New closest file: ${file}, diff: ${diff}`);
//                         }
//                     } catch (parseError) {
//                         console.error(`Error parsing file: ${file}`, parseError);
//                     }
//                 }
                
//                 matchedFile = closestFile;
//             }
            
//             if (!matchedFile) {
//                 return res.status(404).json({
//                     message: 'Could not find a matching image file'
//                 });
//             }
            
//             console.log(`Selected file: ${matchedFile}`);
            
//             // Construct full path to the image - use path.join for proper path formatting
//             const imagePath = path.join(specificPath, matchedFile);
//             console.log(`Full image path: ${imagePath}`);
            
//             res.sendFile(imagePath, {
//                 headers: {
//                   'Content-Type': 'image/jpeg' // or 'image/png' depending on your files
//                 }
//               }, (err) => {
//                 if (err) {
//                   console.error('Error sending file:', err);
//                   res.status(500).json({ message: 'Error sending image file' });
//                 }
//               });
              
//         } catch (error) {
//             console.error('File system error:', error);
//             res.status(500).json({
//                 message: 'Error accessing the image directory',
//                 error: error.message,
//                 path: specificPath
//             });
//         }
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({
//             message: 'Error fetching chaincase image data',
//             error: error.message
//         });
//     }
// };

// module.exports = { 
//     getIgCoil_ChainCoverData, 
//     getChainCaseData, 
//     getFuelDeliveryPipeData,
//     getPCVData,
//     getWireHarnessData,
//     getCamHousingData, 
//     getChainCoverData,
//     getConnectingRodData,
//     getPortInjectorData,
//     getChainCaseImageByEngineNumber,
// };




const pool = require('../connections/postgresDB');
const fs = require('fs');
const path = require('path');

const findClosestPartMatch = async (engineNo, trackingTable, stationNumber, partTable, timeWindowSeconds = 40) => {
    try {
        // Step 1: Find arrival time from tracking table for our engine
        const trackingQuery = `
            SELECT arrival_time
            FROM ${trackingTable}
            WHERE engine_number = $1 AND station_number = $2
            ORDER BY arrival_time DESC
            LIMIT 1
        `;
        
        console.log(`[findClosestPartMatch] Looking for engine ${engineNo} at station ${stationNumber} in ${trackingTable}`);
        const trackingResult = await pool.query(trackingQuery, [engineNo, stationNumber]);
        
        if (trackingResult.rows.length === 0) {
            return { 
                found: false, 
                message: `No tracking data found for engine ${engineNo} at station ${stationNumber}` 
            };
        }
        
        const arrivalTime = trackingResult.rows[0].arrival_time;
        console.log(`[findClosestPartMatch] Found arrival time: ${arrivalTime}`);
        
        // Step 2: Find the next engine's arrival time at the same station
        const nextEngineQuery = `
            SELECT engine_number, arrival_time
            FROM ${trackingTable}
            WHERE station_number = $1 AND arrival_time > $2
            ORDER BY arrival_time ASC
            LIMIT 1
        `;
        
        console.log(`[findClosestPartMatch] Looking for next engine at station ${stationNumber} after ${arrivalTime}`);
        const nextEngineResult = await pool.query(nextEngineQuery, [stationNumber, arrivalTime]);
        
        let endTime;
        let timeWindow;
        let nextEngineInfo = '';
        
        if (nextEngineResult.rows.length > 0) {
            // Use the next engine's arrival time as the end boundary
            endTime = nextEngineResult.rows[0].arrival_time;
            nextEngineInfo = `${nextEngineResult.rows[0].engine_number}`;
            console.log(`[findClosestPartMatch] Found next engine ${nextEngineInfo} with arrival time: ${endTime}`);
            
            // Calculate the time difference in seconds for logging
            timeWindow = (new Date(endTime) - new Date(arrivalTime)) / 1000;
            console.log(`[findClosestPartMatch] Using dynamic time window of ${timeWindow} seconds between engines`);
        } else {
            // Fall back to the default time window if no next engine is found
            const fallbackEndTime = new Date(arrivalTime);
            fallbackEndTime.setSeconds(fallbackEndTime.getSeconds() + timeWindowSeconds);
            endTime = fallbackEndTime;
            timeWindow = timeWindowSeconds;
            console.log(`[findClosestPartMatch] No next engine found. Using default time window of ${timeWindowSeconds} seconds`);
        }
        
        // Check if the time window is too small (same start and end time)
        // Add a minimum 5-second buffer if needed
        if (new Date(endTime).getTime() <= new Date(arrivalTime).getTime()) {
            console.log(`[findClosestPartMatch] Warning: Zero or negative time window detected. Adding minimum buffer.`);
            endTime = new Date(arrivalTime);
            endTime.setSeconds(endTime.getSeconds() + 5); // Add minimum 5 seconds
            timeWindow = 5;
            console.log(`[findClosestPartMatch] Adjusted time window to ${timeWindow} seconds`);
        }
        
        // Step 3: Find ALL part records that fall within the time window
        const partQuery = `
            SELECT part_number, scan_time
            FROM ${partTable}
            WHERE scan_time BETWEEN $1 AND $2
            ORDER BY scan_time ASC
        `;
        
        console.log(`[findClosestPartMatch] Searching for parts between ${arrivalTime} and ${endTime}`);
        const partResult = await pool.query(partQuery, [arrivalTime, endTime]);
        
        if (partResult.rows.length === 0) {
            // Try with an extended window as a fallback
            const extendedEndTime = new Date(arrivalTime);
            extendedEndTime.setSeconds(extendedEndTime.getSeconds() + timeWindowSeconds * 2);
            
            console.log(`[findClosestPartMatch] No parts found. Trying with extended window to ${extendedEndTime}`);
            const extendedResult = await pool.query(partQuery, [arrivalTime, extendedEndTime]);
            
            if (extendedResult.rows.length === 0) {
                return { 
                    found: false, 
                    message: `No parts found within the time window (${arrivalTime} to ${endTime})` 
                };
            }
            
            console.log(`[findClosestPartMatch] Found ${extendedResult.rows.length} parts in extended window`);
            return {
                found: true,
                data: extendedResult.rows
            };
        }
        
        console.log(`[findClosestPartMatch] Found ${partResult.rows.length} matching parts between ${arrivalTime} and ${endTime}`);
        // Log each part found for debugging
        partResult.rows.forEach((part, index) => {
            console.log(`[findClosestPartMatch] Part ${index+1}: ${part.part_number}, Scan time: ${part.scan_time}`);
        });
        
        return {
            found: true,
            data: partResult.rows
        };
        
    } catch (error) {
        console.error('[findClosestPartMatch] Error:', error);
        return { 
            found: false, 
            message: `Database error: ${error.message}` 
        };
    }
};
// Controller for fetching chain case data with improved time-based matching
const getChainCaseData = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        const result = await findClosestPartMatch(
            engineNo,
            'engine_tracking',   // tracking table
            17,                  // station number
            'chaincase',         // part table
            40                   // fallback time window in seconds
        );
        
        if (!result.found) {
            return res.status(404).json({ message: result.message });
        }
        
        // FIXED: Return all parts found within the time window
        const response = result.data.map(part => ({
            part_number: part.part_number,
            engine_number: engineNo,
            scan_time: part.scan_time
        }));
        
        res.json(response);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching chain case data',
            error: error.message
        });
    }
};

// Controller for fetching fuel delivery pipe data
const getFuelDeliveryPipeData = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        const result = await findClosestPartMatch(
            engineNo,
            'engine_tracking_three',  // tracking table
            55,                       // station number
            'fueldeliverypipe',       // part table
            40                        // fallback time window in seconds
        );
        
        if (!result.found) {
            return res.status(404).json({ message: result.message });
        }
        
        // FIXED: Return all parts found within the time window
        const response = result.data.map(part => ({
            part_number: part.part_number,
            engine_number: engineNo,
            scan_time: part.scan_time
        }));
        
        res.json(response);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching fuel delivery pipe data',
            error: error.message
        });
    }
};

// Controller for fetching PCV data
const getPCVData = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        const result = await findClosestPartMatch(
            engineNo,
            'engine_tracking_three',  // tracking table
            51,                       // station number
            'pcv',                    // part table
            40                        // fallback time window in seconds
        );
        
        if (!result.found) {
            return res.status(404).json({ message: result.message });
        }
        
        // FIXED: Return all parts found within the time window
        const response = result.data.map(part => ({
            part_number: part.part_number,
            engine_number: engineNo,
            scan_time: part.scan_time
        }));
        
        res.json(response);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching PCV data',
            error: error.message
        });
    }
};

// Controller for fetching wire harness data
const getWireHarnessData = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        const result = await findClosestPartMatch(
            engineNo,
            'engine_tracking_three',  // tracking table
            53,                       // station number
            'wireharness',            // part table
            40                        // fallback time window in seconds
        );
        
        if (!result.found) {
            return res.status(404).json({ message: result.message });
        }
        
        // FIXED: Return all parts found within the time window
        const response = result.data.map(part => ({
            part_number: part.part_number,
            engine_number: engineNo,
            scan_time: part.scan_time
        }));
        
        res.json(response);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching wire harness data',
            error: error.message
        });
    }
};

// Keep existing functions
const getIgCoil_ChainCoverData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT ig_coil_sl_no, time_of_scan
            FROM ig_coil_chain_cover
            WHERE engine_number = $1
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
            message: 'Error fetching data' 
        });
    }
};

const getConnectingRodData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT connecting_rod_sl_no, time_of_scan
            FROM connectingrod
            WHERE engine_number = $1
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
            message: 'Error fetching data' 
        });
    }
};

const getChainCoverData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT chain_cover_sl_no, engine_number, scan_time
            FROM public.chain_cover
            WHERE engine_number = $1
            ORDER BY scan_time DESC
        `;

        console.log('Executing Query for Chain Cover Data (Engine No):', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No chain cover data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching chain case data' 
        });
    }
};

const getCamHousingData = async (req, res) => {
    try {
        const { camhousingSN } = req.params;

        // Query to get camhousing_exhaust and camhousing_intake
        const query = `
            SELECT cam_shaft_intake_sl_no, cam_shaft_exhaust_sl_no
            FROM camshaft_rfid
            WHERE cam_housing_sl_no = $1
        `;

        console.log('Executing Query for CamHousing Data (CamHousing SN):', camhousingSN);

        const result = await pool.query(query, [camhousingSN]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No CamHousing data found for this CamHousing S/N'
            });
        }

        res.json(result.rows[0]); // Return the first row (latest record)
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Error fetching CamHousing data'
        });
    }
};

const getPortInjectorData = async (req, res) => {
    try {
        const { headSN } = req.params;

        // Query to get port_injector_sl_no and time_of_scan
        const query = `
            SELECT port_injector_sl_no, time_of_scan
            FROM port_injector
            WHERE head_sl_no = $1
        `;

        console.log('Executing Query for Port Injector Data (Head S/N):', headSN);

        const result = await pool.query(query, [headSN]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No Port Injector data found for this Head S/N'
            });
        }

        res.json(result.rows[0]); // Return the first row (latest record)
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Error fetching Port Injector data'
        });
    }
};

const getChainCaseImageByEngineNumber = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        // Query to get arrival_time where engine_number matches and station_number is 17
        const query = `
            SELECT arrival_time
            FROM engine_tracking
            WHERE engine_number = $1 AND station_number = 17
            ORDER BY arrival_time DESC
            LIMIT 1
        `;
        
        console.log('Executing Query to find chaincase image for Engine No:', engineNo);
        
        const result = await pool.query(query, [engineNo]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No chaincase record found for this engine number at station 17'
            });
        }
        
        // Get arrival time from result
        const arrivalTime = result.rows[0].arrival_time;
        console.log('Found arrival time:', arrivalTime);
        
        // Format date parts for folder structure (YYYY_MM_DD_0)
        const year = arrivalTime.getFullYear();
        const month = String(arrivalTime.getMonth() + 1).padStart(2, '0');
        const day = String(arrivalTime.getDate()).padStart(2, '0');
        const folderDateFormat = `${year}_${month}_${day}_0`;
        
        console.log('Folder date format:', folderDateFormat);
        
        // Format time parts for file name matching (HH_MM_SS)
        const hours = String(arrivalTime.getHours()).padStart(2, '0');
        const minutes = String(arrivalTime.getMinutes()).padStart(2, '0');
        const seconds = String(arrivalTime.getSeconds()).padStart(2, '0');
        
        // IMPORTANT: Use Linux path format for accessing Windows shares
        // The Windows share must be mounted on the Linux system
        
        // Option 1: If the share is already mounted as a CIFS mount on your Ubuntu server
        // Example: mounted at /mnt/windowsshareimages
        const baseSharePath = '/mnt/windowsshareimages';
        const specificPath = `${baseSharePath}/casecover/${folderDateFormat}`;
        
        // Option 2: If using direct SMB access via a library like samba-client
        // This would require additional NPM packages
        
        console.log('Looking for images in path:', specificPath);
        
        // Target time string for filename matching
        const targetTimeString = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
        
        try {
            // First check if the directory exists
            if (!fs.existsSync(specificPath)) {
                console.error(`Directory does not exist: ${specificPath}`);
                return res.status(404).json({
                    message: 'Directory not found',
                    path: specificPath,
                    suggestion: 'The Windows share may not be properly mounted on the Ubuntu server.'
                });
            }
            
            // List all files in the directory
            const files = fs.readdirSync(specificPath);
            console.log(`Found ${files.length} files in directory`);
            
            // Filter for image files
            const imageFiles = files.filter(file => {
                return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg');
            });
            
            console.log(`Found ${imageFiles.length} image files`);
            
            if (imageFiles.length === 0) {
                return res.status(404).json({
                    message: 'No image files found in the target directory'
                });
            }
            
            // Find exact match first
            let matchedFile = imageFiles.find(file => file.includes(targetTimeString));
            console.log(`Exact match found: ${matchedFile ? 'Yes' : 'No'}`);
            
            // If no exact match, find the closest file by timestamp
            if (!matchedFile) {
                console.log('Looking for closest match by timestamp');
                const targetTime = new Date(arrivalTime).getTime();
                
                let closestFile = null;
                let smallestDiff = Infinity;
                
                for (const file of imageFiles) {
                    try {
                        // Extract timestamp from filename like "NG2025_04_07_07_51_04.jpg"
                        const fileNameParts = file.split('.');
                        const baseName = fileNameParts[0];
                        const timeStr = baseName.replace(/^NG/, '');
                        
                        console.log(`Processing file: ${file}, Time string: ${timeStr}`);
                        
                        // Parse the file timestamp
                        const [fileYear, fileMonth, fileDay, fileHour, fileMin, fileSec] = timeStr.split('_');
                        
                        if (!fileYear || !fileMonth || !fileDay || !fileHour || !fileMin || !fileSec) {
                            console.log(`Skipping file with invalid format: ${file}`);
                            continue;
                        }
                        
                        const fileDate = new Date(
                            parseInt(fileYear),
                            parseInt(fileMonth) - 1,
                            parseInt(fileDay),
                            parseInt(fileHour),
                            parseInt(fileMin),
                            parseInt(fileSec)
                        );
                        
                        if (isNaN(fileDate.getTime())) {
                            console.log(`Invalid date from file: ${file}`);
                            continue;
                        }
                        
                        const fileTime = fileDate.getTime();
                        const diff = Math.abs(fileTime - targetTime);
                        
                        console.log(`File: ${file}, Time diff: ${diff}`);
                        
                        if (diff < smallestDiff) {
                            smallestDiff = diff;
                            closestFile = file;
                            console.log(`New closest file: ${file}, diff: ${diff}`);
                        }
                    } catch (parseError) {
                        console.error(`Error parsing file: ${file}`, parseError);
                    }
                }
                
                matchedFile = closestFile;
            }
            
            if (!matchedFile) {
                return res.status(404).json({
                    message: 'Could not find a matching image file'
                });
            }
            
            console.log(`Selected file: ${matchedFile}`);
            
            // Construct full path to the image - use path.join for proper path formatting
            const imagePath = path.join(specificPath, matchedFile);
            console.log(`Full image path: ${imagePath}`);
            
            res.sendFile(imagePath, {
                headers: {
                  'Content-Type': 'image/jpeg' // or 'image/png' depending on your files
                }
              }, (err) => {
                if (err) {
                  console.error('Error sending file:', err);
                  res.status(500).json({ message: 'Error sending image file' });
                }
              });
              
        } catch (error) {
            console.error('File system error:', error);
            res.status(500).json({
                message: 'Error accessing the image directory',
                error: error.message,
                path: specificPath
            });
        }
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            message: 'Error fetching chaincase image data',
            error: error.message
        });
    }
};


const getIGCoilImagesByEngineNumber = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        console.log('Searching for IG Coil images for Engine No:', engineNo);
        
        // Query to get timestamp from ig_coil_chain_cover table where engine_number matches
        const query = `
            SELECT time_of_scan 
            FROM ig_coil_chain_cover 
            WHERE engine_number = $1 
            ORDER BY time_of_scan DESC 
            LIMIT 1
        `;
        
        const result = await pool.query(query, [engineNo]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No IG coil record found for this engine number'
            });
        }
        
        // Get scan time from result
        const scanTime = result.rows[0].time_of_scan;
        console.log('Found scan time:', scanTime);
        
        // Format date parts for folder structure (YYYY_MM_DD_0)
        const year = scanTime.getFullYear();
        const month = String(scanTime.getMonth() + 1).padStart(2, '0');
        const day = String(scanTime.getDate()).padStart(2, '0');
        const folderDateFormat = `${year}_${month}_${day}_0`;
        
        console.log('Folder date format:', folderDateFormat);
        
        // Format time parts for file name matching (HH_MM_SS)
        const hours = String(scanTime.getHours()).padStart(2, '0');
        const minutes = String(scanTime.getMinutes()).padStart(2, '0');
        const seconds = String(scanTime.getSeconds()).padStart(2, '0');
        
        // Target time string for filename matching
        const targetTimeString = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
        console.log('Target time string for matching:', targetTimeString);
        
        // Define the base share path (mounted Windows share)
        const baseSharePath = '/mnt/windowsshareimages';
        
        // Define the IG coil folder paths to search
        const igFolders = ['ig1', 'ig2', 'ig3', 'ig4'];
        const allFoundImages = [];
        
        // Search in each IG folder
        for (const igFolder of igFolders) {
            const specificPath = `${baseSharePath}/${igFolder}/${folderDateFormat}`;
            console.log(`Looking for images in path: ${specificPath}`);
            
            try {
                // Check if the directory exists
                if (!fs.existsSync(specificPath)) {
                    console.log(`Directory does not exist: ${specificPath}`);
                    continue; // Skip to next folder if this one doesn't exist
                }
                
                // List all files in the directory
                const files = fs.readdirSync(specificPath);
                console.log(`Found ${files.length} files in directory ${igFolder}`);
                
                // Filter for image files
                const imageFiles = files.filter(file => {
                    return file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg');
                });
                
                console.log(`Found ${imageFiles.length} image files in ${igFolder}`);
                
                if (imageFiles.length === 0) {
                    continue; // Skip to next folder if no images found
                }
                
                // Find exact match first
                let matchedFiles = imageFiles.filter(file => file.includes(targetTimeString));
                console.log(`${matchedFiles.length} exact matches found in ${igFolder}`);
                
                // If no exact match, find the closest file by timestamp
                if (matchedFiles.length === 0) {
                    console.log(`Looking for closest match by timestamp in ${igFolder}`);
                    const targetTime = new Date(scanTime).getTime();
                    
                    let closestFile = null;
                    let smallestDiff = Infinity;
                    
                    for (const file of imageFiles) {
                        try {
                            // Extract timestamp from filename like "NG2025_04_07_07_51_04.jpg"
                            const fileNameParts = file.split('.');
                            const baseName = fileNameParts[0];
                            const timeStr = baseName.replace(/^NG/, '');
                            
                            // Parse the file timestamp
                            const [fileYear, fileMonth, fileDay, fileHour, fileMin, fileSec] = timeStr.split('_');
                            
                            if (!fileYear || !fileMonth || !fileDay || !fileHour || !fileMin || !fileSec) {
                                console.log(`Skipping file with invalid format: ${file}`);
                                continue;
                            }
                            
                            const fileDate = new Date(
                                parseInt(fileYear),
                                parseInt(fileMonth) - 1,
                                parseInt(fileDay),
                                parseInt(fileHour),
                                parseInt(fileMin),
                                parseInt(fileSec)
                            );
                            
                            if (isNaN(fileDate.getTime())) {
                                console.log(`Invalid date from file: ${file}`);
                                continue;
                            }
                            
                            const fileTime = fileDate.getTime();
                            const diff = Math.abs(fileTime - targetTime);
                            
                            if (diff < smallestDiff) {
                                smallestDiff = diff;
                                closestFile = file;
                            }
                        } catch (parseError) {
                            console.error(`Error parsing file: ${file}`, parseError);
                        }
                    }
                    
                    if (closestFile) {
                        matchedFiles = [closestFile];
                    }
                }
                
                // Add full paths of matched files to results
                for (const matchedFile of matchedFiles) {
                    const imagePath = path.join(specificPath, matchedFile);
                    allFoundImages.push({
                        folder: igFolder,
                        filename: matchedFile,
                        path: imagePath
                    });
                }
                
            } catch (error) {
                console.error(`File system error in ${igFolder}:`, error);
                // Continue with other folders even if one fails
            }
        }
        
        if (allFoundImages.length === 0) {
            return res.status(404).json({
                message: 'No IG coil images found for this engine number across any folder'
            });
        }
        
        console.log(`Total images found: ${allFoundImages.length}`);
        
        // Return information about all found images
        res.status(200).json({
            engineNumber: engineNo,
            scanTime: scanTime,
            imagesFound: allFoundImages.length,
            images: allFoundImages.map(img => ({
                folder: img.folder,
                filename: img.filename,
                url: `/api/ig-coil-images/${engineNo}/${img.folder}/${img.filename}`
            }))
        });
        
    } catch (error) {
        console.error('Database or system error:', error);
        res.status(500).json({
            message: 'Error fetching IG coil images',
            error: error.message
        });
    }
};

// Endpoint to serve individual IG coil images
const getIndividualIGCoilImage = async (req, res) => {
    try {
        const { engineNo, folder, filename } = req.params;
        
        // Validate parameters
        if (!engineNo || !folder || !filename) {
            return res.status(400).json({
                message: 'Missing required parameters'
            });
        }
        
        // Check that folder is one of the valid IG folders
        if (!['ig1', 'ig2', 'ig3', 'ig4'].includes(folder)) {
            return res.status(400).json({
                message: 'Invalid folder specified'
            });
        }
        
        // Query to get the time_of_scan for this engine
        const query = `
            SELECT time_of_scan 
            FROM ig_coil_chain_cover 
            WHERE engine_number = $1 
            ORDER BY time_of_scan DESC 
            LIMIT 1
        `;
        
        const result = await pool.query(query, [engineNo]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No IG coil record found for this engine number'
            });
        }
        
        // Get scan time and format for folder path
        const scanTime = result.rows[0].time_of_scan;
        const year = scanTime.getFullYear();
        const month = String(scanTime.getMonth() + 1).padStart(2, '0');
        const day = String(scanTime.getDate()).padStart(2, '0');
        const folderDateFormat = `${year}_${month}_${day}_0`;
        
        // Construct path to the specific image
        const baseSharePath = '/mnt/windowsshareimages';
        const imagePath = path.join(baseSharePath, folder, folderDateFormat, filename);
        
        // Validate file exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                message: 'Image file not found'
            });
        }
        
        // Determine content type based on file extension
        let contentType = 'image/jpeg'; // Default
        if (filename.endsWith('.png')) {
            contentType = 'image/png';
        } else if (filename.endsWith('.gif')) {
            contentType = 'image/gif';
        }
        
        // Send the file
        res.sendFile(imagePath, {
            headers: {
                'Content-Type': contentType
            }
        }, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ message: 'Error sending image file' });
            }
        });
        
    } catch (error) {
        console.error('Error serving individual IG coil image:', error);
        res.status(500).json({
            message: 'Error serving image',
            error: error.message
        });
    }
};


   




module.exports = { 
    getIgCoil_ChainCoverData, 
    getChainCaseData, 
    getFuelDeliveryPipeData,
    getPCVData,
    getWireHarnessData,
    getCamHousingData, 
    getChainCoverData,
    getConnectingRodData,
    getPortInjectorData,
    getChainCaseImageByEngineNumber,
    getIGCoilImagesByEngineNumber,
    getIGCoilImagesByEngineNumber,
    getIndividualIGCoilImage,
};