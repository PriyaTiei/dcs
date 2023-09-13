import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  getProcessEngineDetails,
  getProcessEngineDateDetails,
  getProcessOneDayDetails,
  newFromDate,
  newToDate,
} from "../../redux/slices/processData/processActions";
import CastingInformation from "./casting/CastingInformation";

function ResultProcess() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.engine.engineData.data);
  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const processNo = useSelector((state) => state.process.processNo);
  const processName = useSelector((state) => state.process.processName);
  const processNoALCData = useSelector((state) => state.process.data.data);
  const dataOneDay = useSelector((state) => state.process.dataOneDay.data);

  var processNoFiltered = []; // contains only one element after filtering even thow it is list
  var processEngineData = useSelector(
    (state) => state.process.processEngine.data
  );
  var processEngineDateData = useSelector(
    (state) => state.process.processEngineDate.data
  );
  var display = null;

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

  

  // ******** check conditions ********
  if (section === "Machining") {
    if (subSection === "Block Cylinder") {
      switch (processNo) {
        case "OP5":
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "B1_ENGRAVED"
          );

          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column dt1">
                <div className="h6 mb-2">Engraving Details</div>
                <div className="d-flex ">
                  <div className="dt1f1">Name</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][5]}</div>
                </div>
                <div className="d-flex ">
                  <div className="dt1f1">Casting No.</div>{" "}
                  <div className="dt1f2">
                    {processNoFiltered[0][1].slice(16)}
                  </div>
                </div>
                <div className="d-flex ">
                  <div className="dt1f1">Engraving Date</div>{" "}
                  <div className="dt1f2">
                    {moment(processNoFiltered[0][8]).format(
                      "DD-MMMM-YYYY HH:mm:ss"
                    )}
                  </div>
                </div>
              </div>
            );
          break;
        case "OP190":
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "B3_OP190"
          );
          if(processNoFiltered != undefined && processNoFiltered.length > 0){
            var op190Data = processNoFiltered[0][1].split(",")
            // console.log(op190Data)
            // console.log(op190Data[7])
            // console.log(parseInt(op190Data[7].slice(0,6)))
          }
          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                 <div className="h6 mb-2">Journal diameter in microns</div>
                {/* <div className="d-flex ">
                  <div className="dt1f1">Process No.</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][5]}</div>
                </div> */}
                <div className="d-flex  ">
                <div className="d-flex flex-column dt2 ">
                  <div className="dt1f1 text-center bg-dark text-light ">J1</div>{" "}
                  <div className="dt1f1 text-center">{parseInt(op190Data[7].slice(0,6))}</div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">J2</div>{" "}
                  <div className="dt1f1 text-center">{parseInt(op190Data[8].slice(0,6))}</div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">J3</div>{" "}
                  <div className="dt1f1 text-center">{parseInt(op190Data[9].slice(0,6))}</div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">J4</div>{" "}
                  <div className="dt1f1 text-center">{parseInt(op190Data[10].slice(0,6))}</div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">J5</div>{" "}
                  <div className="dt1f1 text-center">{parseInt(op190Data[11].slice(0,6))}</div>
                </div>
              </div>
                {/* <div className="d-flex">
                  <div className="dt1f1">Date</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][8]}</div>
                </div> */}
              </div>
            );
          break;
        case "OP195AB":
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "B4_Finishing gantry"
          );

          display =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                <div className="d-flex ">
                  <div className="dt1f1">name</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][5]}</div>
                </div>
                <div className="d-flex ">
                  <div className="dt1f1">Data</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][1]}</div>
                </div>
                <div className="d-flex">
                  <div className="dt1f1">Date</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][8]}</div>
                </div>
              </div>
            );
          break;
          case "OP235":
            processNoFiltered = processNoALCData?.filter(
              (elements) => elements[5] === "B5_OP235"
            );
  
            display =
              processNoFiltered == undefined ||
              processNoFiltered.length == 0 ? null : (
                <div className="d-flex flex-column">
                  <div className="d-flex ">
                    <div className="dt1f1">name</div>{" "}
                    <div className="dt1f2">{processNoFiltered[0][5]}</div>
                  </div>
                  <div className="d-flex ">
                    <div className="dt1f1">Data</div>{" "}
                    <div className="dt1f2">{processNoFiltered[0][1]}</div>
                  </div>
                  <div className="d-flex">
                    <div className="dt1f1">Date</div>{" "}
                    <div className="dt1f2">{processNoFiltered[0][8]}</div>
                  </div>
                </div>
              );
            break;
            case "FG":
              processNoFiltered = processNoALCData?.filter(
                (elements) => elements[5] === "B7_OP990"
              );
    
              display =
                processNoFiltered == undefined ||
                processNoFiltered.length == 0 ? null : (
                  <div className="d-flex flex-column">
                    <div className="d-flex ">
                      <div className="dt1f1">name</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][5]}</div>
                    </div>
                    <div className="d-flex ">
                      <div className="dt1f1">Data</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][1]}</div>
                    </div>
                    <div className="d-flex">
                      <div className="dt1f1">Date</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][8]}</div>
                    </div>
                  </div>
                );
              break;
        default:
          display = null;
          break;
      }
    } else if (subSection === "Head Cylinder") {
      switch (processNo) {
        case "OP50":
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "H2_OP050"
          );

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
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "H3_OP055"
          );

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
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "H5_OP310"
          );

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
    } else if (subSection === "Crank Shaft") {
      switch (processNo) {
        case "OP150 & 170":
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "C3_OP150_170"
          );

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
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "C4_OP220"
          );

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
          processNoFiltered = processNoALCData?.filter(
            (elements) => elements[5] === "H5_OP310"
          );

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
  }

  // H5_OP310
  // H2_OP050
  // H3_OP055

  // C3_OP150_170
  var castingDetails=null
  if(processName == "B1_ENGRAVED"){
      if(processNoFiltered != undefined && processNoFiltered.length > 0 ){
        castingDetails=  <CastingInformation castingNo={processNoFiltered[0][1].slice(16)} />
      }
  }
  

 
  return (
    <div className="d-flex gap-3">
      <>{display}</>
      <>{castingDetails}</>
      
     
    </div>
  );
}

export default ResultProcess;
