const { formatMessage } = require("./message");
const {
  getCurrentUser,
  userLogin,
  userLogout,
  getRoomUsers,
} = require("./user");

const chatBotName = "ChatXBot";

exports.chatMessage = (io) => {
  io.on("connection", (socket) => {

    // User joins room
    socket.on("joinRoom", ({ username, room }) => {
      const user = userLogin(socket.id, username, room);
      socket.join(user.room);

      socket.emit(
        "chatBotMessage",
        formatMessage(chatBotName, `Heyy 👋🏼, Welcome to the ${room} room`)
      );

      // Broadcast when a new user connects to chat
      socket.broadcast
        .to(user.room)
        .emit(
          "user connected",
          formatMessage(chatBotName, `${user.username} joined chat`)
        );

      io.to(user.room).emit("allRoomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      // listen from client for messages
      socket.on("message", (message) => {
        console.log(message);
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit(
          "userMessage",
          formatMessage(user.username, message)
        );
      });
    });

    // Broadcast when a new user disconnects from chat
    socket.on("disconnect", () => {
      const user = userLogout(socket.id);
      if (user) {
        io.to(user.room).emit(
          "user disconnected",
          formatMessage(chatBotName, `${user.username} left chat`)
        );
        io.to(user.room).emit("allRoomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};
