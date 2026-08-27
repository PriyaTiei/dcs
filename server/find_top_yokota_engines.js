const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./connections/postgresDB');
const fs = require('fs');
const axios = require('axios');

const YOKOTA_BASE_PATH = process.env.YOKOTA_MOUNT_PATH || '/mnt/yokota/AppData';

const YOKOTA_CONTROLLER_MAP = [
    { contr_no: "12", station: "20", folder: "0257", tool_name: "EX-VVT - (YOKOTA)" },
    { contr_no: "39", station: "17", folder: "0039", tool_name: "WATER BYPASS OUTLET BOLT (YOKOTA)" },
    { contr_no: "37", station: "21", folder: "0230", tool_name: "WATER INLET HOUSING - (YOKOTA)" },
    { contr_no: "49", station: "45", folder: "0104", tool_name: "THROTTOLE BODY BOLT" },
    { contr_no: "35", station: "53", folder: "0103", tool_name: "IGNITION COIL BOLT - (YOKOTA)" },
    { contr_no: "45", station: "58", folder: "0250", tool_name: "I/M BOLT & NUT - (YOKOTA)" },
    { contr_no: "53", station: "59", folder: "0053", tool_name: "EGR COOLER BOLT & NUT- (YOKOTA)" },
    { contr_no: "51", station: "60", folder: "0240", tool_name: "EGR VALVE BOLT (CHS) - (YOKOTA)" },
    { contr_no: "50", station: "61", folder: "0255", tool_name: "EGR PIPE BOLT - (YOKOTA)" },
    { contr_no: "70", station: "61", folder: "0102", tool_name: "I/M BKT BOLT (IN MANI) (YOKOTA)" }
];

