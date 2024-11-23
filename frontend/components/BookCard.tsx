import { Book } from '@/types/Book'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const BookCard = ({book, base64}: {book:  Book, base64: string}) => {
  return (
    <div className="">
    <Image src={book.image.smallThumbnail} alt={book.title} width={200} height={200} className=' h-[14rem] bg-cover rounded-xl' quality={100}/>
    <Link href={`/book/${book.id}`} className="">
        <p className='pt-3 leading-[1] max-h-[4rem] font-semibold text-[0.85rem] hover:underline underline-offset-2'>{book.title}</p>
        <p className='pt-1 text-[0.8rem]'>{book.authors[0]}</p>
        <p className='mt-1 bg-stone-300 text-[0.7rem] rounded-xl py-1 px-2 w-fit font-semibold'>{book.category}</p>
    </Link>
</div>
  )
}
// placeholder='blur' blurDataURL={base64}

export default BookCard