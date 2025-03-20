const pool = require('../connections/postgresDB');

const getPartTraceabilityData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT ig_coil_sl_no, chain_cover_sl_no, created_at
            FROM ig_coil_chain_cover
            WHERE engine_number = $1
        `;

        console.log('Executing Query for Engine No:', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No part traceability data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching part traceability data' 
        });
    }
};

module.exports = { getPartTraceabilityData };
