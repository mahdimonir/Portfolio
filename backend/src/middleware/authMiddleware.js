import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthError, ForbiddenError, NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { msConverter } from "../utils/MSconverter.js";
import { throwIf } from "../utils/throwIf.js";

// Utility to decode token and fetch user
const decodeTokenAndGetUser = async (req) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  throwIf(!token, new AuthError("Unauthorized request: No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    return { token, decoded, user };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthError("Token expired, please login again");
    }
    throw new AuthError("Unauthorized request: Invalid token");
  }
};

// Generate JWT Token and attach to response
export const generateTokenAndSetCookie = (
  res,
  user,
  statusCode = 200,
  message = "Success"
) => {
  const token = user.generateJsonWebToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: msConverter(process.env.COOKIE_EXPIRES),
    path: "/",
  });

  return new ApiResponse(
    statusCode,
    {
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    },
    message
  );
};

// Middleware to authenticate users
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const { token, user } = await decodeTokenAndGetUser(req);

  throwIf(!user, new AuthError("Invalid access token: User not found"));

  req.user = user;
  req.token = token;
  next();
});

// Middleware to authorize access based on roles
export const authorized = (roles) =>
  asyncHandler(async (req, res, next) => {
    const { decoded, user } = await decodeTokenAndGetUser(req);

    const userRole = user?.role || decoded.role;

    throwIf(!userRole, new NotFoundError("User role not found"));
    throwIf(
      !roles.includes(userRole),
      new ForbiddenError("You are not authorized")
    );

    if (user) req.user = user;
    next();
  });
