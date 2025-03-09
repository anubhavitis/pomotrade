import React from "react";

function Landing() {
  return (
    <div>
      <div className="w-full flex flex-col gap-4 justify-center items-center text-center ">
        <p className="text-xl sm:text-2xl md:text-5xl w-full font-extrabold bg-gradient-to-r from-gray-500 via-gray-100 to-gray-600 text-transparent bg-clip-text">
          Crafting Tomorrow's Traders, Today
        </p>
        <p className="w-5/6 lg:w-full text-sm sm:text-md md:text-base text-stone-500">
          Transform your trading approach with AI-powered insights and structured learning - because smart tools create smarter traders. <br />
          Join our waitlist to get access to get early access to the platform.
        </p>
      </div>
    </div>
  );
}

export default Landing;
