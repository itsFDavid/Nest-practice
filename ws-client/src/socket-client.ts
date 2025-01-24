import { Manager, Socket } from "socket.io-client"

export const connectToServer = (token: string) =>{
    const manager = new Manager("localhost:3000/socket.io/socket.io.js",{
        extraHeaders:{
            authentication: token
        }
    });
    const socket = manager.socket('/');
    addListeners(socket)
}


const addListeners = (socket: Socket) =>{
    const messageInput = document.querySelector<HTMLInputElement>('#message')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
    const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!;
    socket.on('connect', () => {
        serverStatusLabel.innerText = 'Online';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerText = 'Offline';
    });

    socket.on('clients-updated', (clients: string[]) => {
        const clientsUl = document.querySelector<HTMLUListElement>('#clients-ul')!;
        clientsUl.innerHTML = '';
        clients.forEach(clientId => {
            const li = document.createElement('li');
            li.innerText = clientId;
            clientsUl.appendChild(li);
        });
    });
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if(messageInput.value.trim().length <= 0) return;
        socket.emit('message-from-client', {
            id: 'Yoo',
            message: messageInput.value
         });
        messageInput.value = '';
    });

    socket.on('message-from-server', (payload: {
        fullName: string,
        message: string
    }) => {
        const newMessage = 
        `
        <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
        </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.appendChild(li);
    });
}