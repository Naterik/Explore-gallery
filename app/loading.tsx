"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3 animate-pulse">
      <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-400 animate-pulse" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-gray-400 animate-pulse" />
        <Skeleton className="h-4 w-[200px] bg-gray-400 animate-pulse" />
      </div>
    </div>
  );
}
