const mongoose = require("mongoose");

const pqcsSchema = new mongoose.Schema(
  {
    bolt: {
      type: String,
      required: true,
    },
    inspectionTorque: {
      type: Number,
      required: true,
    },
    measurements: {
      type: [Number],
      required: true,
    },
    confirmation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const dcsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    engineNo: {
      type: String,
      required: true,
    },
    engineCode: {
      type: String,
      required: true,
    },
    defectContent: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: false,
    },
    checker: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    fallenPart: {
      type: String,
      required: false, 
      default : null
    },
    stnOccured: {
      type: String,
      required: true, 
    },
    stnDetected: {
      type: String,
      required: true, 
    },
    pqcs: [pqcsSchema],
  },
  { collection: "dcs-forms", timestamps: true }
);

const DCS = mongoose.model("Dcs", dcsSchema);

module.exports = DCS;