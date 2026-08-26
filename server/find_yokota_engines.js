const pool = require('./connections/postgresDB');
const axios = require('axios');

async function findYokotaEngines() {
    try {
        console.log('Searching PostgreSQL for engines with the most Yokota station visits...\n');

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
            LIMIT 30;
        `;

        const res = await pool.query(query);

        if (res.rows.length === 0) {
            console.log('No engines found with Yokota station tracking.');
            return;
        }

        console.log('================================================================================');
        console.log(`TOP ENGINES WITH YOKOTA STATION TRACKING (${res.rows.length} FOUND)`);
        console.log('================================================================================\n');

        for (const row of res.rows) {
            const count = row.yokota_station_count;
            const engine = row.engine_number;
            const stations = row.stations_visited.join(', ');
            const date = new Date(row.latest_arrival).toISOString().split('T')[0];

            console.log(`Engine: ${engine.padEnd(12)} | Stations Count: ${String(count).padStart(2)} | Date: ${date} | Stations: [${stations}]`);
        }

        console.log('\n--------------------------------------------------------------------------------');
        console.log('Testing top engines against local Yokota DCS API (http://localhost:5081/api/yokota/:engineNo)...');
        console.log('--------------------------------------------------------------------------------\n');

        const topEngines = res.rows.slice(0, 5);
        for (const row of topEngines) {
            const eng = row.engine_number;
            try {
                const response = await axios.get(`http://localhost:5081/api/yokota/${eng}`, { timeout: 8000 });
                const records = Array.isArray(response.data) ? response.data : [];
                const uniqueTools = [...new Set(records.map(r => r.tool_name))];
                console.log(`>>> Engine ${eng}: ${records.length} bolt records returned across ${uniqueTools.length} tools!`);
                if (uniqueTools.length > 0) {
                    console.log(`    Tools: ${uniqueTools.join(', ')}`);
                }
            } catch (err) {
                console.log(`>>> Engine ${eng}: API call failed or timed out (${err.message})`);
            }
        }

    } catch (err) {
        console.error('Error finding engines:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

findYokotaEngines();
