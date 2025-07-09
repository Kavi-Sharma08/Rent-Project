"use client";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const [togglePassword, setTogglePassword] = useState(false);

  return (
    <div className="w-screen h-screen bg-black">
      <div className="grid md:grid-cols-2 grid-cols-1 w-full h-full">
        
        <div className="flex flex-col justify-center items-center px-6 py-8 text-white">
          <div className="w-full max-w-md">
            <div className="flex space-x-2 mb-8 text-2xl md:text-3xl font-semibold">
              <span>Welcome</span>
              <span>to</span>
              <span className="text-[#2a52be]">JustShare</span>
            </div>

            <form className="space-y-4">
              
              <div className="flex flex-col">
                <label htmlFor="Name" className="mb-1">Name</label>
                <input
                  id="Name"
                  type="text"
                  className="bg-[#232735] text-white rounded-sm p-2 focus:outline-none"
                />
              </div>

              
              <div className="flex flex-col">
                <label htmlFor="Email" className="mb-1">Email</label>
                <input
                  id="Email"
                  type="email"
                  className="bg-[#232735] text-white rounded-sm p-2 focus:outline-none"
                />
              </div>

              
              <div className="flex flex-col">
                <label htmlFor="Password" className="mb-1">Password</label>
                <div className="relative">
                  <input
                    id="Password"
                    type={togglePassword ? "text" : "password"}
                    className="bg-[#232735] text-white rounded-sm p-2 w-full focus:outline-none"
                  />
                  <div
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
                    onClick={() => setTogglePassword(prev => !prev)}
                  >
                    {togglePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2a52be] text-white rounded-sm py-2 hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="h-full w-full flex flex-col justify-center items-center px-6 py-8 text-center text-white">
          <img
            src="/images/SignupPageImage.jpg"
            alt="Students sharing"
            className="w-full max-w-sm h-64 object-cover rounded-md mb-4 shadow-lg"
          />
          <h2 className="text-xl md:text-2xl font-bold mb-2">Share Freely, Grow Together</h2>
          <p className="text-sm md:text-base text-gray-300 px-2">
            JustShare helps students lend, borrow, or donate study tools, books, and daily essentials — all in your campus.
          </p>
        </div>
      </div>
    </div>
  );
}
