"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";

export default function LoginModal({ isOpen, onClose, darkMode }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm p-6 rounded-2xl ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="flex flex-col items-center gap-6 ">
          <h2 className="text-2xl font-bold">Sign In</h2>

          <Button
            variant="outline"
            className={`w-full px-8 py-6 text-lg rounded ${
            darkMode ? "bg-slate-900 text-white" : "bg-gray-200 text-black"
          }`}
            onClick={() => signIn("google")}
          >
            Google
          </Button>

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
