"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LoginModal from "./loginModal";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function Header({ darkMode, setDarkMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") setIsModalOpen(false);
  }, [status]);

  return (
    <>
      <header className="w-full flex justify-between items-center p-4 fixed top-0 z-50 bg-transparent">
        <Button
          className={`px-8 py-6 text-lg rounded ${
            darkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Dark Mode" : "Light Mode"}
        </Button>

        <h1
          className={`hidden sm:block text-3xl sm:text-4xl font-extrabold text-center mb-6 transition-colors duration-300 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Just Another To Do
        </h1>

        {status === "authenticated" ? (
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-full ${
              darkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-black"
            }`}
          >
            <img
              src={session?.user?.image || "/default-avatar.png"}
              alt={session?.user?.name || "User"}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium max-w-[12rem] truncate hidden sm:block">
              {session?.user?.name || "User"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className={`p-2 ${
                darkMode ? "hover:bg-white/10" : "hover:bg-black/10"
              }`}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            className="px-8 py-6 text-2xl"
            onClick={() => setIsModalOpen(true)}
          >
            Login
          </Button>
        )}
      </header>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        darkMode={darkMode}
      />
    </>
  );
}
