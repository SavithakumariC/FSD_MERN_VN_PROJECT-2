import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    messages: [
      {
        text: String,
        senderId: String,
        time: Date,
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Chat", chatSchema);
