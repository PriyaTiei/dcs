import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { TbSearch, TbFilter, TbX, TbEye, TbFileText, TbRotateClockwise } from "react-icons/tb";
import DataTable from "../components/common/DataTable";
import ReportModal from "../components/DefectForm/ReportModal";

export default function DefectTraceabilityScreen() {
  const [defectForms, setDefectForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const [selectedDefectFormIndex, setSelectedDefectFormIndex] = useState(null);

  const handleModalOpen = (index) => {
    setSelectedDefectFormIndex(index);
    setReportModal(true);
  };

  const handleModalClose = () => {
    setSelectedDefectFormIndex(null);
    setReportModal(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/dcs/dcs-forms`
        );
        setDefectForms(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching defect forms:", err);
        setDefectForms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleResetFilters = () => {
    setSelectedDate("");
    setSearchTerm("");
  };

  const filteredForms = defectForms.filter((defectForm) => {
    if (selectedDate && defectForm.date) {
      const formDateStr = moment(defectForm.date, ["DD/MM/YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]).format("YYYY-MM-DD");
      if (formDateStr !== selectedDate) {
        return false;
      }
    }
    if (searchTerm) {
      const engineNo = (defectForm.engineNo || "").toLowerCase();
      if (!engineNo.includes(searchTerm.toLowerCase().trim())) {
        return false;
      }
    }
    return true;
  });

  const columns = [
    {
      header: "Sl. No",
      align: "center",
      width: "70px",
      render: (_, __, index) => (
        <span style={{ fontWeight: 600, color: "var(--slate-500)" }}>{index + 1}</span>
      ),
    },
    {
      header: "Date & Time",
      accessor: "date",
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, color: "var(--slate-800)" }}>
            {moment(val, ["DD/MM/YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD")}
          </div>
          {row.time && (
            <div style={{ fontSize: "11.5px", color: "var(--slate-500)" }}>{row.time}</div>
          )}
        </div>
      ),
    },
    {
      header: "Engine Number",
      accessor: "engineNo",
      render: (val) => (
        <span
          style={{
            fontWeight: 700,
            color: "var(--primary-700)",
            background: "var(--primary-50)",
            border: "1px solid var(--primary-200)",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "13px",
          }}
        >
          {val || "-"}
        </span>
      ),
    },
    {
      header: "Engine Code",
      accessor: "engineCode",
      render: (val) => (
        <span style={{ fontWeight: 500, color: "var(--slate-700)" }}>{val || "-"}</span>
      ),
    },
    {
      header: "Checker",
      accessor: "checker",
      render: (val) => (
        <span style={{ fontWeight: 500, color: "var(--slate-700)" }}>{val || "-"}</span>
      ),
    },
    {
      header: "Defect Content",
      accessor: "defectContent",
      render: (val) => (
        <span
          style={{
            fontWeight: 600,
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "12.5px",
          }}
        >
          {val || "-"}
        </span>
      ),
    },
    {
      header: "Detailed Report",
      align: "center",
      width: "140px",
      render: (_, __, index) => (
        <button
          className="dcs-btn dcs-btn-secondary"
          style={{ padding: "4px 14px", fontSize: "12px", gap: "4px" }}
          onClick={() => handleModalOpen(index)}
          title="View Detailed Defect Report"
        >
          <TbEye size={14} />
          View Report
        </button>
      ),
    },
  ];

  const hasActiveFilters = Boolean(selectedDate || searchTerm);

  return (
    <div>
      {/* Header Banner with Icon Pill */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
            }}
          >
            <TbFileText size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
              Traceability Forms
            </h2>
            <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
              Assembly defect non-conformance logs and detailed quality inspection reports
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="dcs-search-bar" style={{ gap: "12px" }}>
        {/* Date Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--slate-700)", whiteSpace: "nowrap" }}>
            Filter by Date:
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
              type="date"
              className="dcs-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ paddingRight: selectedDate ? "32px" : "10px" }}
            />
            {selectedDate && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSelectedDate("")}
                style={{ position: "absolute", right: "6px" }}
                title="Clear date filter"
              >
                <TbX size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Engine No Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "240px", maxWidth: "420px" }}>
          <label style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--slate-700)", whiteSpace: "nowrap" }}>
            Search Engine:
          </label>
          <div style={{ position: "relative", display: "flex", alignItems: "center", flex: 1 }}>
            <TbSearch
              size={17}
              style={{ position: "absolute", left: "10px", color: "var(--slate-400)" }}
            />
            <input
              type="text"
              className="dcs-input"
              placeholder="Enter engine number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "34px", paddingRight: searchTerm ? "32px" : "10px", width: "100%" }}
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm("")}
                style={{ position: "absolute", right: "6px" }}
                title="Clear search"
              >
                <TbX size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            className="dcs-btn dcs-btn-secondary"
            onClick={handleResetFilters}
            style={{ padding: "7px 16px", fontSize: "13px" }}
          >
            <TbRotateClockwise size={15} />
            Reset Filters
          </button>
        )}

        {/* Records Count Badge */}
        <div style={{ marginLeft: "auto", fontSize: "13px", color: "var(--slate-500)" }}>
          Showing <strong>{filteredForms.length}</strong> defect {filteredForms.length === 1 ? "record" : "records"}
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="dcs-card" style={{ padding: "0px", overflow: "hidden" }}>
        <DataTable
          columns={columns}
          data={filteredForms}
          loading={loading}
          emptyMessage={
            hasActiveFilters
              ? "No defect records match your search/filter criteria."
              : "No defect records found in the database."
          }
        />
      </div>

      {/* Report Modal */}
      {selectedDefectFormIndex !== null && (
        <ReportModal
          open={reportModal}
          defectForm={filteredForms[selectedDefectFormIndex]}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
