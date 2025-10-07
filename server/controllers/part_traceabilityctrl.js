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

// // Controller for fetching PCV data
// const getPCVData = async (req, res) => {
//     try {
//         const { engineNo } = req.params;
        
//         const result = await findClosestPartMatch(
//             engineNo,
//             'engine_tracking_three',  // tracking table
//             51,                       // station number
//             'pcv',                    // part table
//             40                        // fallback time window in seconds
//         );
        
//         if (!result.found) {
//             return res.status(404).json({ message: result.message });
//         }
        
//         // FIXED: Return all parts found within the time window
//         const response = result.data.map(part => ({
//             part_number: part.part_number,
//             engine_number: engineNo,
//             scan_time: part.scan_time
//         }));
        
//         res.json(response);
        
//     } catch (error) {
//         console.error('Database error:', error);
//         res.status(500).json({ 
//             message: 'Error fetching PCV data',
//             error: error.message
//         });
//     }
// };




const getPCVData = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        const result = await findClosestPreviousPartMatch(
            engineNo,
            'engine_tracking_three',  // tracking table
            51,                       // station number
            'pcv',                    // part table
            40                        // fallback time window in seconds
        );
        
        if (!result.found) {
            return res.status(404).json({ message: result.message });
        }
        
        // Return the part from the previous bin (scanned before the engine arrival)
        // Keep the same response structure as the original API (array format)
        const response = [{
            part_number: result.data.part_number,
            engine_number: engineNo,
            scan_time: result.data.scan_time
        }];
        
        res.json(response);
        
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching PCV data',
            error: error.message
        });
    }
};

