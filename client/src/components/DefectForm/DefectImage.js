import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { dcsSlice } from "../../redux/slices/dcsSlice";
import { TbCamera, TbX, TbPhoto } from "react-icons/tb";

export default function DefectImage() {
  const dispatch = useDispatch();

  const image = useSelector((state) => state.dcs.image);
  const imagePreview = useSelector((state) => state.dcs.imagePreview);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(dcsSlice.actions.setImage(file));
      dispatch(
        dcsSlice.actions.setImagePreview(
          URL.createObjectURL(file)
        )
      );
    }
  };

  const handleRemoveImage = () => {
    dispatch(dcsSlice.actions.setImage(null));
    dispatch(dcsSlice.actions.setImagePreview(""));
  };

  return (
    <div className="defect-card" style={{ padding: "16px" }}>
      <div className="trace-header" style={{ marginBottom: "12px", paddingBottom: "10px" }}>
        <h3 className="trace-title" style={{ fontSize: "14px" }}>
          <TbPhoto size={18} color="#2563eb" />
          <span>Defect Photo Evidence</span>
        </h3>
        <span className="trace-badge" style={{ fontSize: "11px", padding: "2px 8px" }}>
          Visual Proof
        </span>
      </div>

      <div className="photo-attachment-card">
        <label
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            margin: 0,
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
            }}
          >
            <TbCamera size={22} />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>
              {image ? "Change Attached Photo" : "Upload Defect Inspection Photo"}
            </div>
            <div style={{ fontSize: "11.5px", color: "#64748b" }}>
              Capture via Camera or Select File (PNG, JPG)
            </div>
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
          />
        </label>

        {image && imagePreview && (
          <div className="photo-preview-box">
            <img src={imagePreview} alt="Defect Preview" />
            <button
              className="photo-remove-btn"
              onClick={handleRemoveImage}
              title="Remove Attachment"
            >
              <TbX size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
