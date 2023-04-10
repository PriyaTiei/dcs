 
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Icon } from "semantic-ui-react";
import { dcsSlice } from "../../redux/slices/dcsSlice";

export default function PQCSTable() {
  const dispatch = useDispatch(); 

  const pqcsList = useSelector((state) => state.dcs.pqcsList); 

  const handleRemovePQCS = (i) => {
    dispatch(dcsSlice.actions.removePqcsItem(i))
  }

  return (
    <Table celled textAlign="center">
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
          <Table.HeaderCell rowSpan={2} colSpan={1}>
            Actions
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
        {pqcsList.map((item, i) => {
          return (
            <Table.Row key={i}>
              <Table.Cell>{item.bolt}</Table.Cell>
              <Table.Cell>{item.inspectionTorque}</Table.Cell>
              {item.measurements.map((measurement, index) => (
                <Table.Cell key={index}>{measurement}</Table.Cell>
              ))}
              <Table.Cell>{item.confirmation}</Table.Cell>
              <Table.Cell>
                
                <Button onClick={() => handleRemovePQCS(i)} icon>
                  <Icon name="delete" />
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
