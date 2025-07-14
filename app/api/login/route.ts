import { NextRequest, NextResponse } from "next/server";
import { signinSchema } from "@/schemasForZod/signinSchema";
import DBconnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcrypt"
export async function POST(req : NextRequest){
    const body = await req.json();
    const parseResult = signinSchema.safeParse(body);
    if(!parseResult.success){
        const errors = parseResult.error.issues;
        return NextResponse.json({errors} , {status : 400});
        
    }
    else{
        await DBconnect();
        const {email , password} = body;

        const user = await UserModel.findOne({email});

        if(!user){
            return NextResponse.json({message : "User Not Found "} , {status : 400})
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);

        if(!isPasswordValid){
            return NextResponse.json({message : "Password is not correct"} , {status : 400});
        }
        
        return NextResponse.json({user});


    }
    

}