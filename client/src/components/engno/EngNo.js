import React, { useEffect, useState } from "react";
import ChangePointValue from "./changePointValue.js";
// import Select from "react-select"
import Select from "react-select";
import axios from "axios";
import DateTable from "./DateTable.js";
import moment from "moment";

function EngNo() {
  const [engineNo, setEngineNo] = useState("");
  const [oracleData, setOracleData] = useState("");
  const [part, setPart] = useState("");
  const [supplierPart, setSupplierPart] = useState("");
  const hDate = new Date(Date.now()).toUTCString();
  const [shippingRow, setShippingRow] = useState(null);

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

  const getColumn = (arr, a, b, c) => {
    const selectedColumn = arr.map((item) => [item[a], item[b], item[c]]);
    console.log(typeof arr[0][c], "dateFormat");
    return selectedColumn;
  };

  const machinedParts = ["Block S / N", "Crank S / N", "Head S / N"];

  const getOracleData = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/engineNo/${engineNo}`)
      .then((result) => {
        console.log(result.data);
        setOracleData(result.data);

        // console.log(result.data);
      })
      .catch((err) => console.log(err));

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/date/${engineNo}`)
      .then((result) => {
        console.log(result.data.data, "my data");
        const dateRow = result.data.data.filter((item) => item[1] === "200");

        console.log(dateRow[0], "Date row");
        setShippingRow(dateRow[0]);
      })
      .catch((err) => console.log(err));
  };
  const getPartData = async (partNo) => {
    console.log("part nos are", partNo);
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/partNo/${partNo}`)
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (oracleData) {
      const selectedColumns = getColumn(oracleData.data, 17, 1, 21);

      console.log(selectedColumns);
      // only keeping 3c parts
      const c3 = selectedColumns.filter((item) => {
        return (
          item[0] === machinedParts[0] ||
          item[0] === machinedParts[1] ||
          item[0] === machinedParts[2]
        );
      });
      console.log(c3);
      c3.forEach((item) => {
        getPartData(item[1]);
      });
    }
  }, [oracleData]);

  const history = oracleData?.data?.map((item) =>
    item[17] != "EGNO" ? (
      <DateTable key={item[0]} title={item[17]} date={item[21]} />
    ) : null
  );
  return (
    <div>
      {/* search engine no */}
      <div>
        <div>Engine Number</div>
        <div className="d-flex gap-3">
          <input
            type="text"
            placeholder="Please enter engine no."
            value={engineNo}
            onChange={(e) => setEngineNo(e.target.value)}
            className="form-control w-25"
          ></input>
          <button className="btn btn-primary" onClick={getOracleData}>
            Search
          </button>
        </div>
      </div>

      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-primary"
          style={{ fontSize: "16px" }}
        >
          Assembly Data
        </legend>
        <div className="d-flex gap-3 mt-0">
          {/* Engine History */}
          <div>
            <div className="h5">Engine history</div>

            <div className="d-flex gap-0">
              <div className="p-2 border hist h6 text-center bg-light">EVENT</div>
              <div className="p-2 border histValue h6  text-center bg-light">
                DATE & TIME
              </div>
            </div>

            <div className="d-flex gap-0">
              <div className="p-2 border hist  ">SHIPMENT</div>
              <div className="p-2 border histValue ">
                {moment(shippingRow ? shippingRow[3] : null).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </div>
            </div>

            {history}
          </div>

          {/* Shipping Detail */}
          <div>
            <div className="h5">Shipping Detail</div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Consignment No:</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Truck No:</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship ">Customer name</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Module No:</div>
              <div className="p-2 border ship"> {detail1}</div>
            </div>
          </div>

          {/* Process data [Assembly]  */}
          <div>
            <div className="h5">Process data [Assembly]</div>
            <div className="d-flex flex-wrap gap-1 pros ">
              <div className="p-2 border ">Shipment</div>
              <div className="p-2 border ">FTB</div>
              <div className="p-2 border ">MTB</div>
              <div className="p-2 border ">Oil/water leak</div>
              <div className="p-2 border ">Fuel Leak</div>
              <div className="p-2 border ">CHS</div>
              <div className="p-2 border ">BS</div>
              <div className="p-2 border ">PS</div>
              <div className="p-2 border ">SPS</div>
              <div className="p-2 border pros">MK line</div>
            </div>
          </div>
        </div>

        {/* Change point information  */}
        <div className="mt-3">
          <div className="h5">Change Point Information</div>
          <div className="d-flex flex-wrap gap-1 chan ">
            <div className="text-center font-weight-bold">Station</div>
            <div className="text-center font-weight-bold">4M</div>
            <div className="text-center font-weight-bold">Abnormality</div>
            <div className="text-center font-weight-bold">Breakdown</div>
            <div className="text-center font-weight-bold">Rework</div>

            <ChangePointValue
              station={"MK4"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"MK25"}
              m4={"Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"BS8"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"BS3"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"HS6"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"HS4"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"SPS2"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "16px" }}
        >
          Machining Data
        </legend>
        <div className="d-flex gap-3 mt-0">
          {/* Part selection */}

          <div>
            <div className="h5">Part Name</div>
            <Select
              options={partOptions}
              defaultValue={partOptions[0]}
              onChange={(e) => setPart(e.value)}
            />
          </div>

          {/* RM Detail */}
          <div>
            <div className="h5">RM Detail</div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Machine No: :</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Die No: :</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship ">Supplier name</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">ETD:</div>
              <div className="p-2 border ship"> {detail1}</div>
            </div>
          </div>

          {/* Part History */}
          <div>
            <div className="h5">Part history</div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">FG time</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">Leak test time</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">Crank boring time</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">RM feed time</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">ETA</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
          </div>
          {/* Process data [Machining]  */}
          <div>
            <div className="h5">Process data [Machining]</div>
            <div className="d-flex flex-wrap gap-1 prosMach ">
              <div className="p-2 border ">OP05</div>
              <div className="p-2 border ">OP150</div>
              <div className="p-2 border ">OP160</div>
              <div className="p-2 border ">OP170</div>
              <div className="p-2 border ">OP180</div>
              <div className="p-2 border ">OP190</div>
              <div className="p-2 border ">OP195A</div>
              <div className="p-2 border ">OP195B</div>
              <div className="p-2 border ">OP200</div>
              <div className="p-2 border ">OP210</div>
              <div className="p-2 border ">OP220</div>
              <div className="p-2 border ">OP230</div>
              <div className="p-2 border ">OP235</div>
              <div className="p-2 border ">OP250</div>
            </div>
          </div>
        </div>

        {/* Change point information  */}
        <div className="mt-3">
          <div className="h5">Change Point Information</div>
          <div className="d-flex flex-wrap gap-1 chan ">
            <div className="text-center font-weight-bold">OP/ Station</div>
            <div className="text-center font-weight-bold">4M</div>
            <div className="text-center font-weight-bold">Abnormality</div>
            <div className="text-center font-weight-bold">Breakdown</div>
            <div className="text-center font-weight-bold">Rework</div>

            <ChangePointValue
              station={"QC1"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"QC2"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"QC3"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Available"}
            />
            <ChangePointValue
              station={"QC4"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"OP160"}
              m4={"Not Available"}
              abnormality={"Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"OP230"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
            <ChangePointValue
              station={"OP235"}
              m4={"Not Available"}
              abnormality={"Not Available"}
              breakdown={"Not Available"}
              rework={"Not Available"}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "16px" }}
        >
          Supplier Part traceability
        </legend>
        <div className="d-flex gap-3 mt-0">
          {/* Supplier Part selection */}

          <div>
            <div className="h5">Supplier Part Name</div>
            <Select
              options={supplierPartOptions}
              defaultValue={supplierPartOptions[0]}
              onChange={(e) => setSupplierPart(e.value)}
            />
          </div>

          {/* RM Detail */}
          <div>
            <div className="h5">RM Detail</div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Machine No: :</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">Die No: :</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship ">Supplier name</div>
              <div className="p-2 border ship">{detail1}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border ship">ETD:</div>
              <div className="p-2 border ship"> {detail1}</div>
            </div>
          </div>

          {/* Part History */}
          <div>
            <div className="h5">Part history</div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">ETA Time</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">Invoice No.</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
            <div className="d-flex gap-0">
              <div className="p-2 border hist">Feed time</div>
              <div className="p-2 border histValue">{hDate}</div>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default EngNo;
