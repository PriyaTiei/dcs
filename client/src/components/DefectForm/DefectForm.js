import { useContext } from "react";
import { DcsContext } from "../../context/DcsContext";
import {
  Container,
  Segment,
  Form,
  Input,
  TextArea,
  Button,
  Select,
  Modal,
  Checkbox,
} from "semantic-ui-react";
import BarCodeScanner from "../modals/BarCodeModal";

export default function DefectForm() {
  const {
    partNo,
    remarks,
    date,
    time,
    checker,
    engineCode,
    defectType,
    image,
    imagePreview,
    showModal,
    handlePartNoChange,
    handleRemarksChange,
    handleDefectTypeChange,
    handleEngineCodeChange,
    handleCheckerChange,
    handleResetform,
    handleSubmit,
    handleImageChange,
    handleRemoveImage,
    handleBarcodeButtonClick,
    handleModalClose,
  } = useContext(DcsContext);

  const options = [
    { value: "Defect A", text: "Defect A" },
    { value: "Defect B", text: "Defect B" },
  ];

  

  return (
    <Container>
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
                  <Checkbox toggle />
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
    </Container>
  );
}


