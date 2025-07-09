import { NextRequest } from "next/server";
export function GET(req : NextRequest){
    
    return new Response("Hello");

}