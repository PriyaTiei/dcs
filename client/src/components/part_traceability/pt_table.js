// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import moment from 'moment';
// import { useSelector } from 'react-redux';
// import './pt_table.css';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';

// const PTTable = ({ engineNo, triggerSearch }) => {
//   const [isChainCaseImageOpen, setIsChainCaseImageOpen] = useState(false);
//   const [igData, setIGData] = useState([]);
//   const [igCoilImages, setIGCoilImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isIGCoilImageOpen, setIsIGCoilImageOpen] = useState(false);
//   const [conData, setConData] = useState([]);
//   const [chainCaseData, setChainCaseData] = useState([]);
//   const [chainCoverData, setChainCoverData] = useState([]);
//   const [fuelDeliveryPipeData, setFuelDeliveryPipeData] = useState([]);
//   const [pcvData, setPCVData] = useState([]);
//   const [wireHarnessData, setWireHarnessData] = useState([]);
//   const [camHousingSN, setCamHousingSN] = useState(null); 
//   const [camHousingExhaust, setCamHousingExhaust] = useState(null); 
//   const [camHousingIntake, setCamHousingIntake] = useState(null);
//   const [headSN, setHeadSN] = useState(null);
//   const [portInjectorData, setPortInjectorData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const engineData = useSelector((state) => state.engine.engineData.data);
//   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!engineNo || !triggerSearch) return;

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch ignition coil & chain cover data
//         try {
//           const igResponse = await axios.get(
//             `${BACKEND_URL}/api/ig_coil_chain_cover/${engineNo}`
//           );
//           setIGData(igResponse.data);

//           // Fetch IG Coil images
//           const igCoilImagesResponse = await axios.get(
//             `${BACKEND_URL}/api/ig-coil-images/${engineNo}`
//           );
          
//           // Make sure each image URL uses the correct backend URL
//           const processedImages = igCoilImagesResponse.data.images?.map(image => ({
//             ...image,
//             // Ensure the URL uses the correct backend URL
//             url: image.url.startsWith('http') ? image.url : `${BACKEND_URL}${image.url.startsWith('/') ? '' : '/'}${image.url}`
//           })) || [];
          
//           setIGCoilImages(processedImages);
//         } catch (err) {
//           console.error('Error fetching ignition coil data or images:', err);
//           setIGData([]);
//           setIGCoilImages([]);
//         }

//         // Fetch Connecting data
//         try {
//           const conResponse = await axios.get(
//             `${BACKEND_URL}/api/connecting_rod/${engineNo}`
//           );
//           setConData(conResponse.data);
//         } catch (err) {
//           console.error('Error fetching connecting rod data:', err);
//           setConData([]);
//         }

//         // Fetch chain case data
//         try {
//           const chainCaseResponse = await axios.get(
//             `${BACKEND_URL}/api/chaincase/${engineNo}`
//           );
//           setChainCaseData(chainCaseResponse.data);
//         } catch (err) {
//           console.error('Error fetching chain case data:', err);
//           setChainCaseData([]);
//         }
        
//         try {
//           const chainCoverResponse = await axios.get(
//             `${BACKEND_URL}/api/chaincover/${engineNo}`
//           );
//           setChainCoverData(chainCoverResponse.data);
//         } catch (err) {
//           console.error('Error fetching chain cover data:', err);
//           setChainCoverData([]);
//         }

//         // Fetch fuel delivery pipe data
//         try {
//           const fuelDeliveryPipeResponse = await axios.get(
//             `${BACKEND_URL}/api/fueldeliverypipe/${engineNo}`
//           );
//           setFuelDeliveryPipeData(fuelDeliveryPipeResponse.data);
//         } catch (err) {
//           console.error('Error fetching fuel delivery pipe data:', err);
//           setFuelDeliveryPipeData([]);
//         }

//         // Fetch PCV data
//         try {
//           const pcvResponse = await axios.get(
//             `${BACKEND_URL}/api/pcv/${engineNo}`
//           );
//           setPCVData(pcvResponse.data);
//         } catch (err) {
//           console.error('Error fetching PCV data:', err);
//           setPCVData([]);
//         }

//         // Fetch wire harness data
//         try {
//           const wireHarnessResponse = await axios.get(
//             `${BACKEND_URL}/api/wireharness/${engineNo}`
//           );
//           setWireHarnessData(wireHarnessResponse.data);
//         } catch (err) {
//           console.error('Error fetching wire harness data:', err);
//           setWireHarnessData([]);
//         }

