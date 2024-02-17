import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

const FetchChats = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const chats = await Chat.find({
    members: {
      $in: [id],
    },
  });
  return res.status(200).json(new ApiResponse(200, chats));
})

const createGroupChat = asyncHandler(async (req, res, next) => {
  const { members, name } = req.body;

  if (!members) {
    return next(new ApiError(400, "Members are required"));
  }

  if(!name) {
    return next(new ApiError(400, "Name is required for group chat"));
  }

  const validMembers = await Chat.find({
    _id: {
      $in: members,
    },
  });

  if (validMembers.length < 3) {
    return next(new ApiError(400, "At least 3 members are required"));
  }

  const chat = await Chat.create({
    chatName : name,
    members : validMembers,
    isGroupChat : true,
  });

  return chat
  // return res.status(201).json(new ApiResponse(201, chat));
});

const accessGroupChat = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  let chat = await Chat.findById(id);
  if (!chat) {
    chat = createGroupChat(req, res, next);
  }
  return res.status(200).json(new ApiResponse(200, chat));
})

const accessChat = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  //find a chat where current user and other user are the only members

  let chat = await Chat.findOne({
    members: {
      $all: [req.user._id, id],
    },
    isGroupChat : false
  })

  // let chat = await Chat.findById(id);
  if (!chat) {
    const user = await User.findById(id).select("username");
    chat = await Chat.create({
      chatName : user.username,
      members : [req.user._id, id],
    });
  }
  return res.status(200).json(new ApiResponse(200, chat));
});

export { createGroupChat, accessChat, FetchChats, accessGroupChat };