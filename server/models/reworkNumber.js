const mongoose = require("mongoose");

const reworkNumberSchema = new mongoose.Schema(
  {
    engineNo: {
      type: String,
      required: [true, "please Input engine number - engineNo"],
    },
    imageName: {
      type: String,
      required: [true, "please Input ImageName - imageName"],
    },
  },
  { timestamps: true }
);

const reworkNumber = mongoose.model("rework_number", reworkNumberSchema);

module.exports = reworkNumber;
