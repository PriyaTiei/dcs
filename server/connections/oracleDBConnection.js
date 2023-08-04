const oracledb = require("oracledb");

let connection
const oracleDBConnection = async () => {
  try {
      connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_USER,
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
