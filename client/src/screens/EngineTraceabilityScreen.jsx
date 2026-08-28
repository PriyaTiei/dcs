import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEngineData } from '../redux/slices/egNo/egNoActions';
import { getProcess3Details, processDataClear } from '../redux/slices/processData/processActions';
import crankApi from '../api/crankApi';
import dcsApi from '../api/dcsApi';
import SearchBar from '../components/common/SearchBar';
import AssemblySection from '../components/traceability/AssemblySection';
import MachiningSection from '../components/traceability/MachiningSection';
import TighteningSection from '../components/traceability/TighteningSection';
import PartTraceabilityGrid from '../components/traceability/PartTraceabilityGrid';
import CrankInfoCard from '../components/traceability/CrankInfoCard';
import ExportButton from '../components/traceability/ExportButton';
import LightboxModal from '../components/common/LightboxModal';
import { toast } from 'react-toastify';

export const EngineTraceabilityScreen = () => {
  const [engineNo, setEngineNo] = useState('');
  const [searchEngineNo, setSearchEngineNo] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const [crankinfo, setCrankInfo] = useState(null);
  const [reworkImages, setReworkImages] = useState([]);
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: '',
  });

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.engine.loading);
  const oracleData = useSelector((state) => state.engine.engineData);
  const shippingRow = useSelector((state) => state.engine.shippingData);
  const processNoALCData = useSelector((state) => state.process.data3?.data);

  const machinedParts = ['Block S / N', 'Crank S / N', 'Head S / N'];

  const handleSearch = () => {
    if (!engineNo.trim()) {
      toast.warn('Please enter an Engine Number');
      return;
    }

    setSearchEngineNo(engineNo.trim());
    setSearchTriggered(true);
    dispatch(processDataClear());
    dispatch(getEngineData(engineNo.trim()));

    // Fetch crank info
    crankApi
      .getCrankInfoByEngineNo(engineNo.trim())
      .then((res) => setCrankInfo(res.data))
      .catch(() => setCrankInfo(null));

    // Fetch rework images
    dcsApi
      .queryReworkImages({ engineNo: engineNo.trim() })
      .then((res) => setReworkImages(res.data?.result || []))
      .catch(() => setReworkImages([]));
  };

  // Correlate 3C parts from Oracle data
  useEffect(() => {
    if (oracleData?.data) {
      const selected = oracleData.data.map((item) => [item[17], item[1], item[21]]);
      const c3 = selected.filter((item) => machinedParts.includes(item[0]));

      if (c3.length >= 3) {
        dispatch(getProcess3Details(c3[0][1], c3[1][1], c3[2][1]));
      }
    }
  }, [oracleData]);

  return (
    <div>
      {/* Top Search & Actions Banner */}
      <div className="dcs-search-bar">
        <SearchBar
          value={engineNo}
          onChange={setEngineNo}
          onSearch={handleSearch}
          placeholder="Enter Engine Serial (e.g. 1234567)"
          loading={loading}
        />

        {searchTriggered && (
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--slate-600)' }}>
              Engine Target: <strong>{searchEngineNo}</strong>
            </span>
            <ExportButton
              engineNo={searchEngineNo}
              oracleData={oracleData}
              processNoALCData={processNoALCData}
            />
          </div>
        )}
      </div>

      {/* 1. Assembly & Progression Section */}
      <AssemblySection
        oracleData={oracleData}
        shippingRow={shippingRow}
        loading={loading}
      />

      {/* 2. 3C Machining Telemetry Section */}
      <MachiningSection processNoALCData={processNoALCData} />

      {/* 3. Tightening & IoT Nutrunner Section */}
      {searchTriggered && (
        <TighteningSection
          engineNo={searchEngineNo}
          triggerSearch={searchTriggered}
        />
      )}

      {/* 4. Crank Case Stiffner Card (Temporarily commented out) */}
      {/* <CrankInfoCard crankinfo={crankinfo} /> */}

      {/* 5. Sub-Assembly Part Traceability Grid */}
      {searchTriggered && (
        <PartTraceabilityGrid
          engineNo={searchEngineNo}
          triggerSearch={searchTriggered}
          oracleData={oracleData?.data}
        />
      )}

      {/* 6. Attached Rework Images Gallery */}
      {reworkImages.length > 0 && (
        <div className="dcs-card">
          <div className="dcs-card-header">
            <h3 className="dcs-card-title">
              <span>Engine Rework Photos & Visual Evidence</span>
            </h3>
            <span className="status-pill warning">{reworkImages.length} Photos</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
            {reworkImages.map((img, i) => (
              <div
                key={img._id || i}
                className="dcs-photo-card"
                onClick={() =>
                  setLightboxState({
                    isOpen: true,
                    images: reworkImages.map((item) => ({
                      url: dcsApi.getReworkImageUrl(item.imageName),
                      filename: item.imageName,
                      caption: `Plant: ${item.plant || '-'} | Shift: ${item.shift || '-'}`,
                    })),
                    currentIndex: i,
                    title: 'Rework Image Inspection',
                  })
                }
              >
                <img
                  src={dcsApi.getReworkImageUrl(img.imageName)}
                  alt="Rework Proof"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="dcs-photo-caption">
                  {img.plant || 'Rework Photo'} ({img.shift || '-'})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

export default EngineTraceabilityScreen;
