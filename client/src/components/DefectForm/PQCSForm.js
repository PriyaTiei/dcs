import { useDispatch, useSelector } from "react-redux";
import { Modal, Table, Button, Input } from "semantic-ui-react";
import { pqcsSlice } from "../../redux/slices/pqcsSlice";
import { dcsSlice } from "../../redux/slices/dcsSlice";

export default function PQCSForm({ onOpen, onClose,   open }) {
  const dispatch = useDispatch();

  const bolt = useSelector((state) => state.pqcs.bolt);
  const inspectionTorque = useSelector((state) => state.pqcs.inspectionTorque);
  const confirmation = useSelector((state) => state.pqcs.confirmation);
  const measurements = useSelector((state) => state.pqcs.measurements);

  const handleBoltChange = (e) => {
    dispatch(pqcsSlice.actions.setBolt(e.target.value));
  };

  const handleInspectionTorqueChange = (e) => {
    dispatch(pqcsSlice.actions.setInspectionTorque(e.target.value));
  };

  const handleMeasurementChange = (e, index) => {
    dispatch(
      pqcsSlice.actions.setMeasurement({ index, value: e.target.value })
    );
  };

  const handleConfirmationChange = (e) => {
    dispatch(pqcsSlice.actions.setConfirmation(e.target.value));
  };

  const handlePqcsAdd = (data) => {
    dispatch(dcsSlice.actions.addPqcsItem(data));
  };

  return (
    <Modal
      onClose={onOpen}
      onOpen={onClose}
      open={open}
      dimmer
      size="fullscreen"
    >
      <Modal.Header>Process Quality Confirmation Sheet</Modal.Header>
      <Modal.Content>
        <Table textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2} colSpan={1}>
                Bolt
              </Table.HeaderCell>
              <Table.HeaderCell rowSpan={2} colSpan={1}>
                Inspection Torque
              </Table.HeaderCell>
              <Table.HeaderCell rowSpan={1} colSpan={8}>
                Measurement Result
              </Table.HeaderCell>
              <Table.HeaderCell rowSpan={2} colSpan={1}>
                Confirmation
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((cellNumber) => (
                <Table.HeaderCell key={cellNumber} rowSpan={1}>
                  {cellNumber}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Input value={bolt} onChange={handleBoltChange} />
              </Table.Cell>
              <Table.Cell>
                <Input
                  value={inspectionTorque}
                  onChange={handleInspectionTorqueChange}
                />
              </Table.Cell>
              {measurements.map((measurement, index) => (
                <Table.Cell key={index}>
                  <Input
                    style={{ width: "50px" }}
                    value={measurement}
                    onChange={(e) => handleMeasurementChange(e, index)}
                  />
                </Table.Cell>
              ))}
              <Table.Cell>
                <Input
                  value={confirmation}
                  onChange={handleConfirmationChange}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="red"
          onClick={() => {
            onClose();
            dispatch(pqcsSlice.actions.resetForm());
          }}
        >
          Cancel
        </Button>
        <Button
          content="Add"
          labelPosition="right"
          icon="add"
          onClick={() => {
            handlePqcsAdd({
              bolt,
              inspectionTorque,
              measurements,
              confirmation,
            })    
            dispatch(pqcsSlice.actions.resetForm());
            onClose();
          }
          }
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
