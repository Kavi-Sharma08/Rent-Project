import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User.model";
import { signupSchema } from "@/schemasForZod/signupSchema";
import DBconnect from "@/lib/dbConnect";
export async function POST(req: NextRequest , res:NextResponse) {
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
            password
        })
        const userinfo = await user.save();
        const res = NextResponse.json({
            success: true,
            message: "User created",
            data : userinfo
        });

        const token = user.generateJWT();
        res.cookies.set("token" , token);
        console.log(token)
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
