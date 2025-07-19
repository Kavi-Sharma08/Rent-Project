'use client';
import { indiaStatesAndUTs } from '@/constants/StatesAndUnionTerritoryData';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChatgptResponse } from '@/types/ResponseDataForUser';
import { Raleway_Font } from '@/fonts/signupPageFont';
import { string } from 'zod';

export default function CollegeAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [profileCompletion, setProfileCompletion] = useState(30); 
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [filteredStates, setFilteredStates] = useState<string[]>([]);

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
      const fetchSuggestions = async () => {
        setLoading(true);
        try {
          const res = await axios.post<ChatgptResponse>('/api/getColleges', { query });
          const suggestions = Array.isArray(res.data.suggestions)
            ? res.data.suggestions
            : [];
          setSuggestions(suggestions);
        } catch (err) {
          console.error('❌ Suggestion error:', err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSuggestions();
    }, 600);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);
  useEffect(() => {
    const baseProgress = 30; // Your initial value
    const totalFields = 3;
    let filled = 0;

    if (query.trim() !== '') filled++;
    if (location.trim() !== '') filled++;
    if (phone.trim() !== '') filled++;

    const additionalProgress = Math.floor((filled / totalFields) * 70); // Remaining 70% spread across fields

    setProfileCompletion(baseProgress + additionalProgress);
  }, [query, location, phone]);
  useEffect(() => {
    if (location.trim() === "") {
      setFilteredStates([]);
    } else {
      const matches = indiaStatesAndUTs.filter((state) =>
        state.toLowerCase().includes(location.toLowerCase())
      );
      setFilteredStates(matches);
    }
  }, [location]);

  const handleSelect = (college: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setQuery(college);
    setSuggestions([]);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center text-white">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-2 bg-gray-400 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <span className="text-sm font-medium">
            {profileCompletion}% done
          </span>
        </div>

      </div>
      

      <form  className="flex flex-col items-center w-full px-4">
        <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
          
          {/* College Name Field */}
          <div className="w-full relative">
            <label className={`${Raleway_Font.className} block mb-1 text-white`} htmlFor="college">
              College Name
            </label>
            <input
              id="college"
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Type college name ..."
              className="w-full px-3 py-2 rounded-md bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {loading && (
              <div className="absolute top-10 right-3 animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full" />
            )}
            {suggestions.length > 0 && (
              <ul className="absolute z-30 mt-1 w-full bg-[#1e1e1e] border border-gray-600 rounded-md shadow-lg max-h-72 overflow-y-auto">
                {suggestions.map((college, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(college)}
                    className="px-4 py-3 border-b border-gray-700 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    {college}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Location Field */}
          <div className="relative w-full">
            <label htmlFor="location" className="block text-white mb-1">Location</label>
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
                // Delay hiding to allow click on suggestion
                setTimeout(() => setFilteredStates([]), 100);
              }}
              placeholder="Enter your location"
              className="w-full px-3 py-2 rounded-md bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 text-white border-b border-gray-700 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    {state}
                  </li>
                ))}
              </ul>
            )}
          </div>

            
          

          {/* Phone Number Field */}
          <div className="w-full">
            <label className={`${Raleway_Font.className} block mb-1 text-white`} htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 rounded-md bg-[#1e1e1e] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </form>
    </>
    
  );
}
