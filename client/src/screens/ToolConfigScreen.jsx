import React, { useState, useEffect } from 'react';
import postgresApi from '../api/postgresApi';
import DataTable from '../components/common/DataTable';
import { TbPlus, TbPencil, TbTrash, TbX, TbCheck } from 'react-icons/tb';
import { toast } from 'react-toastify';

export const ToolConfigScreen = () => {
  const [toolData, setToolData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState({ station: '', folder: '' });

  const [formData, setFormData] = useState({
    station: '',
    folder: '',
    tool_name: '',
  });

  const fetchTools = async () => {
    try {
      setLoading(true);
      const res = await postgresApi.getStationToolMap();
      setToolData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching tool map:', err);
      toast.error('Failed to load station tool mapping data.');
      setToolData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ station: '', folder: '', tool_name: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setIsEditing(true);
    setEditingKey({ station: record.station, folder: record.folder });
    setFormData({
      station: record.station,
      folder: record.folder,
      tool_name: record.tool_name,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.station.trim() || !formData.folder.trim() || !formData.tool_name.trim()) {
      toast.warn('All fields are required.');
      return;
    }

    try {
      if (isEditing) {
        await postgresApi.updateStationToolMap(editingKey.station, editingKey.folder, formData);
        toast.success('Tool mapping updated successfully.');
      } else {
        await postgresApi.addStationToolMap(formData);
        toast.success('New tool mapping created.');
      }
      setModalOpen(false);
      fetchTools();
    } catch (err) {
      console.error('Error saving tool mapping:', err);
      toast.error(err.response?.data?.message || 'Error saving tool mapping record.');
    }
  };

  const handleDelete = async (station, folder) => {
    if (window.confirm(`Are you sure you want to delete tool mapping for Station "${station}", Folder "${folder}"?`)) {
      try {
        await postgresApi.deleteStationToolMap(station, folder);
        toast.success('Tool mapping deleted.');
        fetchTools();
      } catch (err) {
        console.error('Error deleting tool mapping:', err);
        toast.error('Failed to delete tool mapping.');
      }
    }
  };

  const columns = [
    {
      header: 'Station Identifier',
      accessor: 'station',
      render: (val) => <strong style={{ color: 'var(--primary-800)' }}>{val || '-'}</strong>,
    },
    {
      header: 'Folder Code',
      accessor: 'folder',
      render: (val) => <span className="status-pill info">{val || '-'}</span>,
    },
    {
      header: 'Tool Name & Description',
      accessor: 'tool_name',
      render: (val) => <span style={{ fontWeight: '500' }}>{val || '-'}</span>,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            className="dcs-btn dcs-btn-secondary"
            style={{ padding: '4px 8px', fontSize: '12px' }}
            onClick={() => handleOpenEdit(row)}
          >
            <TbPencil size={14} /> Edit
          </button>
          <button
            className="dcs-btn"
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              background: 'var(--status-ng-bg)',
              color: 'var(--status-ng-text)',
              border: '1px solid var(--status-ng-border)',
            }}
            onClick={() => handleDelete(row.station, row.folder)}
          >
            <TbTrash size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="dcs-search-bar">
        <div>
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--slate-900)' }}>
            Station-to-Tool Configuration
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
            Manage PostgreSQL IoT nutrunner station mappings and controller folders
          </span>
        </div>

        <button
          className="dcs-btn dcs-btn-primary"
          style={{ marginLeft: 'auto' }}
          onClick={handleOpenAdd}
        >
          <TbPlus size={16} /> Add Tool Mapping
        </button>
      </div>

      <div className="dcs-card">
        <DataTable
          columns={columns}
          data={toolData}
          loading={loading}
          emptyMessage="No station tool mappings defined in database."
        />
      </div>

      {/* Add / Edit Modal Dialog */}
      {modalOpen && (
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
          onClick={() => setModalOpen(false)}
        >
          <div
            className="dcs-card"
            style={{ width: '100%', maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dcs-card-header">
              <h3 className="dcs-card-title">
                {isEditing ? 'Edit Station Tool Mapping' : 'Add New Tool Mapping'}
              </h3>
              <button
                className="dcs-btn dcs-btn-secondary"
                style={{ padding: '4px' }}
                onClick={() => setModalOpen(false)}
              >
                <TbX size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Station (Name or Number) *</label>
                <input
                  type="text"
                  className="dcs-input"
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  placeholder="e.g. 51 or Cam housing sub assy"
                  required
                />
              </div>

              <div className="form-group">
                <label>Folder Code (e.g. 010, 020) *</label>
                <input
                  type="text"
                  className="dcs-input"
                  value={formData.folder}
                  onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                  placeholder="e.g. 017"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Tool Name & Fastening Description *</label>
                <input
                  type="text"
                  className="dcs-input"
                  value={formData.tool_name}
                  onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
                  placeholder="e.g. Knock sensor bolt"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="dcs-btn dcs-btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="dcs-btn dcs-btn-primary">
                  <TbCheck size={16} />
                  {isEditing ? 'Update Mapping' : 'Create Mapping'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolConfigScreen;
