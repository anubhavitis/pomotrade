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
import { AuthPageView } from "@/hooks/auth-page-hook";

interface SignInProps {
  email: string;
  setEmail: (email: string) => void;
  onNavigate: (view: AuthPageView) => void;
}

export default function SignIn({
  email,
  setEmail,
  onNavigate,
}: SignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data: { message: string; success: boolean } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to Login");
      }


      if (data.message) {
        // if status == 401 then show error message
        // else show internal everver - error try again later

        // if success redirect

        toast({
          title: "Success",
          description: "Login Pin sent to email",
        });
        onNavigate(AuthPageView.LoginPin);
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
            Welcome back
          </CardTitle>
          <CardDescription className="text-center text-white">
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center w-full gap-4"
          >
            <Input
              id="email"
              name="email"
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
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
              {isLoading ? "Loading..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full text-white"
            onClick={() => onNavigate(AuthPageView.SignUp)}
            disabled={isLoading}
          >
            Need an account? Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
