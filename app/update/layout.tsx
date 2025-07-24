import React from 'react';
import { Lora_Font } from '@/fonts/signupPageFont';

export default function BasicLayout({ children} : Readonly<{children : React.ReactNode;}>) {
  return (
    <div className="min-h-screen">
      
      <header className=" px-6 py-4 shadow-md rounded-b-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <h1 className="text-white text-xl md:text-2xl font-semibold tracking-wide">
            📄 <span className={`text-[#4682b4] underline-offset-4 ${Lora_Font.className}`}>Complete Your Profile</span>
          </h1>
        </div>
      </header>
      <main>
        
        {children}
        
      </main>
    </div>
  );
}
