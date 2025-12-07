import Chat from "../models/Chat.js";

export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.findById(req.params.id);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
