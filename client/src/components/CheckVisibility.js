import React, {useEffect, useRef, useState} from 'react'
import { joints } from "./Joints";
import { Col, Row } from 'react-bootstrap'
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import * as ReactBootStrap from "react-bootstrap"
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import CanvasWebCam from "./UI_Components/CanvasWebCam";

const CheckVisibility = () => {
  const webcamRef = useRef(0);
  const canvasRef = useRef(0);
  const [vis, setVis] = useState([]);
  var camera = null;


  function poseEstimation(results) {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.font = "30px Arial";

    canvasCtx.beginPath();
    canvasCtx.fillStyle = "black";

    var width = canvasElement.width;
    var height = canvasElement.height;

    if (results.poseLandmarks)
    {
      const vis_array = [];
      for (const j in joints) {
        let d = {};
        d["name"] = j;
        if (results.poseLandmarks)
        {
          d["visibility"] = results.poseLandmarks[joints[j]].visibility;
        }
        else d["visibilty"] = 0;
        if (d["visibility"] > 0.5) d["color"] = "green";
        else d["color"] = "red";
        vis_array.push(d);
      }
      setVis(vis_array);
    } 
    else{
      console.log("no detections");
    }
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

  return (
    <div>
      <Row>
        <Col md={6}>
          <div className="align-items-center justify-content-center">
            <CanvasWebCam webcamRef={webcamRef} canvasRef={canvasRef} />
          </div>
        </Col>
        <Col md={6}>
        </Col>
      </Row>
      <Row style={{ marginTop: 400 }}>
      <div>
              <ReactBootStrap.Table bordered className="text-white">
                <thead className="text-dark">
                  <tr>
                    <th>Body Part</th>
                    <th>Visibilty</th>
                  </tr>
                </thead>
                <tbody>
                  {vis.map((vi, i) => {
                    return (
                      <tr key={i} style={{backgroundColor: `${vi.color}`}}>
                        <td>{vi.name}</td>
                        <td>{vi.visibility}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </ReactBootStrap.Table>
            </div>
      </Row>
    </div>
  )
}

export default CheckVisibility