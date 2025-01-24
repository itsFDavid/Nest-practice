import './style.css'

import { connectToServer } from './socket-client.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Web-socket Client</h1>

    <input id="jwt-token" placeholder="Ingresa tu token" />
    <button id="btn-connect">Connect</button>

    <br>
    <span id="server-status">Offline</span>
    <h3>Clients: </h3>
    <ul id="clients-ul"></ul>

    <form id="message-form">
      <input type="text" id="message" placeholder="message"/>
    </form>

    <h3>Messages: </h3>
    <ul id="messages-ul"></ul>
  </div>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
// connectToServer();

const inputJwt = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () =>{
  if(inputJwt.value.trim().length <= 0) return alert('Ingresa un token valido');
  connectToServer(inputJwt.value.trim());
})
