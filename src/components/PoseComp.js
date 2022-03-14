import React, {useEffect, useRef} from 'react'
import { Pose, POSE_CONNECTIONS, LandmarkGrid, PoseConfig } from '@mediapipe/pose'
import * as cam from '@mediapipe/camera_utils'
import { drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils'
import Webcam from 'react-webcam'

const PoseComp = () => {
    const webcamRef = useRef(0)
    const canvasRef = useRef(0)
    var camera = null
    
    function onResults(results) {
      console.log(results)
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
          width: 400,
          height: 400
        });
        camera.start()
      }
    })
    return (
      <div className="App">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "0px",
            marginRight: "0px",
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
            marginLeft: "0px",
            marginRight: "0px",
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
    );
}

export default PoseComp