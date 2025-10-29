"use client"; // Error boundaries must be Client Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";
export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </>
  );
}
