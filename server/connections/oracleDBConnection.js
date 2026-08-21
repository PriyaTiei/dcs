const oracledb = require("oracledb");

let mainPoolInitialized = false;
let historyPoolInitialized = false;

const initMainPool = async () => {
  if (!mainPoolInitialized) {
    try {
      await oracledb.createPool({
        poolAlias: "dcsOraclePool",
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD || process.env.ORACLE_USER,
        connectString: process.env.ORACLEDB_URL,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 2,
        poolTimeout: 60
      });
      mainPoolInitialized = true;
      console.log("Oracle Main DB Pool created successfully");
    } catch (err) {
      console.error("Error creating Oracle Main Pool:", err.message);
    }
  }
};

const initHistoryPool = async () => {
  if (!historyPoolInitialized) {
    try {
      await oracledb.createPool({
        poolAlias: "dcsOracleHistoryPool",
        user: process.env.ORACLE_USER_HISTORY,
        password: process.env.ORACLE_PASSWORD_HISTORY || process.env.ORACLE_USER_HISTORY,
        connectString: process.env.ORACLEDB_URL_HISTORY,
        poolMin: 1,
        poolMax: 5,
        poolIncrement: 1,
        poolTimeout: 60
      });
      historyPoolInitialized = true;
      console.log("Oracle History DB Pool created successfully");
    } catch (err) {
      console.error("Error creating Oracle History Pool:", err.message);
    }
  }
};

// Safe executor that guarantees connection release
const withOracleConnection = async (callback) => {
  await initMainPool();
  let conn;
  try {
    conn = await oracledb.getConnection("dcsOraclePool");
    return await callback(conn);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error("Error closing Oracle connection:", closeErr.message);
      }
    }
  }
};

const withOracleConnectionHistory = async (callback) => {
  await initHistoryPool();
  let conn;
  try {
    conn = await oracledb.getConnection("dcsOracleHistoryPool");
    return await callback(conn);
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (closeErr) {
        console.error("Error closing Oracle history connection:", closeErr.message);
      }
    }
  }
};

// Backward-compatible connection getters
const oracleDBConnection = async () => {
  await initMainPool();
  return await oracledb.getConnection("dcsOraclePool");
};

const oracleDBConnectionHistory = async () => {
  await initHistoryPool();
  return await oracledb.getConnection("dcsOracleHistoryPool");
};

module.exports = {
  withOracleConnection,
  withOracleConnectionHistory,
  oracleDBConnection,
  oracleDBConnectionHistory
};
