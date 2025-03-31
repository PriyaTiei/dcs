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

// Controller for fetching chain case data
const getChainCaseData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT part_number, engine_number, scan_time
            FROM public.chaincase_final
            WHERE engine_number = $1
            ORDER BY scan_time DESC
        `;

        console.log('Executing Query for Chain Case Data (Engine No):', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No chain case data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching chain case data' 
        });
    }
};

// Controller for fetching fuel delivery pipe data
const getFuelDeliveryPipeData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT part_number, engine_number, scan_time
            FROM public.fueldeliverypipe_final
            WHERE engine_number = $1
            ORDER BY scan_time DESC
        `;

        console.log('Executing Query for Fuel Delivery Pipe Data (Engine No):', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No fuel delivery pipe data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching fuel delivery pipe data' 
        });
    }
};

// Controller for fetching PCV data
const getPCVData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT part_number, engine_number, scan_time
            FROM public.pcv_final
            WHERE engine_number = $1
            ORDER BY scan_time DESC
        `;

        console.log('Executing Query for PCV Data (Engine No):', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No pcv data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching pcv data' 
        });
    }
};

// Controller for fetching wire harness data
const getWireHarnessData = async (req, res) => {
    try {
        const { engineNo } = req.params;

        const query = `
            SELECT part_number, engine_number, scan_time
            FROM public.wireharness_final
            WHERE engine_number = $1
            ORDER BY scan_time DESC
        `;

        console.log('Executing Query for Wire Harness Data (Engine No):', engineNo);

        const result = await pool.query(query, [engineNo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No wire harness data found for this engine number' 
            });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            message: 'Error fetching wire harness data' 
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
            WHERE cam_housing_sl_no = $1
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

module.exports = { 
    getIgCoil_ChainCoverData, 
    getChainCaseData, 
    getFuelDeliveryPipeData,
    getPCVData,
    getWireHarnessData,
    getCamShaftData 
};
