import express from "express";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

// Создаём Express-приложение
const app = express();

// Создаём обычный HTTP-сервер на основе Express
const server = http.createServer(app);

// Подключаем Socket.IO к HTTP-серверу
const io = new Server(server);

// STATIC FILES
// Отдаём клиенту файлы из public
// index.html будет доступен по /

app.use(express.static("public"));

// SOCKET.IO
// Работа с подключёнными клиентами

io.on("connection", (socket) => {
  // socket.id — уникальный ID подключённого клиента
  console.log(`User connected: ${socket.id}`);

  // CHAT MESSAGE
  // Получаем сообщение от клиента

  socket.on("chatMessage", (message) => {
    // Проверяем, что пришла непустая строка
    if (typeof message !== "string" || !message.trim()) {
      socket.emit("messageReceived", "Message cannot be empty");
      return;
    }

    const cleanMessage = message.trim();

    // Показываем сообщение в консоли сервера
    console.log(`Message from ${socket.id}: ${cleanMessage}`);

    // Отправляем клиенту подтверждение
    socket.emit("messageReceived", `Server received: ${cleanMessage}`);
  });

  // DISCONNECT
  // Клиент отключился от сервера

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

// START SERVER

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
