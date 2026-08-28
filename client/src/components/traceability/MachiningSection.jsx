import React from 'react';
import { formatStandardDateTime } from '../../utils/dateUtils';
import { decodeBlock235 } from '../../utils/decoders/decodeBlock235';
import { decodeHead50 } from '../../utils/decoders/decodeHead50';
import { decodeHead310 } from '../../utils/decoders/decodeHead310';
import { decode_C_150_170 } from '../../utils/decoders/decodeCrank150';
import StatusBadge from '../common/StatusBadge';
import MetricCard from '../common/MetricCard';

export const MachiningSection = ({ processNoALCData }) => {
  if (!processNoALCData || processNoALCData.length === 0) return null;

  // --- 1. Block Cylinder Elements ---
  const b1Item = processNoALCData.find((el) => el[5] === 'B1_ENGRAVED');
  const b3Item = processNoALCData.find((el) => el[5] === 'B3_OP190');
  const b4Item = processNoALCData.find((el) => el[5] === 'B4_Finishing gantry');
  const b5Item = processNoALCData.find((el) => el[5] === 'B5_OP235');
  const b7Item = processNoALCData.find((el) => el[5] === 'B7_OP990');

  // --- 2. Cylinder Head Elements ---
  const h1Item = processNoALCData.find((el) => el[5] === 'H1_Material input/engraving');
  const h2Item = processNoALCData.find((el) => el[5] === 'H2_OP050');
  const h3Item = processNoALCData.find((el) => el[5] === 'H3_OP055');
  const h5Item = processNoALCData.find((el) => el[5] === 'H5_OP310');
  const h12Item = processNoALCData.find((el) => el[5] === 'H12_OP990');

  // --- 3. Crankshaft Elements ---
  const c1Item = processNoALCData.find((el) => el[5] === 'C1_Comaterial');
  const c3Item = processNoALCData.find((el) => el[5] === 'C3_OP150_170');
  const c4Item = processNoALCData.find((el) => el[5] === 'C4_OP220');
  const c7Item = processNoALCData.find((el) => el[5] === 'C7_Gantry after OP140');
  const c8Item = processNoALCData.find((el) => el[5] === 'C8_OP990');

  // --- Block Data Parsers ---
  const op190Parsed = b3Item ? b3Item[1]?.split(',') : null;
  const block235Decoded = b5Item ? decodeBlock235(b5Item[1]) : null;

  // --- Head Data Parsers ---
  const head50Decoded = h2Item ? decodeHead50(h2Item[1]) : null;
  const head310Decoded = h5Item ? decodeHead310(h5Item[1]) : null;

  // --- Crank Data Parsers ---
  const crank150Decoded = c3Item ? decode_C_150_170(c3Item[1]) : null;

  return (
    <div className="dcs-card">
      <div className="dcs-card-header">
        <h3 className="dcs-card-title">
          <span>3C Machining Data & Process Verification</span>
        </h3>
        <span className="status-pill ok">Telemetry Decoded</span>
      </div>

      {/* =========================================================================
          SECTION 1: CYLINDER BLOCK
          ========================================================================= */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '15px', color: 'var(--primary-800)', borderBottom: '2px solid var(--primary-100)', paddingBottom: '6px', marginBottom: '12px' }}>
          1. Cylinder Block Machining
        </h4>

        <div className="dcs-kv-grid" style={{ marginBottom: '16px' }}>
          {b1Item && (
            <MetricCard
              title="Ahresty Casting No."
              value={b1Item[1]?.slice(16)}
              subtext={`Engraved: ${formatStandardDateTime(b1Item[8])}`}
            />
          )}
          {b4Item && (
            <MetricCard
              title="OP-195A/B Machine"
              value={b4Item[1]?.slice(16, 20) === '0011' ? 'OP195A' : 'OP195B'}
              subtext={`Finish Gantry: ${formatStandardDateTime(b4Item[8])}`}
            />
          )}
          {b7Item && (
            <MetricCard
              title="Block FG Scan"
              value="Completed"
              subtext={formatStandardDateTime(b7Item[8])}
              status="OK"
            />
          )}
        </div>

        {/* OP190 Journal Diameters */}
        {op190Parsed && op190Parsed.length >= 12 && (
          <div style={{ marginBottom: '16px' }}>
            <h5 style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '8px' }}>
              Block OP190 — Journal Diameters (Microns)
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {['J1', 'J2', 'J3', 'J4', 'J5'].map((journal, idx) => (
                <div key={journal} className="dcs-kv-item" style={{ textAlign: 'center' }}>
                  <span className="dcs-kv-label">{journal}</span>
                  <span className="dcs-kv-value" style={{ color: 'var(--primary-700)' }}>
                    {idx === 0
                      ? (parseInt(op190Parsed[7]?.slice(0, 6), 10) * 0.0001).toFixed(4)
                      : parseInt(op190Parsed[7 + idx]?.slice(0, 6), 10) || '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OP235 Multi-Plug Leak Test */}
        {block235Decoded && block235Decoded.length > 3 && (
          <div>
            <h5 style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '8px' }}>
              Block OP235 — Multi-Plug Leak Testing
            </h5>
            <div className="dcs-kv-grid" style={{ marginBottom: '12px' }}>
              <MetricCard title="Engine Model" value={block235Decoded[1]?.model} />
              <MetricCard title="Displacement" value={block235Decoded[1]?.lts} />
              <MetricCard title="Overall Judgment" value={block235Decoded[2]} status={block235Decoded[2]} />
              <MetricCard title="Test Date & Time" value={formatStandardDateTime(b5Item[8])} />
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 2: CYLINDER HEAD
          ========================================================================= */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '15px', color: 'var(--primary-800)', borderBottom: '2px solid var(--primary-100)', paddingBottom: '6px', marginBottom: '12px' }}>
          2. Cylinder Head Machining & Laser Cladding
        </h4>

        <div className="dcs-kv-grid" style={{ marginBottom: '16px' }}>
          {h1Item && (
            <MetricCard
              title="Head Part & Casting No."
              value={`${h1Item[1]?.slice(0, 16)}`}
              subtext={`Casting: ${h1Item[1]?.slice(16)} | ${formatStandardDateTime(h1Item[8])}`}
            />
          )}
          {h12Item && (
            <MetricCard
              title="Head FG Scan"
              value="Completed"
              subtext={formatStandardDateTime(h12Item[8])}
              status="OK"
            />
          )}
        </div>

        {/* Laser Cladding Powder Flow Rates */}
        {head50Decoded && head50Decoded.length > 22 && (
          <div style={{ marginBottom: '16px' }}>
            <h5 style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '8px' }}>
              OP050/OP055 — Laser Clad Powder Flow Rates (0.001 g/sec)
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="dcs-kv-item" style={{ textAlign: 'center' }}>
                  <span className="dcs-kv-label">{`T${i + 1}`}</span>
                  <span className="dcs-kv-value">{head50Decoded[22 + i] ?? '-'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OP310 4-Chamber Leak Testing */}
        {head310Decoded && (
          <div style={{ marginBottom: '16px' }}>
            <h5 style={{ fontSize: '13px', color: 'var(--slate-600)', marginBottom: '8px' }}>
              Head OP310 — 4-Chamber Pressure Leak Testing
            </h5>
            <div className="dcs-table-container">
              <table className="dcs-table">
                <thead>
                  <tr>
                    <th>Chamber</th>
                    <th>Judgement</th>
                    <th>Leak Value (mL/min)</th>
                    <th>Upper Limit (STD)</th>
                    <th>Lower Limit (STD)</th>
                    <th>Test Pressure (kPa)</th>
                    <th>K (Ve) Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Water Jacket', data: head310Decoded.waterJacket },
                    { name: 'Oil Hole', data: head310Decoded.oilHole },
                    { name: 'Cam Case', data: head310Decoded.camCase },
                    { name: 'EGR Chamber', data: head310Decoded.egr },
                  ].map(({ name, data }) => (
                    <tr key={name}>
                      <td style={{ fontWeight: '600' }}>{name}</td>
                      <td><StatusBadge status={data.judgement} /></td>
                      <td style={{ fontWeight: '600' }}>{data.leakValue}</td>
                      <td>{data.stdUpper}</td>
                      <td>{data.stdLower}</td>
                      <td>{data.testPressure}</td>
                      <td>{data.kVeValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 3: CRANKSHAFT
          ========================================================================= */}
      <div>
        <h4 style={{ fontSize: '15px', color: 'var(--primary-800)', borderBottom: '2px solid var(--primary-100)', paddingBottom: '6px', marginBottom: '12px' }}>
          3. Crankshaft Machining
        </h4>

        <div className="dcs-kv-grid">
          {c1Item && (
            <MetricCard
              title="Comaterial Part No."
              value={c1Item[1]?.slice(0, 16)}
              subtext={`Engraved: ${formatStandardDateTime(c1Item[8])}`}
            />
          )}
          {c7Item && (
            <MetricCard
              title="Gantry After OP140"
              value="Cycle Complete"
              subtext={formatStandardDateTime(c7Item[8])}
            />
          )}
          {c8Item && (
            <MetricCard
              title="Crank FG Scan"
              value="Completed"
              subtext={formatStandardDateTime(c8Item[8])}
              status="OK"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MachiningSection;
