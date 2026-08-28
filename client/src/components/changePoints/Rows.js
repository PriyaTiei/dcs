import React from "react";
import moment from "moment";

function Rows({ element }) {
  const {
    entryDate,
    m4,
    line,
    station,
    changePoint,
    reason,
    action,
    traceability,
    result,
    next,
    responsibility,
    countermeasure,
  } = element;

  const m4Lower = (m4 || "").toLowerCase();
  const isNg = (result || "").toUpperCase() === "NG";

  return (
    <div className="cp-table-data-row">
      {/* 1. Date */}
      <div className="cp-table-data-cell" style={{ fontSize: "11.5px", color: "#475569", fontWeight: 500 }}>
        {entryDate ? moment(entryDate).format("DD-MMM-YY HH:mm") : "-"}
      </div>

      {/* 2. 4M Type */}
      <div className="cp-table-data-cell">
        <span className={`cp-badge ${m4Lower}`}>
          {m4 || "MAN"}
        </span>
      </div>

      {/* 3. Line */}
      <div className="cp-table-data-cell" style={{ fontWeight: 600, color: "#1e293b" }}>
        {line || "-"}
      </div>

      {/* 4. Station */}
      <div className="cp-table-data-cell" style={{ fontWeight: 600, color: "#2563eb" }}>
        {station || "-"}
      </div>

      {/* 5. Change Point */}
      <div className="cp-table-data-cell" style={{ textAlign: "left", justifyContent: "flex-start", fontSize: "11.5px" }} title={changePoint}>
        {changePoint || "-"}
      </div>

      {/* 6. Reason */}
      <div className="cp-table-data-cell" style={{ textAlign: "left", justifyContent: "flex-start", fontSize: "11.5px" }} title={reason}>
        {reason || "-"}
      </div>

      {/* 7. Action */}
      <div className="cp-table-data-cell" style={{ textAlign: "left", justifyContent: "flex-start", fontSize: "11.5px" }} title={action}>
        {action || "-"}
      </div>

      {/* 8. Traceability */}
      <div className="cp-table-data-cell" style={{ fontSize: "11.5px" }} title={traceability}>
        {traceability || "-"}
      </div>

      {/* 9. Result */}
      <div className="cp-table-data-cell">
        <span className={`chip-${isNg ? "ng" : "ok"}`}>
          {result || "OK"}
        </span>
      </div>

      {/* 10. Next Action */}
      <div className="cp-table-data-cell" style={{ fontSize: "11.5px" }} title={next}>
        {next || "-"}
      </div>

      {/* 11. Responsibility */}
      <div className="cp-table-data-cell" style={{ fontWeight: 500, fontSize: "11.5px" }} title={responsibility}>
        {responsibility || "-"}
      </div>

      {/* 12. Countermeasure */}
      <div className="cp-table-data-cell" style={{ borderRight: "none", textAlign: "left", justifyContent: "flex-start", fontSize: "11.5px" }} title={countermeasure}>
        {countermeasure || "-"}
      </div>
    </div>
  );
}

export default Rows;
