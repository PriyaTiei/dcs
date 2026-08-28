import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import { TbPlus, TbClock, TbSend } from "react-icons/tb";

function ChangePointEntryForm({ setRefresh }) {
  const [entryDate, setEntryDate] = useState(new Date());
  const [m4, setM4] = useState("Man");
  const [line, setLine] = useState("");
  const [station, setStation] = useState("");
  const [changePoint, setChangePoint] = useState("");
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("");
  const [traceability, setTraceability] = useState("");
  const [result, setResult] = useState("OK");
  const [next, setNext] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [countermeasure, setCountermeasure] = useState("");
  const [loading, setLoading] = useState(false);

  const changeEntryDate = (date) => {
    setEntryDate(date);
  };

  const formHandler = (e) => {
    e.preventDefault();

    if (!changePoint.trim() || !reason.trim() || !action.trim()) {
      toast.warn("Please enter Change Point, Reason, and Action Taken");
      return;
    }

    if (result === "NG" && !next && !responsibility && !countermeasure) {
      toast.warn("For NG Result, Next Action, Responsibility & Countermeasure are required");
      return;
    }

    setLoading(true);

    const formData = {
      entryDate: entryDate ? entryDate.toISOString() : new Date().toISOString(),
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
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/changePoint/add`, formData)
      .then((res) => {
        toast.success("Change Point saved successfully!");
        setRefresh((refresh) => !refresh);
        setChangePoint("");
        setReason("");
        setAction("");
        setTraceability("");
        setNext("");
        setResponsibility("");
        setCountermeasure("");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Failed to save change point");
        console.error("Error validation:", err);
      });
  };

  const m4Types = ["Man", "Machine", "Material", "Method"];

  return (
    <div className="trace-card" style={{ marginBottom: "20px" }}>
      <div className="trace-header">
        <h3 className="trace-title">
          <TbPlus size={18} color="#2563eb" />
          <span>Record New 4M Change Point</span>
        </h3>
        <span className="trace-badge">
          Incident Entry
        </span>
      </div>

      <form onSubmit={formHandler}>
        {/* Row 1: Date & Time, 4M Pill Selector, Line, Station */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label className="form-label-styled">Date & Time *</label>
            <div style={{ position: "relative" }}>
              <ReactDatePicker
                className="form-input-styled"
                selected={entryDate}
                onChange={changeEntryDate}
                showTimeSelect
                dateFormat="dd-MMM-yyyy HH:mm"
                placeholderText="Select Date & Time"
              />
            </div>
          </div>

          <div>
            <label className="form-label-styled">4M Category *</label>
            <div className="segmented-mode-group" style={{ width: "100%", justifyContent: "space-between" }}>
              {m4Types.map((type) => (
                <div
                  key={type}
                  className={`segmented-mode-option ${m4.toLowerCase() === type.toLowerCase() ? "active" : ""}`}
                  style={{ flex: 1, textAlign: "center", justifyContent: "center" }}
                  onClick={() => setM4(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label-styled">Line *</label>
            <input
              type="text"
              className="form-input-styled"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="e.g. Line 1"
              required
            />
          </div>

          <div>
            <label className="form-label-styled">Station *</label>
            <input
              type="text"
              className="form-input-styled"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              placeholder="e.g. ST-05"
              required
            />
          </div>
        </div>

        {/* Row 2: Change Point, Reason, Action Taken */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label className="form-label-styled">Change Point *</label>
            <textarea
              rows={2}
              className="form-input-styled"
              value={changePoint}
              onChange={(e) => setChangePoint(e.target.value)}
              placeholder="Describe the point changed..."
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <label className="form-label-styled">Reason *</label>
            <textarea
              rows={2}
              className="form-input-styled"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Root cause or justification..."
              required
              style={{ resize: "vertical" }}
            />
          </div>

          <div>
            <label className="form-label-styled">Action Taken *</label>
            <textarea
              rows={2}
              className="form-input-styled"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Action taken immediately..."
              required
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Row 3: Traceability, Result (OK/NG), Next Action */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.8fr 1.2fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label className="form-label-styled">Traceability Reference</label>
            <input
              type="text"
              className="form-input-styled"
              value={traceability}
              onChange={(e) => setTraceability(e.target.value)}
              placeholder="Serial / Batch / Part reference"
            />
          </div>

          <div>
            <label className="form-label-styled">Quality Result *</label>
            <div className="segmented-mode-group" style={{ width: "100%" }}>
              <div
                className={`segmented-mode-option ${result === "OK" ? "active" : ""}`}
                style={{ flex: 1, textAlign: "center", justifyContent: "center", color: result === "OK" ? "#047857" : "" }}
                onClick={() => setResult("OK")}
              >
                ● OK
              </div>
              <div
                className={`segmented-mode-option ${result === "NG" ? "active" : ""}`}
                style={{ flex: 1, textAlign: "center", justifyContent: "center", color: result === "NG" ? "#b91c1c" : "" }}
                onClick={() => setResult("NG")}
              >
                ● NG
              </div>
            </div>
          </div>

          <div>
            <label className="form-label-styled">Next Action {result === "NG" && <span className="required">*</span>}</label>
            <input
              type="text"
              className="form-input-styled"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Follow-up task / validation..."
              required={result === "NG"}
            />
          </div>
        </div>

        {/* Row 4: Responsibility, Countermeasure */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "14px", marginBottom: "16px" }}>
          <div>
            <label className="form-label-styled">Responsibility / Owner {result === "NG" && <span className="required">*</span>}</label>
            <input
              type="text"
              className="form-input-styled"
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              placeholder="Person / Team in charge"
              required={result === "NG"}
            />
          </div>

          <div>
            <label className="form-label-styled">Countermeasure / Prevention {result === "NG" && <span className="required">*</span>}</label>
            <input
              type="text"
              className="form-input-styled"
              value={countermeasure}
              onChange={(e) => setCountermeasure(e.target.value)}
              placeholder="Permanent preventive action..."
              required={result === "NG"}
            />
          </div>
        </div>

        <button
          type="submit"
          className="dcs-btn dcs-btn-primary"
          disabled={loading}
          style={{ padding: "9px 22px" }}
        >
          <TbSend size={16} />
          {loading ? "Saving Record..." : "Submit Change Point"}
        </button>
      </form>
    </div>
  );
}

export default ChangePointEntryForm;
