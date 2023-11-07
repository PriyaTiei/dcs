import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { excelTableHeading } from "../../../redux/slices/processData/processActions";

function Heading_A_ONTime({setExcelData, excelData}) {
  const dispatch = useDispatch();
  const dataRange = useSelector((state) => state.process.dataRange.data)
  const processName = useSelector((state) => state.process.processName);
  useEffect(()=>{
    console.log("test_Heading engine no")
    console.log(excelData)
    dispatch(excelTableHeading([ "Engine No.","Process Date & Time",  "Dispatch Status", "Dispatched Date & Time" ]))
    // setExcelData([[]]);
    // setExcelData([ [ "Engine No.","Process Date & Time",  "Dispatch Status", "Dispatched Date & Time" ]])
      },[processName])

      
  return (
    <>
      <div className="mt-3">
        <div className="h5">Day wise - Leak values</div>
        <div className="d-flex flex-wrap gap-0 deta ">
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Engine No.
          </div>
         
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Process Date & Time
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Dispatch Status
          </div>
          <div className="text-center font-weight-bold flex-1 bg-dark text-light">
            Dispatched Date & Time
          </div>
        </div>
      </div>
    </>
  );
}

export default Heading_A_ONTime;
