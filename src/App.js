import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss'
import Squats from "./components/Squats";
import Home from "./components/Home";
import HandExtension from "./components/HandExtension";
import NavbarComp from "./components/UI_Components/Navbar";
import MediaPipeComp from "./components/MediaPipeComp";

function App() {
  return (
      <Router>
        <div className="app">
          <NavbarComp/>
          <div>
            <Routes>
              <Route exact path='/' element={<MediaPipeComp/>}/>
              <Route exact path='/squats' element={<Squats/>}/>
              <Route exact path='/handExtension' element={<HandExtension/>}/>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
