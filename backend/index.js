const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config({
    path: "./config/.env"
});

const app = express();

const server = http.createServer(app);

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", require("./routes/userRoutes"));

const PORT = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("typing", (room) => {
        socket.to(room).emit("user_typing");
    });

    socket.on("stop_typing", (room) => {
    socket.to(room).emit("user_stop_typing");
    });

    socket.on("join_room", (room) => {
        socket.join(room);

        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        console.log("Message received:", data);

        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is working on port: ${PORT}`);
});