import React, { useState, useEffect } from "react";

// import Select from "react-select"
import Select from "react-select";
import MachiningHeadLeakHeading from "./processDetails/MachiningHeadLeakHeading";
import AssemblyLeakHeading from "./processDetails/AssemblyLeakHeading";
import DetailsTableValue1 from "./processDetails/ReuasbleMachiningHeadLeakValues";
import DetailsTableValue2 from "./processDetails/ReusabeAssemblyLeakValues";
import { a } from "./dummyHeadLeak";
import { b } from "./dummyAssemblyLeak.js";
import ProcessNumbers from "./ProcessNumbers";
import ResultProcess from "./ResultProcess";
import SubOptions from "./SubOptions";
import { processNoData } from "./processNoData";
import { useSelector, useDispatch } from "react-redux";
import {
  setSectionRedux,
  setSubSectionRedux,
} from "../../redux/slices/egNo/egNoActions";
import ReusablePartNo from "./ReusablePartNo";
import Heading_B_OP05 from "./processDetails/Heading_B_OP05";
import Reusable_B_OP05 from "./processDetails/Reusable_B_OP05";
import {
  getProcessRangeDetails,
  getProcessRangeDetailsAssy,
  newFromDate,
  newToDate,
} from "../../redux/slices/processData/processActions";
import CastingInformation from "./casting/CastingInformation";
import { Search } from "bootstrap-icons-react";
import Heading_B_OP190 from "./processDetails/Heading_B_OP190";
import Heading_B_OP195 from "./processDetails/Heading_B_OP195";
import B_OP_190 from "./processDetails/B_OP_190";
import B_OP_195 from "./processDetails/B_OP_195";
import Heading_B_FG from "./processDetails/Heading_B_FG";
import B_OP_FG from "./processDetails/B_OP_FG";
import Heading_H_OP05 from "./processDetails/Heading_H_OP05";
import H_OP_05 from "./processDetails/H_OP_05";
import Heading_H_FG from "./processDetails/Heading_H_FG";
import H_OP_FG from "./processDetails/H_OP_FG";
import Heading_C_FG from "./processDetails/Heading_C_FG";
import C_OP_FG from "./processDetails/C_OP_FG";
import Heading_C_OP220 from "./processDetails/Heading_C_OP220";
import C_OP_220 from "./processDetails/C_OP_220";
import Heading_C_OP02 from "./processDetails/Heading_C_OP02";
import C_OP_02 from "./processDetails/C_OP_02";
import Heading_C_OP140 from "./processDetails/Heading_C_OP140";
import C_OP_140 from "./processDetails/C_OP_140";
import Heading_Timing from "./processDetails/Heading_Timing";
import Timing from "./processDetails/Timing";
import Heading_H_OP310 from "./processDetails/Heading_H_OP310";
import H_OP_310 from "./processDetails/H_OP_310";
import Heading_A_LeakTest from "./processDetails/Heading_A_LeakTest";
import A_OP_LeakTest from "./processDetails/A_OP_LeakTest";
import Heading_A_Information from "./processDetails/Heading_A_Information";
import A_OP_Information from "./processDetails/A_OP_Information";
import Heading_A_ONTime from "./processDetails/Heading_A_ONTime";
import A_OP_ONTime from "./processDetails/A_OP_ONTime";
import Heading_A_INTime from "./processDetails/Heading_A_INTime";
import A_OP_INTime from "./processDetails/A_OP_INTime";
import B_OP_05 from "./processDetails/B_OP_05";
import Heading_B_OP235 from "./processDetails/Heading_B_OP235";
import B_OP_235 from "./processDetails/B_OP_235";
import Loading from "./Loading";
import Heading_H_OP50 from "./processDetails/Heading_H_OP50";
import H_OP_50 from "./processDetails/H_OP_50";
import Heading_A_HeadNR from "./processDetails/Heading_A_HeadNR";
import A_OP_HeadNR from "./processDetails/A_OP_HeadNR";
import Heading_C_OP150_170 from "./processDetails/Heading_C_OP150_170";
import C_OP_150_170 from "./processDetails/C_OP_150_170";
import { CSVLink } from "react-csv";

