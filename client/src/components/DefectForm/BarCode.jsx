import React, { useState, useRef } from 'react';
import { TbX, TbCamera } from 'react-icons/tb';

export const BarCodeScanner = ({ onClose, open, onDetected }) => {
  const videoRef = useRef(null);
  const [manualCode, setManualCode] = useState('');

  if (!open) return null;

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onDetected?.(manualCode.trim());
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="dcs-card"
        style={{ width: '100%', maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">
            <TbCamera size={20} color="var(--primary-600)" />
            <span>Scan 2D Engine Barcode</span>
          </h3>
          <button
            className="dcs-btn dcs-btn-secondary"
            style={{ padding: '4px' }}
            onClick={onClose}
          >
            <TbX size={18} />
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px solid var(--slate-100)', marginBottom: '16px' }}>
          <video
            ref={videoRef}
            style={{
              width: '100%',
              maxHeight: '220px',
              backgroundColor: '#000000',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '8px' }}>
            Align engine barcode inside camera frame or enter serial manually below
          </div>
        </div>

        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="dcs-input"
            style={{ flex: 1 }}
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Type engine serial number..."
            autoFocus
          />
          <button type="submit" className="dcs-btn dcs-btn-primary">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default BarCodeScanner;
