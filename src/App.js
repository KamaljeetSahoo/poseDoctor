import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Squats from "./components/Squats";
import Home from "./components/Home";
import HandExtension from "./components/HandExtension";
import NavbarComp from "./components/UI_Components/Navbar";
import MediaPipeComp from "./components/MediaPipeComp";
import RightHandExtension from './components/RightHandExtension'
import Timer from './components/timer'
import Lunges from './components/Lunges';
import AromFlexion from './components/AromFlexion';
import AromLateralFlexion from './components/AromLateralFlexion';
import ShoulderExtension from './components/ShoulderExtension';
import CheckVisibility from "./components/CheckVisibility";

function App() {
  return (
      <Router>
        <div className="app">
          <NavbarComp/>
          <div className="container mt-3">
            <Routes>
              <Route exact path='/poseDoctor' element={<Home/>}/>
              <Route exact path='/poseDoctor/squats' element={<Squats/>}/>
              <Route exact path='/poseDoctor/handExtension' element={<HandExtension/>}/>
              <Route exact path='/poseDoctor/demo' element={<MediaPipeComp/>}/>
              <Route exact path='/poseDoctor/rightHandExtension' element={<RightHandExtension/>}/>
              <Route exact path='/poseDoctor/timer' element={<Timer/>}/>
              <Route exact path='/poseDoctor/lunges' element={<Lunges/>}/>
              <Route exact path='/poseDoctor/arom_flexion' element={<AromFlexion/>}/>
              <Route exact path='/poseDoctor/arom_lateral_flexion' element={<AromLateralFlexion/>}/>
              <Route exact path='/poseDoctor/shoulderExtension' element={<ShoulderExtension/>}/>
              <Route exact path='/poseDoctor/check_visibility' element={<CheckVisibility/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
