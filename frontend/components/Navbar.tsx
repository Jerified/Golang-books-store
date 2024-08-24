"use client"

import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatedHamburgerButton } from "./HamburgerButton";
import Link from "next/link";

const tabs = ["Home", "Search", "About", "FAQ"];

const Navbar = () => {
    const [selected, setSelected] = useState(tabs[0]);

    return (
        <header className='py-4 lg:py-8 flex justify-between items-center'>
            <div className="flex items-e">
                <Link href={'/'} className="text-3xl font-bold">Bookle </Link>
                <span className="text-[#e6d280] font-extrabold rounded-full text-5xl">.</span>
            </div>
            <div className="flex gap-4">
                <div className="hidden lg:flex gap-16 bg-white px-6 py-2 rounded-full overflow-hidden max-w-md mx-auto font-[sans-serif]">
                    <input type="email" placeholder="Search your books"
                        className="w-full outline-none " />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192.904 192.904" width="16px" className="fill-gray-600 w-5">
                        <path
                            d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z">
                        </path>
                    </svg>
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
            className={`${selected
                    ? "text-white"
                    : "text-black hover:text-[#e6d280]  hover:bg-slate-700"
                } text-sm transition-colors px-2.5 py-0.5 rounded-md relative`}
        >
            <span className="relative z-10">{text}</span>
            {selected && (
                <motion.span
                    layoutId="pill-tab"
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute inset-0 z-0 bg-[#e6d280]  rounded-md"
                ></motion.span>
            )}
        </button>
    );
};
