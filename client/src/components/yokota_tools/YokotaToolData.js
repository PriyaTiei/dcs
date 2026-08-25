import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './YokotaToolData.css';

const YokotaToolTable = ({ engineNo, triggerSearch }) => {
  const [yokotaData, setYokotaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [columnCount, setColumnCount] = useState(0);
  const tableRef = useRef(null); 

  useEffect(() => {
    const fetchYokotaData = async () => {
      if (!engineNo || !triggerSearch) return;
      
      try {
        setLoading(true);
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://10.82.126.73:5081';
        const response = await axios.get(
          `${backendUrl}/api/yokota/${engineNo}`
        );

        const rawData = Array.isArray(response.data) ? response.data : [];
        // Only keep actual data records (exclude null tightening records)
        const validRecords = rawData.filter(item => item && item.torque !== null && item.timeDate !== null);

        if (validRecords.length === 0) {
          setYokotaData([]);
        } else {
          // Station sort logic
          const sortedData = [...validRecords].sort((a, b) => {
            const stationA = String(a?.station ?? '');
            const stationB = String(b?.station ?? '');

            const isANumeric = /^\d+$/.test(stationA);
            const isBNumeric = /^\d+$/.test(stationB);

            if (isANumeric !== isBNumeric) {
              return isANumeric ? 1 : -1; // Text stations come first
            }

            // Same station type, but different stations
            if (stationA !== stationB) {
              if (!isANumeric) {
                // Both are text - sort alphabetically
                return stationA.localeCompare(stationB);
              } else {
                // Both are numeric - sort numerically
                return Number(stationA) - Number(stationB);
              }
            }

            // Same station - sort by datetime
            const dateA = new Date(a?.timeDate || '1970-01-01');
            const dateB = new Date(b?.timeDate || '1970-01-01');
            return dateA - dateB;
          });
          setYokotaData(sortedData);
        }

        setError(null);
      } catch (err) {
        setError('Error fetching Yokota data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchYokotaData();
  }, [engineNo, triggerSearch]);

  useEffect(() => {
    if (tableRef.current) {
      const headerCells = tableRef.current.querySelectorAll("thead th");
      setColumnCount(headerCells.length || 0);
    }
  }, []);

  // Function to determine row class based on judgement
  const getRowClass = (judgement) => {
    if (judgement === null || judgement === undefined) {
      return '';
    }

    const cleanJudgement = String(judgement).trim().toUpperCase();
    if (cleanJudgement === 'OK' || cleanJudgement === 'AOK') {
      return 'highlight-green';
    }

    return 'highlight-red';
  };

  // Function to format date/time
  const formatDateTime = (timeDate) => {
    if (!timeDate) return '-';
    
    // If the format is "MM/DD HH:MM:SS"
    if (timeDate.match(/^\d{1,2}\/\d{1,2} \d{2}:\d{2}:\d{2}/)) {
      const currentYear = new Date().getFullYear();
      const formattedDate = `${currentYear}/${timeDate}`;
      const d = new Date(formattedDate);
      return !isNaN(d.getTime()) ? d.toLocaleString() : timeDate;
    }
    
    const d = new Date(timeDate);
    return !isNaN(d.getTime()) ? d.toLocaleString() : timeDate;
  };

  return (
    <div className="yokota-container">
      <div className="table-scroll-container">
        <table className="yokota-table" ref={tableRef}>
          <thead>
            <tr>
              <th>Engine Number</th>
              <th>Station No.</th>            
              <th>Tool Name</th>
              <th>Date & Time</th>
              <th>Folder</th>
              <th>Program</th>
              <th>Unknown Value 1</th>
              <th>Torque Duplicate</th>
              <th>Unknown Value 2</th>
              <th>Unknown Value 3</th>
              <th>Unknown Value 4</th>
              <th>Unknown Value 5</th>
              <th>Torque</th>
              <th>Judgement</th>         
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columnCount} className="loading-spinner">
                  <div className='spinner'></div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columnCount} className="error-message">
                  {error}
                </td>
              </tr>
            ) : yokotaData.length === 0 ? (
              <tr>
                <td colSpan={columnCount}>
                  {triggerSearch ? 'No Yokota data found for this engine' : 'Enter an engine number and click Search'}
                </td>
              </tr>
            ) : (
              yokotaData.map((record, index) => (
                <tr 
                  key={index} 
                  className={getRowClass(record.judgement)}>
                  <td>{record.engine_number || '-'}</td>
                  <td>{record.station}</td>
                  <td>{record.tool_name || '-'}</td>
                  <td>{formatDateTime(record.timeDate)}</td>
                  <td>{record.folder !== null ? record.folder : '-'}</td>
                  <td>{record.program !== null ? record.program : '-'}</td>
                  <td>{record.unknownValue1 !== null ? record.unknownValue1 : '-'}</td>
                  <td>{record.torqueDuplicate !== null ? record.torqueDuplicate : '-'}</td>
                  <td>{record.unknownValue2 !== null ? record.unknownValue2 : '-'}</td>
                  <td>{record.unknownValue3 !== null ? record.unknownValue3 : '-'}</td>
                  <td>{record.unknownValue4 !== null ? record.unknownValue4 : '-'}</td>
                  <td>{record.unknownValue5 !== null ? record.unknownValue5 : '-'}</td>
                  <td>{record.torque !== null ? record.torque : '-'}</td>               
                  <td>{record.judgement !== null ? record.judgement : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YokotaToolTable;
