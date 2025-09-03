"use client";

import { useState } from "react";
import Header from "@/components/custom/header";
import Content from "@/components/custom/content";
// import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export default function MainPage() {
  const [darkMode, setDarkMode] = useState(true); 

  return (
    <div className={`transition-colors duration-300 ${darkMode ? "bg-black" : "bg-white"}`}>
 
      {/* <BackgroundRippleEffect rows={10} cols={25} cellSize={50} /> */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />


      <main className="pt-20 flex-1">
        <Content darkMode={darkMode} />
      </main>
    </div>
  );
}
