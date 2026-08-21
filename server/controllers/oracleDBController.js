const { catchAsyncError } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/errorHandler");
const { withOracleConnection, withOracleConnectionHistory } = require("../connections/oracleDBConnection");

// Single engine data fetching
exports.getEngineData = catchAsyncError(async (req, res, next) => {
  const engineNo = req.params.engineNo;
  console.log(engineNo);

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select * from KTTMSYS.T_HNSTJHO WHERE EGNO=:value",
      [engineNo]
    );
  });

  if (!result || result.rows.length === 0) {
    // History check
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select * from KTTMHIS.T_HNSTJHORRKI WHERE EGNO=:value",
        [engineNo]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Engine not found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
    result = resultHistory;
  }

  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows });
});

// Part data fetching using serialno
exports.getPartData = catchAsyncError(async (req, res, next) => {
  let partNo = req.params.partNo;
  partNo = partNo + "    ";

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select * from KTTMSYS.T_MCHNSTJHO WHERE SRALNO=:value",
      [partNo]
    );
  });

  if (!result || result.rows.length === 0) {
    // History check
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select * from KTTMHIS.T_MCHNSTJHORRKI WHERE SRALNO=:value",
        [partNo]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Machining Parts not found");
      return next(new ErrorHandler("Machining Parts do not exist", 401));
    }
    result = resultHistory;
  }

  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows });
});

exports.getPart3Data = catchAsyncError(async (req, res, next) => {
  let partNo1 = req.params.partNo1 + "    ";
  let partNo2 = req.params.partNo2 + "    ";
  let partNo3 = req.params.partNo3 + "    ";
  let partNos = [partNo1, partNo2, partNo3];

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select * from KTTMSYS.T_MCHNSTJHO WHERE SRALNO in (:value0, :value1, :value2)",
      partNos
    );
  });

  if (!result || result.rows.length === 0) {
    // History check
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select * from KTTMHIS.T_MCHNSTJHORRKI WHERE SRALNO in (:value0, :value1, :value2)",
        partNos
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Machining Parts not found");
      return next(new ErrorHandler("Machining Parts do not exist", 401));
    }
    result = resultHistory;
  }

  res.status(200).json({ data: result.rows });
});

// Get shipment history for single engine
exports.getDateData = catchAsyncError(async (req, res, next) => {
  const engineNo = req.params.engineNo;

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select * from KTTMSYS.T_SISNJSSKI WHERE EGNO=:value",
      [engineNo]
    );
  });

  if (!result || result.rows.length === 0) {
    // History check
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select * from KTTMHIS.T_SISNJSSKIRRKI WHERE EGNO=:value",
        [engineNo]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Engine not found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
    result = resultHistory;
  }

  const allColumnNames = result.metaData.map((item) => item.name);
  res.status(200).json({ coloumns: allColumnNames, data: result.rows, message: "for date" });
});

