import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadCloudinary = (Buffer) =>{
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({'folder': 'test'},(error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
        streamifier.createReadStream(Buffer).pipe(stream);
    });
}

export default uploadCloudinary