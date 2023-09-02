const express = require("express");
const {
  getEngineData,
  getDateData,
  getPartData,
  getDateRangeData,
  getEngineNoMatchingSerialNoList,
} = require("../controllers/oracleDBController");
const router = express.Router();

router.route("/engineNo/:engineNo").get(getEngineData);
router.route("/date/:engineNo").get(getDateData);
router.route("/partNo/:partNo").get(getPartData);
router.route("/processNo/:processNo/fromDate/:fromDate/toDate/:toDate").get(getDateRangeData)
router.route("/serialNoListString").get(getEngineNoMatchingSerialNoList)



module.exports = router;
