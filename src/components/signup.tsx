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
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { log } from "console";

export default function SignUp({
  onNavigate,
}: {
  onNavigate: (view: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    console.log("Submitted");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;


    try {

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/account/sign-up`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      }
      );
      console.log("RES: ", response);

      const data = await response.json();
      console.log("DATA: ", data);

      if (response.ok) {
        toast({
          title: "Check your email",
          description:
            "We sent you a signup link. Be sure to check your spam folder.",
        });
        router.push("/verify");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            data.message || "Something went wrong. Please try again.",
        });
      }
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
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-white">
            Enter your email to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center items-center w-full gap-4"
          >
            <Input
              id="name"
              name="name"
              type="name"
              placeholder="John Doe"
              required
              disabled={isLoading}
              className="w-full rounded-md border-x border-white/5 focus:border-white bg-transparent backdrop-blur-sm h-10 text-white placeholder:text-white/50"
            />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
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
              {isLoading ? "Loading..." : "Sign up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full text-white"
            onClick={() => onNavigate("signin")}
            disabled={isLoading}
          >
            Already have an account? Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
