"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import clsx from "clsx";

export default function Verify() {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data: { message: string; success: boolean } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join waitlist");
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "You have successfully signed in.",
        });
      } else {
        throw new Error(data.message || "Failed to join waitlist");
      }
    } catch (error) {
      console.log("ERROR: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md backdrop-blur-sm border-white/5 bg-white/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-white">
            Verify
          </CardTitle>
          <CardDescription className="text-center text-white">
            Enter the pin to Verify your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center w-full gap-4"
          >
            <Input
              id="otp"
              name="otp"
              type="otp"
              placeholder="PixN01"
              required
              disabled={isLoading}
              className="w-full rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50"
            />
            <Button
              type="submit"
              className={clsx(
                `w-full px-2 rounded-md border-x border-white/5 bg-transparent hover:bg-white hover:text-black transition-colors backdrop-blur-sm h-10 text-white placeholder:text-white/50`,
                isLoading ? "animate-breathing" : "hover:shadow-lg"
              )}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Verify"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4"></CardFooter>
      </Card>
    </div>
  );
}
