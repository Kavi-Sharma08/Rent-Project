import ProductModel from "@/models/Product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const products = await ProductModel.find();
    console.log(products);
    return NextResponse.json({products});
}