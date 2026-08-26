const pool = require('../connections/postgresDB');
const fs = require('fs');
const path = require('path');

// Master Dictionary of Yokota Tool tightening stations from production status sheet

const MASTER_YOKOTA_TOOL_MAP = [
    { contr_no: "12", station: "20", folder: "0257", alt_folder: "257", tool_name: "EX-VVT - (YOKOTA)", line: "CHS" },
    { contr_no: "12", station: "Cam housing sub assy", folder: "0257", alt_folder: "257", tool_name: "EX-VVT - (YOKOTA)", line: "CHS" },
    { contr_no: "12", station: "CHS", folder: "0257", alt_folder: "257", tool_name: "EX-VVT - (YOKOTA)", line: "CHS" },
    { contr_no: "35", station: "53", folder: "0103", alt_folder: "103", tool_name: "IGNITION COIL BOLT - (YOKOTA)", line: "MK3" },
    { contr_no: "37", station: "21", folder: "0230", alt_folder: "230", tool_name: "WATER INLET HOUSING - (YOKOTA)", line: "MK3" },
    { contr_no: "37", station: "43", folder: "0230", alt_folder: "230", tool_name: "WATER INLET HOUSING - (YOKOTA)", line: "MK3" },
    { contr_no: "39", station: "17", folder: "0039", alt_folder: "39", tool_name: "WATER BYPASS OUTLET BOLT (YOKOTA)", line: "MK1" },
    { contr_no: "45", station: "58", folder: "0250", alt_folder: "250", tool_name: "I/M BOLT & NUT - (YOKOTA)", line: "MK3" },
    { contr_no: "49", station: "45", folder: "0104", alt_folder: "104", tool_name: "THROTTOLE BODY BOLT", line: "MK2" },
    { contr_no: "50", station: "61", folder: "0255", alt_folder: "255", tool_name: "EGR PIPE BOLT - (YOKOTA)", line: "MK3" },
    { contr_no: "51", station: "60", folder: "0240", alt_folder: "240", tool_name: "EGR VALVE BOLT (CHS) - (YOKOTA)", line: "MK3" },
    { contr_no: "53", station: "59", folder: "0053", alt_folder: "53", tool_name: "EGR COOLER BOLT & NUT- (YOKOTA)", line: "MK3" },
    { contr_no: "70", station: "61", folder: "0102", alt_folder: "102", tool_name: "I/M BKT BOLT (IN MANI) (YOKOTA)", line: "MK3" }
];

// ---------------------------------------------------------------------------
// Date helpers (local time — avoids UTC timezone shift on the plant floor)
// ---------------------------------------------------------------------------

function formatLocalDateString(d) {
    if (!d) return '';
    const dateObj = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    const y   = dateObj.getFullYear();
    const m   = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
}

// ---------------------------------------------------------------------------
// Normalisation helpers
// ---------------------------------------------------------------------------