async function scanAndRankAllEngines() {
    console.log('================================================================================');
    console.log('SEARCHING PLANT DATABASE & DISK FOR ENGINES WITH MAXIMUM YOKOTA TOOLS DATA');
    console.log('================================================================================\n');

    // 1. Analyze all date folders on disk to find which dates have the most active controllers
    const dateControllerCount = {}; // { '20260826': Set of controller folders }

    if (!fs.existsSync(YOKOTA_BASE_PATH)) {
        console.error(`[!] Mount path not found: ${YOKOTA_BASE_PATH}`);
        process.exit(1);
    }

    const controllersOnDisk = fs.readdirSync(YOKOTA_BASE_PATH, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name);

    for (const c of controllersOnDisk) {
        const cDir = path.join(YOKOTA_BASE_PATH, c);
        try {
            const subdirs = fs.readdirSync(cDir, { withFileTypes: true })
                .filter(e => e.isDirectory())
                .map(e => e.name);

            for (const sub of subdirs) {
                const subDir = path.join(cDir, sub);
                try {
                    const dates = fs.readdirSync(subDir, { withFileTypes: true })
                        .filter(e => e.isDirectory() && /^\d{8}$/.test(e.name))
                        .map(e => e.name);

                    for (const d of dates) {
                        if (!dateControllerCount[d]) dateControllerCount[d] = new Set();
                        dateControllerCount[d].add(c);
                    }
                } catch {}
            }
        } catch {}
    }

    // Rank dates by how many controllers wrote data on that day
    const rankedDates = Object.entries(dateControllerCount)
        .map(([date, ctrlSet]) => ({
            date,
            formattedDate: `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
            controllerCount: ctrlSet.size,
            controllers: Array.from(ctrlSet)
        }))
        .sort((a, b) => b.controllerCount - a.controllerCount || b.date.localeCompare(a.date));

    console.log('1. TOP PRODUCTION DATES WITH THE MOST ACTIVE YOKOTA CONTROLLERS ON DISK:');
    console.log('--------------------------------------------------------------------------------');
    rankedDates.slice(0, 10).forEach((d, i) => {
        console.log(`[${i + 1}] Date: ${d.formattedDate} (${d.date}) | Active Controllers: ${d.controllerCount} / 10 | Folders: [${d.controllers.join(', ')}]`);
    });
    console.log('--------------------------------------------------------------------------------\n');

    // 2. For the top 5 most populated dates, find all engines produced on those dates
    const topDatesFormatted = rankedDates.slice(0, 5).map(d => d.formattedDate);

    console.log(`2. Finding candidate engines produced on top dates: [${topDatesFormatted.join(', ')}]...`);

    const engineCandidates = [];

    for (const dt of topDatesFormatted) {
        try {
            const res = await pool.query(`
                SELECT DISTINCT engine_number, MIN(arrival_time) as start_time, MAX(arrival_time) as end_time, COUNT(DISTINCT station_number) as stations
                FROM (
                    SELECT engine_number, arrival_time, station_number::text FROM engine_tracking WHERE arrival_time::date = $1::date
                    UNION ALL
                    SELECT engine_number, arrival_time, station_number::text FROM engine_tracking_two WHERE arrival_time::date = $1::date
                    UNION ALL
                    SELECT engine_number, arrival_time, station_number::text FROM engine_tracking_three WHERE arrival_time::date = $1::date
                ) t
                WHERE engine_number IS NOT NULL AND engine_number != ''
                GROUP BY engine_number
                ORDER BY stations DESC, start_time ASC
                LIMIT 30;
            `, [dt]);

            res.rows.forEach(r => {
                engineCandidates.push({
                    engine_number: r.engine_number,
                    date: dt,
                    stations: r.stations
                });
            });
        } catch (err) {
            console.error(`Error querying engines for ${dt}:`, err.message);
        }
    }

    console.log(`   Found ${engineCandidates.length} candidate engines across top dates.\n`);
    console.log('3. Testing DCS API (http://localhost:5081/api/yokota/:engineNo) for each candidate...');

    const verifiedEngines = [];

    for (let i = 0; i < engineCandidates.length; i++) {
        const item = engineCandidates[i];
        try {
            const resp = await axios.get(`http://localhost:5081/api/yokota/${item.engine_number}`, { timeout: 3500 });
            const data = Array.isArray(resp.data) ? resp.data : [];
            if (data.length > 0) {
                const uniqueTools = Array.from(new Set(data.map(r => r.tool_name || `Station ${r.station}`)));
                verifiedEngines.push({
                    engine_number: item.engine_number,
                    date: item.date,
                    toolCount: uniqueTools.length,
                    boltCount: data.length,
                    tools: uniqueTools
                });
                process.stdout.write(`\r   Checked ${i + 1}/${engineCandidates.length} engines... Found: ${verifiedEngines.length} with data`);
            }
        } catch {}
    }

    console.log('\n');

    if (verifiedEngines.length === 0) {
        console.log('No engines returned data via the general query. Inspecting known engine NG60753...');
        return;
    }

    // Sort by tool count DESC, then bolt count DESC
    verifiedEngines.sort((a, b) => b.toolCount - a.toolCount || b.boltCount - a.boltCount);

    console.log('================================================================================');
    console.log(`TOP ENGINES WITH YOKOTA TIGHTENING DATA (RANKED BY NUMBER OF TOOLS):`);
    console.log('================================================================================');
    console.log('┌────┬────────────────┬────────────┬───────────────┬─────────────┬─────────────────────────────────────────────────┐');
    console.log('│ #  │ Engine Number  │ Prod Date  │ Matched Tools │ Total Bolts │ Tools Included                                  │');
    console.log('├────┼────────────────┼────────────┼───────────────┼─────────────┼─────────────────────────────────────────────────┤');

    verifiedEngines.forEach((item, idx) => {
        const num = String(idx + 1).padEnd(2);
        const eng = item.engine_number.padEnd(14);
        const dt = item.date.padEnd(10);
        const tools = `${item.toolCount} / 10 tools`.padEnd(13);
        const bolts = `${item.boltCount} bolts`.padEnd(11);
        const toolSummary = item.tools.join(', ').slice(0, 47).padEnd(47);
        console.log(`│ ${num} │ ${eng} │ ${dt} │ ${tools} │ ${bolts} │ ${toolSummary} │`);
    });
    console.log('└────┴────────────────┴────────────┴───────────────┴─────────────┴─────────────────────────────────────────────────┘\n');

    console.log('RECOMMENDED ACTIONS:');
    console.log(`1. Test the #1 engine above in your web browser: http://10.82.126.73:3000/ (Search: ${verifiedEngines[0].engine_number})`);
    console.log(`2. Inspect detailed logs for the #1 engine: node -r dotenv/config find_yokota_engines.js ${verifiedEngines[0].engine_number}\n`);
}

async function main() {
    try {
        await scanAndRankAllEngines();
    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main();
