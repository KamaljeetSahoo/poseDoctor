import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Card, CardImg, Modal } from "react-bootstrap";
import useSound from "use-sound";
import boopSfx from "./boop.wav";

const Frame2 = () => {
  const [modalShow, setModalShow] = React.useState(true);
  const [modalShow2, setModalShow2] = React.useState(false);
  const [showText, setshowText] = React.useState(false);
  const [play] = useSound(boopSfx);

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>General Instructions</h4>
          <ul>
            <li>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in
            </li>
            <li>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in
            </li>
            <li>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-secondary btn-lg mt-4 mx-auto"
            onClick={() => {
              props.onHide();
              setModalShow2(true);
            }}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
  function MyVerticallyCenteredModal2(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="text-center">
          <h4>Healify gives real time feedback</h4>
          <p>
            Please turn on the sound to follow the voice recommendations.
            <Button onClick={play} className="mt-3">
              Check Sound!
            </Button>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-secondary btn-lg mt-4 mx-auto"
            onClick={props.onHide}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <MyVerticallyCenteredModal2
        show={modalShow2}
        onHide={() => setModalShow2(false)}
      />
      <Row>
        <Col md={6}>
          <div className=" d-flex">
            <div className="ml-auto p-2">
              <button
                type="button"
                className="btn btn-secondary "
                onClick={() => {
                  setshowText(true);
                }}
              >
                Instructions
              </button>
            </div>
          </div>
          <iframe
            src="https://www.youtube.com/embed/DbLtFtEXeIE"
            width={500}
            height={800}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture full"
          ></iframe>

          {showText && (
            <p className="mt-3" style={{ fontSize: "20px" }}>
              <b style={{ color: "grey" }}>
                {" "}
                Lets begin with pelvic tilt interior
              </b>
              <ul>
                <li>Inhale</li>
                <li>raise your hand aboce your head</li>
                <li>exhale with coming down</li>
              </ul>
              <button
                type="button"
                className="btn btn-secondary mx-auto"
                onClick={() => {
                  setshowText(false);
                }}
              >
                Close
              </button>
            </p>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Frame2;
