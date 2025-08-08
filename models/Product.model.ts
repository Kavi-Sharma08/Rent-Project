import mongoose, { mongo } from "mongoose";

export interface IProduct {
    title : string, // Title of the Product 
    description : string,  // About the condition of the Product
    price : number,
    imageUrl : string,
    type : string,  // buy or sell
    postedBy : mongoose.Schema.Types.ObjectId | string,
    college : string,
    phoneNumber : string,
    createdAt : Date

}


const ProductSchema = new mongoose.Schema<IProduct>({
    title : {
        type : String,
    },
    description : {
        type : String
    },
    price : {
        type : Number
    },
    imageUrl : {
        type : String
    },
    type : {
        type : String,
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "User",
    }

})

const ProductModel = mongoose.model("Product" , ProductSchema)
export default ProductModel;