import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenAndSendCookie = (res, id) => { 
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });
    
    res.cookie("jwt-netflix", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15days 
        httpOnly: true, //prevent XSS attack cross site scripting attack, make it not  be accessed by javascript
        sameSite: "strict",
        secure: ENV_VARS.NODE_ENV !== "development",
        
    })
    return token
}
