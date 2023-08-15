import React, { useEffect, useState } from "react";
import ChangePointValue from "./changePointValue.js";
// import Select from "react-select"
import Select from "react-select";
import axios from "axios";
import DateTable from "./DateTable.js";
import moment from "moment";
import ShippingDetails from "./ShippingDetails.js";
import ChangePointAssembly from "./ChangePointAssembly.js";
import SupplierPartDetails from "./SupplierPartDetails.js";
import ChangePointMachining from "./ChangePointMachining.js";
import RawMaterialDetails from "./RawMaterialDetails.js";
import PartHistory from "./RMHistory.js";
import { useSelector, useDispatch } from "react-redux";
import { getEngineData } from "../../redux/slices/egNo/egNoActions.js";

function EngNo() {
  const [engineNo, setEngineNo] = useState("");

  const [part, setPart] = useState("");
  const [supplierPart, setSupplierPart] = useState("");
  const hDate = new Date(Date.now()).toUTCString();

  const dispatch = useDispatch();

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
  const shippingRow = useSelector((state) => state.engine.shippingData);


  const getColumn = (arr, a, b, c) => {
    const selectedColumn = arr.map((item) => [item[a], item[b], item[c]]);

    return selectedColumn;
  };

  const machinedParts = ["Block S / N", "Crank S / N", "Head S / N"];

  const getOracleData = () => {
    dispatch(getEngineData(engineNo));
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
    if (oracleData.data) {
      const selectedColumns = getColumn(oracleData?.data, 17, 1, 21);

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

  const fullHistory = oracleData ? (
    <>
      <div className="d-flex gap-0">
        <div className="p-2 border hist  ">SHIPMENT</div>
        <div className="p-2 border histValue ">
          {moment(shippingRow ? shippingRow[3] : null).format(
            "YYYY-MM-DD HH:mm:ss"
          )}
        </div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist  ">MTB</div>
        <div className="p-2 border histValue ">
          {/* {moment(shippingRow ? shippingRow[3] : null).format(
          "YYYY-MM-DD HH:mm:ss"
        )} */}
          Under progress
        </div>
      </div>

      {history}
    </>
  ) : null;
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
          {/* Shipping Detail */}
          <ShippingDetails />

          {/* Engine History */}
          <div>
            <div className="h5">Engine history</div>

            <div className="d-flex gap-0">
              <div className="p-2 border hist h6 text-center bg-light">
                EVENT
              </div>
              <div className="p-2 border histValue h6  text-center bg-light">
                DATE & TIME
              </div>
            </div>
            {fullHistory}
          </div>

          {/*  */}

          {/* Change point information  */}
          <ChangePointAssembly />
        </div>
      </fieldset>

      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "16px" }}
        >
          Machining Data
        </legend>
        {/* Change point information for Machining */}
        <ChangePointMachining />

        <div className="d-flex gap-3 mt-0">
          {/* Supplier details */}
          <SupplierPartDetails />

          {/* Part selection */}

          {/* RM Detail */}

          {/* Part History */}
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
          {/* RM details */}
          <RawMaterialDetails />

          {/* Part History */}
          <PartHistory />
        </div>
      </fieldset>
    </div>
  );
}

export default EngNo;
