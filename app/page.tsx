"use client"

import { useEffect } from "react";
import SignIn from "./signin/page";
import { useRouter } from "next/navigation";
import axios from "axios";
// import { config } from "@/app/lib/config";
// import Link from "next/link";


export default function Home() {

  const router = useRouter();//เรียกใช้งาน router

  useEffect(() => {

    const token = localStorage.getItem('token');

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/checklogin`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
        'authorization': `Bearer ${token}`
      }
    }).then((res) => {
      console.log(res.data);
      if(res.status === 200){
        router.push('/backoffice/dashboard');
      }

    }).catch((err) => {
      console.log(err);
    });

    
  }, [router])
 
  return (
 
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-[#B1D2BE] to-[#439362]" >

        <SignIn/>   
      </div>


    </>
    

  );
}



