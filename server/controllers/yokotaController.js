const pool = require('../connections/postgresDB');
const fs = require('fs');
const path = require('path');

const YOKOTA_MOUNT_ROOT = "/mnt/yokota/AppData";

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
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
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
        const folder = String(
            tool.folder !== undefined && tool.folder !== null
                ? tool.folder : (tool.alt_folder || '')
        ).trim();
        if (!folder) return;
        // Exclude URYU wrench tools — completely different protocol
        if (toolName.toUpperCase().includes('URYU')) return;

        const key = [stationNorm, normalizeFolder(folder)].join('|');
        if (seen.has(key)) return;
        seen.add(key);


        resolvedTools.push({
            ...tool,
            station: tool.station || stationNumber,
            folder,
            tool_name: toolName,
            _source: source
        });
    };

    // 1. Master map (always prioritize master definitions)
    MASTER_YOKOTA_TOOL_MAP.forEach(tool => {
        if (normalizeStation(tool.station) === stationNorm) addTool(tool, 'MASTER');
    });

    // 2. DB supplement (ONLY include if explicitly Yokota or matching master folder)
    if (Array.isArray(dbToolMap)) {
        dbToolMap.forEach(dbTool => {
            if (normalizeStation(dbTool.station) === stationNorm) {
                const toolName = String(dbTool.tool_name || '').toUpperCase();
                const isExplicitYokota = toolName.includes('YOKOTA') || toolName.includes('YKT');
                const isMasterFolderMatch = MASTER_YOKOTA_TOOL_MAP.some(m =>
                    normalizeFolder(m.folder) === normalizeFolder(dbTool.folder)
                );

                if (isExplicitYokota || isMasterFolderMatch) {
                    addTool(dbTool, 'DATABASE');
                }
            }
        });
    }

    console.log(`[Yokota Mapping] Station=${stationNumber} | Resolved ${resolvedTools.length} tools`);
    resolvedTools.forEach((tool, i) => {
        console.log(`[Yokota Mapping] ${i + 1}. ${tool.tool_name} | Folder=${tool.folder} | Source=${tool._source}`);
    });

    return resolvedTools;
}

// ---------------------------------------------------------------------------
// Timezone-Immune Plant Time Matcher
//
// Yokota controllers log timestamps in Indian plant local time (e.g. "08/19 08:45:17").
// Converting both arrival_time and CSV records to plant seconds from midnight
// completely avoids server UTC / IST timezone conversion discrepancies.
// ---------------------------------------------------------------------------

function getPlantSecondsFromMidnight(dateInput) {
    if (!dateInput) return null;
    const d = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    if (isNaN(d.getTime())) return null;

    try {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(d);

        let h = 0, m = 0, s = 0;
        for (const p of parts) {
            if (p.type === 'hour') h = parseInt(p.value, 10);
            if (p.type === 'minute') m = parseInt(p.value, 10);
            if (p.type === 'second') s = parseInt(p.value, 10);
        }
        return h * 3600 + m * 60 + s;
    } catch {
        return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
    }
}

