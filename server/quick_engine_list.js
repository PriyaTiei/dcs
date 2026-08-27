const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./connections/postgresDB');

// Best dates = ones where all 10 Yokota controller folders exist on disk
const BEST_DATES = ['2026-08-18', '2026-08-17', '2026-08-14', '2026-08-13', '2026-08-07'];

// Yokota station numbers - engines must arrive at these stations on the best dates
// (Yokota tightening is at the END of the assembly line)
const YOKOTA_STATIONS = ['17', '20', '21', '43', '45', '53', '58', '59', '60', '61'];

async function quickFindEngines() {
    console.log('================================================================');
    console.log('QUICK ENGINE LIST - Filtered by YOKOTA STATION arrivals');
    console.log('================================================================\n');
    console.log(`Querying engines whose YOKOTA tightening happened on best dates: ${BEST_DATES.join(', ')}`);
    console.log(`Yokota Stations checked: ${YOKOTA_STATIONS.join(', ')}\n`);

    // KEY FIX: Filter by YOKOTA STATION arrivals specifically (not just any station).
    // Engines enter the line on one date but reach Yokota stations at the END of the
    // line (often the next morning). So we must filter by the arrival_time at the
    // Yokota stations themselves to match the correct CSV files on disk.
    const sql = `
        SELECT DISTINCT engine_number, arrival_time::date::text as prod_date, MAX(arrival_time) as last_yokota_time
        FROM (
            SELECT engine_number, arrival_time FROM engine_tracking
            WHERE arrival_time::date::text = ANY($1) AND station_number::text = ANY($2)
            UNION ALL
            SELECT engine_number, arrival_time FROM engine_tracking_two
            WHERE arrival_time::date::text = ANY($1) AND station_number::text = ANY($2)
            UNION ALL
            SELECT engine_number, arrival_time FROM engine_tracking_three
            WHERE arrival_time::date::text = ANY($1) AND station_number::text = ANY($2)
        ) t
        WHERE engine_number IS NOT NULL AND engine_number != ''
        GROUP BY engine_number, arrival_time::date::text
        ORDER BY prod_date DESC, last_yokota_time DESC
        LIMIT 30;
    `;

    const res = await pool.query(sql, [BEST_DATES, YOKOTA_STATIONS]);
    console.log(`Found ${res.rows.length} engines whose Yokota tightening was on a date with ALL 10 controllers active.\n`);

    console.log('  #  | Engine Number   | Yokota Date  | Last Yokota Station Time');
    console.log('-----|-----------------|--------------|---------------------------');
    res.rows.forEach((row, i) => {
        const time = new Date(row.last_yokota_time).toLocaleTimeString('en-IN', { hour12: false });
        console.log(`  ${String(i + 1).padStart(2)}  | ${row.engine_number.padEnd(15)} | ${row.prod_date}  | ${time}`);
    });

    console.log('\n>>> These engines have their Yokota CSV files on dates where ALL 10 controllers have data!');
    console.log('>>> Test them in the DCS UI at http://10.82.126.73:3000\n');
}

async function main() {
    try {
        await quickFindEngines();
    } catch (err) {
        console.error('DB Error:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main();
