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
  const processNoList = useSelector((state) => state.process.data.data);
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

  ///**********Return based on process No */

  useEffect(() => {
    if (processNoFiltered == undefined || processNoFiltered.length == 0) {
    } else {
      var tempFromDate = new Date(processNoFiltered[0][8]);
      tempFromDate.setHours(5);
      tempFromDate.setMinutes(30);
      tempFromDate.setSeconds(1);

      var tempToDate = new Date(processNoFiltered[0][8]);
      tempToDate.setHours(28);
      tempToDate.setMinutes(89);
      tempToDate.setSeconds(59);

      dispatch(newFromDate(tempFromDate.toISOString()));
      dispatch(newToDate(tempToDate.toISOString()));
      dispatch(
        getProcessOneDayDetails(
          processNoFiltered[0][5],
          tempFromDate.toISOString(),
          tempToDate.toISOString()
        )
      );
    }
  }, [section, subSection, processName]);

  // second user effect - to get engine nos of all part based on serial no
  useEffect(() => {
    if (dataOneDay?.length >= 0) {
      if (
        section == "Machining" &&
        subSection == "Block Cylinder" &&
        processNo == "OP5"
      ) {
        const serialNoListString = dataOneDay
          .map((item) => item[2].trim())
          .join(",");
        dispatch(getProcessEngineDetails(serialNoListString));
      }
    }
  }, [dataOneDay]);

  // third user effect - to get dispatch dates of all engine
  useEffect(() => {
    if (processEngineData?.length >= 0) {
      if (
        section == "Machining" &&
        subSection == "Block Cylinder" &&
        processNo == "OP5"
      ) {
        const engineNoListString = processEngineData
          .map((item) => item[1].trim())
          .join(",");

        dispatch(getProcessEngineDateDetails(engineNoListString));
      }
    }
  }, [processEngineData]);

  // ******** check conditions ********
  if (section === "Machining") {
    if (subSection === "Block Cylinder") {
      switch (processNo) {
        case "OP5":
          processNoFiltered = processNoList?.filter(
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
          processNoFiltered = processNoList?.filter(
            (elements) => elements[5] === "B3_OP190"
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
        case "OP195AB":
          processNoFiltered = processNoList?.filter(
            (elements) => elements[5] === "B3_OP190"
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
          processNoFiltered = processNoList?.filter(
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
          processNoFiltered = processNoList?.filter(
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
          processNoFiltered = processNoList?.filter(
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
          processNoFiltered = processNoList?.filter(
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
          processNoFiltered = processNoList?.filter(
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
          processNoFiltered = processNoList?.filter(
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
