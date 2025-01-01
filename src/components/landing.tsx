import React, { useEffect } from "react";

function Landing() {
  return (
    <div>
      <div className="w-full lg:w-2/3 mx-auto my-10 flex flex-col justify-center items-center text-md font-bold">
        <p className="mt-10 m-2"> PERP Trading Simplified</p>
        <p className="text-5xl font-extrabold text-center w-2/3 opacity-90">
          Join The Waitlist For Funded Accounts Today!
        </p>
        <p className="m-2 mb-10">
          {" "}
          learn, trade, and earn using our funded accounts{" "}
        </p>
      </div>
    </div>
  );
}

export default Landing;
