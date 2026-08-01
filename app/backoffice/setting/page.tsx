"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "../../component/LoadingSpinner";
import SeclectTime from '@/app/component/SeclectTime';
import Modal from "@/app/modal";
// import { set } from 'date-fns';

interface settinglistEntry {
  kioskid: string;
  terminalid: string;
  duration: string;
  details: string;
  update_at : number;
}

export default function Setting() {

  // Define an interface for the event log entry structure

  const [settinglist, setSettinglist] = useState<settinglistEntry[]>([]);

  // const [search, setSearch] = useState("");

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [kioskid, setKioskid] = useState("-");
  const [terminalid, setTerminalid] = useState("-");
  const [duration, setDuration] = useState("04:00");
  const [details, setDetails] = useState("-");

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

    // Define the interval function separately for clarity
    const updateTime = () => {
      const now = " " + new Date().toLocaleString('th-TH', {
        hour12: false,
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      setDate(now + " น.");
    };

    updateTime(); // Initial time set
    fetchDataFirst(); // Initial data fetch

    const intervalId = setInterval(updateTime, 2000); // Update time every 2 seconds

    return () => {
      clearInterval(intervalId);
    } 

  },[])
  
  // Wrap fetchDataFirst in useCallback to stabilize its reference
  const fetchDataFirst = useCallback(async () => {

    setIsLoading(true);

    try{

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/listkioskSettings`,{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((response) => {
        // console.log(response.data);
        setSettinglist(response.data.result);
        
      })

    }catch(error){
      console.log(error);

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'กรุณาลองใหม่อีกครั้ง',
        timer: 2000
      });
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2ms

    setIsLoading(false);

  }, []);

  const handleEdit = async(id: string) => {

    setIsLoading(true);

    const kiosk = settinglist.find((u: settinglistEntry) => u.kioskid === id);

    if (kiosk) {
      
      setKioskid(kiosk.kioskid);
      setTerminalid(kiosk.terminalid);
      setDuration(kiosk.duration);
      setDetails(kiosk.details);
    }

    // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groupuserslistall`,{
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //       "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
    //       "Authorization": `Bearer ${localStorage.getItem("token")}`,
    //     },
    // })
    // .then((response) => {
    //   setUserGroups(response.data.result);
      
    // });

    setIsLoading(false);

    setIsOpen(true);
  };

  const handleEditSave = async() => {

    setIsLoading(true);

    try {

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/settingupdate`,{
          "kioskid" : kioskid,
          "terminalid" : terminalid,
          "duration" : duration,
          "details" : details
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {

        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          fetchDataFirst();
        })

      })

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    
    setIsLoading(false);
    handleCloseModal();
    
  };
  
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  // animation load
  if (isLoading) {
    return <LoadingSpinner />;
  }
    

  return (

    <div>
      {/* header */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-4xl pt-4 font-bold">Setting</p>
        <p className="text-lg pt-2">{date}</p>
      </div>

      {/* เส้นคั่น */}
      {/* <hr className="mt-4 border-t-3 border-oxbowteal" /> */}

      {/* table */}
      <div className="w-full min-h-[820px] bg-white p-4 rounded-lg shadow-md mt-2">
        {/* header table */}
        <div className="flex flex-row justify-between items-center ">
          <div className="flex flex-row justify-between items-center p-4">
            <p className="text-2xl font-bold ">
              ตั้งค่า Kiosk WIFI
            </p>
          </div>

          {/* <div className='p-4'>
              <button className='btn' onClick={handleOpenCreate}> <i className="fa-solid fa-plus"></i> เพิ่มร้านค้า</button>
            </div> */}

          <div className="p-4 flex flex-col-reverse xl:flex-row items-start justify-center gap-2">
            {/* <button
              className="btn w-[170px] flex flex-row items-center justify-center gap-x-3"
              onClick={handleEdit}
            >
              <i className="fa-solid fa-gear mr-2"></i>{" "}
              ตั้งค่า
            </button> */}
          </div>
        </div>

        {/* content table */}
        <div className="min-h-[715px] overflow-auto">
          <table className="min-w-[1536px] 2xl:w-full p-4 table-auto text-center ">
            <thead className="border-b border-oxbowteal sticky top-0 z-10 bg-white">
              <tr>
                <th className="h-12 w-[100px]">รหัสเครื่อง kiosk wifi</th>
                <th className="h-12 w-[100px]">ระยะเวลาใช้งาน (ชม.)</th>
                <th className="h-12 w-[100px]">รายละเอียด</th>
                <th className="h-12 w-[20px]">Action</th>

              </tr>
            </thead>

            <tbody>
              {Array.isArray(settinglist) && settinglist.length > 0 ? (
                settinglist.map((setting: settinglistEntry) => (
                  <tr
                    key={setting.kioskid}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="h-12 w-[100px]">{setting.terminalid}</td>
                    <td className="h-12 w-[100px]">{setting.duration}</td>
                    <td className="h-12 w-[100px]">{setting.details}</td>

                    <td className="h-12 w-[100px]">

                      <button
                        className="btn-edit mr-2"
                        onClick={() => handleEdit(setting.kioskid as string)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="h-96 text-center text-lg opacity-50">
                    ไม่พบข้อมูลตั้งค่า
                  </td>
                </tr>
              )}

              {/* <tr className='border-b border-gray-100 hover:bg-gray-50'>

                <td className='h-12 w-[100px]'>2025-01-01 10:00</td>
                <td className='h-12 w-[100px]'>สุภาพร ใจดี</td>
                <td className='h-12 w-[100px]'>Smart</td>
                <td className='h-12 w-[100px]'>Admin</td>
                <td className='h-12 w-[300px]'>Import account</td>

              </tr> */}
            </tbody>
          </table>
        </div>
      </div>

      {/* แก้ไข */}
      <Modal
        title="ตั้งค่า Kiosk WIFI"
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <div className="w-[300px] md:w-[700px] flex flex-col gap-2">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 w-full min-h-[165px] overflow-y-auto">

            <div>
              <div>รหัสเครื่อง kiosk wifi</div>
              <input
                className="mb-2 p-2"
                type="text"
                value={terminalid}
                onChange={(e) => setTerminalid(e.target.value)}
                placeholder='กรุณากรอกประเภทผู้มาติดต่อ'
              />
            </div>

            <div>
              {/* <div>เวลาหมดอายุ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="date"
                value={expiredate}
                onChange={(e) => setExpiredate(e.target.value)}
              /> */}
              <div>ระยะเวลาใช้งาน (ชม.) <span className="text-red-500">*</span></div>
              {/* <input
                className="mb-2 p-2"
                type="date"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              /> */}
              <SeclectTime duration={duration} setDuration={setDuration} />
            </div>

            <div>
              <div>รายละเอียด</div>
              <input
                className="mb-2 p-2"
                type="text"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder='ข้อมูลเพิ่มเติม'
              />

            </div>

          </div>

          <div className="mt-2 border-t border-oxbowteal pt-2">
            <button className="btn mr-2" onClick={handleEditSave}>
              <i className="fa-solid fa-save mr-2"></i>
              บันทึก
            </button>
          </div>

        </div>

      </Modal>
    </div>

  );
}

