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
const defaultChat = document.getElementById("1")
const defaultChatId = defaultChat.id


let chosenChat = defaultChatId;
let chosenChatId = defaultChatId
let previousChat;
let user;
let user_id;
const allChats = {};
allChats[defaultChatId] = [];

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (username.value) {
        socket = io('http://localhost:3000');  // Connect the socket here

        socket.emit('new user', username.value);
        user = username.value;
        chatArea.style.display = 'flex';
        userNameArea.style.display = 'none';
        chooseChat(defaultChat);

        // Add event listeners for socket events
        socket.on('new message', (data) => {
            if (!(data.chat in allChats)) {
                allChats[data.chat] = [];
            }

            if (data.user !== username && data.chat !== chosenChatId){
                const chatItem = document.getElementById(data.chat);
                if (chatItem) {
                    chatItem.innerHTML += `<span class="unread-messages"></span>`;
                }
            }

            allChats[data.chat].push(data.user + ": " + data.msg);
            updateChatWindow();
        });

        socket.on('new user', (user) => {
            if (user.username === username.value) {
                user_id = user.id
            }
            let html = `<div class="user-list-el" id="${user.id}">${user.username}</div>`;
            users.innerHTML += html;

            if (chosenChatId === defaultChatId) {
                setDefaultChatInfo();
            }
        });

        socket.on('get user', (data) => {
            let html = "";
            for (let i = 0; i < data.length; i++) {
                if (data[i].id !== user_id) {
                    console.log(data[i].id)
                    html += `<div class="user-list-el" id="${data[i].id}">${data[i].username}</div>`;
                }
            }
            users.innerHTML = html;

            if (chosenChatId === defaultChatId) {
                setDefaultChatInfo();
            }
        });

        socket.onAny((event, ...args) => {
            console.log(event, args);
        });
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim() !== "") {
        if (chosenChatId === defaultChatId) {
            socket.emit('send global message', input.value, chosenChatId);
        }
        else {
            socket.emit('send private message', input.value, chosenChatId);
        }

        input.value = '';
    }
});

document.getElementById("online-users-div").addEventListener('click', (e) => {
    if (e.target.classList.contains('user-list-el')) {
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

    updateChatWindow();
    item.classList.add('active');
    if (previousChat && previousChat !== item) {
        previousChat.classList.remove('active');
    }
    previousChat = item;
}

function updateChatWindow() {
    let html = '';
    for (let i = 0; i < allChats[chosenChatId]?.length; i++) {
        let sender = allChats[chosenChatId][i].split(": ")[0];
        if (sender === user) {
            html += `<div class="sender-message">${allChats[chosenChatId][i]}</div>`;
        } else {
            html += `<div class="receiver-message">${allChats[chosenChatId][i]}</div>`;
        }
    }
    chat.innerHTML = html;
    chat.scrollTop = chat.scrollHeight;
}

