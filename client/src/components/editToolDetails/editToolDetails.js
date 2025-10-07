import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditToolDetails.css';

const EditToolDetails = () => {
  const [toolData, setToolData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    station: '',
    folder: '',
    tool_name: ''
  });
  const [validationError, setValidationError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchToolData();
  }, []);

  const fetchToolData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/station-tool-map`
      );
      setToolData(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching tool data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateFolderFormat = (folder) => {
    // Allow text folders (like "Special folder")
    if (!/^\d+$/.test(folder)) {
      return folder.trim() !== '';
    }
    
    // For numeric folders, validate range and format
    const num = parseInt(folder);
    return num >= 1 && num <= 65;
  };

  const formatFolder = (folder) => {
    // If it's numeric, format with leading zeros
    if (/^\d+$/.test(folder)) {
      return parseInt(folder).toString().padStart(3, '0');
    }
    return folder;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      station: record.station,
      folder: record.folder,
      tool_name: record.tool_name
    });
    setIsAddingNew(false);
    setValidationError('');
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingRecord(null);
    setFormData({
      station: '',
      folder: '',
      tool_name: ''
    });
    setValidationError('');
  };

  const handleSave = async () => {
    // Validation
    if (!formData.station.trim() || !formData.folder.trim() || !formData.tool_name.trim()) {
      setValidationError('All fields are required');
      return;
    }

    if (!validateFolderFormat(formData.folder)) {
      setValidationError('Folder must be a valid text or number between 001-065');
      return;
    }

    try {
      if (isAddingNew) {
        // Add new record
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/station-tool-map`, {
          station: formData.station,
          folder: formData.folder,
          tool_name: formData.tool_name
        });
      } else {
        // Update existing record
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/station-tool-map/${editingRecord.station}/${editingRecord.folder}`,
          {
            station: formData.station,
            folder: formData.folder,
            tool_name: formData.tool_name
          }
        );
      }
      
      // Refresh data and reset form
      await fetchToolData();
      handleCancel();
    } catch (err) {
      if (err.response?.data?.message) {
        setValidationError(err.response.data.message);
      } else {
        setValidationError('Error saving record');
      }
      console.error('Error:', err);
    }
  };

  const handleDelete = async (station, folder) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BACKEND_URL}/api/station-tool-map/${station}/${folder}`
        );
        await fetchToolData();
      } catch (err) {
        setError('Error deleting record');
        console.error('Error:', err);
      }
    }
  };

  const handleCancel = () => {
    setEditingRecord(null);
    setIsAddingNew(false);
    setFormData({
      station: '',
      folder: '',
      tool_name: ''
    });
    setValidationError('');
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="edit-tool-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tool data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-tool-container">
      <div className="edit-tool-header">
        <h2>Edit Tool Details</h2>
        <div className="header-buttons">
          <button className="add-btn" onClick={handleAddNew}>
            Add New Record
          </button>
          <button className="back-btn" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {(editingRecord || isAddingNew) && (
        <div className="edit-form">
          <h3>{isAddingNew ? 'Add New Record' : 'Edit Record'}</h3>
          
          {validationError && (
            <div className="validation-error">
              {validationError}
            </div>
          )}
          
          <div className="form-group">
            <label>Station:</label>
            <input
              type="text"
              name="station"
              value={formData.station}
              onChange={handleInputChange}
              placeholder="e.g., Cam housing sub assy or 1,2 etc"
            />
            <small className="help-text">
              Enter station number or name
            </small>
          </div>
          
          <div className="form-group">
            <label>Folder:</label>
            <input
              type="text"
              name="folder"
              value={formData.folder}
              onChange={handleInputChange}
              placeholder="e.g., 010, 020 etc"
            />
            <small className="help-text">
              Enter a folder number
            </small>
          </div>
          
          <div className="form-group">
            <label>Tool Name:</label>
            <input
              type="text"
              name="tool_name"
              value={formData.tool_name}
              onChange={handleInputChange}
              placeholder="e.g., Low pressure fuel pr. Sensor"
            />
          </div>
          
          <div className="form-buttons">
            <button className="save-btn" onClick={handleSave}>
              {isAddingNew ? 'Add Record' : 'Update Record'}
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="tool-table">
          <thead>
            <tr>
              <th>Station</th>
              <th>Folder</th>
              <th>Tool Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {toolData.map((record, index) => (
              <tr key={index}>
                <td>{record.station}</td>
                <td>{record.folder}</td>
                <td>{record.tool_name}</td>
                <td>
                  <button 
                    className="edit-btn-small" 
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn-small" 
                    onClick={() => handleDelete(record.station, record.folder)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditToolDetails;