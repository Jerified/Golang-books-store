import { Book } from '@/types/Book'
import Image from 'next/image'
import { getPlaiceholder } from 'plaiceholder'
import { Playfair_Display } from "next/font/google";
import { MdArrowOutward } from "react-icons/md"
import { FaRegBookmark } from "react-icons/fa"
import { LuShare2 } from "react-icons/lu";
import Share from '@/components/ShareBook';
import Bookmark from '@/components/BookmarkButton';
// import * as locale from 'locale-codes';

const poppins = Playfair_Display({ 
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
    weight: ["400", "500", "700", "900"]
 });

type IdProp = {
    params: {
        id: string
    }
}
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };



async function getBook(id: string): Promise<Book> {
    const res = await fetch(`http://localhost:5000/api/book/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch book');
  }

  return res.json();
}

const BookDetail = async ({params}: IdProp) => {
    const book = await getBook(params.id);
    const buffer = await fetch(book.image.smallThumbnail).then(async (res) => {
        return Buffer.from(await res.arrayBuffer())
    })
    const { base64 } = await getPlaiceholder(buffer)
    // console.log(book)
  return (
    <div className={`lg:flex gap-36 ${poppins.className}`}>
        {/* <p className="">{params.id}</p> */}
        <div className="w-[16rem] h-[20rem] flex mx-auto lg:mx-0">
            <Image src={book.image.thumbnail} alt={book.title} placeholder='blur' blurDataURL={base64} width={500} height={400} className='w-[30% h-[20rem bg-cover' quality={100}/>
        </div>
    <div className="">
        <p className='pt-3 leading-[1] max-h-[4rem] font-semibold text-2xl lg:text-3xl'>{book.title}</p>
        <p className='py-4 font-bold'><span className="font-medium">by</span> {book.authors[0]}</p>
        <p className='pt-3 max-w-lg'>{book.description}</p>
        <div className="border border-stone-300 w-full mt-16 mb-8"/>
        <div className="flex justify-center gap-16 lg:justify-between items-center">
            <button className="group bg-black rounded-full px-4 py-2 text-white flex gap-2 items-center hover:bg-black/80 hover:scale-1 ">Start reading <MdArrowOutward className='transition-all group-hover:translate-x-1 group-hover:-translate-y-1' /> </button>
            <div className="flex gap-3">
                <div className="bg-stone-200 p-3 rounded-full cursor-pointer">
                    <Bookmark book={book} />
                </div>
                <div className="bg-stone-200 p-3 rounded-full cursor-pointer">
                    <Share book={book} />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="pt-5">
                <p className="pb-4 font-semibold">Editors</p>
                <p className="">{book.authors.map((author) => author).join(", ")}, {book.publisher}</p>
            </div>
            <div className="pt-5">
                <p className="pb-4 font-semibold">Release Date</p>
                <p className="">{formatDate(book.publishedDate)}</p>
            </div>
            <div className="pt-5">
                <p className="pb-4 font-semibold">Language</p>
                {/* <p className="">{getLocalizedLanguageName(book.language)}</p> */}
            </div>
        </div>
        {/* getLocalizedLanguageName('en') */}
    </div>
</div>
  )
}

export default BookDetail