const pool = require('./connections/postgresDB');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Master List of 10 Yokota Tools & Folder Mappings
const MASTER_YOKOTA_TOOLS = [
    { station: "20", folder: "0257", subfolder: "120_0_100_78", tool_name: "EX-VVT - (YOKOTA)", aliases: ["20", "Cam housing sub assy", "CHS", "Cam housing"] },
    { station: "17", folder: "0039", subfolder: "120_0_100_95", tool_name: "WATER BYPASS OUTLET BOLT (YOKOTA)", aliases: ["17"] },
    { station: "21", folder: "0230", subfolder: "120_0_100_97", tool_name: "WATER INLET HOUSING - (YOKOTA)", aliases: ["21", "43"] },
    { station: "45", folder: "0104", subfolder: "120_0_100_91", tool_name: "THROTTOLE BODY BOLT - (YOKOTA)", aliases: ["45"] },
    { station: "53", folder: "0103", subfolder: "120_0_100_92", tool_name: "IGNITION COIL BOLT - (YOKOTA)", aliases: ["53"] },
    { station: "58", folder: "0250", subfolder: "120_0_100_98", tool_name: "I/M BOLT & NUT - (YOKOTA)", aliases: ["58"] },
    { station: "59", folder: "0053", subfolder: "120_0_100_94", tool_name: "EGR COOLER BOLT & NUT- (YOKOTA)", aliases: ["59"] },
    { station: "60", folder: "0240", subfolder: "120_0_100_99", tool_name: "EGR VALVE BOLT (CHS) - (YOKOTA)", aliases: ["60"] },
    { station: "61", folder: "0255", subfolder: "120_0_100_96", tool_name: "EGR PIPE BOLT - (YOKOTA)", aliases: ["61"] },
    { station: "61", folder: "0102", subfolder: "120_0_100_93", tool_name: "I/M BKT BOLT (IN MANI) (YOKOTA)", aliases: ["61"] }
];

const YOKOTA_BASE_PATH = process.env.YOKOTA_DATA_PATH || '/mnt/yokota/AppData';

function formatLocalDate(d) {
    const dateObj = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
}

async function inspectEngineData(engineNumber) {
    console.log(`\n================================================================================`);
    console.log(`DETAILED YOKOTA TOOLS DATA REPORT FOR ENGINE: ${engineNumber}`);
    console.log(`================================================================================\n`);

    // 1. Query Tracking records for this engine
    const trackingQuery = `
        WITH target_tracking AS (
            SELECT 'engine_tracking' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking WHERE engine_number = $1
            UNION ALL
            SELECT 'engine_tracking_two' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two WHERE engine_number = $1
            UNION ALL
            SELECT 'engine_tracking_three' AS source, engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three WHERE engine_number = $1
            UNION ALL
            SELECT 'sub_assy' AS source, engine_number, arrival_time, station_name as station_number FROM sub_assy WHERE engine_number = $1
        )
        SELECT * FROM target_tracking ORDER BY arrival_time ASC;
    `;

    const trackingRes = await pool.query(trackingQuery, [engineNumber]);
    const trackingRows = trackingRes.rows;

    console.log(`1. POSTGRESQL TRACKING HISTORY (${trackingRows.length} total stations visited):`);
    if (trackingRows.length === 0) {
        console.log(`   [!] No tracking records found in database for engine: ${engineNumber}`);
        return;
    }

    trackingRows.forEach((r, idx) => {
        const timeStr = new Date(r.arrival_time).toLocaleString();
        console.log(`   [${idx + 1}] Station: ${r.station_number.padEnd(20)} | Arrival: ${timeStr} | Source: ${r.source}`);
    });

    console.log(`\n--------------------------------------------------------------------------------`);
    console.log(`2. CHECKING 10 YOKOTA TOOLS ON MOUNTED DRIVE (${YOKOTA_BASE_PATH}):`);
    console.log(`--------------------------------------------------------------------------------\n`);

    // Fetch API data once for this engine
    let allRecords = [];
    try {
        const apiUrl = `http://localhost:5081/api/yokota/${engineNumber}`;
        const apiResp = await axios.get(apiUrl, { timeout: 15000 });
        allRecords = Array.isArray(apiResp.data) ? apiResp.data : [];
    } catch (err) {
        console.log(`[!] API Query Error: ${err.message}\n`);
    }

    let matchedToolsCount = 0;
    let totalBoltsCount = 0;

    for (let i = 0; i < MASTER_YOKOTA_TOOLS.length; i++) {
        const tool = MASTER_YOKOTA_TOOLS[i];
        console.log(`[Tool #${i + 1}] Station ${tool.station} | ${tool.tool_name}`);
        console.log(`   Folder: ${tool.folder}`);

        // Check if engine visited this station
        const visited = trackingRows.find(r => 
            tool.aliases.some(a => a.toLowerCase() === r.station_number.trim().toLowerCase())
        );

        if (!visited) {
            console.log(`   Status: ⚠️  NOT VISITED (Engine has no tracking entry for Station ${tool.station})\n`);
            continue;
        }

        const arrivalDate = new Date(visited.arrival_time);
        const formattedDate = formatLocalDate(arrivalDate);
        console.log(`   Arrival Time: ${arrivalDate.toLocaleString()} (Date Code: ${formattedDate})`);

        // Check mounted drive file location dynamically
        const controllerDir = path.join(YOKOTA_BASE_PATH, tool.folder);
        let dirExists = false;
        let foundPath = '';
        try {
            if (fs.existsSync(controllerDir)) {
                const subdirs = fs.readdirSync(controllerDir, { withFileTypes: true })
                    .filter(e => e.isDirectory())
                    .map(e => e.name);
                for (const sub of subdirs) {
                    const candidate = path.join(controllerDir, sub, formattedDate);
                    if (fs.existsSync(candidate)) {
                        dirExists = true;
                        foundPath = candidate;
                        break;
                    }
                }
            }
        } catch {}

        console.log(`   Drive Path  : ${foundPath || controllerDir} [${dirExists ? 'EXISTS ON DISK' : 'NOT FOUND'}]`);

        const toolRecords = allRecords.filter(r => 
            (r.station === tool.station || tool.aliases.includes(r.station)) &&
            (String(r.configured_folder || r.folder || '').includes(tool.folder) ||
             String(r.controller_folder || '').includes(String(parseInt(tool.folder, 10))) ||
             r.tool_name === tool.tool_name)
        );

        if (toolRecords.length > 0) {
            matchedToolsCount++;
            totalBoltsCount += toolRecords.length;
            console.log(`   Status      : ✅ MATCHED (${toolRecords.length} bolt tightening records found):`);
            console.log(`   ┌──────┬────────┬─────────┬─────────┬──────────┬──────────┬──────────────────┐`);
            console.log(`   │ Bolt │ Folder │ Program │ Torque  │ Peak Trq │ Judgement│ Date & Time      │`);
            console.log(`   ├──────┼────────┼─────────┼─────────┼──────────┼──────────┼──────────────────┤`);
            toolRecords.forEach((rec, bIdx) => {
                const bolt = (rec.unknownValue1 || String(bIdx + 1)).padEnd(4);
                const folder = (rec.folder || '-').padEnd(6);
                const prog = (rec.program || '-').padEnd(7);
                const trq = (rec.torque || '-').padEnd(7);
                const pTrq = (rec.torqueDuplicate || '-').padEnd(8);
                const judge = (rec.judgement || '-').padEnd(9);
                const time = (rec.timeDate || '-').padEnd(16);
                console.log(`   │ ${bolt} │ ${folder} │ ${prog} │ ${trq} │ ${pTrq} │ ${judge}│ ${time} │`);
            });
            console.log(`   └──────┴────────┴─────────┴─────────┴──────────┴──────────┴──────────────────┘\n`);
        } else {
            console.log(`   Status      : ⚠️  NO MATCHING CYCLE (No records returned by API for this window)\n`);
        }
    }


    console.log(`================================================================================`);
    console.log(`SUMMARY FOR ${engineNumber}: ${matchedToolsCount} / 10 Tools Matched | Total Bolts: ${totalBoltsCount}`);
    console.log(`================================================================================\n`);
}

