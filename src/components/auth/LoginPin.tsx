"use client";

import type React from "react";
import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

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
import { setTokenCookies } from "@/lib/tokens";
import { AuthPageView } from "@/hooks/auth-page-hook";

interface LoginPinProps {
  email: string;
  onNavigate: (view: AuthPageView) => void;
}

export default function LoginPin({ email, onNavigate }: LoginPinProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const pin = formData.get("pin") as string;

    // Check if we have the email
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email not found. Please try again.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const url = `/api/auth/signin/verify`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, pin }),
      });

      const data = await response.json();


      const tokens = data.tokens;
      setTokenCookies(tokens);

      if (!response.ok) {
        throw new Error(data.message || "Failed to Login");
      }

      toast({
        title: "Success",
        description: "Successfully logged in!",
      });

      router.push("/home");
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
          <div
            onClick={() => onNavigate(AuthPageView.SignIn)}
            className="absolute top-4 left-4 cursor-pointer"
          >
            <FaArrowLeftLong className="text-white" size={20} />
          </div>
          <CardTitle className="text-2xl text-center text-white">OTP</CardTitle>
          <CardDescription className="text-center text-white">
            Enter the login otp to Verify your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center w-full gap-4"
          >
            <Input
              id="pin"
              name="pin"
              type="pin"
              placeholder="PixN01"
              required
              disabled={isLoading}
              className="w-full rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50"
            />
            <Button
              type="submit"
              className={clsx(
                `w-full px-2 rounded-md border-x border-white/5 bg-transparent hover:bg-green-700 hover:text-black transition-colors backdrop-blur-sm h-10 text-white placeholder:text-white/50`,
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
