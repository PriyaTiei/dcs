import React, { useState } from "react";
import { Accordion, Icon, List } from "semantic-ui-react";

export default function DefectFormInstructions() {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <Accordion styled>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={() => handleClick(0)}
      >
        <h3>Instructions :</h3>
        <Icon name="dropdown" />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <List ordered>
          <List.Item>
            The <strong>Date</strong> and <strong>Time</strong> fields are
            automatically set to the current instance.
          </List.Item>
          <List.Item>
            Enter the <strong>Part Number</strong> of the defective component in
            the "Part Number" field. You can either type the part number
            manually or scan the barcode using the barcode scanner by clicking
            the "Barcode" icon.
          </List.Item>
          <List.Item>
            Select the type of defect from the <strong>"Defect Type"</strong>{" "}
            dropdown menu
          </List.Item>
          <List.Item>
            Enter any remarks or additional information about the defect in the{" "}
            <strong>"Remarks"</strong> field.
          </List.Item>
          <List.Item>
            Capture an image of the defective component by clicking the "Choose
            File" button, selecting an image file from your device or taking a
            photo using your camera
          </List.Item>
          <List.Item>
            Once you have completed filling in the required information, click
            the <strong>"Submit"</strong> button to save the defect information.
          </List.Item>
        </List>
      </Accordion.Content>
    </Accordion>
  );
}
