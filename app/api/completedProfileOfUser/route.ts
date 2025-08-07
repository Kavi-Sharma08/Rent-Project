import UserProfile from "@/models/UserProfile";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const idOfUser =  req.nextUrl.searchParams.get('id');
    
    const user = await UserProfile.findOne({userId : idOfUser});
    console.log("Kavi Sharma :- " , user)
    
    return NextResponse.json({
        data : user
    } , {status : 200})
}