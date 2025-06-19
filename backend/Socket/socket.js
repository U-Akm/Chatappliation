import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],  // Frontend URL without trailing slash
        methods: ['GET', 'POST']
    }
});

const userSocketmap = {};  // { userId: socketId }

export const getReciverSocketId = (receiverId) => {
    return userSocketmap[receiverId];
};

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== 'undefined') {
        userSocketmap[userId] = socket.id;
    }

    // Emit online users to this particular socket
    socket.emit('getOnlineUsers', Object.keys(userSocketmap));

    socket.on('disconnect', () => {
        delete userSocketmap[userId];  // Remove the socket when the user disconnects
        io.emit('getOnlineUsers', Object.keys(userSocketmap)); // Emit updated list of online users
    });
});

export { app, io, server };
