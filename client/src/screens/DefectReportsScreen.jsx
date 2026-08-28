import React, { useState, useEffect } from 'react';
import dcsApi from '../api/dcsApi';
import { formatStandardDateTime } from '../utils/dateUtils';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import LightboxModal from '../components/common/LightboxModal';
import { TbFileDescription, TbFilter, TbX } from 'react-icons/tb';

export const DefectReportsScreen = () => {
  const [defectForms, setDefectForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeDefectModal, setActiveDefectModal] = useState(null);

  useEffect(() => {
    const fetchDefects = async () => {
      try {
        setLoading(true);
        const res = await dcsApi.getAllDcsForms();
        setDefectForms(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching defect forms:', err);
        setDefectForms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDefects();
  }, []);

  const filteredForms = defectForms.filter((item) => {
    if (selectedDate) {
      // Date in item could be DD/MM/YYYY or YYYY-MM-DD
      const rawDate = item.date || '';
      if (!rawDate.includes(selectedDate) && !rawDate.replace(/\//g, '-').includes(selectedDate)) {
        return false;
      }
    }
    if (searchTerm) {
      const eng = (item.engineNo || '').toLowerCase();
      if (!eng.includes(searchTerm.toLowerCase())) return false;
    }
    return true;
  });

  const columns = [
    {
      header: 'Sl. No',
      accessor: (_, index) => index + 1,
      width: '70px',
    },
    {
      header: 'Date & Time',
      accessor: (row) => `${row.date || ''} ${row.time || ''}`,
    },
    {
      header: 'Engine No.',
      accessor: 'engineNo',
      render: (val) => <strong style={{ color: 'var(--primary-700)' }}>{val || '-'}</strong>,
    },
    {
      header: 'Engine Code',
      accessor: 'engineCode',
    },
    {
      header: 'Checker',
      accessor: 'checker',
    },
    {
      header: 'Defect Content',
      accessor: 'defectContent',
      render: (val) => <StatusBadge status={val} text={val} />,
    },
    {
      header: 'Actions',
      align: 'center',
      render: (_, row) => (
        <button
          className="dcs-btn dcs-btn-secondary"
          style={{ padding: '4px 10px', fontSize: '12px' }}
          onClick={() => setActiveDefectModal(row)}
        >
          <TbFileDescription size={15} />
          View Report
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="dcs-search-bar">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter by Engine Number..."
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TbFilter size={16} color="var(--slate-500)" />
          <input
            type="date"
            className="dcs-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          {selectedDate && (
            <button
              className="dcs-btn dcs-btn-secondary"
              style={{ padding: '6px' }}
              onClick={() => setSelectedDate('')}
              title="Clear date filter"
            >
              <TbX size={16} />
            </button>
          )}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--slate-500)' }}>
          Showing <strong>{filteredForms.length}</strong> defect records
        </div>
      </div>

      <div className="dcs-card">
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">
            <span>Assembly Defect Reports & Non-Conformance Logs</span>
          </h3>
        </div>

        <DataTable
          columns={columns}
          data={filteredForms}
          loading={loading}
          emptyMessage="No defect forms match the selected filters."
        />
      </div>

      {/* Report Modal */}
      {activeDefectModal && (
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
          onClick={() => setActiveDefectModal(null)}
        >
          <div
            className="dcs-card"
            style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dcs-card-header">
              <h3 className="dcs-card-title">
                Defect Report: {activeDefectModal.engineNo}
              </h3>
              <button
                className="dcs-btn dcs-btn-secondary"
                style={{ padding: '4px' }}
                onClick={() => setActiveDefectModal(null)}
              >
                <TbX size={18} />
              </button>
            </div>

            <div className="dcs-kv-grid" style={{ marginBottom: '16px' }}>
              <div className="dcs-kv-item">
                <span className="dcs-kv-label">Engine Number</span>
                <span className="dcs-kv-value">{activeDefectModal.engineNo}</span>
              </div>
              <div className="dcs-kv-item">
                <span className="dcs-kv-label">Engine Code</span>
                <span className="dcs-kv-value">{activeDefectModal.engineCode || '-'}</span>
              </div>
              <div className="dcs-kv-item">
                <span className="dcs-kv-label">Defect Content</span>
                <StatusBadge status={activeDefectModal.defectContent} />
              </div>
              <div className="dcs-kv-item">
                <span className="dcs-kv-label">Quality Checker</span>
                <span className="dcs-kv-value">{activeDefectModal.checker || '-'}</span>
              </div>
              <div className="dcs-kv-item">
                <span className="dcs-kv-label">Station Occurred</span>
                <span className="dcs-kv-value">{activeDefectModal.stnOccured || '-'}</span>
              </div>
              <div className="dcs-kv-item">
                <span className="dcs-kv-label">Station Detected</span>
                <span className="dcs-kv-value">{activeDefectModal.stnDetected || '-'}</span>
              </div>
            </div>

            <div className="dcs-kv-item" style={{ marginBottom: '16px' }}>
              <span className="dcs-kv-label">Treatment Remarks</span>
              <span className="dcs-kv-value" style={{ fontSize: '13.5px', fontWeight: '400' }}>
                {activeDefectModal.remarks || 'No specific treatment remarks entered.'}
              </span>
            </div>

            {activeDefectModal.image && (
              <div>
                <label>Attached Defect Evidence:</label>
                <img
                  src={dcsApi.getReworkImageUrl(activeDefectModal.image)}
                  alt="Defect Proof"
                  style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '6px' }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DefectReportsScreen;
