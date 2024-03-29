import React, {useRef,useEffect,useState} from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'

import Webcam from 'react-webcam'
import { joints } from './Joints'
import { Pose, POSE_CONNECTIONS, LandmarkGrid, PoseConfig } from '@mediapipe/pose'
import * as cam from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import squatImg from './images/shoulder_ext.gif'
import CanvasWebCam from './UI_Components/CanvasWebCam'


//shoulder_exercise
const ShoulderExtension = () => {
	const webcamRef = useRef(0)
	const canvasRef = useRef(0)
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const switchCamFunction = React.useRef(null);
  
	var count = 0;
	var mode = null;
  
	var camera = null
  
	function calculateAngles(a, b, c) {
  
	  var radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
	  var angle = Math.abs(radians * 180.0 / Math.PI);
  
	  if (angle > 180.0)
        angle = 360 - angle;
        
	  return angle;
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
		  name: "right_shoulder",
		  coord: [results.poseLandmarks[joints.right_shoulder].x, results.poseLandmarks[joints.right_shoulder].y]
		};
		var mid_joint = {
		  name: "right_elbow",
		  coord: [results.poseLandmarks[joints.right_elbow].x, results.poseLandmarks[joints.right_elbow].y]
		};
		var end_joint = {
		  name: "right_wrist",
		  coord: [results.poseLandmarks[joints.right_wrist].x, results.poseLandmarks[joints.right_wrist].y]
		};
  
		var angle = calculateAngles(first_joint.coord, mid_joint.coord, end_joint.coord);
  
		canvasCtx.fillText(angle, mid_joint.coord[0] * width, mid_joint.coord[1] * height);
  
  
		var high = 145;
		var low = 100;
  
		if (angle > high) {
		  mode = false;
		}
		if (angle < low && mode == false) {
		  count += 1;
		  mode = true;
		  console.log(count);
		}
		canvasCtx.fillText(count, 35, 60);
  
	  }
	  else
		console.log("no detections");
  
  
	}
  
	function onResults(results) {
  
	  canvasRef.current.width = webcamRef.current.video.videoWidth
	  canvasRef.current.height = webcamRef.current.video.videoHeight
	  const canvasElement = canvasRef.current;
	  const canvasCtx = canvasElement.getContext("2d")
	  // End 
	  canvasCtx.save();
	  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	  canvasCtx.drawImage(results.image,
		0,
		0,
		canvasElement.width,
		canvasElement.height
	  )
	  drawConnectors(canvasCtx,
		results.poseLandmarks, POSE_CONNECTIONS,
		{ color: '#FFFFFF', lineWidth: 2 });
	  // The dots are the landmarks 
	  drawLandmarks(canvasCtx, results.poseLandmarks,
		{ color: '#FFFFFF', lineWidth: 2, radius: 2 });
	  drawLandmarks(canvasCtx, results.poseWorldLandmarks,
		{ color: '#FFFFFF', lineWidth: 2, radius: 2 });
  
	  poseEstimation(results)
	  canvasCtx.restore();
  
	}
  
	useEffect(() => {
	  const pose = new Pose({
		locateFile: (file) => {
		  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
		}
	  });
	  pose.setOptions({
		modelComplexity: 1,
		smoothLandmarks: true,
		minDetectionConfidence: 0.5,
		minTrackingConfidence: 0.5
	  });
  
	  pose.onResults(onResults)
	  if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
		camera = new cam.Camera(webcamRef.current.video, {
		  onFrame: async () => {
			await pose.send({ image: webcamRef.current.video })
		  },
		  width: 800,
		  height: 800
		});
		camera.start()
	  }
	})


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
                <div className='align-items-center justify-content-center'>
				<Button variant="primary" onClick={handleShow}>
										Show Example
									</Button>
									<ModalComp/>
									<CanvasWebCam webcamRef={webcamRef} canvasRef={canvasRef} switchCamFunction={switchCamFunction}/>
                </div>
            </Col>
            <Col md={6} style={{position:'relative'}}></Col>
        </Row>
				<Row>
					
				</Row>
    </div>
  )
}

export default ShoulderExtension