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
import { decode_C_150_170 } from "./processDetails/func_C_150_170";
import { decodeAssyHeadBoltNR } from "./processDetails/func_A_HeadBoltNR";
import ExcelJS from "exceljs";
import CrankInfo from "../crank/CrankInfo";
import ImpactWrenchTable from "../impact_wrench/ImpactWrenchData";
import YokotaToolTable from "../yokota_tools/YokotaToolData";
import PTTable from "../part_traceability/pt_table";

function EntireResultProcess({crankinfo, engineNo, triggerSearch }) {

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
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Cylinder_Block_Engraving_Details = [
      processNoFiltered[0][1]?.slice(16),
      moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
  }
  



  display_B1_ENGRAVED =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column dt1">
        <div className="h6 mb-2">Cylinder Block Engraving Details</div>
        <div className="d-flex ">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">TIEI Engraving</div>
        </div>
        <div className="d-flex ">
          <div className="dt1f1">Ahresty Casting No.</div>{" "}
          <div className="dt1f2">{T_Cylinder_Block_Engraving_Details[0]}</div>
        </div>
        <div className="d-flex ">
          <div className="dt1f1">Engraving Date & Time</div>{" "}
          <div className="dt1f2">{T_Cylinder_Block_Engraving_Details[1]}</div>
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
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">
          Block OP190 - Journal diameter Measurement in microns
        </div>
        {/* <div className="d-flex ">
                  <div className="dt1f1">Process No.</div>{" "}
                  <div className="dt1f2">{processNoFiltered[0][5]}</div>
                </div> */}
        <div className="d-flex  ">
          <div className="d-flex flex-column dt2 ">
            <div className="dt1f1 text-center bg-dark text-light ">J1</div>{" "}
            <div className="dt1f1 text-center">
              {parseInt(op190Data[7].slice(0, 6)) * 0.0001}
            </div>
          </div>
          <div className="d-flex flex-column dt2">
            <div className="dt1f1 text-center bg-dark text-light ">J2</div>{" "}
            <div className="dt1f1 text-center">
              {parseInt(op190Data[8].slice(0, 6))}
            </div>
          </div>
          <div className="d-flex flex-column dt2">
            <div className="dt1f1 text-center bg-dark text-light ">J3</div>{" "}
            <div className="dt1f1 text-center">
              {parseInt(op190Data[9].slice(0, 6))}
            </div>
          </div>
          <div className="d-flex flex-column dt2">
            <div className="dt1f1 text-center bg-dark text-light ">J4</div>{" "}
            <div className="dt1f1 text-center">
              {parseInt(op190Data[10].slice(0, 6))}
            </div>
          </div>
          <div className="d-flex flex-column dt2">
            <div className="dt1f1 text-center bg-dark text-light ">J5</div>{" "}
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

    var T_OP_195A_B_Machining_Time = [
      op195Data == "0011" ? "OP195A" : op195Data == "0012" ? "OP195B" : "",
      moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
  }
  display_B4_Finishing_gantry =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div>
        <div className="h6 mb-2">OP-195A/B Machining Time </div>
        <div className="d-flex flex-column">
          <div className="d-flex  dt2">
            <div className="dt1f1">Process Name</div>{" "}
            <div className="dt1f2">Top Face/Datum Hole Machining</div>
          </div>
          <div className="d-flex  dt2">
            <div className="dt1f1">Machine</div>{" "}
            <div className="dt1f2">{T_OP_195A_B_Machining_Time[0]}</div>
          </div>
          <div className="d-flex  dt2">
            <div className="dt1f1">Date & Time</div>{" "}
            <div className="dt1f2">{T_OP_195A_B_Machining_Time[1]}</div>
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
    var PLabel = [
      "Plug1 ",
      "Plug2 ",
      "Plug3 ",
      "Plug4 ",
      "Plug5 ",
      "Plug6 ",
      "",
      "ScrewPlug ",
    ];
    for (let i = 0; i < 40; i += 5) {
      if (i === 30) {
        continue;
      }
      let el = (
        <div className="d-flex flex-row flex-wrap mb-2" key={i}>
          <div className="d-flex flex-column dt3">
            <div className="bg-warning text-light">{PLabel[i / 5]}</div>{" "}
            {/* <div>{correctList[1]}</div> */}
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">Judgement</div>{" "}
            <div>{result[i + 3]}</div>
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">Leak Value(mL / min)</div>{" "}
            <div>{result[i + 4]}</div>
          </div>

          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">Correction (mL / min)</div>{" "}
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
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div>
        <div className="h6 mb-2">Block OP235 - Leak Testing Details</div>
        <div>
          <div className="d-flex flex-row flex-wrap gap-2">
            <div className="d-flex flex-column dt2 ">
              <div className="dt1f1 text-center bg-dark text-light ">Model</div>{" "}
              <div className="dt1f1 text-center">{result[1].model}</div>
            </div>

            <div className="d-flex flex-column dt2 ">
              <div className="dt1f1 text-center bg-dark text-light ">
                Variant
              </div>{" "}
              <div className="dt1f1 text-center">{result[1].lts}</div>
            </div>

            <div className="d-flex flex-column dt2 ">
              <div className="dt1f1 text-center bg-dark text-light ">
                Judgement
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
                Leak Test Date & Time
              </div>{" "}
              <div className="dt1f1 text-center" style={{ width: "200px" }}>
                {moment(processNoFiltered[0][8]).format(
                  "DD-MMMM-YYYY HH:mm:ss"
                )}
              </div>
            </div>
          </div>
          <div className="mt-2 h6">Block Plug Leak Values</div>
          <div className="mt-2 ">
            {/* plug1~6 and SrewPlug */}
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
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div>
        <div className="h6 mb-2">Block FG Date & Time</div>
        <div className="d-flex flex-column">
          <div className="d-flex dt2">
            <div className="dt1f1">Process Name</div>{" "}
            <div className="dt1f2" style={{ width: "150px" }}>
              FG Scanning
            </div>
          </div>
          {/* <div className="d-flex dt2">
                      <div className="dt1f1">Data</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][1]}</div>
                    </div> */}
          <div className="d-flex dt2">
            <div className="dt1f1"> FG Date & Time</div>{" "}
            <div className="dt1f2" style={{ width: "150px" }}>
              {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
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
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column dt1">
        <div className="h6 mb-2">Cylinder Head Engraving Details</div>
        <div className="d-flex ">
          <div className="dt1f1">Name</div>{" "}
          <div className="dt1f2">TIEI Engraving</div>
        </div>
        <div className="d-flex ">
          <div className="dt1f1">Part Number</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1].slice(0, 16)}</div>
        </div>
        <div className="d-flex ">
          <div className="dt1f1">Casting No.</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1].slice(16)}</div>
        </div>
        <div className="d-flex ">
          <div className="dt1f1">Engraving Date & Time</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
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
          <div className="d-flex flex-column dt3" key={i}>
            <div className="bg-dark text-light">T{i - 21} (0.001g/sec)</div>
            <div>{result[i]}</div>
          </div>
        );
      }
    }
  }
  display_H2_OP050 =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div>
        <div className="h6 mb-2">OP050-Laser Clading Details</div>
        <div className="d-flex flex-row gap-3">
          <div className="d-flex flex-row">
            <div className="d-flex flex-row flex-wrap">
              <div className="d-flex flex-column flex-wrap dt3">
                <div>Process Name</div> <div>{processNoFiltered[0][5]}</div>
              </div>

              <div className="d-flex flex-column flex-wrap dt3">
                <div>Laser Clading</div>{" "}
                <div>
                  {moment(processNoFiltered[0][8]).format(
                    "DD-MMMM-YYYY HH:mm:ss"
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="gap-0 d-flex flex-column "
            style={{ width: "max-content" }}
          >
            <div className="border border-dark gap-0 font-weight-bold text-center p-1 ">
              Laser clad powder flow rate
            </div>
            <div className="d-flex flex-row">{headOP50Elements}</div>
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
          <div className="d-flex flex-column dt3" key={i}>
            <div className="bg-dark text-light">T{i - 21} (0.001g/sec)</div>
            <div>{result[i]}</div>
          </div>
        );
      }
    }
  }
  display_H3_OP055 =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div>
        <div className="h6 mb-2">OP055-Laser Clading Details</div>
        <div className="d-flex flex-row gap-3">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row flex-wrap">
              <div className="d-flex flex-column flex-wrap dt3">
                <div>Process Name</div> <div>{processNoFiltered[0][5]}</div>
              </div>

              <div className="d-flex flex-column flex-wrap dt3">
                <div>Laser Clading</div>{" "}
                <div>
                  {moment(processNoFiltered[0][8]).format(
                    "DD-MMMM-YYYY HH:mm:ss"
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="gap-0 d-flex flex-column  "
            style={{ width: "max-content" }}
          >
            <div className="border border-dark gap-0 font-weight-bold text-center p-1">
              Laser clad powder flow rate
            </div>
            <div className="d-flex flex-row ">{headOP50Elements}</div>
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
      processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
        <div className="d-flex flex-column">
          <div className="h6 mb-2">OP310 - Leak Testing Details</div>
          <div className="d-flex flex-row flex-wrap">
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Process Name</div> <div>Leak Test Date & Time</div>
            </div>

            <div className="d-flex flex-column flex-wrap dt3">
              <div>Leak Test</div>{" "}
              <div>
                {moment(processNoFiltered[0][8]).format(
                  "DD-MMMM-YYYY HH:mm:ss"
                )}
              </div>
            </div>
          </div>

          <div className="d-flex flex-row flex-wrap mt-2">
            <div className="d-flex flex-column dt3">
              <div className="bg-warning text-light" style={{ width: "120px" }}>
                Water Jacket{" "}
              </div>{" "}
              {/* <div>{correctList[1]}</div> */}
            </div>
            <div className="d-flex flex-column dt3">
              <div className="d-flex flex-column dt3 bg-dark text-light">
                Judgement
              </div>{" "}
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
              <div className="bg-dark text-light">Leak Value(mL / min)</div>{" "}
              <div>{correctList[1]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Upper Limit)</div>{" "}
              <div>{correctList[2]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Lower Limit)</div>{" "}
              <div>{correctList[3]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Correction (mL / min)</div>{" "}
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
              <div className="bg-warning text-light" style={{ width: "120px" }}>
                Oil Hole
              </div>{" "}
              {/* <div>{correctList[1]}</div> */}
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Judgement</div>{" "}
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
              <div className="bg-dark text-light">Leak Value(mL / min)</div>{" "}
              <div>{correctList[8]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Upper Limit)</div>{" "}
              <div>{correctList[9]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Lower Limit)</div>{" "}
              <div>{correctList[10]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Correction (mL / min)</div>{" "}
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
              <div className="bg-warning text-light" style={{ width: "120px" }}>
                Cam Case{" "}
              </div>{" "}
              {/* <div>{correctList[1]}</div> */}
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Judgement</div>{" "}
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
              <div className="bg-dark text-light">Leak Value(mL / min)</div>{" "}
              <div>{correctList[15]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Upper Limit)</div>{" "}
              <div>{correctList[16]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Lower Limit)</div>{" "}
              <div>{correctList[17]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Correction (mL / min)</div>{" "}
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
              <div className="bg-warning text-light" style={{ width: "120px" }}>
                EGR
              </div>{" "}
              {/* <div>{correctList[1]}</div> */}
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Judgement</div>{" "}
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
              <div className="bg-dark text-light">Leak Value(mL / min)</div>{" "}
              <div>{correctList[22]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Upper Limit)</div>{" "}
              <div>{correctList[23]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">STD(Lower Limit)</div>{" "}
              <div>{correctList[24]}</div>
            </div>
            <div className="d-flex flex-column dt3">
              <div className="bg-dark text-light">Correction (mL / min)</div>{" "}
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
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2"> Head FG Date & Time </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">FG Scanning</div>
        </div>
        {/* <div className="d-flex dt2">
                      <div className="dt1f1">Data</div>{" "}
                      <div className="dt1f2">{processNoFiltered[0][1]}</div>
                    </div> */}
        <div className="d-flex dt2">
          <div className="dt1f1">FG Date & Time</div>{" "}
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

  // else if (subSection === "Crank Shaft") {
  //   switch (processNo) {
  // case "OP02":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C1_Comaterial"
  );

  display_C1_Comaterial =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Crank Shaft Engraving Details</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">TIEI Engraving</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Part Number</div>{" "}
          <div className="dt1f2">{processNoFiltered[0][1].slice(0, 16)}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Engraving Date & Time</div>{" "}
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
        <div className="h6 mb-2">P140 Journal Grinding Exit Time</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">Balancing</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
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
        <div className="h6 mb-2">Induction Hardening Entry Time</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">Induction Hardening</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">
            {moment(processNoFiltered[0][8]).format("DD-MMMM-YYYY HH:mm:ss")}
          </div>
        </div>
      </div>
    );
  // break;
  // case "OP150_170":
  processNoFiltered = processNoALCData?.filter(
    (elements) => elements[5] === "C3_OP150_170"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var result = decode_C_150_170(processNoFiltered[0][1]);

    var crankOP150_170_Elements = [];
    var PLabel = [
      "1st CW",
      "2nd CW",
      "3rd CW",
      "4th CW",
      "5th CW",
      "6th CW",
      "7th CW",
      "8th CW",
      "Initial",
      "Final",
    ];
    for (let i = 0; i < 32; i += 4) {
      let el = (
        <div className="d-flex flex-row flex-wrap mt-2" key={i}>
          <div className="d-flex flex-column dt3">
            <div className="bg-warning text-light" style={{ minWidth: "70px" }}>
              {PLabel[i / 4]}
            </div>{" "}
            {/* <div>{correctList[1]}</div> */}
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              1st hole Hole angle (0.1 °)
            </div>{" "}
            <div>{result[i + 3]}</div>
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              1st hole Hole depth (0.1mm)
            </div>{" "}
            <div>{result[i + 4]}</div>
          </div>

          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              1st hole Hole depth (0.1mm)
            </div>{" "}
            <div>{result[i + 5]}</div>
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              2nd hole Hole depth (0.1mm)
            </div>{" "}
            <div>{result[i + 6]}</div>
          </div>
        </div>
      );
      crankOP150_170_Elements.push(el);
    }

    for (let i = 32; i < 40; i += 4) {
      let el = (
        <div className="d-flex flex-row flex-wrap mt-2" key={i}>
          <div className="d-flex flex-column dt3">
            <div className="bg-warning text-light" style={{ minWidth: "70px" }}>
              {PLabel[i / 4]}
            </div>{" "}
            {/* <div>{correctList[1]}</div> */}
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">1-sided measure (0.1 gcm)</div>{" "}
            <div>{result[i + 3]}</div>
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              two-sided measure (0.1 gcm)
            </div>{" "}
            <div>{result[i + 4]}</div>
          </div>

          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              1-sided measurement angle (0.1 °)
            </div>{" "}
            <div>{result[i + 5]}</div>
          </div>
          <div className="d-flex flex-column dt3">
            <div className="bg-dark text-light">
              two-sided measurement angle (0.1 °)
            </div>{" "}
            <div>{result[i + 6]}</div>
          </div>
        </div>
      );
      crankOP150_170_Elements.push(el);
    }
  }

  display_C3_OP150_170 =
    processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
      <div className="d-flex flex-column gap-3">
        <div className="d-flex flex-column">
          <div className="h6 mb-2">
            Crank OP 150 & 170 Final Balancing Details
          </div>
          <div className="d-flex flex-row flex-wrap">
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Process Name</div> <div>Balancing</div>
            </div>

            <div className="d-flex flex-column flex-wrap dt3">
              <div>Date & Time</div>{" "}
              <div>
                {" "}
                {moment(processNoFiltered[0][8]).format(
                  "DD-MMMM-YYYY HH:mm:ss"
                )}
              </div>
            </div>
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Process No</div> <div>{result[1]}</div>
            </div>
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Model</div>{" "}
              <div>
                {result[2] == "Model3"
                  ? "2 lts."
                  : result[2] == "Model1"
                  ? "1.5 lts."
                  : ""}
              </div>
            </div>
          </div>
        </div>
        <div className="gap-0 d-flex flex-column ">
          {/* <div className="d-flex flex-row flex-wrap"> */}
          {crankOP150_170_Elements}
          {/* </div> */}
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
          <div className="h6 mb-2">
            OP220 Journal & Pin Diameter & Taper details
          </div>
          <div className="d-flex flex-row flex-wrap">
            <div className="d-flex flex-column flex-wrap dt3">
              <div>Process Name</div> <div>Diameter Measurement</div>
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
                  ? "1.5 Lts."
                  : correctList[1] === 12
                  ? "Model 2"
                  : correctList[1] === 13
                  ? "2 Lts."
                  : ""}
              </div>
              {/* correctList[1]==="11"?"model 1" : (correctList[1]==="12"? "model 2": (correctList[1]==="13"? "model 3": ""))*/}
            </div>

            <div className="d-flex flex-column flex-wrap dt3">
              <div>Date & Time</div>{" "}
              <div>
                {moment(processNoFiltered[0][8]).format(
                  "DD-MMMM-YYYY HH:mm:ss"
                )}
              </div>
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
        <div className="h6 mb-2">Crank FG Date & Time</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Name</div>{" "}
          <div className="dt1f2">FG Scanning</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">FG Date & Time</div>{" "}
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
    var T_Fuel_Leak = [
      processNoFiltered[0][1].slice(75, 84),
      processNoFiltered[0][1].slice(84, 85) == "2"
        ? "OK"
        : processNoFiltered[0][1].slice(84, 85) == "1"
        ? "NG"
        : "",
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_FuelLeak = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Fuel Leak (Std &plusmn;4ml)</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Leak Value</div>{" "}
          <div className="dt1f2">{T_Fuel_Leak[0]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Judgement</div>{" "}
          <div className="dt1f2">{T_Fuel_Leak[1]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Fuel_Leak[2]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "WalterLeak");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Water_Leak = [
      processNoFiltered[0][1].slice(75, 84),
      processNoFiltered[0][1].slice(84, 85) == "2"
        ? "OK"
        : processNoFiltered[0][1].slice(84, 85) == "1"
        ? "NG"
        : "",
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_WalterLeak = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Water Leak (Std &plusmn;6ml)</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Leak Value</div>{" "}
          <div className="dt1f2">{T_Water_Leak[0]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Judgement</div>{" "}
          <div className="dt1f2">{T_Water_Leak[1]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Water_Leak[2]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "OileLeak");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Oil_Leak = [
      processNoFiltered[0][1].slice(75, 84),
      processNoFiltered[0][1].slice(84, 85) == "2"
        ? "OK"
        : processNoFiltered[0][1].slice(84, 85) == "1"
        ? "NG"
        : "",
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_OileLeak = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Oil Leak (Std &plusmn;15ml)</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Leak Value</div>{" "}
          <div className="dt1f2">{T_Oil_Leak[0]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Judgement</div>{" "}
          <div className="dt1f2">{T_Oil_Leak[1]}</div>
        </div>
        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Oil_Leak[2]}</div>
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
    // b3="Engine quality information"
    // b4="Variant"
    // b5="Engine Type"
    // c4=code
    var T_Engine_information = [
      code,
      lts,
      customer,
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];

    display = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Engine quality information</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Variant</div>
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
          <div className="dt1f1">Process Date & Time</div>
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
    var T_Engine_Testing_Entry = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_TEST_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Engine Testing (ET) Entry Time</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Engine_Testing_Entry[0]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "MAIN_ON");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Main_Line_1_Entry = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_MAIN_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Main Line 1 (MK1) Entry Time</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Main_Line_1_Entry[0]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "CRANK_ON");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Crank_Assembly_Time = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_CRANK_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Crank Assembly Time</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Crank_Assembly_Time[0]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "HEADSUB_OFF"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Head_Feeding_to_MK1_Time = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_HEADSUB_OFF = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Head Feeding to MK1 Time</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Head_Feeding_to_MK1_Time[0]}</div>
        </div>
      </div>
    );
  }
  // BLOCKSUB_ON
  processNoFiltered = data?.filter(
    (elements) => elements[17] === "BLOCKSUB_ON"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Block_Feeding_Time = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_BLOCKSUB_ON = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Block Feeding Time</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Block_Feeding_Time[0]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "CAMHOUSINGSIB_OFF"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Cam_Housing_Feeding_to_MK1_Time = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_CAMHOUSINGSIB_OFF = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Cam Housing Feeding to MK1 Time</div>
        {/* <div className="d-flex dt2">
              <div className="dt1f1">Code</div>{" "}
          
              <div className="dt1f2">{processNoFiltered[0][1]}</div>
            </div> */}

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Cam_Housing_Feeding_to_MK1_Time[0]}</div>
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
    var T_Exhaust_Camshaft_Serial_No = [
      processNoFiltered[0][1],
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_EX_cam_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Exhaust Camshaft Serial No.</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{T_Exhaust_Camshaft_Serial_No[0]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Exhaust_Camshaft_Serial_No[1]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "IN cam S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Intake_Camshaft_Serial_No = [
      processNoFiltered[0][1],
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_IN_cam_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Intake Camshaft Serial No.</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{T_Intake_Camshaft_Serial_No[0]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Intake_Camshaft_Serial_No[1]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "CamHousing S/N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Camhousing_Serial_No = [
      processNoFiltered[0][1],
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_CamHousing_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Camhousing Serial No.</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{T_Camhousing_Serial_No[0]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Camhousing_Serial_No[1]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter((elements) => elements[17] === "Head S / N");
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Cylinder_Head_Serial_No = [
      processNoFiltered[0][1],
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_Head_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Cylinder Head Serial No.</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{T_Cylinder_Head_Serial_No[0]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Cylinder_Head_Serial_No[1]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "Crank S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_CrankShaft_Serial_No = [
      processNoFiltered[0][1],
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_Crank_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">CrankShaft Serial No.</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{T_CrankShaft_Serial_No[0]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_CrankShaft_Serial_No[1]}</div>
        </div>
      </div>
    );
  }

  processNoFiltered = data?.filter(
    (elements) => elements[17] === "Block S / N"
  );
  if (processNoFiltered != undefined && processNoFiltered.length > 0) {
    var T_Cylinder_Block_Serial_No = [
      processNoFiltered[0][1],
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
    ];
    display_Block_S_N = (
      <div className="d-flex flex-column">
        <div className="h6 mb-2">Cylinder Block Serial No.</div>
        <div className="d-flex dt2">
          <div className="dt1f1">Serial no.</div>{" "}
          <div className="dt1f2">{T_Cylinder_Block_Serial_No[0]}</div>
        </div>

        <div className="d-flex dt2">
          <div className="dt1f1">Process Date & Time</div>{" "}
          <div className="dt1f2">{T_Cylinder_Block_Serial_No[1]}</div>
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
          <div className="d-flex flex-column dt3 " key={i}>
            <div className="bg-dark text-light text-center">
              Torque #{i + 1}
            </div>
            <div className="text-center">{result[i]}</div>
          </div>
        );
      }
    }
    var headNRElements_excel_Heading = [];
    if (result.length > 0) {
      for (let i = 0; i < 10; i++) {
        headNRElements_excel_Heading.push(`Torque #${i + 1}`);
      }
    }
    var headNRElements_excel_Data = [];
    if (result.length > 0) {
      for (let i = 0; i < 10; i++) {
        headNRElements_excel_Data.push(result[i]);
      }
    }

    var T_Head_Bolt_Nut_Runner_Torque = [
      moment(processNoFiltered[0][21]).format("DD-MMMM-YYYY HH:mm:ss"),
      ...headNRElements_excel_Data,
    ];
    display_HeadboltNR =
      processNoFiltered == undefined || processNoFiltered.length == 0 ? null : (
        <div>
          <div className="h6 mb-2">Head Bolt Nut Runner Torque </div>
          <div className="d-flex flex-row gap-0">
            <div className="d-flex flex-column">
              {/* <div className="h6 mb-2">Head Bolt Nutrunner</div> */}
              <div className="d-flex flex-row flex-wrap">
                <div className="d-flex flex-column flex-wrap dt3">
                  <div>Process Name</div>{" "}
                  <div className="text-start">Date & Time</div>
                </div>

                <div className="d-flex flex-column flex-wrap dt3">
                  <div className=" ">Head Bolt Nut Runner</div>
                  <div>{T_Head_Bolt_Nut_Runner_Torque[0]}</div>
                </div>
              </div>
            </div>
            <div className="gap-0 d-flex flex-column ">
              <div className="border border-dark gap-0 font-weight-bold text-center p-1">
                Nut Runner Torque data
              </div>
              <div className="d-flex flex-row flex-wrap">{headNRElements}</div>
            </div>
          </div>
        </div>
      );
  }

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
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("yousuf");

    // const data1 = ["a1", "b1"];
    // const data2 = [[1, 2], [3, 4]];

    // Set the value of cell 'C1'

    // worksheet.getCell("B4").value = b4;
    // worksheet.getCell("B5").value = b5;
    // worksheet.getCell("C4").value = c4;

    //     for(let i = 0; i<10; i++){
    //       worksheet.getCell(9 +i,12).value = `apple ${i*10}`;
    // }
    // // Add the remaining data
    worksheet.getCell("B3").value = "Engine quality information";
    worksheet.addTable({
      name: "T_Engine_information",
      ref: "B4", // Start data from A2 to allow space for the table header
      columns: [
        { name: "Variant" },
        { name: "Engine Type" },
        { name: "Customer" },
        { name: "Process Date & Time" },
      ],
      rows: [T_Engine_information],
    });

    worksheet.getCell("B7").value = "Fuel Leak";
    worksheet.addTable({
      name: "T_Fuel_Leak",
      ref: "B8", // Start data from A2 to allow space for the table header
      columns: [
        { name: "Leak Value" },
        { name: "Judgement" },
        { name: "Process Date & Time" },
      ],
      rows: [T_Fuel_Leak],
    });

    worksheet.getCell("B11").value = "Water Leak";
    worksheet.addTable({
      name: "T_Water_Leak",
      ref: "B12", // Start data from A2 to allow space for the table header
      columns: [
        { name: "Leak Value" },
        { name: "Judgement" },
        { name: "Process Date & Time" },
      ],
      rows: [T_Water_Leak],
    });

    worksheet.getCell("B15").value = "Oil Leak";
    worksheet.addTable({
      name: "T_Oil_Leak",
      ref: "B16", // Start data from A2 to allow space for the table header
      columns: [
        { name: "Leak Value" },
        { name: "Judgement" },
        { name: "Process Date & Time" },
      ],
      rows: [T_Oil_Leak],
    });

    worksheet.getCell("B20").value = "Engine Testing (ET) Entry";
    worksheet.addTable({
      name: "T_Engine_Testing_Entry",
      ref: "B21", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }],
      rows: [T_Engine_Testing_Entry],
    });

    worksheet.getCell("D20").value = "Main Line 1 (MK1) Entry";
    worksheet.addTable({
      name: "T_Main_Line_1_Entry",
      ref: "D21", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }],
      rows: [T_Main_Line_1_Entry],
    });

    worksheet.getCell("F20").value = "Crank Assembly Time";
    worksheet.addTable({
      name: "T_Crank_Assembly_Time",
      ref: "F21", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }],
      rows: [T_Crank_Assembly_Time],
    });

    worksheet.getCell("B24").value = "Block Feeding Time";
    worksheet.addTable({
      name: "T_Block_Feeding_Time",
      ref: "B25", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }],
      rows: [T_Block_Feeding_Time],
    });

    worksheet.getCell("D24").value = "Head Feeding to MK1 Time";
    worksheet.addTable({
      name: "T_Head_Feeding_to_MK1_Time",
      ref: "D25", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }],
      rows: [T_Head_Feeding_to_MK1_Time],
    });

    worksheet.getCell("F24").value = "Cam Housing Feeding to MK1 Time";
    worksheet.addTable({
      name: "T_Cam_Housing_Feeding_to_MK1_Time",
      ref: "F25", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }],
      rows: [T_Cam_Housing_Feeding_to_MK1_Time],
    });

    worksheet.getCell("B28").value = "Exhaust Camshaft Serial No.";
    worksheet.addTable({
      name: "T_Exhaust_Camshaft_Serial_No",
      ref: "B29", // Start data from A2 to allow space for the table header
      columns: [{ name: "Serial No." }, { name: "Process Date & Time" }],
      rows: [T_Exhaust_Camshaft_Serial_No],
    });

    worksheet.getCell("E28").value = "Intake Camshaft Serial No";
    worksheet.addTable({
      name: "T_Intake_Camshaft_Serial_No",
      ref: "E29", // Start data from A2 to allow space for the table header
      columns: [{ name: "Serial No." }, { name: "Process Date & Time" }],
      rows: [T_Intake_Camshaft_Serial_No],
    });

    worksheet.getCell("H28").value = "Camhousing Serial No.";
    worksheet.addTable({
      name: "T_Camhousing_Serial_No",
      ref: "H29", // Start data from A2 to allow space for the table header
      columns: [{ name: "Serial No." }, { name: "Process Date & Time" }],
      rows: [T_Camhousing_Serial_No],
    });

    worksheet.getCell("B31").value = "Cylinder Head Serial No.";
    worksheet.addTable({
      name: "T_Cylinder_Head_Serial_No",
      ref: "B32", // Start data from A2 to allow space for the table header
      columns: [{ name: "Serial No." }, { name: "Process Date & Time" }],
      rows: [T_Cylinder_Head_Serial_No],
    });

    worksheet.getCell("E31").value = "CrankShaft Serial No.";
    worksheet.addTable({
      name: "T_CrankShaft_Serial_No",
      ref: "E32", // Start data from A2 to allow space for the table header
      columns: [{ name: "Serial No." }, { name: "Process Date & Time" }],
      rows: [T_CrankShaft_Serial_No],
    });

    worksheet.getCell("H31").value = "Cylinder Block Serial No.";
    worksheet.addTable({
      name: "T_Cylinder_Block_Serial_No",
      ref: "H32", // Start data from A2 to allow space for the table header
      columns: [{ name: "Serial No." }, { name: "Process Date & Time" }],
      rows: [T_Cylinder_Block_Serial_No],
    });

    worksheet.getCell("B35").value = "Head Bolt Nut Runner Torque";
    let partHeading = headNRElements_excel_Heading.map((item) => ({
      name: item,
    }));
    worksheet.addTable({
      name: "T_Head_Bolt_Nut_Runner_Torque",
      ref: "B36", // Start data from A2 to allow space for the table header
      columns: [{ name: "Process Date & Time" }, ...partHeading],
      rows: [T_Head_Bolt_Nut_Runner_Torque],
    });

    worksheet.getCell("B39").value = "Cylinder Block Engraving Details";
    worksheet.addTable({
      name: "T_Cylinder_Block_Engraving_Details",
      ref: "B40", // Start data from A2 to allow space for the table header
      columns: [
        { name: "Ahresty Casting No." },
        { name: "Engraving Date & Time" },
      ],
      rows: [T_Cylinder_Block_Engraving_Details],
    });

    worksheet.getCell("B43").value = "OP-195A/B Machining Time";
    worksheet.addTable({
      name: "T_OP_195A_B_Machining_Time",
      ref: "B44", // Start data from A2 to allow space for the table header
      columns: [{ name: "Machine" }, { name: "Date & Time" }],
      rows: [T_OP_195A_B_Machining_Time],
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex flex-column gap-3 mt-3">
      <hr></hr>

      {/* ── Engine Quality Info, Leaks, Entry Times, Serial Nos, HeadboltNR ── */}
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

      {/* ── Assembly Data heading & Export button - commented out */}
      {/* <div className="h4 text-primary"> Assembly data</div>

      <button
        className="btn btn-primary"
        style={{ width: "150px" }}
        onClick={exportToExcel}
      >
        Export to Excel
      </button> */}

      <CrankInfo crankinfo={crankinfo}/>


      <div>
        <div>
              <PTTable 
                engineNo={engineNo}    
                triggerSearch={triggerSearch}
              /> 
        </div>
      </div>

      {/* ── Machining Data ── */}
      <div className="h4 text-primary"> Machining Data</div>
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

