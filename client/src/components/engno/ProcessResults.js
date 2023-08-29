import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment"

function ResultProcess() {
  const data = useSelector((state) => state.engine.engineData.data);
  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const processNo = useSelector((state) => state.process.processNo);
  const processNoList = useSelector((state) => state.process.data.data);
  var processNoFiltered = []; // contains only one element after filtering even thow it is list
  var slNo;
  var display = null;
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

  console.log(slNo);

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

  ///**********Return based on process No */

  useEffect(() => {}, [processNo]);

  // ******** check conditions ********
  if ( subSection === "Block Cylinder") {
    switch (processNo) {
      case "OP5":
        processNoFiltered = processNoList?.filter(
          (elements) => elements[5] === "B1_ENGRAVED"
        );
        console.log("why undefined :");
        console.log(processNoFiltered);
        display =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column dt1">
              <div className="d-flex ">
                <div className="dt1f1">Name</div> <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex ">
                <div className="dt1f1">Sl No.</div> <div className="dt1f2">{processNoFiltered[0][1]}</div>
              </div>
              <div className="d-flex ">
                <div className="dt1f1">Date</div> <div className="dt1f2">{moment(processNoFiltered[0][8]).format("DD-MM-YYYY HH:mm:ss")}</div>
              </div>
            </div>
          );
        break;
      case "OP190":
        processNoFiltered = processNoList?.filter(
          (elements) => elements[5] === "B3_OP190"
        );
        console.log("why undefined :");
        console.log(processNoFiltered);
        display =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column">
              <div className="d-flex ">
                <div className="dt1f1">name</div> <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex ">
                <div className="dt1f1">Data</div> <div className="dt1f2">{processNoFiltered[0][1]}</div>
              </div>
              <div className="d-flex">
                <div className="dt1f1">Date</div> <div className="dt1f2">{processNoFiltered[0][8]}</div>
              </div>
            </div>
          );
        break;
      default:
        display = null;
        break;
    }
  } else if ( subSection === "Head Cylinder") {
    switch (processNo) {
  
      case "OP50":
        processNoFiltered = processNoList?.filter(
          (elements) => elements[5] === "H2_OP050"
        );
        console.log("why undefined :");
        console.log(processNoFiltered);
        display =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column">
              <div className="d-flex gap-2">
                <div>name</div> <div>{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex gap-2">
                <div>Data</div> <div>{processNoFiltered[0][1]}</div>
              </div>
              <div className="d-flex gap-2">
                <div>Date</div> <div>{processNoFiltered[0][8]}</div>
              </div>
            </div>
          );
        break;
        case "OP55":
          processNoFiltered = processNoList?.filter(
            (elements) => elements[5] === "H3_OP055"
          );
          console.log("why undefined :");
          console.log(processNoFiltered);
          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                <div className="d-flex gap-2">
                  <div>name</div> <div>{processNoFiltered[0][5]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Data</div> <div>{processNoFiltered[0][1]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                </div>
              </div>
            );
          break;
        case "OP310":
          processNoFiltered = processNoList?.filter(
            (elements) => elements[5] === "H5_OP310"
          );
          console.log("why undefined :");
          console.log(processNoFiltered);
          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                <div className="d-flex gap-2">
                  <div>name</div> <div>{processNoFiltered[0][5]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Data</div> <div>{processNoFiltered[0][1]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                </div>
              </div>
            );
          break;
      default:
        display = null;
        break;
    }
  }else if (subSection === "Crank Shaft") {
    switch (processNo) {
  
      case "OP150 & 170":
        processNoFiltered = processNoList?.filter(
          (elements) => elements[5] === "C3_OP150_170"
        );
        console.log("why undefined :");
        console.log(processNoFiltered);
        display =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column">
              <div className="d-flex gap-2 ">
                <div>name</div> <div>{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex gap-2">
                <div>Data</div> <div>{processNoFiltered[0][1]}</div>
              </div>
              <div className="d-flex gap-2">
                <div>Date</div> <div>{processNoFiltered[0][8]}</div>
              </div>
            </div>
          );
        break;
        case "OP220":
          processNoFiltered = processNoList?.filter(
            (elements) => elements[5] === "C4_OP220"
          );
          console.log("why undefined :");
          console.log(processNoFiltered);
          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                <div className="d-flex gap-2">
                  <div>name</div> <div>{processNoFiltered[0][5]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Data</div> <div>{processNoFiltered[0][1]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                </div>
              </div>
            );
          break;
        case "OP310":
          processNoFiltered = processNoList?.filter(
            (elements) => elements[5] === "H5_OP310"
          );
          console.log("why undefined :");
          console.log(processNoFiltered);
          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                <div className="d-flex gap-2">
                  <div>name</div> <div>{processNoFiltered[0][5]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Data</div> <div>{processNoFiltered[0][1]}</div>
                </div>
                <div className="d-flex gap-2">
                  <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                </div>
              </div>
            );
          break;
      default:
        display = null;
        break;
    }
  }


  // H5_OP310
  // H2_OP050
  // H3_OP055




  // C3_OP150_170
  return (
    <>
      {/* {range === "oneDay" && (
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
      )} */}

      {display}
    </>
  );
}

export default ResultProcess;
