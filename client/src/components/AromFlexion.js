import React, { useRef, useEffect, useState } from "react"
import { Button, Col, Modal, Row } from 'react-bootstrap'

import { joints } from "./Joints"
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose"
import * as cam from "@mediapipe/camera_utils"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import CanvasWebCam from "./UI_Components/CanvasWebCam"
import { calculateAngles } from './utils'
import squatImg from './images/arom_flex.gif'

//back_stretch
const AromFlexion = () => {
  const webcamRef = useRef(0);
  const canvasRef = useRef(0);
  const [show, setShow] = useState(false);
  const switchCamFunction = React.useRef(null);
  const [ang, setAng] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var count = 0;
  var mode = null;

  var camera = null;

  function poseEstimation(results) {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.font = "30px Arial";
    canvasCtx.beginPath();
    canvasCtx.rect(0,0,100,100);
    canvasCtx.fillStyle = "red";
    canvasCtx.fill();
    canvasCtx.fillStyle = "black";
    


    var width = canvasElement.width;
    var height = canvasElement.height;

    if (results.poseLandmarks) {
      var first_joint = {
        name: "right_shoulder",
        coord: [
          results.poseLandmarks[joints.right_shoulder].x,
          results.poseLandmarks[joints.right_shoulder].y,
        ],
        visibility: results.poseLandmarks[joints.right_shoulder].visibility,
      };
      var mid_joint = {
        name: "right_hip",
        coord: [
          results.poseLandmarks[joints.right_hip].x,
          results.poseLandmarks[joints.right_hip].y,
        ],
        visibility: results.poseLandmarks[joints.right_hip].visibility,
      };
      var end_joint = {
        name: "right_knee",
        coord: [
          results.poseLandmarks[joints.right_knee].x,
          results.poseLandmarks[joints.right_knee].y,
        ],
        visibility: results.poseLandmarks[joints.right_knee].visibility,
      };

      var angle = calculateAngles(
        first_joint.coord,
        mid_joint.coord,
        end_joint.coord
      );

      angle = 180 - angle;
      canvasCtx.fillText(
        angle,
        mid_joint.coord[0] * width,
        mid_joint.coord[1] * height
      );

      if (
        first_joint.visibility > 0.8 &&
        mid_joint.visibility > 0.8 &&
        end_joint.visibility > 0.8
      ){
        var high = 150;
        var low = 90;
  
        if (angle > high) {
          mode = false;
        }
        if (angle < low && mode == false) {
          count += 1;
          mode = true;
          console.log(count);
        }
        canvasCtx.fillText(angle + "\xB0", 35, 60);
        if(angle > ang){
          setAng(() => {return angle})
        }
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#FFFFFF',
          lineWidth: 2,
        });
        // The dots are the landmarks
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: '#FFFFFF',
          lineWidth: 2,
          radius: 2,
        });

        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(canvasElement.width, 0);
        canvasCtx.lineTo(canvasElement.width, canvasElement.height);
        canvasCtx.lineTo(0, canvasElement.height);
        canvasCtx.lineTo(0, 0);
        canvasCtx.lineWidth = 15;
        canvasCtx.strokeStyle = "#80e885";
        canvasCtx.stroke();
      }
      else{
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(canvasElement.width, 0);
        canvasCtx.lineTo(canvasElement.width, canvasElement.height);
        canvasCtx.lineTo(0, canvasElement.height);
        canvasCtx.lineTo(0, 0);
        canvasCtx.lineWidth = 15;
        canvasCtx.strokeStyle = "#ed4c4c";
        canvasCtx.stroke();
      }
    } else console.log("no detections");

  }

  function onResults(results) {
    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height = webcamRef.current.video.videoHeight;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    // End
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    poseEstimation(results);
    canvasCtx.restore();
  }

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
        },
        width: 800,
        height: 800,
      });
      camera.start();
    }
  }, []);
  const ModalComp = () => {
		return (
			<Modal show={show} onHide={handleClose}>
				<Modal.Body>
					<div>
						<img className='img-fluid' src={squatImg} alt='squat'/>
					</div>
				</Modal.Body>
			</Modal>
		)
	}
  return (
    <div>
      <ModalComp />
      <div>
        <Row>
          <Col md={6}>
            <div className="text-center">
              <Button variant="primary" onClick={handleShow} className="m-1">
                Show Example
              </Button>
              <Button
                variant="primary"
                onClick={() => switchCamFunction.current()}
                className="m-1"
              >
                Switch Camera
              </Button>
              <CanvasWebCam
                webcamRef={webcamRef}
                canvasRef={canvasRef}
                switchCamFunction={switchCamFunction}
              />
            </div>
          </Col>
          <Col md={6}>
            <h2>{ang}</h2>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AromFlexion;
