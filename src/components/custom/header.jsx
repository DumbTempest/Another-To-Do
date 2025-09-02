"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "./loginModal";

export default function Header({ darkMode, setDarkMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="w-full flex justify-between items-center p-4 fixed top-0 z-50 bg-transparent">
        <Button
          className={`px-8 py-6 text-lg rounded ${darkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-black"}`}
          onClick={() => setDarkMode(!darkMode)}
        >

          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}

        </Button>
        <Button
          variant="default"
          className="px-8 py-6 text-2xl"
          onClick={() => setIsModalOpen(true)}
        >
          Save
        </Button>


        <Button
          variant="default"
          className="px-8 py-6 text-2xl"
          onClick={() => setIsModalOpen(true)}
        >
          Login
        </Button>

      </header>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
}