function normalizeStation(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function normalizeFolder(value) {
    if (value === null || value === undefined) return '';
    const str = String(value).trim();
    // Strip leading zeros to get the canonical numeric form ("0053" → "53")
    if (/^\d+$/.test(str)) return String(parseInt(str, 10));
    return str.toLowerCase();
}

// ---------------------------------------------------------------------------
// Resolve Yokota tools for a station (master map + DB supplement)
// ---------------------------------------------------------------------------

function getYokotaToolsForStation(stationNumber, dbToolMap) {
    if (stationNumber === null || stationNumber === undefined) return [];

    const stationNorm = normalizeStation(stationNumber);
    const resolvedTools = [];
    const seen = new Set();

    const addTool = (tool, source) => {
        if (!tool) return;
        const toolName = String(tool.tool_name || '').trim();
        const folder   = String(
            tool.folder !== undefined && tool.folder !== null
                ? tool.folder : (tool.alt_folder || '')
        ).trim();
        if (!folder) return;
        // Exclude URYU wrench tools — completely different protocol
        if (toolName.toUpperCase().includes('URYU')) return;

        const key = [stationNorm, normalizeFolder(folder), toolName.toUpperCase()].join('|');
        if (seen.has(key)) return;
        seen.add(key);

        resolvedTools.push({
            ...tool,
            station:   tool.station || stationNumber,
            folder,
            tool_name: toolName,
            _source:   source
        });
    };

    // 1. Master map
    MASTER_YOKOTA_TOOL_MAP.forEach(tool => {
        if (normalizeStation(tool.station) === stationNorm) addTool(tool, 'MASTER');
    });

    // 2. DB supplement
    if (Array.isArray(dbToolMap)) {
        dbToolMap.forEach(dbTool => {
            if (normalizeStation(dbTool.station) === stationNorm) addTool(dbTool, 'DATABASE');
        });
    }

    console.log(`[Yokota Mapping] Station=${stationNumber} | Resolved ${resolvedTools.length} tools`);
    resolvedTools.forEach((tool, i) => {
        console.log(`[Yokota Mapping] ${i + 1}. ${tool.tool_name} | Folder=${tool.folder} | Source=${tool._source}`);
    });

    return resolvedTools;
}

// Helper to safely parse date string from Yokota records using arrival timestamp's year
function parseYokotaTimestamp(timeDateStr, referenceYear) {
    if (!timeDateStr || typeof timeDateStr !== 'string') return null;
    const cleanStr = timeDateStr.trim();

    // 1. Full ISO or standard datetime (YYYY-MM-DD HH:MM:SS or YYYY/MM/DD HH:MM:SS)
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(cleanStr)) {
        const iso = cleanStr.replace(/\//g, '-');
        const d = new Date(iso);
        if (!isNaN(d.getTime())) return d;
    }

    // 2. Yokota standard format "MM/DD HH:MM:SS" or "MM/DD HH:MM:SS.ssssss"
    const parts = cleanStr.split(/\s+/);
    if (parts.length >= 2) {
        const monthDay = parts[0];
        const timePart = parts[1];
        const md = monthDay.split(/[-/]/);
        if (md.length === 2) {
            const month = md[0].padStart(2, '0');
            const day = md[1].padStart(2, '0');
            const year = referenceYear || new Date().getFullYear();
            const dateObj = new Date(`${year}-${month}-${day} ${timePart}`);
            if (!isNaN(dateObj.getTime())) return dateObj;
        }
    }

    const fallback = new Date(cleanStr);
    if (!isNaN(fallback.getTime())) return fallback;

    return null;
}

// ---------------------------------------------------------------------------
// Record matching within the engine arrival window
//
// IMPORTANT: No folder filtering is performed here.  Each call already receives
// records from a CONTROLLER-SPECIFIC file.  File-level isolation is the source
// of truth — not the internal spindle/head ID embedded in each row.
// ---------------------------------------------------------------------------

function matchYokotaRecords(rawYokotaData, arrivalTime, nextArrivalTime) {
    if (!Array.isArray(rawYokotaData) || rawYokotaData.length === 0) return [];

    const startTime = new Date(arrivalTime);
    if (isNaN(startTime.getTime())) {
        console.warn(`[Yokota Matcher] Invalid arrivalTime: ${arrivalTime}`);
        return [];
    }

    const arrivalYear = startTime.getFullYear();

    // 3-minute pre-arrival buffer for RFID scan jitter & controller clock drift
    const cycleStartMs = startTime.getTime() - 180000;

    let cycleEndMs;
    if (nextArrivalTime) {
        const nextTime = new Date(nextArrivalTime).getTime();
        if (!isNaN(nextTime)) {
            cycleEndMs = Math.min(nextTime + 60000, startTime.getTime() + 600000);
        } else {
            cycleEndMs = startTime.getTime() + 300000;
        }
    } else {
        cycleEndMs = startTime.getTime() + 300000;
    }

    const windowMatches = rawYokotaData.filter(item => {
        if (!item.timeDate) return false;
        const itemDate = parseYokotaTimestamp(item.timeDate, arrivalYear);
        if (!itemDate) return false;
        const t = itemDate.getTime();
        return t >= cycleStartMs && t <= cycleEndMs;
    });

    console.log(
        `[Yokota Matcher] Records=${rawYokotaData.length} | Window matches=${windowMatches.length} | ` +
        `Arrival=${startTime.toLocaleString()} | ` +
        `Window=[${new Date(cycleStartMs).toLocaleTimeString()} - ${new Date(cycleEndMs).toLocaleTimeString()}]`
    );

    if (windowMatches.length === 0) {
        if (rawYokotaData.length > 0) {
            const sample = rawYokotaData.slice(0, 3).map(r => `[Time:${r.timeDate}]`).join(', ');
            console.log(`[Yokota Matcher] 0 window matches. Sample records: ${sample}`);
        }
        return [];
    }

    windowMatches.sort((a, b) => {
        const ta = (parseYokotaTimestamp(a.timeDate, arrivalYear) || new Date(0)).getTime();
        const tb = (parseYokotaTimestamp(b.timeDate, arrivalYear) || new Date(0)).getTime();
        return ta - tb;
    });

    // Group into clusters (consecutive items within 45 s = one multi-bolt tightening cycle)
    const clusters = [];
    let currentCluster = [];

    for (const item of windowMatches) {
        const itemTime = (parseYokotaTimestamp(item.timeDate, arrivalYear) || new Date(0)).getTime();

        if (currentCluster.length === 0) {
            currentCluster.push({ item, itemTime });
        } else {
            const lastTime = currentCluster[currentCluster.length - 1].itemTime;
            if (itemTime - lastTime <= 45000) {
                currentCluster.push({ item, itemTime });
            } else {
                clusters.push(currentCluster);
                currentCluster = [{ item, itemTime }];
            }
        }
    }
    if (currentCluster.length > 0) clusters.push(currentCluster);

    if (clusters.length === 0) return [];

    // Select the cluster whose first timestamp is closest to arrival time
    let bestCluster = clusters[0];
    let minDiff = Math.abs(bestCluster[0].itemTime - startTime.getTime());

    for (let i = 1; i < clusters.length; i++) {
        const diff = Math.abs(clusters[i][0].itemTime - startTime.getTime());
        if (diff < minDiff) { minDiff = diff; bestCluster = clusters[i]; }
    }

    return bestCluster.map(c => c.item);
}

// ---------------------------------------------------------------------------
// Read a CONTROLLER-SPECIFIC Yokota file directly from the mounted share.
//
// On-disk layout under /mnt/yokota/AppData/ :
//   <4-digit-folder> / 120_0_100_<numeric> / <YYYYMMDD> / *.csv
//
// Example for controller folder "0053":
//   /mnt/yokota/AppData/0053/120_0_100_53/20260819/0053_120_0_100_53_20260819_*.csv
// ---------------------------------------------------------------------------

async function fetchYokotaControllerData(controllerFolder, formattedDate, stationNumber) {
    const numericStr = String(controllerFolder).trim().replace(/^0+/, '') || '0';

    if (!/^\d+$/.test(numericStr)) {
        console.warn(`[Yokota Mount] Invalid controller folder: ${controllerFolder}`);
        return [];
    }

    const controller4   = numericStr.padStart(4, '0');   // "0053"
    const controller3   = numericStr;                     // "53"
    const mountRoot     = process.env.YOKOTA_MOUNT_ROOT || '/mnt/yokota';
    const subfolderName = `120_0_100_${controller3}`;
    const dateDir       = path.join(mountRoot, 'AppData', controller4, subfolderName, formattedDate);

    // 1. Collect all matching date directories to read
    const dateDirsToScan = [];
    if (fs.existsSync(dateDir)) {
        dateDirsToScan.push(dateDir);
    } else {
        const controllerDir = path.join(mountRoot, 'AppData', controller4);
        try {
            if (fs.existsSync(controllerDir)) {
                const subdirs = fs.readdirSync(controllerDir, { withFileTypes: true })
                    .filter(e => e.isDirectory())
                    .map(e => e.name);

                for (const sub of subdirs) {
                    const altDateDir = path.join(controllerDir, sub, formattedDate);
                    if (fs.existsSync(altDateDir)) {
                        dateDirsToScan.push(altDateDir);
                    }
                }
            }
        } catch (scanErr) {
            console.warn(`[Yokota Mount] Could not scan ${controllerDir}: ${scanErr.message}`);
        }
    }

    // 2. Find ALL .csv files inside the date directories
    const csvFilesToRead = [];
    for (const dDir of dateDirsToScan) {
        try {
            const files = fs.readdirSync(dDir);
            const csvFiles = files.filter(f => f.toLowerCase().endsWith('.csv')).sort();
            for (const f of csvFiles) {
                csvFilesToRead.push(path.join(dDir, f));
            }
        } catch (dirErr) {
            console.warn(`[Yokota Mount] Error reading directory ${dDir}: ${dirErr.message}`);
        }
    }

    console.log(`[Yokota Mount] Controller=${controller4} | Date=${formattedDate} | Found ${csvFilesToRead.length} CSV files`);

    const records = [];

    for (const tryPath of csvFilesToRead) {
        try {
            const text = await fs.promises.readFile(tryPath, 'utf8');

            for (const rawLine of text.split(/\r?\n/)) {
                const line = rawLine.trim();
                if (!line) continue;

                // Skip non-data lines
                if (
                    line.startsWith('@') ||
                    line.startsWith('FreeRun:') ||
                    line.startsWith('Final:') ||
                    line.startsWith('Trq,') ||
                    /^[-\d.,]+$/.test(line)
                ) continue;

                const parts = line.split(/\s+/);
                if (parts.length < 13) continue;

                records.push({
                    controller:       parts[0],        // "i0053"
                    controllerFolder: controller4,     // "0053"
                    folder:           parts[1],        // "1a" (spindle/head)
                    program:          parts[2],
                    unknownValue1:    parts[3],
                    torqueDuplicate:  parts[4],
                    unknownValue2:    parts[5],
                    unknownValue3:    parts[6],
                    unknownValue4:    parts[7],
                    unknownValue5:    parts[8],
                    torque:           parts[9],
                    judgement:        parts[10],
                    timeDate:         `${parts[11]} ${parts[12]}`
                });
            }
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.warn(`[Yokota Mount] Error reading ${tryPath}: ${err.message}`);
            }
        }
    }

    if (records.length > 0) {
        console.log(`[Yokota Mount] Loaded ${records.length} records directly from mount for controller ${controller4}`);
        return records;
    }

    // 3. Fallback to upstream 8127 API if direct mount read found no records
    try {
        const queryStation = stationNumber || controller3;
        const baseUrl = process.env.YOKOTA_API_URL || 'http://127.0.0.1:8127';
        const apiUrl = `${baseUrl}/api/station/${queryStation}/date/${formattedDate}`;
        console.log(`[Yokota Fallback] Querying API: ${apiUrl}`);
        const resp = await fetch(apiUrl, { signal: AbortSignal.timeout(5000) });
        if (resp.ok) {
            const json = await resp.json();
            const apiRecords = Array.isArray(json.data) ? json.data : [];
            const filtered = apiRecords.map(r => ({
                controller:       r.controllerId || '',
                controllerFolder: controller4,
                folder:           r.folder || '',
                program:          r.program || '',
                unknownValue1:    r.unknownValue1 || '',
                torqueDuplicate:  r.torqueDuplicate || '',
                unknownValue2:    r.unknownValue2 || '',
                unknownValue3:    r.unknownValue3 || '',
                unknownValue4:    r.unknownValue4 || '',
                unknownValue5:    r.unknownValue5 || '',
                torque:           r.torque || '',
                judgement:        r.judgement || '',
                timeDate:         r.timeDate || ''
            }));
            console.log(`[Yokota Fallback] Retrieved ${filtered.length} records from 8127 API`);
            return filtered;
        }
    } catch (apiErr) {
        console.warn(`[Yokota Fallback] API query failed: ${apiErr.message}`);
    }

    return [];
}