async function main() {
    try {
        const targetEngine = process.argv[2];

        if (targetEngine) {
            await inspectEngineData(targetEngine.trim());
        } else {
            console.log('Searching PostgreSQL for top engines with the most Yokota station visits...\n');

            const query = `
                WITH all_tracking AS (
                    SELECT engine_number, arrival_time, station_number::text as station_number FROM engine_tracking
                    UNION ALL
                    SELECT engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two
                    UNION ALL
                    SELECT engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three
                    UNION ALL
                    SELECT engine_number, arrival_time, station_name as station_number FROM sub_assy
                ),
                yokota_visits AS (
                    SELECT 
                        engine_number,
                        arrival_time,
                        station_number
                    FROM all_tracking
                    WHERE engine_number IS NOT NULL 
                      AND engine_number != ''
                      AND station_number IN (
                          '20', '17', '21', '43', '45', '53', '58', '59', '60', '61',
                          'Cam housing sub assy', 'CHS', 'Cam housing', 'CAM_HOUSING'
                      )
                )
                SELECT 
                    engine_number,
                    COUNT(DISTINCT station_number) as yokota_station_count,
                    ARRAY_AGG(DISTINCT station_number) as stations_visited,
                    MIN(arrival_time) as first_arrival,
                    MAX(arrival_time) as latest_arrival
                FROM yokota_visits
                GROUP BY engine_number
                ORDER BY yokota_station_count DESC, latest_arrival DESC
                LIMIT 10;
            `;

            const res = await pool.query(query);

            if (res.rows.length === 0) {
                console.log('No engines found with Yokota station tracking.');
                return;
            }

            console.log('TOP ENGINES WITH YOKOTA VISITS IN DATABASE:');
            console.log('--------------------------------------------------------------------------------');
            res.rows.forEach((row, i) => {
                const date = new Date(row.latest_arrival).toISOString().split('T')[0];
                console.log(`[${i + 1}] Engine: ${row.engine_number.padEnd(12)} | Stations: ${String(row.yokota_station_count).padStart(2)} | Date: ${date} | Stations: [${row.stations_visited.join(', ')}]`);
            });
            console.log('--------------------------------------------------------------------------------');
            console.log('\nTIP: To inspect any engine in detail, run: node find_yokota_engines.js <ENGINE_NUMBER>');
            
            // Automatically inspect the first top engine
            if (res.rows.length > 0) {
                const topEngine = res.rows[0].engine_number;
                await inspectEngineData(topEngine);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main();
