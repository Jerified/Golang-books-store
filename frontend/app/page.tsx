import Navbar from "@/components/Navbar";
import Image from "next/image";

export default async function Home() {
    const response = await fetch("http://localhost:5000/api/user", {
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
    })

    const content = await response.json()
    console.log(content)
  return (
   <main className="">
    <Navbar />
    
   </main>
  );
}
