import { Table, Input, Button } from "semantic-ui-react";
import PQCSForm from "./PQCSForm";
import { useState } from "react";

export default function DefectPQCS() {
    const [pqcsModal, setPqcsModal] = useState(false)
  return (
    <>
    <PQCSForm onClose={() => setPqcsModal(false)} onOpen={() => setPqcsModal(true)} open={pqcsModal}/>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center" colSpan={2}>Station</Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell textAlign="center">Occured</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Detected</Table.HeaderCell>
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
        </Table.Row>
      </Table.Body>
    </Table>
     <Button onClick={() => setPqcsModal(true)} className="ui button fluid blue" >Process Quality Confirmation Sheet</Button>
     </>
  );
}
