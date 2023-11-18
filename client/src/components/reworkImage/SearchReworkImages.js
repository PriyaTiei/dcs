import React, { useState, useRef } from "react";
import axios from "axios";
import ReusageImageCards from "./ReusageImageCards";
import { toast } from "react-toastify";
import { Search } from "bootstrap-icons-react";
import Select from "react-select";

function SearchReworkImages() {
  const [engineNo, setEngineNo] = useState("");
  const [shift, setShift] = useState("");
  const [line, setLine] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [listOfImages, setListOfImages] = useState([]);

  const getImages = () => {
    // if (engineNo == "") {
    //   toast.error(
    //     `Engine no. input can not be blank, please enter the Engine no.`
    //   );
    // } else {
    try {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImagesListQuery?engineNo=${engineNo}&shift=${shift}&line=${line}&fromDate=${fromDate}&toDate=${toDate}`
        )
        .then((result) => {
          setListOfImages(result.data.result);
        })
        .catch((e) => {
          console.log(e);
          setListOfImages([]);
          toast.error(`Images of engine number '${engineNo}' not available`);
        });
    } catch (e) {
      console.log(e);
      toast.error("Please check Network connection");
    }
    // }
  };

  const images = listOfImages?.map((imageData) => (
    <ReusageImageCards key={imageData._id} imageData={imageData} />
  ));

  const fromDateHandler = (e) => {
    var tempFromDate = new Date(e.target.value);

    tempFromDate.setDate(tempFromDate.getDate() - 1);
    tempFromDate.setHours(23);
    tempFromDate.setMinutes(60);
    tempFromDate.setSeconds(1);
    setFromDate(tempFromDate.toISOString());
  };

  const toDateHandler = (e) => {
    var tempToDate = new Date(e.target.value);
    tempToDate.setHours(23);
    tempToDate.setMinutes(59);
    tempToDate.setSeconds(59);
    setToDate(tempToDate.toISOString());

    // dispatch(newToDate(tempToDate.toISOString()));
    // setToDate(e.target.value);
    // console.log(e.target.value);
  };
  const elRef = useRef();
  const elRef2 = useRef();
  const elRef3 = useRef();
  const elRef4 = useRef();
  const clearFilter = () => {
    setEngineNo("");
    elRef.current.setValue("");
    elRef2.current.setValue("");
    elRef3.current.value=null
    elRef4.current.value=null
    setLine("");
    setShift("");
    setFromDate("");
    setToDate("");
    setListOfImages([]);
  };

  return (
    <div className="mt-3" style={{ height: "100vh", overflowY: "scroll" }}>
      <div className="d-flex gap-3">
        <input
          placeholder="Engine no"
          value={engineNo}
          onChange={(e) => setEngineNo(e.target.value)}
          className="form-control w-25"
        />
        <Select
          ref={elRef}
          options={[
            { value: "TNGA_Assembly", label: "TNGA Assembly" },
            { value: "TNGA_Machining", label: "TNGA Machining" },
            { value: "GD_Assembly", label: "GD Assembly" },
            { value: "GD_Machining", label: "GD Machining" },
            { value: "Others", label: "Others" },
          ]}
          // value={{ value: null, label: "select" }}
          onChange={(option) => {
            setLine(option.value);
          }}
          placeholder="Select Line"
        />
        <Select
          ref={elRef2}
          options={[
            { value: "White", label: "White" },
            { value: "Yellow", label: "Yellow" },
            { value: "Blue", label: "Blue" },
          ]}
          // value={{ value: null, label: "select" }}
          onChange={(option) => {
            setShift(option.value);
          }}
          placeholder="Select Shift"
        />
        <div className="d-flex align-items-center gap-2">
          <p className="">From Date</p>
          <input ref={elRef3}
            type="date"
            // value={fromDateString.slice(0, 10)}
            className="bg-warning text-center"
            onChange={fromDateHandler}
          />
        </div>
        <div className="d-flex align-items-center gap-2">
          <p className="">To Date</p>
          <input ref={elRef4}
            type="date"
            // value={toDateState.slice(0, 10)}
            className="bg-warning text-center"
            onChange={toDateHandler}
          />
        </div>
        <button onClick={getImages} className="btn btn-primary">
          <div className="d-flex gap-2 align-items-center">
            <Search />
            Search
          </div>
        </button>
        <i
          className="bi bi-file-earmark-excel btn btn-secondary"
          onClick={() => clearFilter()}
        > Clear Filter</i>
      </div>
      <div className="d-flex flex-wrap my-3"> {images}</div>
    </div>
  );
}

export default SearchReworkImages;
