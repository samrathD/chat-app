import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use("/api/auth", authRoutes)
app.get("/",(req,res)=>{
    res.send(`Welcome to home page ${req.query.name}`)    
})
app.listen(5001, ()=>{
    console.log("server is running on port 5001")
})