import { useSelector, useDispatch } from "react-redux";
import { Table, Input, Button } from "semantic-ui-react";
import PQCSForm from "./PQCSForm";
import { useState } from "react";
import { dcsSlice } from "../../redux/slices/dcsSlice";

export default function DefectPQCS() {

  const dispatch = useDispatch();

  const stnOccured = useSelector(state => state.dcs.stnOccured);
  const stnDetected = useSelector(state => state.dcs.stnDetected);

  const handleStnOccuredChange = (e) => {
    dispatch(dcsSlice.actions.setStnOccured(e.target.value))
  }

  const handleStnDetectedChange = (e) => {
    dispatch(dcsSlice.actions.setStnDetected(e.target.value))
  }

  const [pqcsModal, setPqcsModal] = useState(false);

  return (
    <>
      <PQCSForm
        onClose={() => setPqcsModal(false)}
        onOpen={() => setPqcsModal(true)}
        open={pqcsModal}
      />
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center" colSpan={2}>
              Station
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Occured</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Detected</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Input value ={stnOccured} onChange={handleStnOccuredChange}/>
            </Table.Cell>
            <Table.Cell>
              <Input value={stnDetected} onChange={handleStnDetectedChange}/>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Button
        onClick={() => setPqcsModal(true)}
        className="ui button fluid blue"
      >
        Process Quality Confirmation Sheet
      </Button>
    </>
  );
}
