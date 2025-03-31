const pool = require('../connections/postgresDB');

const getIgCoil_ChainCoverData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT ig_coil_sl_no, chain_cover_sl_no, time_of_scan
            FROM ig_coil_chain_cover
            WHERE engine_number = $1
        `;

        console.log('Executing Query for Engine No:', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching data' 
        });
    }
};

// Controller for fetching camshaft data
const getCamShaftData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT cam_housing_sl_no, cam_shaft_intake_sl_no, cam_shaft_exhaust_sl_no, time_of_scan
            FROM camshaft_rfid
            WHERE engine_number = $1
        `;

        console.log('Executing Query for Camshaft Data (Engine No):', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No camshaft data found for this engine number' 
            });
        }

        res.json(result.rows[0]); // Return the first row (latest record)
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching camshaft data' 
        });
    }
};

module.exports = { getIgCoil_ChainCoverData, getCamShaftData };
