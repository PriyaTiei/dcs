const express = require("express");
const router = express.Router();
const { createDCS, getAllDCS } = require("../controllers/dcs-form");
const { uploadImage } = require("../controllers/image");

router.post("/dcs-form", createDCS);
router.get("/dcs-forms", getAllDCS);
router.post("/dcs-forms/upload-image", uploadImage);

module.exports = router;
