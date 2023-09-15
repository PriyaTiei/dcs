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

  res
    .status(200)
    .json({ coloumns: allColumnNames, data: result.rows, message: "for date" });
});

// Get part data from specific date range
exports.getDateRangeData = catchAsyncError(async (req, res, next) => {
  let { processNo, fromDate, toDate } = req.params;
  
  console.log(processNo)
  if(processNo==="H1_Material_input_engraving"){
    processNo="H1_Material input/engraving"
  }

  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,
    "select * from KTTMSYS.T_MCHNSTJHO WHERE HNSTKNRIMEI =:value0 AND KSNDTTM BETWEEN :value1 AND :value2",
    [processNo, new Date(fromDate), new Date(toDate)],
    {
      // maxRows: 2
    }
  );
console.log("what is the resutl")
  if (result.rows.length == 0) {
    console.log("Engine not found");
    return new ErrorHandler("Engine no. do not exist", 401);
  }
  console.table(Object.keys(result));
  const allColumnNames = result.metaData.map((item) => item.name);
  result.rows.sort((a, b) => a[2] - b[2]);
  res.status(200).json({
    coloumns: allColumnNames,
    data: result.rows,
    message: "for dateRange",
  });
});

// Get Engine nos matching list of part serial no.
exports.getEngineNoMatchingSerialNoList = catchAsyncError(
  async (req, res, next) => {
    const { serialNoListString } = req.body;
    const serialNoList = serialNoListString.split(",");

    const placeholders = serialNoList.map((_, i) => `:value${i}`).join(", ");
    const con = await oracleDBConnection();

    const result = await con.execute(
      // `select * from todoitem`,
      `select  ATAI,EGNO from KTTMSYS.T_HNSTJHO WHERE ATAI IN (${placeholders})`,
      serialNoList,
      {
        // maxRows: 2
      }
    );

    if (result.rows.length == 0) {
      console.log("Serial no. do not exist & Engine can not be found");
      return new ErrorHandler("Serial no. do not exist", 401);
    }
    console.table(Object.keys(result));
    const allColumnNames = result.metaData.map((item) => item.name);
    result.rows.sort((a, b) => a[1] - b[1]);
    res.status(200).json({ coloumns: allColumnNames, data: result.rows });
  }
);

// Get Dispatch date of Engine nos matching list of enigine no.
exports.getDispatchDatesMatchingEnigneNoList = catchAsyncError(
  async (req, res, next) => {
    const { engineNoListString } = req.body;
    const engineNoList = engineNoListString.split(",");

    // console.log(engineNoList);

    const placeholders = engineNoList.map((_, i) => `:value${i}`).join(", ");
    engineNoList.push("200");

    const con = await oracleDBConnection();

    const result = await con.execute(
      `SELECT EGNO, JSSKIDTTM FROM KTTMSYS.T_SISNJSSKI WHERE EGNO IN (${placeholders}) AND KTEINO = :valueDispatched`,
      engineNoList,
      {
        //     // maxRows: 2
      }
    );

    if (result.rows.length == 0) {
      console.log("Engine no. do not exist & Engine can not be found");
      return new ErrorHandler("Engine no. do not exist", 401);
    }
    console.table(Object.keys(result));
    const allColumnNames = result.metaData.map((item) => item.name);
    result.rows.sort((a, b) => a[1] - b[1]);
    res.status(200).json({ coloumns: allColumnNames, data: result.rows });
  }
);

// Search with reference to casting details
exports.getCastNoDateRangeData = catchAsyncError(async (req, res, next) => {
  const { castingNo } = req.query
  console.log(castingNo)
  // const castingNo = "11236142";
  const con = await oracleDBConnection();

  const result = await con.execute(
    // `select * from todoitem`,
    // REGEXP_LIKE(product_name, 'apple', 'i');    
    // "select * from KTTMSYS.T_MCHNSTJHO WHERE SUBSTR(ATAI, 21, LENGTH(ATAI) - 28) LIKE :value0 ",


    "select * from KTTMSYS.T_MCHNSTJHO WHERE REGEXP_LIKE(ATAI, :value0 ) ",
    [castingNo],
    {
      // maxRows: 2
    }
  );

  if (result.rows.length == 0) {
    console.log("Engine not found");
    res.status(401).json({messgage: "engine not found"})
    return new ErrorHandler("Engine no. do not exist", 401);
  }
  console.table(Object.keys(result));
  const allColumnNames = result.metaData.map((item) => item.name);
  result.rows.sort((a, b) => a[2] - b[2]);
  res.status(200).json({
    coloumns: allColumnNames,
    data: result.rows,
    message: "based on casting no.",
  });
});