// Get part data from specific date range
exports.getDateRangeData = catchAsyncError(async (req, res, next) => {
  let { processNo, fromDate, toDate } = req.params;

  if (processNo === "H1_Material_input_engraving") {
    processNo = "H1_Material input/engraving";
  }

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select * from KTTMSYS.T_MCHNSTJHO WHERE HNSTKNRIMEI =:value0 AND JSSKIDTTM BETWEEN :value1 AND :value2",
      [processNo, new Date(fromDate), new Date(toDate)]
    );
  });

  if (!result || result.rows.length === 0) {
    // History check
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select * from KTTMHIS.T_MCHNSTJHORRKI WHERE HNSTKNRIMEI =:value0 AND JSSKIDTTM BETWEEN :value1 AND :value2",
        [processNo, new Date(fromDate), new Date(toDate)]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Engine not found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
    result = resultHistory;
  }

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
    const serialNoList = serialNoListString ? serialNoListString.split(",") : [];

    if (serialNoList.length === 0) {
      return res.status(200).json({ coloumns: [], data: [] });
    }

    const chunkSize = 500;
    const serialNoChunks = [];
    for (let i = 0; i < serialNoList.length; i += chunkSize) {
      serialNoChunks.push(serialNoList.slice(i, i + chunkSize));
    }

    let allRows = [];
    let metaData = null;

    await withOracleConnection(async (con) => {
      for (const chunk of serialNoChunks) {
        const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
        const result = await con.execute(
          `select ATAI, EGNO from KTTMSYS.T_HNSTJHO WHERE ATAI IN (${placeholders})`,
          chunk
        );
        if (result.rows.length > 0) {
          allRows.push(...result.rows);
          if (!metaData) metaData = result.metaData;
        }
      }
    });

    if (allRows.length === 0) {
      // History check
      await withOracleConnectionHistory(async (conHistory) => {
        for (const chunk of serialNoChunks) {
          const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
          const resultHistory = await conHistory.execute(
            `select ATAI, EGNO from KTTMHIS.T_HNSTJHORRKI WHERE ATAI IN (${placeholders})`,
            chunk
          );
          if (resultHistory.rows.length > 0) {
            allRows.push(...resultHistory.rows);
            if (!metaData) metaData = resultHistory.metaData;
          }
        }
      });

      if (allRows.length === 0) {
        console.log("Serial no. do not exist & Engine can not be found");
        return next(new ErrorHandler("Serial no. do not exist", 401));
      }
    }

    const allColumnNames = metaData ? metaData.map((item) => item.name) : ["ATAI", "EGNO"];
    allRows.sort((a, b) => (a[1] > b[1] ? 1 : -1));
    res.status(200).json({ coloumns: allColumnNames, data: allRows });
  }
);

// Get Dispatch date of Engine nos matching list of engine no.
exports.getDispatchDatesMatchingEnigneNoList = catchAsyncError(
  async (req, res, next) => {
    const { engineNoListString } = req.body;
    const engineNoList = engineNoListString ? engineNoListString.split(",") : [];

    if (engineNoList.length === 0) {
      return res.status(200).json({ coloumns: [], data: [] });
    }

    const chunkSize = 500;
    const engineNoChunks = [];
    for (let i = 0; i < engineNoList.length; i += chunkSize) {
      engineNoChunks.push(engineNoList.slice(i, i + chunkSize));
    }

    let allRows = [];
    let metaData = null;

    await withOracleConnection(async (con) => {
      for (const chunk of engineNoChunks) {
        const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
        const binds = [...chunk, "200"];
        const result = await con.execute(
          `SELECT EGNO, JSSKIDTTM FROM KTTMSYS.T_SISNJSSKI WHERE EGNO IN (${placeholders}) AND KTEINO = :valueDispatched`,
          binds
        );
        if (result.rows.length > 0) {
          allRows.push(...result.rows);
          if (!metaData) metaData = result.metaData;
        }
      }
    });

    if (allRows.length === 0) {
      // History check
      await withOracleConnectionHistory(async (conHistory) => {
        for (const chunk of engineNoChunks) {
          const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
          const binds = [...chunk, "200"];
          const resultHistory = await conHistory.execute(
            `SELECT EGNO, JSSKIDTTM FROM KTTMHIS.T_SISNJSSKIRRKI WHERE EGNO IN (${placeholders}) AND KTEINO = :valueDispatched`,
            binds
          );
          if (resultHistory.rows.length > 0) {
            allRows.push(...resultHistory.rows);
            if (!metaData) metaData = resultHistory.metaData;
          }
        }
      });

      if (allRows.length === 0) {
        console.log("Engine no. do not exist & Engine can not be found");
        return next(new ErrorHandler("Engine no. do not exist", 401));
      }
    }

    const allColumnNames = metaData ? metaData.map((item) => item.name) : ["EGNO", "JSSKIDTTM"];
    allRows.sort((a, b) => (a[1] > b[1] ? 1 : -1));
    res.status(200).json({ coloumns: allColumnNames, data: allRows });
  }
);

