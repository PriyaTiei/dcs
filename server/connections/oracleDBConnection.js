const oracledb = require("oracledb");

let connection
const oracleDBConnection = async () => {
  try {
      connection = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.USER,
      connectionString: process.env.ORACLEDB_URL,
    });
    console.log("Oracle connection successful")
    connection.commit()
    return connection
  } catch (err){
    console.log(err)
  }
};

module.exports = oracleDBConnection
