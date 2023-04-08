import { useState, useEffect } from "react";
import axios from "axios";
import {   Header, Form, Table , Input } from "semantic-ui-react";
import { dateFormat } from "../services/DateParser";
import DatePicker from "react-datepicker";

export default function DefectScreen() {
  const [defectForms, setDefectForms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
};

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}dcs/dcs-forms`
      );
      setDefectForms(response.data.defectForms);
    }
    fetchData();
  }, []);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const filteredForms = selectedDate
    ? defectForms.filter(
        (defectForm) => defectForm.date === selectedDate.toISOString()
      )
    : defectForms;

  return (
    <div>
      <Header as="h2">Defect Forms</Header>
      <Form>
      <Form.Group widths='equal'>
    <Form.Field>
      <label>Filter by date:</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateSelect}
        dateFormat="yyyy-MM-dd"
        isClearable={true}
        placeholderText="Select date"
        
      />
    </Form.Field>
    <Form.Field>
      <label>Search by Engine Number:</label>
      <Input
        icon='search'
        placeholder='Enter engine number...'
        onChange={handleSearchChange}
        value={searchTerm}
      />
    </Form.Field>
  </Form.Group>
      </Form>
      <Table celled>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Date & Time</Table.HeaderCell> 
      <Table.HeaderCell>Engine Number</Table.HeaderCell>
      <Table.HeaderCell>Defect Content</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {filteredForms.map((defectForm) => (
      <Table.Row key={defectForm._id}>
        <Table.Cell>{dateFormat(defectForm.date)}</Table.Cell> 
        <Table.Cell>{defectForm.partNo}</Table.Cell>
        <Table.Cell>{defectForm.defectType}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
    </div>
  );
}
