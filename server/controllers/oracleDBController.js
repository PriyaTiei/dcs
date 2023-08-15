const { catchAsyncError } = require("../middleware/catchAsyncError");

const oracledb = require("oracledb");
const ErrorHandler = require("../middleware/errorHandler");

const oracleDBConnection = async () => {
  var connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_USER,
      connectionString: process.env.ORACLEDB_URL,
    });
    console.log("Oracle connection successful");
    connection.commit();
    return connection;
  } catch (err) {
    console.log(err);
  }
};
exports.getEngineData = catchAsyncError(async (req, res, next) => {
  const engineNo = req.params.engineNo;

  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,
    "select * from KTTMSYS.T_HNSTJHO WHERE EGNO=:value",
    [engineNo],
    {
      // maxRows: 2
    }
  );

  if (result.rows.length == 0) {
    console.log("Engine not found");
    return new ErrorHandler("Engine no. do not exist", 401);
  }
  console.table(Object.keys(result));
  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows });
});

exports.getPartData = catchAsyncError(async (req, res, next) => {
  let partNo = req.params.partNo;
 partNo = partNo + "    ";

  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,s
    "select * from KTTMSYS.T_MCHNSTJHO WHERE SRALNO=:value",
    [partNo],
    {
      // maxRows: 2
    }
  );

  if (result.rows.length == 0) {
    console.log("Machining Parts not found");
    return new ErrorHandler("Machining Parts do not exist", 401);
  }
  console.table(Object.keys(result));
  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows });
});

exports.getDateData = catchAsyncError(async (req, res, next) => {
  const engineNo = req.params.engineNo;

  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,
    "select * from KTTMSYS.T_SISNJSSKI WHERE EGNO=:value",
    [engineNo],
    {
      // maxRows: 2
    }
  );

  if (result.rows.length == 0) {
    console.log("Engine not found");
    return new ErrorHandler("Engine no. do not exist", 401);
  }
  console.table(Object.keys(result));
  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows, message:"for date" });
});
exports.getDateRangeData = catchAsyncError(async (req, res, next) => {
  const fromDate = req.params.fromDate;
  const toDate = req.params.toDate;

  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,
    "select * from KTTMSYS.T_MCHNSTJHO WHERE EGNO BETWEEN :value1 AND :value2",
    [fromDate, toDate],
    {
      // maxRows: 2
    }
  );

  if (result.rows.length == 0) {
    console.log("Engine not found");
    return new ErrorHandler("Engine no. do not exist", 401);
  }
  console.table(Object.keys(result));
  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows, message:"for dateRange" });
});

