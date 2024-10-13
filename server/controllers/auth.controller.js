import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateTokenAndSendCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
    try { 
        const { username, email, password } = req.body;
        
        if(!username || !email || !password) {
            return res.status(400).json({success:false,  message: "Please fill all fields" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailRegex.test(email) === false) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if(password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const existingUserByEmail = await User.findOne({ email: email })

        if(existingUserByEmail) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        const existingUserByUsername = await User.findOne({ username: username })

        if(existingUserByUsername) {
            return res.status(400).json({ success: false, message: "User with this username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"]

        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]

        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            image,
        });

        if (newUser) {
            generateTokenAndSendCookie(newUser._id, res);
            await newUser.save();

             //remove password from the response
              res.status(201).json({
                success: true,
                user: {
                  ...newUser._doc,
                  password: "",
                },
              });
        } else { 
res.status(400).json({ success: false, message: "Internal server error" });
        }

      


    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
        
    }
}


export async function login(req, res) {
  res.send("Login Route");
}

export async function logout(req, res) {
  res.send("Logout Route");
}