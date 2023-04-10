import { useSelector, useDispatch } from "react-redux";
import { dcsSlice , addDcsFormData } from "../../redux/slices/dcsSlice";
import { 
  Segment,
  Form,
  Input,
  TextArea,
  Button,
  Select,
  Modal,
  Checkbox,
  FormField
} from "semantic-ui-react";
import BarCodeScanner from "../modals/BarCodeModal";
import { toast } from 'react-toastify'

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

const handleDropPartChange = (event, data) => {
    dispatch(dcsSlice.actions.setDropPart(data.checked)); 
};

const handleImageChange = (event) => {
  dispatch(dcsSlice.actions.setImage(event.target.files[0]))
  dispatch(dcsSlice.actions.setImagePreview(URL.createObjectURL(event.target.files[0]))) 
};

const handleRemoveImage = (event) => {
  dispatch(dcsSlice.actions.setImage())
  dispatch(dcsSlice.actions.setImagePreview(""))
};

const handleBarcodeButtonClick = (e) => {
  e.preventDefault();
  dispatch(dcsSlice.actions.setShowModal(true))
};

const handleModalClose = () => {
  dispatch(dcsSlice.actions.setShowModal(false))
};

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    await dispatch(addDcsFormData({
      date,
      time,
      remarks,
      partNo,
      defectType,
      engineCode,
      image
    }));

    toast.success("Successful !");
    handleResetform();
  } catch (error) {
    console.error(error);
  }
};


const handleResetform = () => {
    dispatch(dcsSlice.actions.resetForm());
};

  const options = [
    { value: "Defect A", text: "Defect A" },
    { value: "Defect B", text: "Defect B" },
  ]; 
  

  return (
  
      <Segment>
        <h2>Assembly Offline Treatment Sheet</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group widths="equal">
            <Form.Field
              className="black disabled"
              value={date}
              control={Input}
              label="Date"
            />
            <Form.Field
              className="black disabled"
              value={time}
              control={Input}
              label="Time"
            />
          </Form.Group>
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
              label={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <label >Defect Contents</label>
                  <Checkbox onChange={handleDropPartChange} checked={dropPart} toggle />
                </div>
              }
              control={Select}
              value={defectType}
              options={options}
              placeholder="Select Defect Content"
              onChange={handleDefectTypeChange}
              required 
            />
          </Form.Group>
          {dropPart && <Form.Group widths="equal">
          <FormField/>
            <Form.Field 
            label="Engine Code :"
            control={Input} 
            placeholder=""/>
               
            </Form.Group>}
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
            style={{ minHeight: 50 }}
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
        <Modal open={showModal} onClose={handleModalClose}>
          <Modal.Content>
            <BarCodeScanner />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handleModalClose}>Cancel</Button>
          </Modal.Actions>
        </Modal>
      </Segment>
 
  );
}


