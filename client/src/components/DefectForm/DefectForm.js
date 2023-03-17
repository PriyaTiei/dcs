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
} from "semantic-ui-react";
import BarCodeScanner from "../modals/BarCodeModal";

export default function DefectForm() {
  const {
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
        <h2>Defect Control Form</h2>
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
            <Form.Field>
              <label>Part Number:</label>
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
                  <i className="barcode icon" />
                </button>
              </div>
            </Form.Field>
            <Form.Field
              label={"Defect Type"}
              value={defectType}
              control={Select}
              options={options}
              placeholder="Enter part no."
              onChange={handleDefectTypeChange}
            />
          </Form.Group>

          <Form.Field
            label={"Remarks:"}
            placeholder={"Enter Remarks"}
            control={TextArea}
            value={remarks}
            onChange={handleRemarksChange}
            style={{ minHeight: 100 }}
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
