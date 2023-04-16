import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const Login = () => {
    let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://api.health-ify.works/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      // save tha uth and redirect
      localStorage.setItem("token", json.authToken);
      localStorage.setItem("email", json.user.email);
      console.log(json.user.email);
      navigate("/");
    } else navigate("/login");
  };

  return (
    <div>
      <Row className="mt-4">
        <Col md={2}></Col>
        <Col className="mt-4">
          <Card className="rounded-5 p-5">
            <Card.Body>
              <div>
                <form onSubmit={handleSubmit}>
                  <h2 className="text-center font-weight-bold">Login</h2>
                  <label className="form-label mt-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Your Email"
                  />
                  <label className="form-label mt-2 mb-3">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter Password"
                  />
                  <button className="btn btn-primary btn-xl mt-4 mb-4 justify-content-center">
                    LOGIN
                  </button>
                </form>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}></Col>
      </Row>
    </div>
  );
};

export default Login;
