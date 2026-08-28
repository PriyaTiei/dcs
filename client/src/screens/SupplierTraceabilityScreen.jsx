import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processNoData } from '../components/engno/processNoData';
import {
  setSectionRedux,
  setSubSectionRedux,
} from '../redux/slices/egNo/egNoActions';
import {
  getProcessRangeDetails,
  getProcessRangeDetailsAssy,
  newFromDate,
  newToDate,
} from '../redux/slices/processData/processActions';
import ProcessNumbers from '../components/engno/ProcessNumbers';
import ResultProcess from '../components/engno/ResultProcess';
import ReusablePartNo from '../components/engno/ReusablePartNo';
import Loading from '../components/engno/Loading';
import { CSVLink } from 'react-csv';
import { TbSearch, TbDownload } from 'react-icons/tb';

export const SupplierTraceabilityScreen = () => {
  const dispatch = useDispatch();

  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const processName = useSelector((state) => state.process.processName);
  const fromDateState = useSelector((state) => state.process.fromDate);
  const toDateState = useSelector((state) => state.process.toDate);
  const loading = useSelector((state) => state.process.loading);

  const sectionData = processNoData;
  const defaultSection = sectionData[0]?.section || 'Machining';
  const defaultSubSection = sectionData[0]?.subSection[0]?.name || 'Block Cylinder';

  const [selectedSection, setSelectedSection] = useState(defaultSection);
  const [selectedSubSection, setSelectedSubSection] = useState(defaultSubSection);
  const [indexI, setIndexI] = useState(0);
  const [indexJ, setIndexJ] = useState(0);
  const [rangeMode, setRangeMode] = useState('oneDay'); // 'oneDay' | 'dateRange'
  const [excelData, setExcelData] = useState([[]]);

  const handleSectionChange = (val, i) => {
    setSelectedSection(val);
    dispatch(setSectionRedux(val));
    const subName = sectionData[i]?.subSection[0]?.name || '';
    dispatch(setSubSectionRedux(subName));
    setSelectedSubSection(subName);
    setIndexI(i);
    setIndexJ(0);
  };

  const handleSubSectionChange = (val, j) => {
    setSelectedSubSection(val);
    dispatch(setSubSectionRedux(val));
    setIndexJ(j);
  };

  const handleSearch = () => {
    if (section === 'Machining') {
      dispatch(getProcessRangeDetails(processName, fromDateState, toDateState));
    } else if (section === 'Assembly') {
      dispatch(getProcessRangeDetailsAssy(processName, fromDateState, toDateState));
    }
  };

  const subSections = sectionData[indexI]?.subSection || [];

  return (
    <div>
      {/* Top Filter Controls */}
      <div className="dcs-card">
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">
            <span>Supplier & Machining Process Deep Traceability</span>
          </h3>
          <span className="status-pill info">Filter Query Engine</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
          <div>
            <label>Section Area</label>
            <select
              className="dcs-input"
              value={selectedSection}
              onChange={(e) => {
                const i = sectionData.findIndex((s) => s.section === e.target.value);
                handleSectionChange(e.target.value, i >= 0 ? i : 0);
              }}
            >
              {sectionData.map((s, idx) => (
                <option key={s.section} value={s.section}>
                  {s.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Sub-Section</label>
            <select
              className="dcs-input"
              value={selectedSubSection}
              onChange={(e) => {
                const j = subSections.findIndex((sub) => sub.name === e.target.value);
                handleSubSectionChange(e.target.value, j >= 0 ? j : 0);
              }}
            >
              {subSections.map((sub, idx) => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Query Mode</label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="rangeMode"
                  checked={rangeMode === 'oneDay'}
                  onChange={() => setRangeMode('oneDay')}
                />
                Single Date
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="rangeMode"
                  checked={rangeMode === 'dateRange'}
                  onChange={() => setRangeMode('dateRange')}
                />
                Date Range
              </label>
            </div>
          </div>
        </div>

        {/* Process Numbers & Date Picker */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '16px' }}>
          <ProcessNumbers processNoListInitial={subSections[indexJ]?.processNo || []} />

          <div>
            <label>{rangeMode === 'oneDay' ? 'Select Date' : 'From Date'}</label>
            <input
              type="date"
              className="dcs-input"
              value={(fromDateState || '').slice(0, 10)}
              onChange={(e) => {
                const d = new Date(e.target.value);
                d.setHours(0, 0, 1);
                dispatch(newFromDate(d.toISOString()));
                if (rangeMode === 'oneDay') {
                  const dEnd = new Date(e.target.value);
                  dEnd.setHours(23, 59, 59);
                  dispatch(newToDate(dEnd.toISOString()));
                }
              }}
            />
          </div>

          {rangeMode === 'dateRange' && (
            <div>
              <label>To Date</label>
              <input
                type="date"
                className="dcs-input"
                value={(toDateState || '').slice(0, 10)}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  d.setHours(23, 59, 59);
                  dispatch(newToDate(d.toISOString()));
                }}
              />
            </div>
          )}

          <button className="dcs-btn dcs-btn-primary" onClick={handleSearch} disabled={loading}>
            <TbSearch size={16} />
            {loading ? 'Searching...' : 'Run Query'}
          </button>

          {excelData && excelData.length > 1 && (
            <CSVLink data={excelData} filename="supplier_process_data.csv" style={{ textDecoration: 'none' }}>
              <button className="dcs-btn dcs-btn-secondary">
                <TbDownload size={16} />
                Download CSV
              </button>
            </CSVLink>
          )}
        </div>

        {/* Results Metadata */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '14px' }}>
          <ReusablePartNo />
          <ResultProcess />
        </div>
      </div>

      {/* Query Results View */}
      {loading ? (
        <Loading />
      ) : (
        <div className="dcs-card">
          <div className="dcs-card-header">
            <h3 className="dcs-card-title">
              <span>Telemetry Records for Process: {processName || 'None Selected'}</span>
            </h3>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--slate-600)' }}>
            Select process number above and click <strong>Run Query</strong> to retrieve telemetry batch records.
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierTraceabilityScreen;
