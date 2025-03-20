import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ImpactWrenchData.css';

const ImpactWrenchTable = ({ engineNo, triggerSearch }) => {
  const [wrenchData, setWrenchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [columnCount, setColumnCount] = useState(0);
  const tableRef = useRef(null); 

  useEffect(() => {
    const fetchWrenchData = async () => {
      if (!engineNo || !triggerSearch) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/impactWrench/${engineNo}`
        );

        // Check if all records have null values for tightening_datetime
        const allDataEmpty = response.data.every(item => item.tightening_datetime === null);

        if (allDataEmpty) {
          setWrenchData([]);
        } else {
          // Station sort logic
        const sortedData = [...response.data].sort((a, b) => {
          const isANumeric = /^\d+$/.test(a.station);
          const isBNumeric = /^\d+$/.test(b.station);

          if (isANumeric !== isBNumeric) {
            return isANumeric ? 1 : -1; // Text stations come first
          }

          // Same station type, but different stations
          if (a.station !== b.station) {
            if (!isANumeric) {
              // Both are text - sort alphabetically
              return a.station.localeCompare(b.station);
            } else {
              // Both are numeric - sort numerically
              return Number(a.station) - Number(b.station);
            }
          }

          // Same station - sort by datetime
          const dateA = new Date(a.tightening_datetime || '1970-01-01');
          const dateB = new Date(b.tightening_datetime || '1970-01-01');
          return dateA - dateB;
        });
          setWrenchData(sortedData);
        }
        
        // let data = response.data;

        // data.sort((a, b) => {
        //   const isANumeric = /^\d+$/.test(a.station);
        //   const isBNumeric = /^\d+$/.test(b.station);

        //   if (!isANumeric && isBNumeric) {
        //     return -1; 
        //   } else if (isANumeric && !isBNumeric) {
        //     return 1; 
        //   } else if (!isANumeric && !isBNumeric) {
        //     return a.station.localeCompare(b.station); 
        //   } else {
        //     return Number(a.station) - Number(b.station); 
        //   }
        // });

        // data.sort((a, b) => {
        //   if (a.station === b.station) {
        //     return new Date(a.tightening_datetime || '1970-01-01') - new Date(b.tightening_datetime || '1970-01-01');
        //   }
        //   return 0;
        // });

        setError(null);
      } catch (err) {
        setError('Error fetching wrench data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWrenchData();
  }, [engineNo, triggerSearch]);

  useEffect(() => {
    if (tableRef.current) {
      const headerCells = tableRef.current.querySelectorAll("thead th");
      setColumnCount(headerCells.length || 0);
    }
  }, []);

  return (
    <div className="wrench-container">
      <table className="wrench-table" ref={tableRef}>
        <thead>
          <tr>
            <th>Station No.</th>            
            <th>Tool Name</th>
            <th>Date & Time</th>
            <th>Work No.</th>
            <th>Axis No.</th>
            <th>Count</th>
            <th>Torque</th>
            <th>Angle</th>
            <th>No. of pulses</th>
            <th>Tightening Time</th>
            <th>Free Run Angle</th>
            <th>Snug Angle</th>
            <th>Torque Angle Change</th>
            <th>Judgement</th>         
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columnCount} className="loading-spinner">
                Loading impact wrench data...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columnCount} className="error-message">
                {error}
              </td>
            </tr>
          ) : wrenchData.length === 0 ? (
            <tr>
              <td colSpan={columnCount}>
                {triggerSearch ? 'No wrench data found for this engine' : 'Enter an engine number and click Search'}
              </td>
            </tr>
          ) : (
            wrenchData.map((record, index) => (
              <tr 
                key={index} 
                className={
                  record.judgement && record.judgement.toLowerCase() === 'ok'
                    ? 'highlight-green'
                    : record.judgement && record.judgement.toLowerCase() === 'ng'
                    ? 'highlight-red'
                    : ''
                }>
                <td>{record.station}</td>
                <td>{record.tool_name}</td>
                <td>{record.tightening_datetime ? new Date(record.tightening_datetime).toLocaleString() : '-'}</td>
                <td>{record.work_no !== null ? record.work_no : '-'}</td>
                <td>{record.axis_number !== null ? record.axis_number : '-'}</td>
                <td>{record.count !== null ? record.count : '-'}</td>
                <td>{record.torque !== null ? record.torque : '-'}</td>
                <td>{record.angle !== null ? record.angle : '-'}</td>
                <td>{record.number_of_pulses !== null ? record.number_of_pulses : '-'}</td>
                <td>{record.tightening_time !== null ? record.tightening_time : '-'}</td>
                <td>{record.free_run_angle !== null ? record.free_run_angle : '-'}</td>
                <td>{record.snug_angle !== null ? record.snug_angle : '-'}</td>
                <td>{record.torque_angle_change !== null ? record.torque_angle_change : '-'}</td>               
                <td>{record.judgement !== null ? record.judgement : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImpactWrenchTable;