import { Modal, Header, List, Image, Grid, Segment } from 'semantic-ui-react';

export default function ReportModal({
  defectForm,
  open,
  onClose,
  onOpen,
}) {
  return (
    <Modal open={open} onOpen={onOpen} onClose={onClose}>
      <Modal.Header>Defect Report</Modal.Header>
      <Modal.Content>
        <Segment>
          <Grid columns={2} stackable>
            <Grid.Column width={4}>
              <Image src={defectForm.image} wrapped />
            </Grid.Column>
            <Grid.Column width={12}>
              <List>
                <List.Item>
                  <List.Header>Date:</List.Header> {defectForm.date}
                </List.Item>
                <List.Item>
                  <List.Header>Time:</List.Header> {defectForm.time}
                </List.Item>
                <List.Item>
                  <List.Header>Engine Number:</List.Header>{' '}
                  {defectForm.engineNo}
                </List.Item>
                <List.Item>
                  <List.Header>Engine Code:</List.Header>{' '}
                  {defectForm.engineCode}
                </List.Item>
                <List.Item>
                  <List.Header>Defect Content:</List.Header>{' '}
                  {defectForm.defectContent}
                </List.Item>
                <List.Item>
                  <List.Header>Remarks:</List.Header> {defectForm.remarks}
                </List.Item>
                <List.Item>
                  <List.Header>Checker:</List.Header> {defectForm.checker}
                </List.Item>
                <List.Item>
                  <List.Header>Fallen Part:</List.Header>{' '}
                  {defectForm.fallenPart || 'None'}
                </List.Item>
                <List.Item>
                  <List.Header>Station Occured:</List.Header>{' '}
                  {defectForm.stnOccured}
                </List.Item>
                <List.Item>
                  <List.Header>Station Detected:</List.Header>{' '}
                  {defectForm.stnDetected}
                </List.Item>
              </List>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment>
          <Header as="h3" dividing>
            PQCS Information
          </Header>
          {defectForm.pqcs.map((pqc) => (
            <List key={pqc._id.$oid}>
              <List.Item>
                <List.Header>Bolt:</List.Header> {pqc.bolt}
              </List.Item>
              <List.Item>
                <List.Header>Inspection Torque:</List.Header>{' '}
                {pqc.inspectionTorque}
              </List.Item>
              <List.Item>
                <List.Header>Measurements:</List.Header>{' '}
                {pqc.measurements.join(', ')}
              </List.Item>
              <List.Item>
                <List.Header>Confirmation:</List.Header> {pqc.confirmation}
              </List.Item>
            </List>
          ))}
        </Segment>
      </Modal.Content>
    </Modal>
  );
}