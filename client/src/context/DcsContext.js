import { createContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const DcsContext = createContext();

export const DcsProvider = ({ children }) => {
  const [partNo, setPartNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [defectType, setDefectType] = useState("");

  const handlePartNoChange = (event) => {
    setPartNo(event.target.value);
  };

  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleDefectTypeChange = (event, data) => {
    setDefectType(data.value);
  };

  //Image
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setImagePreview(URL.createObjectURL(event.target.files[0]));
  };

  const handleRemoveImage = (event) => {
    setImage();
    setImagePreview("");
  };

  //Date & Time
  const [date] = useState(new Date().toISOString());
  const [time] = useState(new Date().toISOString());

  //Modal
  const [showModal, setShowModal] = useState(false);

  const handleBarcodeButtonClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  //Form
  const handleResetform = () => {
    setPartNo("");
    setRemarks("");
    setDefectType("");
    setImage();
    setImagePreview();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const imageData = new FormData();
    imageData.append("image", image);
    const imagePath = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}dcs/dcs-forms/upload-image`,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    try {
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/dcs/dcs-form`, {
          date: date,
          time: time,
          remarks: remarks,
          partNo: partNo,
          defectType: defectType,
          image: imagePath.data["imagePath"],
        })
        .then((res) => {
          toast.success("Successful !");
          handleResetform();
        });
    } catch (error) {
      console.error(error);
    }
  };

  const dcsValues = {
    partNo,
    remarks,
    date,
    time,
    defectType,
    image,
    imagePreview,
    showModal,
    handlePartNoChange,
    handleRemarksChange,
    handleDefectTypeChange,
    handleResetform,
    handleSubmit,
    handleImageChange,
    handleRemoveImage,
    handleBarcodeButtonClick,
    handleModalClose,
  };

  return (
    <DcsContext.Provider value={dcsValues}>{children}</DcsContext.Provider>
  );
};
