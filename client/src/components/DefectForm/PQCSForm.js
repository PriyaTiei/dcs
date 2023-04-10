 
import { Modal, Table, Button, Input } from "semantic-ui-react";

export default function PQCSForm({ onOpen, onClose, onSave, open }) {
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
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2} colSpan={1}>Bolt</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2} colSpan={1}>Inspection Torque</Table.HeaderCell>
              <Table.HeaderCell rowSpan={1} colSpan={8}>
                Measurement Result
              </Table.HeaderCell>
              <Table.HeaderCell rowSpan={2} colSpan={1}>Confirmation</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
            
            <Table.HeaderCell rowSpan={1}  >1</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >2</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >3</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >4</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >5</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >6</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >7</Table.HeaderCell>
            <Table.HeaderCell rowSpan={1}  >8</Table.HeaderCell>
              
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <Input />
              </Table.Cell>
              <Table.Cell>
                <Input />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input style={{ width: "50px" }} />
              </Table.Cell>
              <Table.Cell>
                <Input />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button
          content="Add"
          labelPosition="right"
          icon="add"
          onClick={onSave}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}
