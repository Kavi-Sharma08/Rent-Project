"use client"
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { RootState } from "@/store/appStore";
import { useSelector } from "react-redux";
export default function Dashboard(){
    const reduxDataOfUser = useSelector((store : RootState)=>store.user);
    const currentUserData = reduxDataOfUser.currentUser;
    const updatedProfile = reduxDataOfUser.updatedProfileOfUser;
    console.log(currentUserData);
    console.log(updatedProfile)
    
    return (
        <ProtectedRoute>
            <div className="max-h-screen grid grid-cols-6">
                <div className="max-h-screen col-span-2 bg-[#1A2421]">
                    Sidebbar
                </div>
                <div className="bg-amber-400 col-span-4">
                    Create Post
                </div>
            </div>

        </ProtectedRoute>
        
    )
}