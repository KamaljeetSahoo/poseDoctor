import React, {useEffect, useRef, useState} from 'react'
import { Pose, POSE_CONNECTIONS, LandmarkGrid, PoseConfig } from '@mediapipe/pose'
import * as cam from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils'
import Webcam from 'react-webcam'
import { expectPromiseToFail } from '@tensorflow/tfjs-core/dist/test_util'


// lumbar spine(going down half),lateral flexion(back side ways),extension(top to bottom)
const joints={
  "nose": 0,
  "left_eye_inner": 1, 
  "left_eye" : 2,
  "left_eye_outer" : 3,
  "right_eye_inner" : 4,
  "right_eye" : 5,
  "right_eye_outer" : 6,
  "left_ear" : 7,
  "right_ear" : 8,
  "mouth_left" : 9,
  "mouth_right" : 10,
  "left_shoulder": 11,
  "right_shoulder": 12,
  "left_elbow" : 13,
  "right_elbow" : 14,
  "left_wrist": 15,
  "right_wrist": 16,
  "left_pinky": 17,
  "right_pinky": 18,
  "left_index": 19,
  "right_index": 20,
  "left_thumb": 21,
  "right_thumb": 22,
  "left_hip": 23,
  "right_hip": 24,
  "left_knee": 25,
  "right_knee": 26,
  "left_ankle": 27,
  "right_ankle": 28,
  "left_heel": 29,
  "right_heel": 30,
  "left_foot_index": 31,
  "right_foot_index": 32
}

const MediaPipeComp = () => {
	const webcamRef = useRef(0)
  const canvasRef = useRef(0)
  // const [count,setCount] = useState(0);
  // const [mode,setMode] = useState(null);

  var count = 0;
  var mode = null;

  var camera = null
  
    function calculateAngles(a,b,c){

      var radians = Math.atan2(c[1]-b[1], c[0]-b[0]) - Math.atan2(a[1]-b[1], a[0]-b[0]);
      var angle =  Math.abs(radians*180.0/Math.PI);
      
      if(angle>180.0)
          angle = 360-angle;
          
      // console.log("angle calculated as ",angle);    
      return angle; 
    }

    // function exercise(angle,state,high,low){
    //   if(angle>high){
    //     setMode(false);
    //   }
    //   if(angle<low && (state==null || state==false)){
    //     setCount(count+1);
    //     setMode(true);
    //     console.log(count);
    //   }
    // }

    function poseEstimation(results){
      //  console.log("inside pose");
      
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.font = "30px Arial";
      // canvasCtx.fillText("Hello World", 10, 50);

      var width=canvasElement.width;
      var height=canvasElement.height;

       if(results.poseLandmarks)
          {   

              var first_joint={
                name:"left_shoulder",
                coord:[results.poseLandmarks[joints.left_shoulder].x,results.poseLandmarks[joints.left_shoulder].y]
              };
              var mid_joint={
                name:"left_elbow",
                coord:[results.poseLandmarks[joints.left_elbow].x,results.poseLandmarks[joints.left_elbow].y]
              };
              var end_joint={
                name:"left_wrist",
                coord:[results.poseLandmarks[joints.left_wrist].x,results.poseLandmarks[joints.left_wrist].y]
              };

              var angle=calculateAngles(first_joint.coord,mid_joint.coord,end_joint.coord);

              // console.log(angle);
              canvasCtx.fillText(mid_joint.name + " " + angle, mid_joint.coord[0]*width, mid_joint.coord[1]*height);  

              // if(angle)
              // var rep=exercise(angle,mode,160,30);

              var high=160;
              var low =30;

              if(angle>high){
                mode=false;
              }
              if(angle<low && mode==false){
                count+=1;
                mode=true;
                console.log(count);
              }
              canvasCtx.fillText(count, 200, 50);
              // canvasCtx.fillText(angle+" reps: "+rep, mid_joint.coord[0]*width, mid_joint.coord[1]*height);  
              
          }    
       else
              console.log("no detections");     
              
              
    }

    function onResults(results) {
      // console.log(results)
      //console.log(results.poseWorldLandmarks)
      // Define the canvas elements 
      
      canvasRef.current.width = webcamRef.current.video.videoWidth
      canvasRef.current.height = webcamRef.current.video.videoHeight
      // Check for useing the front camera 
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d")
      // Define the girods here 
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
            // var cv=require('opencv.js');
            // let cap = new cv.VideoCapture(webcamRef.current.video);
            // let src = new cv.Mat(400, 400, cv.CV_8UC4);
            // cap.read(src);
            // cv.imshow('canvasOutput', src);
          },
          width: 800,
          height: 800
        });
        camera.start()
      }
    })
  return (
    <div>
			<div className='card'>
				<div className='card-body'>
					<Webcam
						ref={webcamRef}
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							textAlign: "center",
							zindex: 9,
							width: 400,
							height: 400,
							marginBottom: "0px",
						}} />
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
							marginBottom: "0px"
						}}>
					</canvas>
				</div>
			</div>
        
        <br></br>
        <br></br>
        <br></br>
        <p>{count}</p>
    </div>
  )
}

export default MediaPipeComp