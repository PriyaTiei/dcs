import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { pqcsSlice } from "../../redux/slices/pqcsSlice";
import { dcsSlice } from "../../redux/slices/dcsSlice";
import { TbPlus, TbX, TbChecklist } from "react-icons/tb";

export default function PQCSForm({ onClose, open }) {
  const dispatch = useDispatch();

  const bolt = useSelector((state) => state.pqcs.bolt);
  const inspectionTorque = useSelector((state) => state.pqcs.inspectionTorque);
  const confirmation = useSelector((state) => state.pqcs.confirmation);
  const measurements = useSelector((state) => state.pqcs.measurements || ["", "", "", "", "", "", "", ""]);

  if (!open) return null;

  const handleBoltChange = (e) => {
    dispatch(pqcsSlice.actions.setBolt(e.target.value));
  };

  const handleInspectionTorqueChange = (e) => {
    dispatch(pqcsSlice.actions.setInspectionTorque(e.target.value));
  };

  const handleMeasurementChange = (e, index) => {
    dispatch(
      pqcsSlice.actions.setMeasurement({ index, value: e.target.value })
    );
  };

  const handleConfirmationChange = (e) => {
    dispatch(pqcsSlice.actions.setConfirmation(e.target.value));
  };

  const handleSave = () => {
    dispatch(
      dcsSlice.actions.addPqcsItem({
        bolt: bolt || "Bolt",
        inspectionTorque: inspectionTorque || "-",
        measurements: measurements,
        confirmation: confirmation || "OK",
      })
    );
    dispatch(pqcsSlice.actions.resetForm());
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="defect-card"
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#ffffff",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trace-header" style={{ marginBottom: "16px" }}>
          <h3 className="trace-title">
            <TbChecklist size={20} color="#2563eb" />
            <span>Add Bolt Quality Measurement Record</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
            }}
          >
            <TbX size={20} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label className="form-label-styled">Bolt ID / Name *</label>
            <input
              type="text"
              className="form-input-styled"
              value={bolt}
              onChange={handleBoltChange}
              placeholder="e.g. B1, Bolt-A"
              required
            />
          </div>

          <div>
            <label className="form-label-styled">Inspection Torque *</label>
            <input
              type="text"
              className="form-input-styled"
              value={inspectionTorque}
              onChange={handleInspectionTorqueChange}
              placeholder="e.g. 24.5 Nm"
              required
            />
          </div>

          <div>
            <label className="form-label-styled">Confirmation</label>
            <select
              className="form-input-styled"
              value={confirmation || "OK"}
              onChange={handleConfirmationChange}
            >
              <option value="OK">OK</option>
              <option value="NG">NG</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* 8 Measurement inputs in a clean grid */}
        <div style={{ marginBottom: "20px" }}>
          <label className="form-label-styled">Measurement Results (Points 1 to 8)</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
              <div key={idx} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, marginBottom: "2px" }}>
                  #{idx + 1}
                </div>
                <input
                  type="text"
                  className="form-input-styled"
                  style={{ textAlign: "center", padding: "6px 2px", fontSize: "12px" }}
                  value={measurements[idx] || ""}
                  onChange={(e) => handleMeasurementChange(e, idx)}
                  placeholder="-"
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            className="dcs-btn dcs-btn-secondary"
            onClick={() => {
              dispatch(pqcsSlice.actions.resetForm());
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dcs-btn dcs-btn-primary"
            onClick={handleSave}
          >
            <TbPlus size={16} />
            Add to PQCS Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
