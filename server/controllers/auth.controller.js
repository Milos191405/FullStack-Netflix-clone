// auth.controller.js

import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";

// Signup function
export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: "User with this username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];
    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
    });

    // Save the new user to the database and send a response
      await newUser.save();
      generateTokenAndSendCookie(res, newUser._id);

    // Remove password from the response object
    const { password: _, ...userWithoutPassword } = newUser._doc;

    // Send success response with user data (excluding password)
    res.status(201).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log("Error in signup controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// Login function
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if the provided password matches the hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate a token and send it as a cookie
    generateTokenAndSendCookie(res, user._id); // Pass 'res' first, then 'user._id'

    // Send success response with user data (excluding password)
    const { password: _, ...userWithoutPassword } = user._doc; // Leave this as you wrote
    res.status(200).json({
      success: true,
      user: userWithoutPassword, // Response with user data
    });
  } catch (error) {
    console.log("Error in login controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}


// Logout function
export async function logout(req, res) {
    try {
        res.clearCookie("jwt-netflix");
        return res.status(200).json({ success: true, message: "Logged out successfully" });
      
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
        }
  }
