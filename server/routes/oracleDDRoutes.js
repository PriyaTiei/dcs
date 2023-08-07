const express = require("express");
const {
  getEngineData,
  getDateData,
  getPartData,
} = require("../controllers/oracleDBController");
const router = express.Router();

router.route("/engineNo/:engineNo").get(getEngineData);
router.route("/date/:engineNo").get(getDateData);
router.route("/partNo/:partNo").get(getPartData);


module.exports = router;
