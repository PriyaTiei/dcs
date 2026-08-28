import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDcsFormData, dcsSlice } from '../../redux/slices/dcsSlice';
import { TbBarcode, TbCamera, TbUpload } from 'react-icons/tb';
import BarCodeScanner from './BarCode.jsx';

export const DefectEntryForm = () => {
  const dispatch = useDispatch();
  const dcsState = useSelector((state) => state.dcs);

  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  const defectOptions = [
    'Bolt Cross Thread',
    'Bolt Under Torque',
    'Bolt Over Torque',
    'Nut Cross Thread',
    'Nut Over Torque',
    'Nut Under Torque',
    'Position Error',
    'Not Tightened',
    'Wrong Paint Mark',
    'Wrong Part Assembly',
    'Part Missing',
    'Fallen Part',
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      dispatch(dcsSlice.actions.setImage(file));
    }
  };

  const handleBarcodeDetected = (code) => {
    if (code) {
      dispatch(dcsSlice.actions.setPartNo(code));
      setBarcodeOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addDcsFormData({
        date: dcsState.date,
        time: dcsState.time,
        remarks: dcsState.remarks,
        partNo: dcsState.partNo,
        defectType: dcsState.defectType,
        engineCode: dcsState.engineCode,
        fallenPart: dcsState.fallenPart,
        stnDetected: dcsState.stnDetected,
        stnOccured: dcsState.stnOccured,
        pqcsList: dcsState.pqcsList,
        checker: dcsState.checker,
        image: selectedFile,
      })
    );
  };

  return (
    <div className="dcs-card">
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">
          <span>Assembly Offline Treatment Sheet</span>
        </h3>
        <span className="status-pill info">
          {dcsState.date} — {dcsState.time}
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label>Station Occurred *</label>
            <input
              type="text"
              className="dcs-input"
              value={dcsState.stnOccured}
              onChange={(e) => dispatch(dcsSlice.actions.setStnOccured(e.target.value))}
              placeholder="e.g. Station 23"
              required
            />
          </div>

          <div className="form-group">
            <label>Station Detected *</label>
            <input
              type="text"
              className="dcs-input"
              value={dcsState.stnDetected}
              onChange={(e) => dispatch(dcsSlice.actions.setStnDetected(e.target.value))}
              placeholder="e.g. Station 46"
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label>Engine Serial Number *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="dcs-input"
                style={{ flex: 1 }}
                value={dcsState.partNo}
                onChange={(e) => dispatch(dcsSlice.actions.setPartNo(e.target.value))}
                placeholder="Enter or scan Engine No."
                required
              />
              <button
                type="button"
                className="dcs-btn dcs-btn-secondary"
                onClick={() => setBarcodeOpen(true)}
                title="Scan Barcode via Camera"
              >
                <TbBarcode size={18} />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Defect Content *</label>
            <select
              className="dcs-input"
              value={dcsState.defectType}
              onChange={(e) => dispatch(dcsSlice.actions.setDefectType(e.target.value))}
              required
            >
              <option value="">Select Defect Type</option>
              {defectOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {dcsState.dropPart && (
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label>Fallen Part Description *</label>
            <input
              type="text"
              className="dcs-input"
              value={dcsState.fallenPart || ''}
              onChange={(e) => dispatch(dcsSlice.actions.setFallenPart(e.target.value))}
              placeholder="Specify the dropped component"
              required
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label>Engine Code *</label>
            <input
              type="text"
              className="dcs-input"
              value={dcsState.engineCode}
              onChange={(e) => dispatch(dcsSlice.actions.setEngineCode(e.target.value))}
              placeholder="e.g. M15A"
              required
            />
          </div>

          <div className="form-group">
            <label>Quality Checker Name *</label>
            <input
              type="text"
              className="dcs-input"
              value={dcsState.checker}
              onChange={(e) => dispatch(dcsSlice.actions.setChecker(e.target.value))}
              placeholder="Inspector Name / ID"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Treatment Contents / Repair Remarks</label>
          <textarea
            className="dcs-input"
            rows={3}
            value={dcsState.remarks}
            onChange={(e) => dispatch(dcsSlice.actions.setRemarks(e.target.value))}
            placeholder="Describe the corrective action taken..."
          />
        </div>

        {/* Photo Evidence Attachment */}
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Attach Defect Inspection Photo</label>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <label
              className="dcs-btn dcs-btn-secondary"
              style={{ cursor: 'pointer', margin: 0 }}
            >
              <TbCamera size={18} />
              Choose File / Camera
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>

            {filePreview && (
              <div style={{ position: 'relative', width: '60px', height: '50px', borderRadius: '4px', overflow: 'hidden' }}>
                <img src={filePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="dcs-btn dcs-btn-primary" style={{ width: '100%', padding: '12px' }}>
          <TbUpload size={18} />
          Submit Offline Treatment Record
        </button>
      </form>

      <BarCodeScanner
        open={barcodeOpen}
        onClose={() => setBarcodeOpen(false)}
        onDetected={handleBarcodeDetected}
      />
    </div>
  );
};

export default DefectEntryForm;