//         // Fetch CamHousing data from engineData
//         if (engineData && engineData.length > 0) {
//           const foundCamHousingSN = engineData.find((item) => item[17] === 'CamHousing S/N');
//           if (foundCamHousingSN) {
//             const camHousingSN = foundCamHousingSN[1].trim(); // Trim any extra spaces
//             setCamHousingSN(camHousingSN);

//             // Fetch corresponding CamHousing data based on SN
//             try {
//               const camHousingResponse = await axios.get(
//                 `${BACKEND_URL}/api/camhousing/${camHousingSN}`
//               );
//               setCamHousingExhaust(camHousingResponse.data.cam_shaft_exhaust_sl_no || '-');
//               setCamHousingIntake(camHousingResponse.data.cam_shaft_intake_sl_no || '-');
//             } catch (err) {
//               console.error('Error fetching cam housing data:', err);
//               setCamHousingExhaust('-');
//               setCamHousingIntake('-');
//             }
//           } else {
//             setCamHousingSN(null);
//             setCamHousingExhaust(null);
//             setCamHousingIntake(null);
//           }
          
//           // Fetch Head S/N data from engineData
//           const foundHeadSN = engineData.find((item) => item[17] === 'Head S / N');
//           if (foundHeadSN) {
//             const headSN = foundHeadSN[1]; // No trim needed as per requirement
//             setHeadSN(headSN);

//             // Fetch corresponding Port Injector data based on Head S/N
//             try {
//               const portInjectorResponse = await axios.get(
//                 `${BACKEND_URL}/api/portinjector/${headSN}`
//               );
//               setPortInjectorData(portInjectorResponse.data);
//             } catch (err) {
//               console.error('Error fetching port injector data:', err);
//               setPortInjectorData(null);
//             }
//           } else {
//             setHeadSN(null);
//             setPortInjectorData(null);
//           }
//         }
//       } catch (err) {
//         setError('Error fetching data');
//         console.error('Error fetching data', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [engineNo, triggerSearch, engineData, BACKEND_URL]);
    
//   // Get the latest record from the data if available
//   const latestIGRecord = igData && igData.length > 0 ? igData[0] : null;
//   const latestConRecord = conData && conData.length > 0 ? conData[0] : null;
//   const latestChainCaseRecord = chainCaseData && chainCaseData.length > 0 ? chainCaseData[0] : null;
//   const latestChainCoverRecord = chainCoverData && chainCoverData.length > 0 ? chainCoverData[0] : null;
//   const latestFuelDeliveryPipeRecord = fuelDeliveryPipeData && fuelDeliveryPipeData.length > 0 ? fuelDeliveryPipeData[0] : null;
//   const latestPCVRecord = pcvData && pcvData.length > 0 ? pcvData[0] : null;
//   const latestWireHarnessRecord = wireHarnessData && wireHarnessData.length > 0 ? wireHarnessData[0] : null;
  
//   // Handler for next image
//   const nextImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       (prevIndex + 1) % igCoilImages.length
//     );
//   };

//   // Handler for previous image
//   const prevImage = () => {
//     setCurrentImageIndex((prevIndex) => 
//       (prevIndex + igCoilImages.length - 1) % igCoilImages.length
//     );
//   };
  
//   // Ensure we have correct image URLs with proper backend URL
//   const getImageUrl = (path) => {
//     if (path && path.startsWith('http')) {
//       return path; // Already an absolute URL
//     }
//     return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
//   };
  
//   return (
  
//     <div className="pt-info-container">
//       <div className='tables-row'>
      
//         <div className="ig-info-container">
//           <h5>Ignition coil</h5>
//           {loading ? (
//             <p>Loading Ignition coil & Chain Cover data...</p>
//           ) : !latestIGRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <>
//               <table className="info-table">
//                 <tbody>
//                   {latestIGRecord.ig_coil_sl_no && Array.isArray(latestIGRecord.ig_coil_sl_no) ? 
//                     latestIGRecord.ig_coil_sl_no.map((coil, index) => (
//                       <tr key={`coil-${index}`}>
//                         <td className="info-label">IG Coil {index + 1}:</td>
//                         <td className="info-value">{coil || '-'}</td>
//                       </tr>
//                     )) 
//                     : 
//                     <tr>
//                       <td className="info-label">IG Coil:</td>
//                       <td className="info-value">-</td>
//                     </tr>
//                   }
//                   <tr>
//                     <td className="info-label">Date and Time:</td>
//                     <td className="info-value">
//                       {latestIGRecord.time_of_scan ? moment(latestIGRecord.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
              
