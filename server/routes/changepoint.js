const express = require("express")
const {createChangePoint, updateChangePoint, deleteChangePoint, getChangePoint, getAllChangePoints, getChangePointsCount}= require("../controllers/changePoint")

const router = express.Router()

router.route("/add").post(createChangePoint)
router.route("/update/:id").put(updateChangePoint)
router.route("/delete/:id").delete(deleteChangePoint)
router.route("/get/:id").get(getChangePoint)
router.route("/getAllChangePoints").get(getAllChangePoints)
router.route("/getChangePointsCount").get(getChangePointsCount)

module.exports = router