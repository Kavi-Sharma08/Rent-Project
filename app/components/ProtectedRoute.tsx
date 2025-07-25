// components/ProtectedRoute.tsx
"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/appStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/signup"); // Redirect to signup/login if not logged in
    }
  }, [currentUser]);

  if (!currentUser) {
    return null; // Optionally render a loader here
  }
  return <>{children}</>;
}
