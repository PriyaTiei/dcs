import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TbMenu2, TbArrowLeft } from 'react-icons/tb';
import { navBarSlice } from '../../redux/slices/navbarSlice';
import engine from '../../assets/engine.png';
import logo from '../../assets/logo.png';

export const Topbar = () => {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.navBar);

  const handleMenuClick = () => {
    dispatch(navBarSlice.actions.toggleVisible());
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: '#ffffff',
        borderBottom: '1px solid var(--slate-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left section: Drawer Toggle & System Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={handleMenuClick}
          className="navbar-toggle-btn"
          title={visible ? 'Collapse navigation' : 'Expand navigation'}
          style={{
            background: '#ffffff',
            border: '1px solid var(--slate-200)',
            borderRadius: '8px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--slate-700)',
            transition: 'all 0.2s ease',
          }}
        >
          {visible ? <TbArrowLeft size={20} /> : <TbMenu2 size={20} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--slate-900)',
              letterSpacing: '-0.02em',
            }}
          >
            Engine Traceability & Data Collection
          </h1>
          <img src={engine} alt="engine icon" style={{ height: '28px', width: 'auto' }} />
        </div>
      </div>

      {/* Right section: Toyota / TIEI India Corporate Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--slate-500)',
            background: 'var(--slate-100)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-ok-solid)',
            }}
          />
          MES Online
        </div>
        <img
          src={logo}
          alt="TIEI India Logo"
          style={{
            maxHeight: '32px',
            maxWidth: '140px',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
    </header>
  );
};

export default Topbar;
