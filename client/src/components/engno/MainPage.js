import React, { useEffect, useState } from "react";
import ChangePointValue from "./ReuasableChangePointValues.js";
// import Select from "react-select"
import Select from "react-select";
import axios from "axios";
import DateTable from "./ReusableEngineHistoryValues.js";
import moment from "moment";
import ShippingDetails from "./ShippingDetails.js";
// import CrankDetails from "./testing.js";
import ChangePointAssembly from "./ChangePointAssembly.js";
import DetailTraceability from "./DetailTraceability.js";
import ChangePointMachining from "./ChangePointMachining.js";
import RawMaterialDetails from "./RawMaterialDetails.js";
import PartHistory from "./RMHistory.js";
import { useSelector, useDispatch } from "react-redux";
import { getEngineData } from "../../redux/slices/egNo/egNoActions.js";
import { Search } from "bootstrap-icons-react";
import { processDataClear } from "../../redux/slices/processData/processActions.js";
import Loading from "./Loading.js";
import EntireResultProcess from "./Entire.js";
import { getProcess3Details } from "../../redux/slices/processData/processActions.js";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import ReusageImageCards from "../reworkImage/ReusageImageCards.js";


function EngNo() {
  const [engineNo, setEngineNo] = useState("");
  const [searchEngineNo, setSearchEngineNo] = useState(""); 

  const [part, setPart] = useState("");
  const [supplierPart, setSupplierPart] = useState("");
  const hDate = new Date(Date.now()).toUTCString();

  const [leakData, setLeakData] = useState();
  const [crankinfo,setCrankInfo] = useState();
  const [error, setError] = useState('');

  const [listOfImages, setListOfImages] = useState([]);

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.engine.loading);

  const detail1 = "details";

  const partOptions = [
    { value: "head", label: "Head" },
    { value: "crank", label: "Crank" },
    { value: "block", label: "Block" },
  ];

  const supplierPartOptions = [
    { value: "crankCase", label: "Crank Case" },
    { value: "camShaft", label: "Cam Shaft" },
    { value: "piston", label: "Piston" },
  ];

  const oracleData = useSelector((state) => state.engine.engineData);
  const data3 = useSelector((state) => state.process.data3);

  const shippingRow = useSelector((state) => state.engine.shippingData);

  const getColumn = (arr, a, b, c) => {
    const selectedColumn = arr.map((item) => [item[a], item[b], item[c]]);

    return selectedColumn;
  };

  const setHeadLeakValues = (data) => {
    if (data.length > 0) {
      let leakDataInt = data?.filter((item) => data[5] == "H5_OP310");

      setLeakData(leakDataInt);
    }
  };

  // const machinedParts = ["Head S / N"];
  const machinedParts = ["Block S / N", "Crank S / N", "Head S / N"];

  const [searchTriggered, setSearchTriggered] = useState(false);

  const getOracleData = () => {
    setSearchEngineNo(engineNo); 
    setSearchTriggered(true);
    dispatch(processDataClear());
    dispatch(getEngineData(engineNo));
    fetchCrankData();
    getImages();
  };
