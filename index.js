var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
let idUserMap = {};
io.on("connection", (socket) => {
  console.log("a user connected with id= " + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("login", (data) => {
    idUserMap[data.username] = socket.id;
    console.log(idUserMap);
  });
  socket.on("chat message", (data) => {
    console.log(idUserMap);
    if (data.charAt(0) === "@") {
      user = data.split(" ")[0].substring(1);
      msg = data.substring(data.indexOf(" ") + 1);
      console.log(idUserMap[user]);
      socket.broadcast.to(idUserMap[user]).emit("chat message", msg);
    } else {
      socket.broadcast.emit("chat message", data);
    }
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("listening on *:3000");
});
