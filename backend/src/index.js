import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

app.use("/api/auth", authRoutes)
app.get("/",(req,res)=>{
    res.send(`Welcome to home page ${req.query.name}`)    
})
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
})