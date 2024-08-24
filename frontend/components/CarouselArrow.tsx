"use client"

import { Book } from '@/types/Book'
import { useState } from "react"
import { motion } from "framer-motion"
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import BookCarousel from './BookCarousel'

const CarouselArrow = ({ books }: { books: Book[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === books.length - 1 ? 0 : prev + 1))
        console.log(currentIndex)
    }

    return (
        <>
            <motion.div className="flex"
                initial={{ x: 0 }} animate={{ x: -currentIndex * 320 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {books.map((book, index) => (
                    <BookCarousel key={index} book={book} base64={book.base64} />
                ))}
            </motion.div>
                <div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <button onClick={nextSlide} className="bg-transparent border-2 mr-6 p-3 rounded-full shadow transition-all hover:opacity-70">
                        <HiOutlineArrowSmallRight className='text-white font-bold' />
                    </button>
                </div>

        </>
    )
}

export default CarouselArrow
