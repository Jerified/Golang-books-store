import { Book } from '@/types/Book'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import BookCarousel from "@/components/BookCarousel"
import CarouselArrow from "@/components/CarouselArrow"

const HeroSection = async ({ books }: { books: Book[] }) => {
    const booksWithPlaceholders = await Promise.all(books.map(async (book) => {
        const buffer = await fetch(book.image.smallThumbnail).then(async (res) => {
            return Buffer.from(await res.arrayBuffer())
        })
        const { base64 } = await getPlaiceholder(buffer, { size: 8 })
        return { ...book, base64 }
    }));

    return (
        <div className='max-w-full overflow-hidden'>
            <h3 className="font-semibold text-lg">Books you read last</h3>
            <div className="py-[3.5rem]">
                <div className="w-full relative ">
                    
                    <CarouselArrow books={booksWithPlaceholders} />
                </div>
            </div>
        </div>
    )
}

export default HeroSection
