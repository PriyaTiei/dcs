const { catchAsyncError } = require("../middleware/catchAsyncError");
const ChangePoint = require("../models/changepoint");
const ApiFeatureHead = require("../utils/alterApi");
const ErrorHandler = require("../middleware/errorHandler.js");

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
  res.status(202).json({ success: true, message: "Deleted succesfully" });
});

exports.getChangePointsCount = catchAsyncError(async (req, res, next) => {
  const changePointCount = await ChangePoint.count();

  if (!changePointCount) {
    return next(new ErrorHandler("change point not found", 400));
  }

  res.status(200).json({ success: true, totalPages: changePointCount / 2 });
});

exports.getChangePoint = catchAsyncError(async (req, res, next) => {
  const changePoint = await ChangePoint.findById(req.params.id);

  if (!changePoint) {
    return next(new ErrorHandler("change point not found", 400));
  }

  res.status(200).json({ success: true, changePoint });
});

exports.getAllChangePoints = async (req, res, next) => {
  const headObject = new ApiFeatureHead(ChangePoint, req.query.filtered)
    .filter()
    .pagination(req.query.currentPage, req.query.docsPerPage);

  const headCheckList = await headObject.query;

  if (headCheckList.length === 0) {
    return next(new ErrorHandler("could not find check list", 404));
  }

  var totalDoc = await ChangePoint.countDocuments(headObject.newQueryStr);

  var totalCount = totalDoc / req.query.docsPerPage;
  // return results
  res
    .status(201)
    .json({ success: true, headCheckList, totalCount: Math.ceil(totalCount) });
};
