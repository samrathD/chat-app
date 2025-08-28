import { json } from "express"
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async(req, res) =>{
    try{
        const loggedInUserId = req.user._id;
        // Get every user except the current logged in user
        const filteredUsers = await User.find({_id : {$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);

    }catch(error){
        console.log("Error in getting users from the sidebar : ", error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const getMessages = async(req, res) =>{
    try{
        const {id : userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, recieverId:userToChatId},
                {senderId:userToChatId, recieverId:myId}
            ]
        });
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getting messages between users: ", error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

export const sendMessage = async(req, res) =>{
    try{
        const {text, image} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            // Upload to cloudinary
            const uploaderRresponse = await cloudinary.uploader.upload(image);
            imageUrl = uploaderRresponse.secure_url;
        }
        console.log(imageUrl);
        const newMessage = new Message({
            senderId:senderId,
            recieverId:recieverId,
            text:text,
            image:imageUrl
        })
        await newMessage.save();

        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Error in sending messages : ", error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}