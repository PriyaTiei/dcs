import React from "react";
import moment from "moment";

function ReusageImageCards({ imageData }) {
  if (!imageData) return null;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid var(--slate-200, #e2e8f0)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease",
      }}
    >
      {/* Image Thumbnail */}
      <div style={{ position: "relative", width: "100%", height: "180px", background: "#0f172a", overflow: "hidden" }}>
        <img
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          src={`${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImages/${imageData.imageName}`}
          alt={imageData.engineNo || "Rework Image"}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            color: "#ffffff",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "11.5px",
            fontWeight: 700,
          }}
        >
          {imageData.engineNo || "No Serial"}
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "6px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--slate-500, #64748b)", textTransform: "uppercase" }}>
            {imageData.plant || "Plant"} • {imageData.shift || "Shift"}
          </span>
          <span style={{ fontSize: "11px", color: "var(--slate-400, #94a3b8)" }}>
            {moment(imageData.createdAt).format("DD/MM/YY HH:mm")}
          </span>
        </div>

        {imageData.checkedBy && (
          <div style={{ fontSize: "12px", color: "var(--slate-700, #334155)" }}>
            <span style={{ fontWeight: 600 }}>Checker: </span>{imageData.checkedBy}
          </div>
        )}

        {imageData.abnormalityDetails && (
          <div style={{ fontSize: "12px", color: "#b91c1c", background: "#fef2f2", padding: "4px 8px", borderRadius: "6px" }}>
            <span style={{ fontWeight: 700 }}>Abnormality: </span>{imageData.abnormalityDetails}
          </div>
        )}

        {imageData.troubleshootingDetails && (
          <div style={{ fontSize: "12px", color: "var(--slate-600, #475569)" }}>
            <span style={{ fontWeight: 600 }}>Action: </span>{imageData.troubleshootingDetails}
          </div>
        )}

        {imageData.commonRemarks && (
          <div style={{ fontSize: "11.5px", color: "var(--slate-500, #64748b)", fontStyle: "italic", marginTop: "auto" }}>
            "{imageData.commonRemarks}"
          </div>
        )}
      </div>
    </div>
  );
}

export default ReusageImageCards;
