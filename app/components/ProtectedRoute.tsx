"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { addUser ,addUserProfile } from "@/slices/userSlice";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const updatedProfileOfUser = useSelector((state: RootState) => state.user.updatedProfileOfUser);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Rehydrate user from localStorage
    if (!currentUser) {
      const storedUser = localStorage.getItem("currentUser");
      const updatedUser = localStorage.getItem("updatedUser");
      if (storedUser && updatedUser) {
        dispatch(addUser(JSON.parse(storedUser)));
        dispatch(addUserProfile(JSON.parse(updatedUser)));
        return;
      } else {
        router.replace("/signup"); // Redirect if no user at all
      }
    } else {
      // Keep localStorage in sync
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("updatedUser", JSON.stringify(updatedProfileOfUser));
    }
  }, [currentUser,updatedProfileOfUser, dispatch, router]);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#0A0A0A]">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
