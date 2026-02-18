"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "../../component/LoadingSpinner";

interface EventLogEntry {
  id: number | string; // Assuming id exists and can be number or string
  create_at: string;
  name: string;
  username: string;
  level: string;
  remark: string;
}

export default function EventLogPage() {

  // Define an interface for the event log entry structure

  const [eventloglist, setEventloglist] = useState<EventLogEntry[]>([]);

  const [search, setSearch] = useState("");

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);

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

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/eventloglistall`,{
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
        // console.log(response.data);
        setEventloglist(response.data.result);
        
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

  }, [search]);

  // --- CSV Export Function ---
  const handleExportCSV = () => {
    if (!eventloglist || eventloglist.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'ไม่มีข้อมูล',
        text: 'ไม่มีข้อมูลสำหรับส่งออกในขณะนี้',
      });
      return;
    }

    // Define CSV Headers (match table columns)
    const headers = [
      "เวลา วันที่",
      "ชื่อ นามสกุล",
      "User",
      "สิทธ์ใช้งาน",
      "การดำเนินการ"
    ];

    // Prepare CSV Rows
    const rows = eventloglist.map((log: EventLogEntry) => [ // Use the interface here
      log.create_at || '-', // Handle potential null/undefined values
      log.name || '-',
      log.username || '-',
      log.level || '-',
      log.remark || '-'
    ]);

    // Combine headers and rows into a CSV string
    // Add BOM (\uFEFF) for Excel compatibility with UTF-8 (especially Thai characters)
    let csvContent = "\uFEFF";
    csvContent += headers.join(",") + "\n"; // Header row
    rows.forEach(rowArray => {
      // Basic escaping: wrap fields containing commas or quotes in double quotes
      const escapedRow = rowArray.map(field => {
        const stringField = String(field); // Ensure it's a string
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
          // Escape double quotes within the field by doubling them
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      });
      csvContent += escapedRow.join(",") + "\n"; // Data row
    });


    // Create a Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link element
    const link = document.createElement("a");
    if (link.download !== undefined) { // Check if HTML5 download attribute is supported
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      // Set the download filename
      const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      link.setAttribute("download", `kiosk_event_log_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up: remove the link and revoke the URL
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback for older browsers (might not work reliably)
      Swal.fire({
        icon: 'warning',
        title: 'ไม่รองรับการดาวน์โหลด',
        text: 'เบราว์เซอร์ของคุณไม่รองรับการดาวน์โหลดไฟล์โดยตรง',
      });
    }
  };
  // --- End CSV Export Function ---

  // animation load
  if (isLoading) {
    return <LoadingSpinner />;
  }
    

  return (
    <div>
      {/* header */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-4xl pt-4 font-bold">Event log</p>
        <p className="text-lg pt-2">{date}</p>
      </div>

      {/* เส้นคั่น */}
      {/* <hr className="mt-4 border-t-3 border-[#2B5F60]" /> */}

      {/* table */}
      <div className="w-full min-h-[820px] bg-white p-4 rounded-lg shadow-md mt-2">
        {/* header table */}
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row justify-between items-center p-4">
            <p className="text-2xl font-bold text-[#2B5F60]">
              รายการดำเนินงาน
            </p>
          </div>

          {/* <div className='p-4'>
              <button className='btn' onClick={handleOpenCreate}> <i className="fa-solid fa-plus"></i> เพิ่มร้านค้า</button>
            </div> */}

          <div className="p-4 flex flex-col-reverse xl:flex-row items-start justify-center gap-2">
            <button
              className="btn w-[170px] flex flex-row items-center justify-center gap-x-3"
              onClick={handleExportCSV}
            >
              <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>{" "}
              Export CSV
            </button>

            <div className="w-[300px] relative ">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search for events..."
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
        <div className="min-h-[715px] overflow-auto">
          <table className="min-w-[1536px] 2xl:w-full p-4 table-auto text-center ">
            <thead className="border-b border-[#2B5F60] sticky top-0 z-10 bg-white">
              <tr>
                <th className="h-12 w-[100px]">เวลาวันที่</th>
                <th className="h-12 w-[100px]">ชื่อ นามสกุล</th>
                <th className="h-12 w-[100px]">User</th>
                <th className="h-12 w-[100px]">สิทธ์ใช้งาน</th>
                <th className="h-12 w-[300px]">การดำเนินการ</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(eventloglist) && eventloglist.length > 0 ? (
                eventloglist.map((eventlog: EventLogEntry) => (
                  <tr
                    key={eventlog.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="h-12 w-[100px]">{eventlog.create_at}</td>
                    <td className="h-12 w-[100px]">{eventlog.name}</td>
                    <td className="h-12 w-[100px]">{eventlog.username}</td>
                    <td className="h-12 w-[100px]">{eventlog.level}</td>
                    <td className="h-12 w-[100px]">{eventlog.remark}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="h-96 text-center text-lg">
                    ไม่พบข้อมูลดำเนินการ
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
    </div>
  );
}

