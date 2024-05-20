const mongoose = require('mongoose');

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/chatDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Підключено до MongoDB");
}).catch((err) => {
    console.error("Помилка підключення до MongoDB:", err);
});

const io = require('socket.io')(3000, {
    cors: {
        origin: "http://localhost",
    },
});

io.on('connection', (socket) => {
    console.log('Клієнт підключився:', socket.id);

    socket.on('disconnect', () => {
        console.log('Клієнт відключився:', socket.id);
        updateUsers();
    });

    socket.on('send private message', (data, info) => {

        socket.emit('new message', { msg: data, user: socket.username, chat: info });
        io.to(info).emit('new message', { msg: data, user: socket.username, chat: socket.id});
    });

    socket.on("send global message", (data, info) => {
        io.sockets.emit('new message', { msg: data, user: socket.username, chat: info });
    });

    socket.on("new user", (data) => {
        socket.username = data;

        io.sockets.emit('new user', { username: socket.username, id: socket.id});

        socket.join(data);

        const users = [];
        for (const socket of io.sockets.sockets.values()) {
            users.push({ username: socket.username, id: socket.id});
        }
        socket.emit('get user', users);

    });
});

function updateUsers() {
    const users = [];
    for (const socket of io.sockets.sockets.values()) {
        users.push({ username: socket.username, id: socket.id});
    }
    io.sockets.emit('get user', users);
}
