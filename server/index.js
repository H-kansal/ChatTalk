import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import ConnectDb from "./config/mongo.js";
import { VerifyToken, VerifySocketToken } from "./middlewares/VerifyToken.js";
import authRoutes from "./routes/auth.js";
import chatRoomRoutes from "./routes/chatRoom.js";
import chatMessageRoutes from "./routes/chatMessage.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || !process.env.CLIENT_ORIGIN) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Public authentication routes (no token required)
app.use("/api/auth", authRoutes);

// Protected routes (token verification middleware)
app.use(VerifyToken);

app.use("/api/room", chatRoomRoutes);
app.use("/api/message", chatMessageRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8080;

ConnectDb().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  const io = new Server(server, {
    cors: corsOptions,
  });

  io.use(VerifySocketToken);

  global.onlineUsers = new Map();

  const getKey = (map, val) => {
    for (let [key, value] of map.entries()) {
      if (value === val) return key;
    }
  };

  io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.emit("getUsers", Array.from(onlineUsers));
    });

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      const sendUserSocket = onlineUsers.get(receiverId);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("getMessage", {
          senderId,
          message,
        });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(getKey(onlineUsers, socket.id));
      socket.emit("getUsers", Array.from(onlineUsers));
    });
  });
}).catch((err) => {
  console.log("DB Connection failed", err);
});
