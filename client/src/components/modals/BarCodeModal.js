import React, { useState, useEffect, useRef } from "react";
import Quagga from "@ericblade/quagga2";

const BarCodeScanner = ({ onDetected, onClose }) => {
  const videoRef = useRef(null);
  const [scannerIsRunning, setScannerIsRunning] = useState(false);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
        setScannerIsRunning(true);
      }
    );

    Quagga.onDetected((data) => {
      if (onDetected) {
        onDetected(data.codeResult.code);
        Quagga.stop();
        setScannerIsRunning(false);
      }
    });

    return () => {
      Quagga.offDetected();
      Quagga.stop();
    };
  }, [onDetected]);

  const handleStopScanner = () => {
    Quagga.stop();
    setScannerIsRunning(false);
    onClose();
  };

  return (
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
  );
};

export default BarCodeScanner;
