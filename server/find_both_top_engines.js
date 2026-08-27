const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const pool = require('./connections/postgresDB');
const axios = require('axios');

async function findEnginesWithBothSystems() {
    console.log('================================================================================');
    console.log('SEARCHING ENGINES WITH HIGHEST COMBINED YOKOTA (10 TOOLS) & URYU (61 TOOLS) DATA');
    console.log('================================================================================\n');

    // 1. Query top production dates from tracking
    const topDates = ['2026-08-18', '2026-08-17', '2026-08-14', '2026-08-13', '2026-08-07', '2026-08-19', '2026-08-26'];
    
    console.log('1. Querying PostgreSQL for engines produced across dates: ' + topDates.join(', ') + '...');
    
    const candidateQuery = `
        SELECT DISTINCT engine_number, arrival_time::date::text as prod_date
        FROM (
            SELECT engine_number, arrival_time FROM engine_tracking WHERE arrival_time::date::text = ANY($1)
            UNION ALL
            SELECT engine_number, arrival_time FROM engine_tracking_two WHERE arrival_time::date::text = ANY($1)
            UNION ALL
            SELECT engine_number, arrival_time FROM engine_tracking_three WHERE arrival_time::date::text = ANY($1)
        ) t
        WHERE engine_number IS NOT NULL AND engine_number != ''
        ORDER BY prod_date DESC
        LIMIT 100;
    `;

    const res = await pool.query(candidateQuery, [topDates]);
    console.log(`   Found ${res.rows.length} candidate engines to check.\n`);
    console.log('2. Querying both APIs (/api/yokota & /api/impactWrench) for each engine...');

    const leaderboard = [];

    for (let i = 0; i < res.rows.length; i++) {
        const eng = res.rows[i].engine_number;
        const dt = res.rows[i].prod_date;

        try {
            // Run both API requests in parallel for maximum speed
            const [yokotaResp, uryuResp] = await Promise.allSettled([
                axios.get(`http://localhost:5081/api/yokota/${eng}`, { timeout: 3500 }),
                axios.get(`http://localhost:5081/api/impactWrench/${eng}`, { timeout: 3500 })
            ]);

            const yokotaData = (yokotaResp.status === 'fulfilled' && Array.isArray(yokotaResp.value.data)) ? yokotaResp.value.data : [];
            const uryuData = (uryuResp.status === 'fulfilled' && Array.isArray(uryuResp.value.data)) ? uryuResp.value.data : [];

            const yokotaTools = Array.from(new Set(yokotaData.map(r => r.tool_name || r.station)));
            const uryuTools = Array.from(new Set(uryuData.map(r => r.tool_name || r.station_number)));

            const totalBolts = yokotaData.length + uryuData.length;

            if (yokotaData.length > 0 || uryuData.length > 0) {
                leaderboard.push({
                    engine_number: eng,
                    prod_date: dt,
                    yokotaToolCount: yokotaTools.length,
                    yokotaBolts: yokotaData.length,
                    uryuToolCount: uryuTools.length,
                    uryuBolts: uryuData.length,
                    totalBolts: totalBolts
                });
            }
            process.stdout.write(`\r   Checked ${i + 1}/${res.rows.length} engines... Found: ${leaderboard.length} with data`);
        } catch {}
    }

    console.log('\n');

    if (leaderboard.length === 0) {
        console.log('No data returned. Checking default sample NG60753...');
        return;
    }

    // Sort by highest combined tools & bolts
    leaderboard.sort((a, b) => (b.yokotaToolCount + b.uryuToolCount) - (a.yokotaToolCount + a.uryuToolCount) || b.totalBolts - a.totalBolts);

    console.log('================================================================================');
    console.log('TOP ENGINES RANKED BY HIGHEST COMBINED YOKOTA & URYU TIGHTENING DATA:');
    console.log('================================================================================');
    console.log('┌────┬────────────────┬────────────┬──────────────────┬─────────────────┬─────────────┐');
    console.log('│ #  │ Engine Number  │ Prod Date  │ Yokota Tools     │ URYU Tools      │ Total Bolts │');
    console.log('├────┼────────────────┼────────────┼──────────────────┼─────────────────┼─────────────┤');

    leaderboard.slice(0, 20).forEach((item, idx) => {
        const num = String(idx + 1).padEnd(2);
        const eng = item.engine_number.padEnd(14);
        const dt = item.prod_date.padEnd(10);
        const yk = `${item.yokotaToolCount} / 10 tools (${item.yokotaBolts}b)`.padEnd(16);
        const ur = `${item.uryuToolCount} tools (${item.uryuBolts}b)`.padEnd(15);
        const total = `${item.totalBolts} bolts`.padEnd(11);
        console.log(`│ ${num} │ ${eng} │ ${dt} │ ${yk} │ ${ur} │ ${total} │`);
    });
    console.log('└────┴────────────────┴────────────┴──────────────────┴─────────────────┴─────────────┘\n');

    console.log(`Top recommended engine to test on UI: ${leaderboard[0].engine_number}\n`);
}

async function main() {
    try {
        await findEnginesWithBothSystems();
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

main();