//               {/* IG Coil Images Section */}
//               {igCoilImages.length > 0 && (
//                 <div className="ig-coil-images-container" style={{ marginTop: '15px' }}>
//                   <h6>IG Coil Images</h6>
//                   <div className="image-thumbnails" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//                     {igCoilImages.map((image, index) => (
//                       <img
//                         key={index}
//                         src={image.url}
//                         alt={`IG Coil ${image.folder || index + 1}`}
//                         style={{ 
//                           width: '100px', 
//                           height: '75px', 
//                           objectFit: 'cover', 
//                           cursor: 'zoom-in',
//                           border: '1px solid #ccc' 
//                         }}
//                         onClick={() => {
//                           setCurrentImageIndex(index);
//                           setIsIGCoilImageOpen(true);
//                         }}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
              
//               {/* Lightbox for IG Coil Images */}
//               {isIGCoilImageOpen && igCoilImages.length > 0 && (
//                 <Lightbox
//                   mainSrc={igCoilImages[currentImageIndex].url}
//                   nextSrc={igCoilImages[(currentImageIndex + 1) % igCoilImages.length].url}
//                   prevSrc={igCoilImages[(currentImageIndex + igCoilImages.length - 1) % igCoilImages.length].url}
//                   onCloseRequest={() => setIsIGCoilImageOpen(false)}
//                   onMovePrevRequest={prevImage}
//                   onMoveNextRequest={nextImage}
//                   imageTitle={igCoilImages[currentImageIndex].filename}
//                   imageCaption={`Folder: ${igCoilImages[currentImageIndex].folder || 'Unknown'}`}
//                 />
//               )}
//             </>
//           )}
//         </div>

//         {/* Connecting Section */}
//         <div className="ig-info-container">
//           <h5>Connecting rod</h5>
//           {loading ? (
//             <p>Loading Connecting rod data...</p>
//           ) : !latestConRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <table className="info-table">
//               <tbody>
//                 {latestConRecord.connecting_rod_sl_no && Array.isArray(latestConRecord.connecting_rod_sl_no) ? 
//                   latestConRecord.connecting_rod_sl_no.map((coil, index) => (
//                     <tr key={`coil-${index}`}>
//                       <td className="info-label">Connecting Rod {index + 1}:</td>
//                       <td className="info-value">{coil || '-'}</td>
//                     </tr>
//                   )) 
//                   : 
//                   <tr>
//                     <td className="info-label">Connecting rod:</td>
//                     <td className="info-value">-</td>
//                   </tr>
//                   }
//                 <tr>
//                   <td className="info-label">Date and Time:</td>
//                   <td className="info-value">
//                     {latestConRecord.time_of_scan ? moment(latestConRecord.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Chain Cover Section */}
//         <div className="chain-cover-info-container" style={{ marginTop: '20px' }}>
//           <h5>Chain cover</h5>
//           {loading ? (
//             <p>Loading Chain Cover data...</p>
//           ) : !latestChainCoverRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <table className="info-table">
//               <tbody>
//                 <tr>
//                   <td className="info-label">Chain cover serial number:</td>
//                   <td className="info-value">{latestChainCoverRecord.chain_cover_sl_no || '-'}</td>
//                 </tr>
//                 <tr>
//                   <td className="info-label">Scan Time:</td>
//                   <td className="info-value">
//                     {latestChainCoverRecord.scan_time ? moment(latestChainCoverRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>

//         <div className="chain-case-info-container" style={{ marginTop: '20px' }}>
//           <h5>Chain Case</h5>
//           {loading ? (
//             <p>Loading Chain Case data...</p>
//           ) : !latestChainCaseRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <>
//               <table className="info-table">
//                 <tbody>
//                   <tr>
//                     <td className="info-label">Part Number:</td>
//                     <td className="info-value">{latestChainCaseRecord.part_number || '-'}</td>
//                   </tr>
//                   <tr>
//                     <td className="info-label">Scan Time:</td>
//                     <td className="info-value">
//                       {latestChainCaseRecord.scan_time
//                         ? moment(latestChainCaseRecord.scan_time).format('M/DD/YYYY, h:mm:ss A')
//                         : '-'}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
              
//               {/* Add the clickable image with proper URL construction */}
//               <img
//                 src={`${BACKEND_URL}/api/chaincase-image/${engineNo}`}
//                 alt="Chain Case"
//                 style={{ width: '100%', maxWidth: '500px', marginTop: '15px', cursor: 'zoom-in', border: '1px solid #ccc' }}
//                 onClick={() => setIsChainCaseImageOpen(true)}
//               />
              
//               {/* Lightbox for zooming with proper URL construction */}
//               {isChainCaseImageOpen && (
//                 <Lightbox
//                   mainSrc={`${BACKEND_URL}/api/chaincase-image/${engineNo}`}
//                   onCloseRequest={() => setIsChainCaseImageOpen(false)}
//                 />
//               )}
//             </>
//           )}
//         </div>

