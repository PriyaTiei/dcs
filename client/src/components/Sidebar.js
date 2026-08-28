import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { navBarSlice } from "../redux/slices/navbarSlice";
import { getChangePoints } from "../redux/slices/changepoints/changePointActions";
import { 
  TbHome, 
  TbPackages, 
  TbClipboardCheck, 
  TbArrowsExchange, 
  TbFileDescription, 
  TbPhoto, 
  TbChevronRight 
} from "react-icons/tb";

export function AppSidebar({ children }) {
  const { visible, activeItem } = useSelector((state) => state.navBar);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event) => {
      // Don't close if clicking inside the sidebar
      if (sidebarRef.current && sidebarRef.current.contains(event.target)) {
        return;
      }
      // Don't close if clicking the toggle button (it handles its own toggle)
      if (event.target.closest && event.target.closest(".navbar-toggle-btn")) {
        return;
      }
      // Close sidebar on click outside
      dispatch(navBarSlice.actions.setVisible(false));
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [visible, dispatch]);

  const handleItemClick = (value) => {
    dispatch(navBarSlice.actions.setActiveItem(value));
  };
  const handleChagePoints = (value) => {
    dispatch(getChangePoints());
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", position: "relative" }}>
      {/* 1. Modern Fixed Sidebar Drawer (Under Static Navbar) */}
      <aside
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          bottom: 0,
          width: "250px",
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          boxShadow: visible ? "4px 0 16px rgba(0, 0, 0, 0.04)" : "none",
          transform: visible ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease",
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
          padding: "16px 12px",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <SidebarTile
            title="Traceability"
            value="traceability"
            IconComponent={TbHome}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/"
          />
          <SidebarTile
            title="Supplier Part Details"
            value="supplierPartDetails"
            IconComponent={TbPackages}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/supplierPartDeatils"
          />
          <SidebarTile
            title="Add Assy Checksheet"
            value="add_assy_checksheet"
            IconComponent={TbClipboardCheck}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/add-form"
          />
          <SidebarTile
            title="Change Point Management"
            value="Change_Point_Management"
            IconComponent={TbArrowsExchange}
            activeItem={activeItem}
            handleItemClick={handleChagePoints}
            href="/changePoints"
          />
          <SidebarTile
            title="TraceabilityForm"
            value="traceabilityForm"
            IconComponent={TbFileDescription}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/traceability"
          />
          <SidebarTile
            title="Rework Images"
            value="rework_images"
            IconComponent={TbPhoto}
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            href="/searchReworkImages"
          />
        </div>
      </aside>

      {/* 2. Main Page Content (Smooth margin adjustment on toggle) */}
      <main
        style={{
          marginLeft: visible ? "250px" : "0px",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          paddingTop: "70px",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "32px",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        {children}
      </main>
    </div>
  );
}

const SidebarTile = ({ title, value, activeItem, handleItemClick, IconComponent, href }) => {
  const isActive = activeItem === value;

  return (
    <NavLink
      to={href}
      exact="true"
      className={`sidebar-nav-item ${isActive ? "active" : ""}`}
      onClick={() => handleItemClick(value)}
      key={value}
    >
      <div className="sidebar-item-left">
        <IconComponent className="sidebar-icon" size={19} strokeWidth={1.75} />
        <span className="sidebar-title">{title}</span>
      </div>
      <TbChevronRight className="sidebar-arrow" size={16} strokeWidth={2} />
    </NavLink>
  );
};
