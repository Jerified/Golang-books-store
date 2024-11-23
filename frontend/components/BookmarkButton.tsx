"use client"

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addBookmark, removeBookmark } from "@/lib/features/bookmarkSlice";
import { Book } from "@/types/Book";
import { addBookToBookmark, getUserBookmarks, removeBookFromBookmark } from "@/lib/bookmarkService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const Bookmark = ({ book, user: data }: { book: Book; user: any }) => {
    const [user, setUser] = useState<any>(null);
    const [bookmarks, setBookmarks] = useState<Book[]>([]);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const dispatch = useDispatch();

    // Fetch user and bookmarks when the component mounts
    useEffect(() => {
        const fetchUserAndBookmarks = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/user`, {
                    withCredentials: true,
                });
                console.log(res.data)
                setUser(res.data);

                // Fetch user bookmarks
                const fetchedBookmarks = await getUserBookmarks(res.data.id);
                console.log(fetchedBookmarks)
                setBookmarks(fetchedBookmarks);

                // Check if the current book is bookmarked
                const isCurrentlyBookmarked = fetchedBookmarks.some((e: Book) => e.id === book.id);
                setIsBookmarked(isCurrentlyBookmarked);
            } catch (error) {
                console.error("Error fetching user or bookmarks:", error);
                setUser(null);
                setBookmarks([]);
                setIsBookmarked(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndBookmarks();
    }, [book.id]);

    const handleToggleBookmark = async () => {
        console.log(user)
        if (!user?.id) {
            toast.error("You need to be logged in to bookmark!");
            return;
        }

        // Optimistic UI update
        setIsBookmarked(!isBookmarked);
        try {
            if (isBookmarked) {
                // Remove from Redux and backend
                dispatch(removeBookmark(book.id));
                const removeBook = await removeBookFromBookmark(user.id, book.id);
                console.log(removeBook)
                
                // Update local bookmarks state
                setBookmarks((prev) => prev.filter((b) => b.id !== book.id));
                toast.success(removeBook.message);
            } else {
                // Add to Redux and backend
                dispatch(addBookmark(book.id));
                const addBook = await addBookToBookmark(user.id, book.id);
                console.log(addBook)

                // Update local bookmarks state
                setBookmarks((prev) => [...prev, book]);
                toast.success(addBook.message);
            }
        } catch (error) {
            // Revert the optimistic update if an error occurs
            console.log(error)
            setIsBookmarked(isBookmarked);
            toast.error("Failed to toggle bookmark. Please try again.");

        }
    };

    if (loading) {
        return <p className="animate-spin"></p>;
    }

    return (
        <motion.button
            onClick={handleToggleBookmark}
            disabled={!user?.id}
            className="flex items-center"
            whileTap={{ scale: 0.9 }}
        >
            {isBookmarked ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaBookmark className="text-xl cursor-pointer text-black" />
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaRegBookmark className="text-xl cursor-pointer" />
                </motion.div>
            )}
        </motion.button>
    );
};

export default Bookmark;
