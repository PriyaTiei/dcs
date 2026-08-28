import React, { useState } from "react";
import axios from "axios";
import ReusageImageCards from "./ReusageImageCards";
import { toast } from "react-toastify";
import { TbSearch, TbRotateClockwise, TbPhoto, TbFilter, TbX } from "react-icons/tb";

const plantOptions = [
  { value: "TNGA_Assembly", label: "TNGA Assembly" },
  { value: "TNGA_Machining", label: "TNGA Machining" },
  { value: "GD_Assembly", label: "GD Assembly" },
  { value: "GD_Machining", label: "GD Machining" },
  { value: "Others", label: "Others" },
];

const shiftOptions = [
  { value: "White", label: "White (Morning)" },
  { value: "Yellow", label: "Yellow (Evening)" },
  { value: "Blue", label: "Blue (Night)" },
];

function SearchReworkImages() {
  const [engineNo, setEngineNo] = useState("");
  const [shift, setShift] = useState("");
  const [plant, setPlant] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [listOfImages, setListOfImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const getImages = async () => {
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImagesListQuery?engineNo=${engineNo}&shift=${shift}&plant=${plant}&fromDate=${fromDate}&toDate=${toDate}`
      );
      const results = res.data?.result || [];
      setListOfImages(results);
      if (results.length === 0) {
        toast.info("No rework images found matching your criteria.");
      }
    } catch (e) {
      console.error(e);
      setListOfImages([]);
      toast.error(`Images not available or network error.`);
    } finally {
      setLoading(false);
    }
  };

  const fromDateHandler = (e) => {
    if (!e.target.value) {
      setFromDate("");
      return;
    }
    const tempFromDate = new Date(e.target.value);
    tempFromDate.setHours(0, 0, 1);
    setFromDate(tempFromDate.toISOString());
  };

  const toDateHandler = (e) => {
    if (!e.target.value) {
      setToDate("");
      return;
    }
    const tempToDate = new Date(e.target.value);
    tempToDate.setHours(23, 59, 59);
    setToDate(tempToDate.toISOString());
  };

  const clearFilter = () => {
    setEngineNo("");
    setPlant("");
    setShift("");
    setFromDate("");
    setToDate("");
    setListOfImages([]);
    setHasSearched(false);
  };

  const hasActiveFilters = Boolean(engineNo || plant || shift || fromDate || toDate);

  return (
    <div style={{ paddingBottom: "30px" }}>
      {/* Header Banner */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
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
          <TbPhoto size={22} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
            Visual Rework & Inspection Gallery
          </h2>
          <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
            Search and review engine rework photographs, shift observations & quality logs
          </div>
        </div>
      </div>

      {/* Modern Filter Controls Bar */}
      <div className="dcs-search-bar" style={{ gap: "12px", alignItems: "flex-end" }}>
        {/* Engine Number Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px", flex: 1 }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-700)" }}>Engine No.</label>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <TbSearch
              size={16}
              style={{ position: "absolute", left: "10px", color: "var(--slate-400)" }}
            />
            <input
              placeholder="Enter engine no..."
              value={engineNo}
              onChange={(e) => setEngineNo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") getImages();
              }}
              className="dcs-input"
              style={{ paddingLeft: "32px", width: "100%" }}
            />
            {engineNo && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setEngineNo("")}
                style={{ position: "absolute", right: "6px" }}
              >
                <TbX size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Plant Select */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-700)" }}>Plant / Division</label>
          <select
            value={plant}
            onChange={(e) => setPlant(e.target.value)}
            className="dcs-input"
            style={{ width: "100%" }}
          >
            <option value="">All Plants</option>
            {plantOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Select */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "140px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-700)" }}>Shift</label>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="dcs-input"
            style={{ width: "100%" }}
          >
            <option value="">All Shifts</option>
            {shiftOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-700)" }}>From Date</label>
          <input
            type="date"
            value={fromDate ? fromDate.slice(0, 10) : ""}
            className="dcs-input"
            onChange={fromDateHandler}
          />
        </div>

        {/* To Date */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--slate-700)" }}>To Date</label>
          <input
            type="date"
            value={toDate ? toDate.slice(0, 10) : ""}
            className="dcs-input"
            onChange={toDateHandler}
          />
        </div>

        {/* Search Action Button */}
        <button
          type="button"
          onClick={getImages}
          className="dcs-btn dcs-btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" style={{ width: "14px", height: "14px", borderWidth: "2px" }} />
          ) : (
            <TbSearch size={16} />
          )}
          {loading ? "Searching..." : "Search"}
        </button>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="dcs-btn dcs-btn-secondary"
            onClick={clearFilter}
          >
            <TbRotateClockwise size={15} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Gallery Content Card */}
      <div className="dcs-card" style={{ minHeight: "280px" }}>
        <div className="dcs-card-header">
          <h3 className="dcs-card-title">
            <TbPhoto size={18} color="var(--primary-600)" />
            <span>Rework Photo Evidence</span>
          </h3>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--slate-600)" }}>
            {listOfImages.length} {listOfImages.length === 1 ? "Image" : "Images"} Loaded
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 16px" }}>
            <span className="spinner-border text-primary" role="status" style={{ width: "32px", height: "32px" }} />
            <div style={{ marginTop: "12px", color: "var(--slate-500)", fontSize: "13.5px" }}>
              Loading rework inspection images...
            </div>
          </div>
        ) : listOfImages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 16px", color: "var(--slate-500)" }}>
            <TbPhoto size={44} color="var(--slate-300)" style={{ marginBottom: "10px" }} />
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--slate-700)" }}>
              No rework images found
            </div>
            <div style={{ fontSize: "13px", marginTop: "4px", color: "var(--slate-500)" }}>
              {hasSearched
                ? "No photos match your filter parameters. Try adjusting your search."
                : "Enter an engine number or select plant/date filters and click Search."}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            {listOfImages.map((imageData) => (
              <ReusageImageCards key={imageData._id} imageData={imageData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchReworkImages;
