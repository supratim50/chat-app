const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUsers, removeUsers, getUsers, getUsersInRoom } = require("./users");

const router = require("./router");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(router);

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  // join user
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUsers({ id: socket.id, name, room });

    if (error) return callback(error);

    // send a message from the admin to the new user
    socket.emit("message", {
      user: `admin`,
      text: `${user.name}, Welcome to the room ${user.room}`,
    });
    // broadcast to all that new user has joined
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    socket.join(user.room);

    // getting room
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // message sending function
  socket.on("sendMessage", (message, callback) => {
    const user = getUsers(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUsers(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server is up and running on port ${PORT}`)
);
