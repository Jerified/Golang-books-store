'use client'

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaBookmark } from "react-icons/fa6";
import { IoBook, IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import UserBadge from './UserBadge'
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store";
import Link from "next/link";
import { BiLogOutCircle } from "react-icons/bi";

const SideBar = () => {
    const logout = async () => {
        await fetch("http://localhost:5000/api/logout", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include"
        })
    } 
    const data = useSelector((state: RootState) => state.user.data)
    console.log(data)
    const [selected, setSelected] = useState(0);

    return (
        <div className='fixed '>
            <div className="">
                <UserBadge />
            </div>

            <nav className=" p-4 flex flex-col h-full justify-center w-fit gap-4 mt-8">
                <div className="flex items-center">
                    <NavItem selected={selected === 0} id={0} setSelected={setSelected}>
                            <IoBook />
                    </NavItem>
                    <p className="text-black text-xs font-semibold">Category</p>
                </div>
                <div className="flex items-center">
                    <NavItem selected={selected === 1} id={1} setSelected={setSelected}>
                        <FaBookmark />
                    </NavItem>
                    <p className="text-black text-xs font-semibold">Bookmark</p>
                </div>
                <div className="flex items-center">
                    <NavItem selected={selected === 2} id={2} setSelected={setSelected}>
                        <CgProfile />
                    </NavItem>
                    <p className="text-black text-xs font-semibold">Profile</p>
                </div>
                <div className="flex items-center">
                    {
                        data.message === "Unauthenticated" ?
                         <>
                            <NavItem selected={selected === 3} id={3} setSelected={setSelected}>
                                <IoLogOut className="text-2xl" />
                            </NavItem>
                            <Link href={"/login"} className="text-black text-xs font-semibold">Login</Link>
                         </>
                         :
                         <>
                            <NavItem selected={selected === 3} id={3} setSelected={setSelected}>
                                <IoLogOut className="text-2xl" />
                            </NavItem>
                            <p onClick={logout} className="text-black text-xs font-semibold cursor-pointer">Logout</p>
                        </>
                    }
                </div>
                
            </nav>
        </div>
    )
}

export default SideBar

type TProp = {
    children: React.ReactNode,
    selected: boolean,
    id: number,
    setSelected: any
}


const NavItem = ({ children, selected, id, setSelected }: TProp) => {
    return (
        <motion.button
            className="p-3 text-xl rounded-md transition-colors relative mr-2"
            onClick={() => setSelected(id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="block relative z-10">{children}</span>
            <AnimatePresence>
                {selected && (
                    <motion.span
                        className="absolute inset-0 rounded-md bg-indigo-600 z-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    ></motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
};