// ---------------------------------------------------------------------------
// Main API handler
// ---------------------------------------------------------------------------

const getYokotaData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        console.log(`\n======================================================`);
        console.log(`[Yokota API] Executing Yokota Query for Engine No: ${engineNo}`);
        console.log(`======================================================`);

        // 1. Load station/tool mapping from PostgreSQL
        let stationToolMap = [];
        try {
            const toolMapResult = await pool.query(`
                SELECT station, tool_name, folder
                FROM station_tool_map
            `);
            stationToolMap = toolMapResult.rows || [];
            console.log(`[Yokota API] Retrieved ${stationToolMap.length} station_tool_map entries from PostgreSQL`);
        } catch (mapErr) {
            console.error('[Yokota API] Error fetching station_tool_map:', mapErr.message);
        }

        // 2. Yokota station numbers / names
        const YOKOTA_STATION_NUMBERS = ['17', '20', '21', '43', '45', '53', '58', '59', '60', '61'];
        const YOKOTA_STATION_NAMES   = ['Cam housing sub assy', 'CHS', 'Cam housing', 'CAM_HOUSING'];
        const allYokotaStations      = [...YOKOTA_STATION_NUMBERS, ...YOKOTA_STATION_NAMES];

        // 3. Get engine station arrival windows (with LEAD for next arrival)
        const trackingWithWindowQuery = `
            WITH target_tracking AS (
                SELECT 'engine_tracking'       AS source, engine_number, arrival_time::text AS arrival_time_str, arrival_time, station_number::text AS station_number
                FROM engine_tracking
                WHERE engine_number = $1 AND station_number::text = ANY($2)

                UNION ALL

                SELECT 'engine_tracking_two'   AS source, engine_number, arrival_time::text AS arrival_time_str, arrival_time, station_number::text AS station_number
                FROM engine_tracking_two
                WHERE engine_number = $1 AND station_number::text = ANY($2)

                UNION ALL

                SELECT 'engine_tracking_three' AS source, engine_number, arrival_time::text AS arrival_time_str, arrival_time, station_number::text AS station_number
                FROM engine_tracking_three
                WHERE engine_number = $1 AND station_number::text = ANY($2)

                UNION ALL

                SELECT 'sub_assy'              AS source, engine_number, arrival_time::text AS arrival_time_str, arrival_time, station_name AS station_number
                FROM sub_assy
                WHERE engine_number = $1 AND station_name = ANY($2)
            )
            SELECT
                tt.engine_number,
                tt.arrival_time_str,
                tt.arrival_time,
                tt.station_number,
                LEAD(tt.arrival_time) OVER (PARTITION BY tt.station_number ORDER BY tt.arrival_time) AS next_arrival_time
            FROM target_tracking tt
            ORDER BY tt.arrival_time DESC;
        `;

        const result = await pool.query(trackingWithWindowQuery, [engineNo, allYokotaStations]);
        console.log(`[Yokota API] Tracking query returned ${result.rows.length} Yokota station visits for engine ${engineNo}`);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No data found for this engine number' });
        }

        // 4. Process each station visit
        const processedData = await Promise.all(
            result.rows.map(async (row) => {
                const { station_number, arrival_time, engine_number, next_arrival_time } = row;

                const stationTools = getYokotaToolsForStation(station_number, stationToolMap);

                console.log(
                    `[Yokota Engine Visit] Station=${station_number} | Tools=${stationTools.length} | ` +
                    `Arrival=${arrival_time} | Next=${next_arrival_time}`
                );

                if (stationTools.length === 0) {
                    console.log(`[Yokota Engine Visit] Skipping station ${station_number} — no Yokota tools mapped.`);
                    return [];
                }

                const formattedDate   = formatLocalDateString(arrival_time);
                const toolDataEntries = [];

                // ---------------------------------------------------------------
                // CRITICAL: Each tool reads its OWN controller-specific file.
                // This is the only correct way to prevent cross-controller record
                // duplication.  Controller 0053 data → EGR COOLER only.
                // Controller 0042/0052 data → their respective tools only.
                // ---------------------------------------------------------------
                for (const tool of stationTools) {
                    const controllerData = await fetchYokotaControllerData(tool.folder, formattedDate, station_number);

                    if (!controllerData.length) {
                        console.warn(
                            `[Yokota Engine Visit] No mount data | Tool=${tool.tool_name} | ` +
                            `Controller=${tool.folder} | Date=${formattedDate}`
                        );
                        continue;
                    }

                    const matchedRecords = matchYokotaRecords(controllerData, arrival_time, next_arrival_time);

                    console.log(
                        `[Yokota Engine Visit] Tool=${tool.tool_name} | Controller=${tool.folder} | ` +
                        `Matched=${matchedRecords.length}`
                    );

                    for (const item of matchedRecords) {
                        toolDataEntries.push({
                            engine_number,
                            station:           station_number,
                            folder:            item.folder,           // internal spindle/head ("1a")
                            configured_folder: tool.folder,           // controller from mapping ("0053")
                            controller_folder: normalizeFolder(tool.folder),
                            program:           item.program,
                            unknownValue1:     item.unknownValue1,
                            torqueDuplicate:   item.torqueDuplicate,
                            unknownValue2:     item.unknownValue2,
                            unknownValue3:     item.unknownValue3,
                            unknownValue4:     item.unknownValue4,
                            unknownValue5:     item.unknownValue5,
                            torque:            item.torque,
                            judgement:         item.judgement,
                            timeDate:          item.timeDate,
                            tool_name:         tool.tool_name
                        });
                    }
                }

                return toolDataEntries;
            })
        );

        // 5. Flatten and return
        const finalData = processedData.flat();
        console.log(`[Yokota API] Completed for Engine ${engineNo}. Total matched records: ${finalData.length}`);
        return res.json(finalData);

    } catch (error) {
        console.error('Database error in getYokotaData:', error.message);
        return res.status(500).json({
            message: 'Error fetching engine tracking data',
            error:   error.message
        });
    }
};

module.exports = {
    getYokotaData
};