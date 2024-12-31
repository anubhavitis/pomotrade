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
    <div className="flex flex-col  justify-center items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center flex-col w-full sm:flex-row "
      >
        <input
          type="email"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter your email"
          disabled={inputDisabled}
          className="px-4 py-2 m-2 text-white placeholder-white shadow-lg rounded-lg bg-blue-100 bg-opacity-5 focus:outline-none focus:ring-2 "
        />
        <button
          type="submit"
          className="px-4 py-2 m-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 hover:shadow-lg transition-all duration-300 ease-in-out"
          disabled={inputDisabled}
        >
          {button}
        </button>
      </form>
    </div>
  );
};

export default Waitlist;
