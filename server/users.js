const users = [];

// add user
const addUsers = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //   checking user has already exist or not
  const userExist = users.find(
    (user) => user.room === room && user.name === name
  );

  if (userExist) {
    return { error: "User Name Already Exist." };
  }

  // if users not exist then push into array
  const user = { id, name, room };
  users.push(user);

  return { user };
};

// remove user
const removeUsers = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    // for delete user
    return users.splice(index, 1)[0];
  }
};

// for getting user
const getUsers = (id) => users.find((user) => user.id === id);

// for getting room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUsers, removeUsers, getUsers, getUsersInRoom };