function parseYokotaRecordSeconds(timeDateStr) {
    if (!timeDateStr || typeof timeDateStr !== 'string') return null;
    const parts = timeDateStr.trim().split(/\s+/);
    if (parts.length >= 2) {
        const timePart = parts[1]; // "08:45:17"
        const tSplit = timePart.split(':').map(n => parseInt(n, 10));
        if (tSplit.length >= 3 && !isNaN(tSplit[0]) && !isNaN(tSplit[1]) && !isNaN(tSplit[2])) {
            return tSplit[0] * 3600 + tSplit[1] * 60 + tSplit[2];
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
// Record matching within the engine arrival window
// Handles standard time and the +1h controller hardware clock offset
// ---------------------------------------------------------------------------

function matchYokotaRecords(rawYokotaData, arrivalTime, nextArrivalTime) {
    if (!Array.isArray(rawYokotaData) || rawYokotaData.length === 0) return [];

    const arrivalSec = getPlantSecondsFromMidnight(arrivalTime);
    if (arrivalSec === null) {
        console.warn(`[Yokota Matcher] Invalid arrivalTime: ${arrivalTime}`);
        return [];
    }

    const nextSec = nextArrivalTime ? getPlantSecondsFromMidnight(nextArrivalTime) : null;

    // Test candidate target times:
    // 1. +3600s (+1 hour): Yokota controller hardware clock running 1 hr ahead
    // 2. 0s (exact time): Synchronized controller clock
    // 3. -3600s (-1 hour): Controller clock running 1 hr behind
    const candidateOffsets = [3600, 0, -3600];

    for (const offset of candidateOffsets) {
        const targetArrival = (arrivalSec + offset + 86400) % 86400;
        const cycleStartSec = targetArrival - 180; // 3-minute pre-arrival buffer

        let cycleEndSec;
        if (nextSec !== null && nextSec > arrivalSec) {
            const targetNext = (nextSec + offset + 86400) % 86400;
            cycleEndSec = Math.min(targetNext + 60, targetArrival + 600);
        } else {
            cycleEndSec = targetArrival + 300; // 5-minute cycle
        }

        const windowMatches = rawYokotaData.filter(item => {
            if (!item.timeDate) return false;
            const itemSec = parseYokotaRecordSeconds(item.timeDate);
            if (itemSec === null) return false;
            return itemSec >= cycleStartSec && itemSec <= cycleEndSec;
        });
        console.log(
            `[MATCH-DEBUG] Offset=${offset} ` +
            `ArrivalSec=${arrivalSec} ` +
            `WindowStart=${cycleStartSec} ` +
            `WindowEnd=${cycleEndSec} ` +
            `Candidates=${windowMatches.length}`
        );
        if (windowMatches.length > 0) {
            console.log(
                `[Yokota Matcher] Matched with offset=${offset}s (${offset / 3600}h) | ` +
                `Window matches=${windowMatches.length} | ` +
                `TargetArrival=${Math.floor(targetArrival / 3600)}:${Math.floor((targetArrival % 3600) / 60)}:${targetArrival % 60}`
            );

            // Sort chronologically by seconds from midnight
            windowMatches.sort((a, b) => {
                const sa = parseYokotaRecordSeconds(a.timeDate) || 0;
                const sb = parseYokotaRecordSeconds(b.timeDate) || 0;
                return sa - sb;
            });

            // Group into multi-bolt tightening clusters (items within 45s of each other)
            const clusters = [];
            let currentCluster = [];

            for (const item of windowMatches) {
                const itemSec = parseYokotaRecordSeconds(item.timeDate) || 0;

                if (currentCluster.length === 0) {
                    currentCluster.push({ item, itemSec });
                } else {
                    const lastSec = currentCluster[currentCluster.length - 1].itemSec;
                    if (itemSec - lastSec <= 15) {
                        currentCluster.push({ item, itemSec });
                    } else {
                        clusters.push(currentCluster);
                        currentCluster = [{ item, itemSec }];
                    }
                }
            }
            if (currentCluster.length > 0) clusters.push(currentCluster);

            if (clusters.length > 0) {
                // Find cluster closest to targetArrival
                let bestCluster = clusters[0];
                let minDiff = Math.abs(bestCluster[0].itemSec - targetArrival);

                for (let i = 1; i < clusters.length; i++) {
                    const diff = Math.abs(clusters[i][0].itemSec - targetArrival);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestCluster = clusters[i];
                    }
                }

                return bestCluster.map(c => c.item);
            }
        }
    }

    console.log(`[Yokota Matcher] 0 matches across all offsets for ArrivalSec=${arrivalSec}`);
    console.log(
        `[MATCH-DEBUG] No matches found ` +
        `Arrival=${arrivalTime} ` +
        `Next=${nextArrivalTime}`
    );
    return [];
}

// ---------------------------------------------------------------------------
// Read a CONTROLLER-SPECIFIC Yokota file directly from the mounted share.
//
// On-disk layout under /mnt/yokota/AppData/ :
//   <4-digit-folder> / <any_subfolder> / <YYYYMMDD> / *.csv
//
// Example for controller folder "0053":
//   /mnt/yokota/AppData/0053/120_0_100_53/20260819/0053_120_0_100_53_20260819_*.csv
// ---------------------------------------------------------------------------

async function fetchYokotaControllerData(
    controllerFolder,
    formattedDate,
    stationNumber
) {
    const numericStr =
        String(controllerFolder).trim().replace(/^0+/, '') || '0';

    if (!/^\d+$/.test(numericStr)) {
        console.warn(
            `[Yokota Mount] Invalid controller folder: ${controllerFolder}`
        );
        return [];
    }

    const normalizedController =
        String(parseInt(numericStr, 10)).padStart(4, '0');

    const controllerDir =
        path.join(YOKOTA_MOUNT_ROOT, normalizedController);

    if (!fs.existsSync(controllerDir)) {
        console.warn(
            `[Yokota Mount] Controller dir missing: ${controllerDir}`
        );
        return [];
    }

    const dateDirsToScan = [];

    const subdirs = fs
        .readdirSync(controllerDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    for (const sub of subdirs) {

        const baseDir = path.join(controllerDir, sub);

        const exactDir = path.join(
            baseDir,
            formattedDate
        );

        if (fs.existsSync(exactDir)) {
            dateDirsToScan.push(exactDir);
            continue;
        }

        const availableDates = fs
            .readdirSync(baseDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name)
            .filter(d => /^\d{8}$/.test(d))
            .sort();

        const fallbackDate = availableDates
            .filter(d => d <= formattedDate)
            .pop();

        if (fallbackDate) {

            const fallbackDir = path.join(
                baseDir,
                fallbackDate
            );

            console.log(
                `[DEBUG-FETCH] Controller=${controllerFolder} UsingFallback=${fallbackDate}`
            );

            dateDirsToScan.push(fallbackDir);
        }
    }

    console.log(
        `[DEBUG-FETCH] Controller=${controllerFolder} ` +
        `Date=${formattedDate} ` +
        `DateDirs=${JSON.stringify(dateDirsToScan)}`
    );

    const csvFilesToRead = [];

    for (const dDir of dateDirsToScan) {
        const files = fs.readdirSync(dDir);

        let csvFiles = files.filter(f =>
            f.endsWith(`_${formattedDate}.csv`)
        );

        if (csvFiles.length === 0) {
            csvFiles = files.filter(f =>
                f.toLowerCase().endsWith('.csv') &&
                !/_\d{6}\.csv$/i.test(f)
            );
        }


        csvFiles.forEach(f =>
            csvFilesToRead.push(path.join(dDir, f))
        );
    }

    // ===== DEBUG 2 =====
    console.log(
        `[DEBUG-FETCH] Controller=${controllerFolder} ` +
        `CSVFiles=${csvFilesToRead.length}`
    );

    const records = [];

    for (const filePath of csvFilesToRead) {
        try {

            console.log(
                `[FILE-READ] Controller=${controllerFolder} File=${filePath}`
            );

            const text =
                fs.readFileSync(filePath, 'utf8');

            for (const rawLine of text.split(/\r?\n/)) {
                const line = rawLine.trim();

                if (!line)
                    continue;

                if (!line.startsWith('i'))
                    continue;
                const parts = line.split(/\s+/);

                if (records.length === 0) {
                    console.log(
                        `[PARSE-CHECK] Controller=${controllerFolder} Parts=${parts.length}`
                    );

                    console.log(
                        `[PARSE-CHECK] Line="${line}"`
                    );
                }

                if (parts.length < 12)
                    continue;

                records.push({
                    controllerId: parts[0],
                    folder: parts[1],
                    program: parts[2],
                    unknownValue1: parts[3],
                    unknownValue2: parts[4],
                    unknownValue3: parts[5],
                    unknownValue4: parts[6],
                    unknownValue5: parts[7],
                    torque: parts[8],
                    judgement: parts[9],

                    timeDate:
                        parts.length >= 13
                            ? `${parts[11]} ${parts[12]}`
                            : `${parts[10]} ${parts[11]}`
                });
            }
        } catch (err) {
            console.error(
                `[Yokota Mount] Read error ${filePath}`,
                err.message
            );
        }
    }

    // ===== DEBUG 3 =====
    console.log(
        `[DEBUG-FETCH] Controller=${controllerFolder} ` +
        `ParsedRecords=${records.length}`
    );
    if (records.length > 0) {
        console.log(
            `[TIME-RANGE] Controller=${controllerFolder} ` +
            `First=${records[0].timeDate} ` +
            `Last=${records[records.length - 1].timeDate}`
        );
    }
    return records;
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
        const YOKOTA_STATION_NAMES = ['Cam housing sub assy', 'CHS', 'Cam housing', 'CAM_HOUSING'];
        const allYokotaStations = [...YOKOTA_STATION_NUMBERS, ...YOKOTA_STATION_NAMES];

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
                console.log(
                    `[DEBUG] Station=${station_number}
     ToolsFound=${stationTools.length}`
                );

                stationTools.forEach(t => {
                    console.log(
                        `[DEBUG] Station=${station_number}
         Controller=${t.folder}
         Tool=${t.tool_name}`
                    );
                });
                if (stationTools.length === 0) {
                    console.log(`[Yokota Engine Visit] Skipping station ${station_number} — no Yokota tools mapped.`);
                    return [];
                }

                const formattedDate = formatLocalDateString(arrival_time);
                const toolDataEntries = [];

                // ---------------------------------------------------------------
                // CRITICAL: Each tool reads its OWN controller-specific file.
                // This is the only correct way to prevent cross-controller record
                // duplication.  Controller 0053 data → EGR COOLER only.
                // Controller 0042/0052 data → their respective tools only.
                // ---------------------------------------------------------------
                for (const tool of stationTools) {

                    const controllerData =
                        await fetchYokotaControllerData(
                            tool.folder,
                            formattedDate,
                            station_number
                        );

                    console.log(
                        `[DEBUG] Tool=${tool.tool_name} ` +
                        `Controller=${tool.folder} ` +
                        `RawRecords=${controllerData.length}`
                    );

                    if (!controllerData.length) {
                        console.warn(
                            `[Yokota Engine Visit] No mount data | ` +
                            `Tool=${tool.tool_name} | ` +
                            `Controller=${tool.folder} | ` +
                            `Date=${formattedDate}`
                        );
                        continue;
                    }

                    const matchedRecords =
                        matchYokotaRecords(
                            controllerData,
                            arrival_time,
                            next_arrival_time
                        );

                    console.log(
                        `[MATCH] Tool=${tool.tool_name} ` +
                        `Controller=${tool.folder} ` +
                        `Raw=${controllerData.length} ` +
                        `Matched=${matchedRecords.length}`
                    );

                    for (const item of matchedRecords) {
                        toolDataEntries.push({
                            engine_number,
                            station: station_number,
                            folder: item.folder,
                            configured_folder: tool.folder,
                            controller_folder: normalizeFolder(tool.folder),
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
                            tool_name: tool.tool_name
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
            error: error.message
        });
    }
};

module.exports = {
    getYokotaData
};