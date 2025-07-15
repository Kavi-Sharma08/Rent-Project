import { NextRequest, NextResponse } from "next/server";
import { signinSchema } from "@/schemasForZod/signinSchema";
import DBconnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcrypt"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { JWTPayload } from "@/types/typesForJWTPayload";
import { User } from "@/types/typesForUser";
import { UserInterface } from "@/models/User.model";
export async function POST(req : NextRequest){
    
    const body = await req.json();
    const parseResult = signinSchema.safeParse(body);
    if(!parseResult.success){
        const errors = parseResult.error.issues;
        return NextResponse.json({errors} , {status : 400});
        
    }
    else{
        await DBconnect();
        const cookie = cookies();
        const {email , password} = body;
        const tokenFromtheUser = (await cookie).get('accessToken')?.value;
        const RefreshtokenFromtheUser = (await cookie).get('refreshToken')?.value;
        try {
            if(tokenFromtheUser){
                const userInfo = jwt.verify(tokenFromtheUser , process.env.JWT_SECRET!) as JWTPayload;
                const idOfLoggedInUser = userInfo.id;
                const user : User|null = await UserModel.findOne({_id : idOfLoggedInUser}).select("-password -refreshToken")
                if(!user){
                    return NextResponse.json({
                        message : "Unauthorized",

                    } , {status : 401})

                }
                else{
                    console.log(user);
                    return NextResponse.json({
                        data : user
                    })
                        

                }
            }
            else if(RefreshtokenFromtheUser){
                // new token from the refresh token
                console.log(RefreshtokenFromtheUser)

                const userInfo = jwt.verify(RefreshtokenFromtheUser , process.env.REFRESH_TOKEN_SECRET!) as JWTPayload;

                const {email} = userInfo;
                const user : UserInterface | null = await UserModel.findOne({email});
                console.log(user)
                if(!user){
                    return NextResponse.json({
                        message : "Unauthorized"
                    },{status : 400})
                }
                const newRefreshToken =await  user.generateRefreshToken();
                const newAccessToken = user.generateAccessToken();
                const res = NextResponse.json({
                    success: true,
                    message: "User created",
                    data : user
                });
                res.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60,
                    path: "/"
                });
                
                res.cookies.set("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 7*24 * 60 * 60,
                    path: "/"
                });
                
                return res;



            }
            else{
                const user : UserInterface | null = await UserModel.findOne({email});
                if(!user){
                    return NextResponse.json({
                        message : "Unauthorized",

                    },{status : 400});
                }

                const accessToken = user.generateAccessToken();
                const refreshToken = await user.generateRefreshToken();
                const res = NextResponse.json({
                    success: true,
                    data : user
                });

                res.cookies.set("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60,
                    path: "/"
                });
                res.cookies.set("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60,
                    path: "/"
                });

                return res;





            }
            
            
        } catch (error) {

            console.log(error)
            
        }


    }
    

}