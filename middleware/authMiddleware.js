import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../data/models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  const { tokens } = req.cookies;
  console.log(tokens)
  if (!tokens) {
    res.status(403).json({ error: "Unauthorized User" });
    return;
  }
  try {
    const decodeToken = await jwt.verify(tokens, process.env.SECRET_KEY);
    const findUser = await User.findOne({ email: decodeToken.email });

    if (!findUser) {
      res.status(403).json({ error: "User Not Authorized" });
      return;
    }
    req.id = findUser._id;

    // if(!req.id){
        
    // }
console.log(req.id)
    next();
  } catch (err) {
    console.log(err);
  }
});

export default protect;
