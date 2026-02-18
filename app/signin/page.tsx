'use client'

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import axios from "axios";
// import { tr } from 'date-fns/locale';
import Image from 'next/image'; // Import next/image

export default function SignIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const handleSignIn = async () => {

      // ใช้ .trim() เพื่อตัดช่องว่างหน้า-หลัง ออกก่อนตรวจสอบ
      if (!username.trim() && !password.trim()) {
        Swal.fire({
            title: 'ข้อมูลไม่ครบถ้วน',
            text: 'กรุณากรอกข้อมูลบัญชีผู้ใช้และรหัสผ่าน',
            icon: 'warning',
            // timer: 2000 // อาจจะไม่ต้องใส่ timer ก็ได้ ให้ผู้ใช้กดปิดเอง
        });
        return; // ออกจากฟังก์ชัน ไม่ต้องทำต่อ

      }else if (!username.trim()) {
        Swal.fire({
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณากรอกข้อมูลบัญชีผู้ใช้",
          icon: "warning",
          // timer: 2000 // อาจจะไม่ต้องใส่ timer ก็ได้ ให้ผู้ใช้กดปิดเอง
        });
        return; // ออกจากฟังก์ชัน ไม่ต้องทำต่อ

      }else if (!password.trim()) {
        Swal.fire({
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณากรอกข้อมูลรหัสผ่าน",
          icon: "warning",
          // timer: 2000 // อาจจะไม่ต้องใส่ timer ก็ได้ ให้ผู้ใช้กดปิดเอง
        });
        return; // ออกจากฟังก์ชัน ไม่ต้องทำต่อ
      };

      // if(true){
      //   router.push("/backoffice/dashboard");
      //   // return; // ออกจากฟังก์ชัน ไม่ต้องทำต่อ
      // };

      setIsLoading(true);

      try {

        const paylaod = {
          username: username,
          password: password,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/login`,
          paylaod,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY, // ตัวอย่าง header Authorization
            },
          },
          
        );

        if (response.data.token !== null) {
          localStorage.setItem("token", response.data.token);

          setIsLoading(true);
          router.push("/backoffice/dashboard");
          return; // ออกจากฟังก์ชัน ไม่ต้องทำต่อ
        } else {
          Swal.fire({
            title: "กรุณาตรวจสอบบัญชีผู้ใช้",
            text: "ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง",
            icon: "warning",
            timer: 2000,
          });
        }

        // if (response.data.token !== null) {

        //     localStorage.setItem('token', response.data.token)
        //     // console.log("token >>>",response.data.token)

        //     if (response.data.level === 'admin') {
        //         router.push('/backoffice/dashboard')
        //     } else {
        //         router.push('/backoffice/sell')
        //     }
        // } else {

        //     Swal.fire({
        //         title: 'ตรวจสอบ user',
        //         text: 'ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง',
        //         icon: 'warning',
        //         timer: 2000
        //     })

        // }
      } catch (error: unknown) {
        if (error instanceof Error) {
          // alert('ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง\n'+error);
          Swal.fire({
            title: "กรุณาตรวจสอบบัญชีผู้ใช้",
            text: "ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง",
            icon: "warning",
          });
        } else {
          Swal.fire({
            title: "Error",
            text:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            icon: "error",
          });
        }
      }

      setIsLoading(false);
    }

    return (
      <div className="signin-container relative">
        {isLoading && (
          <div className="absolute z-[2]">
            <div className="w-[90vw] h-screen m-auto flex justify-center items-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-8 border-b-8 border-white"></div>
            </div>
          </div>
        )}

        <div className="signin-box relative">

          <div className='w-full pb-48 flex flex-col justify-center items-center gap-10'>
            <p className="w-full text-center text-white font-bold text-4xl ">Kiosk Backoffice</p>
            {/* <img className="w-[120px] h-[120px] oject-contain rounded-2xl" 
              src={true?"/img/user-profile.png":"https://placehold.co/120x120"} 
              alt="logo" 
            /> */}
            <Image
              className="oject-contain rounded-2xl" // next/image handles sizing via props, className is for styling
              src={"/img/user-profile.png"} // Assuming this path is correct in your public folder
              alt="logo"
              width={120} // Required width prop
              height={120} // Required height prop
            />

          </div>
          <div className="w-full flex flex-col justify-center items-center my-2 pb-2">
            <h1 className="text-2xl font-bold text-white">เข้าสู่ระบบ</h1>
            <h4 className="text-white">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</h4>
          </div>

          <div className="text-white">
            บัญชีผู้ใช้ <span className="text-red-600">*</span>
          </div>

          <input
            placeholder="ระบุชื่อบัญชีผู้ใช้"
            className="mt-1 w-full p-2 border border-[#2B5F60] rounded-md"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSignIn();
              }
            }}
          />

          <div className="mt-4 text-white">
            รหัสผ่าน <span className="text-red-600">*</span>
          </div>

          <div className="relative w-full">
            <input
              placeholder="ระบุรหัสผ่าน"
              className="mt-1 w-full p-2 border border-[#2B5F60] rounded-md"
              type={isPasswordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignIn(); // ค้นหาเมื่อกด Enter
                }
              }}
            />

            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
              className="absolute right-4 top-[25px]  transform -translate-y-1/2 text-gray-500"
            >
              {isPasswordVisible ? (
                <i className="fa-solid fa-eye-slash"></i> // Eye-slash icon for hidden
              ) : (
                <i className="fa-solid fa-eye"></i> // Eye icon for visible
              )}
            </button>
          </div>

          <div className=" w-full pt-6 flex flex-col justify-center items-center">
            <button className="btn mt-4 w-full border" onClick={handleSignIn}>
              เข้าสู่ระบบ
              <i className="fa fa-sign-in-alt ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    );
}
