import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss'
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
              <Route exact path='/' element={<Home/>}/>
              <Route exact path='/squats' element={<Squats/>}/>
              <Route exact path='/handExtension' element={<HandExtension/>}/>
              <Route exact path='/demo' element={<MediaPipeComp/>}/>
              <Route exact path='/rightHandExtension' element={<RightHandExtension/>}/>
              <Route exact path='/timer' element={<Timer/>}/>
              <Route exact path='/lunges' element={<Lunges/>}/>
              <Route exact path='/arom_flexion' element={<AromFlexion/>}/>
              <Route exact path='/arom_lateral_flexion' element={<AromLateralFlexion/>}/>
              <Route exact path='/shoulderExtension' element={<ShoulderExtension/>}/>
              <Route exact path='/check_visibility' element={<CheckVisibility/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
