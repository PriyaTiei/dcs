const express = require("express");
const router = express.Router();
const { createDefectForm, getDefectForms } = require("../controllers/dcs-form");
const { uploadImage } = require("../controllers/image");

router.post("/dcs-form", createDefectForm);
router.get("/dcs-forms", getDefectForms);
router.post("/dcs-forms/upload-image", uploadImage);

module.exports = router;
