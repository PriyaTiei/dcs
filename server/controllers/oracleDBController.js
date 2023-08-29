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

// Single engine data fetchining
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


// part data fetching using serialno
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


// get shippment history for Single engine
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

// Get part data from specific date range
exports.getDateRangeData = catchAsyncError(async (req, res, next) => {
  const {processNo, fromDate, toDate} = req.params;
  console.log(processNo)
 
  
  // const tempFromDate = new Date("2023-06-29T00:00:01.000Z")
  // const tempToDate= new Date("2023-06-29T23:59:59.000Z")
  // const tempProcessNo = "B3_OP190"

  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,
    "select * from KTTMSYS.T_MCHNSTJHO WHERE HNSTKNRIMEI =:value0 AND KSNDTTM BETWEEN :value1 AND :value2",
    [processNo, new Date(fromDate),new Date(toDate)],
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

