"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "@/app/component/LoadingSpinner";
// import { useRouter } from "next/navigation";
import Modal from "@/app/modal";

// Define an interface for the user entry structure
interface AdministratorEntry {
  id: string; // Assuming id exists
  userid?: string;
  name?: string | null;
  username?: string | null;
  password?: string | null;
  level?: string | null;
  remark?: string | null; // Keep remark here if it's part of the data structure
  create_at?: string | null; // Add create_at if used
}

export default function UsersPage() {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();

  const [administrators, setAdministrators] = useState<AdministratorEntry[]>([]); // Use AdministratorEntry instead of UserEntry>

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [uinfoid, setUinfoid] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");
  // const [remark, setRemark] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
  
    const datenow = " " + new Date().toLocaleString('th-TH', {
      hour12: false,
      weekday: 'long',
      month: 'long',
      year: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setDate(datenow + " น.");

    fetchDataFirst();

    const intervalId = setInterval(() => {
      // อัปเดตเวลา
      const datenow = " " + new Date().toLocaleString('th-TH', {
        hour12: false,
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setDate(datenow + " น.");
    }, 2000); // ตรวจสอบและอัปเดตทุก 2 วินาที

    return () => {
      clearInterval(intervalId);
    } 

  },[])

  // Wrap fetchDataFirst in useCallback
  const fetchDataFirst = useCallback(async () => {
    setIsLoading(true);

    try {

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/administratorlistall`,{
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            search: search
          }
      })
      .then((response) => {
        setAdministrators(response.data.result);
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
      })
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 2ms

    setIsLoading(false);

  }, [search]);

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenCreate(false);
  };

  const handleClear = () => {

    setName("");
    setUsername("");
    setPassword("");
    setLevel("Employee");
    // setRemark("");

  };

  const handleEdit = async(id: string) => {

    // Find the administrator using the UserEntry type
    const administrator = administrators.find((admin: AdministratorEntry) => admin.userid === id);

    if (administrator) {
      setUinfoid(String(administrator.userid || "")); // Ensure uinfoid is string if needed
      setName(administrator.name || "");
      setUsername(administrator.username || "");
      setPassword(administrator.password || "");
      // Password is often not fetched/displayed directly, clear or handle as needed
      // setPassword(administrator.password || ""); // Uncomment if password should be pre-filled (generally not recommended)
      setLevel(administrator.level || "");
      setIsOpen(true);
    }
    
  }

  const handleEditSave = async() => {

    try{
      setIsLoading(true);

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/administratorupdate`,{
        userid: uinfoid,
        name: name,
        username: username,
        password: password,
        level: level,
        // remark: remark,
        },{
          
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,    
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        })
      .then(() => {

        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });

        fetchDataFirst();
      })

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        showConfirmButton: false,
        timer: 1500,
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }

  const handleCreate = async() => {
    
    try {
      setIsLoading(true);
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/administratorcreate`,{
        name: name,
        username: username,
        password: password,
        level: level,
        // remark: remark,
        },{
          
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,    
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        })
      .then(() => {

        Swal.fire({
          icon: "success",
          title: "เพิ่มข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        });

        fetchDataFirst();
      })
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      })
    }
    setIsLoading(false);
    handleCloseModal();
  }


  const handleDelete = async(id: string) => {
    try{
      Swal.fire({
        title: "คุณต้องการลบข้อมูลนี้หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsLoading(true);
          
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/administratordelete`,{
            userid: id
            },{
              
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,    
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
              })
            .then(() => {
      
              Swal.fire({
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
                showConfirmButton: false,
                timer: 1000,
              });
      
              fetchDataFirst();
      
            })
        }
      })
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // animation load
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    
    <div>
      {/* header */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-4xl pt-4 font-bold">Administrator</p>
        <p className="text-lg pt-2">{date}</p>
      </div>

      {/* table */}
      <div className="w-full min-h-[820px] bg-white p-4 rounded-lg shadow-md mt-2">
        {/* header table */}
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row justify-between items-center p-4">
            <p className="text-2xl font-bold text-[#2B5F60]">
              รายการผู้ดูแลระบบ
            </p>
          </div>

          {/* <div className='p-4'>
              <button className='btn' onClick={handleOpenCreate}> <i className="fa-solid fa-plus"></i> เพิ่มร้านค้า</button>
            </div> */}

          <div className="p-4 flex flex-col-reverse xl:flex-row items-start justify-center  gap-2">


            {/* <button
              className="btn w-[200px] flex flex-row items-center justify-center gap-x-3"
              onClick={()=>{router.push("/backoffice/users")}}
            >
              <i className="fa-solid fa-users"></i> 
              <p>จัดการผู้เข้าใช้งาน</p>
            </button> */}

            <button
              className="btn w-[210px] flex flex-row items-center justify-center gap-x-3"
              onClick={() => {
                handleClear();
                setIsOpenCreate(true);
              }}
            >
              <i className="fa-solid fa-plus"></i> เพิ่ม Administrator
            </button>

            <div className="w-[300px] relative ">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search for administrator..."
                className="w-full p-2 pl-10 rounded-lg border-0  text-[#2B5F60] focus:outline-none focus:ring-2 focus:ring-[#2B5F60]"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { 
                    fetchDataFirst(); // ค้นหาเมื่อกด Enter
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* content table */}
        <div className="min-h-[715px] overflow-auto ">
            <table className="min-w-[1536px] 2xl:w-full p-4 table-auto text-center ">
              <thead className="border-b border-[#2B5F60] bg-white sticky top-0">
              <tr>
                <th className="h-12 w-[100px]">วันที่สร้าง</th>
                <th className="h-12 w-[100px]">ชื่อ นามสกุล</th>
                <th className="h-12 w-[100px]">User</th>
                <th className="h-12 w-[100px]">สิทธิ์ใช้งาน</th>
                {/* <th className="h-12 w-[100px]">รายละเอียด</th> */}
                <th className="h-12 w-[100px]">Action</th>

              </tr>
            </thead>

            <tbody>
              {Array.isArray(administrators) && administrators.length > 0 ? administrators.map((administrator: AdministratorEntry) => (
                  <tr key={administrator.userid} className='border-b border-gray-100 hover:bg-gray-50'>

                    <td className='h-12 w-[100px]'>{administrator.create_at}</td>
                    <td className='h-12 w-[100px]'>{administrator.name}</td>
                    <td className='h-12 w-[100px]'>{administrator.username}</td>
                    {/* <td className='h-12 w-[100px]'>{administrator.password}</td> */}
                    {/* <td className='h-12 w-[100px]'>{administrator.remark}</td> */}
                    <td className='h-12 w-[100px]'>{administrator.level}</td>

                    <td className='h-12 w-[100px]'>
                      <button className="btn-edit mr-2" onClick={() => handleEdit(administrator.userid || "")}>
                          <i className="fa-solid fa-edit"></i>
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(administrator.userid || "")}>
                          <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>

                  </tr>
                )): 
                  <tr>
                    <td colSpan={6} className='h-96 text-center text-lg text-gray-500'>ไม่พบข้อมูลบัญชีผู้ใช้</td>
                  </tr>
                }

                {/* <tr className='border-b border-gray-100 hover:bg-gray-50'>

                  <td className='h-12 w-[100px]'>Smart</td>
                  <td className='h-12 w-[100px]'>Admin</td>
                  <td className='h-12 w-[100px]'>Admin</td>
                  <td className='h-12 w-[100px]'>-</td>

                  <td className='h-12 w-[100px]'>
                    <button className="btn-edit mr-2" 
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    >
                      <i className="fa-solid fa-edit"></i>

                    </button>

                    <button className="btn-delete" 
                    // onClick={() => handleDelete(user.uinfoid)}
                    >
                      <i className="fa-solid fa-trash"></i>

                    </button>
                  </td>

                </tr> */}
            </tbody>
          </table>
        </div>
      </div>

      {/* แก้ไข */}
      <Modal
        title="แก้ไขผู้ดูแลระบบ"
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <div className="w-[300px] md:w-[600px] flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 w-full overflow-y-auto">

            <div>
              <div>ชื่อ นามสกุล <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='กรุณากรอกชื่อ นามสกุล'
              />

            </div>

            <div>
              <div>User <span className="text-red-500">*</span></div>
              <input 
                className="mb-2 p-2" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='กรุณากรอกชื่อบัญชีผู้ใช้'
              />

            </div>

            <div>
              <div>Password <span className="text-red-500">*</span></div>
              <div className="relative mb-2">
                <input
                  className="w-full p-2 border border-[#2B5F60] rounded-md"
                  type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='กรุณากรอกรหัสผ่าน'
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible ? (
                    <i className="fa-solid fa-eye-slash"></i> // Eye-slash icon for hidden
                  ) : (
                    <i className="fa-solid fa-eye"></i> // Eye icon for visible
                  )}
                </button>
              </div>

            </div>


            <div>
              <div>สิทธิ์ใช้งาน <span className="text-red-500">*</span></div>

              <select 
              className="w-full h-[42px] border border-[#2B5F60] rounded-md p-2 mb-2" 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>

              </select>
              
            </div>

            {/* <div>รายละเอียด</div>
            <input 
              className="mb-2 p-2" 
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            /> */}

          </div>

          <div className="mt-2 pt-2 border-t border-[#2B5F60]">
            <button
              className="btn mr-2"
              onClick={handleEditSave}
            >
              <i className="fa-solid fa-save mr-2"></i>
              บันทึก
            </button>
          </div>
        </div>
      </Modal>

      {/* สร้าง */}
      <Modal
        title="เพิ่มผู้ดูแลระบบ"
        isOpen={isOpenCreate}
        onClose={handleCloseModal}
      >
        <div className="w-[300px] md:w-[600px] flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 w-full overflow-y-auto">

            <div>

              <div>ชื่อ นามสกุล <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='กรุณากรอกชื่อ นามสกุล'
              />
            </div>

            <div>
              
              <div>User <span className="text-red-500">*</span></div>
              <input 
                className="mb-2 p-2" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='กรุณากรอกชื่อบัญชีผู้ใช้'
              />
            </div>

            <div>
              <div>Password <span className="text-red-500">*</span></div>
              <div className="relative mb-2">
                <input
                  className="w-full p-2 border border-[#2B5F60] rounded-md"
                  type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='กรุณากรอกรหัสผ่าน'
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible ? (
                    <i className="fa-solid fa-eye-slash"></i> // Eye-slash icon for hidden
                  ) : (
                    <i className="fa-solid fa-eye"></i> // Eye icon for visible
                  )}
                </button>
              </div>
              
            </div>

            <div>
              <div>สิทธิ์ใช้งาน <span className="text-red-500">*</span></div>

              <select 
              className="w-full h-[42px] border border-[#2B5F60] rounded-md p-2 mb-2" 
              defaultValue={level}
              onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>

              </select>

            </div>


            {/* <div>รายละเอียด</div>
            <input 
              className="mb-2 p-2" 
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            /> */}

          </div>

          <div className="mt-2 pt-2 border-t border-[#2B5F60]">
            <button
              className="btn mr-2"
              onClick={handleCreate}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              เพิ่ม
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

