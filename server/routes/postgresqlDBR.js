const express = require('express');
const router = express.Router();
const { getImpactWrenchData } = require('../controllers/impactWrenchController');
const { getPartTraceabilityData } = require('../controllers/part_traceabilityctrl');

router.get('/impactWrench/:engineNo', getImpactWrenchData);
router.get('/partTraceability/:engineNo', getPartTraceabilityData);

module.exports = router;