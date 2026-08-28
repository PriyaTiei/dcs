import React, { useState } from 'react';
import ImpactWrenchTable from './ImpactWrenchTable';
import YokotaToolTable from './YokotaToolTable';

export const TighteningSection = ({ engineNo, triggerSearch }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'uryu', 'yokota'

  return (
    <div className="dcs-card">
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">
          <span>Tightening & IoT Nutrunner Telemetry</span>
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`dcs-btn ${activeTab === 'all' ? 'dcs-btn-primary' : 'dcs-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '12px' }}
            onClick={() => setActiveTab('all')}
          >
            All Tools
          </button>
          <button
            className={`dcs-btn ${activeTab === 'uryu' ? 'dcs-btn-primary' : 'dcs-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '12px' }}
            onClick={() => setActiveTab('uryu')}
          >
            URYU UEC-4800
          </button>
          <button
            className={`dcs-btn ${activeTab === 'yokota' ? 'dcs-btn-primary' : 'dcs-btn-secondary'}`}
            style={{ padding: '4px 12px', fontSize: '12px' }}
            onClick={() => setActiveTab('yokota')}
          >
            Yokota Nutrunners
          </button>
        </div>
      </div>

      {(activeTab === 'all' || activeTab === 'uryu') && (
        <div style={{ marginBottom: activeTab === 'all' ? '24px' : '0' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--slate-700)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary-600)' }} />
            URYU Impact Wrench Tightening Records
          </h4>
          <ImpactWrenchTable engineNo={engineNo} triggerSearch={triggerSearch} />
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'yokota') && (
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--slate-700)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-ok-solid)' }} />
            Yokota Nutrunner Tightening Records (Special Stations)
          </h4>
          <YokotaToolTable engineNo={engineNo} triggerSearch={triggerSearch} />
        </div>
      )}
    </div>
  );
};

export default TighteningSection;
