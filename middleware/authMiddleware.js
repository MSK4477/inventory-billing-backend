import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../data/models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.tokens;

  if (!token) {
    return res.status(401).json({ error: "No token found. Unauthorized" });
  }

  try {
     const decoded = jwt.verify(token, process.env.SECRET_KEY);

     const user = await User.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

     req.user = user;
     req.id = user._id;

    next();
  } catch (err) {
    console.error("JWT Verification Failed:", err);
    return res.status(401).json({ error: "Token verification failed" });
  }
});

export default protect;
