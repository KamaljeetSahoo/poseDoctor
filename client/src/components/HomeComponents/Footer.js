import React from 'react'
import { Col, Row } from 'react-bootstrap'

const Footer = () => {
  return (
    <div className='mt-5 bg-dark'>
        <div className='bg-dark text-white m-5 text-center'>
            <Row>
                <Col md={6}>
                    <p className='display-1 m-5' style={{fontFamily:'Monoton'}}>Healthify</p>
                    <p>By Team KAPS</p>
                </Col>
                <Col md={6} className='mt-5 mb-5'>
                    <a href='https://github.com/adyashajena-26/HEALTHIFY'><img height={150} width={150} src='https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU' alt='github'/></a>
                </Col>
            </Row>
        </div>
    </div>
  )
}

export default Footer