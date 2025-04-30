"use client";

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-green-500/10", className)}
      {...props}
    />
  );
}

export { Skeleton };