// Search with reference to casting details
exports.getCastNoDateRangeData = catchAsyncError(async (req, res, next) => {
  const { castingNo } = req.query;

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select ATAI, SRALNO, JSSKIDTTM from KTTMSYS.T_MCHNSTJHO WHERE REGEXP_LIKE(ATAI, :value0)",
      [castingNo]
    );
  });

  if (!result || result.rows.length === 0) {
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select ATAI, SRALNO, JSSKIDTTM from KTTMHIS.T_MCHNSTJHORRKI WHERE REGEXP_LIKE(ATAI, :value0)",
        [castingNo]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Engine not found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
    result = resultHistory;
  }

  let serialNoList = result.rows.map((item) => item[1].trim());
  const chunkSize = 500;
  const serialNoChunks = [];
  for (let i = 0; i < serialNoList.length; i += chunkSize) {
    serialNoChunks.push(serialNoList.slice(i, i + chunkSize));
  }

  let result2Rows = [];
  await withOracleConnection(async (con) => {
    for (const chunk of serialNoChunks) {
      const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
      const r2 = await con.execute(
        `select ATAI, EGNO from KTTMSYS.T_HNSTJHO WHERE ATAI IN (${placeholders})`,
        chunk
      );
      result2Rows.push(...r2.rows);
    }
  });

  if (result2Rows.length === 0) {
    await withOracleConnectionHistory(async (conHistory) => {
      for (const chunk of serialNoChunks) {
        const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
        const r2H = await conHistory.execute(
          `select ATAI, EGNO from KTTMHIS.T_HNSTJHORRKI WHERE ATAI IN (${placeholders})`,
          chunk
        );
        result2Rows.push(...r2H.rows);
      }
    });

    if (result2Rows.length === 0) {
      console.log("Serial no. do not exist & Engine can not be found");
      return next(new ErrorHandler("Serial no. do not exist", 401));
    }
  }

  let engineNoList = result2Rows.map((item) => item[1]);
  const engineNoChunks = [];
  for (let i = 0; i < engineNoList.length; i += chunkSize) {
    engineNoChunks.push(engineNoList.slice(i, i + chunkSize));
  }

  let result3Rows = [];
  await withOracleConnection(async (con) => {
    for (const chunk of engineNoChunks) {
      const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
      const binds = [...chunk, "200"];
      const r3 = await con.execute(
        `SELECT EGNO, JSSKIDTTM FROM KTTMSYS.T_SISNJSSKI WHERE EGNO IN (${placeholders}) AND KTEINO = :valueDispatched`,
        binds
      );
      result3Rows.push(...r3.rows);
    }
  });

  if (result3Rows.length === 0) {
    await withOracleConnectionHistory(async (conHistory) => {
      for (const chunk of engineNoChunks) {
        const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
        const binds = [...chunk, "200"];
        const r3H = await conHistory.execute(
          `SELECT EGNO, JSSKIDTTM FROM KTTMHIS.T_SISNJSSKIRRKI WHERE EGNO IN (${placeholders}) AND KTEINO = :valueDispatched`,
          binds
        );
        result3Rows.push(...r3H.rows);
      }
    });

    if (result3Rows.length === 0) {
      console.log("Engine no. do not exist & Engine can not be found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
  }

  // Fast map lookup instead of O(N*M)
  const dispatchMap = new Map();
  result3Rows.forEach((b) => {
    if (b[0]) dispatchMap.set(b[0].trim(), b[1]);
  });

  const resultList2 = result2Rows.map((a) => {
    const egNo = a[1] ? a[1].trim() : "";
    const dispatchDate = dispatchMap.get(egNo) || "-";
    return [...a, dispatchDate];
  });

  const r2Map = new Map();
  resultList2.forEach((b) => {
    if (b[0]) r2Map.set(b[0].trim(), b);
  });

  const resultList1 = result.rows.map((a) => {
    const sralNo = a[1] ? a[1].trim() : "";
    const match = r2Map.get(sralNo);
    if (match) {
      return [...a, match[1], match[2]];
    }
    return [...a, "-"];
  });

  resultList1.sort((a, b) => (a[1] > b[1] ? 1 : -1));
  res.status(200).json({
    data: resultList1,
    message: "based on casting no.",
  });
});

