import {model, Schema} from "mongoose"

import validate from 'mongoose-validator';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Please add a photo"],
    default: "https://i.ibb.co/4pDNDk1/avatar.png",
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [
      validate({
        validator: 'isEmail',
        message: 'Please provide a valid email address.',
      }),
    ],
  },
  role:{
type:String,
required:true,
default:"user"
  },

  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long.'],
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    validate: [
      validate({
        validator: 'isNumeric',
        arguments: [7, 20], 
        message: 'Please provide a valid phone number.',
      }),
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified:{
    type: Boolean,
    default: false,
  },
  temproaryToken:{
    type: String,
    default: null
  }
});

const User = model('Inventory-User', userSchema);

export default User;
