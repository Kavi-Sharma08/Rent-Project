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
            password
        })
        const userinfo = await user.save();
        return NextResponse.json({
            success : true,
            data : userinfo
        })
    } catch (error) {
        console.log('Error in signup:', error);
        
    }

  }
  return new Response("Signup");
}
