const express = require("express");
const {
  getEngineData,
  getDateData,
  getPartData,
  getDateRangeData,
  getEngineNoMatchingSerialNoList,
  getDispatchDatesMatchingEnigneNoList,
  getCastNoDateRangeData,
  getFullData,
  getFullDataAssy,
} = require("../controllers/oracleDBController");
const router = express.Router();

router.route("/engineNo/:engineNo").get(getEngineData);
router.route("/date/:engineNo").get(getDateData);
router.route("/partNo/:partNo").get(getPartData);
router.route("/processNo/:processNo/fromDate/:fromDate/toDate/:toDate").get(getDateRangeData)
router.route("/serialNoListString").post(getEngineNoMatchingSerialNoList)
router.route("/dispatchDates/engineNoListString").post(getDispatchDatesMatchingEnigneNoList)
router.route("/parts/castingNo").get(getCastNoDateRangeData)
router.route("/getFullData/:processNo/fromDate/:fromDate/toDate/:toDate").get(getFullData)
router.route("/getFullDataAssy/:processNo/fromDate/:fromDate/toDate/:toDate").get(getFullDataAssy)






module.exports = router;
