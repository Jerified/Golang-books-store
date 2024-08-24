import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import { Book } from "@/types/Book";
import Release from "@/components/Release";

export default async function  Home() {

    const response = await fetch("http://localhost:5000/api/books", {
        headers: {"Content-Type": "application/json"},
    })

    const data = await response.json()
  return (
   <main className="">
        <HeroSection books={data} />
        <Release  books={data} />
   </main>
  );
}
