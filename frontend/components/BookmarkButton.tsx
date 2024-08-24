'use client'

import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark, setBookmarks } from "@/lib/features/bookmarkSlice";
import { RootState } from "@/lib/store";
import { Book } from "@/types/Book";
import { getUserBookmarks, addBookToBookmark, removeBookFromBookmark } from "@/lib/bookmarkService";

const Bookmark = ({ book }: { book: Book }) => {
    const dispatch = useDispatch();
    const data = useSelector((state: RootState) => state.user.data);
    const bookmarks = useSelector((state: RootState) => state.bookmark.bookmarks || []);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const userId = data?.id;

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!userId) return;

            try {
                const userBookmarks = await getUserBookmarks(userId);
                dispatch(setBookmarks(userBookmarks || []));
                setIsBookmarked(userBookmarks.some((e: Book) => e.id === book.id) || false);
            } catch (error) {
                console.error("Failed to fetch bookmarks:", error);
            }
        };

        fetchBookmarks();
    }, [dispatch, userId, book.id]);

    const handleToggleBookmark = async () => {
        if (!userId) return;

        try {
            if (isBookmarked) {
                await removeBookFromBookmark(userId, book.id);
                dispatch(removeBookmark(book.id));
            } else {
                await addBookToBookmark(userId, book.id);
                dispatch(addBookmark(book.id));
            }
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error("Failed to toggle bookmark:", error);
        }
    };

    return (
        <button onClick={handleToggleBookmark} disabled={!userId} className="flex items-center">
            {isBookmarked ? <FaBookmark className='text-xl' /> : <FaRegBookmark className='text-xl' />}
        </button>
    );
};

export default Bookmark;
