import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import { signupSchema } from "@/schemasForZod/signupSchema";
import DBconnect from "@/lib/dbConnect";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parseResult = signupSchema.safeParse(body);
  if (!parseResult.success) {
    const errors = parseResult.error.issues;
    return NextResponse.json({errors},{status : 400})
  }
  else{
    await DBconnect()
    const {name , email , password} = parseResult.data;
    try {
        const user = new UserModel({
            name,
            email,
            password,
        })
        const refreshTokenForTheUser = await user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        const userinfo = await user.save();
        console.log(userinfo)
        const res = NextResponse.json({
            success: true,
            message: "User created",
            data : userinfo
        });
        res.cookies.set("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60,
          path: "/"
        });
        res.cookies.set("refreshToken", refreshTokenForTheUser, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60,
          path: "/"
        });

        
        console.log(accessToken)
        return res;
    } 
    catch (error : any) {
      return NextResponse.json({
        success : false,
        message : error.message
      },{status : 400})
        
    }

  }
}
