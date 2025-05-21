// const express = require('express');
// const router = express.Router();
// const { getImpactWrenchData } = require('../controllers/impactWrenchController');
// const { 
//     getIgCoil_ChainCoverData, 
//     getChainCaseData,
//     getChainCoverData,
//     getFuelDeliveryPipeData,
//     getPCVData,
//     getWireHarnessData,    
//     getCamHousingData,
//     getConnectingRodData,
//     getPortInjectorData,
//     getChainCaseImageByEngineNumber,
// } = require('../controllers/part_traceabilityctrl');

// router.get('/impactWrench/:engineNo', getImpactWrenchData);
// router.get('/ig_coil_chain_cover/:engineNo', getIgCoil_ChainCoverData);
// router.get('/connecting_rod/:engineNo', getConnectingRodData);
// router.get('/chaincase/:engineNo', getChainCaseData);
// router.get('/chaincover/:engineNo', getChainCoverData);
// router.get('/fueldeliverypipe/:engineNo', getFuelDeliveryPipeData);
// router.get('/pcv/:engineNo', getPCVData);
// router.get('/wireharness/:engineNo', getWireHarnessData);
// router.get('/camhousing/:camhousingSN', getCamHousingData);
// router.get('/portinjector/:headSN', getPortInjectorData);
// router.get('/chaincase-image/:engineNo', getChainCaseImageByEngineNumber);




// module.exports = router;









const express = require('express');
const router = express.Router();
const { getImpactWrenchData } = require('../controllers/impactWrenchController');
const { 
    getIgCoil_ChainCoverData, 
    getChainCaseData,
    getChainCoverData,
    getFuelDeliveryPipeData,
    getPCVData,
    getWireHarnessData,    
    getCamHousingData,
    getConnectingRodData,
    getPortInjectorData,
    getChainCaseImageByEngineNumber,
    getIGCoilImagesByEngineNumber,
    getIndividualIGCoilImage,
} = require('../controllers/part_traceabilityctrl');

// Updated route for impact wrench data that now integrates all three APIs
router.get('/impactWrench/:engineNo', getImpactWrenchData);

// Keep the existing routes unchanged
router.get('/ig_coil_chain_cover/:engineNo', getIgCoil_ChainCoverData);
router.get('/connecting_rod/:engineNo', getConnectingRodData);
router.get('/chaincase/:engineNo', getChainCaseData);
router.get('/chaincover/:engineNo', getChainCoverData);
router.get('/fueldeliverypipe/:engineNo', getFuelDeliveryPipeData);
router.get('/pcv/:engineNo', getPCVData);
router.get('/wireharness/:engineNo', getWireHarnessData);
router.get('/camhousing/:camhousingSN', getCamHousingData);
router.get('/portinjector/:headSN', getPortInjectorData);
router.get('/chaincase-image/:engineNo', getChainCaseImageByEngineNumber);
router.get('/ig-coil-images/:engineNo',getIGCoilImagesByEngineNumber);
router.get('/ig-coil-images/:engineNo/:folder/:filename',getIndividualIGCoilImage);

module.exports = router;