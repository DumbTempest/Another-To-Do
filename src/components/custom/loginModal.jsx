"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LoginModal({ isOpen, onClose, darkMode }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose} // click outside closes modal
    >
      <div
        className={`w-full max-w-sm p-6 rounded-2xl shadow-lg ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        <CardContent className="flex flex-col items-center gap-6 p-0">
          <h2 className="text-2xl font-bold">Sign In</h2>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => alert("Login with Discord")}
          >
            Discord
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => alert("Login with Google")}
          >
            Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => alert("Login with GitHub")}
          >
            GitHub
          </Button>

          <Separator className="my-4 w-full" />

          <Button
            variant="ghost"
            className="w-full"
            onClick={onClose}
          >
            Close
          </Button>
        </CardContent>
      </div>
    </div>
  );
}
