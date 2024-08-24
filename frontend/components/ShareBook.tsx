'use client'

import { useEffect, useState } from 'react';
import { LuShare2 } from "react-icons/lu";
import { RWebShare } from "react-web-share";

export default function Share({ book }: any) {
    const [fullUrl, setFullUrl] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            setFullUrl(`${window.location.origin}/book/${book.id}`);
        }
    }, [book.id]);

    return (
        <>
            {fullUrl && (
                <RWebShare data={{ text: "Bookie", url: fullUrl, title: book.title }}>
                    <LuShare2 className='text-xl' />
                </RWebShare>
            )}
        </>
    );
}
