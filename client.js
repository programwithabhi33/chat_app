const socket = io('http://localhost:8000', { transports: ['websocket'] });

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.getElementById("min_container")

// Audio that will play on receiving messages
// var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner

let audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (userName, message, position) => {
    let appendEl = "";
    let currentdate = new Date();
    let datetime = "Time: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds()
    if (position == 'left') {
        appendEl = `<div class="d-flex">
        <p class="small mb-1 mx-1">${userName}</p>
        <p class="small mb-1 text-muted mx-1">${datetime}</p>
    </div>
    <div class="d-flex flex-row justify-content-start">
        <div>
            <p class="small p-2  mb-3 rounded-3" style="background-color: #f5f6f7;">${message}</p>
        </div>
    </div>`
    }
    else {
        appendEl = `
    <div class="d-flex justify-content-end">
        <p class="small mb-1 text-muted mx-1">${datetime}</p>
        <p class="small mb-1 mx-1">${userName}</p>
    </div>
    <div class="d-flex flex-row justify-content-end mb-4 pt-1">
        <div>
            <p class="small p-2 mb-3 text-white rounded-3 bg-success">${message}</p>
        </div>
    </div>`
    }
    // const messageElement = document.createElement('div');
    // messageElement.innerText = message;
    // messageElement.classList.add('message');
    // messageElement.classList.add(position);
    messageContainer.innerHTML += appendEl;
    if(position =='left'){ 
        audio.play();
    }
    // if(position =='left'){ 
    //     audio.play();
    // }
}


// Ask new user for his/her name and let the server know
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', userNname => {
    append(userNname, "Joined The Chat", 'left')
})

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}`, `${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name}`, `Left The Chat`, 'left')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You`, `${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
})