//         {/* Fuel Delivery Pipe Section */}
//         <div className="fuel-delivery-pipe-info-container" style={{ marginTop: '20px' }}>
//           <h5>Fuel Delivery Pipe</h5>
//           {loading ? (
//             <p>Loading Fuel Delivery Pipe data...</p>
//           ) : !latestFuelDeliveryPipeRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <table className="info-table">
//               <tbody>
//                 <tr>
//                   <td className="info-label">Part Number:</td>
//                   <td className="info-value">{latestFuelDeliveryPipeRecord.part_number || '-'}</td>
//                 </tr>
//                 <tr>
//                   <td className="info-label">Scan Time:</td>
//                   <td className="info-value">
//                     {latestFuelDeliveryPipeRecord.scan_time ? moment(latestFuelDeliveryPipeRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* PCV Section */}
//         <div className="pcv-info-container" style={{ marginTop: '20px' }}>
//           <h5>PCV</h5>
//           {loading ? (
//             <p>Loading PCV data...</p>
//           ) : !latestPCVRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <table className="info-table">
//               <tbody>
//                 <tr>
//                   <td className="info-label">Part Number:</td>
//                   <td className="info-value">{latestPCVRecord.part_number || '-'}</td>
//                 </tr>
//                 <tr>
//                   <td className="info-label">Scan Time:</td>
//                   <td className="info-value">
//                     {latestPCVRecord.scan_time ? moment(latestPCVRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Wire Harness Section */}
//         <div className="wire-harness-info-container" style={{ marginTop: '20px' }}>
//           <h5>Wire Harness</h5>
//           {loading ? (
//             <p>Loading Wire Harness data...</p>
//           ) : !latestWireHarnessRecord ? (
//             <div className='error-message'>
//               <p>No data found for this engine</p>
//             </div>
//           ) : (
//             <table className="info-table">
//               <tbody>
//                 {latestWireHarnessRecord.part_number && Array.isArray(latestWireHarnessRecord.part_number) ? (
//                   <>
//                     <tr>
//                       <td className="info-label">Wire Sensor:</td>
//                       <td className="info-value">{latestWireHarnessRecord.part_number[0] || '-'}</td>
//                     </tr>
//                     <tr>
//                       <td className="info-label">Wire Harness 5:</td>
//                       <td className="info-value">{latestWireHarnessRecord.part_number[1] || '-'}</td>
//                     </tr>
//                     <tr>
//                       <td className="info-label">Wire Harness 6:</td>
//                       <td className="info-value">{latestWireHarnessRecord.part_number[2] || '-'}</td>
//                     </tr>
//                   </>
//                 ) : (
//                   <tr>
//                     <td className="info-label">Wire Harness:</td>
//                     <td className="info-value">-</td>
//                   </tr>
//                 )}
//                 <tr>
//                   <td className="info-label">Scan Time:</td>
//                   <td className="info-value">
//                     {latestWireHarnessRecord.scan_time ? moment(latestWireHarnessRecord.scan_time).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           )}
//         </div>

//       <div className="cam-info-container" style={{ marginTop: '20px' }}>
//         <h5>Cam Housing Data</h5>
//         {loading ? (
//           <p>Loading Cam Housing data...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : !camHousingSN ? (
//           <div className='error-message'>
//             <p>No Cam Housing data found for this engine</p>
//           </div>
//         ) : (
//           <table className="info-table">
//             <tbody>
//               <tr>
//                 <td className="info-label">Cam Housing SL No:</td>
//                 <td className="info-value">{camHousingSN || '-'}</td>
//               </tr>
//               <tr>
//                 <td className="info-label">Cam Housing Exhaust:</td>
//                 <td className="info-value">{camHousingExhaust || '-'}</td>
//               </tr>
//               <tr>
//                 <td className="info-label">Cam Housing Intake:</td>
//                 <td className="info-value">{camHousingIntake || '-'}</td>
//               </tr>
//             </tbody>
//           </table>
//         )}
//       </div>
      
