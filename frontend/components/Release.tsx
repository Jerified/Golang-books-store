import { Book } from '@/types/Book'
import { getPlaiceholder } from 'plaiceholder'
import React from 'react'
import BookCard from './BookCard'
import FixedAuthors from './FixedAuthors'

const Release = ({books}: {books:  Book[]}) => {
  return (
    <section>
        <h1 className="font-semibold text-lg">New Release</h1>
        <div className="flex gap-8 w-full pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:w-[75%]">
                {books.map(async (book) => {
                            const buffer = await fetch(book.image.smallThumbnail).then(async (res) => {
                                return Buffer.from(await res.arrayBuffer())
                            })
                            const { base64 } = await getPlaiceholder(buffer, {size: 8})
                            return (
                                <>
                                    <BookCard book={book} base64={base64} />
                                </>
                            )
                        })}
            </div>
            <div className="hidden lg:block lg:fixed z-10 right-0 bottom-7 lg:w-[15%]">
                <FixedAuthors />
            </div>
            
        </div>
    </section>
  )
}

export default Release