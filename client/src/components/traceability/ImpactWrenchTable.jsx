import React, { useState, useEffect } from 'react';
import postgresApi from '../../api/postgresApi';
import { formatStandardDateTime } from '../../utils/dateUtils';
import StatusBadge from '../common/StatusBadge';
import SkeletonLoader from '../common/SkeletonLoader';

export const ImpactWrenchTable = ({ engineNo, triggerSearch }) => {
  const [wrenchData, setWrenchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWrenchData = async () => {
      if (!engineNo || !triggerSearch) return;

      try {
        setLoading(true);
        setError(null);
        const response = await postgresApi.getImpactWrenchData(engineNo);
        const rawData = Array.isArray(response.data) ? response.data : [];

        // Check if all records have null values for tightening_datetime
        const allDataEmpty = rawData.every((item) => item.tightening_datetime === null);

        if (allDataEmpty || rawData.length === 0) {
          setWrenchData([]);
        } else {
          // Filter out completely null entries and sort
          const validRecords = rawData.filter((item) => item && item.torque !== null);
          const sortedData = [...validRecords].sort((a, b) => {
            const isANumeric = /^\d+$/.test(String(a.station));
            const isBNumeric = /^\d+$/.test(String(b.station));

            if (isANumeric !== isBNumeric) {
              return isANumeric ? 1 : -1;
            }
            if (a.station !== b.station) {
              return isANumeric ? Number(a.station) - Number(b.station) : String(a.station).localeCompare(String(b.station));
            }
            return new Date(a.tightening_datetime || 0) - new Date(b.tightening_datetime || 0);
          });
          setWrenchData(sortedData);
        }
      } catch (err) {
        console.error('Error fetching URYU wrench data:', err);
        setError('Failed to fetch URYU impact wrench data');
        setWrenchData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWrenchData();
  }, [engineNo, triggerSearch]);

  if (loading) {
    return <SkeletonLoader height={32} count={5} />;
  }

  if (error) {
    return (
      <div style={{ color: 'var(--status-ng-solid)', padding: '12px', fontSize: '13px' }}>
        {error}
      </div>
    );
  }

  if (wrenchData.length === 0) {
    return (
      <div style={{ color: 'var(--slate-500)', padding: '16px', fontSize: '13px', textAlign: 'center' }}>
        No URYU tightening records found for engine {engineNo}
      </div>
    );
  }

  return (
    <div className="dcs-table-container">
      <table className="dcs-table">
        <thead>
          <tr>
            <th>Station</th>
            <th>Folder</th>
            <th>Tool Name</th>
            <th>Torque (N·m)</th>
            <th>Angle (deg)</th>
            <th>Batch Count</th>
            <th>Timestamp</th>
            <th>Judgment</th>
          </tr>
        </thead>
        <tbody>
          {wrenchData.map((record, index) => (
            <tr key={index}>
              <td style={{ fontWeight: '600' }}>{record.station || '-'}</td>
              <td>{record.folder || '-'}</td>
              <td style={{ fontWeight: '500', color: 'var(--slate-800)' }}>{record.tool_name || '-'}</td>
              <td style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
                {record.torque !== null ? Number(record.torque).toFixed(2) : '-'}
              </td>
              <td>{record.angle !== null ? record.angle : '-'}</td>
              <td>{record.batch_count ?? '-'}</td>
              <td>{formatStandardDateTime(record.tightening_datetime)}</td>
              <td>
                <StatusBadge status={record.judgement || 'OK'} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImpactWrenchTable;
