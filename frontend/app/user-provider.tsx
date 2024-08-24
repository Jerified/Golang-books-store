"use client"

import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { setData } from "@/lib/features/userSlice";


export const UserProvider = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        (
            async () => {
                const response = await fetch("http://localhost:5000/api/user", {
                    headers: {"Content-Type": "application/json"},
                    credentials: 'include',
                })
            
                const content = await response.json()
                console.log(content)

                dispatch(setData(content))
            }
        )()
    
    },[])      
    
  return null
}

