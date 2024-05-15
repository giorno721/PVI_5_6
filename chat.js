const socket = io('http://localhost:3000');

const form = document.getElementById('messageForm');
const input = document.getElementById('message');
const chat = document.getElementById('chat');
const userForm = document.getElementById('userForm');
const username = document.getElementById('username');
const chatArea = document.getElementById('chatArea');
const userNameArea = document.getElementById('userNameArea');
const users = document.getElementById('users');
const chatInfo = document.getElementById('chatInfo');

let choosenChat = "all";
let previouschat;
let user;
const allChats = {};
allChats["all"] = [];
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('send message', input.value, choosenChat);
        input.value = '';
    }
});

userForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(username.value){
        socket.emit('new user', username.value);
        user = username.value;
        chatArea.style.display = 'flex';
        userNameArea.style.display = 'none';
    }
});
socket.on('new message', (data) => {
    if (!(data.chat in allChats)) {
        allChats[data.chat] = [];
    }
    allChats[data.chat].push(data.user + ": " + data.msg);
    let html = '';
    for (let i = 0; i < allChats[choosenChat]?.length; i++){
        let sender = allChats[choosenChat][i].split(": ")[0];
        if (sender == user) {
            html += `<div class="sender-message">${allChats[choosenChat][i]}</div>`;
        }
        else {
            html += `<div class="receiver-message">${allChats[choosenChat][i]}</div>`;
        }
    }

    chat.innerHTML = html;
    chat.scrollTop = chat.scrollHeight;
});
socket.on('get user', (data) => {
    let html ='<div class="user-list-el">all</div>';
    for(let i=0; i<data.length; i++){
        if(data[i].username !== user) {
            html += `<div class="user-list-el">${data[i].username}</div>`;
        }
    }
    users.innerHTML = html;
    chat.scrollTop = chat.scrollHeight;
});
users.addEventListener('click', (e) => {
    if (e.target.classList.contains('user-list-el')) {
        chooseChat(e.target);
    }
});
function chooseChat(item){
    choosenChat = item.innerHTML;
    chatInfo.innerHTML ="Chat: " + choosenChat;
    let html ='';
    for (let i = 0; i < allChats[choosenChat]?.length; i++){
        let sender = allChats[choosenChat][i].split(": ")[0];
        console.log(sender);
        if (sender == user) {
            html += `<div class="sender-message">${allChats[choosenChat][i]}</div>`;
        }
        else {
            html += `<div class="receiver-message">${allChats[choosenChat][i]}</div>`;
        }
    }
    chat.innerHTML = html;

    item.classList.add('active');

    if (previouschat) {
        previouschat.classList.remove('active');
    }

    previouschat = item;
}