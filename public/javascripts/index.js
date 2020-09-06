const loginDetails = document.querySelector(".form");
const chatMessages = document.querySelector(".chat-messages");


loginDetails.addEventListener("submit", (e) => {
  e.preventDefault()
  let user = {
    username: e.target.elements.username.value,
    room: e.target.elements.room.value,
  };
  localStorage.setItem("user", JSON.stringify(user));

  fetch("/chat", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(user),
  })
    .then((data) => {
      return data.json();
    })
    .then((response) => {
      if(response.success === true){
        window.location.href = '/chat'
      }
    });
});
