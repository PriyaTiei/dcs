import React from 'react';
import SkeletonLoader from './SkeletonLoader';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found for this query',
  rowKey = (row, index) => row._id || row.id || index,
}) => {
  if (loading) {
    return (
      <div className="dcs-table-container" style={{ padding: '16px' }}>
        <SkeletonLoader height={36} count={5} />
      </div>
    );
  }

  return (
    <div className="dcs-table-container">
      <table className="dcs-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={col.key || index}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width || 'auto',
                  ...col.headerStyle,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  color: 'var(--slate-500)',
                  fontSize: '14px',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowKey(row, rowIndex)}>
                {columns.map((col, colIndex) => {
                  const cellValue = col.accessor
                    ? typeof col.accessor === 'function'
                      ? col.accessor(row, rowIndex)
                      : row[col.accessor]
                    : null;

                  return (
                    <td
                      key={col.key || colIndex}
                      style={{
                        textAlign: col.align || 'left',
                        ...col.cellStyle,
                      }}
                    >
                      {col.render ? col.render(cellValue, row, rowIndex) : cellValue ?? '-'}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