function DeatialTraceability() {
  // formating date
  function getCurrentDateInYYYYMMDD(a) {
    const today = new Date(a);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const formattedDate = getCurrentDateInYYYYMMDD();

  const dispatch = useDispatch();

  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const processNo = useSelector((state) => state.process.processNo);
  const processName = useSelector((state) => state.process.processName);
  const dataOneDay = useSelector((state) => state.process.dataOneDay);
  const processEngine = useSelector((state) => state.process.processEngine);
  const processEngineDate = useSelector(
    (state) => state.process.processEngineDate
  );
  const fromDateState = useSelector((state) => state.process.fromDate);
  const toDateState = useSelector((state) => state.process.toDate);
  const loading = useSelector((state) => state.process.loading);
  const dataRange = useSelector((state) => state.process.dataRange);

  // console.log(fromDateState.slice(0, 10));

  const [engineNo, setEngineNo] = useState("");
  const [part, setPart] = useState("");
  const [sectionIni, setSection] = useState("Assembly");
  // const [subSection, setSubSection] = useState("Shipment");

  const [subSectionOptions2, setSubSectionOptions2] = useState([
    { value: "Shipment", label: "Shipment" },
  ]);
  const [supplierPart, setSupplierPart] = useState("");
  const [range, setRange] = useState("oneDay");

  // const [fromDate, setFromDate] = useState(formattedDate);
  // const [toDate, setToDate] = useState(formattedDate);
  const [fromDateValue, setFromDateValue] = useState();
  const [toDateValue, setToDateValue] = useState();
  const [combineTable, setCombineTable] = useState([]);

  const hDate = new Date(Date.now()).toUTCString();

  const detail1 = "details";
  var fromDate = new Date(fromDateState);
  fromDate.setDate(fromDate.getDate() + 1);
  var fromDateString = fromDate.toISOString();

  const assemblyProcess = [
    "Shipment",
    "FTB",
    "MTB",
    "Oil/water leak",
    "Fuel Leak",
    "CHS",
    "BS",
    "PS",
    "SPS",
    "MK line",
  ];

  const sectionData = processNoData;

  const sectionOptions = sectionData.map((item) => {
    return { value: item.section, label: item.section };
  });

  var itemSelected;
  var subSectionOptions1;

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

  const initialSubSection = {};

  useEffect(() => {
    itemSelected = sectionData?.filter((item) => item.section == sectionIni);

    subSectionOptions1 = itemSelected[0]?.subSection?.map((item) => {
      return { value: item.name, label: item.name };
    });
    setSubSectionOptions2(subSectionOptions1);
  }, [sectionIni]);

  // useEffect(() => {

  // }, [subSectionOptions2]);

  // Generate details for table1
  const values1 = a;

  const valuesTable = values1.map((item) => (
    <DetailsTableValue1
      key={item.headNo}
      headNo={item.headNo}
      oilLeak={item.oilLeak}
      wj={item.wj}
      camCase={item.camCase}
      egr={item.egr}
      engineNo={item.engineNo}
      engineStatus={item.engineStatus}
      customer={item.customer}
    />
  ));

  // Generate details for table2
  const values2 = b;

  const valuesTable2 = values2.map((item) => (
    <DetailsTableValue2
      key={item.serialNo}
      serialNo={item.serialNo}
      dateTime={item.dateTime}
      wj={item.wj}
      wjLeak={item.wjLeak}
      oh={item.oh}
      ohLeak={item.ohLeak}
      camCase={item.camCase}
      camCaseLeak={item.camCaseLeak}
      egr={item.egr}
      egrLeak={item.egrLeak}
      engineNo={item.engineNo}
      engineStatus={item.engineStatus}
      customer={item.customer}
    />
  ));

  // handle radio button
  const radioHandler = (e) => {
    setRange(e.target.value);
  };

  const oneDayDateHandler = (e) => {
    let tempFromDate = new Date(e.target.value);

    tempFromDate.setDate(tempFromDate.getDate() - 1);
    tempFromDate.setHours(23);
    tempFromDate.setMinutes(60);
    tempFromDate.setSeconds(1);
    dispatch(newFromDate(tempFromDate.toISOString()));

    let tempToDate = new Date(e.target.value);
    tempToDate.setHours(23);
    tempToDate.setMinutes(59);
    tempToDate.setSeconds(59);
    dispatch(newToDate(tempToDate.toISOString()));
  };

  const fromDateHandler = (e) => {
    var tempFromDate = new Date(e.target.value);

    tempFromDate.setDate(tempFromDate.getDate() - 1);
    tempFromDate.setHours(23);
    tempFromDate.setMinutes(60);
    tempFromDate.setSeconds(1);
    dispatch(newFromDate(tempFromDate.toISOString()));
    // setFromDate(e.target.value);
    // console.log(e.target.value);
  };

  const toDateHandler = (e) => {
    var tempToDate = new Date(e.target.value);
    tempToDate.setHours(23);
    tempToDate.setMinutes(59);
    tempToDate.setSeconds(59);

    dispatch(newToDate(tempToDate.toISOString()));
    // setToDate(e.target.value);
    // console.log(e.target.value);
  };

  // *************
  // form -C

  const defaultSection = sectionData[0].section;
  const defaultSubSection = sectionData[0].subSection[0].name;

  const [selectedSection, setSelectedSection] = useState(defaultSection);
  const [selectedSubSection, setSelectedSubSection] =
    useState(defaultSubSection);

  const [indexI, setIndexI] = useState(0); // Initialize with 0
  const [indexJ, setIndexJ] = useState(0); // Initialize with 0

  const handleSectionChange = (selected, index) => {
    setSelectedSection(selected);
    dispatch(setSectionRedux(selected));
    dispatch(setSubSectionRedux(processNoData[index].subSection[0].name));
    setIndexI(index);
    const sectionNew = sectionData.find((item) => item.section === selected);
    if (sectionNew) {
      setSelectedSubSection(sectionNew.subSection[0].name);
      setIndexJ(0);
    }
  };

  const handleSubSectionChange = (selected, index) => {
    setSelectedSubSection(selected);
    dispatch(setSubSectionRedux(selected));

    setIndexJ(index);
  };

  const getSubSections = () => {
    const section = sectionData.find(
      (item) => item.section === selectedSection
    );
    return section
      ? section.subSection.map((sub, index) => ({
          value: sub.name,
          label: sub.name,
          index,
        }))
      : [];
  };

  /// Combine 2 tables
  var bigList = null;
  const [excelData, setExcelData] = useState([[]]);

  // useEffect(()=>{
  //   setExcelData([[]])
  // },[processName])

  // {dataOneDay?.data?.map(element=><Reusable_B_OP05 key={element[1]} serialNo={element[1]} date={element[8]}/>)}

  // ****************Range button handler
  // B1_ENGRAVED
  // processNoFiltered[0][5]
  const rangeButtonHandler = () => {
    if(section==="Machining"){
      dispatch(getProcessRangeDetails(processName, fromDateState, toDateState));
    }else if(section==="Assembly"){
      dispatch(getProcessRangeDetailsAssy(processName, fromDateState, toDateState));
    }
  };

  const oneDayButtonHandler = () => {
    // dispatch(getProcessRangeDetails(processName, fromDateState, toDateState));
    if(section==="Machining"){
      dispatch(getProcessRangeDetails(processName, fromDateState, toDateState));
    }else if(section==="Assembly"){
      dispatch(getProcessRangeDetailsAssy(processName, fromDateState, toDateState));
    }
  };
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: state.isFocused ? '#2563eb' : '#cbd5e1',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)',
      fontSize: '13px',
      fontWeight: 500,
      minHeight: '38px',
      minWidth: '170px',
      '&:hover': {
        borderColor: '#93c5fd',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      fontSize: '13px',
      fontWeight: state.isSelected ? 600 : 400,
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : '#fff',
      color: state.isSelected ? '#fff' : '#1e293b',
      cursor: 'pointer',
    }),
  };

  return (
    <div>
      {/* Modern Detail Traceability Container */}
      <div className="trace-card">
        <div className="trace-header">
          <h3 className="trace-title">
            <span>Detail & Sub-Assembly Process Traceability</span>
          </h3>
          <span className="trace-badge">
            <span style={{ fontSize: "9px" }}>●</span> Deep Telemetry
          </span>
        </div>

        {/* Compact Controls Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "flex-end", marginBottom: "10px" }}>
          {/* Section selects */}
          <div>
            <div className="trace-section-label" style={{ marginBottom: "4px" }}>Part / Section</div>
            <div className="d-flex gap-2">
              <Select
                styles={customSelectStyles}
                options={sectionData.map((item, index) => ({
                  value: item.section,
                  label: item.section,
                  index,
                }))}
                value={{ value: selectedSection, label: selectedSection }}
                onChange={(option) =>
                  handleSectionChange(option.value, option.index)
                }
                placeholder="Section"
              />

              <Select
                styles={customSelectStyles}
                options={getSubSections()}
                value={{ value: selectedSubSection, label: selectedSubSection }}
                onChange={(option) =>
                  handleSubSectionChange(option.value, option.index)
                }
                placeholder="Sub-Section"
                isDisabled={!selectedSection}
              />
            </div>
          </div>

          {/* Process chips inline */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="trace-section-label" style={{ marginBottom: "4px" }}>Processes ({sectionData[indexI]["subSection"][indexJ]["processNo"]?.length || 0})</div>
            <ProcessNumbers
              processNoListInitial={
                sectionData[indexI]["subSection"][indexJ]["processNo"]
              }
            />
          </div>
        </div>

        {/* Query Controls Bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #f0f7ff 0%, #f8fafc 100%)",
            border: "1px solid #dbeafe",
            borderRadius: "10px",
            padding: "10px 14px",
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Segmented Mode Pill */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>MODE</span>
            <div style={{
              display: "inline-flex",
              background: "#e0e7ff",
              borderRadius: "8px",
              padding: "2px",
              gap: "2px",
            }}>
              <button
                onClick={() => setRange("oneDay")}
                style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: range === "oneDay" ? "#2563eb" : "transparent",
                  color: range === "oneDay" ? "#ffffff" : "#4f46e5",
                  boxShadow: range === "oneDay" ? "0 1px 4px rgba(37,99,235,0.35)" : "none",
                }}
              >
                Single
              </button>
              <button
                onClick={() => setRange("dateRange")}
                style={{
                  padding: "4px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: range === "dateRange" ? "#2563eb" : "transparent",
                  color: range === "dateRange" ? "#ffffff" : "#4f46e5",
                  boxShadow: range === "dateRange" ? "0 1px 4px rgba(37,99,235,0.35)" : "none",
                }}
              >
                Range
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "32px", background: "#cbd5e1", flexShrink: 0 }} />

          {/* Date + Run Query grouped together */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>

            {/* One day date picker */}
            {range === "oneDay" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>DATE</span>
                <input
                  type="date"
                  value={fromDateString.slice(0, 10)}
                  className="modern-date-input"
                  onChange={oneDayDateHandler}
                />
              </div>
            )}

            {/* Date Range pickers */}
            {range === "dateRange" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>FROM</span>
                  <input
                    type="date"
                    value={fromDateString.slice(0, 10)}
                    className="modern-date-input"
                    onChange={fromDateHandler}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>TO</span>
                  <input
                    type="date"
                    value={toDateState.slice(0, 10)}
                    className="modern-date-input"
                    onChange={toDateHandler}
                  />
                </div>
              </>
            )}

            {/* Run Query Button — right beside the date */}
            <button
              onClick={range === "oneDay" ? oneDayButtonHandler : rangeButtonHandler}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 20px",
                height: "34px",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                borderRadius: "9999px",
                cursor: "pointer",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
                letterSpacing: "0.02em",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.55)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(37, 99, 235, 0.4)"}
            >
              <Search size={13} />
              Run Query
            </button>

          </div>
        </div>

        {/* Results Metadata */}
        <div className="d-flex align-items-start flex-row gap-3 mt-3">
          <ReusablePartNo />
          <ResultProcess />
        </div>

        {/* **************Table data
        {range === "oneDay" && (
          <div>
            <MachiningHeadLeakHeading />
            {valuesTable}
          </div>
        )}
        {range === "dateRange" && (
          <div>
            <AssemblyLeakHeading />
            {valuesTable2}
          </div>
        )} */}

        {loading === true ? (
          <Loading />
        ) : (
          <>
            {/* ************************  Block process */}
            {section === "Machining" &&
              subSection === "Block Cylinder" &&
              processNo == "OP5" && (
                <div>
                  {" "}
                  <div className="d-flex justify-content-end">
                    <CSVLink data={excelData} filename="one_day_data.csv">
                      {" "}
                      <button className="btn btn-primary ">
                        Download to CSV
                      </button>
                    </CSVLink>
                  </div>
                  <Heading_B_OP05
                    setExcelData={setExcelData}
                    excelData={excelData}
                  />
                  <B_OP_05 setExcelData={setExcelData} excelData={excelData} />
                </div>
              )}
            {processName == "B3_OP190" && (
              <div>
                   <div className="d-flex justify-content-end">
                <CSVLink data= {excelData} filename="one_day_data.csv" > <button className="btn btn-primary " >Download to CSV</button></CSVLink>
                </div>
                <Heading_B_OP190
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <B_OP_190 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "B4_Finishing gantry" && (
              <div>
                  <div className="d-flex justify-content-end">
                <CSVLink data= {excelData} filename="one_day_data.csv" > <button className="btn btn-primary " >Download to CSV</button></CSVLink>
                </div>
                <Heading_B_OP195
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <B_OP_195 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "B5_OP235" && (
              <div
                className="mt-3"
                style={{ width: "90vw", overflowX: "auto" }}
              >
                   <div className="d-flex justify-content-end">
                <CSVLink data= {excelData} filename="one_day_data.csv" > <button className="btn btn-primary " >Download to CSV</button></CSVLink>
                </div>
                <Heading_B_OP235
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <B_OP_235 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "B7_OP990" && (
              <div>
                   <div className="d-flex justify-content-end">
                <CSVLink data= {excelData} filename="one_day_data.csv" > <button className="btn btn-primary " >Download to CSV</button></CSVLink>
                </div>
                <Heading_B_FG
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <B_OP_FG setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}

            {/* ****************** Head process */}
            {processName == "H1_Material input/engraving" && (
              <div>
                 <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_H_OP05
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <H_OP_05 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}

            {(processName == "H2_OP050" || processName == "H3_OP055") && (
              <div className="" style={{ width: "90vw", overflowX: "auto" }}>
                <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_H_OP50
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <H_OP_50 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "H5_OP310" && (
              <div className="" style={{ width: "90vw", overflowX: "auto" }}>
               <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_H_OP310
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <H_OP_310 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}

            {processName == "H12_OP990" && (
              <div>
                 <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_H_FG
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <H_OP_FG setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}

            {/* **************Crank process */}

            {processName == "C8_OP990" && (
              <div>
                 <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_C_FG
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <C_OP_FG setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "C3_OP150_170" && (
              <div className="" style={{ width: "90vw", overflowX: "auto" }}>
               <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_C_OP150_170
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <C_OP_150_170
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
              </div>
            )}

            {processName == "C4_OP220" && (
              <div style={{ width: "90vw", overflowX: "auto" }}>
                  <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_C_OP220
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <C_OP_220 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "C1_Comaterial" && (
              <div>
                <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_C_OP02
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <C_OP_02 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "C7_Gantry after OP140" && (
              <div>
                <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_C_OP140
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <C_OP_140 setExcelData={setExcelData} excelData={excelData} />
              </div>
            )}
            {processName == "C6_OP170 front gantry" && (
              <div>
                  <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_Timing
                  line="Crank"
                  op="OP170"
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <Timing
                  selectedProcessName="C6_OP170 front gantry"
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
              </div>
            )}
            {(processName == "FuelLeak" ||
              processName == "WalterLeak" ||
              processName == "OileLeak") && (
              <div>
                <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_A_LeakTest
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <A_OP_LeakTest
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                {/* <Timing selectedProcessName="C6_OP170 front gantry" /> */}
              </div>
            )}

            {processName == "Engine quality information" && (
              <div>
                 <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_A_Information
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <A_OP_Information
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                {/* <Timing selectedProcessName="C6_OP170 front gantry" /> */}
              </div>
            )}
            {(processName == "TEST_ON" ||
              processName == "MAIN_ON" ||
              processName == "CRANK_ON" ||
              processName == "HEADSUB_OFF" ||
              processName == "CAMHOUSINGSIB_OFF" ||
              processName == "BLOCKSUB_ON") && (
              <div>
                  <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">                
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_A_ONTime
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <A_OP_ONTime
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                {/* <Timing selectedProcessName="C6_OP170 front gantry" /> */}
              </div>
            )}
            {/* "Head S / N" */}
            {(processName == "EX cam S / N" ||
              processName == "IN cam S / N" ||
              processName == "CamHousing S/N" ||
              processName == "Head S / N" ||
              processName == "Crank S / N" ||
              processName == "Block S / N") && (
              <div>
                <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">
                    {" "}
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_A_INTime
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <A_OP_INTime
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
              </div>
            )}
            {processName == "HeadboltNR" && (
              <div className="" style={{ width: "90vw", overflowX: "auto" }}>
                <div className="d-flex justify-content-end">
                  <CSVLink data={excelData} filename="one_day_data.csv">
                    {" "}
                    <button className="btn btn-primary ">
                      Download to CSV
                    </button>
                  </CSVLink>
                </div>
                <Heading_A_HeadNR
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
                <A_OP_HeadNR
                  setExcelData={setExcelData}
                  excelData={excelData}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DeatialTraceability;

// http://localhost:5081/oracle/serialNoListString?serialNoListString=3611222303205354,3611132306192321
