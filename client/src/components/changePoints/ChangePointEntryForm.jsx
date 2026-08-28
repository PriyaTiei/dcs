import React, { useState } from 'react';
import changePointApi from '../../api/changePointApi';
import { toast } from 'react-toastify';
import { TbPlus, TbX } from 'react-icons/tb';

export const ChangePointEntryForm = ({ setRefresh }) => {
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [m4, setM4] = useState('Man');
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [changePoint, setChangePoint] = useState('');
  const [reason, setReason] = useState('');
  const [action, setAction] = useState('');
  const [traceability, setTraceability] = useState('');
  const [result, setResult] = useState('OK');
  const [next, setNext] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [countermeasure, setCountermeasure] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      date: entryDate,
      mmmm: m4,
      line,
      station,
      point: changePoint,
      reason,
      action,
      traceability,
      result,
      nextAction: next,
      responsibility,
      counteraction: countermeasure,
    };

    try {
      await changePointApi.createChangePoint(payload);
      toast.success('4M Change point entry recorded successfully.');
      setRefresh?.();
    } catch (err) {
      console.error('Error creating change point:', err);
      toast.error('Failed to submit 4M change point.');
    }
  };

  return (
    <div>
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">
          <span>Log 4M Change Point Event</span>
        </h3>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              className="dcs-input"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>4M Classification *</label>
            <select
              className="dcs-input"
              value={m4}
              onChange={(e) => setM4(e.target.value)}
              required
            >
              <option value="Man">Man (Operator)</option>
              <option value="Machine">Machine (Equipment/Tool)</option>
              <option value="Material">Material (Part Batch)</option>
              <option value="Method">Method (Process Spec)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Line</label>
            <input
              type="text"
              className="dcs-input"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="e.g. TNGA Assembly"
            />
          </div>

          <div className="form-group">
            <label>Station *</label>
            <input
              type="text"
              className="dcs-input"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              placeholder="e.g. Station 51"
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label>Change Point *</label>
            <input
              type="text"
              className="dcs-input"
              value={changePoint}
              onChange={(e) => setChangePoint(e.target.value)}
              placeholder="Describe change item"
              required
            />
          </div>

          <div className="form-group">
            <label>Reason *</label>
            <input
              type="text"
              className="dcs-input"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for change"
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div className="form-group">
            <label>Action Taken *</label>
            <input
              type="text"
              className="dcs-input"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="Implementation details"
              required
            />
          </div>

          <div className="form-group">
            <label>Traceability Window</label>
            <input
              type="text"
              className="dcs-input"
              value={traceability}
              onChange={(e) => setTraceability(e.target.value)}
              placeholder="Engine serials / range"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div className="form-group">
            <label>Validation Result</label>
            <select
              className="dcs-input"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <option value="OK">OK</option>
              <option value="NG">NG</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div className="form-group">
            <label>Next Action</label>
            <input
              type="text"
              className="dcs-input"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Next follow-up action"
            />
          </div>

          <div className="form-group">
            <label>Person Responsible *</label>
            <input
              type="text"
              className="dcs-input"
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              placeholder="Name / ID"
              required
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label>Countermeasure / Preventive Action</label>
          <textarea
            className="dcs-input"
            rows={2}
            value={countermeasure}
            onChange={(e) => setCountermeasure(e.target.value)}
            placeholder="Counteraction details..."
          />
        </div>

        <button type="submit" className="dcs-btn dcs-btn-primary" style={{ width: '100%', padding: '12px' }}>
          <TbPlus size={18} />
          Submit 4M Change Point Record
        </button>
      </form>
    </div>
  );
};

export default ChangePointEntryForm;
