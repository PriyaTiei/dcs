const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/dcs-form-images/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + "-" + Date.now() + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
}).single("image");

const uploadImage = (req, res) => {
  console.log("Image Called");
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
    const imagePath = "dcs-form-images/" + req.file.filename;
    res.json({ imagePath });
  });
};

// ******* Storage for images uploaded from mobile for Egnine rework

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/reworkImages/");
  },
  filename: function (req, file, cb) {
    let engineNo= req.body.engineNo
    console.log(req.body.engineNo);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const dt = new Date(Date.now());
    const y = dt.getFullYear();
    const mn = dt.getMonth() + 1;
    const d = dt.getDate();
    const h = dt.getHours();
    const m = dt.getMinutes();
    const s = dt.getSeconds();
    const ms = dt.getMilliseconds();
    cb(
      null,
      engineNo + "_" + y + "_" + mn + "_" + d+ "_"  + h + "_" + m + "_" + s + ms + ext
    );
  },
});

const upload2 = multer({
  storage: storage2,
  // fileFilter: function (req, file, cb) {
  //   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //     return cb(new Error("Only image files are allowed!"));
  //   }
  //   cb(null, true);
  // },
}).single("image");

const uploadImage2 = (req, res) => {
  console.log("Image2 from phone Called");
  console.log(req.body); //here it is not pasing req.body
  upload2(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }
    const imagePath = "reworkImages/" + req.file.filename;
    res.json({ imagePath });
  });
};

module.exports = { uploadImage, uploadImage2 };
