import React, { useEffect, useState, useMemo } from "react";
import ChangePointValue from "./ReuasableChangePointValues.js";
// import Select from "react-select"
import Select from "react-select";
import axios from "axios";
import DateTable from "./ReusableEngineHistoryValues.js";
import moment from "moment";
import ShippingDetails from "./ShippingDetails.js";
// import CrankDetails from "./testing.js";
import ChangePointAssembly from "./ChangePointAssembly.js";
import DetailTraceability from "./DetailTraceability.js";
import ChangePointMachining from "./ChangePointMachining.js";
import RawMaterialDetails from "./RawMaterialDetails.js";
import PartHistory from "./RMHistory.js";
import { useSelector, useDispatch } from "react-redux";
import { getEngineData } from "../../redux/slices/egNo/egNoActions.js";
import { Search } from "bootstrap-icons-react";
import { processDataClear } from "../../redux/slices/processData/processActions.js";
import Loading from "./Loading.js";
import EntireResultProcess from "./Entire.js";
import { getProcess3Details } from "../../redux/slices/processData/processActions.js";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ReusageImageCards from "../reworkImage/ReusageImageCards.js";
import { TbSearch, TbEngine, TbBarcode, TbX, TbRefresh, TbQrcode } from "react-icons/tb";


function EngNo() {
  const [engineNo, setEngineNo] = useState("");
  const [searchEngineNo, setSearchEngineNo] = useState(""); 

  const [part, setPart] = useState("");
  const [supplierPart, setSupplierPart] = useState("");
  const hDate = new Date(Date.now()).toUTCString();

  const [leakData, setLeakData] = useState();
  const [crankinfo,setCrankInfo] = useState();
  const [error, setError] = useState('');

  const [listOfImages, setListOfImages] = useState([]);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.engine.loading);

  const detail1 = "details";

  const partOptions = [
    { value: "head", label: "Head" },
    { value: "crank", label: "Crank" },
    { value: "block", label: "Block" },
  ];

  const supplierPartOptions = [
    { value: "crankCase", label: "Crank Case" },
    { value: "camShaft", label: "Cam Shaft" },
    { value: "piston", label: "Piston" },
  ];

  const oracleData = useSelector((state) => state.engine.engineData);
  const data3 = useSelector((state) => state.process.data3);

  const shippingRow = useSelector((state) => state.engine.shippingData);

  const getColumn = (arr, a, b, c) => {
    const selectedColumn = arr.map((item) => [item[a], item[b], item[c]]);

    return selectedColumn;
  };

  const setHeadLeakValues = (data) => {
    if (data.length > 0) {
      let leakDataInt = data?.filter((item) => data[5] == "H5_OP310");

      setLeakData(leakDataInt);
    }
  };

  // const machinedParts = ["Head S / N"];
  const machinedParts = ["Block S / N", "Crank S / N", "Head S / N"];

  const [searchTriggered, setSearchTriggered] = useState(false);

  const getOracleData = (customEngineNo) => {
    const targetNo = typeof customEngineNo === "string" ? customEngineNo : engineNo;
    if (!targetNo || !targetNo.trim()) {
      toast.warn("Please enter an Engine Number", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }
    const cleanNo = targetNo.trim();
    setSearchEngineNo(cleanNo); 
    setSearchTriggered(true);
    dispatch(processDataClear());
    dispatch(getEngineData(cleanNo));
    fetchCrankData(cleanNo);
    getImages(cleanNo);
  };

  const handleClearInput = () => {
    setEngineNo("");
  };

  const handleResetSearch = () => {
    setEngineNo("");
    setSearchEngineNo("");
    setSearchTriggered(false);
    dispatch(processDataClear());
  };

  const fetchCrankData = async (targetNo) => {
    const no = targetNo || engineNo;
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/crank/crankinformation/${no}`);
     
      setCrankInfo(response.data);
      setError(''); 
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setCrankInfo(null); 
    }
  };
  const getPartData = async (partNo) => {
    // console.log("part nos are", partNo);
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/partNo/${partNo}`)
      .then((result) => {
        // console.log("data from Oracle server initial");
        // Store leak values
        setHeadLeakValues(result.data);

        // console.log(result.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (oracleData?.data) {
      const selectedColumns = getColumn(oracleData?.data, 17, 1, 21);

      // console.log(selectedColumns);
      // only keeping 3c parts
      const c3 = selectedColumns?.filter((item) => {
        return (
          item[0] === machinedParts[0] ||
          item[0] === machinedParts[1] ||
          item[0] === machinedParts[2]
        );
      });
      // console.log(c3);
      c3.forEach((item) => {
        getPartData(item[1]);
      });
      if (c3.length > 0) {
        dispatch(getProcess3Details(c3[0][1], c3[1][1], c3[2][1]));
      }
    }
  }, [oracleData]);

  const historyItems = useMemo(() => {
    if (!oracleData?.data) return [];
    const items = [];

    if (shippingRow && shippingRow[3]) {
      items.push({
        title: "SHIPMENT",
        date: moment(shippingRow[3]).format("YYYY-MM-DD HH:mm:ss"),
      });
    }

    items.push({
      title: "MTB",
      date: "Under progress",
    });

    oracleData.data.forEach((item) => {
      if (item[17] && item[17] !== "EGNO") {
        let title = item[17].toUpperCase();
        if (title === "FUELLEAK") title = "FUEL LEAK";
        else if (title === "OILELEAK") title = "OIL LEAK";
        else if (title === "WALTERLEAK") title = "WATER LEAK";

        const formattedDate = item[21]
          ? moment(item[21]).format("YYYY-MM-DD HH:mm:ss")
          : "-";

        items.push({
          title,
          date: formattedDate,
        });
      }
    });

    return items;
  }, [oracleData, shippingRow]);

  const hasShippingDetails = Boolean(
    shippingRow &&
      (shippingRow.consignmentNo ||
        shippingRow.truckNo ||
        shippingRow.customerName ||
        shippingRow.moduleNo)
  );

  // list of image _  function
  const getImages = (targetNo) => {
    const no = targetNo || engineNo;
    try {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImagesListQuery?engineNo=${no}`
        )
        .then((result) => {
          setListOfImages(result.data.result);
        })
        .catch((e) => {
          console.log(e);
          setListOfImages([]);
          toast.error(`Images of engine number '${no}' not available`);
        });
    } catch (e) {
      console.log(e);
      toast.error("Please check Network connection");
    }
  };

  // card with all images
  const images = listOfImages?.map((imageData) => (
    <ReusageImageCards key={imageData._id} imageData={imageData} />
  ));

  return (
    <div>
      {/* Page Header Banner */}
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
          <TbEngine size={22} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
            Engine Traceability
          </h2>
          <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "2px" }}>
            Complete engine serial genealogy, assembly telemetry & machining logs
          </div>
        </div>
      </div>

      {/* 1. Enterprise Search Engine Card */}
      <div className="enterprise-search-card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getOracleData();
          }}
          className="split-search-container"
        >
          <div className="search-lead-icon">
            <TbSearch size={19} />
          </div>

          <input
            type="text"
            placeholder="Please enter engine no."
            value={engineNo}
            onChange={(e) => setEngineNo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.keyCode === 13) {
                e.preventDefault();
                getOracleData();
              }
            }}
            className="split-search-input"
          />

          {engineNo && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="clear-search-tooltip">Clear Input</Tooltip>}
            >
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearInput}
                aria-label="Clear input"
              >
                <TbX size={13} />
              </button>
            </OverlayTrigger>
          )}

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="search-btn-tooltip">Search Engine</Tooltip>}
          >
            <button
              type="submit"
              className="split-primary-btn"
              disabled={loading}
              aria-label="Search Engine"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" style={{ width: "15px", height: "15px", borderWidth: "2px" }} />
              ) : (
                <TbSearch size={18} />
              )}
            </button>
          </OverlayTrigger>
        </form>
        {leakData && <div className="mt-2 badge bg-light text-dark border p-2">{leakData}</div>}
      </div>
     
      {/* 2. Assembly Data fieldset (Dynamic Multi-Column Layout) */}
      {(oracleData || loading) && (
        <fieldset className="border p-3 mt-2" style={{ borderRadius: "10px", background: "#ffffff" }}>
          <legend
            className="text-primary"
            style={{ fontSize: "14px", fontWeight: 700, padding: "0 8px" }}
          >
            Assembly Data
          </legend>
          <div className="d-flex gap-3 mt-1 flex-wrap align-items-start">
            {/* Shipping Detail Card (Always rendered) */}
            <div className="data-box-card" style={{ minWidth: "270px", flexShrink: 0 }}>
              <ShippingDetails shippingData={shippingRow} />
            </div>

            {/* Dynamic Multi-Column Engine History */}
            <div className="data-box-card" style={{ flex: 1, minWidth: "320px" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="h5 mb-0" style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", color: "#334155" }}>
                  Engine History
                </div>
                {historyItems.length > 0 && (
                  <span style={{ fontSize: "12px", color: "var(--slate-500)", fontWeight: 600 }}>
                    {historyItems.length} Milestones Recorded
                  </span>
                )}
              </div>

              {loading ? (
                <Loading />
              ) : historyItems.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: "13px", fontStyle: "italic", padding: "8px 0" }}>
                  No engine history milestones found.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                    gap: "6px 12px",
                    width: "100%",
                  }}
                >
                  {historyItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "stretch",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                        background: "#ffffff",
                      }}
                    >
                      <div
                        style={{
                          width: "165px",
                          minWidth: "145px",
                          background: "#f8fafc",
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#475569",
                          borderRight: "1px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: item.date === "Under progress" ? "#2563eb" : "#0f172a",
                          background: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          fontFamily: "monospace, 'Inter', sans-serif",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {/* 3. EntireResultProcess (Machining Data -> Impact Wrench Data -> Part Traceability) */}
      <EntireResultProcess 
        crankinfo={crankinfo} 
        engineNo={searchEngineNo}
        triggerSearch={searchTriggered}
      />
      
      {/* 4. Images display */}
      <div className="d-flex flex-wrap my-2">{images}</div>

      {/* 5. Detail Traceability */}
      <div style={{ width: "100%", marginTop: "12px" }}>
        <DetailTraceability />
      </div>

      {/* 6. Supplier Field set */}
      <fieldset className="border p-3 mt-2">
        <legend
          className="text-success"
        >
          Supplier Part Traceability
        </legend>
        <div className="d-flex gap-3 mt-1 flex-wrap">
          <div className="data-box-card" style={{ maxWidth: "280px" }}>
            <div className="h5">Supplier Part Name</div>
            <Select
              options={supplierPartOptions}
              defaultValue={supplierPartOptions[0]}
              onChange={(e) => setSupplierPart(e.value)}
            />
          </div>
          {/* RM details */}
          <div className="data-box-card">
            <RawMaterialDetails />
          </div>

          {/* Part History */}
          <div className="data-box-card">
            <PartHistory />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default EngNo;
