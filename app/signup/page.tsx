"use client";
import {useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import {ZodIssue} from "@/types/typesforErrorSignup";
export default function SignUp() {
  const [name, setName] = useState("Kavi");
  const [email, setEmail] = useState("Kavi@gmail.com");
  const [password, setPassword] = useState("Kavi@123");
  const [togglePassword, setTogglePassword] = useState(false);
  const [error, setError] = useState<ZodIssue[]>([]);
  const [Login, setLogin] = useState(false);
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Login) {
      try {
        await axios.post("http://localhost:3000/api/login", {
          email,
          password,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.post("http://localhost:3000/api/signup", {
          name,
          email,
          password,
        });
      } catch (error: any) {
        const resError = error.response.data.errors;
        console.log(resError);
        setError(resError);
      }
    }
  };
  const getErrorMessage = (field: string) => {
    if (error.length>0) {
      const filteredError = error.filter(
        (pathError) => pathError.path[0] === field
      );
      console.log(filteredError)
      return filteredError
    }
    else{
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-black grid sm:grid-cols-2  ">
      <div className="sm:grid-cols-1 flex justify-center items-center w-full h-full">
        <div className="flex flex-col justify-center items-center px-6 py-8 text-white">
          <div className="w-full max-w-md">
            <div className="flex space-x-2 mb-8 text-2xl md:text-3xl font-semibold">
              <span>Welcome</span>
              <span>to</span>
              <span className="text-[#2a52be]">JustShare</span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!Login && (
                <div className="flex flex-col">
                  <label htmlFor="Name" className="mb-1">
                    Name
                  </label>
                  <input
                    id="Name"
                    type="text"
                    className="bg-[#232735] text-white rounded-sm p-2 focus:outline-none"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  {getErrorMessage("name") && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {getErrorMessage("name")?.map((msg)=>msg.message)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col">
                <label htmlFor="Email" className="mb-1">
                  Email
                </label>
                <input
                  id="Email"
                  type="text"
                  className="bg-[#232735] text-white rounded-sm p-2 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {getErrorMessage("email") && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {getErrorMessage("email")?.map((msg)=>msg.message)}
                    </p>
                )}
              </div>

              <div className="flex flex-col">
                <label htmlFor="Password" className="mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="Password"
                    type={togglePassword ? "text" : "password"}
                    className="bg-[#232735] text-white rounded-sm p-2 w-full focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-white"
                    onClick={() => setTogglePassword((prev) => !prev)}
                  >
                    {togglePassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </div>
                  {getErrorMessage("password") && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {getErrorMessage("password")?.map((msg)=>msg.message)}
                    </p>
                )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#2a52be] text-white rounded-sm py-2 hover:bg-blue-700 transition"
              >
                {Login ? "Sign in" : "Sign up"}
              </button>
            </form>
            <div className="mt-5">
              <p>
                {Login ? "Already Registered?" : "Don't have an account?"}{" "}
                <button
                  className="text-[#2a52be] cursor-pointer"
                  onClick={() => setLogin((prev) => !prev)}
                  type="button"
                >
                  {Login ? "Login" : "Signup"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Right Section (Image) */}
      <div className="sm:grid-cols-1 flex flex-col justify-center items-center px-6 py-8 text-center text-white">
        <img
          src="/images/SignupPageImage.jpg"
          alt="Students sharing"
          className="w-full max-w-sm h-64 object-cover rounded-md mb-4 shadow-lg"
        />
        <h2 className="text-xl md:text-2xl font-bold mb-2">
          Share Freely, Grow Together
        </h2>
        <p className="text-sm md:text-base text-gray-300 px-2">
          JustShare helps students lend, borrow, or donate study tools, books,
          and daily essentials — all in your campus.
        </p>
      </div>
    </div>
  );
}
