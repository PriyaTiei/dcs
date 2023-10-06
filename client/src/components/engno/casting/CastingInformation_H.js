import React, { useState } from "react";
import { getProcessCastingNo } from "../../../redux/slices/processData/processActions";
import { useDispatch } from "react-redux";
import { Search } from "bootstrap-icons-react";

function CastingInformation_H({ castingNo }) {
  const dispatch = useDispatch();
  var ui;
  var castingDayOfMonth;
  var castingMonth;
  var castingYear;
  var castingDate;
  console.log("casting data");
  console.log(castingNo);

  if (castingNo != null) {
    castingYear = `20${castingNo.slice(8, 10)}`;
    castingDayOfMonth = castingNo.slice(11, 13);
    switch (castingNo.slice(10, 11)) {
      case "A":
        castingMonth = "01";
        break;

      case "B":
        castingMonth = "02";
        break;
      case "C":
        castingMonth = "03";
        break;
      case "D":
        castingMonth = "04";
        break;
      case "E":
        castingMonth = "05";
        break;
      case "F":
        castingMonth = "06";
        break;
      case "G":
        castingMonth = "07";
        break;
      case "H":
        castingMonth = "08";
        break;
      case "I":
        castingMonth = "09";
        break;
      case "J":
        castingMonth = "10";
        break;
      case "K":
        castingMonth = "11";
        break;
      case "L":
        castingMonth = "12";
        break;
      default:
        castingMonth = ``;
        break;
    }
    console.log("casting date in head cylinder");
    console.log(`${castingYear}-${castingMonth}-${castingDayOfMonth}`);
    castingDate = new Date(
      `${castingYear}-${castingMonth}-${castingDayOfMonth}`
    ).toISOString();
    // console.log(castingYear);
    // console.log(castingMonth);
    // console.log(castingDayOfMonth);
    // console.log("casting date :");
    // console.log(castingDate);
  }

  const [castingMachineNo, setCastingMachineNo] = useState(
    castingNo != null ? castingNo.slice(6, 8) : null
  );
  const [dieNo, setDieNo] = useState(
    castingNo != null ? castingNo.slice(5, 6) : null
  );
  const [date, setDate] = useState(
    castingNo != null ? castingDate : new Date(Date.now()).toISOString()
  );
  const [shift, setShift] = useState(
    castingNo != null ? castingNo.slice(13, 14) : null
  );

  const castingDateHandler = (e) => {
    setDate(e.target.value);
  };

  const castingSearch = () => {
    let y = date.slice(2, 4);
    let m = date.slice(5, 7);
    if (m == "01") {
      m = "A";
    } else if (m == "02") {
      m = "B";
    } else if (m == "03") {
      m = "C";
    } else if (m == "04") {
      m = "D";
    } else if (m == "05") {
      m = "E";
    } else if (m == "06") {
      m = "F";
    } else if (m == "07") {
      m = "G";
    } else if (m == "08") {
      m = "H";
    } else if (m == "09") {
      m = "I";
    } else if (m == "10") {
      m = "J";
    } else if (m == "11") {
      m = "K";
    } else if (m == "12") {
      m = "L";
    }

    let d = date.slice(8, 10);
    let castingNo = `${dieNo}${castingMachineNo}${y}${m}${d}${shift}`;

    dispatch(getProcessCastingNo(castingNo));
  };

  if (castingNo != null) {
    ui = (
      <fieldset className="border p-2 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "13px" }}
        >
          Casting Details
        </legend>
        <div className="d-flex gap-2">
          {/* <div className="d-flex flex-column gap-1">
            <div className="border border-dark p-2 bg-dark text-light">
              Model
            </div>
            <div className="border border-dark p-2 ">
              {castingNo.slice(0, 2) == "T2"
                ? "2 Lts"
                : castingNo.slice(0, 2) == "T1"
                ? "1.5 Lts"
                : null}
            </div>
          </div> */}

          <div className="d-flex flex-column gap-1">
            <div className="border border-dark p-2 bg-dark text-light  text-center">
              Die No.
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={dieNo}
              onChange={(e) => {
                setDieNo(e.target.value);
              }}
              className="text-center"
            />
          </div>

          <div className="d-flex flex-column gap-1">
            <div className="border border-dark p-2 bg-dark text-light text-center">
              M/C No.
            </div>
            <input
              type="number"
              min="1"
              max="99"
              value={castingMachineNo}
              onChange={(e) => {
                setCastingMachineNo(e.target.value);
              }}
              className="text-center"
            />
          </div>

          <div className="d-flex flex-column gap-1">
            <div className="border border-dark p-2 bg-dark text-light text-center">
              Date
            </div>
            <input
              type="date"
              value={date.slice(0, 10)}
              onChange={castingDateHandler}
              className="bg-warning text-center"
            />
          </div>

          <div className="d-flex flex-column gap-1">
            <div className="border border-dark p-2 bg-dark text-light text-center">
              Shift
            </div>
            <input
              value={shift}
              onChange={(e) => {
                setShift(e.target.value);
              }}
              className="text-center"
            />
          </div>
        </div>
        <button
          className=" my-3 btn btn-primary form-control"
          onClick={castingSearch}
        >
          <div className="d-flex gap-2 align-items-center justify-content-center">
            <Search />
            Search
          </div>
        </button>
      </fieldset>
    );
  } else {
    ui = null;
  }

  return <>{ui}</>;
}

export default CastingInformation_H;
