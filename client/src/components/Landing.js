import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./landing.css";
import pd from "../images/pd.png";

const Landing = () => {
  return (
    <div className="container bg-dark2 mb-3">
      <div className="row">
        <div className="col-md-6">
          <img src={pd} className="img-fluid"></img>
        </div>
        <div className="col-md-6">
          <div className="card-transparent pr-5">
            <div class="card-header text-center font-weight-bold">
              <i class="fa-solid fa-user-doctor landing_icon"></i> WELCOME!
            </div>
            <div class="card-block text-center d-flex justify-content-between">
                <div></div>
              <button className="btn bg-transparent btn-xl mt-4 mb-4 justify-content-center shadow-lg">
                SIGNUP
              </button>
              <button className="btn bg-transparent btn-xl mt-4 mb-4 justify-content-center shadow-lg">
                LOGIN
              </button>
              <div></div>
            </div>
            <div class="card-footer">
              <i class="fa-brands fa-instagram landing_icon"></i>
              <i class="fa-brands fa-facebook landing_icon"></i>
              <i class="fa-brands fa-github landing_icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
