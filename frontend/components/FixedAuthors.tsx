'use client'
import { RootState } from "@/lib/store";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux"


const FixedAuthors = () => {
    const data = useSelector((state: RootState) => state.user.data)
    return (
        <div className="w-full">
            <h1 className="font-semibold text-lg">Famous Authors</h1>
            <main className="bg-[#e6d280]/50 rounded-tl-2xl rounded-bl-2xl py-10 px-12 bg-opacity-80 bg-clip-padding backdrop-blur-xl">
                {
                    data.image === null ? <p className="uppercase text-4xl bg-yellow-700 w-fit px-7 py-4 rounded-3xl">{data.username[0]}</p> : <Image src={data.image} width={60} height={60} alt="" />
                }
                <p className='text-xs pt-5 pb-3 font-medium flex flex-col'>Welcome <span>Back</span></p>
                <p className='text-lg font-semibold tracking-wider capitalize'>{data.username}</p>
            </main>
        </div>
    )
}

export default FixedAuthors