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
  return (
    <div>
      {/* search engine no */}

      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "16px" }}
        >
          Detail Traceability
        </legend>

        <div className="d-flex gap-3 mt-0">
          {/* Part selection */}

          <div>
            <div className="h5">Part Name</div>
            <div className="d-flex gap-3 selection">
              <Select
                options={sectionData.map((item, index) => ({
                  value: item.section,
                  label: item.section,
                  index,
                }))}
                value={{ value: selectedSection, label: selectedSection }}
                onChange={(option) =>
                  handleSectionChange(option.value, option.index)
                }
                placeholder="Select Section"
              />

              <Select
                options={getSubSections()}
                value={{ value: selectedSubSection, label: selectedSubSection }}
                onChange={(option) =>
                  handleSubSectionChange(option.value, option.index)
                }
                placeholder="Select SubSection"
                isDisabled={!selectedSection}
              />
            </div>
          </div>

          {/* Process data [Machining or Maching]  */}

          <ProcessNumbers
            processNoListInitial={
              sectionData[indexI]["subSection"][indexJ]["processNo"]
            }
          />
        </div>
        {/*Results */}
        <div className="d-flex align-items-start flex-row gap-3 mt-4">
          <ReusablePartNo />
          <ResultProcess />
        </div>

        <div className="d-flex justify-content-start  mt-5">
          <form onChange={radioHandler} className="form-group gap-3">
            <div className="d-flex gap-3">
              <label htmlFor="oneDay">One Day </label>
              <input type="radio" name="isRange" id="oneDay" value="oneDay" />
              <label htmlFor="dateRange">Date Range </label>
              <input
                type="radio"
                name="isRange"
                id="dateRange"
                value="dateRange"
              />
            </div>
          </form>
        </div>

        {/* One day is selected*/}
        {range === "oneDay" && (
          <div className="mt-3">
            <div className="h6">Select Date </div>
            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex flex-column align-items-start">
                <input
                  type="date"
                  value={fromDateString.slice(0, 10)}
                  className="bg-warning text-center"
                  onChange={oneDayDateHandler}
                />
              </div>

              <button
                className="btn btn-primary align-self-end "
                onClick={oneDayButtonHandler}
              >
                <div className="d-flex gap-2 align-items-center">
                  <Search />
                  Search
                </div>
              </button>
            </div>
          </div>
        )}

        {/* This is for Date Range */}
        {range === "dateRange" && (
          <div className="mt-3">
            <div className="h5">Select Date Range</div>
            <div className="d-flex flex-wrap gap-3">
              <div className="d-flex flex-column align-items-start">
                <div className="text-center font-weight-bold  ">From Date:</div>
                <input
                  type="date"
                  value={fromDateString.slice(0, 10)}
                  className="bg-warning text-center"
                  onChange={fromDateHandler}
                />
              </div>

              <div className="d-flex flex-column align-items-start">
                <div className="text-center font-weight-bold">To Date</div>

                <input
                  type="date"
                  value={toDateState.slice(0, 10)}
                  className="bg-warning text-center"
                  onChange={toDateHandler}
                />
              </div>
              <button
                className="btn btn-primary align-self-end "
                onClick={rangeButtonHandler}
              >
                <div className="d-flex gap-2 align-items-center">
                  <Search />
                  Search
                </div>
              </button>
            </div>
          </div>
        )}

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
      </fieldset>
    </div>
  );
}

export default DeatialTraceability;

// http://localhost:5081/oracle/serialNoListString?serialNoListString=3611222303205354,3611132306192321