// New function to find the closest PREVIOUS part match
const findClosestPreviousPartMatch = async (engineNo, trackingTable, stationNumber, partTable, fallbackWindowSeconds) => {
    try {
        // Step 1: Get engine arrival time at the specified station
        const engineQuery = `
            SELECT arrival_time 
            FROM ${trackingTable} 
            WHERE engine_number = $1 AND station_number = $2
            ORDER BY arrival_time DESC 
            LIMIT 1
        `;
        
        const engineResult = await pool.query(engineQuery, [engineNo, stationNumber]);
        
        if (engineResult.rows.length === 0) {
            return {
                found: false,
                message: `Engine ${engineNo} not found at station ${stationNumber}`
            };
        }
        
        const engineArrivalTime = engineResult.rows[0].arrival_time;
        
        // Step 2: Find the closest PCV scan that happened BEFORE the engine arrival
        const partQuery = `
            SELECT part_number, scan_time
            FROM ${partTable}
            WHERE scan_time < $1
            ORDER BY scan_time DESC
            LIMIT 1
        `;
        
        const partResult = await pool.query(partQuery, [engineArrivalTime]);
        
        if (partResult.rows.length === 0) {
            // Fallback: if no previous scan found, look within fallback window
            const fallbackQuery = `
                SELECT part_number, scan_time
                FROM ${partTable}
                WHERE scan_time BETWEEN ($1::timestamp - INTERVAL '${fallbackWindowSeconds} seconds') 
                      AND ($1::timestamp + INTERVAL '${fallbackWindowSeconds} seconds')
                ORDER BY ABS(EXTRACT(EPOCH FROM (scan_time - $1::timestamp))) ASC
                LIMIT 1
            `;
            
            const fallbackResult = await pool.query(fallbackQuery, [engineArrivalTime]);
            
            if (fallbackResult.rows.length === 0) {
                return {
                    found: false,
                    message: `No PCV parts found before engine arrival time or within ${fallbackWindowSeconds} second window`
                };
            }
            
            return {
                found: true,
                data: fallbackResult.rows[0],
                engineArrivalTime: engineArrivalTime,
                note: 'Used fallback time window'
            };
        }
        
        return {
            found: true,
            data: partResult.rows[0],
            engineArrivalTime: engineArrivalTime
        };
        
    } catch (error) {
        console.error('Error in findClosestPreviousPartMatch:', error);
        throw error;
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

        // Direct exact match query - no character omission
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
        
        console.log('Searching for Chain Case image for Engine No:', engineNo);
        
        // Use the existing logic to find matching chaincase parts
        const result = await findClosestPartMatch(
            engineNo,
            'engine_tracking',   // tracking table
            17,                  // station number
            'chaincase',         // part table
            40                   // fallback time window in seconds
        );
        
        if (!result.found) {
            return res.status(404).json({
                message: 'No chaincase record found for this engine number at station 17'
            });
        }
        
        console.log(`Found ${result.data.length} matching chaincase parts`);
        
        // Get the part numbers that match our engine
        const partNumbers = result.data.map(part => part.part_number);
        console.log('Matching part numbers:', partNumbers);
        
        // Query to get image_name from chaincase table for the matched part numbers
        const imageQuery = `
            SELECT image_name, part_number
            FROM chaincase
            WHERE part_number = ANY($1)
            ORDER BY scan_time DESC
            LIMIT 1
        `;
        
        const imageResult = await pool.query(imageQuery, [partNumbers]);
        
        if (imageResult.rows.length === 0) {
            return res.status(404).json({
                message: 'No image data found for the matched chaincase parts'
            });
        }
        
        const imageNames = imageResult.rows[0].image_name;
        const matchedPartNumber = imageResult.rows[0].part_number;
        console.log('Found image names for part', matchedPartNumber, ':', imageNames);
        
        // Check if image_name array exists and has content
        if (!imageNames || imageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for the matched chaincase part'
            });
        }
        
        // Get the first image path (assuming single image for chaincase)
        const imagePath = imageNames[0];
        console.log('Image path from database:', imagePath);
        
        // Convert Windows path to Linux path and construct full path
        const linuxPath = imagePath.replace(/\\/g, '/');
        const fullImagePath = path.join('/mnt/windowsshareimages', linuxPath);
        
        console.log('Full image path:', fullImagePath);
        
        try {
            // Check if the image file exists
            if (!fs.existsSync(fullImagePath)) {
                console.error(`Image file does not exist: ${fullImagePath}`);
                return res.status(404).json({
                    message: 'Image file not found',
                    path: fullImagePath
                });
            }
            
            // Determine content type based on file extension
            let contentType = 'image/jpeg'; // Default
            if (fullImagePath.endsWith('.png')) {
                contentType = 'image/png';
            } else if (fullImagePath.endsWith('.gif')) {
                contentType = 'image/gif';
            }
            
            console.log(`Serving chaincase image: ${fullImagePath}`);
            
            // Send the image file
            res.sendFile(fullImagePath, {
                headers: {
                    'Content-Type': contentType
                }
            }, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ message: 'Error sending chaincase image file' });
                }
            });
            
        } catch (error) {
            console.error('File system error:', error);
            res.status(500).json({
                message: 'Error accessing the chaincase image',
                error: error.message,
                path: fullImagePath
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



const getCamHousingImagesByCamHousingSN = async (req, res) => {
    try {
        const { camhousingSN } = req.params;
        
        console.log('Searching for Cam Housing images for CamHousing SN:', camhousingSN);
        
        // Query to get image_name from camshaft_rfid table where cam_housing_sl_no matches
        const query = `
            SELECT image_name 
            FROM camshaft_rfid 
            WHERE cam_housing_sl_no = $1 
            ORDER BY time_of_scan DESC 
            LIMIT 1
        `;
        
        const result = await pool.query(query, [camhousingSN]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No cam housing record found for this cam housing S/N'
            });
        }
        
        const imageNames = result.rows[0].image_name;
        console.log('Found image names (raw):', imageNames);
        console.log('Type of image names:', typeof imageNames);
        
        // Handle PostgreSQL array format - could be string or already parsed array
        let parsedImageNames;
        if (typeof imageNames === 'string') {
            // If it's a string, it might be in PostgreSQL array format like {"path1","path2"}
            // Remove curly braces and split by comma, then clean up quotes
            parsedImageNames = imageNames
                .replace(/^\{/, '')  // Remove opening brace
                .replace(/\}$/, '')  // Remove closing brace
                .split(',')          // Split by comma
                .map(path => path.replace(/^"/, '').replace(/"$/, '').trim()); // Remove quotes and trim
        } else if (Array.isArray(imageNames)) {
            // Already an array
            parsedImageNames = imageNames;
        } else {
            return res.status(404).json({
                message: 'Invalid image_name format in database'
            });
        }
        
        console.log('Parsed image names:', parsedImageNames);
        
        // Check if parsed array exists and has content
        if (!parsedImageNames || parsedImageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for this cam housing S/N'
            });
        }
        
        // Expecting exactly 2 images: [0] for intake, [1] for exhaust
        if (parsedImageNames.length < 2) {
            return res.status(404).json({
                message: 'Insufficient images found. Expected 2 images (intake and exhaust)',
                foundImages: parsedImageNames.length,
                images: parsedImageNames
            });
        }
        
        const intakeImagePath = parsedImageNames[0]; // First image for cam_shaft_intake_sl_no
        const exhaustImagePath = parsedImageNames[1]; // Second image for cam_shaft_exhaust_sl_no
        
        console.log('Intake image path from database:', intakeImagePath);
        console.log('Exhaust image path from database:', exhaustImagePath);
        
        // Convert Windows paths to Linux paths and construct full paths
        const intakeLinuxPath = intakeImagePath.replace(/\\/g, '/');
        const exhaustLinuxPath = exhaustImagePath.replace(/\\/g, '/');
        
        const fullIntakeImagePath = path.join('/mnt/windowsshareimages', intakeLinuxPath);
        const fullExhaustImagePath = path.join('/mnt/windowsshareimages', exhaustLinuxPath);
        
        console.log('Full intake image path:', fullIntakeImagePath);
        console.log('Full exhaust image path:', fullExhaustImagePath);
        
        // Check if both image files exist
        const intakeExists = fs.existsSync(fullIntakeImagePath);
        const exhaustExists = fs.existsSync(fullExhaustImagePath);
        
        if (!intakeExists && !exhaustExists) {
            return res.status(404).json({
                message: 'Neither cam housing image files found',
                intakePath: fullIntakeImagePath,
                exhaustPath: fullExhaustImagePath
            });
        }
        
        // Return both image paths and availability status
        const response = {
            camHousingSN: camhousingSN,
            images: {
                intake: {
                    path: fullIntakeImagePath,
                    available: intakeExists,
                    type: 'cam_shaft_intake'
                },
                exhaust: {
                    path: fullExhaustImagePath,
                    available: exhaustExists,
                    type: 'cam_shaft_exhaust'
                }
            }
        };
        
        // If user wants to serve a specific image, they can use query parameter
        const { imageType } = req.query; // ?imageType=intake or ?imageType=exhaust
        
        if (imageType === 'intake' && intakeExists) {
            return serveImage(res, fullIntakeImagePath, 'intake cam housing image');
        } else if (imageType === 'exhaust' && exhaustExists) {
            return serveImage(res, fullExhaustImagePath, 'exhaust cam housing image');
        } else if (imageType && !intakeExists && !exhaustExists) {
            return res.status(404).json({
                message: `${imageType} cam housing image file not found`,
                path: imageType === 'intake' ? fullIntakeImagePath : fullExhaustImagePath
            });
        }
        
        // If no specific image type requested, return metadata about both images
        res.json(response);
        
    } catch (error) {
        console.error('Database or system error:', error);
        res.status(500).json({
            message: 'Error fetching cam housing images',
            error: error.message
        });
    }
};

