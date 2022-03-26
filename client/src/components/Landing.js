import React from 'react'
import { Card, Col, Row } from "react-bootstrap";
import "./landing.css";
import pd from "../images/pd.png";

const Landing = () => {
  return (
    <div className='container-landingpage bg-dark2 mb-3'>
        <div className='col'>
          <img src={pd} className="img-fluid">

          </img>
        </div>
        <div className='col'>
        <div className="card-transparent">
          <div class="card-header text-center font-weight-bold"><i class="fa-solid fa-user-doctor landing_icon"></i>  WELCOME!</div>
          <div class="card-block">
          <button className="btn bg-transparent btn-xl mt-4 mb-4 justify-content-center">
                    SIGNUP
          </button>
          <button className="btn bg-transparent btn-xl mt-4 mb-4 justify-content-center">
            LOGIN
          </button>
          </div>
          <div class="card-footer">
            <i class="fa-brands fa-instagram landing_icon"></i>
            <i class="fa-brands fa-facebook landing_icon"></i>
            <i class="fa-brands fa-github landing_icon"></i>
          </div>
        </div>
        </div>
        
    </div>
  );
  
}

export default Landing