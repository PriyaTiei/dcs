import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import './pt_table.css';

const PTTable = ({ engineNo, triggerSearch }) => {
  const [igData, setIGData] = useState([]);
  const [camData, setCamData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const engineData = useSelector((state) => state.engine.engineData.data);

  useEffect(() => {
    const fetchData = async () => {
      if (!engineNo || !triggerSearch) return;

      try {
        setLoading(true);
        const igResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/ig_coil_chain_cover/${engineNo}`
        );

        setIGData(igResponse.data);

        const camHousingSN = engineData?.find((item) => item[17] === "CamHousing S/N");
        const camEngineNo = camHousingSN ? camHousingSN[3] : null;

        if (camEngineNo) {
          // Fetch camshaft data using the extracted engine number
          const camResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/cam_shaft/${camEngineNo}`
          );
          setCamData(camResponse.data);
        }

        setError(null);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [engineNo, triggerSearch, engineData]);

  // Get the latest record from the data if available
  const latestRecord = igData.length > 0 ? igData[0] : null;

  return (
    <div className="pt-info-container">
      {/* Ignition Coil & Chain Cover Section */}
      <div className="ig-info-container">
        <h5>Ignition coil & Chain Cover</h5>
        {loading ? (
          <p>Loading Ignition coil & Chain Cover data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : igData.length === 0 ? (
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

      {/* Cam Shaft Section */}
      <div className="cam-info-container" style={{ marginTop: '20px' }}>
        <h5>Cam Shaft</h5>
        {loading ? (
          <p>Loading Cam Shaft data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : !camData ? (
          <p>No data found for this engine</p>
        ) : (
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">Cam Housing SL No:</td>
                <td className="info-value">{camData.cam_housing_sl_no || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Cam Shaft Intake SL No:</td>
                <td className="info-value">{camData.cam_shaft_intake_sl_no || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Cam Shaft Exhaust SL No:</td>
                <td className="info-value">{camData.cam_shaft_exhaust_sl_no || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Date and Time:</td>
                <td className="info-value">
                  {camData.time_of_scan ? moment(camData.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PTTable;