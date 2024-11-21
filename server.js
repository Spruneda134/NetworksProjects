const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// "database"
let chatMessages = [];
let userCount = 0;

app.use(express.static("public"));

// load page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Handle incoming WebSocket connections
io.on("connection", (socket) => {
    userCount++;
    const userName = "Person " +userCount;
    console.log(`${userName} connected`);

    socket.emit("chat history", chatMessages);

    // Listen for new messages
    socket.on("chat message", (msg) => {
        const formattedMsg = `${userName}: ${msg}`;
        chatMessages.push(formattedMsg);

        io.emit("chat message", formattedMsg);
    });

    socket.on("disconnect", () => {
        console.log(`${userName} disconnected`);
    });
});

// Start server
server.listen(3000, () => {
    console.log("server running on port 3000");
});
