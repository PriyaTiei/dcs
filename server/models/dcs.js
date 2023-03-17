const mongoose = require("mongoose");

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
    partNo: {
      type: String,
      required: true,
    },
    defectType: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { collection: "dcs-forms" }
);

const DCS = mongoose.model("Dcs", dcsSchema);

module.exports = DCS;
