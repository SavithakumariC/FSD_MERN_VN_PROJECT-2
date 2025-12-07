import Chat from "../models/Chat.js";
import Project from "../models/Project.js";
import { v4 as uuid } from "uuid";

const SocketHandler = (socket) => {
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        return;
      }

      // Allow anyone to join if they have the projectId
      await socket.join(projectId);
      console.log(`User joined room: ${projectId}`);

      const chats = await Chat.findById(projectId);

      if (!chats) {
        const newChat = new Chat({
          _id: projectId,
          messages: [],
        });
        await newChat.save();
      }

      socket.emit("messages-updated", { chats: chats || { messages: [] } });
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  socket.on("join-chat-room-client", async ({ projectId }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        return;
      }

      await socket.join(projectId);
      console.log(`Client joined room: ${projectId}`);

      const chats = await Chat.findById(projectId);

      if (!chats) {
        const newChat = new Chat({
          _id: projectId,
          messages: [],
        });
        await newChat.save();
      }

      socket.emit("messages-updated", { chats: chats || { messages: [] } });
    } catch (error) {
      console.error("Error joining room:", error);
    }
  });

  socket.on("update-messages", async ({ projectId }) => {
    try {
      const chat = await Chat.findById(projectId);
      console.log("updating messages");
      socket.emit("messages-updated", { chat: chat || { messages: [] } });
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  });

  socket.on("new-message", async ({ projectId, senderId, message, time }) => {
    try {
      let chat = await Chat.findById(projectId);

      if (!chat) {
        chat = new Chat({
          _id: projectId,
          messages: [],
        });
      }

      chat.messages.push({
        id: uuid(),
        text: message,
        senderId,
        time: new Date(time).toISOString(),
      });

      await chat.save();

      // Broadcast to all in the room
      io.to(projectId).emit("message-from-user", {
        newMessage: { id: uuid(), text: message, senderId, time },
      });
    } catch (error) {
      console.error("Error adding new message:", error);
    }
  });
};

export default SocketHandler;
