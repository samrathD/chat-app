import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors"

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin : "http://localhost:5173",
    credentials: true
}));

// Middleware
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Authentication Routes
app.use("/api/auth", authRoutes)

// Messaging Routes
app.use("/api/messages", messageRoutes);
app.get("/",(req,res)=>{
    res.send(`Welcome to home page ${req.query.name}`)    
})
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})