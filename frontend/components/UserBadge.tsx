'use client'

import { RootState } from "@/lib/store";
import Image from "next/image";
import { useSelector } from "react-redux"


export default  function UserBadge() {
    const data = useSelector((state: RootState) => state.user.data)
    console.log(data)
    
  return (
    <>{
        data.message === "Unauthenticated" ? <></> :
        <main className="bg-[#e6d280]/50 -ml-4 mt-4 rounded-tr-2xl rounded-br-2xl w-fit py-10 px-12 bg-opacity-80 bg-clip-padding backdrop-blur-xl">
            {
                data.image === null ? <p className="uppercase text-4xl bg-yellow-700 w-fit px-7 py-4 rounded-3xl">{data.username[0]}</p> : <Image src={data.image} width={60} height={60} alt="" />
            }
                <p className='text-xs pt-5 pb-3 font-medium flex flex-col'>Welcome <span>Back</span></p>
                <p className='text-lg font-semibold tracking-wider capitalize'>{data.username}</p>
        </main>
    }
    </>
  );
}
