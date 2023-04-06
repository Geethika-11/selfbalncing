const express = require("express"); //Line 1
const SerialPort = require("bluetooth-serial-port").BluetoothSerialPort;
const app = express(); //Line 2
let sensorData = {};
const port = process.env.PORT || 5000; //Line 3
const PORT = process.env.PORT || 6000;
// const { SerialPort } = require("serialport");
// const sport = new SerialPort({
//   path: "\\\\.\\COM3",
//   baudRate: 9600,
//   autoOpen: true,
// });
const btSerial = new SerialPort();
const errFunction = (err) => {
  if (err) {
    console.log("Error", err);
  }
};
console.log("Starting Server");
btSerial.on("found", function (address, name) {
  // If a device is found and the name contains 'HC' we will continue
  // This is so that it doesn't try to send data to all your other connected BT devices
  if (name.toLowerCase().includes("hc")) {
    btSerial.findSerialPortChannel(
      address,
      function (channel) {
        // Finds then serial port channel and then connects to it
        btSerial.connect(
          address,
          channel,
          function () {
            // Now the magic begins, bTSerial.on('data', callbackFunc) listens to the bluetooth device.
            // If any data is received from it the call back function is used
            btSerial.on("data", function (bufferData) {
              // The data is encoded so we convert it to a string using Nodes Buffer.from func
              console.log(Buffer.from(bufferData).toString());

              // Now we have received some data from the Arduino we talk to it.
              // We Create a Buffered string using Nodes Buffer.from function
              // It needs to be buffered so the entire string is sent together
              // We also add an escape character '\n' to the end of the string
              // This is so Arduino knows that we've sent everything we want
              btSerial.write(Buffer.from("From Node With Love\n"), errFunction);
            });
          },
          errFunction
        );
      },
      errFunction
    );
  } else {
    console.log("Not connecting to: ", name);
  }
});
let buffer = ""; // initialize an empty buffer to accumulate the incoming data

// define a regular expression to match the desired pattern
const regex = /start,(-?\d+\.\d+),(-?\d+\.\d+),(-?\d+\.\d+),end/g;

btSerial.on("data", (data) => {
  buffer += data; // append the incoming data to the buffer

  let match;
  let obj = {};
  while ((match = regex.exec(buffer)) !== null) {
    // for each match, extract the three values and put them in an object
    obj = {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      z: parseFloat(match[3]),
    };
    console.log(obj); // do whatever you want with the object
    io.to("clock-room").emit("Event", obj);
    buffer = buffer.slice(match.index + match[0].length); // remove the processed data from the buffer
  }
});
// Starts looking for Bluetooth devices and calls the function btSerial.on('found'
btSerial.inquire();

const socketIo = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.join("clock-room");

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});
setInterval(() => {
  io.to("clock-room").emit("time", new Date());
}, 1000);
server.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", port);
});

// This displays message that the server running and listening to specified port
app.listen(5001, () => console.log(`Listening on port ${5001}`)); //Line 6

// sport.on("data", (data) => {
//   // console.log("Received data:", data.toString());
//   const regex = /start(.*)end/;
//   const matches = regex.exec(data.toString());

//   if (matches) {
//     const values = matches[1].split(",");
//     const obj = {
//       x: parseFloat(values[0]),
//       y: parseFloat(values[1]),
//       z: parseFloat(values[2]),
//     };
//     sensorData = obj;
//     console.log(obj);
//     io.to("clock-room").emit("Event", sensorData);
//   }
// });

// // handle errors
// sport.on("error", (err) => {
//   console.error("Error:", err);
// });
// sport.close();

// create a GET route
app.get("/express_backend", (req, res) => {
  //Line 9
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" }); //Line 10
}); //Line 11

app.get("/exampleApi", (req, res) => {
  //Line 9
  const bar = req.query.data; // true
  // sport.write(bar);

  console.log("getting api call", bar);
  io.to("clock-room").emit("Event", bar);

  res.send({ express: bar }); //Line 10
  // sport.end();
}); //Line 11
app.get("/getVehicleStatus", (req, res) => {
  //Line 9
  const distressMessage = req.query.distressMessage; // true
  const location = req.query.location;
  const studentId = req.query.studentId;
  const timestamp = req.query.timestamp;
  const personname = req.query.personname;
  // sport.write(bar);
  const data = {
    message: distressMessage,
    location: location,
    id: studentId,
    timestamp: timestamp,
    personname: personname,
  };
  console.log("getting api call", data);
  io.to("clock-room").emit("Event", data);

  res.send({ express: data }); //Line 10
  // sport.end();
}); //Line 11
