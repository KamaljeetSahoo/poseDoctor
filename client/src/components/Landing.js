import React from "react";
import "./landing.css";
import pd from "../images/pd.png";
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="container bg-dark2 mb-3">
      <div className="row">
        <div className="col-md-6">
          <img src={pd} className="img-fluid"></img>
        </div>
        <div className="col-md-6">
          <div className="card-transparent pr-5 pl-5">
            <div className="card-header text-center font-weight-bold">
              <i className="fa-solid fa-user-doctor landing_icon"></i> WELCOME!
            </div>
            <div className="card-block text-center d-flex justify-content-between">
                <div></div>
              <button className="btn bg-transparent btn-xl mt-4 mb-4 justify-content-center shadow-lg">
              <Link to="/register" style={{textDecoration:'none'}} className="text-white">
                    SIGN UP
                </Link>
              </button>
              <button className="btn bg-transparent btn-xl mt-4 mb-4 justify-content-center shadow-lg">
                <Link to="/login" style={{textDecoration:'none'}} className="text-white">
                    LOGIN
                </Link>
              </button>
              <div></div>
            </div>
            <div className="card-footer">
              <i className="fa-brands fa-instagram landing_icon"></i>
              <i className="fa-brands fa-facebook landing_icon"></i>
              <i className="fa-brands fa-github landing_icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
