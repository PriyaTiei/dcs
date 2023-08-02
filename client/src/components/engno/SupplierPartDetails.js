import React, { useState, useEffect } from "react";

// import Select from "react-select"
import Select from "react-select";
import DetailsTableHeading1 from "./DetailsTableHeading1";
import DetailsTableHeading2 from "./DetailsTableHeading2";
import DetailsTableValue1 from "./DetailsTableValue1";
import DetailsTableValue2 from "./DetailsTableValue2";
import { a } from "./dummy";
import { b } from "./dummy2.js";

function SupplierPartDetails() {
  const [engineNo, setEngineNo] = useState("");
  const [part, setPart] = useState("");
  const [section, setSection] = useState([]);
  const [subSection, setSubSection] = useState([]);
  const [subSectionOptions2, setSubSectionOptions2] = useState();
  const [supplierPart, setSupplierPart] = useState("");
  const [range, setRange] = useState("oneDay");

  const hDate = new Date(Date.now()).toUTCString();

  const detail1 = "details";

  const sectionData = [
    { section: "Shipment", subSection: ["Dispatch"] },
    { section: "Assembly", subSection: ["subAssy", "Mk1", "Mk2"] },
    {
      section: "Machining",
      subSection: ["Cylinder Block", "Cylinder Head", "Cam housing"],
    },
    {
      section: "Supplier part",
      subSection: ["Cylinder Block", "Cylinder Head", "Cam housing"],
    },
  ];

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

  useEffect(() => {
    itemSelected = sectionData?.filter((item) => item.section == section);

    subSectionOptions1 = itemSelected[0]?.subSection?.map((item) => {
      return { value: item, label: item };
    });
    setSubSectionOptions2(subSectionOptions1);
    console.log(subSectionOptions2);
  }, [section]);

  // Generate details for table1
  const values1 = a;

  const valuesTable = values1.map((item) => (
    <DetailsTableValue1
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
      serailNo={item.serialNo}
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

  return (
    <div>
      {/* search engine no */}
      <div>
        <div className="d-flex justify-content-between">
          <div>
            <div>Engine Number</div>
            <div className="d-flex gap-3">
              <input
                type="text"
                placeholder="Please enter engine no."
                value={engineNo}
                onChange={(e) => setEngineNo(e.target.value)}
                className="form-control "
              ></input>
              <button className="btn btn-primary">Search</button>
            </div>
          </div>

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
      </div>

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
                options={sectionOptions}
                defaultValue={sectionOptions[0]}
                onChange={(e) => setSection(e.value)}
              />
              <Select
                options={subSectionOptions2}
                // defaultValue={subSectionOptions2[0]}
                onChange={(e) => setSubSection(e.value)}
              />
            </div>
          </div>

          {/* Process data [Machining]  */}
          <div>
            <div className="h5">Process data [Machining]</div>
            <div className="d-flex flex-wrap gap-1 prosMach ">
              <div className="p-2 border ">OP05</div>
              <div className="p-2 border ">OP50</div>
              <div className="p-2 border ">OP55</div>
              <div className="p-2 border ">OP80</div>
              <div className="p-2 border ">OP120</div>
              <div className="p-2 border ">OP140A</div>
              <div className="p-2 border ">OP180A</div>
              <div className="p-2 border ">OP180B</div>
              <div className="p-2 border ">OP200</div>
              <div className="p-2 border ">OP240</div>
              <div className="p-2 border ">OP270</div>
              <div className="p-2 border ">OP300</div>
              <div className="p-2 border ">OP310(Oil leak)</div>
              <div className="p-2 border ">FVC</div>
            </div>
          </div>

          {/*Results */}
          {range === "oneDay" && (
            <div className="mt-3">
              <div className="h5">Results</div>
              <div className="d-flex flex-wrap gap-1 res1 ">
                <div className="text-center font-weight-bold">Part No.</div>

                <div className="text-center font-weight-bold">
                  Leak test Date
                </div>

                <div className="text-center font-weight-bold">Time</div>
                <div className="text-center font-weight-bold">
                  3611242302288624
                </div>
                <div className="text-center font-weight-bold bg-warning">
                  28-02-2023
                </div>
                <div className="text-center font-weight-bold">12:28</div>
              </div>
              <div className="d-flex flex-wrap gap-1 res2 ">
                <div className="text-center font-weight-bold">Oil Leak(15)</div>
                <div className="text-center font-weight-bold">W/J leak(8)</div>
                <div className="text-center font-weight-bold">C/C(40)</div>
                <div className="text-center font-weight-bold">EGR(4)</div>
                <div className="text-center font-weight-bold">5.42</div>
                <div className="text-center font-weight-bold">7.98</div>
                <div className="text-center font-weight-bold">10.5</div>
                <div className="text-center font-weight-bold">0.598</div>
              </div>
            </div>
          )}

          {/* This is for Date Range */}
          {range === "dateRange" && (
            <div className="mt-3">
              <div className="h5">Select Date Range</div>
              <div className="d-flex flex-wrap gap-1 rang ">
                <div className="text-center font-weight-bold">From Date</div>

                <div className="text-center font-weight-bold">To Date</div>

                <div className="text-center font-weight-bold bg-warning">
                  28-02-2023
                </div>
                <div className="text-center font-weight-bold bg-warning">
                  28-02-2023
                </div>
              </div>
            </div>
          )}
        </div>
        {range === "oneDay" && (
          <div>
            <DetailsTableHeading1 />
            {valuesTable}
          </div>
        )}
        {range === "dateRange" && (
          <div>
            <DetailsTableHeading2 />
            {valuesTable2}
          </div>
        )}
      </fieldset>
    </div>
  );
}

export default SupplierPartDetails;
