import React, {useRef,useEffect} from 'react'
import { Col, Row } from 'reactstrap'
import { joints } from './Joints'
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose'
import * as cam from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import CanvasWebCam from './UI_Components/CanvasWebCam'
import { calculateAngles } from './utils'

//right_squat
const Squats = () => {
	const webcamRef = useRef(0)
	const canvasRef = useRef(0)
  
	var count = 0;
	var mode = null;
  
	var camera = null
  
  
  
	function poseEstimation(results) {
	  const canvasElement = canvasRef.current;
	  const canvasCtx = canvasElement.getContext("2d");
	  canvasCtx.font = "30px Arial";
  
	  var width = canvasElement.width;
	  var height = canvasElement.height;
  
	  if (results.poseLandmarks) {
  
		var first_joint = {
		  name: "right_hip",
		  coord: [results.poseLandmarks[joints.right_hip].x, results.poseLandmarks[joints.right_hip].y]
		};
		var mid_joint = {
		  name: "right_knee",
		  coord: [results.poseLandmarks[joints.right_knee].x, results.poseLandmarks[joints.right_knee].y]
		};
		var end_joint = {
		  name: "right_ankle",
		  coord: [results.poseLandmarks[joints.right_ankle].x, results.poseLandmarks[joints.right_ankle].y]
		};
  
		var angle = calculateAngles(first_joint.coord, mid_joint.coord, end_joint.coord);
  
		canvasCtx.fillText(angle, mid_joint.coord[0] * width, mid_joint.coord[1] * height);
  
  
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
		canvasCtx.fillText(count, 200, 50);
  
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
  return (
    <div>
        <Row>
            <Col md={6}>
                <div className='align-items-center justify-content-center'>
									<CanvasWebCam webcamRef={webcamRef} canvasRef={canvasRef} />
                </div>
            </Col>
            <Col md={6} style={{position:'relative'}}>Hello</Col>
        </Row>
				<Row>
					Hello
				</Row>
    </div>
  )
}

export default Squats