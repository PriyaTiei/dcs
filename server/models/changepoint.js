const mongoose = require("mongoose");

const changePointSchema = new mongoose.Schema({
  entryDate: {
    type: Date,
    required: true,
    default: new Date(Date.now()),
  },
  m4: {
    type: String,
    required: [true, "Please chose 4M / Enter the 4M"],
  },
  line: {
    type: String,
    required: [true, "Please chose the line"],
  },
  station: {
    type: String,
    required: [true, "Please choose Station / Operaiton No."],
  },
  changePoint: {
    type: String,
    required: [true, "Please enter change point"],
  },

  reason: {
    type: String,
    required: [true, "Please enter reason"],
  },
  action: {
    type: String,
    required: [true, "Please enter change action"],
  },
  traceability: {
    type: String,
    required: [
      true,
      "Please enter traceability number from start of change point",
    ],
  },
  result: {
    type: String,
    required: [true, "Please enter result either OK or NG"],
  },
  next: {
    type: String,
    
  },
  responsibility: {
    type: String,
  },
  countermeasure: {
    type: String,
  },
});

module.exports = mongoose.model("changepoints", changePointSchema);