// Get part data, engine nos and shipment data from specific date range
exports.getFullData = catchAsyncError(async (req, res, next) => {
  let { processNo, fromDate, toDate } = req.params;

  if (processNo === "H1_Material_input_engraving") {
    processNo = "H1_Material input/engraving";
  }

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select ATAI, SRALNO, JSSKIDTTM from KTTMSYS.T_MCHNSTJHO WHERE HNSTKNRIMEI =:value0 AND JSSKIDTTM BETWEEN :value1 AND :value2",
      [processNo, new Date(fromDate), new Date(toDate)]
    );
  });

  if (!result || result.rows.length === 0) {
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select ATAI, SRALNO, JSSKIDTTM from KTTMHIS.T_MCHNSTJHORRKI WHERE HNSTKNRIMEI =:value0 AND JSSKIDTTM BETWEEN :value1 AND :value2",
        [processNo, new Date(fromDate), new Date(toDate)]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Engine not found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
    result = resultHistory;
  }

  let serialNoList = result.rows.map((item) => item[1].trim());
  const chunkSize = 500;
  const serialNoChunks = [];
  for (let i = 0; i < serialNoList.length; i += chunkSize) {
    serialNoChunks.push(serialNoList.slice(i, i + chunkSize));
  }

  let tempList = [];
  await withOracleConnection(async (con) => {
    for (const chunk of serialNoChunks) {
      const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
      const queryResult = await con.execute(
        `select ATAI, EGNO from KTTMSYS.T_HNSTJHO WHERE ATAI IN (${placeholders})`,
        chunk
      );
      tempList.push(...queryResult.rows);
    }
  });

  if (tempList.length === 0) {
    await withOracleConnectionHistory(async (conHistory) => {
      for (const chunk of serialNoChunks) {
        const placeholders = chunk.map((_, i) => `:value${i}`).join(", ");
        const queryResultHistory = await conHistory.execute(
          `select ATAI, EGNO from KTTMHIS.T_HNSTJHORRKI WHERE ATAI IN (${placeholders})`,
          chunk
        );
        tempList.push(...queryResultHistory.rows);
      }
    });

    if (tempList.length === 0) {
      console.log("Serial no. do not exist & Engine can not be found");
      return next(new ErrorHandler("Serial no. do not exist", 401));
    }
  }

  let engineNoList = tempList.map((item) => item[1]);
  const engineNoChunks = [];
  for (let i = 0; i < engineNoList.length; i += chunkSize) {
    engineNoChunks.push(engineNoList.slice(i, i + chunkSize));
  }

  let tempList2 = [];
  await withOracleConnection(async (con) => {
    for (const chunk of engineNoChunks) {
      const placeholders2 = chunk.map((_, i) => `:value${i}`).join(", ");
      const binds = [...chunk, "200"];
      const queryResult2 = await con.execute(
        `SELECT EGNO, JSSKIDTTM FROM KTTMSYS.T_SISNJSSKI WHERE EGNO IN (${placeholders2}) AND KTEINO = :valueDispatched`,
        binds
      );
      tempList2.push(...queryResult2.rows);
    }
  });

  if (tempList2.length === 0) {
    await withOracleConnectionHistory(async (conHistory) => {
      for (const chunk of engineNoChunks) {
        const placeholders2 = chunk.map((_, i) => `:value${i}`).join(", ");
        const binds = [...chunk, "200"];
        const queryResult2History = await conHistory.execute(
          `SELECT EGNO, JSSKIDTTM FROM KTTMHIS.T_SISNJSSKIRRKI WHERE EGNO IN (${placeholders2}) AND KTEINO = :valueDispatched`,
          binds
        );
        tempList2.push(...queryResult2History.rows);
      }
    });

    if (tempList2.length === 0) {
      console.log("Engine no. do not exist & Engine can not be found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
  }

  // Fast map lookup instead of O(N*M)
  const dispatchMap = new Map();
  tempList2.forEach((b) => {
    if (b[0]) dispatchMap.set(b[0].trim(), b[1]);
  });

  const resultList2 = tempList.map((a) => {
    const egNo = a[1] ? a[1].trim() : "";
    const dispatchDate = dispatchMap.get(egNo) || "-";
    return [...a, dispatchDate];
  });

  const r2Map = new Map();
  resultList2.forEach((b) => {
    if (b[0]) r2Map.set(b[0].trim(), b);
  });

  const resultList1 = result.rows.map((a) => {
    const sralNo = a[1] ? a[1].trim() : "";
    const match = r2Map.get(sralNo);
    if (match) {
      return [...a, match[1], match[2]];
    }
    return [...a, "-"];
  });

  resultList1.sort((a, b) => (a[1] > b[1] ? 1 : -1));
  res.status(200).json({
    data: resultList1,
    message: "3 catogory data",
  });
});

