const { catchAsyncError } = require("../middleware/catchAsyncError");

const oracledb = require("oracledb");
const ErrorHandler = require("../middleware/errorHandler");

const oracleDBConnection = async () => {
  var connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.USER,
      connectionString: process.env.ORACLEDB_URL,
    });
    console.log("Oracle connection successful");
    connection.commit();
    return connection;
  } catch (err) {
    console.log(err);
  }
};
exports.getSampleData = catchAsyncError(async (req, res, next) => {
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
