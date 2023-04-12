import React, { useState,  useRef } from "react";
import {  
    Button,
    Modal
  } from "semantic-ui-react"; 

const BarCodeScanner = ({  onClose, open }) => {
  const videoRef = useRef(null);
  const [scannerIsRunning, setScannerIsRunning] = useState(false);

 

  const handleStopScanner = () => { 
    setScannerIsRunning(false);
    onClose();
  };

  return (

    <Modal open={open} onClose={onClose}>
    <Modal.Content>
    <div>
      {scannerIsRunning && (
        <div className="scanner-container">
          <video ref={videoRef} className="scanner-video" />
          <button
            onClick={handleStopScanner}
            className="ui button fluid primary"
          >
            Stop Scanner
          </button>
        </div>
      )}
    </div>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose}>Cancel</Button>
    </Modal.Actions>
  </Modal>
    
  );
};

export default BarCodeScanner;
