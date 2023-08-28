import React, { useState, useEffect } from "react";

// import Select from "react-select"
import Select from "react-select";
import MachiningHeadLeakHeading from "./MachiningHeadLeakHeading";
import AssemblyLeakHeading from "./AssemblyLeakHeading";
import DetailsTableValue1 from "./ReuasbleMachiningHeadLeakValues";
import DetailsTableValue2 from "./ReusabeAssemblyLeakValues";
import { a } from "./dummyHeadLeak";
import { b } from "./dummyAssemblyLeak.js";
import ProcessNumbers from "./ProcessNumbers";
import ResultProcess from "./ProcessResults";
import SubOptions from "./SubOptions";
import { processNo } from "./processNo";
import { useSelector, useDispatch } from "react-redux";
import {
  setSectionRedux,
  setSubSectionRedux,
} from "../../redux/slices/egNo/egNoActions";
import ReusablePartNo from "./ReusablePartNo";

function DeatialTraceability() {
  // formating date
  function getCurrentDateInYYYYMMDD() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const formattedDate = getCurrentDateInYYYYMMDD();

  const dispatch = useDispatch();
  const [engineNo, setEngineNo] = useState("");
  const [part, setPart] = useState("");
  const [section, setSection] = useState("Assembly");
  const [subSection, setSubSection] = useState("Shipment");
  const [subSectionOptions2, setSubSectionOptions2] = useState([
    { value: "Shipment", label: "Shipment" },
  ]);
  const [supplierPart, setSupplierPart] = useState("");
  const [range, setRange] = useState("oneDay");

  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedDate);

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

  const sectionData = processNo;

  // const sectionData = [
  //   {
  //     section: "Assembly",
  //     subSection: [
  //       "Shipment",
  //       "FTB",
  //       "MTB",
  //       "Oil/water leak",
  //       "Fuel Leak",
  //       "CHS",
  //       "BS",
  //       "PS",
  //       "SPS",
  //       "MK line",
  //     5],
  //   },
  //   {
  //     section: "Machining",
  //     subSection: ["Cylinder Block", "Cylinder Head", "Crank Shaft"],
  //   },
  //   {
  //     section: "Supplier part",
  //     subSection: [
  //       "Cylinder Block",
  //       "Cylinder Head",
  //       "Crank Shaft",
  //       "Connecting rod",
  //       "Crank Case",
  //       "Cam housing",
  //       "Port Injector",
  //       "Pully Crank Shaft",
  //     ],
  //   },
  // ];

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
    itemSelected = sectionData?.filter((item) => item.section == section);

    subSectionOptions1 = itemSelected[0]?.subSection?.map((item) => {
      return { value: item.name, label: item.name };
    });
    setSubSectionOptions2(subSectionOptions1);
  }, [section]);

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

  const toDateHandler = (e) => {
    setToDate(e.target.value);
    console.log(e.target.value);
  };

  const fromDateHandler = (e) => {
    setFromDate(e.target.value);
    console.log(e.target.value);
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
    dispatch(setSubSectionRedux(processNo[index].subSection[0].name));
    setIndexI(index);
    const section = sectionData.find((item) => item.section === selected);
    if (section) {
      setSelectedSubSection(section.subSection[0].name);
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

        <div className="d-flex justify-content-center ">
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
            processNo={sectionData[indexI]["subSection"][indexJ]["processNo"]}
          />

          {/*Results */}
          <ReusablePartNo />
          <ResultProcess />

          {/* This is for Date Range */}
          {range === "dateRange" && (
            <div className="mt-3">
              <div className="h5">Select Date Range</div>
              <div className="d-flex flex-wrap gap-3">
                <div className="d-flex flex-column align-items-start">
                  <div className="text-center font-weight-bold  ">
                    From Date:
                  </div>
                  <input
                    type="date"
                    value={fromDate}
                    className="bg-warning"
                    onChange={fromDateHandler}
                  />
                </div>

                <div className="d-flex flex-column align-items-start">
                  <div className="text-center font-weight-bold">To Date</div>

                  <input
                    type="date"
                    value={toDate}
                    className="bg-warning"
                    onChange={toDateHandler}
                  />
                </div>
                <button className="btn btn-primary align-self-end ">
                  Search1
                </button>
              </div>
            </div>

            // <div className="mt-3">
            //   <div className="h5">Select Date Range</div>
            //   <div className="d-flex flex-wrap gap-2 rang ">
            //     <div className="text-center font-weight-bold ">From Date</div>

            //     <div className="text-center font-weight-bold mx-4">To Date</div>

            //     {/* <div className="text-center font-weight-bold bg-warning"> */}
            //     <input type="date" value={fromDate} className="bg-warning" onChange={fromDateHandler}/>
            //     {/* </div> */}
            //     {/* <div className="text-center font-weight-bold bg-warning mx-4"> */}
            //     <input type="date" value={toDate} className="bg-warning" onChange={toDateHandler}/>
            //     {/* </div> */}
            //     <button className="btn btn-primary block">Search</button>
            //   </div>
            // </div>
          )}
        </div>
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
        )}
      </fieldset>
    </div>
  );
}

export default DeatialTraceability;
