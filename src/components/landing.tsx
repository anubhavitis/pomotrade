import React, { useEffect } from "react";

function Landing() {
  return (
    <div>
      <div className="w-full md:w-4/5 lg:w-2/3 mx-auto my-10 flex flex-col justify-center items-center text-center">
        <p className="mt-10 m-2 text-xs sm:text-sm md:text-base lg:text-lg">
          PERP Trading Simplified
        </p>
        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-4/5 lg:w-2/3 font-extrabold opacity-90">
          Join The Waitlist For Funded Accounts Today!
        </p>
        <p className="mb-10 m-2 mx-auto text-xs sm:text-sm md:text-base lg:text-lg w-full sm:w-4/5 md:w-3/4 lg:w-2/3">
          learn, trade, and earn using our funded accounts
        </p>
      </div>
    </div>
  );
}

export default Landing;
