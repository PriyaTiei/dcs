const { catchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/errorHandler");
const DCS = require("../models/dcs");
const ReworkNumber = require("../models/reworkNumber");

const createDCS = async (req, res) => {
  console.log("create called");
  const {
    date,
    time,
    engineNo,
    engineCode,
    defectContent,
    remarks,
    checker,
    image,
    pqcs,
    fallenPart,
    stnOccured,
    stnDetected,
  } = req.body;

  try {
    const dcs = new DCS({
      date,
      time,
      engineNo,
      engineCode,
      defectContent,
      remarks,
      checker,
      image,
      pqcs,
      fallenPart,
      stnOccured,
      stnDetected,
    });

    await dcs.save();

    res.status(201).json({ message: "DCS created successfully", dcs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create DCS", error });
  }
};

const getAllDCS = async (req, res) => {
  try {
    const dcs = await DCS.find().sort({ createdAt: -1 });

    res.status(200).json(dcs);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve DCS documents", error });
  }
};

exports.getDCSById = async (req, res) => {
  const { id } = req.params;

  try {
    const dcs = await DCS.findById(id);

    if (!dcs) {
      return res.status(404).json({ message: "DCS not found" });
    }

    res.status(200).json(dcs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve DCS document", error });
  }
};

exports.updateDCSById = async (req, res) => {
  const { id } = req.params;

  try {
    const dcs = await DCS.findByIdAndUpdate(id, req.body, { new: true });

    if (!dcs) {
      return res.status(404).json({ message: "DCS not found" });
    }

    res.status(200).json({ message: "DCS updated successfully", dcs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update DCS document", error });
  }
};

exports.deleteDCSById = async (req, res) => {
  const { id } = req.params;

  try {
    const dcs = await DCS.findByIdAndDelete(id);

    if (!dcs) {
      return res.status(404).json({ message: "DCS not found" });
    }

    res.status(200).json({ message: "DCS deleted successfully", dcs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete DCS document", error });
  }
};

const storeImageFileName = catchAsyncError(async (req, res, next) => {
  const engineNo = req.body.engineNo;
  const imageName = req.body.imageName;


  const reworkNumber = await ReworkNumber.create({ engineNo, imageName });
  if (!reworkNumber) {
    return next(new ErrorHandler("could not add rework engine number", 500));
  }
  res.status(202).json({ message: "successfully stored rework engine number" });
});

// ********store multple data of images*********
const storeImageFileNameMultiple = catchAsyncError(async (req, res, next) => {
  const { engineNo, imagesNameList, checkedBy, commonRemarks } = req.body;


  imagesNameList.forEach(async (element) => {
    const reworkNumber = await ReworkNumber.create({
      engineNo,
      imageName: element,
      checkedBy,
      commonRemarks,
    });
    if (!reworkNumber) {
      return next(new ErrorHandler("could not add rework engine number", 500));
    }
  });
  res.status(202).json({ message: "successfully stored rework engine number" });
});

// ***************send list of rework numbers*******
const reworkNumber = catchAsyncError(async (req, res, next) => {
  const engineNo = req.params.engineNo;
 
  const result = await ReworkNumber.find({ engineNo });
  if (result.length == 0) {
    console.log("not found");
    return next(new ErrorHandler("No image with this number", 404));
  }
  res.status(200).json({ result });
});

// ******exports********
module.exports = {
  createDCS,
  getAllDCS,
  storeImageFileName,
  storeImageFileNameMultiple,
  reworkNumber,
};
