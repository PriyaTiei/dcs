import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { navBarSlice } from '../../redux/slices/navbarSlice';
import {
  TbHome,
  TbPackages,
  TbClipboardCheck,
  TbArrowsExchange,
  TbFileDescription,
  TbPhoto,
  TbTool,
  TbChevronRight,
} from 'react-icons/tb';

export const Sidebar = () => {
  const { visible, activeItem } = useSelector((state) => state.navBar);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
        return;
      }
      if (event.target.closest && event.target.closest('.navbar-toggle-btn')) {
        return;
      }
      dispatch(navBarSlice.actions.setVisible(false));
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [visible, dispatch]);

  const handleItemClick = (value) => {
    dispatch(navBarSlice.actions.setActiveItem(value));
  };

  const navItems = [
    {
      title: 'Engine Traceability',
      value: 'traceability',
      Icon: TbHome,
      to: '/',
    },
    {
      title: 'Supplier Part Details',
      value: 'supplierPartDetails',
      Icon: TbPackages,
      to: '/supplierPartDeatils',
    },
    {
      title: 'Add Assy Checksheet',
      value: 'add_assy_checksheet',
      Icon: TbClipboardCheck,
      to: '/add-form',
    },
    {
      title: 'Change Point Monitoring',
      value: 'Change_Point_Management',
      Icon: TbArrowsExchange,
      to: '/changePoints',
    },
    {
      title: 'Defect Reports',
      value: 'traceabilityForm',
      Icon: TbFileDescription,
      to: '/traceability',
    },
    {
      title: 'Rework Images',
      value: 'rework_images',
      Icon: TbPhoto,
      to: '/searchReworkImages',
    },
    {
      title: 'Station Tool Config',
      value: 'edit_tool_details',
      Icon: TbTool,
      to: '/edit-tool-details',
    },
  ];

  return (
    <aside
      ref={sidebarRef}
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        bottom: 0,
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-xs)',
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map(({ title, value, Icon, to }) => (
          <NavLink
            key={value}
            to={to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            onClick={() => handleItemClick(value)}
          >
            <div className="sidebar-item-left">
              <Icon className="sidebar-icon" size={19} strokeWidth={1.75} />
              <span className="sidebar-title">{title}</span>
            </div>
            <TbChevronRight className="sidebar-arrow" size={16} strokeWidth={2} />
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto', padding: '16px 12px 0 12px', borderTop: '1px solid var(--slate-100)' }}>
        <div style={{ fontSize: '11px', color: 'var(--slate-400)', fontWeight: '500' }}>
          Toyota Engine MES v2.0
        </div>
        <div style={{ fontSize: '11px', color: 'var(--slate-400)' }}>
          Plant Floor System
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
