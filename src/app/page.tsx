"use client";
import { useEffect, useState } from "react";
import { LoopsClient } from "loops";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loops = new LoopsClient("YOUR_LOOPS_API_KEY");
  }, []);

  return (
    <div>
      <p className="text-2xl font-bold text-red-500">hello world</p>
    </div>
  );
}
