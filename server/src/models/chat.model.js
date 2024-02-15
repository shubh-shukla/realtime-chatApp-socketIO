import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    // latestMessage: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Message",
    // }
    // groupAdmin: {
    //   type: Schema.Types.ObjectId,
    // },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", chatSchema)