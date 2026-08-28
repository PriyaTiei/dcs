import React, { useState } from 'react';
import dcsApi from '../api/dcsApi';
import LightboxModal from '../components/common/LightboxModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { TbSearch, TbRotateClockwise, TbPhoto } from 'react-icons/tb';
import { toast } from 'react-toastify';

export const ReworkGalleryScreen = () => {
  const [engineNo, setEngineNo] = useState('');
  const [plant, setPlant] = useState('');
  const [shift, setShift] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [listOfImages, setListOfImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: '',
  });

  const plantOptions = [
    { value: 'TNGA_Assembly', label: 'TNGA Assembly' },
    { value: 'TNGA_Machining', label: 'TNGA Machining' },
    { value: 'GD_Assembly', label: 'GD Assembly' },
    { value: 'GD_Machining', label: 'GD Machining' },
    { value: 'Others', label: 'Others' },
  ];

  const shiftOptions = [
    { value: 'White', label: 'White (Morning)' },
    { value: 'Yellow', label: 'Yellow (Evening)' },
    { value: 'Blue', label: 'Blue (Night)' },
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await dcsApi.queryReworkImages({
        engineNo,
        plant,
        shift,
        fromDate,
        toDate,
      });
      const results = res.data?.result || [];
      setListOfImages(results);
      if (results.length === 0) {
        toast.info('No rework images found for the specified criteria.');
      }
    } catch (err) {
      console.error('Error fetching rework images:', err);
      toast.error('Failed to query rework image database.');
      setListOfImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setEngineNo('');
    setPlant('');
    setShift('');
    setFromDate('');
    setToDate('');
    setListOfImages([]);
  };

  return (
    <div>
      {/* Top Filter Bar */}
      <div className="dcs-search-bar" style={{ gap: '12px', alignItems: 'flex-end' }}>
        <div>
          <label>Engine No.</label>
          <input
            type="text"
            className="dcs-input"
            value={engineNo}
            onChange={(e) => setEngineNo(e.target.value)}
            placeholder="Enter Engine Serial"
          />
        </div>

        <div>
          <label>Plant / Division</label>
          <select
            className="dcs-input"
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
          >
            <option value="">All Plants</option>
            {plantOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Production Shift</label>
          <select
            className="dcs-input"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          >
            <option value="">All Shifts</option>
            {shiftOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>From Date</label>
          <input
            type="date"
            className="dcs-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div>
          <label>To Date</label>
          <input
            type="date"
            className="dcs-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          className="dcs-btn dcs-btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          <TbSearch size={16} />
          {loading ? 'Searching...' : 'Search Gallery'}
        </button>

        <button
          className="dcs-btn dcs-btn-secondary"
          onClick={handleClearFilters}
        >
          <TbRotateClockwise size={16} />
          Clear
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="dcs-card">
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">
            <TbPhoto size={20} color="var(--primary-600)" />
            <span>Visual Rework & Evidence Photo Repository</span>
          </h3>
          <span className="status-pill info">{listOfImages.length} Images Loaded</span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            <SkeletonLoader count={8} height={160} />
          </div>
        ) : listOfImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--slate-500)' }}>
            <TbPhoto size={40} color="var(--slate-300)" style={{ marginBottom: '8px' }} />
            <div>No rework photos found. Adjust filters and click <strong>Search Gallery</strong>.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {listOfImages.map((img, i) => (
              <div
                key={img._id || i}
                className="dcs-photo-card"
                onClick={() =>
                  setLightboxState({
                    isOpen: true,
                    images: listOfImages.map((item) => ({
                      url: dcsApi.getReworkImageUrl(item.imageName),
                      filename: item.imageName,
                      caption: `Engine: ${item.engineNo || '-'} | Plant: ${item.plant || '-'} | Shift: ${item.shift || '-'}`,
                    })),
                    currentIndex: i,
                    title: 'Rework Image Inspection',
                  })
                }
              >
                <img
                  src={dcsApi.getReworkImageUrl(img.imageName)}
                  alt="Rework Entry"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="dcs-photo-caption">
                  <div style={{ fontWeight: '600', color: 'var(--slate-900)' }}>
                    Engine: {img.engineNo || 'Unknown'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--slate-500)' }}>
                    {img.plant} ({img.shift})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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

export default ReworkGalleryScreen;
