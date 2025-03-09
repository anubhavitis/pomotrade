import React from "react";

function Landing() {
  return (
    <div>
      <div className="w-full flex flex-col gap-4 justify-center items-center text-center ">
        <p className="text-2xl sm:text-3xl md:text-6xl w-full font-extrabold bg-gradient-to-r from-gray-500 via-gray-100 to-gray-600 text-transparent bg-clip-text">
          We Fund, You Trade
        </p>
        <p className="w-5/6 lg:w-full text-xs sm:text-sm md:text-base text-stone-500">
          PomoTrade provides you a platform to learn, prove your skills, and get a
          funded account with over $20k to trade with. <br />
          Join our waitlist to get access to get early access to the platform.
        </p>
      </div>
    </div>
  );
}

export default Landing;
