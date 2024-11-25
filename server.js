const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Add CORS middleware
app.use(
  cors({
    origin: ["https://web-apps-732ac.web.app", "http://192.168.0.101:5173"], // Allow your frontend and local network IP
    methods: ["GET", "POST"], // Allowed methods
    credentials: true, // Allow credentials (cookies)
  })
);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: ["https://web-apps-732ac.web.app", "http://192.168.0.101:5173"], // Allow your frontend and local network IP
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Handle WebRTC signaling
  socket.on("offer", (offer, room) => {
    console.log(`Offer received from ${socket.id} for room ${room}`);
    console.log("Offer:", offer);
    socket.to(room).emit("offer", offer);
  });

  socket.on("answer", (answer, room) => {
    console.log(`Answer received from ${socket.id} for room ${room}`);
    console.log("Answer:", answer);
    socket.to(room).emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate, room) => {
    console.log(`ICE candidate received from ${socket.id} for room ${room}`);
    console.log("ICE Candidate:", candidate);
    socket.to(room).emit("ice-candidate", candidate);
  });

  // Room handling
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket ${socket.id} disconnected:`, reason);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:3000");
});
