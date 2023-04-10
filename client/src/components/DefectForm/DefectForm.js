import { useSelector, useDispatch } from "react-redux";
import { dcsSlice, addDcsFormData } from "../../redux/slices/dcsSlice";
import {
  Form,
  Input,
  TextArea,
  Button,
  Select,
  FormField,
} from "semantic-ui-react";
import BarCodeScanner from "../DefectForm/BarCode";
import { toast } from "react-toastify";

export default function DefectForm() {
  const partNo = useSelector((state) => state.dcs.partNo);
  const remarks = useSelector((state) => state.dcs.remarks);
  const date = useSelector((state) => state.dcs.date);
  const time = useSelector((state) => state.dcs.time);
  const checker = useSelector((state) => state.dcs.checker);
  const engineCode = useSelector((state) => state.dcs.engineCode);
  const defectType = useSelector((state) => state.dcs.defectType);
  const image = useSelector((state) => state.dcs.image);
  const imagePreview = useSelector((state) => state.dcs.imagePreview);
  const showModal = useSelector((state) => state.dcs.showModal);
  const dropPart = useSelector((state) => state.dcs.dropPart);
  const fallenPart = useSelector((state) => state.dcs.fallenPart);
  const stnOccured = useSelector((state) => state.dcs.stnOccured);
  const stnDetected = useSelector((state) => state.dcs.stnDetected);
  const pqcsList = useSelector((state) => state.dcs.pqcsList);

  const dispatch = useDispatch();

  const handlePartNoChange = (event) => {
    dispatch(dcsSlice.actions.setPartNo(event.target.value));
  };

  const handleRemarksChange = (event) => {
    dispatch(dcsSlice.actions.setRemarks(event.target.value));
  };

  const handleEngineCodeChange = (event) => {
    dispatch(dcsSlice.actions.setEngineCode(event.target.value));
  };

  const handleCheckerChange = (event) => {
    dispatch(dcsSlice.actions.setChecker(event.target.value));
  };

  const handleDefectTypeChange = (event, data) => {
    dispatch(dcsSlice.actions.setDefectType(data.value));
  };

  const handleFallenPartChange = (event) => {
    dispatch(dcsSlice.actions.setFallenPart(event.target.value));
  };

  const handleImageChange = (event) => {
    dispatch(dcsSlice.actions.setImage(event.target.files[0]));
    dispatch(
      dcsSlice.actions.setImagePreview(
        URL.createObjectURL(event.target.files[0])
      )
    );
  };

  const handleRemoveImage = (event) => {
    dispatch(dcsSlice.actions.setImage());
    dispatch(dcsSlice.actions.setImagePreview(""));
  };

  const handleBarcodeButtonClick = (e) => {
    e.preventDefault();
    dispatch(dcsSlice.actions.setShowModal(true));
  };

  const handleModalClose = () => {
    dispatch(dcsSlice.actions.setShowModal(false));
  };

  const handleBarCodeDetected = (code) => {
    console.log("Barcode detected: ", code);
    
  };

  const handleSubmit = async (event) => {
    console.log('Called') 
    try {
      dispatch(
        addDcsFormData({
          date,
          time,
          remarks,
          partNo,
          defectType,
          engineCode,
          fallenPart,
          stnDetected,
          stnOccured,
          pqcsList,
          checker,
          image,
        })
      );

     
       
    } catch (error) {
      console.error(error);
    }
  };

 

  const options = [
    { value: "Defect A", text: "Defect A" },
    { value: "Defect B", text: "Defect B" },
    { value: "Fallen Part", text: "Fallen Part" },
  ];

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 12,
          }}
        >
          <h2>Assembly Offline Treatment Sheet</h2>
          <Form.Field
            width={"4"}
            className="black disabled"
            value={`${date} - ${time}`}
            control={Input}
            type="sticky"
          />
        </div>

        <Form.Group widths="equal">
          <Form.Field required>
            <label>Engine No. :</label>
            <div className="ui action input">
              <Input
                placeholder="Enter part no."
                value={partNo}
                onChange={handlePartNoChange}
              />
              <button
                className="ui icon button"
                onClick={handleBarcodeButtonClick}
              >
                <i className="password icon" />
              </button>
            </div>
          </Form.Field>
          <Form.Field
            label="Defect Contents"
            control={Select}
            value={defectType}
            options={options}
            placeholder="Select Defect Content"
            onChange={handleDefectTypeChange}
            required
          />
        </Form.Group>
        {dropPart && (
          <Form.Group widths="equal">
            <FormField />
            <Form.Field
              label="Fallen Part :"
              control={Input}
              value={fallenPart}
              onChange={handleFallenPartChange}
              placeholder=""
            />
          </Form.Group>
        )}
        <Form.Group widths="equal">
          <Form.Field
            label="Engine Code :"
            control={Input}
            value={engineCode}
            onChange={handleEngineCodeChange}
            placeholder="Enter Code"
            required
          />
          <Form.Field
            label="Checker :"
            control={Input}
            value={checker}
            onChange={handleCheckerChange}
            placeholder="Checker's Name"
            required
          />
        </Form.Group>
        <Form.Field
          label={"Treatment Contents :"}
          placeholder={"Enter Contents"}
          control={TextArea}
          value={remarks}
          onChange={handleRemarksChange}
          style={{ height: 50 }}
        />
        <Form.Field>
          <label>Image :</label>
          <div className="ui action input">
            <Input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              capture="camera"
            />
            {image && (
              <button onClick={handleRemoveImage}>
                <i className="ui icon remove" />
              </button>
            )}
          </div>
        </Form.Field>

        {image && (
          <div>
            <img src={imagePreview} alt={""} height={200} />
          </div>
        )}

        <Button className="ui button fluid black" type="submit">
          Submit
        </Button>
      </Form>
      <BarCodeScanner
        open={showModal}
        onClose={handleModalClose}
        onDetected={handleBarCodeDetected}
      />
    </>
  );
}
