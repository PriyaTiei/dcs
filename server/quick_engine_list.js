const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./connections/postgresDB');

// Best dates = ones where all 10 Yokota controller folders exist on disk
const BEST_DATES = ['2026-08-18', '2026-08-17', '2026-08-14', '2026-08-13', '2026-08-07'];

async function quickFindEngines() {
    console.log('================================================================');
    console.log('QUICK ENGINE LIST - No API calls, just DB query');
    console.log('================================================================\n');
    console.log(`Querying engines from best production dates: ${BEST_DATES.join(', ')}\n`);

    const sql = `
        SELECT DISTINCT engine_number, arrival_time::date::text as prod_date, arrival_time
        FROM (
            SELECT engine_number, arrival_time FROM engine_tracking WHERE arrival_time::date::text = ANY($1)
            UNION ALL
            SELECT engine_number, arrival_time FROM engine_tracking_two WHERE arrival_time::date::text = ANY($1)
            UNION ALL
            SELECT engine_number, arrival_time FROM engine_tracking_three WHERE arrival_time::date::text = ANY($1)
        ) t
        WHERE engine_number IS NOT NULL AND engine_number != ''
        ORDER BY arrival_time DESC
        LIMIT 30;
    `;

    const res = await pool.query(sql, [BEST_DATES]);
    console.log(`Found ${res.rows.length} engines. These are the BEST engines to test (produced on dates with all 10 Yokota controllers active on disk):\n`);

    console.log('  #  | Engine Number   | Production Date');
    console.log('-----|-----------------|-----------------');
    res.rows.forEach((row, i) => {
        console.log(`  ${String(i + 1).padStart(2)}  | ${row.engine_number.padEnd(15)} | ${row.prod_date}`);
    });

    console.log('\n>>> Test any of the above engine numbers in the DCS UI at http://10.82.126.73:3000');
    console.log('>>> They should all have Yokota AND URYU tightening data.\n');
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
