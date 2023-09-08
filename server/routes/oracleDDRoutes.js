const express = require("express");
const {
  getEngineData,
  getDateData,
  getPartData,
  getDateRangeData,
  getEngineNoMatchingSerialNoList,
  getDispatchDatesMatchingEnigneNoList,
  getCastNoDateRangeData,
} = require("../controllers/oracleDBController");
const router = express.Router();

router.route("/engineNo/:engineNo").get(getEngineData);
router.route("/date/:engineNo").get(getDateData);
router.route("/partNo/:partNo").get(getPartData);
router.route("/processNo/:processNo/fromDate/:fromDate/toDate/:toDate").get(getDateRangeData)
router.route("/serialNoListString").post(getEngineNoMatchingSerialNoList)
router.route("/dispatchDates/engineNoListString").post(getDispatchDatesMatchingEnigneNoList)
router.route("/parts/castingNo").get(getCastNoDateRangeData)






module.exports = router;
