import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { dcsSlice, addDcsFormData } from "../../redux/slices/dcsSlice";
import { TbBarcode, TbUpload, TbClipboardCheck } from "react-icons/tb";
import BarCodeScanner from "../DefectForm/BarCode";

export default function DefectForm() {
  const partNo = useSelector((state) => state.dcs.partNo);
  const remarks = useSelector((state) => state.dcs.remarks);
  const date = useSelector((state) => state.dcs.date);
  const time = useSelector((state) => state.dcs.time);
  const checker = useSelector((state) => state.dcs.checker);
  const engineCode = useSelector((state) => state.dcs.engineCode);
  const defectType = useSelector((state) => state.dcs.defectType);
  const image = useSelector((state) => state.dcs.image);
  const showModal = useSelector((state) => state.dcs.showModal);
  const dropPart = useSelector((state) => state.dcs.dropPart);
  const fallenPart = useSelector((state) => state.dcs.fallenPart);
  const pqcsList = useSelector((state) => state.dcs.pqcsList);
  const stnOccured = useSelector((state) => state.dcs.stnOccured);
  const stnDetected = useSelector((state) => state.dcs.stnDetected);

  const dispatch = useDispatch();

  const handleStnOccuredChange = (e) => {
    dispatch(dcsSlice.actions.setStnOccured(e.target.value));
  };

  const handleStnDetectedChange = (e) => {
    dispatch(dcsSlice.actions.setStnDetected(e.target.value));
  };

  const handlePartNoChange = (event) => {
    dispatch(dcsSlice.actions.setPartNo(event.target.value));
  };

  const handleRemarksChange = (event) => {
    dispatch(dcsSlice.actions.setRemarks(event.target.value));
  };

  const handleEngineCodeChange = (event) => {
    dispatch(dcsSlice.actions.setEngineCode(event.target.value));
  };

  const handleCheckerChange = (event) => {
    dispatch(dcsSlice.actions.setChecker(event.target.value));
  };

  const handleDefectTypeChange = (e) => {
    dispatch(dcsSlice.actions.setDefectType(e.target.value));
  };

  const handleFallenPartChange = (event) => {
    dispatch(dcsSlice.actions.setFallenPart(event.target.value));
  };

  const handleBarcodeButtonClick = (e) => {
    e.preventDefault();
    dispatch(dcsSlice.actions.setShowModal(true));
  };

  const handleModalClose = () => {
    dispatch(dcsSlice.actions.setShowModal(false));
  };

  const handleBarCodeDetected = (code) => {
    if (code) {
      dispatch(dcsSlice.actions.setPartNo(code));
      dispatch(dcsSlice.actions.setShowModal(false));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(
        addDcsFormData({
          date,
          time,
          remarks,
          partNo,
          defectType,
          engineCode,
          fallenPart,
          stnDetected,
          stnOccured,
          pqcsList,
          checker,
          image,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const options = [
    "Bolt Cross Thread",
    "Bolt Under Torque",
    "Bolt Over Torque",
    "Nut Cross Thread",
    "Nut Over Torque",
    "Nut Under Torque",
    "Position Error",
    "Not Tightened",
    "Wrong Paint Mark",
    "Wrong Part Assembly",
    "Part Missing",
    "Fallen Part",
  ];

  return (
    <div className="defect-card">
      <div className="trace-header">
        <h3 className="trace-title">
          <TbClipboardCheck size={20} color="#2563eb" />
          <span>Assembly Offline Treatment Sheet</span>
        </h3>
        <span className="trace-badge">
          <span style={{ fontSize: "9px" }}>●</span> {date || "Today"} — {time || "Live"}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Station Tracking */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label className="form-label-styled">
              Station Occurred <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input-styled"
              value={stnOccured}
              onChange={handleStnOccuredChange}
              placeholder="e.g. ST-23"
              required
            />
          </div>

          <div>
            <label className="form-label-styled">
              Station Detected <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input-styled"
              value={stnDetected}
              onChange={handleStnDetectedChange}
              placeholder="e.g. ST-46"
              required
            />
          </div>
        </div>

        {/* Section 2: Engine Number & Defect Contents */}
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label className="form-label-styled">
              Engine No. / Serial <span className="required">*</span>
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                className="form-input-styled"
                placeholder="Enter Engine Serial"
                value={partNo}
                onChange={handlePartNoChange}
                required
              />
              <button
                type="button"
                className="dcs-btn dcs-btn-secondary"
                style={{ padding: "8px 12px" }}
                onClick={handleBarcodeButtonClick}
                title="Scan Barcode via Camera"
              >
                <TbBarcode size={18} />
              </button>
            </div>
          </div>

          <div>
            <label className="form-label-styled">
              Defect Contents <span className="required">*</span>
            </label>
            <select
              className="form-input-styled"
              value={defectType}
              onChange={handleDefectTypeChange}
              required
            >
              <option value="">-- Select Defect Content --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {dropPart && (
          <div style={{ marginBottom: "14px" }}>
            <label className="form-label-styled">
              Fallen Part Description <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input-styled"
              value={fallenPart}
              onChange={handleFallenPartChange}
              placeholder="Specify the dropped or fallen part"
              required
            />
          </div>
        )}

        {/* Section 3: Engine Code & Quality Checker */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
          <div>
            <label className="form-label-styled">
              Engine Code <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input-styled"
              value={engineCode}
              onChange={handleEngineCodeChange}
              placeholder="e.g. M15A"
              required
            />
          </div>

          <div>
            <label className="form-label-styled">
              Quality Checker Name <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input-styled"
              value={checker}
              onChange={handleCheckerChange}
              placeholder="Checker / Inspector Name"
              required
            />
          </div>
        </div>

        {/* Section 4: Treatment Remarks */}
        <div style={{ marginBottom: "18px" }}>
          <label className="form-label-styled">Treatment Contents / Corrective Action</label>
          <textarea
            className="form-input-styled"
            rows={3}
            value={remarks}
            onChange={handleRemarksChange}
            placeholder="Enter repair or treatment contents..."
            style={{ resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          className="dcs-btn dcs-btn-primary"
          style={{ width: "100%", padding: "11px", fontSize: "14.5px" }}
        >
          <TbUpload size={18} />
          Submit Offline Treatment Record
        </button>
      </form>

      <BarCodeScanner
        open={showModal}
        onClose={handleModalClose}
        onDetected={handleBarCodeDetected}
      />
    </div>
  );
}
