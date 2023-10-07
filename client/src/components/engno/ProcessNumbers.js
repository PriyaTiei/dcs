import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  getProcessEngineDetails,
  getProcessEngineDateDetails,
  getProcessRangeDetails,
  newFromDate,
  newToDate,
  getProcessDetails,
  setProcessNo,
  getProcessRangeDetailsAssy,
} from "../../redux/slices/processData/processActions";
import Loading from "./Loading";

function ProcessData({ processNoListInitial }) {
  const data = useSelector((state) => state.engine.engineData.data);
  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const processNo = useSelector((state) => state.process.processNo);
  const processName = useSelector((state) => state.process.processName);
  const processNoALCData = useSelector((state) => state.process.data.data);
  const dataOneDay = useSelector((state) => state.process.dataOneDay.data);
  const machiningDataLoading = useSelector((state) => state.process.machiningDataLoading);
  const [indexButton, setIndexButton]=useState("")
  var processEngineData = useSelector(
    (state) => state.process.processEngine.data
  );
  var processEngineDateData = useSelector(
    (state) => state.process.processEngineDate.data
  );

  const [colorOfButtonClicked, setColorOfButtonClicked] = useState("");
  const dispatch = useDispatch();
  var filteredDataList = [];
  ///**********Return based on process No */

  useEffect(() => {
    // console.log("activated process name")
    if (section === "Machining") {
      var processNoFiltered = processNoALCData?.filter(
        (elements) => elements[5] === processName
      );
      if (processNoFiltered == undefined || processNoFiltered.length == 0) {
        console.log(
          "processNoFiltered == undefined || processNoFiltered.length == 0"
        );
        console.log("processNoFiltered");
        console.log(processNoFiltered);
        console.log("processNoALCData");
        console.log(processNoALCData);
      } else {
        console.log("processNoFiltered");
        console.log(processNoFiltered);
        console.log("processNoALCData");
        console.log(processNoALCData);
        console.log("entered if ");
        var tempFromDate = new Date(processNoFiltered[0][8]);
        tempFromDate.setDate(tempFromDate.getDate() - 1);
        tempFromDate.setHours(23);
        tempFromDate.setMinutes(60);
        tempFromDate.setSeconds(1);
        var tempToDate = new Date(processNoFiltered[0][8]);
        tempToDate.setHours(23);
        tempToDate.setMinutes(59);
        tempToDate.setSeconds(59);

        dispatch(newFromDate(tempFromDate.toISOString()));
        dispatch(newToDate(tempToDate.toISOString()));
        dispatch(
          getProcessRangeDetails(
            processNoFiltered[0][5],
            tempFromDate.toISOString(),
            tempToDate.toISOString()
          )
        );
      }
    } else if (section === "Assembly") {
      filteredDataList = data?.filter((element) => element[17] === processName);
      if (filteredDataList != undefined && filteredDataList.length > 0) {
        console.log("assembly filter");
        console.log(filteredDataList);
        var tempFromDate = new Date(filteredDataList[0][21]);
        tempFromDate.setDate(tempFromDate.getDate() - 1);
        tempFromDate.setHours(23);
        tempFromDate.setMinutes(60);
        tempFromDate.setSeconds(1);
        var tempToDate = new Date(filteredDataList[0][21]);
        tempToDate.setHours(23);
        tempToDate.setMinutes(59);
        tempToDate.setSeconds(59);
        console.log(tempFromDate.toISOString());
        dispatch(newFromDate(tempFromDate.toISOString()));
        dispatch(newToDate(tempToDate.toISOString()));
        dispatch(
          getProcessRangeDetailsAssy(
            processName,
            tempFromDate.toISOString(),
            tempToDate.toISOString()
          )
        );
      }
    }
  }, [processName]);

  // second user effect - to get engine nos of all part based on serial no
  useEffect(() => {
    if (dataOneDay?.length >= 0) {
      // if (
      //   section == "Machining" &&
      //   subSection == "Block Cylinder" &&
      //   processNo == "OP5"
      // ) {

      const serialNoListString = dataOneDay
        .map((item) => item[2].trim())
        .join(",");
      dispatch(getProcessEngineDetails(serialNoListString));
      // }
    }
  }, [dataOneDay]);

  // third user effect - to get dispatch dates of all engine
  useEffect(() => {
    if (processEngineData?.length >= 0) {
      // if (
      //   section == "Machining" &&
      //   subSection == "Block Cylinder" &&
      //   processNo == "OP5"
      // ) {
      const engineNoListString = processEngineData
        .map((item) => item[1].trim())
        .join(",");

      dispatch(getProcessEngineDateDetails(engineNoListString));
      // }
    }
  }, [processEngineData]);

  //populate process no
  const processNoElements = processNoListInitial.map((item, index) => (
    <div
      key={index}
      className={` p-2 border btn ${
        item.value == item.label ? "disabled" : null
      } ${indexButton===index?"bg-warning":null}`}
      onClick={() => processHandler(item.label, item.value, index)}
    >
      {item.label}
    </div>
  ));
  // console.log(processNo, "process No");

  //dispatch process no & fetch the required data
  const processHandler = (processNo, processName, index) => {
    console.log("button clicked");
    dispatch(setProcessNo(processNo, processName));
    setIndexButton(index)
    setColorOfButtonClicked();

    // dispatch(getProcessDetails(processNo));
  };

  //return the component
  return (
    <div>
      <div className="h5">Process Numbers </div>
      <div className="d-flex flex-wrap gap-1 prosMach " style={{minWidth:"900px"}}>
        {machiningDataLoading?<Loading />:processNoElements}
      </div>
    </div>
  );
}

export default ProcessData;
