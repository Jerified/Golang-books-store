"use client"

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatedHamburgerButton } from "./HamburgerButton";

const tabs = ["Home", "Search", "About", "FAQ"];

const Navbar = () => {
  const [selected, setSelected] = useState(tabs[0]);

  return (
    <header className='py-4 flex justify-between items-center'>
        <div className="flex items-e">
            <h1 className="text-3xl font-bold">Bookle </h1>
            <span className="text-[#e6d280] font-extrabold rounded-full text-5xl">.</span>
        </div>
        <div className="px-4 hidden lg:flex items-center flex-wrap gap-2">
      {tabs.map((tab) => (
        <Chip
          text={tab}
          selected={selected === tab}
          setSelected={setSelected}
          key={tab}
        />
      ))}
        </div>
        <div className="lg:hidden">
            <AnimatedHamburgerButton />
        </div>
    </header>
  )
}

export default Navbar


export const Chip = ({
  text,
  selected,
  setSelected,
}: {
  text: string;
  selected: boolean;
  setSelected: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected
          ? "text-white"
          : "text-slate-300 hover:text-slate-200 hover:bg-slate-700"
      } text-sm transition-colors px-2.5 py-0.5 rounded-md relative`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ type: "spring", duration: 0.5 }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-md"
        ></motion.span>
      )}
    </button>
  );
};
