import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import axios from "axios";
import {toast} from "react-toastify"

function ChangePointEntryForm({setRefresh}) {
  const [entryDate, setEntryDate] = useState();
  const [m4, setM4] = useState("Man");
  const [line, setLine] = useState("");
  const [station, setStation] = useState("");
  const [changePoint, setChangePoint] = useState("");
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("");
  const [traceability, setTraceability] = useState("");
  const [result, setResult] = useState("OK");
  const [next, setNext] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [countermeasure, setCountermeasure] = useState("");
  
  const changeEntryDate = (date) => {
    setEntryDate(date.toLocaleDateString());
  };
  const changeM4 = (e) => {
    setM4(e.target.value);
  };
  const changeLine = (e) => {
    setLine(e.target.value);
  };
  const changeStation = (e) => {
    setStation(e.target.value);
  };
  const changePointHandler = (e) => {
    setChangePoint(e.target.value);
  };
  const changeReason = (e) => {
    setReason(e.target.value);
  };
  const changeAction = (e) => {
    setAction(e.target.value);
  };
  const changeTraceability = (e) => {
    setTraceability(e.target.value);
  };
  const changeResult = (e) => {
    setResult(e.target.value);
  };
  const changeNext = (e) => {
    setNext(e.target.value);
  };
  const changeResponsibility = (e) => {
    setResponsibility(e.target.value);
  };
  const changeCountermeasure = (e) => {
    setCountermeasure(e.target.value);
  };

  const formHandler = (e) => {
    e.preventDefault(); 

    const formData = {
      entryDate,
      m4,
      line,
      station,
      changePoint,
      reason,
      action,
      traceability,
      result,
      next,        
      responsibility,
      countermeasure,
    };
    if(result == "NG" && next=="" && responsibility == "" & countermeasure === ""){
      return
    }
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePoint/add`,formData)
    .then(result=>{   
      toast.success("save successfully")
      setRefresh(refresh=>!refresh)
   
    })
    .catch(err=>{
      toast.error(err.message)
      toast.error(JSON.stringify(err.response.data.message))
      console.log("Error validation : ", err)
    })
  };

  return (
    <form onSubmit={formHandler}>
      <div className="d-flex ">
        <div className="col-1 bg-secondary text-center text-light">
          <div className="border border-dark ">Date</div>
          <ReactDatePicker
            className="w-100 text-center"
            value={entryDate}
            onChange={changeEntryDate}
            placeholderText="Date"
          />
l
          {/* <input className="w-100" type="date" onChange={changeEntryDate}/>            */}
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <label className="w-100 border border-dark " htmlFor="m4">
            4 M
          </label>
          <select id="m4" className="w-100 text-center" onChange={changeM4}>
            <option value="man">Man</option>
            <option value="machine">Machine</option>
            <option value="method">Method</option>
            <option value="material">Material</option>
          </select>
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Line</div>
          <input className="w-100" type="text" onChange={changeLine} />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Station</div>
          <input className="w-100" type="text" onChange={changeStation} />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Change Point</div>
          <textarea
            rows="1"
            className="w-100"
            type="textArea"
            onChange={changePointHandler}
          />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Reason</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={changeReason}
          />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Action</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={changeAction}
          />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Traceability</div>
          <input className="w-100" type="text" onChange={changeTraceability} />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <label className=" w-100  border border-dark " htmlFor="result">
            Result
          </label>
          <select
            id="result"
            className="w-100 text-center"
            type="text"
            onChange={changeResult}
          >
            <option value="ok">OK</option>
            <option value="NG">NG</option>
          </select>
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Next action</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={changeNext}
          />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Responsibility</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={changeResponsibility}
          />
        </div>

        <div className="col-1 bg-secondary text-center text-light">
          <div className="   border border-dark ">Countermeasure</div>
          <textarea
            rows="1"
            className="w-100"
            type="textBox"
            onChange={changeCountermeasure}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-2">
        Submit
      </button>
    </form>
  );
}

export default ChangePointEntryForm;
