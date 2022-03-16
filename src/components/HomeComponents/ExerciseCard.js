import React from 'react'
import { Button, Card, CardImg } from 'react-bootstrap'

const ExerciseCard = ({title, link, imgLink}) => {
  return (
    <div className='text-center'>
        <Card className='shadow'>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <CardImg src={imgLink} className='mt-3'/>
                <Button className='btn-primary btn mt-4'><a href={link} className='text-white font-weight-bold' style={{textDecoration:'None'}}>Start</a></Button>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ExerciseCard