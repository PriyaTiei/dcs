const mongoose = require("mongoose");

const crankSchema = new mongoose.Schema({
  engineNo: {
    type: String,
    required: true,
  },

  crankHousingNum: { 
    type: String, 
    required: true },
  crankHousingCastingNum: { 
    type: String,
    required: true }
 
},{ timestamps: true });


const Crankinfo = mongoose.model("Crankinfo", crankSchema);

module.exports = Crankinfo;