// Helper function to serve image files
const serveImage = (res, imagePath, description) => {
    try {
        // Determine content type based on file extension
        let contentType = 'image/jpeg'; // Default
        if (imagePath.endsWith('.png')) {
            contentType = 'image/png';
        } else if (imagePath.endsWith('.gif')) {
            contentType = 'image/gif';
        }
        
        console.log(`Serving ${description}: ${imagePath}`);
        
        // Send the image file directly
        res.sendFile(imagePath, {
            headers: {
                'Content-Type': contentType
            }
        }, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).json({ 
                    message: `Error sending ${description} file`,
                    error: err.message 
                });
            }
        });
        
    } catch (error) {
        console.error(`File system error for ${description}:`, error);
        res.status(500).json({
            message: `Error accessing ${description}`,
            error: error.message,
            path: imagePath
        });
    }
};



const getChainCoverImagesByEngineNumber = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        console.log('Searching for Chain Cover images for Engine No:', engineNo);
        
        // Query to get image_name from chain_cover table where engine_number matches
        const query = `
            SELECT image_name 
            FROM chain_cover 
            WHERE engine_number = $1 
            ORDER BY scan_time DESC 
            LIMIT 1
        `;
        
        const result = await pool.query(query, [engineNo]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'No chain cover record found for this engine number'
            });
        }
        
        const imageNames = result.rows[0].image_name;
        console.log('Found image names:', imageNames);
        
        // Check if image_name array exists and has content
        if (!imageNames || imageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for this engine number'
            });
        }
        
        // Get the first image path (assuming single image for chaincover)
        const imagePath = imageNames[0];
        console.log('Image path from database:', imagePath);
        
        // Convert Windows path to Linux path and construct full path
        const linuxPath = imagePath.replace(/\\/g, '/');
        const fullImagePath = path.join('/mnt/windowsshareimages', linuxPath);
        
        console.log('Full image path:', fullImagePath);
        
        try {
            // Check if the image file exists
            if (!fs.existsSync(fullImagePath)) {
                console.error(`Image file does not exist: ${fullImagePath}`);
                return res.status(404).json({
                    message: 'Chain cover image file not found',
                    path: fullImagePath
                });
            }
            
            // Determine content type based on file extension
            let contentType = 'image/jpeg'; // Default
            if (fullImagePath.endsWith('.png')) {
                contentType = 'image/png';
            } else if (fullImagePath.endsWith('.gif')) {
                contentType = 'image/gif';
            }
            
            console.log(`Serving chain cover image: ${fullImagePath}`);
            
            // Send the image file directly
            res.sendFile(fullImagePath, {
                headers: {
                    'Content-Type': contentType
                }
            }, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).json({ message: 'Error sending chain cover image file' });
                }
            });
            
        } catch (error) {
            console.error(`File system error:`, error);
            res.status(500).json({
                message: 'Error accessing chain cover image',
                error: error.message,
                path: fullImagePath
            });
        }
        
    } catch (error) {
        console.error('Database or system error:', error);
        res.status(500).json({
            message: 'Error fetching chain cover image',
            error: error.message
        });
    }
};


