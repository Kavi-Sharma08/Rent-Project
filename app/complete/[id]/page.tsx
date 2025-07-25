'use client';

import { indiaStatesAndUTs } from '@/constants/StatesAndUnionTerritoryData';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Raleway_Font ,Manrope_Font, Lora_Font } from '@/fonts/signupPageFont';
import { Lexend_Font , Noticia_Font } from '@/fonts/updatePageFonts';
import { ZodIssue } from '@/types/typesforErrorSignup';
import toast , {Toaster} from 'react-hot-toast';
import { addUserProfile } from '@/slices/userSlice';
import {UpdateProfileResponse} from "@/types/ResponseDataForUser"
import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
export default function CollegeAutocomplete() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [college, setSelectedCollege] = useState('');
  const [profileCompletion, setProfileCompletion] = useState(30);
  const [filteredStates, setFilteredStates] = useState<string[]>([]);
  const [zodError, setzodError] = useState<ZodIssue[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e : React.ChangeEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try {
      const res = await axios.post<UpdateProfileResponse>(`${process.env.NEXT_PUBLIC_API_URL!}/api/completeProfile`,{
        college,
        location,
        phoneNumber
      })
      const updatedProfile = res?.data?.data;
      const id = updatedProfile.userId;
      dispatch(addUserProfile(updatedProfile));
      router.push(`/dashboard/${id}`);
      
    } catch (error : any) {
      setzodError([]);
      const resError = error?.response?.data?.errors;
      if(resError){
        setzodError(resError);
        
      }
      if(error?.response?.data?.message){
        console.log(error)
        const errorToShow = error?.response?.data?.message;
        toast.error(errorToShow);

      }
      
    }


  }
 
  function getErrorMessage(field : string){

    if(zodError.length>0){
      const filteredError = zodError.filter((pathError)=>(
        pathError.path[0]===field

      ))
      return filteredError;
    }

  }

  // Fetch college suggestions from API
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `https://collegeapi-xuix.onrender.com/colleges/search`,
        {}, // body
        {
          headers: {
            keyword: query,
          },
        }
      );
      

      const suggestions = Array.isArray(res.data)
        ? res.data.map((college: any) =>
            college[2]
              ?.replace(/\:[^>]*\)/gi, '')
              .replace(/(\(Id)/gi, '')
              .trim()
          )
        : [];
       

      setSuggestions(suggestions);
    } catch (err) {
      console.error('❌ Suggestion error:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelect = (college: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setSelectedCollege(college)
    setQuery(college);
    setSuggestions([]);
    setLoading(false);
  };

  // Debounce for query input
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  // Progress bar calculation
  useEffect(() => {
    const baseProgress = 30;
    const totalFields = 3;
    let filled = 0;

    if (query.trim() !== '') filled++;
    if (location.trim() !== '') filled++;
    if (phoneNumber.trim() !== '') filled++;

    const additionalProgress = Math.floor((filled / totalFields) * 70);
    setProfileCompletion(baseProgress + additionalProgress);
  }, [query, location, phoneNumber]);

  // Filter Indian states for location
  useEffect(() => {
    if (location.trim() === '') {
      setFilteredStates([]);
    } else {
      const matches = indiaStatesAndUTs.filter((state) =>
        state.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredStates(matches);
    }
  }, [location]);

  return (
    <>
      <Toaster/>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-2 bg-gray-400 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <span className={`text-sm font-medium ${Lora_Font.className}`}>{profileCompletion}% done</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full px-4">
        <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
          {/* College Name Field */}
          <div className="w-full relative">
            <label
              className={`${Raleway_Font.className} block mb-1 text-white`}
              htmlFor="college"
            >
              College Name
            </label>
            <input
              id="college"
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Type college name ..."
              className={`w-full px-3 py-2 rounded-md bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${Noticia_Font.className}`}
            />
            {loading && (
              <div className="absolute top-10 right-3 animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full" />
            )}
            {suggestions.length > 0 && (
              <ul className={`${Noticia_Font.className} absolute mt-1 w-full bg-[#1e1e1e] border border-gray-600 rounded-md shadow-lg max-h-72 overflow-y-auto z-50`}>
                {suggestions.map((college, idx) => (
                  <li
                    key={idx}
                    onMouseDown={() => handleSelect(college)}
                    className="px-4 py-3 border-b border-gray-700 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    {college}
                  </li>
                ))}
              </ul>
            )}
            {getErrorMessage("college") && (
              <p className={`${Lexend_Font.className} mt-2 ml-1`} style={{ color: "red", fontSize: "12px" }}>
                {getErrorMessage("college")?.map((msg)=>msg.message)}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div className="relative w-full">
            <label htmlFor="location" className="block text-white mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => {
                const input = e.target.value;
                setLocation(input);
                setFilteredStates(
                  input.trim().length > 0
                    ? indiaStatesAndUTs.filter((state) =>
                        state.toLowerCase().startsWith(input.toLowerCase())
                      )
                    : []
                );
              }}
              onFocus={() => {
                if (location.trim().length > 0) {
                  setFilteredStates(
                    indiaStatesAndUTs.filter((state) =>
                      state.toLowerCase().startsWith(location.toLowerCase())
                    )
                  );
                }
              }}
              onBlur={() => {
                setTimeout(() => setFilteredStates([]), 100);
              }}
              placeholder="Enter your location"
              className={`w-full px-3 py-2 rounded-md bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${Noticia_Font.className}`}
            />

            {filteredStates.length > 0 && (
              <ul className="absolute mt-1 w-full bg-[#1e1e1e] border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredStates.map((state, idx) => (
                  <li
                    key={idx}
                    onMouseDown={() => {
                      setLocation(state);
                      setFilteredStates([]);
                    }}
                    className={`px-4 py-2 text-white border-b border-gray-700 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200 ${Noticia_Font.className}`}
                  >
                    {state}
                  </li>
                ))}
              </ul>
            )}
            {getErrorMessage("location") && (
              <p className={`${Lexend_Font.className} mt-2 ml-1`} style={{ color: "red", fontSize: "12px" }}>
                {getErrorMessage("location")?.map((msg)=>msg.message)}
              </p>
            )}
          </div>
          

          {/* Phone Number Field */}
          <div className="w-full">
            <label
              className={`${Raleway_Font.className} block mb-1 text-white`}
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full px-3 py-2 rounded-md bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${Noticia_Font.className}`}
            />
            {getErrorMessage("phoneNumber") && (
              <div style={{ color: "red", fontSize: "12px" }} className={`mt-2 ml-2 ${Lexend_Font.className}`}>
                {getErrorMessage("phoneNumber")?.map((msg: { message: string }, index: number) => (
                  <p key={index}>{msg.message}</p>
                ))}
              </div>
            )}
          </div>

          <div  className='w-full'>
            <button type="submit" disabled={loading} className={`w-full bg-[#2a52be] text-white rounded-sm py-2 hover:bg-blue-700 transition ${Manrope_Font.className}`}>
              
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
