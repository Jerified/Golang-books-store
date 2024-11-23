"use client"

import { Book } from '@/types/Book'
import Image from 'next/image'
import { motion } from "framer-motion"

const BookCarousel = ({book, base64}: {book:  Book, base64: string}) => {
     
    return (
        <motion.div className="p-4 min-w-[20rem] lg:min-w-[28rem] h-[9rem] lg:h-[11rem] relative" key={book.id}>
            <div className="absolute -top-9 lg:-top-12 right-0 left-10 lg:left-12 flex items-center gap-4 lg:gap-8">
                <Image src={book.image.smallThumbnail} alt={book.title} placeholder='blur' blurDataURL={base64} width={300} height={300} className=' object-fill  rounded-3xl w-[6rem]  lg:w-[8rem] h-[9rem] lg:h-[12rem]'/>
                <div className="text-white font-semibold text-xs lg:text-sm  lg:max-w-[12rem pt-10 lg:pt-14"> 
                    <p className="">{book.title}</p>
                    <div className=" pt-1 lg:pt-3">
                        <p className="text-xs">{book.pageCount} Page</p>
                    </div>
                </div>
            </div>
            {/* <div className="w-full h-full"> */}
                <Image src={base64} alt={book.title} width={300} height={300} className='w-full h-full object-cover rounded-3xl '/>
                
            {/* </div> */}
        </motion.div>
  )
}

export default BookCarousel