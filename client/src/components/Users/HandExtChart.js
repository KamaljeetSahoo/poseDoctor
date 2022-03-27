import React from "react";
import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HandExtChart = ({ data }) => {
  return (
      <div style={{WebkitBoxSizing:'border-box', MozBoxSizing:'border-box', boxSizing:'border-box', padding:'10px', width:'100%', height:'400px', backgroundColor:"#fff"}}>
        <ResponsiveContainer>
      <BarChart data={data} margin={{top:5, right:50, left:20, bottom:5}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
        <Bar dataKey="adherance" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
      </div>
  );
};

export default HandExtChart;
