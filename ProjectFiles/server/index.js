import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import SocketHandler from "./utils/SocketHandler.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Connect DB
connectDB();

// Routes
app.use("/", authRoutes);
app.use("/", freelancerRoutes);
app.use("/", projectRoutes);
app.use("/", applicationRoutes);
app.use("/", chatRoutes);
app.use("/", userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Socket.io configuration - FIX THIS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
  // Add these options
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["polling", "websocket"],
});

// Make io available globally
global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Add error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  SocketHandler(socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 6001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
