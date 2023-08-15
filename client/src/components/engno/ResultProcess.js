import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function ResultProcess() {
  const data = useSelector((state) => state.engine.engineData.data);
  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  var slNo;
  if (data) {
    switch (subSection) {
      case "Block Cylinder":
        {
          slNo = 1;
        }
        break;
      case "Head Cylinder":
        {
          slNo = 2;
        }
        break;
      case "Crank Shaft":
        {
          slNo = 3;
        }
        break;
      default:
        {
          slNo = 0;
        }
        break;
    }
  }

  console.log(slNo)

  // formating date
  function getCurrentDateInYYYYMMDD() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const formattedDate = getCurrentDateInYYYYMMDD();
  const [range, setRange] = useState("oneDay");
  const [selectedDate, setSelectedDate] = useState(formattedDate);

  const dateHandler = (e) => {
    setSelectedDate(e.target.value);
    console.log(e.target.value);
  };

  return (
    <>
      {range === "oneDay" && (
        <div className="mt-3">
          <div className="h5">Results</div>
          <div className="d-flex flex-wrap gap-1 res1 ">
            <div className="text-center font-weight-bold">Part No.</div>

            <div className="text-center font-weight-bold">Leak test Date</div>

            <div className="text-center font-weight-bold">Time</div>
            <div className="text-center font-weight-bold">3611242302288624</div>
            <div className="text-center font-weight-bold bg-warning">
              <input
                type="date"
                value={selectedDate}
                className="bg-warning"
                onChange={dateHandler}
              />
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
    </>
  );
}

export default ResultProcess;
