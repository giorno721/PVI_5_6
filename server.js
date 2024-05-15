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

    socket.on('send message', (data, info) => {
        if (info === "all") {
            io.sockets.emit('new message', { msg: data, user: socket.username, chat: info });

            updateUsers();
            return;
        }

        socket.emit('new message', { msg: data, user: socket.username, chat: info }); //собі
        io.to(info).emit('new message', { msg: data, user: socket.username, chat: socket.username});

        updateUsers();
    });

    socket.on("new user", (data) => {
        socket.username = data;
        socket.join(data);
        updateUsers();
    });
});

function updateUsers() {
    const users = [];
    for (const socket of io.sockets.sockets.values()) {
        users.push({ username: socket.username});
    }
    io.sockets.emit('get user', users);
}
