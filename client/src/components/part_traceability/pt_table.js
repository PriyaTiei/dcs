import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import './pt_table.css';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const PTTable = ({ engineNo, triggerSearch }) => {
  const [isChainCaseImageOpen, setIsChainCaseImageOpen] = useState(false);
  const [igData, setIGData] = useState([]);
  const [conData, setConData] = useState([]);
  const [chainCaseData, setChainCaseData] = useState([]);
  const [chainCoverData, setChainCoverData] = useState([]);
  const [fuelDeliveryPipeData, setFuelDeliveryPipeData] = useState([]);
  const [pcvData, setPCVData] = useState([]);
  const [wireHarnessData, setWireHarnessData] = useState([]);
  const [camHousingSN, setCamHousingSN] = useState(null); 
  const [camHousingExhaust, setCamHousingExhaust] = useState(null); 
  const [camHousingIntake, setCamHousingIntake] = useState(null);
  const [headSN, setHeadSN] = useState(null);
  const [portInjectorData, setPortInjectorData] = useState(null);
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




         // Fetch Connecting data
        try {
          const conResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/connecting_rod/${engineNo}`
          );
          setConData(conResponse.data);
        } catch (err) {
          console.error('Error fetching connecting rod data:', err);
          setConData([]);
        }


        setChainCaseData({
          imageUrl: `${process.env.REACT_APP_BACKEND_URL}/api/chaincase/${engineNo}`
        });
        
        

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


        
        

        try {
          const chainCoverResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/chaincover/${engineNo}`
          );
          setChainCoverData(chainCoverResponse.data);
        } catch (err) {
          console.error('Error fetching chain cover data:', err);
          setChainCoverData([]);
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

  try {
    const igResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/ig_coil_chain_cover/${engineNo}`
    );
    setConData(igResponse.data);
  } catch (err) {
    console.error('Error fetching ignition coil data:', err);
    setConData([]);
  }


  try {
    const conResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/connecting_rod/${engineNo}`
    );
    setConData(conResponse.data);
  } catch (err) {
    console.error('Error fetching connecting rod data:', err);
    setConData([]);
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


  try {
    const chainCoverResponse = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/chaincover/${engineNo}`
    );
    setChainCoverData(chainCoverResponse.data);
  } catch (err) {
    console.error('Error fetching chain case data:', err);
    setChainCoverData([]);
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
 // Fetch CamHousing data from engineData
 if (engineData && engineData.length > 0) {
  const foundCamHousingSN = engineData.find((item) => item[17] === 'CamHousing S/N');
  if (foundCamHousingSN) {
    const camHousingSN = foundCamHousingSN[1].trim(); // Trim any extra spaces
    setCamHousingSN(camHousingSN);

    // Fetch corresponding CamHousing data based on SN
    try {
      const camHousingResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/camhousing/${camHousingSN}`
      );
      setCamHousingExhaust(camHousingResponse.data.cam_shaft_exhaust_sl_no || '-');
      setCamHousingIntake(camHousingResponse.data.cam_shaft_intake_sl_no || '-');
    } catch (err) {
      console.error('Error fetching cam housing data:', err);
      setCamHousingExhaust('-');
      setCamHousingIntake('-');
    }
  } else {
    setCamHousingSN(null);
    setCamHousingExhaust(null);
    setCamHousingIntake(null);
  }
  
  // Fetch Head S/N data from engineData
  const foundHeadSN = engineData.find((item) => item[17] === 'Head S / N');
  if (foundHeadSN) {
    const headSN = foundHeadSN[1]; // No trim needed as per requirement
    setHeadSN(headSN);

    // Fetch corresponding Port Injector data based on Head S/N
    try {
      const portInjectorResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/portinjector/${headSN}`
      );
      setPortInjectorData(portInjectorResponse.data);
    } catch (err) {
      console.error('Error fetching port injector data:', err);
      setPortInjectorData(null);
    }
  } else {
    setHeadSN(null);
    setPortInjectorData(null);
  }
}
} catch (err) {
setError('Error fetching data');
console.error('Error fetching data', err);
} finally {
setLoading(false);
}
};

fetchData();
}, [engineNo, triggerSearch, engineData]);
    
    

  // Get the latest record from the data if available
  const latestIGRecord = igData && igData.length > 0 ? igData[0] : null;
  const latestConRecord = conData && conData.length > 0 ? conData[0] : null;
  const latestChainCaseRecord = chainCaseData && chainCaseData.length > 0 ? chainCaseData[0] : null;
  const latestChainCoverRecord = chainCoverData && chainCoverData.length > 0 ? chainCoverData[0] : null;
  const latestFuelDeliveryPipeRecord = fuelDeliveryPipeData && fuelDeliveryPipeData.length > 0 ? fuelDeliveryPipeData[0] : null;
  const latestPCVRecord = pcvData && pcvData.length > 0 ? pcvData[0] : null;
  const latestWireHarnessRecord = wireHarnessData && wireHarnessData.length > 0 ? wireHarnessData[0] : null;
  
  return (
    <div className="pt-info-container">
      <div className='tables-row'>
      {/* Ignition Coil & Chain Cover Section */}
        <div className="ig-info-container">
          <h5>Ignition coil</h5>
          {loading ? (
            <p>Loading Ignition coil & Chain Cover data...</p>
          ) : !latestIGRecord ? (
            <div className='error-message'>
              <p>No data found for this engine</p>
            </div>
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
                {/* <tr>
                  <td className="info-label">Chain Cover:</td>
                  <td className="info-value">{latestIGRecord.chain_cover_sl_no || '-'}</td>
                </tr> */}
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



        {/* Connecting Section */}
        <div className="ig-info-container">
          <h5>Connecting rod</h5>
          {loading ? (
            <p>Loading Connecting rod data...</p>
          ) : !latestConRecord ? (
            <div className='error-message'>
              <p>No data found for this engine</p>
            </div>
          ) : (
            <table className="info-table">
              <tbody>
                {latestConRecord.connecting_rod_sl_no && Array.isArray(latestConRecord.connecting_rod_sl_no) ? 
                  latestConRecord.connecting_rod_sl_no.map((coil, index) => (
                    <tr key={`coil-${index}`}>
                      <td className="info-label">Connecting Rod {index + 1}:</td>
                      <td className="info-value">{coil || '-'}</td>
                    </tr>
                  )) 
                  : 
                  <tr>
                    <td className="info-label">Connecting rod:</td>
                    <td className="info-value">-</td>
                  </tr>
                  }
                <tr>
                  <td className="info-label">Date and Time:</td>
                  <td className="info-value">
                    {latestConRecord.time_of_scan ? moment(latestConRecord.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>







    {/* Chain Cover Section */}
    <div className="chain-cover-info-container" style={{ marginTop: '20px' }}>
          <h5>Chain cover</h5>
          {loading ? (
            <p>Loading Chain Cover data...</p>
          ) : !latestChainCoverRecord ? (
            <div className='error-message'>
              <p>No data found for this engine</p>
            </div>
          ) : (
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">Chain cover serial number:</td>
                  <td className="info-value">{latestChainCoverRecord.chain_cover_sl_no || '-'}</td>
                </tr>
                <tr>
                  <td className="info-label">Scan Time:</td>
                  <td className="info-value">
                    {latestChainCoverRecord.scan_time ? moment(latestChainCoverRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>





  <div className="chain-case-info-container" style={{ marginTop: '20px' }}>
    <h5>Chain Case</h5>
    {loading ? (
      <p>Loading Chain Case data...</p>
    ) : !latestChainCaseRecord ? (
      <div className='error-message'>
        <p>No data found for this engine</p>
      </div>
    ) : (
      <>
        <table className="info-table">
          <tbody>
            <tr>
              <td className="info-label">Part Number:</td>
              <td className="info-value">{latestChainCaseRecord.part_number || '-'}</td>
            </tr>
            <tr>
              <td className="info-label">Scan Time:</td>
              <td className="info-value">
                {latestChainCaseRecord.scan_time
                  ? moment(latestChainCaseRecord.scan_time).format('M/DD/YYYY, h:mm:ss A')
                  : '-'}
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Add the clickable image */}
        <img
          src={`${process.env.REACT_APP_BACKEND_URL}/api/chaincase-image/${engineNo}`}
          alt="Chain Case"
          style={{ width: '100%', maxWidth: '500px', marginTop: '15px', cursor: 'zoom-in', border: '1px solid #ccc' }}
          onClick={() => setIsChainCaseImageOpen(true)}
        />
        
        {/* Lightbox for zooming */}
        {isChainCaseImageOpen && (
          <Lightbox
            mainSrc={`${process.env.REACT_APP_BACKEND_URL}/api/chaincase-image/${engineNo}`}
            onCloseRequest={() => setIsChainCaseImageOpen(false)}
          />
        )}
      </>
    )}
  </div>










        {/* Fuel Delivery Pipe Section */}
        <div className="fuel-delivery-pipe-info-container" style={{ marginTop: '20px' }}>
          <h5>Fuel Delivery Pipe</h5>
          {loading ? (
            <p>Loading Fuel Delivery Pipe data...</p>
          ) : !latestFuelDeliveryPipeRecord ? (
            <div className='error-message'>
              <p>No data found for this engine</p>
            </div>
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
            <div className='error-message'>
              <p>No data found for this engine</p>
            </div>
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
            <div className='error-message'>
              <p>No data found for this engine</p>
            </div>
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

    <div className="cam-info-container" style={{ marginTop: '20px' }}>
          <h5>Cam Housing Data</h5>
          {loading ? (
            <p>Loading Cam Housing data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : !camHousingSN ? (
            <div className='error-message'>
              <p>No Cam Housing data found for this engine</p>
            </div>
          ) : (
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">Cam Housing SL No:</td>
                  <td claPINssName="info-value">{camHousingSN || '-'}</td>
                </tr>
                <tr>
                  <td className="info-label">Cam Housing Exhaust:</td>
                  <td className="info-value">{camHousingExhaust || '-'}</td>
                </tr>
                <tr>
                  <td className="info-label">Cam Housing Intake:</td>
                  <td className="info-value">{camHousingIntake || '-'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
    {/* Port Injector Section */}
    <div className="port-injector-info-container" style={{ marginTop: '20px' }}>
          <h5>Port Injector Data</h5>
          {loading ? (
            <p>Loading Port Injector data...</p>
          ) : error ? (
            <p>{error}</p>
          ) : !headSN ? (
            <div className='error-message'>
              <p>No Head S/N data found for this engine</p>
            </div>
          ) : !portInjectorData ? (
            <div className='error-message'>
              <p>No Port Injector data found for this Head S/N</p>
            </div>
          ) : (
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">Head Serial Number:</td>
                  <td className="info-value">{headSN || '-'}</td>
                </tr>
                {portInjectorData.port_injector_sl_no && Array.isArray(portInjectorData.port_injector_sl_no) ? 
                  portInjectorData.port_injector_sl_no.map((injector, index) => (
                    <tr key={`injector-${index}`}>
                      <td className="info-label">Port Injector Serial Number {index + 1}:</td>
                      <td className="info-value">{injector || '-'}</td>
                    </tr>
                  )) 
                  : 
                  <tr>
                    <td className="info-label">Port Injector Serial Number:</td>
                    <td className="info-value">{portInjectorData.port_injector_sl_no || '-'}</td>
                  </tr>
                }
                <tr>
                  <td className="info-label">Time of Scan:</td>
                  <td className="info-value">
                    {portInjectorData.time_of_scan ? moment(portInjectorData.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PTTable;