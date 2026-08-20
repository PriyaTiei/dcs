const pool = require('./connections/postgresDB');

async function findEnginesWithBoth() {
    try {
        // Find engines that have station tracking in stations 58, 60, 61 (Yokota) AND other stations (Impact Wrench)
        const query = `
            WITH all_tracking AS (
                SELECT engine_number, arrival_time, station_number::text as station_number FROM engine_tracking
                UNION ALL
                SELECT engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_two
                UNION ALL
                SELECT engine_number, arrival_time, station_number::text as station_number FROM engine_tracking_three
                UNION ALL
                SELECT engine_number, arrival_time, station_name as station_number FROM sub_assy
            )
            SELECT 
                engine_number,
                COUNT(DISTINCT station_number) as station_count,
                MAX(arrival_time) as latest_arrival,
                ARRAY_AGG(DISTINCT station_number) as stations
            FROM all_tracking
            WHERE engine_number IS NOT NULL AND engine_number != ''
            GROUP BY engine_number
            HAVING 
                ARRAY['58', '60', '61']::text[] && ARRAY_AGG(DISTINCT station_number)
            ORDER BY latest_arrival DESC
            LIMIT 10;
        `;
        
        const res = await pool.query(query);
        console.log("=== ENGINES WITH BOTH YOKOTA & WRENCH DATA ===");
        res.rows.forEach(r => {
            console.log(`Engine: ${r.engine_number} | Latest: ${r.latest_arrival} | Stations: ${r.stations.join(', ')}`);
        });
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        process.exit(0);
    }
}

findEnginesWithBoth();
