import React, { useEffect, useState } from "react";
import "./App.css";

import { io } from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Link,
} from "react-router-dom";
//"http://192.168.43.84:5000/getVehicleStatus?distressMessage=%20danger%20danger&studentId=3&location=14.4292614,79.9106773&timestamp=2022-03-28T13:00:00.000Z&personname=nikki";
import LandingPage from "./components/LandingPage";
function App() {
  const [data1, setData] = useState("");
  const [arrayOfMessages, setArrayOfMessages] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.on("connect", () => console.log(socket.id));
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on("Event", (data) => {
      console.log("sending this", data);
      
      setTimeout(() => {
        setData(data);
        let x= arrayOfMessages
        x.push(data)
        if(x.length>100){
          const y= x.slice(-80)
          setArrayOfMessages(y)
        }
        else{
          setArrayOfMessages(x)
        }
       
      }, 1000);
    });
    socket.on("disconnect", () => setData("server disconnected"));
  }, []);
  // useEffect(() => {
  //   console.log(arrayOfMessages.length);
  //   if (arrayOfMessages.length > 50) {
  //     setArrayOfMessages([]);
  //   }
  // }, [arrayOfMessages]);
  console.log(data1);
  return (
    <div>
      {/* <h1>http://10.42.171.70:5001/exampleApi?data={data}</h1> */}

      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light"></nav>
          <hr />
          <Switch>
            <Route
              exact
              path="/"
              element={
                <LandingPage data={data1} arrayOfMessages={arrayOfMessages} />
              }
            />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
