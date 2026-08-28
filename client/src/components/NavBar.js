import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TbMenu2, TbArrowLeft, TbLayersLinked } from "react-icons/tb";
import { navBarSlice } from "../redux/slices/navbarSlice";
import './fonts.css';
import logo from "../assets/logo.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const { visible } = useSelector((state) => state.navBar);

  const handleMenuClick = () => {
    dispatch(navBarSlice.actions.toggleVisible());
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "linear-gradient(135deg, rgba(239, 246, 255, 0.94) 0%, rgba(219, 234, 254, 0.88) 100%)",
        backdropFilter: "blur(14px) saturate(180%)",
        WebkitBackdropFilter: "blur(14px) saturate(180%)",
        borderBottom: "1px solid rgba(191, 219, 254, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 1200,
        boxShadow: "0 4px 16px -2px rgba(37, 99, 235, 0.08)",
      }}
    >
      {/* Left side: Back Arrow / Menu Toggle Button */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={handleMenuClick}
          className="navbar-toggle-btn"
          title={visible ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(191, 219, 254, 0.9)",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(37, 99, 235, 0.08)",
          }}
        >
          <span className="toggle-icon-container">
            {visible ? (
              <TbArrowLeft size={20} strokeWidth={2} className="toggle-arrow-icon" />
            ) : (
              <TbMenu2 size={20} strokeWidth={2} className="toggle-menu-icon" />
            )}
          </span>
        </button>
      </div>

      {/* Center: Clean Centered Header Title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 2px 5px rgba(37, 99, 235, 0.28)",
            flexShrink: 0,
          }}
        >
          <TbLayersLinked size={18} strokeWidth={2} />
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            color: "#1e3a8a",
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          Engine Traceability
        </h1>
      </div>

      {/* Right side: Responsive TIEI India Logo */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <img
          src={logo}
          alt="TIEI India"
          style={{
            maxHeight: "32px",
            maxWidth: "140px",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            display: "block"
          }}
        />
      </div>
    </header>
  );
}
