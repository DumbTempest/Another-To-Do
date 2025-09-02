"use client";

import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();

  if (session) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        <div className="absolute top-4 left-4">
          <Button
            className={`px-8 py-6 text-lg rounded ${
              darkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </Button>
        </div>

        <Card
          className={`w-full max-w-sm p-8 rounded-2xl shadow-xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <CardContent className="flex flex-col items-center gap-4 p-0">
            <h1 className="text-3xl font-bold">Welcome, {session.user.name}</h1>
            <img
              src={session.user.image}
              alt="Profile Picture"
              className="w-20 h-20 rounded-full"
            />
            <p>{session.user.email}</p>

            <Button
              variant="default"
              className="mt-4 w-full"
              onClick={() => signOut()}
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } relative`}
    >
      <div className="absolute top-4 left-4">
        <Button
          className={`px-8 py-6 text-lg rounded ${
            darkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Button>
      </div>

      <Card
        className={`w-full max-w-sm p-8 rounded-2xl shadow-xl transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <CardContent className="flex flex-col items-center gap-6 p-0">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a login method
          </p>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("discord")}
          >
            Discord
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google")}
          >
            Google
          </Button>

          <Separator className="my-4 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
