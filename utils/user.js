const users = [];

exports.userLogin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

exports.getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

exports.getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

exports.userLogout = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
