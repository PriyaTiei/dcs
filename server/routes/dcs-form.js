const express = require("express");
const router = express.Router();
const { createDCS, getAllDCS } = require("../controllers/dcs-form");
const { uploadImage, uploadImage2 } = require("../controllers/image");

router.post("/dcs-form", createDCS);
router.get("/dcs-forms", getAllDCS);
router.post("/dcs-form/upload-image", uploadImage);
router.post("/reworkImages", uploadImage2);

module.exports = router;
