
const socket = new WebSocket('ws://localhost:3023');
socket.onopen = () =>{
    console.log('Connection opened');
}

socket.onmessage = (e)=>{
    const chat = document.querySelector('.chat');
    const msg = document.createElement('p');
    msg.textContent = e.data;
    chat.append(msg);
}

document.querySelector('button').onclick = () => {
    const input = document.querySelector('input');
    socket.send(input.value);
    input.value = '';
}