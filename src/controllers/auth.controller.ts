import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import User from "../models/user";
import ApiResponse from "../utils/apiResponse";
import RefreshToken from "../models/refreshToken";
import {
  generateAccessToken,
  generateRefreshToken,
  getAuthToken,
  getCookieToken,
  getDateAfterMinutes,
  verifyToken,
} from "../utils/jwtUtils";

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, profilePic } = req.body;

  if (!fullName) {
    throw new ApiError({
      status: 400,
      message: "FullName is required!",
    });
  }

  if (!email) {
    throw new ApiError({
      status: 400,
      message: "Email is required!",
    });
  }

  let user = await User.findOne({
    where: { email },
    attributes: ["id", "email", "fullName", "profilePic", "role"],
  });

  if (!user) {
    user = await User.create({ fullName, email, profilePic });
  }

  const refreshToken = generateRefreshToken({
    userId: user.id,
    expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN as string, 10),
  });

  const jwtExpiresIn = parseInt(
    process.env.JWT_REFRESH_EXPIRES_IN as string,
    10
  );

  const savedRefreshToken = await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: getDateAfterMinutes(jwtExpiresIn),
  });

  const accessToken = generateAccessToken({
    userId: user.id,
    refreshTokenId: savedRefreshToken.id,
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10) || 0,
  });

  res.cookie("accessToken", `Bearer ${accessToken}`, {
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  let reponseData = {
    accessToken,
    user,
  };

  return new ApiResponse({
    status: 200,
    message: "User Logged in.",
    data: reponseData,
  }).send(res);
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  return new ApiResponse({
    status: 200,
    message: "Logged out successfully",
  }).send(res);
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = getCookieToken(req) || getAuthToken(req);

    if (!token) {
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }

    //verify token
    try {
      const decodedToken = verifyToken({
        token: token,
        ignoreExpiration: true,
      });

      //get refresh token from db
      const refreshToken = await RefreshToken.findOne({
        where: {
          id: decodedToken.rfId,
          userId: decodedToken.id,
        },
      });

      if (!refreshToken) {
        throw new ApiError({
          message: "Unauthorized",
          status: 401,
        });
      }

      // verify refresh token
      verifyToken({
        token: refreshToken.token,
      });

      //get user from db
      const user = await User.findOne({
        where: { id: decodedToken.id },
        attributes: ["id", "email", "fullName", "profilePic", "role"],
      });

      if (!user) {
        throw new ApiError({
          message: "Unauthorized",
          status: 401,
        });
      }

      //generate access token
      const accessToken = generateAccessToken({
        userId: user.id,
        refreshTokenId: refreshToken.id,
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10) || 0,
      });

      res.cookie("accessToken", `Bearer ${accessToken}`, {
        httpOnly: true,
        secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      });

      let responseData = {
        accessToken,
        user,
      };

      return new ApiResponse({
        status: 200,
        message: "Access token refreshed successfully",
        data: responseData,
      }).send(res);
    } catch (error: any) {
      console.log(error);
      throw new ApiError({
        message: "Unauthorized",
        status: 401,
      });
    }
  }
);
