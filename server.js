// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('User connected');

    // Handle socket events here

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});

// Use this middleware to serve the Next.js app
app.use(express.static('public'));
app.use('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});