//       {/* Port Injector Section */}
//       <div className="port-injector-info-container" style={{ marginTop: '20px' }}>
//         <h5>Port Injector Data</h5>
//         {loading ? (
//           <p>Loading Port Injector data...</p>
//         ) : error ? (
//           <p>{error}</p>
//         ) : !headSN ? (
//           <div className='error-message'>
//             <p>No Head S/N data found for this engine</p>
//           </div>
//         ) : !portInjectorData ? (
//           <div className='error-message'>
//             <p>No Port Injector data found for this Head S/N</p>
//           </div>
//         ) : (
//           <table className="info-table">
//             <tbody>
//               <tr>
//                 <td className="info-label">Head Serial Number:</td>
//                 <td className="info-value">{headSN || '-'}</td>
//               </tr>
//               {portInjectorData.port_injector_sl_no && Array.isArray(portInjectorData.port_injector_sl_no) ? 
//                 portInjectorData.port_injector_sl_no.map((injector, index) => (
//                   <tr key={`injector-${index}`}>
//                     <td className="info-label">Port Injector Serial Number {index + 1}:</td>
//                     <td className="info-value">{injector || '-'}</td>
//                   </tr>
//                 )) 
//                 : 
//                 <tr>
//                   <td className="info-label">Port Injector Serial Number:</td>
//                   <td className="info-value">{portInjectorData.port_injector_sl_no || '-'}</td>
//                 </tr>
//               }
//               <tr>
//                 <td className="info-label">Time of Scan:</td>
//                 <td className="info-value">
//                   {portInjectorData.time_of_scan ? moment(portInjectorData.time_of_scan).format('M/DD/YYYY, h:mm:ss A') : '-'}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         )}
//       </div>
//       </div>
//     </div>
//   );
// };

