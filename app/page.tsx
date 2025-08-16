"use client";

import { useRouter } from "next/navigation";
import { Poppins, Montserrat, Lexend } from "next/font/google";
import {LOGO} from "@/constants/Logo"
import ProtectedRoute from "./components/ProtectedRoute";

const poppins = Poppins({ subsets: ['latin'], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ["400", "700"] });
const lexend = Lexend({ subsets: ['latin'], weight: ["400", "700"] });
const DEEP_BLUE = "#0a192f";
const MID_BLUE = "#1e293b";
const ACCENT = "#3b82f6";
const VIBRANT = "#38bdf8";
const WHITE = "#fff";

export default function Home() {
  const router = useRouter();

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-[${DEEP_BLUE}] via-[${MID_BLUE}] to-black ${poppins.className}`}>

      {/* Sticky header */}
      <header 
        className="sticky top-0 z-50 flex justify-between items-center px-8 py-6 bg-[#0a192f]/90 backdrop-blur-md shadow-md"
      >
        {/* FLEX CONTAINER FOR BRAND + LOGO */}
        <div className="flex items-center space-x-3">
          <h1 className={`text-3xl md:text-4xl font-extrabold ${lexend.className}`}>
            <span style={{ color: VIBRANT }}>Just</span>
            <span style={{ color: WHITE }}>Share</span>
          </h1>
          <img
            src={LOGO}
            alt="JustShare Logo"
            width={48}
            height={48}
            className="rounded-lg object-contain"
            style={{ width: "48px", height: "48px" }}
          />
        </div>
        
        <nav className="space-x-5">
          <button
            onClick={() => router.push("/signup")}
            className="px-5 py-2 rounded-md border border-[#3b82f6] hover:bg-[#3b82f6] transition font-semibold text-white"
            style={{ fontFamily: montserrat.style.fontFamily }}
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-5 py-2 rounded-md bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] font-bold shadow hover:from-[#3b82f6] hover:to-[#38bdf8] transition text-black"
            style={{ fontFamily: montserrat.style.fontFamily }}
          >
            Sign Up
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto flex-1">
        <h2 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg ${lexend.className}`} style={{ color: VIBRANT }}>
          Welcome to <span style={{ color: ACCENT }}>JustShare</span>
        </h2>
        <p className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300 ${poppins.className}`}>
          The student-powered platform to <span style={{ color: ACCENT, fontWeight: 600 }}>buy</span>, <span style={{ color: VIBRANT, fontWeight: 600 }}>sell</span>, <span style={{ color: "#38d9a9", fontWeight: 600 }}>donate</span>, and <span style={{ color: WHITE, fontWeight: 700 }}>connect</span> with your campus community.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="px-10 py-4 text-xl font-extrabold rounded-xl shadow-lg bg-gradient-to-r from-[#38bdf8] to-[#3b82f6] text-black hover:scale-105 transition"
        >
          Get Started for Free
        </button>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-[#1e293b]">
        <h3 className={`text-3xl font-semibold text-white mb-12 text-center ${montserrat.className}`}>
          How JustShare Works
        </h3>
        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {/* List Item */}
          <div className="w-72 rounded-2xl p-8 shadow-lg text-center border border-[#38bdf8] bg-[#0a192f]">
            <div className="text-5xl mb-4 text-[#38bdf8]">📝</div>
            <h4 className="font-semibold text-white mb-2">List Your Item</h4>
            <p className="text-gray-300 text-sm">
              Snap a pic, write a quick post — books, notes, cycles, more.
            </p>
          </div>
          {/* Connect & Chat */}
          <div className="w-72 rounded-2xl p-8 shadow-lg text-center border border-[#3b82f6] bg-[#0a192f]">
            <div className="text-5xl mb-4 text-[#3b82f6]">🤝</div>
            <h4 className="font-semibold text-white mb-2">Connect & Chat</h4>
            <p className="text-gray-300 text-sm">
              Message fellow students directly, ask questions, arrange meetups.
            </p>
          </div>
          {/* Share & Receive */}
          <div className="w-72 rounded-2xl p-8 shadow-lg text-center border border-[#38d9a9] bg-[#0a192f]">
            <div className="text-5xl mb-4 text-[#38d9a9]">🎁</div>
            <h4 className="font-semibold text-white mb-2">Share & Receive</h4>
            <p className="text-gray-300 text-sm">
              Give gently-used items. Find what you need — save money, make new friends.
            </p>
          </div>
        </div>
      </section>

      {/* Inspirational Quote */}
      <section className="max-w-4xl mx-auto text-center p-12 py-20">
        <blockquote className={`text-2xl md:text-3xl font-semibold italic mb-6 text-[#38bdf8]`}>
          “Every book you pass forward is a bond you create. Every cycle reused is a campus connection.”
        </blockquote>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
          <span className="text-[#3b82f6] font-semibold">JustShare</span> is here to help you build connections beyond transactions — making sharing easy, fun, and safe.
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#0a192f] py-6 text-center text-gray-400 border-t border-[#3b82f6]">
        © {new Date().getFullYear()} <span style={{ color: ACCENT }}>JustShare</span> • Your campus. Your community. Your story.
      </footer>
    </div>
  );
}
