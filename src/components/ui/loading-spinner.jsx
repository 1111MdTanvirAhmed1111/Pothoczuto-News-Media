"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "default", variant = "default" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-24 w-24",
  };

  const variantClasses = {
    default: "border-green-500",
    primary: "border-primary",
    secondary: "border-secondary",
    muted: "border-muted-foreground/40",
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-t-4 border-b-4 animate-spin",
          sizeClasses[size],
          variantClasses[variant]
        )}
      ></div>
      <div
        className={cn(
          "absolute inset-0 rounded-full border-r-4 border-l-4 animate-ping opacity-70",
          sizeClasses[size],
          variantClasses[variant]
        )}
      ></div>
      <div
        className={cn(
          "absolute inset-0 rounded-full border-4 border-opacity-20",
          sizeClasses[size],
          variantClasses[variant] + "/20"
        )}
      ></div>
    </div>
  );
}

export function LoadingDots({ className, size = "default", variant = "default" }) {
  const sizeClasses = {
    sm: "h-1 w-1",
    default: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const variantClasses = {
    default: "bg-green-500",
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted-foreground/40",
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizeClasses[size],
          variantClasses[variant]
        )}
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizeClasses[size],
          variantClasses[variant]
        )}
        style={{ animationDelay: "150ms" }}
      ></div>
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizeClasses[size],
          variantClasses[variant]
        )}
        style={{ animationDelay: "300ms" }}
      ></div>
    </div>
  );
}

export function LoadingButton({ children, loading = false, disabled, className, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 px-4 py-2",
        {
          "cursor-not-allowed": loading,
        },
        className
      )}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="sm"
          variant="primary"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
      <span className={cn({ "opacity-0": loading })}>{children}</span>
    </button>
  );
}
