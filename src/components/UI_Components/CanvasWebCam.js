import React, { useState, useCallback } from "react";
import Webcam from "react-webcam";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const CanvasWebCam = ({ webcamRef, canvasRef }) => {
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  const handleClick = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  return (
    <div>
      <button className="btn btn-primary mb-3 mt-5" onClick={handleClick}>
        Switch camera
      </button>
      <div className="card">
        <Webcam
          ref={webcamRef}
          videoConstraints={{
            ...videoConstraints,
            facingMode,
          }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 400,
            height: 400,
            marginBottom: "0px",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 400,
            height: 400,
            marginBottom: "0px",
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default CanvasWebCam;
