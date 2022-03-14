import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss'
import Squats from "./components/Squats";
import Home from "./components/Home";
import HandExtension from "./components/HandExtension";
import AppLayout from "./layouts/AppLayout";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar/>
        <div>
          <Routes path='/' element={<AppLayout/>}>
            <Route index element={<Home/>}/>
            <Route exact path='/squats' element={<Squats/>}/>
            <Route exact path='/handExtension' element={<HandExtension/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
