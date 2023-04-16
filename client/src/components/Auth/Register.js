import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";

const Register = () => {
    let navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        name:"",
        email:"",
        password:"",
    })
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name, email, password} = credentials;
        console.log("submission", name, email, password)

        const response = await fetch(`https://api.health-ify.works/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
        });
        
        const json = await response.json();
        if (json.success) {
        // save tha uth and redirect
            localStorage.setItem("token", json.authToken);
            localStorage.setItem("email", json.user.email);
            navigate("/");
            setError("Account Created Succesfully", "success");
            } else {
            setError("Invalid Details", "danger");
        }
  };

  return (
    <div>
        <Row className='mt-4'>
            <Col md={2}>
                {error && <h2 style={{color:"red"}}>{error}</h2>}
            </Col>
            <Col className='mt-4'>
                <Card className='rounded-5 p-5'>
                    <Card.Body>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <h2 className='text-center font-weight-bold'>Register</h2>
                                <label className='form-label mt-2'>UserName</label>
                                <input type='text' name='name' required onChange={handleChange} value={credentials.name} className='form-control' placeholder='Enter Your username' minLength={3}/>
                                <label className='form-label mt-2'>Email</label>
                                <input type='email' name='email' required onChange={handleChange} value={credentials.email} className='form-control' placeholder='Enter Your Email'/>
                                <label className='form-label mt-2 mb-3'>Password</label>
                                <input type='password' name='password' required onChange={handleChange} value={credentials.password} className='form-control' placeholder='Enter Password' minLength={3}/>
                                <button className='btn btn-primary btn-xl mt-4 mb-4 justify-content-center'>LOGIN</button>
                            </form>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={2}></Col>
        </Row>
    </div>
  )
}

export default Register