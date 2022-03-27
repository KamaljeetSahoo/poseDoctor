import React, { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Button, Modal, Row, Col } from "react-bootstrap";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Doughnut } from "react-chartjs-2";
import { joints } from "./Joints";
import CanvasWebCam from "./UI_Components/CanvasWebCam";
import squatImg from "./images/squats.gif";
import { calculateAngles, degrees_to_radians } from "./utils";
import { useNavigate } from "react-router-dom";


const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: "Doughnut Chart",
      color: "blue",
      font: {
        size: 18,
      },
      responsive: true,
      animation: {
        animateScale: true,
      },
    },
  },
};

var mode = null;
var camera = null;
var cnt = 0;
var message = "start excercise";
var func = null;
var guide = 0;
var totalTime = null;

const RightHandExtension = () => {

  //check for authentication and redirect
  let navigate = useNavigate();
  useEffect(() => {
    console.log("check authentication")
    if(!localStorage.getItem("token")){
      navigate("/login")
    }
  }, [])

  const [show, setShow] = useState(false);
  const [count, setcount] = useState(0);
  const [adhere, setadhere] = useState(0);

  const switchCamFunction = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const data = {
    labels: ["Adherence", "rem"],
    datasets: [
      {
        label: "ADHERENCE",
        data: [count, adhere - count],
        borderColor: ["rgba(255,206,86,0.2)"],
        backgroundColor: ["rgba(232,99,132,1)", "rgba(232,211,6,1)"],
        pointBackgroundColor: "rgba(255,206,86,0.2)",
      },
    ],
  };

  const webcamRef = useRef(0);
  const canvasRef = useRef(0);

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");

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
    canvasCtx.rect(0, 0, 100, 100);
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
      };
      var mid_joint = {
        name: "right_elbow",
        coord: [
          results.poseLandmarks[joints.right_elbow].x,
          results.poseLandmarks[joints.right_elbow].y,
        ],
      };
      var end_joint = {
        name: "right_wrist",
        coord: [
          results.poseLandmarks[joints.right_wrist].x,
          results.poseLandmarks[joints.right_wrist].y,
        ],
      };

      var angle = calculateAngles(
        first_joint.coord,
        mid_joint.coord,
        end_joint.coord
      );

      var Pt1 = [first_joint.coord[0] * width, first_joint.coord[1] * height];
      var Pt2 = [mid_joint.coord[0] * width, mid_joint.coord[1] * height];
      var Pt3 = [end_joint.coord[0] * width, end_joint.coord[1] * height];
      var Pts = [Pt1, Pt2, Pt3];

      for (let i = 0; i < 3; i += 1) {
        Pts[i][1] *= -1;
      }
      var high = 135;
      var low = 60;
      var point_angle = low;
      var color = "#FFFFFF";
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

      // console.log("guide: ", guide, " point: ", point_angle, " color: ", color);
      const point = ghoom_jao(Pts[1], Pts[0], point_angle);
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

      canvasCtx.fillText("point", point[0] * width, point[1] * height);
      canvasCtx.fillText(
        mid_joint.name + " " + angle,
        mid_joint.coord[0] * width,
        mid_joint.coord[1] * height
      );

      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: color,
        lineWidth: 2,
      });
      // The dots are the landmarks
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: color,
        lineWidth: 2,
        radius: 2,
      });

      if (angle > high) {
        mode = false;
      }
      if (angle < low && mode === false) {
        setcount((prev) => {
          cnt = prev + 1;
          return prev + 1;
        });
        mode = true;
      }

      canvasCtx.fillText(cnt, 35, 60);

      if (count < adhere / 2) {
        message = "keep going";
      } else if (count === adhere / 2) {
        message = "Doing well!";
      } else if (count === adhere) {
        message = "EXCELLENT!";
      } else if (count < adhere) {
        message = "Very good!";
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
    // clearTimer(getDeadTime());
    console.log("model loading")
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

  const onClickReset = () => {
    // clearTimer(getDeadTime());
    setcount(0);
    cnt = 0;
    let time = document.getElementById("time").value;
    totalTime = time
    setTimer(`${parseInt(time / 3600)}:${parseInt(time / 60)}:${time}`);
    let adhere_ = document.getElementById("adhere").value;
    setadhere(adhere_);
    // console.log("=> ", time, adhere_);
    clearInterval(func);
    func = setInterval(() => {
      setTimer((cur) => {
        let c_ar = cur.split(":");
        let ts =
          parseInt(c_ar[0]) * 3600 + parseInt(c_ar[1]) * 60 + parseInt(c_ar[2]);
        // console.log("==> ", c_ar, ts);
        ts -= 1;
        if (ts < 0) ts = 0;
        return `${parseInt(ts / 3600)}:${parseInt(ts / 60)}:${ts}`;
      });
    }, 1000);
  };

  const addHandExtension = async(count, adherance, time) => {
    try{
      const response = await fetch(`http://localhost:5001/api/handExtension/addHandExtension`, {
        method: 'POST',
        headers: {
          "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          count: count,
          adherance: adherance,
          time: time
        })
      })
      const resp = await response.json()
      console.log(resp)
      if(resp){
        navigate("/profile")
      }
    }
    catch(error){
      console.log(error)
    }
  }

  if (timer === "0:0:1")
  {
    console.log("exercise over", count, cnt, adhere, totalTime)
    addHandExtension(count, adhere, totalTime)
  }

  const ModalComp = () => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div>
            <img className="img-fluid" src={squatImg} alt="squat" />
          </div>
        </Modal.Body>
      </Modal>
    );
  };
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
            <h2>{timer}</h2>
            <div className="form-group d-flex justify-content-between">
              <input
                type="number"
                className="form-control m-1"
                id="adhere"
                aria-describedby="emailHelp"
                placeholder="Adherence"
              />
              <input
                type="number"
                className="form-control m-1"
                id="time"
                aria-describedby="emailHelp"
                placeholder="Time in seconds"
              />
              <button className="btn btn-success" onClick={onClickReset}>
                Start
              </button>
            </div>
            <div className="d-flex justify-content-between">
              <h1>{count}</h1>
              <div className="text-danger font-weight-bold display-6">
                <p>{message}</p>
              </div>
            </div>
            <div>
              <Doughnut data={data} options={options} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RightHandExtension;
