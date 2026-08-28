import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePointsDocsPerPage,
  changePointsPagination,
  getChangePoints,
} from '../../redux/slices/changepoints/changePointActions';
import ChangePointEntryForm from './ChangePointEntryForm';
import Headings from './Headings';
import Rows from './Rows';
import { TbPlus, TbMinus, TbRotateClockwise, TbAlertCircle, TbArrowsExchange } from 'react-icons/tb';
import { Pagination, Select } from 'semantic-ui-react';

function ChangePoints() {
  const [refresh, setRefresh] = useState(true);
  const [showEntryForm, setShowEntryForm] = useState(true);
  const [filtered, setfiltered] = useState({
    startDate: '',
    endDate: '',
    mmmm: '',
    station: '',
    point: '',
    reason: '',
    action: '',
    traceability: '',
    result: '',
    nextAction: '',
    responsibility: '',
    counteraction: '',
  });

  const dispatch = useDispatch();

  const changePointsState = useSelector((state) => state.changePoints);
  const { changePoints, changePointPagination, loading } = changePointsState;

  useEffect(() => {
    dispatch(changePointsPagination(1));
  }, [refresh, filtered]);

  useEffect(() => {
    dispatch(
      getChangePoints(
        filtered,
        changePointPagination.currentPage,
        changePointPagination.docsPerPage
      )
    );
  }, [refresh, filtered, changePointPagination.currentPage, changePointPagination.docsPerPage]);

  const changeDocsPerPage = (val) => {
    dispatch(changePointsDocsPerPage(val));
  };

  const handleResetFilters = () => {
    setfiltered({
      startDate: '',
      endDate: '',
      mmmm: '',
      station: '',
      point: '',
      reason: '',
      action: '',
      traceability: '',
      result: '',
      nextAction: '',
      responsibility: '',
      counteraction: '',
    });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Top Hero Banner */}
      <div className="cp-hero-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                }}
              >
                <TbArrowsExchange size={22} />
              </div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                4M Change Point Monitoring Sheet
              </h2>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px', marginLeft: '46px' }}>
              Real-time monitoring and traceability for Man, Machine, Material, and Method changes
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className={`dcs-btn ${showEntryForm ? 'dcs-btn-secondary' : 'dcs-btn-primary'}`}
              onClick={() => setShowEntryForm((prev) => !prev)}
            >
              {showEntryForm ? <TbMinus size={16} /> : <TbPlus size={16} />}
              {showEntryForm ? 'Hide Entry Form' : '+ New Change Point'}
            </button>
          </div>
        </div>
      </div>

      {/* Entry Form (Collapsible) */}
      {showEntryForm && <ChangePointEntryForm setRefresh={setRefresh} />}

      {/* Filter & Pagination Control Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="dcs-btn dcs-btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12.5px' }}
            onClick={handleResetFilters}
          >
            <TbRotateClockwise size={15} />
            Reset Filters
          </button>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>
            Showing <strong>{changePoints?.length || 0}</strong> records
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Docs/page:</span>
            <Select
              style={{ minWidth: '90px', padding: '6px 10px', fontSize: '12px' }}
              value={changePointPagination.docsPerPage}
              onChange={(e, { value }) => changeDocsPerPage(value)}
              options={[
                { key: '10 docs/page', value: 10, text: '10' },
                { key: '25 docs/page', value: 25, text: '25' },
                { key: '50 docs/page', value: 50, text: '50' },
                { key: '100 docs/page', value: 100, text: '100' },
              ]}
            />
          </div>

          <Pagination
            onPageChange={(e, a) => dispatch(changePointsPagination(a.activePage))}
            activePage={changePointPagination.currentPage}
            totalPages={changePointPagination.totalPages || 1}
            size="mini"
          />
        </div>
      </div>

      {/* Main 4M Enterprise Table */}
      <div className="cp-table-container">
        <Headings filtered={filtered} setfiltered={setfiltered} />

        {changePoints?.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#64748b',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <TbAlertCircle size={28} color="#94a3b8" />
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
              No Change Points Found
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              No 4M change point records match your current filter parameters.
            </div>
          </div>
        ) : (
          changePoints.map((element) => (
            <Rows key={element._id} element={element} />
          ))
        )}
      </div>
    </div>
  );
}

export default ChangePoints;