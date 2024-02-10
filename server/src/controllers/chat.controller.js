import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";

const createChat = asyncHandler(async (req, res, next) => {
  const { members, name } = req.body;

  if (!members) {
    return next(new ApiError(400, "Members are required"));
  }

  const validMembers = await Chat.find({
    _id: {
      $in: members,
    },
  });

  if (validMembers.length < 2) {
    return next(new ApiError(400, "At least 2 members are required"));
  }

  let isGroupChat = false;

  if (validMembers.length > 2) {
    isGroupChat = true;
    if(!name) {
      return next(new ApiError(400, "Name is required for group chat"));
    }
  }

  if (validMembers.length === 2) {
    name =
      validMembers[0]._id === req.user._id
        ? validMembers[1].fullName
        : validMembers[0].fullName;
  }

  const chat = await Chat.create({
    members : validMembers,
    name,
    isGroupChat,
  });

  return res.status(201).json(new ApiResponse(201, chat));
});

const getChat = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  if (!chat) {
    return next(new ApiError(404, "Chat not found"));
  }
  return res.status(200).json(new ApiResponse(200, chat));
});

export { createChat, getChat };