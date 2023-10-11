import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  getProcessEngineDetails,
  getProcessEngineDateDetails,
  getProcessRangeDetails,
  newFromDate,
  newToDate,
} from "../../redux/slices/processData/processActions";
import CastingInformation_B3 from "./casting/CastingInformation_B3";
import CastingInformation_H3 from "./casting/CastingInformation_H3";
import { decodeBlock235 } from "./processDetails/func_B_235";
import { decodeHead50 } from "./processDetails/func_H_50";
import { decodeAssyHeadBoltNR } from "./processDetails/func_A_HeadBoltNR";

function EntireResultProcess() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.engine.engineData.data);
  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const processNo = useSelector((state) => state.process.processNo);
  const processName = useSelector((state) => state.process.processName);
  const processNoALCData = useSelector((state) => state.process.data3.data);
  const dataOneDay = useSelector((state) => state.process.dataOneDay.data);

  var processNoFiltered = []; // contains only one element after filtering even thow it is list
  var processEngineData = useSelector(
    (state) => state.process.processEngine.data
  );
  var processEngineDateData = useSelector(
    (state) => state.process.processEngineDate.data
  );

  var display = null;
  var display_HeadboltNR = null;
  var display_B1_ENGRAVED = null;
  var display_H1_Material_input_engraving = null;
  var display_FuelLeak = null;
  var display_WalterLeak = null;
  var display_OileLeak = null;
  var display_Engine_quality_information = null;
  var display_TEST_ON = null;
  var display_MAIN_ON = null;
  var display_HEADSUB_OFF = null;
  var display_CAMHOUSINGSIB_OFF = null;
  var display_BLOCKSUB_ON = null;
  var display_EX_cam_S_N = null;
  var display_IN_cam_S_N = null;
  var display_CamHousing_S_N = null;
  var display_Head_S_N = null;
  var display_Crank_S_N = null;
  var display_Block_S_N = null;
  var display_CRANK_ON = null;

  var display_B3_OP190 = null;
  var display_B4_Finishing_gantry = null;
  var display_B5_OP235 = null;
  var display_B7_OP990 = null;
  var display_H1_Material_input_engraving = null;
  var display_H2_OP050 = null;
  var display_H3_OP055 = null;
  var display_H5_OP310 = null;
  var display_H12_OP990 = null;
  var display_C1_Comaterial = null;
  var display_C7_Gantry_after_OP140 = null;
  var display_C3_OP150_170 = null;
  var display_C6_OP170_front_gantry = null;
  var display_C4_OP220 = null;
  var display_C8_OP990 = null;

  var castingDetails_B1_ENGRAVED = null;
  var castingDetails_H1_Material_input_engraving = null;

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
  };

  // ******** check conditions ********
  // if (section === "Machining") {

  // if (subSection === "Block Cylinder") {
  //   switch (processNo) {
  //     case "OP5":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "B1_ENGRAVED"
        );

        display_B1_ENGRAVED =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column dt1">
              <div className="h6 mb-2">Block Engraving Details</div>
              <div className="d-flex ">
                <div className="dt1f1">Name</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex ">
                <div className="dt1f1">Casting No.</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][1].slice(16)}</div>
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
      //   break;
      // case "OP190":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "B3_OP190"
        );
        if (processNoFiltered != undefined && processNoFiltered.length > 0) {
          var op190Data = processNoFiltered[0][1].split(",");
          // console.log(op190Data)
          // console.log(op190Data[7])
          // console.log(parseInt(op190Data[7].slice(0,6)))
        }
        display_B3_OP190 =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column">
              
              <div className="h6 mb-2">Block - Journal diameter in microns</div>
              {/* <div className="d-flex ">
                  <div className="dt1f1">Process No.</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][5]}</div>
                </div> */}
              <div className="d-flex  ">
                <div className="d-flex flex-column dt2 ">
                  <div className="dt1f1 text-center bg-dark text-light ">
                    J1
                  </div>{" "}
                  <div className="dt1f1 text-center">
                    {parseInt(op190Data[7].slice(0, 6))}
                  </div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">
                    J2
                  </div>{" "}
                  <div className="dt1f1 text-center">
                    {parseInt(op190Data[8].slice(0, 6))}
                  </div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">
                    J3
                  </div>{" "}
                  <div className="dt1f1 text-center">
                    {parseInt(op190Data[9].slice(0, 6))}
                  </div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">
                    J4
                  </div>{" "}
                  <div className="dt1f1 text-center">
                    {parseInt(op190Data[10].slice(0, 6))}
                  </div>
                </div>
                <div className="d-flex flex-column dt2">
                  <div className="dt1f1 text-center bg-dark text-light ">
                    J5
                  </div>{" "}
                  <div className="dt1f1 text-center">
                    {parseInt(op190Data[11].slice(0, 6))}
                  </div>
                </div>
              </div>
              {/* <div className="d-flex">
                  <div className="dt1f1">Date</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][8]}</div>
                </div> */}
            </div>
          );
      //   break;
      // case "OP195AB":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "B4_Finishing gantry"
        );
        if (processNoFiltered != undefined && processNoFiltered.length > 0) {
          var op195Data = processNoFiltered[0][1].slice(16, 20);
          // console.log(op190Data)
          // console.log(op190Data[7])
          // console.log(parseInt(op190Data[7].slice(0,6)))
        }

        display_B4_Finishing_gantry =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div>
               <div className="h6 mb-2">Finish Gantry </div>
            <div className="d-flex flex-column">
              <div className="d-flex  dt2">
                <div className="dt1f1">Process Name</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex  dt2">
                <div className="dt1f1">Machine</div>{" "}
                <div className="dt1f2">
                  {op195Data == "0011"
                    ? "OP195A"
                    : op195Data == "0012"
                    ? "OP195B"
                    : ""}
                </div>
              </div>
              <div className="d-flex  dt2">
                <div className="dt1f1">Date</div>{" "}
                <div className="dt1f2">
                  {moment(processNoFiltered[0][8]).format(
                    "DD-MMMM-YYYY HH:mm:ss"
                  )}
                </div>
              </div>
            </div>
            </div>
          );
      //   break;
      // case "OP235":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "B5_OP235"
        );
        if (processNoFiltered != undefined && processNoFiltered.length > 0) {
          var result = decodeBlock235(processNoFiltered[0][1]);
          var plug2to5 = [];
          var PLabel = ["P1", "P2", "P3", "P4", "P5", "P6", "", "SP"];
          for (let i = 0; i < 40; i += 5) {
            if (i === 30) {
              continue;
            }
            let el = (
              <div className="d-flex flex-row flex-wrap mb-2">
                <div className="d-flex flex-column dt3">
                  <div className="bg-warning text-light">{PLabel[i / 5]}</div>{" "}
                  {/* <div>{correctList[1]}</div> */}
                </div>
                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">Judgment</div>{" "}
                  <div>{result[i + 3]}</div>
                </div>
                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">
                    Measurement leak (mL / min)
                  </div>{" "}
                  <div>{result[i + 4]}</div>
                </div>

                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">
                    Correction (mL / min)
                  </div>{" "}
                  <div>{result[i + 5]}</div>
                </div>
                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">Test pressure(kPa)</div>{" "}
                  <div>{result[i + 6]}</div>
                </div>
                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">K (Ve) value (mL)</div>{" "}
                  <div>{result[i + 7]}</div>
                </div>
              </div>
            );
            plug2to5.push(el);
          }
        }

        display_B5_OP235 =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div>
            <div className="h6 mb-2">Block Leak Testing Details</div>
            <div className="d-flex flex-row flex-wrap gap-2">
              <div className="d-flex flex-column dt2 ">
                <div className="dt1f1 text-center bg-dark text-light ">
                  Model
                </div>{" "}
                <div className="dt1f1 text-center">{result[1].model}</div>
              </div>

              <div className="d-flex flex-column dt2 ">
                <div className="dt1f1 text-center bg-dark text-light ">
                  Lts.
                </div>{" "}
                <div className="dt1f1 text-center">{result[1].lts}</div>
              </div>

              <div className="d-flex flex-column dt2 ">
                <div className="dt1f1 text-center bg-dark text-light ">
                  Judgment
                </div>{" "}
                <div className="dt1f1 text-center">{result[2]}</div>
              </div>
              <div
                className="d-flex flex-column dt2 flex-1 "
                style={{ width: "200px" }}
              >
                <div
                  className="dt1f1 text-center bg-dark text-light "
                  style={{ width: "200px" }}
                >
                  Process Date & Time
                </div>{" "}
                <div className="dt1f1 text-center" style={{ width: "200px" }}>
                  {moment(processNoFiltered[0][8]).format(
                    "DD-MMMM-YYYY HH:mm:ss"
                  )}
                </div>
              </div>

              {/* plug1~6 and SrewPlug */}
              <div>
              {plug2to5}
              </div>
            </div>
            </div>
          );
      //   break;
      // case "FG":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "B7_OP990"
        );

        display_B7_OP990 =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div>
               <div className="h6 mb-2">FG Check </div>
            <div className="d-flex flex-column">
              <div className="d-flex dt2">
                <div className="dt1f1">Process Name</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              {/* <div className="d-flex dt2">
                      <div className="dt1f1">Data</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][1]}</div>
                    </div> */}
              <div className="d-flex dt2">
                <div className="dt1f1">FG Date</div>{" "}
                <div className="dt1f2">
                  {moment(processNoFiltered[0][8]).format(
                    "DD-MMMM-YYYY HH:mm:ss"
                  )}
                </div>
              </div>
            </div>
            </div>
          );
  //       break;
  //     default:
  //       display = null;
  //       break;
  //   }
  // } 
  // else if (subSection === "Head Cylinder") {
  //   switch (processNo) {
  //     case "OP05":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "H1_Material input/engraving"
        );

        display_H1_Material_input_engraving =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column dt1">
              <div className="h6 mb-2">H1_Material input/engraving - Engraving Details</div>
              <div className="d-flex ">
                <div className="dt1f1">Name</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              <div className="d-flex ">
                <div className="dt1f1">Casting No.</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][1].slice(16)}</div>
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
      //   break;
      // case "OP50":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "H2_OP050"
        );
        if (processNoFiltered != undefined && processNoFiltered.length > 0) {
          let result = decodeHead50(processNoFiltered[0][1]);
          var headOP50Elements = [];
          if (result.length > 0) {
            for (let i = 22; i < 30; i++) {
              headOP50Elements.push(
                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">
                    T{i - 21} (0.001g/sec)
                  </div>
                  <div>{result[i]}</div>
                </div>
              );
            }
          }
        }
        display_H2_OP050 =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div>
                 <div className="h6 mb-2">H2_OP050-Lazer Clading</div>
            <div className="d-flex flex-row gap-3">
           
              <div className="d-flex flex-row">
                
                <div className="d-flex flex-row flex-wrap">
                  <div className="d-flex flex-column flex-wrap dt3">
                    <div>Process Name</div> <div>{processNoFiltered[0][5]}</div>
                  </div>

                  <div className="d-flex flex-column flex-wrap dt3">
                    <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                  </div>
                </div>
              </div>
              <div className="gap-0 d-flex flex-column " style={{width:"max-content"}}>
                <div className="border border-dark gap-0 font-weight-bold text-center p-1 ">
                  Sheet powder flow rate
                </div>
                <div className="d-flex flex-row">
                  {headOP50Elements}
                </div>
              </div>
            </div>
            </div>
          );
      //   break;
      // case "OP55":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "H3_OP055"
        );
        if (processNoFiltered != undefined && processNoFiltered.length > 0) {
          let result = decodeHead50(processNoFiltered[0][1]);
          var headOP50Elements = [];
          if (result.length > 0) {
            for (let i = 22; i < 30; i++) {
              headOP50Elements.push(
                <div className="d-flex flex-column dt3">
                  <div className="bg-dark text-light">
                    T{i - 21} (0.001g/sec)
                  </div>
                  <div>{result[i]}</div>
                </div>
              );
            }
          }
        }
        display_H3_OP055=
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div>
                  <div className="h6 mb-2">H3_OP055-Lazer Clading</div>
            <div className="d-flex flex-row gap-3">
              <div className="d-flex flex-column">
            
                <div className="d-flex flex-row flex-wrap">
                  <div className="d-flex flex-column flex-wrap dt3">
                    <div>Process Name</div> <div>{processNoFiltered[0][5]}</div>
                  </div>

                  <div className="d-flex flex-column flex-wrap dt3">
                    <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                  </div>
                </div>
              </div>
              <div className="gap-0 d-flex flex-column  "  style={{width:"max-content"}}>
                <div className="border border-dark gap-0 font-weight-bold text-center p-1">
                  Sheet powder flow rate
                </div>
                <div className="d-flex flex-row ">
                  {headOP50Elements}
                </div>
              </div>
            </div>
            </div>
          );
      //   break;

      // case "OP310":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "H5_OP310"
        );
        if (processNoFiltered != undefined && processNoFiltered.length > 0) {
          var H_OP310_list = processNoFiltered[0][1].split(",");
          var f1, correctList;
          if (H_OP310_list.length >= 29) {
            f1 = H_OP310_list[0].slice(16, 17);
            correctList = H_OP310_list.map((item) => parseFloat(item));
          }

          display_H5_OP310 =
            processNoFiltered == undefined ||
            processNoFiltered.length == 0 ? null : (
              <div className="d-flex flex-column">
                <div className="h6 mb-2">H5_OP310 - Leak Testing</div>
                <div className="d-flex flex-row flex-wrap">
                  <div className="d-flex flex-column flex-wrap dt3">
                    <div>Process Name</div> <div>{processNoFiltered[0][5]}</div>
                  </div>

                  <div className="d-flex flex-column flex-wrap dt3">
                    <div>Date</div> <div>{processNoFiltered[0][8]}</div>
                  </div>
                </div>

                <div className="d-flex flex-row flex-wrap mt-2">
                  <div className="d-flex flex-column dt3">
                    <div className="bg-warning text-light">WJ</div>{" "}
                    {/* <div>{correctList[1]}</div> */}
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="d-flex flex-column dt3">Judgment</div>{" "}
                    <div>
                      {f1 == "1"
                        ? "LL NG"
                        : f1 == "2"
                        ? "OK"
                        : f1 == "4"
                        ? "UL NG"
                        : f1 == "9"
                        ? "LL2 NG"
                        : f1 == "D"
                        ? "ERR"
                        : ""}
                    </div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Measurement leak (mL / min)
                    </div>{" "}
                    <div>{correctList[1]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET UL(mL/min)</div>{" "}
                    <div>{correctList[2]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET LL(mL/min)</div>{" "}
                    <div>{correctList[3]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Correction (mL / min)
                    </div>{" "}
                    <div>{correctList[4]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Test pressure(kPa)</div>{" "}
                    <div>{correctList[5]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">K (Ve) value (mL)</div>{" "}
                    <div>{correctList[6]}</div>
                  </div>
                </div>

                <div className="d-flex flex-row flex-wrap mt-2">
                  <div className="d-flex flex-column dt3">
                    <div className="bg-warning text-light">OH</div>{" "}
                    {/* <div>{correctList[1]}</div> */}
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Judgment</div>{" "}
                    <div>
                      {correctList[7].toString() == "1"
                        ? "LL NG"
                        : correctList[7].toString() == "2"
                        ? "OK"
                        : correctList[7].toString() == "4"
                        ? "UL NG"
                        : correctList[7].toString() == "9"
                        ? "LL2 NG"
                        : correctList[7].toString() == "D"
                        ? "ERR"
                        : ""}
                    </div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Measurement leak (mL / min)
                    </div>{" "}
                    <div>{correctList[8]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET UL(mL/min)</div>{" "}
                    <div>{correctList[9]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET LL(mL/min)</div>{" "}
                    <div>{correctList[10]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Correction (mL / min)
                    </div>{" "}
                    <div>{correctList[11]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Test pressure(kPa)</div>{" "}
                    <div>{correctList[12]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">K (Ve) value (mL)</div>{" "}
                    <div>{correctList[13]}</div>
                  </div>
                </div>

                <div className="d-flex flex-row flex-wrap mt-2">
                  <div className="d-flex flex-column dt3">
                    <div className="bg-warning text-light">CC</div>{" "}
                    {/* <div>{correctList[1]}</div> */}
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Judgment</div>{" "}
                    <div>
                      {correctList[14].toString() == "1"
                        ? "LL NG"
                        : correctList[14].toString() == "2"
                        ? "OK"
                        : correctList[14].toString() == "4"
                        ? "UL NG"
                        : correctList[14].toString() == "9"
                        ? "LL2 NG"
                        : correctList[14].toString() == "D"
                        ? "ERR"
                        : ""}
                    </div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Measurement leak (mL / min)
                    </div>{" "}
                    <div>{correctList[15]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET UL(mL/min)</div>{" "}
                    <div>{correctList[16]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET LL(mL/min)</div>{" "}
                    <div>{correctList[17]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Correction (mL / min)
                    </div>{" "}
                    <div>{correctList[18]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Test pressure(kPa)</div>{" "}
                    <div>{correctList[19]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">K (Ve) value (mL)</div>{" "}
                    <div>{correctList[20]}</div>
                  </div>
                </div>

                <div className="d-flex flex-row flex-wrap mt-2">
                  <div className="d-flex flex-column dt3">
                    <div className="bg-warning text-light">EGR</div>{" "}
                    {/* <div>{correctList[1]}</div> */}
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Judgment</div>{" "}
                    <div>
                      {correctList[21].toString() == "1"
                        ? "LL NG"
                        : correctList[21].toString() == "2"
                        ? "OK"
                        : correctList[21].toString() == "4"
                        ? "UL NG"
                        : correctList[21].toString() == "9"
                        ? "LL2 NG"
                        : correctList[21].toString() == "D"
                        ? "ERR"
                        : ""}
                    </div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Measurement leak (mL / min)
                    </div>{" "}
                    <div>{correctList[22]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET UL(mL/min)</div>{" "}
                    <div>{correctList[23]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">DET LL(mL/min)</div>{" "}
                    <div>{correctList[24]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">
                      Correction (mL / min)
                    </div>{" "}
                    <div>{correctList[25]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">Test pressure(kPa)</div>{" "}
                    <div>{correctList[26]}</div>
                  </div>
                  <div className="d-flex flex-column dt3">
                    <div className="bg-dark text-light">K (Ve) value (mL)</div>{" "}
                    <div>{correctList[27]}</div>
                  </div>
                </div>
              </div>
            );
        }
      //   break;
      // case "FG":
        processNoFiltered = processNoALCData?.filter(
          (elements) => elements[5] === "H12_OP990"
        );

        display_H12_OP990 =
          processNoFiltered == undefined ||
          processNoFiltered.length == 0 ? null : (
            <div className="d-flex flex-column">
              <div className="h6 mb-2">H12_OP990 - FG Time Details</div>
              <div className="d-flex dt2">
                <div className="dt1f1">Process Name</div>{" "}
                <div className="dt1f2">{processNoFiltered[0][5]}</div>
              </div>
              {/* <div className="d-flex dt2">
                      <div className="dt1f1">Data</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][1]}</div>
                    </div> */}
              <div className="d-flex dt2">
                <div className="dt1f1">FG Date</div>{" "}
                <div className="dt1f2">
                  {moment(processNoFiltered[0][8]).format(
                    "DD-MMMM-YYYY HH:mm:ss"
                  )}
                </div>
              </div>
            </div>
          );
  //       break;
  //     default:
  //       display = null;
  //       break;
  //   }
  // }

  // else if (subSection === "Crank Shaft") {
  //   switch (processNo) {
  // case "OP02":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C1_Comaterial"
  );

  display_C1_Comaterial =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">C1_Comaterial_OP02 Time Details</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][5]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">FG Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  // break;
  // case "OP140":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C7_Gantry after OP140"
  );

  display_C7_Gantry_after_OP140 =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">C7_Gantry after OP140 Time Details</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][5]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">FG Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  // break;
  // case "OP150 & 170":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C3_OP150_170"
  );

  display_C3_OP150_170 =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
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
  // break;
  // case "170 front Gantry":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C6_OP170 front gantry"
  );

  display_C6_OP170_front_gantry =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">C6_OP170 front gantry- Time Details</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][5]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">FG Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  // break;
  // case "OP220":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C4_OP220"
  );
  // console.log(processNoFiltered[0])
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    let C_OP220_list = processNoFiltered[0][1]?.split(",");
    // console.log(C_OP220_list)

    correctList = C_OP220_list.map((item) => {
      let newItem = item.split("-");
      // console.log(newItem)
      if (newItem.length >= 2) {
        return -1 * newItem[1];
      } else {
        return parseInt(newItem[0]);
      }
    });

    var tt;
    var ttString = (tt = correctList[39]
      .toString()
      .replace(".", "")
      .slice(0, 8));
    if (correctList[1] === 11) {
      tt = ttString.slice(0, 4);
    } else {
      tt = ttString.slice(7, 8) + ttString.slice(0, 4);
    }

    //  console.log( C_OP220_list[2].split("-"))

    display_C4_OP220 =
      processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
        <div className="d-flex flex-column">
          <div className="h6 mb-2">Journal & Pin Diameter & Taper details</div>
          <div className="d-flex flex-row flex-wrap">
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Process Name</div> <div>{processNoFiltered[0][5]}</div>
            </div>
            {/* <div className="d-flex gap-2">
                  <div>Data</div> <div>{correctList}</div>
                </div> */}
            {/* <div className="d-flex gap-2">
                  <div>Serial</div> <div>{correctList[0]}</div>
                </div> */}
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Model</div>{" "}
              <div>
                {correctList[1] === 11
                  ? "Model 1"
                  : correctList[1] === 12
                  ? "Model 2"
                  : correctList[1] === 13
                  ? "Model 3"
                  : ""}
              </div>
              {/* correctList[1]==="11"?"model 1" : (correctList[1]==="12"? "model 2": (correctList[1]==="13"? "model 3": ""))*/}
            </div>

            <div className="d-flex flex-column flex-wrap dt3">
              <div>Date</div> <div>{processNoFiltered[0][8]}</div>
            </div>
          </div>

          <div className="d-flex flex-row flex-wrap mt-2">
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J1 - ⌀1</div>{" "}
              <div>{correctList[2]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J1 - ⌀2</div>{" "}
              <div className="text-center">{correctList[3]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J1 - ⌀3</div>{" "}
              <div>{correctList[4]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J2 - ⌀1</div>{" "}
              <div>{correctList[5]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J2 - ⌀2/</div>{" "}
              <div>{correctList[6]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J2 - ⌀3</div>{" "}
              <div>{correctList[7]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J3 - ⌀1</div>{" "}
              <div>{correctList[8]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J3 - ⌀2</div>{" "}
              <div>{correctList[9]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J3 - ⌀3</div>{" "}
              <div>{correctList[10]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J4 - ⌀3</div>{" "}
              <div>{correctList[11]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J4 - ⌀2</div>{" "}
              <div>{correctList[12]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J4 - ⌀3</div>{" "}
              <div>{correctList[13]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J5 - ⌀1</div>{" "}
              <div>{correctList[14]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J5 - ⌀2</div>{" "}
              <div>{correctList[15]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J5 - ⌀3</div>{" "}
              <div>{correctList[16]}</div>
            </div>
          </div>
          <div className="d-flex flex-row flex-wrap mt-2">
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J1 - Taper</div>{" "}
              <div>{correctList[17]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J2 - Taper</div>{" "}
              <div>{correctList[18]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J3 - Taper</div>{" "}
              <div>{correctList[19]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J4 - Taper</div>{" "}
              <div>{correctList[20]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">J5 - Taper</div>{" "}
              <div>{correctList[21]}</div>
            </div>
          </div>
          <div className="d-flex flex-row flex-wrap mt-2">
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P1 - ⌀1</div>{" "}
              <div>{correctList[22]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P1 - ⌀2</div>{" "}
              <div>{correctList[23]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P1 - ⌀3</div>{" "}
              <div>{correctList[24]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P2 - ⌀1</div>{" "}
              <div>{correctList[25]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P2 - ⌀2</div>{" "}
              <div>{correctList[26]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P2 - ⌀3</div>{" "}
              <div>{correctList[27]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P3 - ⌀1</div>{" "}
              <div>{correctList[28]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P3 - ⌀2</div>{" "}
              <div>{correctList[29]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P3 - ⌀3</div>{" "}
              <div>{correctList[30]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P4 - ⌀1</div>{" "}
              <div>{correctList[31]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P4 - ⌀2</div>{" "}
              <div>{correctList[32]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P4 - ⌀3</div>{" "}
              <div>{correctList[33]}</div>
            </div>
          </div>
          <div className="d-flex flex-row flex-wrap mt-2">
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P1 - Taper</div>{" "}
              <div>{correctList[34]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P2 - Taper</div>{" "}
              <div>{correctList[35]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P3 - Taper</div>{" "}
              <div>{correctList[36]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">P4 - Taper</div>{" "}
              <div>{correctList[37]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Rr Flange ⌀ </div>{" "}
              <div>{correctList[38]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">
                J1～J5 stamped rank value
              </div>{" "}
              <div>{tt}</div>
            </div>
          </div>
        </div>
      );
  }
  // break;

  // case "FG":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C8_OP990"
  );

  display_C8_OP990 =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">C8_OP990-FG Time Details</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][5]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">FG Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  //       break;
  //     default:
  //       display = null;
  //       break;
  //   }
  // }
  // }

  // H5_OP310
  // H2_OP050
  // H3_OP055

  // C3_OP150_170
  // var castingDetails = null;

  // if (processName == "B1_ENGRAVED") {
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "B1_ENGRAVED"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    castingDetails_B1_ENGRAVED = (
      <CastingInformation_B3 castingNo={processNoFiltered[0][1].slice(16)} />
    );
  }
  // }
  // else if (processName == "H1_Material input/engraving") {
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "H1_Material input/engraving"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    castingDetails_H1_Material_input_engraving = (
      <CastingInformation_H3 castingNo={processNoFiltered[0][1].slice(16)} />
    );
  }
  // }
  // else if (section === "Assembly") {
  //   // switch (processName) {
  //   //   case "OP02":
  //   if (
  //     processName == "FuelLeak" ||
  //     processName == "WalterLeak" ||
  //     processName == "OileLeak"
  //   ) {
  processNoFiltered = data?.filter((elements) => elements[17] === "FuelLeak");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_FuelLeak = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Fuel Leak</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Value</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1].slice(75, 84)}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Judgment</div>{" "}
          <div className="dt1f2">
            {processNoFiltered[0][1].slice(84, 85) == "2"
              ? "OK"
              : processNoFiltered[0][1].slice(84, 85) == "1"
              ? "NG"
              : ""}
          </div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "WalterLeak");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_WalterLeak = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Water Leak</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Value</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1].slice(75, 84)}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Judgment</div>{" "}
          <div className="dt1f2">
            {processNoFiltered[0][1].slice(84, 85) == "2"
              ? "OK"
              : processNoFiltered[0][1].slice(84, 85) == "1"
              ? "NG"
              : ""}
          </div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "OileLeak");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_OileLeak = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Oil Leak</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Value</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1].slice(75, 84)}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Judgment</div>{" "}
          <div className="dt1f2">
            {processNoFiltered[0][1].slice(84, 85) == "2"
              ? "OK"
              : processNoFiltered[0][1].slice(84, 85) == "1"
              ? "NG"
              : ""}
          </div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }
  // }
  // else if (processName == "Engine quality information")
  //  {
  processNoFiltered = data?.filter(
    (elements) => elements[17] === "Engine quality information"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    let code = processNoFiltered[0][1].slice(38, 41);
    let lts;
    let customer;
    switch (code) {
      case "101":
        lts = "1.5 Lts. Hydbrid";
        customer = "TKM";
        break;
      case "201":
        lts = "2.0 Lts. Hydbrid";
        customer = "TKM";
        break;
      case "202":
        lts = "2.0 Lts. Conventional";
        customer = "TKM";
        break;
      case "203":
        lts = "2.0 Lts. Hydbrid";
        customer = "TMMIN";
        break;
      case "204":
        lts = "2.0 Lts. Conventional";
        customer = "TMMIN";
        break;
    }
    display = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Engine quality information</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Code</div>
          <div className="dt1f2">{code}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Engine Type</div>
          <div className="dt1f2">{lts}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Customer</div>
          <div className="dt1f2">{customer}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }
  // }
  // else if (
  //   processName == "TEST_ON" ||
  //   processName == "MAIN_ON" ||
  //   processName == "CRANK_ON" ||
  //   processName == "HEADSUB_OFF" ||
  //   processName == "CAMHOUSINGSIB_OFF" ||
  //   processName == "BLOCKSUB_ON"
  // ) {

  processNoFiltered = data?.filter((elements) => elements[17] === "TEST_ON");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_TEST_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">TEST_ON</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "MAIN_ON");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_MAIN_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">MAIN_ON</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "CRANK_ON");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_CRANK_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">CRANK_ON</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "HEADSUB_OFF"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_HEADSUB_OFF = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">HEADSUB_OFF</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }
  // BLOCKSUB_ON
  processNoFiltered = data?.filter(
    (elements) => elements[17] === "BLOCKSUB_ON"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_BLOCKSUB_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">BLOCKSUB_ON</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "CAMHOUSINGSIB_OFF"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_CAMHOUSINGSIB_OFF = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">CAMHOUSINGSIB_OFF</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  // }
  // else if (
  //   processName == "EX cam S / N" ||
  //   processName == "IN cam S / N" ||
  //   processName == "CamHousing S/N" ||
  //   processName == "Head S / N" ||
  //   processName == "Crank S / N" ||
  //   processName == "Block S / N"
  // ) {
  processNoFiltered = data?.filter(
    (elements) => elements[17] === "EX cam S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_EX_cam_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">EX cam S / N</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "IN cam S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_IN_cam_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">IN cam S / N</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "CamHousing S/N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_CamHousing_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">CamHousing S/N</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "Head S / N");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_Head_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Head S / N</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "Crank S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_Crank_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Crank S / N</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "Block S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    display_Block_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Block S / N</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  }
  // }
  // else if (
  //   processName == "HeadboltNR"
  // ) {
  processNoFiltered = data?.filter((elements) => elements[17] === "HeadboltNR");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    let result = decodeAssyHeadBoltNR(processNoFiltered[0][1]);
    var headNRElements = [];
    if (result.length > 0) {
      for (let i = 0; i < 10; i++) {
        headNRElements.push(
          <div className="d-flex flex-column dt3 ">
            <div className="bg-dark text-light text-center">
              Torque #{i + 1}
            </div>
            <div className="text-center">{result[i]}</div>
          </div>
        );
      }
    }
  }

  display_HeadboltNR =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div>
        <div className="h6 mb-2">Head Bolt Nutrunner </div>
      <div className="d-flex flex-row gap-3">
        <div className="d-flex flex-column">
          {/* <div className="h6 mb-2">Head Bolt Nutrunner</div> */}
          <div className="d-flex flex-row flex-wrap">
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Process Name</div> <div className="text-start">Date</div>
            </div>

            <div className="d-flex flex-column flex-wrap dt3">
              <div className=" ">Head Bolt Nutrunner</div>
              <div>
                {moment(processNoFiltered[0][21]).format(
                  "DD-MMMM-YYYY HH:mm:ss"
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="gap-0 d-flex flex-column ">
          <div className="border border-dark gap-0 font-weight-bold text-center p-1">
            Nutrunner Torque data
          </div>
          <div className="d-flex flex-row flex-wrap">{headNRElements}</div>
        </div>
      </div>
      </div>
    );

  // } else if ("p" == "p") {
  //   processNoFiltered = data?.filter(
  //     (elements) => elements[17] === processName
  //   );
  //   if (processNoFiltered != undefined && processNoFiltered.length > 0) {
  //     display = (
  //       <div className="d-flex flex-column">
  //         <div className="h6 mb-2">Engine quality information</div>
  //         <div className="d-flex dt2">
  //           <div className="dt1f1">Code</div>

  //           <div className="dt1f2">{processNoFiltered[0][1]}</div>
  //         </div>

  //         <div className="d-flex dt2">
  //           <div className="dt1f1">Process Date</div>
  //           <div className="dt1f2">
  //             {moment(processNoFiltered[0][21]).format(
  //               "DD-MMMM-YYYY HH:mm:ss"
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  //     break;
  //   default:
  //     display = null;
  //     break;
  // }
  // }

  return (
    <div className="d-flex flex-column gap-3 mt-3">
      <>{display}</>

      <div className="d-flex flex-row gap-3">
        <>{display_FuelLeak}</>
        <>{display_WalterLeak}</>
        <>{display_OileLeak}</>
      </div>
      <>{display_Engine_quality_information}</>
      <div className="d-flex flex-row gap-3">
        <>{display_TEST_ON}</>
        <>{display_MAIN_ON}</>
        <>{display_CRANK_ON}</>
      </div>
      <div className="d-flex flex-row gap-3">
        <>{display_BLOCKSUB_ON}</>
        <>{display_HEADSUB_OFF}</>
        <>{display_CAMHOUSINGSIB_OFF}</>
      </div>
      <div className="d-flex flex-row gap-3">
        <>{display_EX_cam_S_N}</>
        <>{display_IN_cam_S_N}</>
        <>{display_CamHousing_S_N}</>
      </div>
      <div className="d-flex flex-row gap-3">
        <>{display_Head_S_N}</>
        <>{display_Crank_S_N}</>
        <>{display_Block_S_N}</>
      </div>
      <>{display_HeadboltNR}</>

      <div className="d-flex flex-row gap-3">
      <>{display_B1_ENGRAVED}</> 
      <>{castingDetails_B1_ENGRAVED}</>
      <>{display_B4_Finishing_gantry}</>   
      <>{display_B7_OP990}</>
      </div>
      <>{display_B3_OP190}</>     
      <>{display_B5_OP235}</>
     
      <div className="d-flex flex-row gap-3">
      <>{display_H1_Material_input_engraving}</>
      <>{castingDetails_H1_Material_input_engraving}</>
      <>{display_H12_OP990}</>
      </div>
      <>{display_H2_OP050}</>
      <>{display_H3_OP055}</>
      <>{display_H5_OP310}</>
     

      <div className="d-flex flex-row gap-3">
      <>{display_C1_Comaterial}</>
      <>{display_C7_Gantry_after_OP140}</>      
      <>{display_C6_OP170_front_gantry}</>
      <>{display_C8_OP990}</>
      </div>

      <>{display_C3_OP150_170}</>
      <>{display_C4_OP220}</>
      
      
      
    </div>
  );
}

export default EntireResultProcess;


