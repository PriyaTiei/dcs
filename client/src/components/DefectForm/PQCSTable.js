import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dcsSlice } from "../../redux/slices/dcsSlice";
import PQCSForm from "./PQCSForm";
import { TbPlus, TbTrash, TbChecklist, TbAlertCircle } from "react-icons/tb";

export default function PQCSTable() {
  const dispatch = useDispatch();
  const pqcsList = useSelector((state) => state.dcs.pqcsList || []);

  const handleRemovePQCS = (i) => {
    dispatch(dcsSlice.actions.removePqcsItem(i));
  };

  const [pqcsModal, setPqcsModal] = useState(false);

  return (
    <div className="defect-card" style={{ padding: "16px" }}>
      <PQCSForm
        onClose={() => setPqcsModal(false)}
        onOpen={() => setPqcsModal(true)}
        open={pqcsModal}
      />

      <div className="trace-header" style={{ marginBottom: "12px", paddingBottom: "10px" }}>
        <h3 className="trace-title" style={{ fontSize: "14px" }}>
          <TbChecklist size={18} color="#2563eb" />
          <span>Process Quality Confirmation (PQCS)</span>
        </h3>
        <button
          type="button"
          className="dcs-btn dcs-btn-primary"
          style={{ padding: "5px 12px", fontSize: "12.5px" }}
          onClick={() => setPqcsModal(true)}
        >
          <TbPlus size={15} />
          Add Bolt
        </button>
      </div>

      <div className="pqcs-table-wrapper" style={{ overflowX: "auto" }}>
        <table className="pqcs-table-custom">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: "65px" }}>Bolt</th>
              <th rowSpan={2} style={{ width: "85px" }}>Insp. Torque</th>
              <th colSpan={8}>Measurement Result (1 - 8)</th>
              <th rowSpan={2} style={{ width: "85px" }}>Confirm</th>
              <th rowSpan={2} style={{ width: "55px" }}>Action</th>
            </tr>
            <tr>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <th key={num} style={{ width: "32px", padding: "4px 2px" }}>
                  {num}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pqcsList.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ padding: "24px 16px", color: "#64748b", background: "#fcfdfe" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                    <TbAlertCircle size={22} color="#94a3b8" />
                    <span>No bolt torque measurements added yet.</span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      Click <strong>+ Add Bolt</strong> above to record torque & quality data.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              pqcsList.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: "#1e293b" }}>{item.bolt || `B${i + 1}`}</td>
                  <td style={{ fontWeight: 500 }}>{item.inspectionTorque || "-"}</td>
                  {(item.measurements || []).map((m, idx) => (
                    <td key={idx} style={{ color: "#334155" }}>
                      {m !== undefined && m !== "" ? m : "-"}
                    </td>
                  ))}
                  {/* Fill missing measurement columns up to 8 if needed */}
                  {Array.from({ length: Math.max(0, 8 - (item.measurements?.length || 0)) }).map((_, idx) => (
                    <td key={`empty-${idx}`} style={{ color: "#cbd5e1" }}>-</td>
                  ))}
                  <td>
                    <span
                      className={`chip-${(item.confirmation || "").toLowerCase() === "ng" ? "ng" : "ok"}`}
                      style={{ fontSize: "11px" }}
                    >
                      {item.confirmation || "OK"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      style={{
                        background: "#fee2e2",
                        color: "#ef4444",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 6px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s ease",
                      }}
                      onClick={() => handleRemovePQCS(i)}
                      title="Remove Row"
                    >
                      <TbTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
