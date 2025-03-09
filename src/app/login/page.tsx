"use client";

import SignIn from "@/components/signin";
import SignUp from "@/components/signup";
import type React from "react";

import { useState } from "react";

export default function AuthPage() {
  const [currentView, setCurrentView] = useState("signin"); // Initial view

  const navigate = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div>
      {currentView === "signin" ? (
        <SignIn onNavigate={navigate} />
      ) : (
        <SignUp onNavigate={navigate} />
      )}
    </div>
  );
}
