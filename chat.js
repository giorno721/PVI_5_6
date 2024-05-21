

document.addEventListener('DOMContentLoaded', function() {
    let socket;

    const form = document.getElementById('messageForm');
    const input = document.getElementById('message');
    const chat = document.getElementById('chat');
    const userForm = document.getElementById('userForm');
    const username = document.getElementById('username');
    const chatArea = document.getElementById('chatArea');
    const userNameArea = document.getElementById('userNameArea');
    const users = document.getElementById('users');
    const chatInfo = document.getElementById('chatInfo');
    const defaultChat = document.getElementById("global-chat");

    const defaultChatId = defaultChat.id;

    let chosenChat = defaultChatId;
    let chosenChatId = defaultChatId
    let previousChat;
    let user;
    let user_id;

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (username.value) {
            socket = io('http://localhost:3000');  // Connect the socket here

            socket.emit('new user', username.value);
            user = username.value;
            chatArea.style.display = 'flex';
            userNameArea.style.display = 'none';
            // setDefaultChatInfo();

            // Add event listeners for socket events
            socket.on('new message', (data) => {
                if (data.user !== username && data.chat !== chosenChatId){
                    const chatItem = document.getElementById(data.chat);
                    if (chatItem) {
                        chatItem.innerHTML += `<span class="unread-messages"></span>`;
                    }
                }else if(data.chat === chosenChatId){
                    loadChat();
                }
            });

            socket.on('new user', (user) => {
                // console.log(user)
                if (user.username === username.value) {
                    user_id = user.id
                    chooseChat(defaultChat);
                }
                let html = `<div class="user-list-el" id="${user.id}">${user.username}</div>`;
                users.innerHTML += html;
            });

            socket.on('get user', (data) => {
                let html = "";
                // console.log(user_id)
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id !== user_id) {
                        // console.log(data[i].id)
                        html += `<div class="user-list-el" id="${data[i].id}">${data[i].username}</div>`;
                    }
                }
                // console.log(html)
                users.innerHTML = html;
                if (chosenChatId === defaultChatId) {
                    setDefaultChatInfo();
                }
            });
            socket.on('chat messages', (messages) => {
                console.log("messages", messages.length)
                if (messages.length === 0) {
                    console.log("messages", messages)
                }
                updateChatWindow(messages);
            });
            socket.onAny((event, ...args) => {
                console.log(event, args);
            });
        }
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value.trim() !== "") {
            // console.log("chosenChatId")
            // console.log(chosenChatId)
            socket.emit('send message', input.value, chosenChatId);
            input.value = '';
        }
    });

    document.getElementById("online-users-div").addEventListener('click', (e) => {
        if (e.target.classList.contains('user-list-el')) {
            // console.log("e.target")
            chooseChat(e.target);
        }
    });
    function getDefaultChatInfo() {
        let info = "";
        for (let i = 0; i < users.children.length; i++) {
            info += users.children[i].innerHTML;
            if (i !== users.children.length - 1) {
                info += ", ";
            }
        }
        return info;
    }
    function setDefaultChatInfo() {
        chatInfo.innerHTML = "Members: " + getDefaultChatInfo();
    }

    function chooseChat(item) {

        const elementToRemove = item.querySelector('.unread-messages');
        if (elementToRemove)
        {
            item.querySelector('.unread-messages').remove();
        }

        chosenChat = item.innerHTML;
        chosenChatId = item.id
        if (item.id === defaultChatId) {
            chatInfo.innerHTML = "Members: " + getDefaultChatInfo();
        }else{
            chatInfo.innerHTML = "Chat: " + chosenChat;
        }

        item.classList.add('active');
        if (previousChat && previousChat !== item) {
            previousChat.classList.remove('active');
        }
        previousChat = item;
        loadChat();
    }

    function loadChat() {
        console.log("load students:", user_id, chosenChatId)
        if (chosenChatId === defaultChatId) {
            console.log("load students:", user_id, chosenChatId)
            socket.emit('get chat messages', []);
        }else {
            socket.emit('get chat messages', [user, chosenChat]);
        }

    }

    function updateChatWindow(messages) {
        let html = '';
        messages.forEach(message => {
            let sender = message["sender"];
            // console.log("sender", sender)
            if (sender === user) {
                html += `<div class="sender-message">${sender}: ${message["msg"]}</div>`;
            } else {
                html += `<div class="receiver-message">${sender}: ${message["msg"]}</div>`;
            }
        });
        chat.innerHTML = html;
        chat.scrollTop = chat.scrollHeight;
    }

});



