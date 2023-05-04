const { catchAsyncError } = require("../middleware/catchAsyncError");
const ChangePoint = require("../models/changepoint");
const ErrorHandler = require("../utils/errorHanler.js");

exports.createChangePoint = catchAsyncError(async (req, res, next) => {
  const changePoint = await ChangePoint.create(req.body);
  
  if (!changePoint) {
    return next(new ErrorHandler("Error, could not save change points", 401));
  }
  res
    .status(201)
    .json({ success: true, message: "Change point added successfully" });
});

exports.updateChangePoint = catchAsyncError(async (req, res, next) => {
  const changePoint = await ChangePoint.findById(req.params.id);

  if (!changePoint) {
    return next(new ErrorHandler("change point not found", 400));
  }

  const result = await ChangePoint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res
    .status(202)
    .json({ success: true, message: "update succesfully", result });
});


exports.deleteChangePoint = catchAsyncError(async (req, res, next) => {
  const changePoint = await ChangePoint.findById(req.params.id);

  if (!changePoint) {
    return next(new ErrorHandler("change point not found", 400));
  }

  const result = await ChangePoint.findByIdAndDelete(req.params.id);
  res
    .status(202)
    .json({ success: true, message: "Deleted succesfully"});
});

exports.getChangePoint = catchAsyncError(async (req, res, next) => {
  const changePoint = await ChangePoint.findById(req.params.id);

  if (!changePoint) {
    return next(new ErrorHandler("change point not found", 400));
  }

  res
    .status(200)
    .json({ success: true, changePoint});
});

exports.getAllChangePoints=catchAsyncError(async(req, res, next)=>{
  const changePoints = await ChangePoint.find()

  if(!changePoints){
    return next(new ErrorHandler("no change points were found", 400))
  }

  const totalCount = await ChangePoint.countDocuments()
  res.status(200).json({success:true , totalCount, changePoints})

})