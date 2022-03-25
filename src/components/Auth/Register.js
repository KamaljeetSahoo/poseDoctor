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

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        const {name, email, password} = credentials;
        console.log("submission", name, email, password)
    }
  return (
    <div>
        <Row className='mt-4'>
            <Col md={2}></Col>
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