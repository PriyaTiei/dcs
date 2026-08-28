import React, { useState, useEffect } from 'react';
import postgresApi from '../../api/postgresApi';
import { formatStandardDateTime } from '../../utils/dateUtils';
import StatusBadge from '../common/StatusBadge';
import SkeletonLoader from '../common/SkeletonLoader';

export const YokotaToolTable = ({ engineNo, triggerSearch }) => {
  const [yokotaData, setYokotaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchYokotaData = async () => {
      if (!engineNo || !triggerSearch) return;

      try {
        setLoading(true);
        setError(null);
        const response = await postgresApi.getYokotaData(engineNo);
        const rawData = Array.isArray(response.data) ? response.data : [];
        const validRecords = rawData.filter((item) => item && item.torque !== null);

        // Sort by station then date
        const sortedData = [...validRecords].sort((a, b) => {
          const stationA = String(a?.station ?? '');
          const stationB = String(b?.station ?? '');
          const isANumeric = /^\d+$/.test(stationA);
          const isBNumeric = /^\d+$/.test(stationB);

          if (isANumeric !== isBNumeric) {
            return isANumeric ? 1 : -1;
          }
          if (stationA !== stationB) {
            return isANumeric ? Number(stationA) - Number(stationB) : stationA.localeCompare(stationB);
          }
          return new Date(a?.timeDate || 0) - new Date(b?.timeDate || 0);
        });

        setYokotaData(sortedData);
      } catch (err) {
        console.error('Error fetching Yokota nutrunner data:', err);
        setError('Failed to fetch Yokota nutrunner data');
        setYokotaData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchYokotaData();
  }, [engineNo, triggerSearch]);

  if (loading) {
    return <SkeletonLoader height={32} count={4} />;
  }

  if (error) {
    return (
      <div style={{ color: 'var(--status-ng-solid)', padding: '12px', fontSize: '13px' }}>
        {error}
      </div>
    );
  }

  if (yokotaData.length === 0) {
    return (
      <div style={{ color: 'var(--slate-500)', padding: '16px', fontSize: '13px', textAlign: 'center' }}>
        No Yokota nutrunner records found for engine {engineNo}
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
          {yokotaData.map((record, index) => (
            <tr key={index}>
              <td style={{ fontWeight: '600' }}>{record.station || '-'}</td>
              <td>{record.folder || '-'}</td>
              <td style={{ fontWeight: '500', color: 'var(--slate-800)' }}>{record.tool_name || '-'}</td>
              <td style={{ fontWeight: '600', color: 'var(--primary-700)' }}>
                {record.torque !== null ? Number(record.torque).toFixed(2) : '-'}
              </td>
              <td>{record.angle !== null ? record.angle : '-'}</td>
              <td>{record.batch_count ?? '-'}</td>
              <td>{formatStandardDateTime(record.timeDate)}</td>
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

export default YokotaToolTable;
