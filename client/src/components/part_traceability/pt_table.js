import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import './pt_table.css';

const PTTable = ({ engineNo, triggerSearch }) => {
  const [igData, setIGData] = useState([]);
  const [chainCaseData, setChainCaseData] = useState([]);
  const [fuelDeliveryPipeData, setFuelDeliveryPipeData] = useState([]);
  const [pcvData, setPCVData] = useState([]);
  const [wireHarnessData, setWireHarnessData] = useState([]);
  const [camData, setCamData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const engineData = useSelector((state) => state.engine.engineData.data);

  useEffect(() => {
    const fetchData = async () => {
      if (!engineNo || !triggerSearch) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch ignition coil & chain cover data
        try {
          const igResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/ig_coil_chain_cover/${engineNo}`
          );
          setIGData(igResponse.data);
        } catch (err) {
          console.error('Error fetching ignition coil data:', err);
          setIGData([]);
        }

        // Fetch chain case data
        try {
          const chainCaseResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/chaincase/${engineNo}`
          );
          setChainCaseData(chainCaseResponse.data);
        } catch (err) {
          console.error('Error fetching chain case data:', err);
          setChainCaseData([]);
        }

        // Fetch fuel delivery pipe data
        try {
          const fuelDeliveryPipeResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/fueldeliverypipe/${engineNo}`
          );
          setFuelDeliveryPipeData(fuelDeliveryPipeResponse.data);
        } catch (err) {
          console.error('Error fetching fuel delivery pipe data:', err);
          setFuelDeliveryPipeData([]);
        }

        // Fetch PCV data
        try {
          const pcvResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/pcv/${engineNo}`
          );
          setPCVData(pcvResponse.data);
        } catch (err) {
          console.error('Error fetching PCV data:', err);
          setPCVData([]);
        }

        // Fetch wire harness data
        try {
          const wireHarnessResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/wireharness/${engineNo}`
          );
          setWireHarnessData(wireHarnessResponse.data);
        } catch (err) {
          console.error('Error fetching wire harness data:', err);
          setWireHarnessData([]);
        }

        // Fetch camshaft data if we have the engine data
        if (engineData && engineData.length > 0) {
          const camHousingSN = engineData.find((item) => item[17] === "CamHousing S/N");
          const camEngineNo = camHousingSN ? camHousingSN[3] : engineNo;

          if (camEngineNo) {
            try {
              const camResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/api/cam_shaft/${camEngineNo}`
              );
              setCamData(camResponse.data);
            } catch (err) {
              console.error('Error fetching camshaft data:', err);
              setCamData(null);
            }
          }
        }
      } catch (err) {
        setError('Error fetching data');
        console.error('General error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [engineNo, triggerSearch, engineData]);

  // Get the latest record from the data if available
  const latestIGRecord = igData && igData.length > 0 ? igData[0] : null;
  const latestChainCaseRecord = chainCaseData && chainCaseData.length > 0 ? chainCaseData[0] : null;
  const latestFuelDeliveryPipeRecord = fuelDeliveryPipeData && fuelDeliveryPipeData.length > 0 ? fuelDeliveryPipeData[0] : null;
  const latestPCVRecord = pcvData && pcvData.length > 0 ? pcvData[0] : null;
  const latestWireHarnessRecord = wireHarnessData && wireHarnessData.length > 0 ? wireHarnessData[0] : null;

  return (
    <div className="pt-info-container">
      {/* Ignition Coil & Chain Cover Section */}
      <div className="ig-info-container">
        <h5>Ignition coil & Chain Cover</h5>
        {loading ? (
          <p>Loading Ignition coil & Chain Cover data...</p>
        ) : !latestIGRecord ? (
          <p>No data found for this engine</p>
        ) : (
          <table className="info-table">
            <tbody>
              {latestIGRecord.ig_coil_sl_no && Array.isArray(latestIGRecord.ig_coil_sl_no) ? 
                latestIGRecord.ig_coil_sl_no.map((coil, index) => (
                  <tr key={`coil-${index}`}>
                    <td className="info-label">IG Coil {index + 1}:</td>
                    <td className="info-value">{coil || '-'}</td>
                  </tr>
                )) 
                : 
                <tr>
                  <td className="info-label">IG Coil:</td>
                  <td className="info-value">-</td>
                </tr>
              }
              <tr>
                <td className="info-label">Chain Cover:</td>
                <td className="info-value">{latestIGRecord.chain_cover_sl_no || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Date and Time:</td>
                <td className="info-value">
                  {latestIGRecord.time_of_scan ? moment(latestIGRecord.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Chain Case Section */}
      <div className="chain-case-info-container" style={{ marginTop: '20px' }}>
        <h5>Chain Case</h5>
        {loading ? (
          <p>Loading Chain Case data...</p>
        ) : !latestChainCaseRecord ? (
          <p>No data found for this engine</p>
        ) : (
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">Part Number:</td>
                <td className="info-value">{latestChainCaseRecord.part_number || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Scan Time:</td>
                <td className="info-value">
                  {latestChainCaseRecord.scan_time ? moment(latestChainCaseRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Fuel Delivery Pipe Section */}
      <div className="fuel-delivery-pipe-info-container" style={{ marginTop: '20px' }}>
        <h5>Fuel Delivery Pipe</h5>
        {loading ? (
          <p>Loading Fuel Delivery Pipe data...</p>
        ) : !latestFuelDeliveryPipeRecord ? (
          <p>No data found for this engine</p>
        ) : (
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">Part Number:</td>
                <td className="info-value">{latestFuelDeliveryPipeRecord.part_number || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Scan Time:</td>
                <td className="info-value">
                  {latestFuelDeliveryPipeRecord.scan_time ? moment(latestFuelDeliveryPipeRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* PCV Section */}
      <div className="pcv-info-container" style={{ marginTop: '20px' }}>
        <h5>PCV</h5>
        {loading ? (
          <p>Loading PCV data...</p>
        ) : !latestPCVRecord ? (
          <p>No data found for this engine</p>
        ) : (
          <table className="info-table">
            <tbody>
              <tr>
                <td className="info-label">Part Number:</td>
                <td className="info-value">{latestPCVRecord.part_number || '-'}</td>
              </tr>
              <tr>
                <td className="info-label">Scan Time:</td>
                <td className="info-value">
                  {latestPCVRecord.scan_time ? moment(latestPCVRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {/* Wire Harness Section */}
      <div className="wire-harness-info-container" style={{ marginTop: '20px' }}>
        <h5>Wire Harness</h5>
        {loading ? (
          <p>Loading Wire Harness data...</p>
        ) : !latestWireHarnessRecord ? (
          <p>No data found for this engine</p>
        ) : (
          <table className="info-table">
            <tbody>
              {latestWireHarnessRecord.part_number && Array.isArray(latestWireHarnessRecord.part_number) ? (
                <>
                  <tr>
                    <td className="info-label">Wire Sensor:</td>
                    <td className="info-value">{latestWireHarnessRecord.part_number[0] || '-'}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Wire Harness 5:</td>
                    <td className="info-value">{latestWireHarnessRecord.part_number[1] || '-'}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Wire Harness 6:</td>
                    <td className="info-value">{latestWireHarnessRecord.part_number[2] || '-'}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td className="info-label">Wire Harness:</td>
                  <td className="info-value">-</td>
                </tr>
              )}
              <tr>
                <td className="info-label">Scan Time:</td>
                <td className="info-value">
                  {latestWireHarnessRecord.scan_time ? moment(latestWireHarnessRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
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