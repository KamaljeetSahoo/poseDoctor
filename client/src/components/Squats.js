import React, { useRef, useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { joints } from "./Joints";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import CanvasWebCam from "./UI_Components/CanvasWebCam";
import { calculateAngles, degrees_to_radians } from "./utils";
import squatImg from "./images/squats.gif";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";


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
var totalAdhere = 0;

const Squats = () => {
  //check for authentication and redirect
  let navigate = useNavigate();
  useEffect(() => {
    console.log("check authentication");
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  const [show, setShow] = useState(false);
  const [count, setcount] = useState(0);
  const [adhere, setadhere] = useState(0);

  const switchCamFunction = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const webcamRef = useRef(0);
  const canvasRef = useRef(0);

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");

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
      //swap first and last
      var end_joint = {
        name: "right_hip",
        coord: [
          results.poseLandmarks[joints.right_hip].x,
          results.poseLandmarks[joints.right_hip].y,
        ],
        visibility: results.poseLandmarks[joints.right_hip].visibility,
      };
      var mid_joint = {
        name: "right_knee",
        coord: [
          results.poseLandmarks[joints.right_knee].x,
          results.poseLandmarks[joints.right_knee].y,
        ],
        visibility: results.poseLandmarks[joints.right_knee].visibility,
      };
      var first_joint = {
        name: "right_ankle",
        coord: [
          results.poseLandmarks[joints.right_ankle].x,
          results.poseLandmarks[joints.right_ankle].y,
        ],
        visibility: results.poseLandmarks[joints.right_ankle].visibility,
      };
      var angle = calculateAngles(
        first_joint.coord,
        mid_joint.coord,
        end_joint.coord
      );

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

      const point = ghoom_jao(Pts[1], Pts[0], 360 - point_angle);
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
      canvasCtx.lineTo(Pt3[0], Pt3[1]);
      canvasCtx.lineWidth = 7;
      canvasCtx.strokeStyle = "#FF0000";
      canvasCtx.stroke();

      canvasCtx.fillText("point", point[0] * width, point[1] * height);

      canvasCtx.fillText(
        mid_joint.name + " " + angle,
        mid_joint.coord[0] * width,
        mid_joint.coord[1] * height
      );

      
      if(first_joint.visibility > 0.8 && mid_joint.visibility > 0.8 && end_joint.visibility > 0.8){
        if (angle > high) {
          mode = false;
        }
        if (angle < low && mode == false) {
          setcount((prev) => {
            cnt = prev + 1;
            return prev + 1;
          });
          mode = true;
        }

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
      
      canvasCtx.fillText(count, 35, 60);

      if (cnt < totalAdhere / 2) {
        message = "keep going";
      } else if (cnt === totalAdhere / 2) {
        message = "Doing well!";
      } else if (cnt === totalAdhere) {
        message = "EXCELLENT!";
      } else if (cnt < totalAdhere) {
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
    totalTime = time;
    setTimer(`${parseInt(time / 3600)}:${parseInt(time / 60)}:${time}`);
    let adhere_ = document.getElementById("adhere").value;
    setadhere(adhere_);
    totalAdhere = adhere_;
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

  const addSquats = async (count, adhere, totalTime) => {
    const response = await fetch(`http://localhost:5001/api/squats/addSquats`,{
      method: 'POST',
      headers: {
        "auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        count: count,
        adherance: adhere,
        time: totalTime
      })
    })
    const resp = await response.json()
    console.log(resp)
  }


  if (timer === "0:0:1")
  {
    console.log("exercise over", count, cnt, adhere, totalTime)
    addSquats(count, adhere, totalTime)
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
              <div className="text-info font-weight-bold display-6">
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

export default Squats;
