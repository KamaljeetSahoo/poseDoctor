import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const SquatChart = ({data}) => {
  const [rate, setRate] = useState([]);
  useEffect(() => {
    var r = [];
    for (var i = 0; i < data.length; i++) {
      r.push({
        ...data[i],
        date: data[i].date,
        rate: data[i].count / data[i].totalTime,
      });
    }
    setRate(r);
  }, [data]);

  return (
    <div className="card shadow mt-5 text-center p-4">
      <h2>Squats</h2>
      <Row>
        <Col md={6}>
          <div
            style={{
              WebkitBoxSizing: "border-box",
              MozBoxSizing: "border-box",
              boxSizing: "border-box",
              padding: "10px",
              width: "100%",
              height: "300px",
              backgroundColor: "#fff",
            }}
          >
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
              >
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
        </Col>
        <Col md={6}>
          <div
            style={{
              WebkitBoxSizing: "border-box",
              MozBoxSizing: "border-box",
              boxSizing: "border-box",
              padding: "10px",
              width: "100%",
              height: "300px",
              backgroundColor: "#fff",
            }}
          >
            <ResponsiveContainer>
              <AreaChart
                data={rate}
                margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SquatChart;
