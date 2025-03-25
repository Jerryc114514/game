const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public')); // public 目录存放 index.html, script.js 等文件

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);
  // 这里可以添加玩家同步、分数广播、气球状态同步等逻辑
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

http.listen(3000, () => {
  console.log('Listening on *:3000');
});
