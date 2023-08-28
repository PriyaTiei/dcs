import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getProcessDetails } from "../../redux/slices/processData/processActions";

function ReusablePartNo() {
  const section = useSelector((state) => state.engine.section);
  const subSection = useSelector((state) => state.engine.subSection);
  const data = useSelector((state) => state.engine.engineData.data);
  const [partNo, setPartNo] = useState("");
  const dispatch= useDispatch()
  console.log("oart no");
  console.log(section);
  console.log(subSection);
  var filteredDataList = []; // note its a list but contain only one element at 0th index

  // dispatch & also set local state
  const dispatchAndLocalState=()=>{
    if (data!=null && filteredDataList.length >= 0) {
      setPartNo(filteredDataList[0][1]);
      dispatch(getProcessDetails(filteredDataList[0][1]))
    }
  }

  useEffect(() => {
    if (section == "Machining") {
      console.log("in if conditin");
      console.log(subSection);
      switch (subSection) {
        case "Block Cylinder":
          filteredDataList = data?.filter(
            (element) => element[17] === "Block S / N"
          );
            dispatchAndLocalState()
          break;
        case "Crank Shaft":
          filteredDataList = data?.filter(
            (element) => element[17] === "Crank S / N"
          );
          dispatchAndLocalState()
          break;
        case "Head Cylinder":
          filteredDataList = data?.filter(
            (element) => element[17] === "Head S / N"
          );
          dispatchAndLocalState()
          break;
        default:
          break;
      }
    } else {
      setPartNo("");
    }
  }, [subSection]);

  return (
    <div className="d-flex   ">
      <div className="text-center font-weight-bold">Part No.</div>

      <div className="text-center font-weight-bold">{partNo}</div>
    </div>
  );
}

export default ReusablePartNo;
