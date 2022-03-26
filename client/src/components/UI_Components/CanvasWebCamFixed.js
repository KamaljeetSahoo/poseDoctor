import React, { useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER,
};

const CanvasWebCam = ({ webcamRef, canvasRef, switchCamFunction }) => {
  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
  const switchCam = useCallback(() => {
    setFacingMode((prevState) =>
      prevState === FACING_MODE_USER
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER
    );
  }, []);

  useEffect(()=>{
    switchCamFunction.current = switchCam
  }, [])

  return (
      <div className="card">
        <Webcam
          ref={webcamRef}
          videoConstraints={{
            ...videoConstraints,
            facingMode,
          }}
          style={{
            position: "relative",
            left: 0,
            right: 0,
            textAlign: "center",
            width: "100%",
            height: "100%",
            marginBottom: "0px",
            display:"none"
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "relative",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: "100%",
            height: "100%",
            marginBottom: "0px",
          }}
        ></canvas>
      </div>
  );
};

export default CanvasWebCam;