const fetchCrankData = async () => {
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/crank/crankinformation/${engineNo}`);
     
      setCrankInfo(response.data);
      setError(''); 
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setCrankInfo(null); 
    }
  };
  const getPartData = async (partNo) => {
    // console.log("part nos are", partNo);
    await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/oracle/partNo/${partNo}`)
      .then((result) => {
        // console.log("data from Oracle server initial");
        // Store leak values
        setHeadLeakValues(result.data);

        // console.log(result.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (oracleData?.data) {
      const selectedColumns = getColumn(oracleData?.data, 17, 1, 21);

      // console.log(selectedColumns);
      // only keeping 3c parts
      const c3 = selectedColumns?.filter((item) => {
        return (
          item[0] === machinedParts[0] ||
          item[0] === machinedParts[1] ||
          item[0] === machinedParts[2]
        );
      });
      // console.log(c3);
      c3.forEach((item) => {
        getPartData(item[1]);
      });
      if (c3.length > 0) {
        dispatch(getProcess3Details(c3[0][1], c3[1][1], c3[2][1]));
      }
    }
  }, [oracleData]);

  const history = oracleData?.data?.map((item, index) =>
    item[17] != "EGNO" ? (
      <DateTable key={index} title={item[17]} date={item[21]} />
    ) : null
  );

  const fullHistory = oracleData ? (
    <>
      <div className="d-flex gap-0">
        <div className="p-2 border hist  ">SHIPMENT</div>
        <div className="p-2 border histValue ">
          {shippingRow
            ? shippingRow[3]
              ? moment(shippingRow[3]).format("YYYY-MM-DD HH:mm:ss")
              : null
            : null}
        </div>
      </div>
      <div className="d-flex gap-0">
        <div className="p-2 border hist  ">MTB</div>
        <div className="p-2 border histValue ">
          {/* {moment(shippingRow ? shippingRow[3] : null).format(
          "YYYY-MM-DD HH:mm:ss"
        )} */}
          Under progress
        </div>
      </div>

      {history}
    </>
  ) : null;

  // list of image _  function
  const getImages = () => {
    // if (engineNo == "") {
    //   toast.error(
    //     `Engine no. input can not be blank, please enter the Engine no.`
    //   );
    // } else {
    try {
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImagesListQuery?engineNo=${engineNo}`
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

  // card with all images
  const images = listOfImages?.map((imageData) => (
    <ReusageImageCards key={imageData._id} imageData={imageData} />
  ));

  return (
    <div>
      {/*************** * search engine no */}

      <div>
        <div>Engine Number</div>
        {/* {console.log("oracleData?.data ")}
        {console.log(oracleData?.data )}
        <CSVLink data= {oracleData?.data ===undefined? [["please search before you click on download button"]]:oracleData?.data } filename="assembly_data.csv"> <button className="btn btn-primary">Assy data</button></CSVLink>
        <CSVLink data= {data3?.data ===undefined? [["please search before you click on download button"]]:data3?.data } filename="machining_data.csv"> <button className="btn btn-primary">machining data</button></CSVLink>
        */}
        <div className="d-flex gap-3">
          <input
            type="text"
            placeholder="Please enter engine no."
            value={engineNo}
            onChange={(e) => setEngineNo(e.target.value)}
            className="form-control w-25"
          ></input>
          <button className="btn btn-primary" onClick={getOracleData}>
            <div className="d-flex gap-2 align-items-center">
              <Search />
              Search
            </div>
          </button>
          <div>{leakData}</div>
        </div>
      </div>
     
      <EntireResultProcess 
        crankinfo = {crankinfo} 
        engineNo={searchEngineNo}
        triggerSearch={searchTriggered}
        />
      
      {/* images display */}
      <div className="d-flex flex-wrap my-3"> {images}</div>

      {/* *****************Assembly fieldset */}
      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-primary"
          style={{ fontSize: "16px" }}
        >
          Assembly Data
        </legend>
        <div className="d-flex gap-3 mt-0">
          {/* Shipping Detail */}
          <ShippingDetails />

          {/* Engine History */}
          <div>
            <div className="h5">Engine history</div>

            <div className="d-flex gap-0">
              <div className="p-2 border hist h6 text-center bg-light">
                EVENT
              </div>
              <div className="p-2 border histValue h6  text-center bg-light">
                DATE & TIME
              </div>
            </div>
            {loading ? <Loading /> : fullHistory}
          </div>

          {/*  */}

          {/* Change point information  */}
          <ChangePointAssembly />
        </div>
      </fieldset>


       {/* *****************Crank fieldset */}
       {/* <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-primary"
          style={{ fontSize: "16px" }}
        >
         Crank Information
        </legend>
        <div className="d-flex gap-3 mt-0">
         
          <EntireResultProcess crankinfo = {crankinfo}/>
          {/* <CrankDetails /> 
        </div>
      </fieldset> */}

      {/* ************Machining Field set */}
      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "16px" }}
        >
          Machining Data
        </legend>
        {/* Change point information for Machining */}
        <ChangePointMachining />
      </fieldset>
      {/* ****************Detail Traceability */}
      <div className="d-flex gap-3 mt-0">
        {/* Supplier details */}
        <DetailTraceability />

        {/* Part selection */}

        {/* RM Detail */}

        {/* Part History */}
      </div>
      {/* ***************** Supplier Field set */}
      <fieldset className="border p-3 mt-3 ">
        <legend
          className="float-none  w-auto px-3  text-smfont-italic font-weight-normal text-success"
          style={{ fontSize: "16px" }}
        >
          Supplier Part traceability
        </legend>
        <div className="d-flex gap-3 mt-0">
          {/* Supplier Part selection */}

          <div>
            <div className="h5">Supplier Part Name</div>
            <Select
              options={supplierPartOptions}
              defaultValue={supplierPartOptions[0]}
              onChange={(e) => setSupplierPart(e.value)}
            />
          </div>
          {/* RM details */}
          <RawMaterialDetails />

          {/* Part History */}
          <PartHistory />
        </div>
      </fieldset>
    </div>
  );
}

export default EngNo;