const getIGCoilImagesByEngineNumber = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        console.log('Searching for IG Coil images for Engine No:', engineNo);
        
        // Query to get image_name from ig_coil_chain_cover table where engine_number matches
        const query = `
            SELECT image_name 
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
        
        const imageNames = result.rows[0].image_name;
        console.log('Found image names:', imageNames);
        
        // Check if image_name array exists and has content
        if (!imageNames || imageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for this engine number'
            });
        }
        
        const allFoundImages = [];
        
        // Process each image path in the array
        for (let i = 0; i < imageNames.length; i++) {
            const imagePath = imageNames[i];
            console.log(`Processing image path ${i + 1}:`, imagePath);
            
            // Convert Windows path to Linux path
            const linuxPath = imagePath.replace(/\\/g, '/');
            const fullImagePath = path.join('/mnt/windowsshareimages', linuxPath);
            
            console.log('Full image path:', fullImagePath);
            
            try {
                // Check if the image file exists
                if (fs.existsSync(fullImagePath)) {
                    // Extract folder name from path (ig1, ig2, ig3, ig4)
                    const pathParts = linuxPath.split('/');
                    const folder = pathParts[0]; // Should be ig1, ig2, etc.
                    const filename = pathParts[pathParts.length - 1]; // Get filename
                    
                    allFoundImages.push({
                        folder: folder,
                        filename: filename,
                        path: fullImagePath,
                        index: i
                    });
                    
                    console.log(`Valid image found: ${folder}/${filename}`);
                } else {
                    console.log(`Image file does not exist: ${fullImagePath}`);
                }
            } catch (error) {
                console.error(`Error checking image ${i + 1}:`, error);
            }
        }
        
        if (allFoundImages.length === 0) {
            return res.status(404).json({
                message: 'No valid IG coil images found for this engine number'
            });
        }
        
        console.log(`Total valid images found: ${allFoundImages.length}`);
        
        // Return information about all found images
        res.status(200).json({
            engineNumber: engineNo,
            imagesFound: allFoundImages.length,
            images: allFoundImages.map(img => ({
                folder: img.folder,
                filename: img.filename,
                url: `/api/ig-coil-images/${engineNo}/${img.index}` // Use index for individual access
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

// Endpoint to serve individual IG coil images by index
const getIndividualIGCoilImage = async (req, res) => {
    try {
        const { engineNo, imageIndex } = req.params;
        
        // Validate parameters
        if (!engineNo || imageIndex === undefined) {
            return res.status(400).json({
                message: 'Missing required parameters'
            });
        }
        
        const index = parseInt(imageIndex);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                message: 'Invalid image index'
            });
        }
        
        // Query to get image_name array for this engine
        const query = `
            SELECT image_name 
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
        
        const imageNames = result.rows[0].image_name;
        
        if (!imageNames || imageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for this engine number'
            });
        }
        
        if (index >= imageNames.length) {
            return res.status(404).json({
                message: 'Image index out of range'
            });
        }
        
        // Get the specific image path by index
        const imagePath = imageNames[index];
        
        // Convert Windows path to Linux path and construct full path
        const linuxPath = imagePath.replace(/\\/g, '/');
        const fullImagePath = path.join('/mnt/windowsshareimages', linuxPath);
        
        // Validate file exists
        if (!fs.existsSync(fullImagePath)) {
            return res.status(404).json({
                message: 'Image file not found',
                path: fullImagePath
            });
        }
        
        // Determine content type based on file extension
        let contentType = 'image/jpeg'; // Default
        if (fullImagePath.endsWith('.png')) {
            contentType = 'image/png';
        } else if (fullImagePath.endsWith('.gif')) {
            contentType = 'image/gif';
        }
        
        console.log(`Serving IG coil image: ${fullImagePath}`);
        
        // Send the file
        res.sendFile(fullImagePath, {
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

const getConnectingRodImagesByEngineNumber = async (req, res) => {
    try {
        const { engineNo } = req.params;
        
        console.log('Searching for IG Coil images for Engine No:', engineNo);
        
        // Query to get image_name from ig_coil_chain_cover table where engine_number matches
        const query = `
            SELECT image_name 
            FROM connectingrod 
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
        
        const imageNames = result.rows[0].image_name;
        console.log('Found image names:', imageNames);
        
        // Check if image_name array exists and has content
        if (!imageNames || imageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for this engine number'
            });
        }
        
        const allFoundImages = [];
        
        // Process each image path in the array
        for (let i = 0; i < imageNames.length; i++) {
            const imagePath = imageNames[i];
            console.log(`Processing image path ${i + 1}:`, imagePath);
            
            // Convert Windows path to Linux path
            const linuxPath = imagePath.replace(/\\/g, '/');
            const fullImagePath = path.join('/mnt/windowsshareimages', linuxPath);
            
            console.log('Full image path:', fullImagePath);
            
            try {
                // Check if the image file exists
                if (fs.existsSync(fullImagePath)) {
                    // Extract folder name from path (ig1, ig2, ig3, ig4)
                    const pathParts = linuxPath.split('/');
                    const folder = pathParts[0]; // Should be ig1, ig2, etc.
                    const filename = pathParts[pathParts.length - 1]; // Get filename
                    
                    allFoundImages.push({
                        folder: folder,
                        filename: filename,
                        path: fullImagePath,
                        index: i
                    });
                    
                    console.log(`Valid image found: ${folder}/${filename}`);
                } else {
                    console.log(`Image file does not exist: ${fullImagePath}`);
                }
            } catch (error) {
                console.error(`Error checking image ${i + 1}:`, error);
            }
        }
        
        if (allFoundImages.length === 0) {
            return res.status(404).json({
                message: 'No valid IG coil images found for this engine number'
            });
        }
        
        console.log(`Total valid images found: ${allFoundImages.length}`);
        
        // Return information about all found images
        res.status(200).json({
            engineNumber: engineNo,
            imagesFound: allFoundImages.length,
            images: allFoundImages.map(img => ({
                folder: img.folder,
                filename: img.filename,
                url: `/api/connecting-rod-images/${engineNo}/${img.index}` // Use index for individual access
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

// Endpoint to serve individual IG coil images by index
const getIndividualConnectingRodImage= async (req, res) => {
    try {
        const { engineNo, imageIndex } = req.params;
        
        // Validate parameters
        if (!engineNo || imageIndex === undefined) {
            return res.status(400).json({
                message: 'Missing required parameters'
            });
        }
        
        const index = parseInt(imageIndex);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({
                message: 'Invalid image index'
            });
        }
        
        // Query to get image_name array for this engine
        const query = `
            SELECT image_name 
            FROM connectingrod
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
        
        const imageNames = result.rows[0].image_name;
        
        if (!imageNames || imageNames.length === 0) {
            return res.status(404).json({
                message: 'No image paths found for this engine number'
            });
        }
        
        if (index >= imageNames.length) {
            return res.status(404).json({
                message: 'Image index out of range'
            });
        }
        
        // Get the specific image path by index
        const imagePath = imageNames[index];
        
        // Convert Windows path to Linux path and construct full path
        const linuxPath = imagePath.replace(/\\/g, '/');
        const fullImagePath = path.join('/mnt/windowsshareimages', linuxPath);
        
        // Validate file exists
        if (!fs.existsSync(fullImagePath)) {
            return res.status(404).json({
                message: 'Image file not found',
                path: fullImagePath
            });
        }
        
        // Determine content type based on file extension
        let contentType = 'image/jpeg'; // Default
        if (fullImagePath.endsWith('.png')) {
            contentType = 'image/png';
        } else if (fullImagePath.endsWith('.gif')) {
            contentType = 'image/gif';
        }
        
        console.log(`Serving IG coil image: ${fullImagePath}`);
        
        // Send the file
        res.sendFile(fullImagePath, {
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
    getCamHousingImagesByCamHousingSN, 
    getChainCoverData,
    getConnectingRodData,
    getPortInjectorData,
    getChainCaseImageByEngineNumber,
    getIGCoilImagesByEngineNumber,
    getIGCoilImagesByEngineNumber,
    getIndividualIGCoilImage,
    getChainCoverImagesByEngineNumber,
    getConnectingRodImagesByEngineNumber,
    getIndividualConnectingRodImage,

};
