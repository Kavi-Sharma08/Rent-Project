import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from "cloudinary";
import ProductModel from "@/models/Product.model";
import DBconnect from "@/lib/dbConnect";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure : true
});
export async function POST(req: NextRequest) {
  await DBconnect();
  try {
    const formData = await req.formData();
    console.log(formData)
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price  = formData.get("price") as string;
    const type = formData.get("type") as string;
    const college = formData.get("college") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const postedBy = formData.get("postedBy") as string;
    const file = formData.get("image") as File;
    if(!file){
        return NextResponse.json({
            message : "Image is required"
        }, { status: 400 })
        
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {   folder: "products",
            use_filename: true,
            unique_filename: false ,
            transformation: [
                { width: 800, height: 800, crop: "limit" }, // limit size
                { quality: "auto" }, // auto compression
                { fetch_format: "jpg" } // ensure jpg for smaller size
            ]
        },

        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    console.log(uploadResult);

    const Product = new ProductModel ({
        title,
        description,
        college,
        price,
        phoneNumber,
        imageUrl : uploadResult.secure_url,
        postedBy,
        type
    })
    const savedProduct = await Product.save();
    console.log(savedProduct);

    return NextResponse.json(savedProduct);
  } catch (err) {
    console.error("Error parsing form data", err);
    return NextResponse.json({ error: "Failed to parse form data" }, { status: 500 });
  }
}
// const uploadImage = async (imagePath) => {

//     // Use the uploaded file's name as the asset's public ID and 
//     // allow overwriting the asset with new versions
//     const options = {
//       use_filename: true,
//       unique_filename: false,
//       overwrite: true,
//     };

//     try {
//       // Upload the image
//       const result = await cloudinary.uploader.upload(imagePath, options);
//       console.log(result);
//       return result.public_id;
//     } catch (error) {
//       console.error(error);
//     }
// };