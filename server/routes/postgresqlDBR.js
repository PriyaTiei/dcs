const express = require('express');
const router = express.Router();
const { getImpactWrenchData } = require('../controllers/impactWrenchController');
const { getIgCoil_ChainCoverData } = require('../controllers/part_traceabilityctrl');
const { getCamShaftData } = require('../controllers/part_traceabilityctrl');

router.get('/impactWrench/:engineNo', getImpactWrenchData);
router.get('/ig_coil_chain_cover/:engineNo', getIgCoil_ChainCoverData);
router.get('/cam_shaft/:engineNo', getCamShaftData);

module.exports = router;