const express = require("express");
const router = express.Router();

//everything being fetched from newControllers file in controllers folder
const {
    crankDisplay,getCrankinfoById, updateCrankinfoById,deleteCrankinfoById,createNewCrankinfo
} = require("../controllers/newController");

router.post("/crankinfo", createNewCrankinfo); //insert new document
router.get("/crankinfo", crankDisplay); //display all documents
router.delete("/crankinfo/:id",deleteCrankinfoById);
router.get("/crankinfo/:id",getCrankinfoById);
router.put("/crankinfo/:id",updateCrankinfoById);
module.exports = router;

