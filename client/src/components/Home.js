import React from 'react'
import { Col, Row } from 'react-bootstrap'
import ExerciseCard from './HomeComponents/ExerciseCard'
import Footer from './HomeComponents/Footer'

const Home = () => {
  return (
    <div>
      <h1 className='font-weight-bold m-4'>Exercises</h1>
      <Row>
        <Col md={3}>
          <ExerciseCard
            title={'Lunges'}
            imgLink={'https://blog.myfitnesspal.com/wp-content/uploads/2020/07/UACF-Lunges-Featured.jpg'}
            link={'/lunges'}/>
        </Col>
        <Col md={3}>
          <ExerciseCard
            title={'Squats'}
            imgLink={'https://post.healthline.com/wp-content/uploads/2019/03/Female_Squat_Studio_732x549-thumbnail-2.jpg'}
            link={'/squats'}/>
        </Col>
        <Col md={3}>
          <ExerciseCard
            title={'Shoulder Extension'}
            imgLink={'https://cdn-prod.medicalnewstoday.com/content/images/articles/324/324647/man-doing-cross-body-shoulder-stretch-for-arm-warmup.jpg'}
            link={'/shoulderExtension'}/>
        </Col>
        <Col md={3}>
          <ExerciseCard
            title={'Hand Extension'}
            imgLink={'https://shoulderelbow.org/wp-content/uploads/2017/01/flexion-extension.jpg'}
            link={'/rightHandExtension'}/>
        </Col>
      </Row>
      <Row>
        <h1 className='font-weight-bold m-4'>AROM</h1>
        <Col md={4}>
          <ExerciseCard
            title={'FLexion'}
            imgLink={'https://amactraining.co.uk/wp-content/uploads/2014/05/flexion-extension.png'}
            link={'/arom_flexion'}
          />
        </Col>
        <Col md={4}>
          <ExerciseCard
            title={'Lateral Flexion'}
            imgLink={'https://robinsonsstrengthandendurancecoaching.files.wordpress.com/2016/03/stretch-14.jpg?w=663'}
            link={'/arom_lateral_flexion'}
          />
        </Col>
      </Row>
      <Row>
        <h2 className='font-weight-bold m-4'>Check Visibilty Score on Your Device</h2>
        <Col md={4}>
          <ExerciseCard 
            title={'Pose Visibility'}
            imgLink={'https://viso.ai/wp-content/uploads/2021/01/Keypoints-Detected-by-OpenPose-on-the-COCO-Dataset.jpg'}
            link={'/check_visibility'}
          />
        </Col>
      </Row>
      <Footer/>
    </div>
  )
}

export default Home