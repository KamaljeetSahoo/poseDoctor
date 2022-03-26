import React, { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Button, Modal } from "react-bootstrap";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Doughnut } from "react-chartjs-2";
import { joints } from "./Joints";
import CanvasWebCamFixed from "./UI_Components/CanvasWebCamFixed";
import squatImg from "./images/squats.gif";

// var count = 0;
var mode = null;
// var adhere = 10;
var camera = null;
var cnt = 0;
var message = "start excercise";
var func = null;
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
const RightHandExtensionFixed = () => {
  const [show, setShow] = useState(false);
  const [count, setcount] = useState(0);
  const [adhere, setadhere] = useState(0);
  const switchCamFunction = useRef(null);

  // const count = props.count;
  // const setcount = props.setcount;
  console.log("Rendering... ", count);

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

  function calculateAngles(a, b, c) {
    var radians =
      Math.atan2(c[1] - b[1], c[0] - b[0]) -
      Math.atan2(a[1] - b[1], a[0] - b[0]);
    var angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) angle = 360 - angle;
    return angle;
  }

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
        visibility: results.poseLandmarks[joints.right_shoulder].visibility,
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

      if (first_joint.visibility > 0.99) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(0, 0);
        canvasCtx.lineTo(canvasElement.width, 0);
        canvasCtx.lineTo(canvasElement.width, canvasElement.height);
        canvasCtx.lineTo(0, canvasElement.height);
        canvasCtx.lineTo(0, 0);
        canvasCtx.lineWidth = 15;
        canvasCtx.strokeStyle = "#80e885";
        canvasCtx.stroke();
      } else {
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

      canvasCtx.fillText(
        mid_joint.name + " " + angle,
        mid_joint.coord[0] * width,
        mid_joint.coord[1] * height
      );

      var high = 160;
      var low = 60;

      if (angle > high) {
        mode = false;
      }
      if (angle < low && mode == false) {
        // count += 1; // prats

        setcount((prev) => {
          cnt = prev + 1;
          return prev + 1;
        });
        console.log("incrementing count ", cnt);

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
    // clearTimer(getDeadTime());

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
    let time = document.getElementById("time").value;
    setTimer(`${parseInt(time / 3600)}:${parseInt(time / 60)}:${time}`);
    let adhere_ = document.getElementById("adhere").value;
    setadhere(adhere_);
    console.log("=> ", time, adhere_);
    clearInterval(func);
    func = setInterval(() => {
      setTimer((cur) => {
        let c_ar = cur.split(":");
        let ts =
          parseInt(c_ar[0]) * 3600 + parseInt(c_ar[1]) * 60 + parseInt(c_ar[2]);
        console.log("==> ", c_ar, ts);
        ts -= 1;
        if (ts < 0) ts = 0;
        return `${parseInt(ts / 3600)}:${parseInt(ts / 60)}:${ts}`;
      });
    }, 1000);
  };

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
      <div className="mt-5">
      <div className="justify-content-center">
          <Button variant="primary" onClick={handleShow} className="m-1">
            Show Example
          </Button>
          <Button variant="primary" onClick={() => switchCamFunction.current()} className="m-1">
            Switch Camera
          </Button>
          <ModalComp />
          <CanvasWebCamFixed
            webcamRef={webcamRef}
            canvasRef={canvasRef}
            switchCamFunction={switchCamFunction}
          />
        </div>
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="App">
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
              <h1>{count}</h1>
            </div>
            <div className="text-danger font-weight-bold display-6">
              <p>{message}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightHandExtensionFixed;
