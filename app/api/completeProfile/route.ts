import { NextRequest, NextResponse } from "next/server";
import { updateProfileSchema } from "@/schemasForZod/updateProfileSchema";
import UserProfile from "@/models/UserProfile";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWTPayload } from "@/types/typesForJWTPayload";
import DBconnect from "@/lib/dbConnect";
export async function POST(req : NextRequest) {
    await DBconnect();
    const body = await req.json();
    
    const parseResult = updateProfileSchema.safeParse(body);
    
    if(!parseResult.success){
        const errors = parseResult.error.issues;
        return NextResponse.json({errors} , {status:400})
        
        
    }
    const {college , location , phoneNumber} = parseResult?.data;

    const token = (await cookies()).get("accessToken")?.value;
    if(!token){
        return NextResponse.json({
            message : "Unauthorized Sign in First"
        }, {status : 400})
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET!) as JWTPayload;
        const userId = decoded.id;
       
            
        const updatedProfile = new UserProfile({
            userId,
            college,
            location,
            phoneNumber

        })
        const profile = await updatedProfile.save();
       
        return NextResponse.json({
            data : profile,
            message : "Profile Updated"
        } , {status : 200});

        
    } catch (error) {
        console.log(error)
        
    }
    

    
}