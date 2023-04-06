import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const MainPage = ({ data, arrayOfMessages }) => {
  const { x, y, z } = data;
  console.log("data coming here", arrayOfMessages);
  const transformStyle = `translate3d(${x * 10}px, ${y * 10}px, ${z * 10}px)`;

  return (
    <div>
      the Values from the hardware comming here{" "}
      <h1>
        {" "}
        x: {x} y : {y} z: {z}
      </h1>
      <div
        style={{
          width: "50px",
          height: "50px",
          backgroundColor: "red",
          transform: transformStyle,
        }}
      ></div>
      <svg width="200" height="200" style={{ transform: transformStyle }}>
        <line
          x1={`${x * 10}`}
          y1={`${y * 10}`}
          x2="200"
          y2="100"
          stroke="black"
        />
      </svg>
      <div>
        <LineChart width={800} height={400} data={arrayOfMessages}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="x" stroke="#8884d8" />
          <Line type="monotone" dataKey="y" stroke="#82ca9d" />
          <Line type="monotone" dataKey="z" stroke="#ffc658" />
        </LineChart>
      </div>
    </div>
  );
};

export default MainPage;
