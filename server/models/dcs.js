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
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const dcsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
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
    pqcs: [pqcsSchema],
  },
  { collection: "dcs-forms", timestamps: true }
);

const DCS = mongoose.model("Dcs", dcsSchema);

module.exports = DCS;