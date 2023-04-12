import {
  Modal,
  Header,
  List,
  Image,
  Grid,
  Segment,
  Table,
} from "semantic-ui-react";

export default function ReportModal({ defectForm, open, onClose, onOpen }) {
  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose}>
      <Modal.Header>Defect Report</Modal.Header>
     { defectForm && <Modal.Content>
        <Segment>
          <Grid columns={3} stackable>
            <Grid.Column width={4}>
              <List>
                <List.Item>
                  <List.Header>Date:</List.Header> {defectForm.date}
                </List.Item>
                <List.Item>
                  <List.Header>Time:</List.Header> {defectForm.time}
                </List.Item>
                <List.Item>
                  <List.Header>Station Occured:</List.Header>{" "}
                  {defectForm.stnOccured}
                </List.Item>
                <List.Item>
                  <List.Header>Station Detected:</List.Header>{" "}
                  {defectForm.stnDetected}
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={4}>
              <List>
                <List.Item>
                  <List.Header>Engine Number:</List.Header>{" "}
                  {defectForm.engineNo}
                </List.Item>
                <List.Item>
                  <List.Header>Engine Code:</List.Header>{" "}
                  {defectForm.engineCode}
                </List.Item>
                <List.Item>
                  <List.Header>Defect Content:</List.Header>{" "}
                  {defectForm.defectContent}
                </List.Item>
                <List.Item>
                  <List.Header>Remarks:</List.Header> {defectForm.remarks}
                </List.Item>
                <List.Item>
                  <List.Header>Checker:</List.Header> {defectForm.checker}
                </List.Item>
                <List.Item>
                  <List.Header>Fallen Part:</List.Header>{" "}
                  {defectForm.fallenPart || "None"}
                </List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={4}>
              <Image
                src={`${process.env.REACT_APP_BACKEND_URL}/${defectForm.image}`}
                wrapped
              />
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Header as="h3" dividing>
            PQCS Information
          </Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Bolt</Table.HeaderCell>
                <Table.HeaderCell>Inspection Torque</Table.HeaderCell>
                <Table.HeaderCell>Measurements</Table.HeaderCell>
                <Table.HeaderCell>Confirmation</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {defectForm.pqcs.map((pqc) => (
                <Table.Row key={pqc._id.$oid}>
                  <Table.Cell>{pqc.bolt}</Table.Cell>
                  <Table.Cell>{pqc.inspectionTorque}</Table.Cell>
                  <Table.Cell>{pqc.measurements.join(", ")}</Table.Cell>
                  <Table.Cell>{pqc.confirmation}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment>
      </Modal.Content>}
    </Modal>
  );
}
