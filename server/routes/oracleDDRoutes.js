const express = require("express")
const { getSampleData } = require("../controllers/oracleDBController")
const router = express.Router()





router.route("/test/:engineNo").get(getSampleData)





module.exports = router