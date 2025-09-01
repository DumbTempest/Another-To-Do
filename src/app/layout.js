"use client"; // must be first line

import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true); // shared state

  // Pass darkMode and setDarkMode to all children
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { darkMode, setDarkMode });
    }
    return child;
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300
        ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {childrenWithProps}
      </body>
    </html>
  );
}
