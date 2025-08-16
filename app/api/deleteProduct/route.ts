import ProductModel from "@/models/Product.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req : NextRequest){
    const productId = req.nextUrl.searchParams.get('id');
    if(!productId){
        return NextResponse.json({message : "Id not Found"})
    }

    const Product = await ProductModel.findByIdAndDelete({_id : productId});
    console.log(Product);
    return NextResponse.json({message : "Product Deleted"});
}