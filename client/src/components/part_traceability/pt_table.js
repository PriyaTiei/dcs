import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './pt_table.css';

const PTTable = ({ engineNo, triggerSearch }) => {
  const [ptData, setPTData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPTData = async () => {
      if (!engineNo || !triggerSearch) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/partTraceability/${engineNo}`
        );

        setPTData(response.data);
        setError(null);
      } catch (err) {
        setError('Error fetching part traceability data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPTData();
  }, [engineNo, triggerSearch]);

  // Get the latest record from the data if available
  const latestRecord = ptData.length > 0 ? ptData[0] : null;

  return (
    <div className="pt-info-container">

      {loading ? (
        <p>Loading Ignition coil & Chain Cover data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : ptData.length === 0 ? (
        <p>No data found for this engine</p>
      ) : (
        <table className="info-table">
          <tbody>
            {latestRecord.ig_coil_sl_no && latestRecord.ig_coil_sl_no.map((coil, index) => (
              <tr key={`coil-${index}`}>
                <td className="info-label">IG Coil {index + 1}:</td>
                <td className="info-value">{coil || '-'}</td>
              </tr>
            ))}
            <tr>
              <td className="info-label">Chain Cover:</td>
              <td className="info-value">{latestRecord.chain_cover_sl_no || '-'}</td>
            </tr>
            <tr>
              <td className="info-label">Date and Time:</td>
              <td className="info-value">
              {latestRecord.created_at ? moment(latestRecord.created_at).format('M/DD/YYYY, h:mm:ss A') : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PTTable;