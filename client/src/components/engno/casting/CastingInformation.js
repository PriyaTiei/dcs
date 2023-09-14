import React, { useState } from "react";
import { getProcessCastingNo } from "../../../redux/slices/processData/processActions";
import { useDispatch } from "react-redux";
import { Search } from "bootstrap-icons-react";

function CastingInformation({ castingNo }) {
  const dispatch = useDispatch();
  var ui;
  var castingDayOfMonth;
  var castingMonth;
  var castingYear;
  var castingDate;

  if (castingNo != null) {
    castingYear = `20${castingNo.slice(6, 8)}`;
    castingDayOfMonth = castingNo.slice(9, 11);
    switch (castingNo.slice(8, 9)) {
      case "A":
        castingMonth = "10";
        break;

      case "B":
        castingMonth = "11";
        break;
      case "C":
        castingMonth = "12";
        break;
      default:
        castingMonth = `${parseInt(castingNo.slice(8, 9))}`;
        if (castingMonth.length == 1) {
          castingMonth = `0${parseInt(castingNo.slice(8, 9))}`;
        }
        break;
    }
    castingDate = new Date(
      `${2023}-${castingMonth}-${castingDayOfMonth}`
    ).toISOString();
    // console.log(castingYear);
    // console.log(castingMonth);
    // console.log(castingDayOfMonth);
    // console.log("casting date :");
    // console.log(castingDate);
  }

  const [castingMachineNo, setCastingMachineNo] = useState(
    castingNo != null ? castingNo.slice(4, 5) : null
  );
  const [dieNo, setDieNo] = useState(
    castingNo != null ? castingNo.slice(5, 6) : null
  );
  const [date, setDate] = useState(
    castingNo != null ? castingDate : new Date(Date.now()).toISOString()
  );
  const [shift, setShift] = useState(
    castingNo != null ? castingNo.slice(11, 12) : null
  );

  const castingDateHandler = (e) => {
    setDate(e.target.value);
  };

  const castingSearch = () => {
    let y = date.slice(2, 4);
    let m = date.slice(5, 7);
    if (m == "10") {
      m = "A";
    } else if (m == "11") {
      m = "B";
    } else if (m == "12") {
      m = "C";
    } else {
      m = parseInt(date.slice(6, 7));
    }
    let d = date.slice(8, 10);
    let castingNo = `${castingMachineNo}${dieNo}${y}${m}${d}${shift}`;

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
            <div className="border border-dark p-2 bg-dark text-light text-center">
              M/C No.
            </div>
            <input
              type="number"
              min="1"
              max="100"
              value={castingMachineNo}
              onChange={(e) => {
                setCastingMachineNo(e.target.value);
              }}
              className="text-center"
            />
          </div>
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
              type="number"
              min="1"
              max="3"
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
          <Search></Search>
          <spam className="mx-1"> Search</spam>
        </button>
      </fieldset>
    );
  } else {
    ui = null;
  }

  return <>{ui}</>;
}

export default CastingInformation;