// export default PTTable;


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
  const [igCoilImages, setIGCoilImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isIGCoilImageOpen, setIsIGCoilImageOpen] = useState(false);
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
  const [isChainCoverImageOpen, setIsChainCoverImageOpen] = useState(false);
  const [connectingRodImages, setConnectingRodImages] = useState([]);
  const [isConnectingRodImageOpen, setIsConnectingRodImageOpen] = useState(false);
  
  // New state for cam housing images
  const [isCamHousingIntakeImageOpen, setIsCamHousingIntakeImageOpen] = useState(false);
  const [isCamHousingExhaustImageOpen, setIsCamHousingExhaustImageOpen] = useState(false);

  const engineData = useSelector((state) => state.engine.engineData.data);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchData = async () => {
      if (!engineNo || !triggerSearch) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch ignition coil & chain cover data
        try {
          const igResponse = await axios.get(
            `${BACKEND_URL}/api/ig_coil_chain_cover/${engineNo}`
          );
          setIGData(igResponse.data);

          // Fetch IG Coil images
          const igCoilImagesResponse = await axios.get(
            `${BACKEND_URL}/api/ig-coil-images/${engineNo}`
          );
          
          // Make sure each image URL uses the correct backend URL
          const processedImages = igCoilImagesResponse.data.images?.map(image => ({
            ...image,
            // Ensure the URL uses the correct backend URL
            url: image.url.startsWith('http') ? image.url : `${BACKEND_URL}${image.url.startsWith('/') ? '' : '/'}${image.url}`
          })) || [];
          
          setIGCoilImages(processedImages);
        } catch (err) {
          console.error('Error fetching ignition coil data or images:', err);
          setIGData([]);
          setIGCoilImages([]);
        }

         try {
          const conResponse = await axios.get(
            `${BACKEND_URL}/api/connecting_rod/${engineNo}`
          );
          setConData(conResponse.data);

          // Fetch Connecting Rod images
          const connectingRodImagesResponse = await axios.get(
            `${BACKEND_URL}/api/connecting-rod-images/${engineNo}`
          );
          
          // Make sure each image URL uses the correct backend URL
          const processedConnectingRodImages = connectingRodImagesResponse.data.images?.map(image => ({
            ...image,
            // Ensure the URL uses the correct backend URL
            url: image.url.startsWith('http') ? image.url : `${BACKEND_URL}${image.url.startsWith('/') ? '' : '/'}${image.url}`
          })) || [];
          
          setConnectingRodImages(processedConnectingRodImages);
        } catch (err) {
          console.error('Error fetching connecting rod data or images:', err);
          setConData([]);
          setConnectingRodImages([]);
        }

       
        // Fetch chain case data
        try {
          const chainCaseResponse = await axios.get(
            `${BACKEND_URL}/api/chaincase/${engineNo}`
          );
          setChainCaseData(chainCaseResponse.data);
        } catch (err) {
          console.error('Error fetching chain case data:', err);
          setChainCaseData([]);
        }
        
        try {
          const chainCoverResponse = await axios.get(
            `${BACKEND_URL}/api/chaincover/${engineNo}`
          );
          setChainCoverData(chainCoverResponse.data);
        } catch (err) {
          console.error('Error fetching chain cover data:', err);
          setChainCoverData([]);
        }

        // Fetch fuel delivery pipe data
        try {
          const fuelDeliveryPipeResponse = await axios.get(
            `${BACKEND_URL}/api/fueldeliverypipe/${engineNo}`
          );
          setFuelDeliveryPipeData(fuelDeliveryPipeResponse.data);
        } catch (err) {
          console.error('Error fetching fuel delivery pipe data:', err);
          setFuelDeliveryPipeData([]);
        }

        // Fetch PCV data
        try {
          const pcvResponse = await axios.get(
            `${BACKEND_URL}/api/pcv/${engineNo}`
          );
          setPCVData(pcvResponse.data);
        } catch (err) {
          console.error('Error fetching PCV data:', err);
          setPCVData([]);
        }

        // Fetch wire harness data
        try {
          const wireHarnessResponse = await axios.get(
            `${BACKEND_URL}/api/wireharness/${engineNo}`
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
                `${BACKEND_URL}/api/camhousing/${camHousingSN}`
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
                `${BACKEND_URL}/api/portinjector/${headSN}`
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
  }, [engineNo, triggerSearch, engineData, BACKEND_URL]);
    
  // Get the latest record from the data if available
  const latestIGRecord = igData && igData.length > 0 ? igData[0] : null;
  const latestConRecord = conData && conData.length > 0 ? conData[0] : null;
  const latestChainCaseRecord = chainCaseData && chainCaseData.length > 0 ? chainCaseData[0] : null;
  const latestChainCoverRecord = chainCoverData && chainCoverData.length > 0 ? chainCoverData[0] : null;
  const latestFuelDeliveryPipeRecord = fuelDeliveryPipeData && fuelDeliveryPipeData.length > 0 ? fuelDeliveryPipeData[0] : null;
  const latestPCVRecord = pcvData && pcvData.length > 0 ? pcvData[0] : null;
  const latestWireHarnessRecord = wireHarnessData && wireHarnessData.length > 0 ? wireHarnessData[0] : null;
  
  // Handler for next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % igCoilImages.length
    );
  };

  // Handler for previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + igCoilImages.length - 1) % igCoilImages.length
    );
  };
  
  // Ensure we have correct image URLs with proper backend URL
  const getImageUrl = (path) => {
    if (path && path.startsWith('http')) {
      return path; // Already an absolute URL
    }
    return `${BACKEND_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return moment(dateString).format('M/DD/YYYY, h:mm:ss A');
  };
  
  
  return (
    <div className="pt-info-container">
      <div className='tables-row'>
        {/* Ignition Coil Section */}
        <div className="table-container">
          <h5>Ignition Coil</h5>
          {loading ? (
            <div className="loading-state">Loading ignition coil data...</div>
          ) : !latestIGRecord ? (
            <div className='error-message'>
              <p>No ignition coil data found for this engine</p>
            </div>
          ) : (
            <>
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
                    <td className="info-label">Date and Time:</td>
                    <td className="info-value">
                      {formatDate(latestIGRecord.time_of_scan)}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* IG Coil Images Section */}
              {igCoilImages.length > 0 && (
                <div className="image-section">
                  <h6 className="image-gallery-header">IG Coil Images</h6>
                  <div className="image-thumbnails">
                    {igCoilImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`IG Coil ${image.folder || index + 1}`}
                        className="thumbnail-image"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setIsIGCoilImageOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Lightbox for IG Coil Images */}
              {isIGCoilImageOpen && igCoilImages.length > 0 && (
                <Lightbox
                  mainSrc={igCoilImages[currentImageIndex].url}
                  nextSrc={igCoilImages[(currentImageIndex + 1) % igCoilImages.length].url}
                  prevSrc={igCoilImages[(currentImageIndex + igCoilImages.length - 1) % igCoilImages.length].url}
                  onCloseRequest={() => setIsIGCoilImageOpen(false)}
                  onMovePrevRequest={prevImage}
                  onMoveNextRequest={nextImage}

                  imageCaption={`Folder: ${igCoilImages[currentImageIndex].folder || 'Unknown'}`}
                />
              )}
            </>
          )}
        </div>


{/* Connecting Rod Section */}
        <div className="table-container">
          <h5>Connecting Rod</h5>
          {loading ? (
            <div className="loading-state">Loading connecting rod data...</div>
          ) : !latestConRecord ? (
            <div className='error-message'>
              <p>No connecting rod data found for this engine</p>
            </div>
          ) : (
            <>
              <table className="info-table">
                <tbody>
                  {latestConRecord.connecting_rod_sl_no && Array.isArray(latestConRecord.connecting_rod_sl_no) ? 
                    latestConRecord.connecting_rod_sl_no.map((rod, index) => (
                      <tr key={`rod-${index}`}>
                        <td className="info-label">Connecting Rod {index + 1}:</td>
                        <td className="info-value">{rod || '-'}</td>
                      </tr>
                    )) 
                    : 
                    <tr>
                      <td className="info-label">Connecting Rod:</td>
                      <td className="info-value">-</td>
                    </tr>
                  }
                  <tr>
                    <td className="info-label">Date and Time:</td>
                    <td className="info-value">
                      {formatDate(latestConRecord.time_of_scan)}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {/* Connecting Rod Images Section */}
              {connectingRodImages.length > 0 && (
                <div className="image-section">
                  <h6 className="image-gallery-header">Connecting Rod Images</h6>
                  <div className="image-thumbnails">
                    {connectingRodImages.map((image, index) => (
                      <img
                        key={index}
                        src={image.url}
                        alt={`Connecting Rod ${image.folder || index + 1}`}
                        className="thumbnail-image"
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setIsConnectingRodImageOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Lightbox for Connecting Rod Images */}
              {isConnectingRodImageOpen && connectingRodImages.length > 0 && (
                <Lightbox
                  mainSrc={connectingRodImages[currentImageIndex].url}
                  nextSrc={connectingRodImages[(currentImageIndex + 1) % connectingRodImages.length].url}
                  prevSrc={connectingRodImages[(currentImageIndex + connectingRodImages.length - 1) % connectingRodImages.length].url}
                  onCloseRequest={() => setIsConnectingRodImageOpen(false)}
                  onMovePrevRequest={prevImage}
                  onMoveNextRequest={nextImage}
                  imageCaption={`Folder: ${connectingRodImages[currentImageIndex].folder || 'Unknown'}`}
                />
              )}
            </>
          )}
        </div>

        

        <div className="table-container">
  <h5>Chain Cover</h5>
  {loading ? (
    <div className="loading-state">Loading chain cover data...</div>
  ) : !latestChainCoverRecord ? (
    <div className='error-message'>
      <p>No chain cover data found for this engine</p>
    </div>
  ) : (
    <>
      <table className="info-table">
        <tbody>
          <tr>
            <td className="info-label">Serial Number:</td>
            <td className="info-value">{latestChainCoverRecord.chain_cover_sl_no || '-'}</td>
          </tr>
          <tr>
            <td className="info-label">Scan Time:</td>
            <td className="info-value">
              {formatDate(latestChainCoverRecord.scan_time)}
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="image-container">
        <img
          src={`${BACKEND_URL}/api/chaincover-image/${engineNo}`}
          alt="Chain Cover"
          className="main-image"
          onClick={() => setIsChainCoverImageOpen(true)}
        />
      </div>
      
      {/* Lightbox for zooming with proper URL construction */}
      {isChainCoverImageOpen && (
        <Lightbox
          mainSrc={`${BACKEND_URL}/api/chaincover-image/${engineNo}`}
          onCloseRequest={() => setIsChainCoverImageOpen(false)}
        />
      )}
    </>
  )}
</div>

        {/* Chain Case Section */}
        <div className="table-container">
          <h5>Chain Case</h5>
          {loading ? (
            <div className="loading-state">Loading chain case data...</div>
          ) : !latestChainCaseRecord ? (
            <div className='error-message'>
              <p>No chain case data found for this engine</p>
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
                      {formatDate(latestChainCaseRecord.scan_time)}
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div className="image-container">
                <img
                  src={`${BACKEND_URL}/api/chaincase-image/${engineNo}`}
                  alt="Chain Case"
                  className="main-image"
                  onClick={() => setIsChainCaseImageOpen(true)}
                />
              </div>
              
              {/* Lightbox for zooming with proper URL construction */}
              {isChainCaseImageOpen && (
                <Lightbox
                  mainSrc={`${BACKEND_URL}/api/chaincase-image/${engineNo}`}
                  onCloseRequest={() => setIsChainCaseImageOpen(false)}
                />
              )}
            </>
          )}
        </div>

        {/* Fuel Delivery Pipe Section - commented out */}
        {/* <div className="table-container">
          <h5>Fuel Delivery Pipe</h5>
          {loading ? (
            <div className="loading-state">Loading fuel delivery pipe data...</div>
          ) : !latestFuelDeliveryPipeRecord ? (
            <div className='error-message'>
              <p>No fuel delivery pipe data found for this engine</p>
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
                    {formatDate(latestFuelDeliveryPipeRecord.scan_time)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div> */}

        {/* PCV Section - commented out */}
        {/* <div className="table-container">
          <h5>PCV</h5>
          {loading ? (
            <div className="loading-state">Loading PCV data...</div>
          ) : !latestPCVRecord ? (
            <div className='error-message'>
              <p>No PCV data found for this engine</p>
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
                    {formatDate(latestPCVRecord.scan_time)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div> */}

        {/* Wire Harness Section */}
        <div className="table-container">
          <h5>Wire Harness</h5>
          {loading ? (
            <div className="loading-state">Loading wire harness data...</div>
          ) : !latestWireHarnessRecord ? (
            <div className='error-message'>
              <p>No wire harness data found for this engine</p>
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
                    {formatDate(latestWireHarnessRecord.scan_time)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Cam Housing Data Section */}
        {/* <div className="table-container">
          <h5>Cam Housing Data</h5>
          {loading ? (
            <div className="loading-state">Loading cam housing data...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : !camHousingSN ? (
            <div className='error-message'>
              <p>No cam housing data found for this engine</p>
            </div>
          ) : (
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="info-label">Cam Housing SL No:</td>
                  <td className="info-value">{camHousingSN || '-'}</td>
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
        </div>  */}


        
        {/* Cam Housing Data Section */}
        <div className="table-container">
          <h5>Cam Housing Data</h5>
          {loading ? (
            <div className="loading-state">Loading cam housing data...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : !camHousingSN ? (
            <div className='error-message'>
              <p>No cam housing data found for this engine</p>
            </div>
          ) : (
            <>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td className="info-label">Cam Housing SL No:</td>
                    <td className="info-value">{camHousingSN || '-'}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Cam Shaft Exhaust:</td>
                    <td className="info-value">{camHousingExhaust || '-'}</td>
                  </tr>
                  <tr>
                    <td className="info-label">Cam Shaft Intake:</td>
                    <td className="info-value">{camHousingIntake || '-'}</td>
                  </tr>
                </tbody>
              </table>
              
              {/* Cam Housing Images Section */}
              {camHousingSN && (
                <div className="image-section">
                  <h6 className="image-gallery-header">Cam Housing Images</h6>
                  <div className="cam-housing-images">
                    {/* Intake Image */}
                    <div className="cam-housing-image-item">
                      <p className="image-label">Intake</p>
                      <div className="image-container">
                        <img
                          src={`${BACKEND_URL}/api/camhousing-image/${camHousingSN}?imageType=intake`}
                          alt="Cam Housing Intake"
                          className="main-image"
                          onClick={() => setIsCamHousingIntakeImageOpen(true)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="image-error" style={{display: 'none'}}>
                          Intake image not available
                        </div>
                      </div>
                    </div>
                    
                    {/* Exhaust Image */}
                    <div className="cam-housing-image-item">
                      <p className="image-label">Exhaust</p>
                      <div className="image-container">
                        <img
                          src={`${BACKEND_URL}/api/camhousing-image/${camHousingSN}?imageType=exhaust`}
                          alt="Cam Housing Exhaust"
                          className="main-image"
                          onClick={() => setIsCamHousingExhaustImageOpen(true)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="image-error" style={{display: 'none'}}>
                          Exhaust image not available
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Lightbox for Cam Housing Intake Image */}
              {isCamHousingIntakeImageOpen && (
                <Lightbox
                  mainSrc={`${BACKEND_URL}/api/camhousing-image/${camHousingSN}?imageType=intake`}
                  onCloseRequest={() => setIsCamHousingIntakeImageOpen(false)}
                  imageCaption="Cam Housing - Intake"
                />
              )}
              
              {/* Lightbox for Cam Housing Exhaust Image */}
              {isCamHousingExhaustImageOpen && (
                <Lightbox
                  mainSrc={`${BACKEND_URL}/api/camhousing-image/${camHousingSN}?imageType=exhaust`}
                  onCloseRequest={() => setIsCamHousingExhaustImageOpen(false)}
                  imageCaption="Cam Housing - Exhaust"
                />
              )}
            </>
          )}
        </div>
      
        {/* Port Injector Section - commented out */}
        {/* <div className="table-container">
          <h5>Port Injector Data</h5>
          {loading ? (
            <div className="loading-state">Loading port injector data...</div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : !headSN ? (
            <div className='error-message'>
              <p>No Head S/N data found for this engine</p>
            </div>
          ) : !portInjectorData ? (
            <div className='error-message'>
              <p>No port injector data found for Head S/N</p>
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
                      <td className="info-label">Port Injector {index + 1}:</td>
                      <td className="info-value">{injector || '-'}</td>
                    </tr>
                  )) 
                  : 
                  <tr>
                    <td className="info-label">Port Injector SN:</td>
                    <td className="info-value">{portInjectorData.port_injector_sl_no || '-'}</td>
                  </tr>
                }
                <tr>
                  <td className="info-label">Time of Scan:</td>
                  <td className="info-value">
                    {formatDate(portInjectorData.time_of_scan)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default PTTable;