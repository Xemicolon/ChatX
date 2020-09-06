const chatForm = document.querySelector(".chatForm");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector(".room-name");
const userList = document.querySelector(".username-list");
const logout = document.querySelector(".logout-link");
const leaveBtn = document.querySelector(".leave-btn");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".close-btn");
const sidebar = document.querySelector(".sidebar");

const socket = io();
let user = localStorage.getItem("user");
user = JSON.parse(user);

// listen for connection from server
socket.on("connection", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// emit user to room
socket.emit("joinRoom", user);

// listen on user connection from server
socket.on("user connected", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// get all users from server
socket.on("allRoomUsers", ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});

socket.on("chatBotMessage", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// listen to messages from other person from server
socket.on("userMessage", (message) => {
  outputMessageFromServer(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// listen to when a user disconnects
socket.on("user disconnected", (message) => {
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

menuBtn.addEventListener("click", () => {
  menuBtn.style.display = "none";
  closeBtn.style.display = "block";
  sidebar.style.display = "flex";
  sidebar.classList.add("sidebar-mobile");
});

closeBtn.addEventListener("click", () => {
  closeBtn.style.display = "none";
  menuBtn.style.display = "block";
  sidebar.style.display = "none";
  sidebar.classList.remove("sidebar-mobile");
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let msg = e.target.elements.chat;
  let message = msg.value;
  let username = user.username;
  outputMessageFromUser(username, message);
  socket.emit("message", msg.value);
  msg.value = "";
  msg.focus();
});

logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  fetch("/logout").then(() => {
    window.location.href = "/";
  });
});

leaveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("user");
  fetch("/logout").then(() => {
    window.location.href = "/";
  });
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("user1-window");
  div.innerHTML = `
  <div class="user1"><picture>
  <img src="/images/user.png" width="30" height="30" class="user-image" alt="User Avatar" />
</picture><p class="user-1"> <span class="user1-name">${message.username}</span> ${message.text}</p></div>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputMessageFromUser(username, message) {
  const div = document.createElement("div");
  div.classList.add("user2-window");
  div.innerHTML = `
  <div class="user2"><picture>
  <img src="/images/user.png" width="30" height="30" class="user-image" alt="User Avatar" />
</picture><p class="user-2"> <span class="user2-name">${username}</span> ${message}</p></div>
  `;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputMessageFromServer(message) {
  if (message.username !== "ChatXBot" && user.username !== message.username) {
    const div = document.createElement("div");
    div.classList.add("user1-window");
    div.innerHTML = `
  <div class="user1"><picture>
  <img src="/images/user.png" width="30" height="30" class="user-image" alt="User Avatar" />
</picture><p class="user-1"> <span class="user1-name">${message.username}</span> ${message.text}</p></div>
  `;
    document.querySelector(".chat-messages").appendChild(div);
    return;
  }
}

function outputRoom(room) {
  roomName.innerHTML = room;
}

function outputUsers(users) {
  userList.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join()}`;
}
