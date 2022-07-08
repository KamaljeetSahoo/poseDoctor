import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

//exercise imports
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
import LeaderBoard from './components/Users/LeaderBoard'

import RightHandExtensionFixed from "./components/RightHandExtensionFixed";

//demo links
import LungesDemo from './components/DemoUsers/Lunges'
import RightHandExtensionDemo from './components/DemoUsers/RightHandExtension'
import SquatsDemo from './components/DemoUsers/Squats'

//authentication component imports
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Landing from "./components/Landing";

//User Profile imports
import Profile from './components/Users/Profile'

//dr reddy figma
import ExerciseRegime from './components/ExerciseRegime'


function App() {
  return (
      <Router>
        <div className="app">
          <NavbarComp/>
          <div className="container mt-3">
            <Routes>
              <Route exact path='/' element={<Home/>}/>
              <Route exact path='/poseDoc' element={<Landing/>}/>
              <Route exact path="/login" element={<Login/>}/>
              <Route exact path="/register" element={<Register/>}/>
              <Route exact path="/profile" element={<Profile/>}/>
              <Route exact path='/squats' element={<Squats/>}/>
              <Route exact path='/handExtension' element={<HandExtension/>}/>
              <Route exact path='/demo' element={<MediaPipeComp/>}/>
              <Route exact path='/rightHandExtension' element={<RightHandExtension/>}/>
              <Route exact path='/rightHandExtensionFixed' element={<RightHandExtensionFixed/>}/>
              <Route exact path='/timer' element={<Timer/>}/>
              <Route exact path='/lunges' element={<LungesDemo/>}/>
              <Route exact path='/arom_flexion' element={<AromFlexion/>}/>
              <Route exact path='/arom_lateral_flexion' element={<AromLateralFlexion/>}/>
              <Route exact path='/shoulderExtension' element={<ShoulderExtension/>}/>
              <Route exact path='/check_visibility' element={<CheckVisibility/>}/>
              <Route exact path='/leaderBoard' element={<LeaderBoard/>}/>
              <Route exact path='/rightHandExtensionDemo' element={<RightHandExtensionDemo/>}/>
              <Route exact path='/lungesDemo' element={<LungesDemo/>}/>
              <Route exact path='/squatsDemo' element={<SquatsDemo/>}/>
              <Route exact path='/exerciseRegime' element={<ExerciseRegime/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;

