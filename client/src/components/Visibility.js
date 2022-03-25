import React, {useState} from 'react'
import * as ReactBootStrap from "react-bootstrap";
import {joints} from './Joints'

const Visibility = ({joint_names, results}) => {
    const [vis, setVis] = useState([]);
    const vis_array = [];
    for (const j in joint_names) {
      let d = {};
      d["name"] = j;
      if (results.poseLandmarks)
        d["visibility"] = results.poseLandmarks[joints[j]].visibility;
      else d["visibilty"] = 0;
      if (d["visibility"] > 0.5) d["color"] = "green";
      else d["color"] = "red";
      vis_array.push(d);
    }
    setVis(vis_array);
  return (
    <div>
        <ReactBootStrap.Table bordered className="text-white">
        <thead className="text-dark">
            <tr>
            <th>Body Part</th>
            <th>Visibilty</th>
            </tr>
        </thead>
        <tbody>
            {vis.map((vi, i) => {
            return (
                <tr key={i} style={{backgroundColor: `${vi.color}`}}>
                <td>{vi.name}</td>
                <td>{vi.visibility}</td>
                </tr>
            )
            })}
        </tbody>
        </ReactBootStrap.Table>
    </div>
  )
}

export default Visibility