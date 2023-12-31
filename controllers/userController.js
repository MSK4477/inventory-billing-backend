import User from "../data/models/userModel.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1d" });
};

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({ error: "User already exists", code: 0 });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateToken(email);
 


    let newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
      temproaryToken: token,
    });

    const verifyUrl = `https://master--unique-madeleine-1c17ab.netlify.app/verify?token=${token}`;

    const message = `<h2>Hello ${name}</h2>
      <p>Please use the URL below to verify your account</p>  
      <p>This Verify link is valid for only 30 minutes.</p>
      
      <a href=${verifyUrl}>${verifyUrl}</a>`;

    const subject = "Verify User";
    const send_to = newUser.email;
    const sent_from = process.env.GMAIL_USER;

    await sendEmail(subject, message, send_to, sent_from);
    res.status(201).json({
      message:
        "User registered successfully and an Verification Mail Has Sent To Your Mail Click The Link and Verify Your Enail",
      data: newUser,code:1
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", code: 0 });
  }
});

// Verify User
export const verifyUser = asyncHandler(async (req, res) => {
  try {
    const { token } = req.query;
    console.log(token);

    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);
    const findUser = await User.findOne({ email: decodeToken.email });
    if (findUser && findUser.temproaryToken === token) {
      findUser.verified = true;
      findUser.temproaryToken = null;
      await findUser.save();
      res.status(200).json({ message: "User Verified Successfully", code: 1 });
    } else {
      res
        .status(401)
        .json({ error: "User Not Verified or Link Expired ", code: 0 });
      throw new Error("Link Expired");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", code: 0 });
  }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email })

    if (!user) {
      res.status(404).json({ error: "User not found", code: 0, mail: email });
      return;
    }
    if (!user.verified) {
      res.status(404).json({ error: "User not Verified", code: 0 });
      return;
    }
    req.id = user._id;
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Password doesn't match", code: 0 });
      return;
    }

    const token = generateToken(email);
    user.verified = true;
    user.temproaryToken = token;
    await user.save();

    res.cookie('tokens', token, {
      maxAge: 86400000, 
      sameSite: 'None',
      secure: true, 
      httpOnly: true, 
    });

    res.status(200).json({ message: "User has been signed-in successfully", data:user, code: 1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", code: 2 });
  }
});

//Logout User

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const { tokens } = req.cookies;
    const verifyToken = jwt.verify(tokens, process.env.SECRET_KEY);
    if (verifyToken) {
      const user = await User.findOne({ email: verifyToken.email });
      user.temproaryToken = null;
      await user.save();
    }
    req.id = null;
    await res.clearCookie("tokens");
    return res.status(200).send({
      message: "User has been signed-out successfully.",
    });
  } catch (err) {
    response.status(500).json({ error: "internal server error", code: 2 });
  }
});

// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
console.log(email)
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ error: "Email not found", code: 0 });
    }

    if (user) {
      const token = generateToken(user.email);
      user.temproaryToken = token;
      await user.save();
      const resetUrl = `https://master--unique-madeleine-1c17ab.netlify.app/resetPassword?token=${token}`;

      const message = `<h2>Hello ${user.name}</h2>
        <p>Please use the URL below to reset your password</p>  
        <p>This reset link is valid for only 30 minutes.</p>
        
        <a href=${resetUrl}>${resetUrl}</a>`;

      const subject = "Reset Password";
      const send_to = email;
      const sent_from = process.env.GMAIL_USER;

      await sendEmail(subject, message, send_to, sent_from);
      res.status(200).json({
        message: "Reset Link Sent Via Email, Check Your Mail",
        mail: email,
        user: user,
        code:1,
      });
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error", code: 2 });
  }
});

// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token } = req.query;

    const { newPassword } = req.body;

    const decodeToken = jwt.decode(token, process.env.SECRET_KEY);

    const user = await User.findOne({ email: decodeToken.email });

    if (user.temproaryToken == token) {
      user.temproaryToken = null;
      await user.save();
    }

    

    if (user) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res
        .status(200)
        .json({ message: "Password Changed Successfully", code: 1 });
      return;
    }
    res.status(400).json({ error: "Can't Change The Password", code: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error", code: 2 });
  }
});

// Get all users

// export const getAllUsers = asyncHandler(async (req, res) => {
//   const users = await User.find({}).select("-password");
//   if (!users) {
//     res.status(404).json({ error: "No Users Found", code: 0 });
//     return;
//   }
//   const user = await User.findById({ _id: req.id }).select("-password");

//   if (user.role !== "admin") {
//     res
//       .status(401)
//       .json({ error: "Access Denied Admin Role Required", code: 0 });
//     return;
//   } else {
//     res.status(200).json({ message: "All Users", data: users, code: 1 });
//   }
//   res.status(500).json({ error: "internal server error", code: 2 });
// });

// Get single user

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req;

  //user to be viewed , id came from params
  const user = await User.findById(id);
  console.log("user", user);

  //currently Logged in user
  const user2 = await User.findById(req.id);

  if (!user) {
    res.status(404).json({ error: "User Not Found", code: 0 });
    return;
  }

  if (user.id == req.id || user2.role == "admin") {
    res.status(200).json(user);
    return;
  }

  res.status(401).json({ error: "Access Denied", code: 0 });
});

//Delete User

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  const user2 = await User.findById(req.id);
  if (!user) {
    res.status(404).json({ error: "User Not Found", code: 0 });
    return;
  }

  if (user.id == req.id || user2.role == "admin") {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User Deleted", code: 1 });
  } else {
    res.status(401).json({ error: "Access Denied", code: 0 });
  }
  res.status(500).json({ error: "internal server error", code: 2 });
});

// Update User

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({_id:id});

  
  if (!user) {
    res.status(404).json({ error: "User Not Found", code: 0 });
    return;
  }

if(user){
    const updatedUser = await User.findOneAndUpdate({_id:id}, req.body,{new:true})
    res.status(200).json({ message: "User Updated", data: updatedUser, code: 1 });
    return;
  }else {
    res.status(500).json({error:"Internal Server Error", code:2})
  }
});