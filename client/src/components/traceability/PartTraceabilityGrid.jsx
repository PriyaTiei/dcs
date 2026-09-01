import React, { useState, useEffect } from 'react';
import postgresApi from '../../api/postgresApi';
import { format12HourTime } from '../../utils/dateUtils';
import LightboxModal from '../common/LightboxModal';
import SkeletonLoader from '../common/SkeletonLoader';

export const PartTraceabilityGrid = ({ engineNo, triggerSearch, oracleData }) => {
  const [loading, setLoading] = useState(false);
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: '',
  });

  // State for all sub-assemblies
  const [igData, setIgData] = useState(null);
  const [igImages, setIgImages] = useState([]);
  const [conData, setConData] = useState(null);
  const [conImages, setConImages] = useState([]);
  const [chainCaseData, setChainCaseData] = useState(null);
  const [chainCoverData, setChainCoverData] = useState(null);
  const [fuelPipeData, setFuelPipeData] = useState(null);
  const [pcvData, setPcvData] = useState(null);
  const [wireHarnessData, setWireHarnessData] = useState(null);
  const [camHousingData, setCamHousingData] = useState(null);
  const [portInjectorData, setPortInjectorData] = useState(null);

  useEffect(() => {
    if (!engineNo || !triggerSearch) return;

    const fetchAllPartData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Ignition Coil Data & Images
        try {
          const res = await postgresApi.getIgCoilChainCoverData(engineNo);
          setIgData(res.data?.[0] || null);
          const imgRes = await postgresApi.getIgCoilImages(engineNo);
          const processed = imgRes.data?.images?.map((img) => ({
            url: img.url.startsWith('http') ? img.url : postgresApi.getIgCoilImageUrl(engineNo, img.filename || 0),
            filename: img.filename,
            caption: `Folder: ${img.folder || 'IG Coil'}`,
          })) || [];
          setIgImages(processed);
        } catch (e) {
          setIgData(null);
          setIgImages([]);
        }

        // 2. Fetch Connecting Rod Data & Images
        try {
          const res = await postgresApi.getConnectingRodData(engineNo);
          setConData(res.data?.[0] || null);
          const imgRes = await postgresApi.getConnectingRodImages(engineNo);
          const processed = imgRes.data?.images?.map((img) => ({
            url: img.url.startsWith('http') ? img.url : postgresApi.getConnectingRodImageUrl(engineNo, img.filename || 0),
            filename: img.filename,
            caption: `Connecting Rod Scan`,
          })) || [];
          setConImages(processed);
        } catch (e) {
          setConData(null);
          setConImages([]);
        }

        // 3. Chain Case & Chain Cover
        try {
          const res = await postgresApi.getChainCaseData(engineNo);
          setChainCaseData(res.data?.[0] || null);
        } catch (e) { setChainCaseData(null); }

        try {
          const res = await postgresApi.getChainCoverData(engineNo);
          setChainCoverData(res.data?.[0] || null);
        } catch (e) { setChainCoverData(null); }

        // 4. Fuel Delivery Pipe & PCV
        try {
          const res = await postgresApi.getFuelDeliveryPipeData(engineNo);
          setFuelPipeData(res.data?.[0] || null);
        } catch (e) { setFuelPipeData(null); }

        try {
          const res = await postgresApi.getPCVData(engineNo);
          setPcvData(res.data?.[0] || null);
        } catch (e) { setPcvData(null); }

        // 5. Wire Harness
        try {
          const res = await postgresApi.getWireHarnessData(engineNo);
          setWireHarnessData(res.data?.[0] || null);
        } catch (e) { setWireHarnessData(null); }

        // 6. Cam Housing & Port Injector based on Oracle Engine Data
        if (oracleData && Array.isArray(oracleData)) {
          const camSn = oracleData.find((item) => item[17] === 'CamHousing S/N')?.[1]?.trim();
          if (camSn) {
            try {
              const res = await postgresApi.getCamHousingData(camSn);
              setCamHousingData({ ...res.data, serial: camSn });
            } catch (e) { setCamHousingData({ serial: camSn }); }
          } else { setCamHousingData(null); }

          const headSn = oracleData.find((item) => item[17] === 'Head S / N')?.[1];
          if (headSn) {
            try {
              const res = await postgresApi.getPortInjectorData(headSn);
              setPortInjectorData({ ...res.data, headSn });
            } catch (e) { setPortInjectorData({ headSn }); }
          } else { setPortInjectorData(null); }
        }
      } catch (err) {
        console.error('Error loading part traceability grid:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPartData();
  }, [engineNo, triggerSearch, oracleData]);

  const openLightbox = (images, title, index = 0) => {
    setLightboxState({
      isOpen: true,
      images,
      currentIndex: index,
      title,
    });
  };

  if (loading) {
    return (
      <div className="dcs-card">
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">Critical Part Traceability & Vision Verification</h3>
        </div>
        <SkeletonLoader count={6} height={60} />
      </div>
    );
  }

  return (
    <div className="dcs-card">
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">
          <span>Critical Sub-Assembly Part Traceability</span>
        </h3>
        <span className="status-pill ok">Vision & Sensor Linked</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* 1. Ignition Coil Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>1. Ignition Coil</h4>
            {igData && <span className="status-pill ok">Scanned</span>}
          </div>
          {igData ? (
            <div>
              <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                <strong>Scan Time:</strong> {format12HourTime(igData.time_of_scan)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                {Array.isArray(igData.ig_coil_sl_no) ? (
                  igData.ig_coil_sl_no.map((coil, idx) => (
                    <div key={idx} style={{ fontSize: '12.5px', color: 'var(--slate-700)' }}>
                      <strong>Coil {idx + 1}:</strong> {coil || '-'}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12.5px' }}>{igData.ig_coil_sl_no || '-'}</div>
                )}
              </div>
              {igImages.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {igImages.map((img, i) => (
                    <div
                      key={i}
                      className="dcs-photo-card"
                      style={{ width: '80px', height: '60px' }}
                      onClick={() => openLightbox(igImages, 'Ignition Coil Camera Capture', i)}
                    >
                      <img src={img.url} alt={`Coil ${i + 1}`} style={{ height: '60px' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Ignition Coil data logged</div>
          )}
        </div>

        {/* 2. Connecting Rod Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>2. Connecting Rod</h4>
            {conData && <span className="status-pill ok">Scanned</span>}
          </div>
          {conData ? (
            <div>
              <div style={{ fontSize: '13px', marginBottom: '8px' }}>
                <strong>Scan Time:</strong> {format12HourTime(conData.time_of_scan)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                {Array.isArray(conData.connecting_rod_sl_no) ? (
                  conData.connecting_rod_sl_no.map((rod, idx) => (
                    <div key={idx} style={{ fontSize: '12.5px', color: 'var(--slate-700)' }}>
                      <strong>Rod {idx + 1}:</strong> {rod || '-'}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12.5px' }}>{conData.connecting_rod_sl_no || '-'}</div>
                )}
              </div>
              {conImages.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {conImages.map((img, i) => (
                    <div
                      key={i}
                      className="dcs-photo-card"
                      style={{ width: '80px', height: '60px' }}
                      onClick={() => openLightbox(conImages, 'Connecting Rod Camera Capture', i)}
                    >
                      <img src={img.url} alt={`Rod ${i + 1}`} style={{ height: '60px' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Connecting Rod data logged</div>
          )}
        </div>

        {/* 3. Chain Case Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>3. Chain Case</h4>
            {chainCaseData && <span className="status-pill ok">Scanned</span>}
          </div>
          {chainCaseData ? (
            <div>
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Part Number:</strong> {chainCaseData.part_number || '-'}
              </div>
              <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                <strong>Scan Time:</strong> {format12HourTime(chainCaseData.scan_time)}
              </div>
              <div
                className="dcs-photo-card"
                onClick={() =>
                  openLightbox(
                    [{ url: postgresApi.getChainCaseImageUrl(engineNo), filename: 'Chain Case Vision Image' }],
                    'Chain Case Camera Inspection'
                  )
                }
              >
                <img src={postgresApi.getChainCaseImageUrl(engineNo)} alt="Chain Case Inspection" />
                <div className="dcs-photo-caption">Click to inspect zoom</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Chain Case data logged</div>
          )}
        </div>

        {/* 4. Chain Cover Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>4. Chain Cover</h4>
            {chainCoverData && <span className="status-pill ok">Scanned</span>}
          </div>
          {chainCoverData ? (
            <div>
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Serial Number:</strong> {chainCoverData.chain_cover_sl_no || '-'}
              </div>
              <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                <strong>Scan Time:</strong> {format12HourTime(chainCoverData.scan_time)}
              </div>
              <div
                className="dcs-photo-card"
                onClick={() =>
                  openLightbox(
                    [{ url: postgresApi.getChainCoverImageUrl(engineNo), filename: 'Chain Cover Vision Image' }],
                    'Chain Cover Camera Inspection'
                  )
                }
              >
                <img src={postgresApi.getChainCoverImageUrl(engineNo)} alt="Chain Cover Inspection" />
                <div className="dcs-photo-caption">Click to inspect zoom</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Chain Cover data logged</div>
          )}
        </div>

        {/* 5. Fuel Delivery Pipe Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>5. Fuel Delivery Pipe</h4>
            {fuelPipeData && <span className="status-pill ok">Scanned</span>}
          </div>
          {fuelPipeData ? (
            <div>
              <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                <strong>Part Number:</strong> {fuelPipeData.part_number || '-'}
              </div>
              <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                <strong>Scan Time:</strong> {format12HourTime(fuelPipeData.scan_time)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Fuel Delivery Pipe data logged</div>
          )}
        </div>

        {/* 6. Wire Harness Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>6. Wire Harness</h4>
            {wireHarnessData && <span className="status-pill ok">Scanned</span>}
          </div>
          {wireHarnessData ? (
            <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>Wire Sensor:</strong> {wireHarnessData.part_number?.[0] || '-'}</div>
              <div><strong>Harness 5:</strong> {wireHarnessData.part_number?.[1] || '-'}</div>
              <div><strong>Harness 6:</strong> {wireHarnessData.part_number?.[2] || '-'}</div>
              <div style={{ fontSize: '12px', color: 'var(--slate-500)', marginTop: '4px' }}>
                Scan: {format12HourTime(wireHarnessData.scan_time)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Wire Harness data logged</div>
          )}
        </div>

        {/* 7. Cam Housing Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>7. Cam Housing</h4>
            {camHousingData && <span className="status-pill ok">Linked</span>}
          </div>
          {camHousingData ? (
            <div>
              <div style={{ fontSize: '12.5px' }}><strong>Serial:</strong> {camHousingData.serial || '-'}</div>
              <div style={{ fontSize: '12.5px' }}><strong>Exhaust Cam:</strong> {camHousingData.cam_shaft_exhaust_sl_no || '-'}</div>
              <div style={{ fontSize: '12.5px', marginBottom: '8px' }}><strong>Intake Cam:</strong> {camHousingData.cam_shaft_intake_sl_no || '-'}</div>
              {camHousingData.serial && (
                <div
                  className="dcs-photo-card"
                  onClick={() =>
                    openLightbox(
                      [{ url: postgresApi.getCamHousingImageUrl(camHousingData.serial), filename: 'Cam Housing Vision Image' }],
                      'Cam Housing Inspection'
                    )
                  }
                >
                  <img src={postgresApi.getCamHousingImageUrl(camHousingData.serial)} alt="Cam Housing Inspection" />
                  <div className="dcs-photo-caption">Click to inspect zoom</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Cam Housing data linked</div>
          )}
        </div>

        {/* 8. Port Injector Card */}
        <div className="dcs-card" style={{ marginBottom: 0 }}>
          <div className="dcs-card-header" style={{ paddingBottom: '8px', marginBottom: '10px' }}>
            <h4 style={{ fontSize: '14px', margin: 0, color: 'var(--primary-800)' }}>8. Port Injector</h4>
            {portInjectorData && <span className="status-pill ok">Linked</span>}
          </div>
          {portInjectorData ? (
            <div>
              <div style={{ fontSize: '12.5px', marginBottom: '4px' }}><strong>Head Serial:</strong> {portInjectorData.headSn || '-'}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '6px' }}>
                {Array.isArray(portInjectorData.port_injector_sl_no) ? (
                  portInjectorData.port_injector_sl_no.map((inj, idx) => (
                    <div key={idx} style={{ fontSize: '12px' }}>
                      <strong>Injector {idx + 1}:</strong> {inj || '-'}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '12px' }}>{portInjectorData.port_injector_sl_no || '-'}</div>
                )}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--slate-500)' }}>
                Scan: {format12HourTime(portInjectorData.time_of_scan)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--slate-500)' }}>No Port Injector data linked</div>
          )}
        </div>

      </div>

      {/* Unified Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        images={lightboxState.images}
        currentIndex={lightboxState.currentIndex}
        title={lightboxState.title}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        onNext={() =>
          setLightboxState((prev) => ({
            ...prev,
            currentIndex: (prev.currentIndex + 1) % prev.images.length,
          }))
        }
        onPrev={() =>
          setLightboxState((prev) => ({
            ...prev,
            currentIndex: (prev.currentIndex + prev.images.length - 1) % prev.images.length,
          }))
        }
      />
    </div>
  );
};

export default PartTraceabilityGrid;
