import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import ExerciseCard from "./HomeComponents/ExerciseCard";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { Card, CardImg } from "react-bootstrap";

const ExerciseRegime = () => {
  const [show, setShow] = useState(true);
  return (
    <div>
      <h1 className="font-weight-bold m-4">My Exercise Regime</h1>
      {show && (
        <Alert onClose={() => setShow(false)} dismissible variant="danger">
          <p>
            Please avoid performing activities if your pain scale lies between 7
            and 10
          </p>
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <CardImg
                src="https://blog.myfitnesspal.com/wp-content/uploads/2020/07/UACF-Lunges-Featured.jpg"
                className="mt-3"
              />

              <div className=" d-flex bd-highlight">
                <div className="p-2 flex-fill bd-highlight ">
                  <h4 className="mt-2">Exercise Regime Plan 1</h4>
                </div>
                <div className="p-2 flex-fill bd-highlight mt-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm d-inline"
                    disabled
                  >
                    Morning
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm d-inline"
                  >
                    Evening
                  </button>
                </div>
              </div>

              <div className=" d-flex">
              <div class="ml-auto p-2 mx-5cd ">20% Completed</div>
              </div>

              <div className="progress" style={{ height: "1px" }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: "25%" }}
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <div className="d-flex bd-highlight">
                <div className="p-2 flex-fill bd-highlight ">
                  <h3>05 </h3> Exercises
                </div>
                <div className="p-2 flex-fill bd-highlight">
                  <h3>14 </h3> Sessions
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center">
        <Button className="btn-success btn-lg btn-block mt-4">
          <a
            href="/frame2"
            className="text-white font-weight-bold"
            style={{ textDecoration: "None" }}
          >
            Start
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ExerciseRegime;
