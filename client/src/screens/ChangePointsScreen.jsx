import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changePointsDocsPerPage,
  changePointsPagination,
  getChangePoints,
} from '../redux/slices/changepoints/changePointActions';
import ChangePointEntryForm from '../components/changePoints/ChangePointEntryForm';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import { TbFilter, TbRotateClockwise, TbChevronLeft, TbChevronRight } from 'react-icons/tb';

export const ChangePointsScreen = () => {
  const [refresh, setRefresh] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filtered, setFiltered] = useState({
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

  const handleResetFilters = () => {
    setFiltered({
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

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '110px',
    },
    {
      header: '4M Type',
      accessor: 'mmmm',
      render: (val) => <StatusBadge status={val} text={val} />,
      width: '100px',
    },
    {
      header: 'Station',
      accessor: 'station',
      render: (val) => <strong style={{ color: 'var(--primary-700)' }}>{val || '-'}</strong>,
    },
    {
      header: 'Change Point',
      accessor: 'point',
    },
    {
      header: 'Reason',
      accessor: 'reason',
    },
    {
      header: 'Action Taken',
      accessor: 'action',
    },
    {
      header: 'Traceability',
      accessor: 'traceability',
    },
    {
      header: 'Result',
      accessor: 'result',
      render: (val) => <StatusBadge status={val} text={val} />,
    },
    {
      header: 'Responsibility',
      accessor: 'responsibility',
    },
  ];

  return (
    <div>
      {/* Top Banner with Add button & Filters */}
      <div className="dcs-search-bar">
        <button
          className="dcs-btn dcs-btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Change Point
        </button>

        <button
          className="dcs-btn dcs-btn-secondary"
          onClick={handleResetFilters}
        >
          <TbRotateClockwise size={16} />
          Reset Filters
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <label style={{ margin: 0, fontSize: '13px' }}>Docs/Page:</label>
          <select
            className="dcs-input"
            style={{ padding: '6px 10px', width: 'auto' }}
            value={changePointPagination.docsPerPage}
            onChange={(e) => dispatch(changePointsDocsPerPage(Number(e.target.value)))}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {/* Main 4M Grid */}
      <div className="dcs-card">
        <div className="dcs-card-header">
          <h3 className="dcs-card-title" style={{ fontSize: '18px', fontWeight: 700 }}>
            <span>4M Change Point Monitoring Sheet (Man, Machine, Material, Method)</span>
          </h3>
          <span className="status-pill info">
            Page {changePointPagination.currentPage} of {changePointPagination.totalPages || 1}
          </span>
        </div>

        <DataTable
          columns={columns}
          data={changePoints}
          loading={loading}
          emptyMessage="No 4M change points match your query criteria."
        />

        {/* Pagination Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--slate-100)',
          }}
        >
          <button
            className="dcs-btn dcs-btn-secondary"
            disabled={changePointPagination.currentPage <= 1}
            onClick={() => dispatch(changePointsPagination(changePointPagination.currentPage - 1))}
          >
            <TbChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '13px', color: 'var(--slate-600)' }}>
            Page <strong>{changePointPagination.currentPage}</strong> / {changePointPagination.totalPages || 1}
          </span>

          <button
            className="dcs-btn dcs-btn-secondary"
            disabled={changePointPagination.currentPage >= changePointPagination.totalPages}
            onClick={() => dispatch(changePointsPagination(changePointPagination.currentPage + 1))}
          >
            Next <TbChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Entry Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="dcs-card"
            style={{ width: '100%', maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ChangePointEntryForm
              setRefresh={() => {
                setRefresh((prev) => !prev);
                setShowAddModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePointsScreen;
