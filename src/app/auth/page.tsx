"use client";

import SignIn from "@/components/auth/signin";
import SignUp from "@/components/auth/signup";
import LoginPin from "@/components/auth/LoginPin";
import Verify from "@/components/auth/verify";
import type React from "react";

import { useAuthPage, AuthPageView } from "@/hooks/auth-page-hook";
import { useState } from "react";

export default function AuthPage() {
  const { currentView, navigate } = useAuthPage(AuthPageView.SignIn);
  const [email, setEmail] = useState<string>("");

  function updateEmail(email: string) {
    setEmail(email);
  }

  switch (currentView) {
    case AuthPageView.SignIn:
      return <SignIn onNavigate={navigate} email={email} setEmail={updateEmail} />;
    case AuthPageView.SignUp:
      return <SignUp onNavigate={navigate} email={email} setEmail={updateEmail} />;
    case AuthPageView.LoginPin:
      return <LoginPin onNavigate={navigate} email={email} />;
    case AuthPageView.Verify:
      return <Verify onNavigate={navigate} email={email} />;
    default:
      return <SignIn onNavigate={navigate} email={email} setEmail={(e) => setEmail(e)} />;
  }

}
