"use client"

import React, { useEffect, useState, useCallback ,useRef } from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "@/app/component/LoadingSpinner";
import Seclectdate from "@/app/component/selectdate";
import { useRouter } from "next/navigation";

// Define an interface for the report entry structure
interface ReportEntry {
  id: number | string; // Assuming id exists
  create_at: string | null;
  lastactivedate: string | null;
  visitortype: string | null;
  groupname: string | null;
  name: string | null;
  surname: string | null;
  idcardnumber: string | null;
  passportnumber: string | null;
  phone: string | null;
  expiredate: string | null;
  duration: string | null;
}

export default function ReportPage() {

  const router = useRouter();

  const [reportslist, setReportslist] = useState([]);

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [period, setPeriod] = useState("today");
  const [timestart, setTime_Start] = useState(`${new Date().toISOString().split("T")[0]}`);
  const [timeend, setTime_End] = useState(`${new Date().toISOString().split("T")[0]}`);

  const periodRef = useRef(period); // สร้าง ref เก็บค่า period
  const timestartRef = useRef(timestart); // สร้าง ref เก็บค่า shopid
  const timeendRef = useRef(timeend); // สร้าง ref เก็บค่า shopid
  
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

    // Define the interval function separately
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

  useEffect(() => {

    
    periodRef.current = period;
    timestartRef.current = timestart;
    timeendRef.current = timeend;
    
    fetchData();

    // console.log(periodRef.current, timestart, timeend);
  }, [periodRef.current, timestart, timeend]);
  
  // Wrap fetchDataFirst in useCallback
  const fetchDataFirst = useCallback(async () => {

    setIsLoading(true);

    try{

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reportlistall`,{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          search: search,
          period: periodRef.current,
          date_start: timestart,
          date_end: timeend
        }
      })
      .then((response) => {
        // console.log(response.data);
        setReportslist(response.data.result);
        
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

  const fetchData = useCallback(async () => {


    try{

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reportlistall`,{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          search: search,
          period: periodRef.current,
          date_start: timestartRef.current,
          date_end: timeendRef.current
        }
      })
      .then((response) => {
        // console.log(response.data);
        setReportslist(response.data.result);
        
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

  }, []);

  // --- CSV Export Function ---
  const handleExportCSV = () => {
    if (!reportslist || reportslist.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'ไม่มีข้อมูล',
        text: 'ไม่มีข้อมูลสำหรับส่งออกในขณะนี้',
      });
      return;
    }

    // Define CSV Headers (match table columns)
    const headers = [
      "วันที่ขอเข้าใช้งาน",
      "วันที่เข้าใช้งานล่าสุด",
      "ประเภทผู้มาติดต่อ",
      "กลุ่มผู้ใช้",
      "ชื่อ นามสกุล",
      "บัตรประชาชน",
      "พาสปอร์ต",
      "เบอร์โทร",
      "เวลาหมดอายุ",
      "ระยะเวลาใช้งาน"
    ];

    // Prepare CSV Rows
    const rows = reportslist.map((report: ReportEntry) => [ // Use the interface here
      report.create_at || '-', // Handle potential null/undefined values
      report.lastactivedate || '-',
      report.visitortype || '-',
      report.groupname || '-',
      `${report.name || ''} ${report.surname || ''}`.trim() || '-', // Combine name and surname
      report.idcardnumber || '-',
      report.passportnumber || '-',
      report.phone || '-',
      report.expiredate || '-',
      report.duration || '-'
    ]);

    // Combine headers and rows into a CSV string
    // Add BOM (\uFEFF) for Excel compatibility with UTF-8 (especially Thai characters)
    let csvContent = "\uFEFF";
    csvContent += headers.join(",") + "\n"; // Header row
    rows.forEach(rowArray => {
      // Basic escaping: wrap fields containing commas or quotes in double quotes
      // More robust escaping might be needed for complex data
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
      link.setAttribute("download", `kiosk_report_${timestamp}.csv`);
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
        <p className="text-4xl pt-4 font-bold">Report</p>
        <p className="text-lg pt-2">{date}</p>
      </div>

      {/* เส้นคั่น */}
      {/* <hr className="mt-4 border-t-3 border-[#2B5F60]" /> */}

      <div className='w-full pt-2'>

        <Seclectdate  
          period={period}
          timestart={timestart}
          timeend={timeend}
          periodRef={periodRef}
          onChangePeriod={setPeriod}
          onChangeTimestart={setTime_Start}
          onChangeTimeend={setTime_End}
        />

        {/* <button className='btn' onClick={() => setTime_Start(`2025-01-01`)}>TEST</button> */}

      </div>

      {/* table */}
      <div className="w-full min-h-[820px] bg-white p-4 rounded-lg shadow-md mt-2">

        {/* header table */}
        <div className="flex flex-row justify-between items-center text-white">
          <div className="flex flex-row justify-between items-center p-4">
            <p className="text-2xl font-bold text-[#2B5F60]">
              รายงาน List Account
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
              <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i> Export CSV
            </button>

            <div className="w-[300px] relative ">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search for reports..."
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
            <table className="min-w-[1536px] 2xl:w-full p-4 table-auto w-full text-center ">
              <thead className="border-b border-[#2B5F60] bg-white sticky top-0 z-10">
              <tr>
                
                <th className="h-12 w-[100px]">วันที่ขอเข้าใช้งาน</th>
                <th className="h-12 w-[100px]">วันที่เข้าใช้งานล่าสุด</th>
                <th className="h-12 w-[100px]">ประเภทผู้มาติดต่อ</th>
                <th className="h-12 w-[100px]">กลุ่มผู้ใช้</th>
                <th className="h-12 w-[100px]">ชื่อ นามสกุล</th>
                <th className="h-12 w-[100px]">บัตรประชาชน</th>
                <th className="h-12 w-[100px]">พาสปอร์ต</th>
                <th className="h-12 w-[100px]">เบอร์โทร</th>
                <th className="h-12 w-[100px]">เวลาหมดอายุ</th>
                <th className="h-12 w-[100px]">ระยะเวลาใช้งาน</th>
                
              </tr>
            </thead>

            <tbody>
              {Array.isArray(reportslist) && reportslist.length > 0 ? reportslist.map((report: ReportEntry) => (
                  <tr 
                    key={report.id} 
                    className='border-b border-gray-100 hover:bg-gray-50'
                    onClick={() => {
                      router.push("/backoffice/report/AccountDetails/" + report.id);
                    }}
                  >

                    <td className='h-12 w-[100px]'>{report.create_at}</td>
                    <td className='h-12 w-[100px]'>{report.lastactivedate}</td>
                    <td className='h-12 w-[100px]'>{report.visitortype}</td>
                    <td className='h-12 w-[100px]'>{report.groupname}</td>
                    <td className='h-12 w-[100px]'>{report.name} {report.surname}</td>
                    <td className='h-12 w-[100px]'>{report.idcardnumber}</td>
                    <td className='h-12 w-[100px]'>{report.passportnumber}</td>
                    <td className='h-12 w-[100px]'>{report.phone}</td>
                    <td className='h-12 w-[100px]'>{report.expiredate}</td>
                    <td className='h-12 w-[100px]'>{report.duration}</td>

                  </tr>
                )): 
                  <tr>
                    <td colSpan={10} className='h-[400px] text-center text-lg'>ไม่พบข้อมูลผู้เข้าใช้งาน</td>
                  </tr>
                }

              {/* <tr className='border-b border-gray-100 hover:bg-gray-50'>

                <td className='h-12 w-[100px]'>2025-01-01 10:00</td>
                <td className='h-12 w-[100px]'>2025-01-01 10:30</td>
                <td className='h-12 w-[100px]'>คนไทย</td>
                <td className='h-12 w-[100px]'>Smart</td>
                <td className='h-12 w-[100px]'>สุภาพร ใจดี</td>
                <td className='h-12 w-[100px]'>9876543210987</td>
                <td className='h-12 w-[100px]'>-</td>
                <td className='h-12 w-[100px]'>0901234567</td>
                <td className='h-12 w-[100px]'>2026-01-02 10:00</td>

              </tr> */}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

