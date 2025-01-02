"use client";
import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Waitlist from "@/components/waitlist";
import Landing from "@/components/landing";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { div } from "framer-motion/client";

export default function Home() {
  useEffect(() => {
    const interBubble = document.querySelector<HTMLDivElement>(".interactive");
    if (!interBubble) return;

    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
      curX += (tgX - curX) / 9;
      curY += (tgY - curY) / 9;
      interBubble.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
      requestAnimationFrame(move);
    };

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    move();

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-transparent w-screen h-screen overflow-y-hidden p-4 text-white">
      <Navbar />
      <div className="absolute inset-0 z-10 w-screen h-screen flex flex-col gap-6 items-center justify-center">
      <Landing />
      <Waitlist />
      </div>
      <BackgroundBeams />
    </div>

    // <div className="bg-black">
    //   <div className="w-screen z-30 h-screen p-4 text-white bg-transparent absolute">
    //     <Navbar />
    //     <Landing />
    //     <Waitlist />
    //   </div>
    //   {/* <div className="w-screen h-screen bg-black absolute top-0 left-0 z-20 opacity-50"></div> */}
    //   {/* <div className="gradient-bg">
    //     <svg xmlns="http://www.w3.org/2000/svg">
    //       <defs>
    //         <filter id="goo">
    //           <feGaussianBlur
    //             in="SourceGraphic"
    //             stdDeviation="10"
    //             result="blur"
    //           />
    //           <feColorMatrix
    //             in="blur"
    //             mode="matrix"
    //             values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
    //             result="goo"
    //           />
    //           <feBlend in="SourceGraphic" in2="goo" />
    //         </filter>
    //       </defs>
    //     </svg>
    //     <div className="gradients-container">
    //       <div className="g1"></div>
    //       <div className="g2"></div>
    //       <div className="g3"></div>
    //       <div className="g4"></div>

    //       <div className="interactive"></div>
    //     </div>
    //   </div> */}
    //   <BackgroundBeams/>
    // </div>
  );
}
