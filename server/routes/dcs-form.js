const express = require("express");
const router = express.Router();
const {
  createDCS,
  getAllDCS,
  storeImageFileName,
  reworkNumber,
  storeImageFileNameMultiple
} = require("../controllers/dcs-form");
const {
  uploadImage,
  uploadImage2,
  uploadImageMultiple,
  getImage,
  
} = require("../controllers/image");

router.post("/dcs-form", createDCS);
router.get("/dcs-forms", getAllDCS);
router.post("/dcs-form/upload-image", uploadImage);
router.post("/reworkImages", uploadImage2, storeImageFileName);
router.get("/reworkImages/:imageName", getImage);
router.get("/reworkImagesList/:engineNo", reworkNumber);
router.post(
  "/reworkImagesMultiple",
  uploadImageMultiple,
  storeImageFileNameMultiple
);
module.exports = router;
