import { json } from "express";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    // Check if all fields are filled
    if(!fullName || !email || !password){
      return res.status(400).json({message:"All feilds must be filled"});
    }

    // Check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: `Password must be at least 6 characters` });
    }

    // check user existance
    const user = await User.findOne({ email: email });
    if (user) return res.status(400).json({ message: `Email already exists` });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email: email,
      fullName: fullName,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token and add to cookie
      generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: `Invalid user data` });
    }
  } catch (err) {
    console.log(`Error in signup controller ${err.message}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
  res.send("signup route");
};

export const login = async (req, res) => {
  const {email, password} = req.body;
  try{
    // Check if email and password are correct
    const user = await User.findOne({email:email});
    if(!user){
      res.status(400).json({message: `Invalid credentials`});
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if(!isCorrectPassword){
      res.status(400).json({message: `Invalid credentials`});
    }

    generateToken(user._id,res);
    res.status(200).json({
      _id:user._id,
      fullName:user.fullName,
      email: user.email,
      profilePic: user.profilePic
    })
  }
  catch(err){
    console.log("Error in login controller", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try{
    res.cookie("jwt","", {maxAge:0});
    res.status(200).json({message:"Logged out successfully"})
  }
  catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
};

export const updateProfile = async (req, res) => {
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      res.status(400).json({message:"Profile pic is required"});
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic : uploadResponse.secure_url},{new:true});
    res.status(200).json(updatedUser);
  }catch(error){
    console.log("Error in updating profile pic", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
};

export const checkAuth = (req,res) =>{
  try{
    return res.status(200).json(req.user);
  }
  catch(error){
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({message:"Internal Server Error"});
  }
}