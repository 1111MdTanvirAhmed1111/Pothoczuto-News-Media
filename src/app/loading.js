"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full">
      <div className="relative flex flex-col items-center gap-6">
        {/* Main spinner */}
        <div className="relative flex">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-green-500 animate-spin"></div>
          <div className="absolute inset-0 h-24 w-24 rounded-full border-r-4 border-l-4 border-green-400 animate-ping opacity-70"></div>
          <div className="absolute inset-0 h-24 w-24 rounded-full border-4 border-green-400/20"></div>
        </div>
        
        {/* Pulsing circle underneath */}
        <div className="absolute -z-10 h-32 w-32 rounded-full bg-green-500/10 animate-pulse"></div>
        
        {/* Text */}
        <div className="text-green-500 font-medium text-lg animate-pulse">
          Loading...
        </div>
        
        {/* Small dots */}
        <div className="flex gap-2 mt-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
}
