import React, { useState } from "react";
import axios from "axios";
import ReusageImageCards from "./ReusageImageCards";
import { toast } from "react-toastify";

function SearchReworkImages() {
  const [engineNo, setEngineNo] = useState("");
  const [listOfImages, setListOfImages] = useState([]);

  const getImages = () => {
    if (engineNo == "") {
      toast.error(
        `Engine no. input can not be blank, please enter the Engine no.`
      );
    } else {
      try {
        axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/dcs/reworkImagesList/${engineNo}`
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
    }
  };

  const images = listOfImages?.map((imageData) => (
    <ReusageImageCards key={imageData._id} imageData={imageData} />
  ));
  return (
    <div>
      <div className="d-flex gap-3">
        <input
          placeholder="Engine no"
          value={engineNo}
          onChange={(e) => setEngineNo(e.target.value)}
          className="form-control w-25"
        />
        <button onClick={getImages} className="btn btn-primary">
          Search
        </button>
      </div>
      <div className="d-flex flex-wrap my-3"> {images}</div>
    </div>
  );
}

export default SearchReworkImages;