// Get Assembly data, engine nos and shipment data from specific date range
exports.getFullDataAssy = catchAsyncError(async (req, res, next) => {
  let { processNo, fromDate, toDate } = req.params;

  if (processNo === "H1_Material_input_engraving") {
    processNo = "H1_Material input/engraving";
  } else if (processNo === "IN_cam_S_N") {
    processNo = "IN cam S / N";
  } else if (processNo === "EX_cam_S_N") {
    processNo = "EX cam S / N";
  } else if (processNo === "Block_S_N") {
    processNo = "Block S / N";
  } else if (processNo === "Crank_S_N") {
    processNo = "Crank S / N";
  } else if (processNo === "Head_S_N") {
    processNo = "Head S / N";
  } else if (processNo === "CamHousing_S_N") {
    processNo = "CamHousing S/N";
  }

  let result = await withOracleConnection(async (con) => {
    return await con.execute(
      "select ATAI, EGNO, JSSKIDTTM from KTTMSYS.T_HNSTJHO WHERE HNSTKNRIMEI=:value AND JSSKIDTTM BETWEEN :value1 AND :value2",
      [processNo, new Date(fromDate), new Date(toDate)]
    );
  });

  if (!result || result.rows.length === 0) {
    let resultHistory = await withOracleConnectionHistory(async (conHistory) => {
      return await conHistory.execute(
        "select ATAI, EGNO, JSSKIDTTM from KTTMHIS.T_HNSTJHORRKI WHERE HNSTKNRIMEI=:value AND JSSKIDTTM BETWEEN :value1 AND :value2",
        [processNo, new Date(fromDate), new Date(toDate)]
      );
    });

    if (!resultHistory || resultHistory.rows.length === 0) {
      console.log("Engine not found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
    result = resultHistory;
  }

  let engineNoList = result.rows.map((item) => item[1].trim());
  const chunkSize = 500;
  const engineNoChunks = [];
  for (let i = 0; i < engineNoList.length; i += chunkSize) {
    engineNoChunks.push(engineNoList.slice(i, i + chunkSize));
  }

  const tempList = [];
  await withOracleConnection(async (con) => {
    for (const chunk of engineNoChunks) {
      const placeholders2 = chunk.map((_, i) => `:value${i}`).join(", ");
      const binds = [...chunk, "200"];
      const queryResult = await con.execute(
        `SELECT EGNO, JSSKIDTTM FROM KTTMSYS.T_SISNJSSKI WHERE EGNO IN (${placeholders2}) AND KTEINO = :valueDispatched`,
        binds
      );
      tempList.push(...queryResult.rows);
    }
  });

  if (tempList.length === 0) {
    await withOracleConnectionHistory(async (conHistory) => {
      for (const chunk of engineNoChunks) {
        const placeholders2 = chunk.map((_, i) => `:value${i}`).join(", ");
        const binds = [...chunk, "200"];
        const queryResultHistory = await conHistory.execute(
          `SELECT EGNO, JSSKIDTTM FROM KTTMHIS.T_SISNJSSKIRRKI WHERE EGNO IN (${placeholders2}) AND KTEINO = :valueDispatched`,
          binds
        );
        tempList.push(...queryResultHistory.rows);
      }
    });

    if (tempList.length === 0) {
      console.log("Engine no. do not exist & Engine can not be found");
      return next(new ErrorHandler("Engine no. do not exist", 401));
    }
  }

  const dispatchMap = new Map();
  tempList.forEach((b) => {
    if (b[0]) dispatchMap.set(b[0].trim(), b[1]);
  });

  const resultList1 = result.rows.map((a) => {
    const egNo = a[1] ? a[1].trim() : "";
    const dispatchDate = dispatchMap.get(egNo) || "-";
    return [...a, dispatchDate];
  });

  resultList1.sort((a, b) => (a[1] > b[1] ? 1 : -1));
  res.status(200).json({
    data: resultList1,
    message: "3 catogory data",
  });
});
