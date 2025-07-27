import {v2 as cloudinary} from "cloudinary"
import { config } from "dotenv"

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEU,
    api_secret: process.config.CLOUDINARY_API_SECRET
})

export default cloudinary;