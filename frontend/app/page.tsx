import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { Book } from "@/types/Book";
import Release from "@/components/Release";

export default async function  Home() {
    

    const response = await fetch("http://localhost:5000/api/books", {
        headers: {"Content-Type": "application/json"},
    })

    const responses = await fetch("http://localhost:5000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    })
    const data1 = await responses.json()
    console.log(data1)
    
    const data = await response.json()

    // console.log(data)
  return (
   <main className="">
        <HeroSection books={data} />
        <Release  books={data} />
   </main>
  );
}
