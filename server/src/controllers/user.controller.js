import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    return next(new ApiError(409, "User already exists"));
  }

  const avatarLocalPath = req.file?.path;

  let addOns = []
  if (avatarLocalPath) {
    avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar) {
      return next(new ApiError(400, "Avatar upload failed"));
    }
    addOns.push({ avatar: avatar.url });
  }

  const userInfo = {
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    ...addOns
  };

  if (req.body.bio) {
    userInfo.bio = req.body.bio;
  }

  const user = await User.create(userInfo);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);
  if (!username && !email) {
    return next(new ApiError(400, "Username or email is required"));
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user: loggedInUser },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $unset: {
      refreshToken: 1,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Refresh token expired");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user);

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken: refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new ApiError(400, "Current password and new password are required")
    );
  }

  if (currentPassword === newPassword) {
    return next(
      new ApiError(400, "New password cannot be the same as current password")
    );
  }

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    return next(new ApiError(400, "Current password is incorrect"));
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: req.user }, "User retrieved successfully")
    );
});

const updateAccountDetails = asyncHandler(async (req, res, next) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return next(new ApiError(400, "Full name and email are required"));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return next(new ApiError(400, "Avatar is required"));
  }

  const { url: avatarUrl } = await uploadToCloudinary(avatarLocalPath);

  if (!avatarUrl) {
    return next(new ApiError(500, "Failed to upload avatar"));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatarUrl,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  await deleteFromCloudinary(req.user?.avatar);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};
