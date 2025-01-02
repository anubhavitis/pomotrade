import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import clsx from "clsx";

const Waitlist = () => {
  const [inputValue, setInputValue] = useState("");
  const [buttonStr, setButton] = useState("Join Waitlist");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setButton("Joining...");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inputValue }),
      });

      const data: { message: string; success: boolean } = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to join waitlist");
      }

      if (data.success) {
        setButton("Joined 🎉");
        setInputDisabled(true);
      } else {
        throw new Error(data.message || "Failed to join waitlist");
      }
    } catch (error) {
      console.error("Error:", error);
      setButton("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row justify-center items-center w-full gap-4"
      >
        {/* <input
          type="email"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter your email"
          disabled={inputDisabled}
          className="px-4 py-2 m-2 w-full sm:w-2/3 md:w-3/5 lg:w-1/2 text-sm sm:text-base text-white placeholder-white shadow-lg rounded-lg bg-blue-100 bg-opacity-5 focus:outline-none focus:bg-opacity-10 focus:font-semibold focus:placeholder-transparent"
        /> */}
        <Input
          type="email"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter your email"
          disabled={inputDisabled}
          className="w-5/6 md:w-96 rounded-md border-0 bg-white/5 backdrop-blur-sm h-10 text-white placeholder:text-white/50"
        />
        <button
          type="submit"
          className={clsx(
            `w-5/6 md:w-36 px-2 rounded-md border-0 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm h-10 text-white placeholder:text-white/50`,
            loading ? "animate-breathing" : "hover:shadow-lg"
          )}
          disabled={inputDisabled || loading}
        >
          {buttonStr}
        </button>
      </form>
    </div>
  );
};

export default Waitlist;
