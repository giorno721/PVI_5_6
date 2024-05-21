const mongoose = require('mongoose');

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/chatHistory', {
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

// Визначення схеми для користувачів
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

// Визначення моделі для користувачів
const User = mongoose.model('User', userSchema);

// Визначення схеми для чатів
const messageSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    msg: {
        type: String,
        required: true,
    },
});

const Message = mongoose.model('Message', messageSchema);

// Define a new schema for routes collection
const routeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
});

// Define model for routes collection
const Route = mongoose.model('Route', routeSchema);

io.on('connection', (socket) => {
    console.log('Клієнт підключився:', socket.id);

    socket.on('disconnect', () => {
        console.log('Клієнт відключився:', socket.id);
        updateUsers();
    });

    socket.on('send message', async (data, info) => {
        console.log('Повідомлення:', data, 'Інформація:', info, "event: send messages");
        try {
            const senderUser = await User.findOne({ name: socket.username });
            if (!senderUser) {
                throw new Error('Користувач не знайдений');
            }

            const newMessage = new Message({
                sender: senderUser._id,
                recipient: null,
                msg: data,
            });

            if (info === "global-chat") {
                await newMessage.save();
                await Route.updateMany({}, { $push: { messages: newMessage._id } });
                io.sockets.emit('new message', { msg: data, user: socket.username, chat: info });
            } else {
                const recipientSocket = io.sockets.sockets.get(info);
                if (!recipientSocket) {
                    throw new Error('Отримувач не знайдений');
                }

                const recipientUser = await User.findOne({ name: recipientSocket.username });
                if (!recipientUser) {
                    throw new Error('Отримувач не знайдений');
                }

                newMessage.recipient = recipientUser._id;
                await newMessage.save();

                console.log('New private message:', newMessage);
                await Route.updateMany(
                    { _id: { $in: [newMessage.sender, newMessage.recipient] } },
                    { $push: { messages: newMessage._id } }
                );
                console.log('Emitting new private message:', { msg: data, user: socket.username, chat: info });

                socket.emit('new message', { msg: data, user: socket.username, chat: info });
                recipientSocket.emit('new message', { msg: data, user: socket.username, chat: socket.id });
            }

        } catch (error) {
            console.error('Помилка при відправленні повідомлення:', error);
        }
    });


    socket.on('new user', async (data) => {
        console.log('Новий користувач:', data);
        try {
            let user = await User.findOne({ name: data });
            let route;
            if (!user) {
                user = new User({ name: data });
                route = new Route({ _id: user._id, messages: [] });

                try {
                    const messages = await Message.find({ recipient: null });
                    messages.forEach(message => {
                        route.messages.push(message._id);
                    });
                    await route.save();
                    await user.save();
                } catch (error) {
                    console.error(error);
                }
            }

            console.log('Новий користувач:', data);
            socket.username = data;
            console.log('Socket username:', socket.username)
            io.sockets.emit('new user', { username: socket.username, id: socket.id });

            socket.join(data);

            updateUsers();
        } catch (error) {
            console.error('Помилка при додаванні нового користувача:', error);
        }
    });

    socket.on('get chat messages', async (recipients) => {
        console.log('Getting chat messages:', recipients);

        const getMessagesWithNames = async (messages) => {
            return Promise.all(messages.map(async (message) => {
                const sender = await User.findById(message.sender);
                const recipient = await User.findById(message.recipient);
                return {
                    sender: sender.name,
                    recipient: recipient ? recipient.name : null,
                    msg: message.msg
                };
            }));
        };

        try {
            console.log('Socket username:', socket.username);
            const user = await User.findOne({ name: socket.username });
            console.log('User:', user);
            const route = await Route.findById(user._id).populate('messages');
            // console.log('Route:', route);

            if (!route) {
                throw new Error('Route not found');
            }

            const namedMessages = await getMessagesWithNames(route.messages);

            if (!recipients || recipients.length === 0) {
                const globalMessages = namedMessages.filter(message => message.recipient === null);

                console.log("Emitting global chat messages:", globalMessages);
                socket.emit('chat messages', globalMessages);
                return;
            }

            const recipientUsers = await User.find({ name: { $in: recipients } });
            const recipientUserIds = recipientUsers.map(user => user._id.toString());

            if (!recipientUsers || recipientUsers.length !== recipients.length) {
                throw new Error('One or more recipients not found');
            }

            // console.log('Recipients:', recipients);
            // console.log('Recipient Users:', recipientUsers);
            // console.log('Recipient User IDs:', recipientUserIds);
            // console.log('Route messages:', route.messages);

            // Filter messages where both sender and recipient are in recipientUserIds
            const filteredMessages = route.messages.filter(message => {
                // Check if sender and recipient are null
                if (!message.sender || !message.recipient) return false;

                const messageSender = message.sender.toString();
                const messageRecipient = message.recipient.toString();
                const isSenderIncluded = recipientUserIds.includes(messageSender);
                const isRecipientIncluded = recipientUserIds.includes(messageRecipient);
                console.log(`Message ID: ${message._id}, Sender: ${messageSender}, Recipient: ${messageRecipient}`);
                console.log(`Is sender included: ${isSenderIncluded}, Is recipient included: ${isRecipientIncluded}`);
                return isSenderIncluded && isRecipientIncluded;
            });

            console.log('Filtered messages:', filteredMessages);

            if (!filteredMessages.length) {
                console.log('Chat history not found');
                socket.emit('chat messages', []);
                return;
            }

            const messagesWithNames = await getMessagesWithNames(filteredMessages);
            console.log('Emitting chat messages:', messagesWithNames);
            socket.emit('chat messages', messagesWithNames);
        } catch (error) {
            console.error('Error getting chat messages:', error);
        }
    });

});


function updateUsers() {
    const users = [];
    for (const socket of io.sockets.sockets.values()) {
        users.push({ username: socket.username, id: socket.id });
    }
    io.sockets.emit('get user', users);
}

