import React from 'react';

export const SkeletonLoader = ({ height = 24, width = '100%', count = 1, style = {} }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="dcs-skeleton"
          style={{
            height: typeof height === 'number' ? `${height}px` : height,
            width: typeof width === 'number' ? `${width}px` : width,
            ...style,
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
