const express = require('express');
const router = express.Router();
const { getImpactWrenchData } = require('../controllers/impactWrenchController');
const { 
    getIgCoil_ChainCoverData, 
    getChainCaseData,
    getFuelDeliveryPipeData,
    getPCVData,
    getWireHarnessData,
    getCamShaftData     
} = require('../controllers/part_traceabilityctrl');

router.get('/impactWrench/:engineNo', getImpactWrenchData);
router.get('/ig_coil_chain_cover/:engineNo', getIgCoil_ChainCoverData);
router.get('/chaincase/:engineNo', getChainCaseData);
router.get('/fueldeliverypipe/:engineNo', getFuelDeliveryPipeData);
router.get('/pcv/:engineNo', getPCVData);
router.get('/wireharness/:engineNo', getWireHarnessData);
router.get('/cam_shaft/:engineNo', getCamShaftData);

module.exports = router;