import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

const Login = () => {
  return (
    <div>
        <Row className='mt-4'>
            <Col md={2}></Col>
            <Col className='mt-4'>
                <Card className='rounded-5 p-5'>
                    <Card.Body>
                        <div>
                            <form>
                                <h2 className='text-center font-weight-bold'>Login</h2>
                                <label className='form-label mt-2'>Email</label>
                                <input type='email' name='email' required  className='form-control' placeholder='Enter Your Email'/>
                                <label className='form-label mt-2 mb-3'>Password</label>
                                <input type='password' name='password' required  className='form-control' placeholder='Enter Password'/>
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

export default Login