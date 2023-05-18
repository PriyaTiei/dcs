import React from "react";
import ReactDatePicker from "react-datepicker";

function Headings({filtered, setfiltered}) {

  return (
    
      <div className="d-flex  mt-4 border-dark">
        <div className="col-1  text-center ">
          <div className="border border-dark bg-secondary text-light">Date <button
          onClick={()=>
            setfiltered(filtered=>({
              ...filtered,
              entryDate:""
            }))
          }
          >Reset</button></div>
          <ReactDatePicker
            className="w-100 text-center"
            selected={filtered.entryDate}
            dateFormat="MM/dd/yyyy h:mm aa"
            onChange={value=>{
              setfiltered(filtered=>({
                ...filtered,
                entryDate:value
              }))
            }}
          />
        </div>

        <div className="col-1  text-center ">
          <div className="w-100 border border-dark bg-secondary text-light" htmlFor="m4">
            4 M
          </div>
          <select id="m4" className="w-100 text-center" onChange={e=>{
            setfiltered(filtered=>({
              ...filtered,
              m4:e.target.value
            }))
          }}>
            <option value="">All</option>
            <option value="man">Man</option>
            <option value="machine">Machine</option>
            <option value="method">Method</option>
            <option value="material">Material</option>
          </select>
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Line</div>
          <input className="w-100" type="text" onChange={e=>{
            setfiltered(filtered=>({
              ...filtered,
              line:e.target.value
            }))
          }} />
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Station</div>
          <input className="w-100" type="text" onChange={e=>{
            setfiltered(filtered=>({
              ...filtered,
              station:e.target.value
            }))
          }} />
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Change Point</div>
          <textarea
            rows="1"
            className="w-100"
            type="textArea"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                changePoint:e.target.value
              }))
            }} />

        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Reason</div>
          <textarea
            rows="1"
            className="w-100"
            type="textArea"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                reason:e.target.value
              }))
            }} />
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Action</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                action:e.target.value
              }))
            }}
          />
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Traceability</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                traceability:e.target.value
              }))
            }}
          />
        </div>

        <div className="col-1  text-center ">
          <div className=" w-100  border border-dark bg-secondary text-light" htmlFor="result">
            Result
          </div>
          <select
            id="result"
            className="w-100 text-center"
            type="text"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                result:e.target.value
              }))
            }}
          >
            <option value="">All</option>
            <option value="ok">OK</option>
            <option value="NG">NG</option>
          </select>
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Next action</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                next:e.target.value
              }))
            }}
          />
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Responsibility</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                responsibility:e.target.value
              }))
            }}
          />
        </div>

        <div className="col-1  text-center ">
          <div className="   border border-dark bg-secondary text-light">Countermeasure</div>
          <textarea
            rows="1"
            className="w-100"
            type="text"
            onChange={e=>{
              setfiltered(filtered=>({
                ...filtered,
                countermeasure:e.target.value
              }))
            }}
          />
        </div>
      </div>
      
   
  );
}

export default Headings;
