import { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Header, Form, Card, Icon } from "semantic-ui-react";
import { dateFormat } from "../services/DateParser";
import DatePicker from "react-datepicker";

export default function DefectScreen() {
  const [defectForms, setDefectForms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
        <Form.Field>
          <label>Filter by date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateSelect}
            dateFormat="yyyy-MM-dd"
            isClearable={true}
            placeholderText="Select date"
            popperPlacement="bottom-end"
            popperModifiers={{
              flip: {
                enabled: true,
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: "viewport",
              },
            }}
            inline // add inline prop to make the date picker take only the required width
          />
        </Form.Field>
      </Form>
      <Grid columns={8} divided padded>
        {filteredForms.map((defectForm) => (
          <Grid.Column key={defectForm._id}>
            <Card>
              <Card.Content>
                <Card.Header>{dateFormat(defectForm.date)}</Card.Header>
                <Card.Meta>{defectForm.time}</Card.Meta>
                <Card.Description>
                  <p>Part Number: {defectForm.partNo}</p>
                  <p>Defect Type: {defectForm.defectType}</p>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
}
