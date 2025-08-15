import ProductModel from "@/models/Product.model";
import { NextRequest  , NextResponse } from "next/server";
import DBconnect from "@/lib/dbConnect";
export async function GET(req : NextRequest){
    await DBconnect();
    const currentUserId = req.nextUrl.searchParams.get('id');
    if(!currentUserId){
        return NextResponse.json({message : "User Not Found"});
    }

    const productsOfUser = await ProductModel.find({postedBy : currentUserId});
    console.log(productsOfUser)
    return NextResponse.json({productsOfUser});
}