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
  getProcessOneDayDetails,
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

  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedDate);
  const [fromDateValue, setFromDateValue] = useState();
  const [toDateValue, setToDateValue] = useState();
  const [combineTable, setCombineTable] = useState([]);

  const hDate = new Date(Date.now()).toUTCString();

  const detail1 = "details";

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
    let tempToDate = new Date(e.target.value);
    tempFromDate.setHours(5);
    tempFromDate.setMinutes(30);
    tempFromDate.setSeconds(1);
    dispatch(newFromDate(tempFromDate.toISOString()));
    tempToDate.setHours(28);
    tempToDate.setMinutes(89);
    tempToDate.setSeconds(59);

    dispatch(newToDate(tempToDate.toISOString()));
  };

  const fromDateHandler = (e) => {
    var tempFromDate = new Date(e.target.value);
    tempFromDate.setHours(5);
    tempFromDate.setMinutes(30);
    tempFromDate.setSeconds(1);
    dispatch(newFromDate(tempFromDate.toISOString()));
    // setFromDate(e.target.value);
    // console.log(e.target.value);
  };

  const toDateHandler = (e) => {
    var tempToDate = new Date(e.target.value);
    tempToDate.setHours(28);
    tempToDate.setMinutes(89);
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
  useEffect(() => {
    if (
      dataOneDay.hasOwnProperty("data") &&
      dataOneDay.data.length > 0 &&
      processEngine.hasOwnProperty("data") &&
      processEngine.data.length > 0 &&
      processEngine.data[0].length > 0 &&
      processEngineDate.hasOwnProperty("data") &&
      processEngineDate.data.length > 0 &&
      processEngineDate.data[0].length > 0
    ) {
      // map to list serial no.s
      if (
        section == "Machining" &&
        subSection == "Block Cylinder" &&
        processNo == "OP5" &&
        processEngine.data[0].length > 0 &&
        processEngineDate.data[0].length > 0
      ) {
        const list1 = [...dataOneDay.data];
        const list2 = [...processEngine.data];
        const list3 = [...processEngineDate.data];

        // mapping between list2 & list3
        const resultList2 = [];

        list2.forEach((a) => {
          let flag2 = false;
          list3.forEach((b) => {
            if (a[1].trim() === b[0]) {
              // let tempList = [...b.splice(1)];
              // let tempList = ["Number available"];
              resultList2.push([...a, b[1]]);
              flag2 = true;
            } else {
            }
          });

          if (flag2 == false) {
            resultList2.push([...a, "-"]);
          }
        });

        // console.log(resultList2[0])

        const resultList1 = [];

        list1.forEach((a) => {
          let flag1 = false;
          resultList2.forEach((b) => {
            if (a[2].trim() === b[0]) {
              // let tempList = [...b.splice(1)];
              // let tempList = ["Number available"];
              resultList1.push([...a, b[1], b[2]]);
              flag1 = true;
            } else {
            }
          });

          if (flag1 == false) {
            resultList1.push([...a, "-"]);
          }
        });

        // console.log(resultList1[0])
        //// console.log(resultList);

        setCombineTable(resultList1);
      }
    }
  }, [processEngineDate]);

  bigList = combineTable.map((element) => (
    <Reusable_B_OP05
      key={element[1]}
      serialNo={element[1]}
      date={element[8]}
      engineNo={element[10]}
      dispatchedDate={element[11]}
    />
  ));

  // {dataOneDay?.data?.map(element=><Reusable_B_OP05 key={element[1]} serialNo={element[1]} date={element[8]}/>)}

  // ****************Range button handler
  // B1_ENGRAVED
  // processNoFiltered[0][5]
  const rangeButtonHandler = () => {
    dispatch(getProcessOneDayDetails(processName, fromDateState, toDateState));
  };
  const oneDayButtonHandler = () => {
    dispatch(getProcessOneDayDetails(processName, fromDateState, toDateState));
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
          {/* <CastingInformation /> */}
        </div>

        <div className="d-flex justify-content-start  mt-5">
          {/*Radio button  */}

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
                  value={fromDateState.slice(0, 10)}
                  className="bg-warning text-center"
                  onChange={oneDayDateHandler}
                />
              </div>

              <button
                className="btn btn-primary align-self-end "
                onClick={oneDayButtonHandler}
              >
                <Search></Search>
                <div className="mx-1"> Search</div>
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
                  value={fromDateState.slice(0, 10)}
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
                <Search></Search>
                <div className="mx-1"> Search</div>
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

        {section === "Machining" &&
          subSection === "Block Cylinder" &&
          processNo == "OP5" && (
            <div>
              <Heading_B_OP05 />
              {bigList}
            </div>
          )}
        {processName == "B3_OP190" && (
          <div>
            <Heading_B_OP190 />
            <B_OP_190 />
          </div>
        )}
        {processName == "B4_Finishing gantry" && (
          <div>
            <Heading_B_OP195 />
            <B_OP_195 />
          </div>
        )}
           {processName == "B7_OP990" && (
          <div>
            <Heading_B_FG />
            <B_OP_FG />
          </div>
        )}
        {processName == "H1_Material input/engraving" && (
          <div>
            <Heading_H_OP05 />
            <H_OP_05 />
          </div>
        )}
      </fieldset>
    </div>
  );
}

export default DeatialTraceability;

// http://localhost:5081/oracle/serialNoListString?serialNoListString=3611222303205354,3611132306192321
