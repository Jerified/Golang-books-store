"use client"

import React from 'react'
import { getUserBookmarks } from "@/lib/bookmarkService";
import { useSelector } from 'react-redux';
import { RootState } from "@/lib/store";
import { useState, useEffect } from 'react';
import { notFound, redirect } from 'next/navigation';


type userIdProp = {
    params: {
        userId: string
    }
}

const Bookmarks = ({params}: userIdProp) => {
    const [bookmarks, setBookmarks] = useState(null);
    const data = useSelector((state: RootState) => state.user.data);
    const userId = data?.id;

    // const bookmarks = getUserBookmarks(userId)
    if (params.userId !== userId) {
        notFound()
    }

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!userId) return;

            try {
                const userBookmarks = await getUserBookmarks(userId);
                setBookmarks(userBookmarks)
                console.log(userBookmarks)
            } catch (error) {
                console.error("Failed to fetch bookmarks:", error);
            }
        };

        fetchBookmarks();
    }, [userId]);
    console.log(userId)
  return (
    <div> 
        {params.userId}
    </div>
  )
}

export default Bookmarks