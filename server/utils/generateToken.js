import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSendCookie = (res, userId) => {
  // Create the JWT token using the provided userId
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

  // Set the cookie in the response
  res.cookie("jwt-netflix", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true, // Prevents XSS attacks, making it not accessible by JavaScript
    sameSite: "strict", // Provides CSRF protection
    secure: ENV_VARS.NODE_ENV === "production", // Use secure cookies only in production
  });

  return token; 
};
