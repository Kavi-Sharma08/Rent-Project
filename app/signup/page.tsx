"use client";
import {useState , useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import {ZodIssue} from "@/types/typesforErrorSignup";
import { AppDispatch } from "@/store/appStore";
import { useDispatch } from "react-redux";
import { addUser } from "@/slices/userSlice";
import {IAPIError} from "@/types/typesforErrorSignup"
import {  Lora_Font , Manrope_Font , Raleway_Font , Roboto_Font , Open_Font} from "@/fonts/signupPageFont";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/ResponseDataForUser";
import toast , {Toaster} from "react-hot-toast"
export default function SignUp() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("Kavi");
  const [email, setEmail] = useState("Kavi@gmail.com");
  const [password, setPassword] = useState("Kavi@123");
  const [togglePassword, setTogglePassword] = useState(false);
  const [zodError, setZodError] = useState<ZodIssue[]>([]);
  const [error, setError] = useState<IAPIError | null>(null);
  

  const [Login, setLogin] = useState(false);
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Login) {
      try {
        const res = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL!}/api/login`, {
          email,
          password,
        });
        dispatch(addUser(res?.data?.data))
        router.push(`/update/${res?.data?.data?._id}`)
        
        
      } catch (error : any) {
        const resError = error?.response?.data?.errors;
        if(resError){
          setZodError(resError)
        }
        else{
          toast.error(error.response.data.message);
          setError(error.response);
        }
      }
    } else {
      try {
        const res = await axios.post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL!}/api/signup`, {
          name,
          email,
          password,
        });
        console.log(res)
        dispatch(addUser(res?.data?.data))
        router.push(`/update/${res?.data?.data?._id}`)
        
      } catch (error: any) {
        const resError = error?.response?.data?.errors;
        if(resError){
          setZodError(resError)
        }
        else{
          setError(error.response)

        }
      }
    }
  };

  const getErrorMessage = (field: string) => {
    if (zodError.length>0) {
      const filteredError = zodError.filter(
        (pathError) => pathError.path[0] === field
      );
      console.log(filteredError)
      return filteredError
    }
    else{
      return null;
    }
  };
  useEffect(()=>{
    setError(null);

  },[Login])

  return (
    <div className={`min-h-screen bg-black grid sm:grid-cols-2`}>
      <Toaster/>
      <div className="sm:grid-cols-1 flex justify-center items-center w-full h-full">
        <div className="flex flex-col justify-center items-center px-6 py-8 text-white">
          <div className="w-full max-w-md">
            <div className="flex space-x-2 mb-8 text-2xl md:text-4xl font-semibold">
              <span className={`${Manrope_Font.className}`}>Welcome</span>
              <span className={`${Manrope_Font.className}`}>to</span>
              <span className={`text-[#004780] ${Lora_Font.className}`}>JustShare</span>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!Login && (
                <div className="flex flex-col">
                  <label htmlFor="Name" className={`mb-1 ${Raleway_Font.className}`}>
                    Name
                  </label>
                  <input
                    id="Name"
                    type="text"
                    className={`bg-[#232735] text-white rounded-sm p-2 focus:outline-none text-sm ${Roboto_Font.className} `}
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
                <label htmlFor="Email" className={`mb-1 ${Raleway_Font.className}`}>
                  Email
                </label>
                <input
                  id="Email"
                  type="text"
                  className={`bg-[#232735] text-white rounded-sm p-2 focus:outline-none text-sm ${Roboto_Font.className} `}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {getErrorMessage("email") && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {getErrorMessage("email")?.map((msg)=>msg.message)}
                    </p>
                )}
                {
                  error?.data?.message?.toLowerCase().includes("email") && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {error.data.message}
                    </p>
                  )
                }
              </div>

              <div className="flex flex-col">
                <label htmlFor="Password" className={`mb-1 ${Raleway_Font.className}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="Password"
                    type={togglePassword ? "text" : "password"}
                    className={`bg-[#232735] text-white rounded-sm p-2 w-full focus:outline-none text-sm ${Roboto_Font.className} `}
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
                  {
                    error?.data?.message?.toLowerCase().includes("password") && (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        {error.data.message}
                      </p>
                    )
                  }
                </div>
                
              </div>
              <div>
                {error?.data?.message?.toLowerCase().includes("invalid") && (
                    <p style={{ color: "red", fontSize: "12px" }}>
                      {error.data.message}
                    </p>
                )}
              </div>
              <button
                type="submit"
                className={`w-full bg-[#2a52be] text-white rounded-sm py-2 hover:bg-blue-700 transition ${Manrope_Font.className}`}
              >
                {Login ? "Sign in" : "Sign up"}
              </button>
            </form>
            <div className="mt-5">
              <p className={`${Manrope_Font.className}`}>
                {!Login ? "Already Registered?" : "Don't have an account?"}{" "}
                <button
                  className="text-[#2a52be] cursor-pointer"
                  onClick={() => setLogin((prev) => !prev)}
                  type="button"
                >
                  {!Login ? "Login" : "Signup"}
                </button>
              </p>
            </div>
          </div>
          
        </div>
      </div>
      {/* Right Section (Image) */}
      <div className={`sm:grid-cols-1 flex flex-col justify-center items-center px-6 py-8 text-center text-white ${Open_Font.className}`}>
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
