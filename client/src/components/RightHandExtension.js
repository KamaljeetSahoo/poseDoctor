import React, { useEffect, useRef, useState } from "react";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Button, Col, Modal, Row } from 'react-bootstrap'
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";
import { Doughnut } from "react-chartjs-2";
import { joints } from "./Joints";
import CanvasWebCam from "./UI_Components/CanvasWebCam";
import squatImg from './images/squats.gif'


// var count = 0;
var mode = null;
// var adhere = 10;
var camera = null;
var cnt=0;
var message = "start excercise";
var func = null;
const RightHandExtension = () => {
  const [show, setShow] = useState(false);
  const [count, setcount] = useState(0);
  const [adhere, setadhere] = useState(0);


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

  const webcamRef = useRef(0);
  const canvasRef = useRef(0);
  const Ref = useRef(null);

  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };
  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);

    if (total >= 0) {
      setTimer(
        (hours > 19 ? hours : "0" + hours) +
          ":" +
          (minutes > 19 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 19 ? seconds : "0" + seconds)
      );
    }
  };

  const getDeadTime = () => {
    let deadline = new Date();

    deadline.setSeconds(deadline.getSeconds() + 20);
    return deadline;
  };

  function calculateAngles(a, b, c) {
    var radians =
      Math.atan2(c[1] - b[1], c[0] - b[0]) -
      Math.atan2(a[1] - b[1], a[0] - b[0]);
    var angle = Math.abs((radians * 180.0) / Math.PI);

    if (angle > 180.0) angle = 360 - angle;
    return angle;
  }

  const rotate=(a,b,c,angle)=>{

    var xnew = Math.cos(angle) * (a[0] - b[0]) - Math.sin(angle) * (a[1] - b[1]) + b[0];
    var ynew = Math.sin(angle) * (a[0] - b[0]) + Math.cos(angle) * (a[1] - b[1]) + b[1];    

    const point=[xnew,ynew];    
    
    return point;
  }

  function degrees_to_radians(degrees)
  {
    var pi = Math.PI;
    return degrees * (pi/180);
  }

  const ghoom_jao = (o, p, ang) => {
    let cos_theta = Math.cos(degrees_to_radians(ang)), sin_theta = Math.sin(degrees_to_radians(ang));
    let x = cos_theta * (p[0] - o[0]) - sin_theta * (p[1] - o[1]) + o[0];
    let y = sin_theta * (p[0] - o[0]) + cos_theta * (p[1] - o[1]) + o[1];
    return [x, y];
  };

  function poseEstimation(results) {
    // console.log("pose estimate");
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
      console.log("==> F:", Pt1, " M: ", Pt2, " E: ", Pt3);

      console.log("[0-1] => ", first_joint.coord,mid_joint.coord,end_joint.coord,180);
      // console.log(point[0]*width,point[1]*height);
      // y-coord adjust
      for(let i = 0; i<3; i+=1){
        Pts[i][1] *= -1;
      }
      // const point=rotate(first_joint.coord,mid_joint.coord,end_joint.coord,20) ;
      // const point=rotate(Pts[0],Pts[1],Pts[2],30) ;
      const point = ghoom_jao(Pts[1], Pts[0], 60);
      point[1] *= -1;
      console.log("Point : ", point, " Org : ", Pts[1]);

      // back to original
      for(let i = 0; i<3; i+=1){
        Pts[i][1] *= -1;
      }

      canvasCtx.beginPath();
      // canvasCtx.moveTo(mid_joint.coord[0]*width, mid_joint.coord[1]*height);
      // canvasCtx.lineTo(point[0]*width,point[1]*height);
      // new --
      canvasCtx.moveTo(Pts[1][0], Pts[1][1]);
      canvasCtx.lineTo(point[0],point[1]);
      canvasCtx.lineWidth = 7;
      canvasCtx.strokeStyle = "#FF0000"; 
      
      // canvasCtx.moveTo(mid_joint.coord[0], mid_joint.coord[1]);
      // canvasCtx.lineTo(point[0],point[1]);      
      canvasCtx.stroke();  

      canvasCtx.fillText(
        "point",
        point[0] * width,
        point[1] * height
      );

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
        
        setcount( prev => {
          cnt=prev+1;
          return prev + 1;
        });
        // console.log("incrementing count ", cnt);

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
    // console.log("dot landmarks:",results.poseLandmarks);
    // drawLandmarks(canvasCtx, results.poseWorldLandmarks, {
    //   color: "#FFFFFF",
    //   lineWidth: 2,
    //   radius: 2,
    // });

    // console.log("landmarks:",results.poseWorldLandmarks);

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

    // Another way to call the clearTimer() to start
    // the countdown is via action event from the
    // button first we create function to be called
    // by the button
  }, []);

  const onClickReset = () => {
    // clearTimer(getDeadTime());
    setcount(0);
    cnt=0;
    let time = document.getElementById("time").value;
    setTimer(`${parseInt(time/3600)}:${parseInt(time/60)}:${time}`);
    let adhere_ = document.getElementById("adhere").value;
    setadhere(adhere_);
    // console.log("=> ", time, adhere_);
    clearInterval(func);
    func = setInterval(() => {
      setTimer(cur => {
        let c_ar = cur.split(":");
        let ts = parseInt(c_ar[0]) * 3600 + parseInt(c_ar[1]) * 60 + parseInt(c_ar[2]) ;
        console.log("==> ", c_ar, ts);
        ts -= 1;
        if(ts < 0) ts = 0;
        return `${parseInt(ts/3600)}:${parseInt(ts/60)}:${ts}`;
      })
    }, 1000);
  };


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
      <div className="mt-5">
        <div class="row">
          <div class="col-md-6">
            <div className="App">
              <h2>{timer}</h2>
              <div class="form-group">
                <label for="adhere">Adherence</label>
                <input type="number" class="form-control" id="adhere" aria-describedby="emailHelp" placeholder="Adherence" />
              </div>
              <div class="form-group">
                <label for="time">Time in seconds</label>
                <input type="number" class="form-control" id="time" aria-describedby="emailHelp" placeholder="Time in seconds" />
              </div>

              <button className="btn btn-success" onClick={onClickReset}>
                Reset
              </button>
              <h1>{count}</h1>
            </div>
            <div class="text-danger font-weight-bold display-6"><p>{message}</p></div>
          </div>
          <div class="col-md-6">
            <div>
              <Doughnut data={data} options={options} />
            </div>
          </div>
        </div>
        <div className='align-items-center justify-content-center'>
									<Button variant="primary" onClick={handleShow}>
										Show Example
									</Button>
									<ModalComp/>
									<CanvasWebCam webcamRef={webcamRef} canvasRef={canvasRef} />
                </div>
      </div>

      <br></br>
      <br></br>
      <br></br>
      <p>{count}</p>
    </div>
  );
};

export default RightHandExtension;
