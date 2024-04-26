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
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/shubham-node/image/upload/v1711286847/defaultAvatar_eqaw7t.jpg",
    },
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