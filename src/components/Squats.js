import React, {useRef} from 'react'
import { Col, Row } from 'reactstrap'
import Webcam from 'react-webcam'

const Squats = () => {
    const webcamRef = useRef(0)
    const canvasRef = useRef(0)
  return (
    <div>
        <Row>
            <Col md={6}>
                <div className='align-items-center justify-content-center'>
									<Webcam
									ref={webcamRef}
									style={{
											position: "absolute",
											marginLeft: "0px",
											marginRight: "0px",
											textAlign: "center",
											zindex: 9,
											width: "400",
											height: 'auto',
											marginBottom: "0px",
									}} />
									<canvas
									ref={canvasRef}
									style={{
											position: "absolute",
											marginLeft: "0px",
											marginRight: "0px",
											textAlign: "center",
											zindex: 9,
											width: "400",
											height: 'auto',
											marginBottom: "0px"
									}}>
									</canvas>
                </div>
            </Col>
            <Col md={6} style={{position:'relative'}}>Hello</Col>
        </Row>
				<Row>
					Hello
				</Row>
    </div>
  )
}

export default Squats