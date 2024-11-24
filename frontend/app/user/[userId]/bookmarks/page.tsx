// "use client";

// import React, { useState, useEffect } from "react";
// import { getUserBookmarks } from "@/lib/bookmarkService";
// import { useSelector } from "react-redux";
// import { RootState } from "@/lib/store";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import { Book } from "@/types/Book";
import { getUser } from "@/lib/getUser";
import { getUserBookmarks } from "@/lib/bookmarkService";

type UserIdProp = {
  params: {
    userId: string;
  };
};

const Bookmarks = async ({ params }: UserIdProp) => {
//   const [bookmarks, setBookmarks] = useState([]);
//   const data = useSelector((state: RootState) => state.user.data);
//   const userId = data?.id;

//   useEffect(() => { 
//     const validateUser = () => {
//       if (!userId || params.userId !== userId) {
//         notFound();
//       }
//     };

//     validateUser();
//   }, [userId, params.userId]);

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       if (!userId) return;

//       try {
//         const userBookmarks = await getUserBookmarks(userId);
//         setBookmarks(userBookmarks);
//         console.log(userBookmarks);
//       } catch (error) {
//         console.error("Failed to fetch bookmarks:", error);
//       }
//     };

//     fetchBookmarks();
//   }, [userId]);

//   if (!bookmarks) {
//     return <div>Loading...</div>;
//   }
        const user = await getUser()
        const userId = user?.id;
        console.log(user)
        if (!userId || params.userId !== userId) {
            notFound();
        }
        const bookmarks = await getUserBookmarks(userId)

  return (
    <div>
      <h1 className="text-2xl font-semibold pb-8">Bookmarks</h1>
      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 ">
          {bookmarks.map((bookmark: Book) => (
            <React.Fragment key={bookmark.id}>
                <BookCard book={bookmark} base64={''} />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <p>No bookmarks found.</p>
      )}
    </div>
  );
};

export default Bookmarks;
