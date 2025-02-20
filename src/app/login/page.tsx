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

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      // Here you would integrate with your auth provider
      // For example: await supabase.auth.signInWithOtp({ email })
      toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam folder.",
      });
    } catch (error) {
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
            {isLogin ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center text-white">
            {isLogin
              ? "Enter your email to sign in to your account"
              : "Enter your email to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row justify-center items-center w-full gap-4"
          >
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              disabled={isLoading}
              className="w-5/6 md:w-96 rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50 "
            />
            <Button
              type="submit"
              className={clsx(
                `w-5/6 md:w-36 px-2 rounded-md border-x border-white/5 bg-transparent hover:bg-white hover:text-black transition-colors backdrop-blur-sm h-10 text-white placeholder:text-white/50`,
                isLoading ? "animate-breathing" : "hover:shadow-lg"
              )}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full text-white"
            onClick={() => setIsLogin(!isLogin)}
            disabled={isLoading}
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
