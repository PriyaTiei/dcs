import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TbFilter, TbRotateClockwise, TbCalendar } from "react-icons/tb";

function Headings({ filtered, setfiltered }) {
  const [isDateOpened, setIsDateOpened] = useState(false);

  useEffect(() => {
    if (!isDateOpened) return;

    const closeHandler = () => setIsDateOpened(false);
    document.addEventListener("click", closeHandler);
    return () => {
      document.removeEventListener("click", closeHandler);
    };
  }, [isDateOpened]);

  return (
    <div className="cp-table-header-row">
      {/* 1. Date */}
      <div className="cp-table-header-cell" style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span>Date</span>
          <button
            type="button"
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              padding: "2px 5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "10.5px",
              color: "#2563eb",
            }}
            onClick={(e) => {
              setIsDateOpened((pre) => !pre);
              e.stopPropagation();
            }}
            title="Filter by Date"
          >
            <TbCalendar size={12} />
          </button>
          {(filtered.startDate || filtered.endDate) && (
            <button
              type="button"
              style={{
                background: "#fee2e2",
                border: "none",
                borderRadius: "4px",
                padding: "2px 4px",
                cursor: "pointer",
                fontSize: "10px",
                color: "#ef4444",
              }}
              onClick={() =>
                setfiltered((prev) => ({
                  ...prev,
                  startDate: "",
                  endDate: "",
                }))
              }
              title="Clear Date Filter"
            >
              ✕
            </button>
          )}
        </div>

        {isDateOpened && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "42px",
              left: 0,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <ReactDatePicker
              className="form-input-styled"
              selectsStart
              selected={filtered.startDate}
              onChange={(sdate) => {
                setfiltered((prefiltered) => ({
                  ...prefiltered,
                  startDate: sdate,
                }));
              }}
              startDate={filtered.startDate}
              endDate={filtered.endDate}
              placeholderText="Start date"
            />
            <ReactDatePicker
              className="form-input-styled"
              selectsEnd
              selected={filtered.endDate}
              onChange={(sdate) => {
                setfiltered((prev) => ({
                  ...prev,
                  endDate: sdate,
                }));
              }}
              startDate={filtered.startDate}
              endDate={filtered.endDate}
              minDate={filtered.startDate}
              placeholderText="End date"
            />
          </div>
        )}
      </div>

      {/* 2. 4M Type */}
      <div className="cp-table-header-cell">
        <span>4M</span>
        <select
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          value={filtered.mmmm || filtered.m4 || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              mmmm: e.target.value,
              m4: e.target.value,
            }));
          }}
        >
          <option value="">All</option>
          <option value="man">Man</option>
          <option value="machine">Machine</option>
          <option value="method">Method</option>
          <option value="material">Material</option>
        </select>
      </div>

      {/* 3. Line */}
      <div className="cp-table-header-cell">
        <span>Line</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Filter..."
          type="text"
          value={filtered.line || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              line: e.target.value,
            }));
          }}
        />
      </div>

      {/* 4. Station */}
      <div className="cp-table-header-cell">
        <span>Station</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Filter..."
          type="text"
          value={filtered.station || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              station: e.target.value,
            }));
          }}
        />
      </div>

      {/* 5. Change Point */}
      <div className="cp-table-header-cell">
        <span>Change Point</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Search..."
          type="text"
          value={filtered.point || filtered.changePoint || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              point: e.target.value,
              changePoint: e.target.value,
            }));
          }}
        />
      </div>

      {/* 6. Reason */}
      <div className="cp-table-header-cell">
        <span>Reason</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Search..."
          type="text"
          value={filtered.reason || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              reason: e.target.value,
            }));
          }}
        />
      </div>

      {/* 7. Action */}
      <div className="cp-table-header-cell">
        <span>Action</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Search..."
          type="text"
          value={filtered.action || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              action: e.target.value,
            }));
          }}
        />
      </div>

      {/* 8. Traceability */}
      <div className="cp-table-header-cell">
        <span>Traceability</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Search..."
          type="text"
          value={filtered.traceability || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              traceability: e.target.value,
            }));
          }}
        />
      </div>

      {/* 9. Result */}
      <div className="cp-table-header-cell">
        <span>Result</span>
        <select
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          value={filtered.result || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              result: e.target.value,
            }));
          }}
        >
          <option value="">All</option>
          <option value="ok">OK</option>
          <option value="NG">NG</option>
        </select>
      </div>

      {/* 10. Next Action */}
      <div className="cp-table-header-cell">
        <span>Next Action</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Filter..."
          type="text"
          value={filtered.next || filtered.nextAction || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              next: e.target.value,
              nextAction: e.target.value,
            }));
          }}
        />
      </div>

      {/* 11. Responsibility */}
      <div className="cp-table-header-cell">
        <span>Owner</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Filter..."
          type="text"
          value={filtered.responsibility || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              responsibility: e.target.value,
            }));
          }}
        />
      </div>

      {/* 12. Countermeasure */}
      <div className="cp-table-header-cell" style={{ borderRight: "none" }}>
        <span>Countermeasure</span>
        <input
          className="form-input-styled"
          style={{ padding: "3px 4px", fontSize: "11px", height: "26px" }}
          placeholder="Search..."
          type="text"
          value={filtered.countermeasure || filtered.counteraction || ""}
          onChange={(e) => {
            setfiltered((prev) => ({
              ...prev,
              countermeasure: e.target.value,
              counteraction: e.target.value,
            }));
          }}
        />
      </div>
    </div>
  );
}

export default Headings;
