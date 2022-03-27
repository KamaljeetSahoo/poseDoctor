import React, {useRef,useEffect, useState} from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import { joints } from './Joints'
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose'
import * as cam from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import CanvasWebCam from './UI_Components/CanvasWebCam'
import { calculateAngles, degrees_to_radians } from "./utils";
import squatImg from './images/squats.gif'

//right_squat
var cnt=0;
var guide=0;

const Squats = () => {
	const webcamRef = useRef(0)
	const canvasRef = useRef(0)

	const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const switchCamFunction = useRef(null);
  
	var count = 0;
	var mode = null;
  
	var camera = null
	
	const ghoom_jao = (o, p, ang) => {
		let cos_theta = Math.cos(degrees_to_radians(ang)),
		  sin_theta = Math.sin(degrees_to_radians(ang));
		let x = cos_theta * (p[0] - o[0]) - sin_theta * (p[1] - o[1]) + o[0];
		let y = sin_theta * (p[0] - o[0]) + cos_theta * (p[1] - o[1]) + o[1];
		return [x, y];
	  };
  
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
  
	//   var first_joint=null;
	//   var mid_joint=null;
	//   var end_joint=null;

	 //swap first and last
		var end_joint = {
		  name: "right_hip",
		  coord: [results.poseLandmarks[joints.right_hip].x, results.poseLandmarks[joints.right_hip].y]
		};
		var mid_joint = {
		  name: "right_knee",
		  coord: [results.poseLandmarks[joints.right_knee].x, results.poseLandmarks[joints.right_knee].y]
		};
		var first_joint = {
		  name: "right_ankle",
		  coord: [results.poseLandmarks[joints.right_ankle].x, results.poseLandmarks[joints.right_ankle].y]
		};	
		var angle = calculateAngles(first_joint.coord, mid_joint.coord, end_joint.coord);
  
		// canvasCtx.fillText(angle, mid_joint.coord[0] * width, mid_joint.coord[1] * height);

		var Pt1 = [first_joint.coord[0] * width, first_joint.coord[1] * height];
		var Pt2 = [mid_joint.coord[0] * width, mid_joint.coord[1] * height];
		var Pt3 = [end_joint.coord[0] * width, end_joint.coord[1] * height];
		var Pts = [Pt1, Pt2, Pt3];
  
		for (let i = 0; i < 3; i += 1) {
		  Pts[i][1] *= -1;
		}
		var high = 150;
		var low = 80;
		
		var color = "#FFFFFF";

		var point_angle = low;

		if (angle <= low && !guide) {
		  guide = 1;
		  color = "#18F22E";
		  point_angle = low;
		} else if (!guide && angle > low) {
		  color = "#FFFFFF";
		  point_angle = low;
		} else if (guide === 1 && angle <= low) {
		  color = "#18F22E";
		} else if (guide === 1 && angle > low && angle < high) {
		  guide = 1;
		  point_angle = high;
		  color = "#FFFFFF";
		} else if (guide === 1 && angle >= high) {
		  guide = 2;
		  color = "#18F22E";
		  point_angle = high;
		} else if (guide === 2 && angle >= high) {
		  guide = 2;
		  color = "#18F22E";
		  point_angle = high;
		} else if (guide === 2 && angle < high) {
		  guide = 0;
		  point_angle = low;
		  color = "#FFFFFF";
		}
  
		console.log("guide: ", guide, " point: ", point_angle, " color: ", color);

		const point = ghoom_jao(Pts[1], Pts[0], 360-point_angle);

		point[1] *= -1;
  
		// back to original
		for (let i = 0; i < 3; i += 1) {
		  Pts[i][1] *= -1;
		}
  
		canvasCtx.beginPath();
		canvasCtx.moveTo(Pts[1][0], Pts[1][1]);
		canvasCtx.lineTo(point[0], point[1]);
		canvasCtx.lineWidth = 7;
		canvasCtx.strokeStyle = "#FF0000";
		canvasCtx.stroke();

		canvasCtx.beginPath();
		canvasCtx.moveTo(Pts[1][0], Pts[1][1]);
		canvasCtx.lineTo(Pt3[0],Pt3[1]);
		canvasCtx.lineWidth = 7;
		canvasCtx.strokeStyle = "#FF0000";
		canvasCtx.stroke();		
  
		canvasCtx.fillText("point", point[0] * width, point[1] * height);
		

		canvasCtx.fillText(
		  mid_joint.name + " " + angle,
		  mid_joint.coord[0] * width,
		  mid_joint.coord[1] * height
		);

		if (angle > high) {
			mode = false;
		  }
		  if (angle < low && mode == false) {
			count += 1;
			cnt=count;
			mode = true;
			console.log(count);
		  }
		  canvasCtx.fillText(count, 35, 60);


		drawConnectors(canvasCtx,
			results.poseLandmarks, POSE_CONNECTIONS,
			{ color: color, lineWidth: 2 });
		  // The dots are the landmarks 
		drawLandmarks(canvasCtx, results.poseLandmarks,
			{ color: color, lineWidth: 2, radius: 2 });
		drawLandmarks(canvasCtx, results.poseWorldLandmarks,
			{ color: color, lineWidth: 2, radius: 2 });

		
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
	console.log(show)
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
				<Row style={{marginTop:400}}>
					
				</Row>
    </div>
  )
}

export default Squats