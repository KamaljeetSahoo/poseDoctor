import React, { useRef, useEffect,useState } from "react";
import { Button, Col, Modal, Row } from 'react-bootstrap'

import { joints } from "./Joints";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import CanvasWebCam from "./UI_Components/CanvasWebCam";
import squatImg from './images/arom_l_flex.gif'
import { calculateAngles } from './utils'


//back_right_sideways_stretch
const AromLateralFlexion = () => {
  const webcamRef = useRef(0);
  const canvasRef = useRef(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var count = 0;
  var mode = null;

  var camera = null;


  function calculateAngle(b, c) {
    var radians = Math.atan2(c[1] - b[1], c[0] - b[0]);
    var angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) angle = 360 - angle;
    return Math.round(angle);
  }

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
        name: "right_hip",
        coord: [
          results.poseLandmarks[joints.right_hip].x,
          results.poseLandmarks[joints.right_hip].y,
        ],
      };
      var mid_joint = {
        name: "hip_middle",
        coord: [
          (results.poseLandmarks[joints.right_hip].x +
            results.poseLandmarks[joints.left_hip].x) /
            2,
          (results.poseLandmarks[joints.right_hip].y +
            results.poseLandmarks[joints.left_hip].y) /
            2,
        ],
      };
      var end_joint = {
        name: "shoulder_middle",
        coord: [
          (results.poseLandmarks[joints.left_shoulder].x +
            results.poseLandmarks[joints.right_shoulder].x) /
            2,
          (results.poseLandmarks[joints.left_shoulder].y +
            results.poseLandmarks[joints.right_shoulder].y) /
            2,
        ],
      };

      // var angle = calculateAngles(first_joint.coord, mid_joint.coord, end_joint.coord);

      var angle = calculateAngle(mid_joint.coord, end_joint.coord);
      angle = 90 - angle;

      canvasCtx.fillText(
        angle,
        mid_joint.coord[0] * width,
        mid_joint.coord[1] * height
      );

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
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#FFFFFF",
      lineWidth: 2,
    });
    // The dots are the landmarks
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "#FFFFFF",
      lineWidth: 2,
      radius: 2,
    });
    drawLandmarks(canvasCtx, results.poseWorldLandmarks, {
      color: "#FFFFFF",
      lineWidth: 2,
      radius: 2,
    });

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
  });
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
      <Row>
        <Col md={6}>
          <div className="align-items-center justify-content-center">
          <Button variant="primary" onClick={handleShow}>
										Show Example
									</Button>
									<ModalComp/>
            <CanvasWebCam webcamRef={webcamRef} canvasRef={canvasRef} />
          </div>
        </Col>
        <Col md={6} style={{ position: "relative" }}>
          Hello
        </Col>
      </Row>
      <Row>Hello</Row>
    </div>
  );
};

export default AromLateralFlexion;
