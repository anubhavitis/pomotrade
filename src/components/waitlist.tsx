import { useState } from "react";

const Waitlist = () => {
  const [inputValue, setInputValue] = useState("");
  const [button, setButton] = useState("Join Waitlist");
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setButton("Joined ✔︎");
    setInputDisabled(true);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row justify-center items-center w-full sm:w-4/5 md:w-3/4 lg:w-2/3 mx-auto"
      >
        <input
          type="email"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter your email"
          disabled={inputDisabled}
          className="px-4 py-2 m-2 w-full sm:w-2/3 md:w-3/5 lg:w-1/2 text-sm sm:text-base text-white placeholder-white shadow-lg rounded-lg bg-blue-100 bg-opacity-5 focus:outline-none focus:bg-opacity-10 focus:font-semibold focus:placeholder-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 m-2 w-full sm:w-auto text-sm sm:text-base bg-blue-100 bg-opacity-20 text-white font-bold rounded-xl hover:bg-opacity-40 hover:shadow-lg transition-all duration-200 ease-in-out"
          disabled={inputDisabled}
        >
          {button}
        </button>
      </form>
    </div>
  );
};

export default Waitlist;
