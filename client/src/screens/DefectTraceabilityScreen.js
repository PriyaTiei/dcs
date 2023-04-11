import { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';
import { Header, Form, Table, Input, Button, Icon } from "semantic-ui-react"; 
import DatePicker from "react-datepicker";
import ReportModal from "../components/DefectForm/ReportModal"

export default function DefectTraceabilityScreen() {
  const [defectForms, setDefectForms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [reportModal, setReportModal] = useState(false);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      console.log(defectForms);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/dcs/dcs-forms`
      );
      console.log(response);
      setDefectForms(response.data);
    }
    fetchData();
  }, [defectForms]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const filteredForms = defectForms.filter((defectForm) => {
    const date = new Date(defectForm.date);
    const engineNo = defectForm.engineNo.toLowerCase();
  
 
    if (selectedDate && !isSameDay(date, selectedDate)) {
      return false;
    }
  
  
    if (searchTerm && !engineNo.includes(searchTerm.toLowerCase())) {
      return false;
    }
  
    return true;
  });

  function isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  return (
    <div>
      <Header as="h2">Defect Forms</Header>
      <Form>
        <div
          style={{
            display: "flex",
          }}
        >
          <Form.Field width={"2"} style={{ marginRight: "20px" }}>
            <label>Filter by date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateSelect}
              dateFormat="yyyy-MM-dd"
              isClearable={true}
              placeholderText="Select date"
            />
          </Form.Field>
          <Form.Field width={"2"}>
            <label>Search by Engine Number:</label>
            <Input
              icon="search"
              placeholder="Enter engine number..."
              onChange={handleSearchChange}
              value={searchTerm}
            />
          </Form.Field>
        </div>
      </Form>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Sl. No</Table.HeaderCell>
            <Table.HeaderCell>Date & Time</Table.HeaderCell>
            <Table.HeaderCell>Engine Number</Table.HeaderCell>
            <Table.HeaderCell>Engine Code</Table.HeaderCell>
            <Table.HeaderCell>Checker</Table.HeaderCell>
            <Table.HeaderCell>Defect Content</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredForms.map((defectForm, index) => (<>
            <Table.Row key={defectForm._id}>
              <Table.Cell>{index + 1}</Table.Cell>
              <Table.Cell>{moment(defectForm.date, "DD/MM/YYYY").format("YYYY-MM-DD")}</Table.Cell>
              <Table.Cell>{defectForm.engineNo}</Table.Cell>
              <Table.Cell>{defectForm.engineCode}</Table.Cell>
              <Table.Cell>{defectForm.checker}</Table.Cell>
              <Table.Cell>{defectForm.defectContent}</Table.Cell>
              <Table.Cell>
                <Button onClick={() => setReportModal(true)} icon>
                  <Icon name="warning sign" />
                </Button>
              </Table.Cell>
            </Table.Row>
            < ReportModal open={reportModal} onClose={() => setReportModal(false)} onOpen={() => setReportModal(true)} defectForm={defectForm}/> 
            </>
          ))}
          
        </Table.Body>
      </Table>
    </div>
  );
}
