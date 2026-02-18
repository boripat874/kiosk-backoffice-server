"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "@/app/component/LoadingSpinner";
import { useRouter } from "next/navigation";
import Modal from "@/app/modal";
// import { format } from 'date-fns';
import SeclectTime from '@/app/component/SeclectTime';

// Define an interface for the group user entry structure
interface GroupUserEntry {
  ugroupid: string | number; // Assuming it's the primary key
  create_at: string | null;
  groupname: string | null;
  duration: string | null;
  remark?: string | null; // Optional if it might exist in data but isn't used in UI
}


export default function GroupUserPage() {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Hook called inside component body

  const [groupusers, setGroupusers] = useState<GroupUserEntry[]>([]);

  // const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [ugroupid, setGroupId] = useState("");
  const [groupname, setGroupname] = useState("");
  // const [remark, setRemark] = useState("");
  const [duration, setDuration] = useState("05:00");

  const [search, setSearch] = useState("");

  // const locales = ['en', 'en-gb', 'de'];

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

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groupuserslistall`,{
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

        setGroupusers(response.data.result);

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

  const handleOpenModalCreate = () => {

    // setDuration();
     
    handleClear();
    setIsOpenCreate(true);

  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenCreate(false);
  };

  const handleClear = () => {

    // setGroupId("");
    setGroupname("");
    // setRemark("");
    setDuration("05:00");

  };

  // handle edit
  const handleEdit = async(id: string) => {

    try {
      // Find the user using the interface
      const user = groupusers.find((groupuser: GroupUserEntry) => groupuser.ugroupid === id);

      if (user) {
        setGroupId(String(user.ugroupid)); // Ensure it's a string if state expects string
        setGroupname(user.groupname || "");
        setDuration(user.duration || "");
        setIsOpen(true); // Open modal only if user is found
      } else {
        console.error("Group user not found for ID:", id);
        Swal.fire({ icon: "error", title: "Error", text: "Group user not found." });
      }
      
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }

    // setIsOpen(true);

  }

  const handleCreate = async() => {

    
    try {
      setIsLoading(true);
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groupuserscreate`,{
        groupname: groupname,
        // remark: remark,
        duration: duration,
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
      });
    }
    setIsLoading(false);
    handleCloseModal();
  }

  const handleEditSave = async() => {

    setIsLoading(true);

    try {

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/groupusersupdate`,{
        ugroupid: ugroupid,
        groupname: groupname,
        // remark: remark,
        duration: duration,
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
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
    setIsLoading(false);
    handleCloseModal();
  }

  // handle delete
  const handleDelete = async(id: string) => {

    try {
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
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/groupusersdelete`,{
            ugroupid: String(id)
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
    }

    setIsLoading(false);
  }

  // animation load
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* header */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-4xl pt-4 font-bold">Users Group</p>
        <p className="text-lg pt-2">{date}</p>
      </div>

      {/* table */}
      <div className="w-full min-h-[820px] bg-white p-4 mt-2 rounded-lg shadow-md">
        {/* header table */}
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row justify-between items-center p-4">
            <p className="text-2xl font-bold text-[#2B5F60]">
              รายการกลุ่มผู้ใช้
            </p>
          </div>

          {/* <div className='p-4'>
              <button className='btn' onClick={handleOpenCreate}> <i className="fa-solid fa-plus"></i> เพิ่มร้านค้า</button>
            </div> */}

          <div className="p-4 flex flex-col-reverse xl:flex-row items-start justify-center gap-2">

            <button
              className="btn w-[200px] flex flex-row items-center justify-center gap-x-3"
              onClick={() => {
                router.push("/backoffice/users");
              }}
            >
              <i className="fa-solid fa-users"></i>
              <p>จัดการผู้เข้าใช้งาน</p>
            </button>
            <button
              className="btn w-[210px] flex flex-row items-center justify-center gap-x-3"
              onClick={handleOpenModalCreate}
            >
              <i className="fa-solid fa-plus"></i> เพิ่มกลุ่มผู้ใช้งาน
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
        <div className="min-h-[715px] overflow-x-auto ">
          <table className="min-w-[1536px] 2xl:w-full p-4 table-auto text-center ">
            <thead className="border-b border-[#2B5F60] bg-white sticky top-0">
              <tr>
                <th className="h-12 w-[100px]">วันที่สร้าง</th>
                <th className="h-12 w-[100px]">ชื่อกลุ่มผู้ใช้</th>
                {/* <th className="h-12 w-[100px]">รายละเอียด</th> */}
                <th className="h-12 w-[100px]">ระยะเวลาใช้งาน</th>
                <th className="h-12 w-[100px]">Action</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(groupusers) && groupusers.length > 0 ? (
                groupusers.map((groupuser: GroupUserEntry) => (
                  <tr
                    key={groupuser.ugroupid}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="h-12 w-[100px]">{groupuser.create_at}</td>
                    <td className="h-12 w-[100px]">{groupuser.groupname}</td>
                    <td className="h-12 w-[100px]">{groupuser.duration}</td>

                    <td className="h-12 w-[100px]">
                      <button
                        className="btn-edit mr-2"
                        onClick={() => handleEdit(groupuser.ugroupid as string)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDelete(groupuser.ugroupid as string)
                        }
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="h-96 text-center text-lg text-gray-500"
                  >
                    ไม่พบข้อมูลบัญชีผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* แก้ไข */}
      <Modal
        title="แก้ไขกลุ่มผู้ใช้งาน"
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <div className="flex flex-col gap-2">
          <div className="w-full overflow-y-auto">
            <div>ชื่อกลุ่มผู้ใช้ <span className="text-red-500">*</span></div>
            <input
              className="mb-2 p-2"
              type="text"
              value={groupname}
              onChange={(e) => setGroupname(e.target.value)}
              placeholder="กรุณากรอกชื่อกลุ่มผู้ใช้"
            />

            <div>ระยะเวลาใช้งาน <span className="text-red-500">*</span></div>

            <SeclectTime duration={duration} setDuration={setDuration} />
            
            {/* <input
              className="mb-2 p-2"
              type="time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            /> */}

            <div className="mt-4 pt-2 border-t border-[#2B5F60]">
              <button className="btn mr-2" onClick={handleEditSave}>
                <i className="fa-solid fa-save mr-2"></i>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* สร้าง */}
      <Modal
        title="เพิ่มกลุ่มผู้ใช้งาน"
        isOpen={isOpenCreate}
        onClose={handleCloseModal}
      >
        <div className="flex flex-col gap-2">
          <div className="w-full overflow-y-auto">
            <div>ชื่อกลุ่มผู้ใช้ <span className="text-red-500">*</span></div>
            <input
              className="mb-2 p-2"
              type="text"
              value={groupname}
              onChange={(e) => setGroupname(e.target.value)}
              placeholder="กรุณากรอกชื่อกลุ่มผู้ใช้"
            />

            <div>ระยะเวลาใช้งาน <span className="text-red-500">*</span></div>

            <SeclectTime duration={duration} setDuration={setDuration} />
            {/* <input
              className="mb-2 p-2"
              type="time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            /> */}
          </div>

          <div className="mt-2 pt-2 border-t border-[#2B5F60]">
            <button className="btn mr-2" onClick={handleCreate}>
              <i className="fa-solid fa-plus mr-2"></i>
              เพิ่ม
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

