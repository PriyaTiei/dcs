// const express = require('express');
// const router = express.Router();
// const { getImpactWrenchData } = require('../controllers/impactWrenchController');
// const { getYokotaData } = require('../controllers/yokotaController'); 
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
//     getIGCoilImagesByEngineNumber,
//     getIndividualIGCoilImage,
// } = require('../controllers/part_traceabilityctrl');

// // Original impact wrench route (unchanged)
// router.get('/impactWrench/:engineNo', getImpactWrenchData);

// // New route for special stations (61, 60, 58)
// router.get('/yokota/:engineNo', getYokotaData); // Add this route

// // Keep all existing routes unchanged
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
// router.get('/ig-coil-images/:engineNo', getIGCoilImagesByEngineNumber);
// router.get('/ig-coil-images/:engineNo/:folder/:filename', getIndividualIGCoilImage);

// module.exports = router;








const express = require('express');
const router = express.Router();
const { getImpactWrenchData, getTorqueDataByDateRange } = require('../controllers/impactWrenchController');
const { getYokotaData } = require('../controllers/yokotaController'); 
const { 
    getIgCoil_ChainCoverData, 
    getChainCaseData,
    getChainCoverData,
    getFuelDeliveryPipeData,
    getPCVData,
    getWireHarnessData,    
    getCamHousingData,
    getCamHousingImagesByCamHousingSN, 
    getConnectingRodData,
    getPortInjectorData,
    getChainCaseImageByEngineNumber,
    getIGCoilImagesByEngineNumber,
    getIndividualIGCoilImage,
    getChainCoverImagesByEngineNumber,
    getIndividualConnectingRodImage,
    getConnectingRodImagesByEngineNumber,
} = require('../controllers/part_traceabilityctrl');

// Import station tool map controller
const {
    getStationToolMap,
    addStationToolMap,
    updateStationToolMap,
    deleteStationToolMap
} = require('../controllers/stationToolMapController');

// Original impact wrench route (unchanged)
router.get('/impactWrench/:engineNo', getImpactWrenchData);
router.get('/torque-data-by-date-range/:stationNumber', getTorqueDataByDateRange);
// New route for special stations (61, 60, 58)
router.get('/yokota/:engineNo', getYokotaData); // Add this route

// Station Tool Map routes
router.get('/station-tool-map', getStationToolMap);
router.post('/station-tool-map', addStationToolMap);
router.put('/station-tool-map/:oldStation/:oldFolder', updateStationToolMap);
router.delete('/station-tool-map/:station/:folder', deleteStationToolMap);


// Keep all existing routes unchanged
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
// router.get('/ig-coil-images/:engineNo', getIGCoilImagesByEngineNumber);
// router.get('/ig-coil-images/:engineNo/:folder/:filename', getIndividualIGCoilImage);
router.get('/ig-coil-images/:engineNo', getIGCoilImagesByEngineNumber);
router.get('/ig-coil-images/:engineNo/:imageIndex', getIndividualIGCoilImage);
router.get('/chaincover-image/:engineNo',getChainCoverImagesByEngineNumber);
router.get('/camhousing-image/:camhousingSN', getCamHousingImagesByCamHousingSN);
// router.get('/connecting-rod-images/:engineNo', getConnectingRodImagesByEngineNumber);
// router.get('/connecting-rod-images/:engineNo/:folder/:filename', getIndividualConnectingRodImage);

router.get('/connecting-rod-images/:engineNo', getConnectingRodImagesByEngineNumber);
router.get('/connecting-rod-images/:engineNo/:imageIndex', getIndividualConnectingRodImage);

module.exports = router;