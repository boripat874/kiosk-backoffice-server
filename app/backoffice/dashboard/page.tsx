"use client"

import React, { useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, // <-- Add for Bar chart X-axis
  LinearScale,   // <-- Add for Bar chart Y-axis
  BarElement,    // <-- Add for the bars themselves
  ArcElement,
  Tooltip,
  Legend,
  Title          // <-- Add for chart title
} from 'chart.js';

import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels'; // Import Context
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "../../component/LoadingSpinner";

// Register Chart.js components
ChartJS.register(
  CategoryScale, // <-- Register
  LinearScale,   // <-- Register
  BarElement,    // <-- Register
  ArcElement,
  Title,         // <-- Register
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function Dashboard() {

  // Define an interface for the user data structure
  interface User {
    id: number | string; // Assuming id could be number or string
    lastactivedate: string;
    visitortype: string;
    groupname: string;
    name: string;
    surname: string;
    idcardnumber?: string | null; // Allow null if it might be missing
    passportnumber?: string | null;   // Allow null if it might be missing
    phone: string;
    level: string; // Or maybe number? Adjust as needed
    expiredate: string;
  }

  const [Selectnumberuser, setSelectNumberuser] = useState("today");
  const [selectusertype, setSelectUsertype] = useState("today");
  const [selectusers, setSelectUsers] = useState("today");

  // const [numberusers, setNumberusers] = useState([]);
  // const [usertypes, setUserTypes] = useState([]);
  const [users, setUsers] = useState([]);

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);

  // --- State for Bar Chart (Existing) ---
  const barChartOptions = {
    // Renamed for clarity
    responsive: true,
    maintainAspectRatio: false,
    labels: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [5, 5], // Use a visible dash pattern
          display: true,
        },
      },
      x: {
        grid: {
          display: false, // Hide X grid lines for bar chart
        },
        ticks: {
          display: false, // Hide X tick labels for bar chart
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      datalabels: {
        display: false,
        color: "#FFFFFF",
        font: {
          weight: "bold" as const,
        },
      },
    },
  };

  const [barChartData, setBarChartData] = useState({
    // Renamed for clarity
    labels: ["วันนี้"],
    datasets: [
      {
        label: "คนไทย", // Example label
        data: [0], // Example data
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "คนต่างชาติ", // Example label
        data: [0], // Example data
        backgroundColor: "rgba(255, 159, 64, 0.8)",
      },
    ],
  });
  // --- End State for Bar Chart ---

  // --- Add State for Pie Chart ---
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const, // Position legend to the right for Pie
      },
      title: {
        display: false, // No need for a title within the chart itself
        // text: 'ประเภทผู้ใช้',
      },
      datalabels: {
        formatter: (value: number, ctx: Context) => {
          // Show percentage
          let sum = 0;
          const dataArr = ctx.chart.data.datasets[0].data;

          // Ensure data is treated as numbers for summation
          dataArr.forEach((data) => {
            if (typeof data === 'number') {
              sum += data;
            }
          });

          const percentage = ((value * 100) / sum).toFixed(2) + "%"; // Calculate percentage
          return percentage;
        },
        color: "#FFFFFF", // White text for labels on slices
        font: {
          weight: "bold" as const,
        },
      },
    },
  };

  const [pieChartData, setPieChartData] = useState({
    labels: ["คนไทย", "คนต่างชาติ"], // Example user types
    datasets: [
      {
        label: "จำนวน",
        data: [120, 55], // Example counts corresponding to labels
        backgroundColor: [
          // Array of colors for each slice
          "rgba(75, 192, 192, 0.8)", // Teal
          "rgba(255, 159, 64, 0.8)", // Orange
        ],
        borderColor: [
          // Optional: Border colors for slices
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const datenow =
      " " +
      new Date().toLocaleString("th-TH", {
        hour12: false,
        weekday: "long",
        month: "long",
        year: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    setDate(datenow + " น.");

    fetchDataFirst();

    const intervalId = setInterval(() => {
      // อัปเดตเวลา
      const datenow =
        " " +
        new Date().toLocaleString("th-TH", {
          hour12: false,
          weekday: "long",
          month: "long",
          year: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      setDate(datenow + " น.");
    }, 2000); // ตรวจสอบและอัปเดตทุก 2 วินาที

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchDataFirst = async () => {
    
    setIsLoading(true);

    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboardlistall`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setUsers(response.data.users.result);

          const numbercountnationalidcard = Number(
            response.data.numberusers.countnationalidcard
          );
          const numbercountpassportcard = Number(
            response.data.numberusers.countpassportcard
          );
          const typecountnationalidcard = Number(
            response.data.usertype.countnationalidcard
          );
          const typecountpassportcard = Number(
            response.data.usertype.countpassportcard
          );

          setBarChartData({
            labels: [response.data.numberusers.period],
            datasets: [
              {
                label: "คนไทย", // Example label
                data: [numbercountnationalidcard], // Example data
                backgroundColor: "rgba(75, 192, 192, 0.8)",
              },
              {
                label: "คนต่างชาติ", // Example label
                data: [numbercountpassportcard], // Example data
                backgroundColor: "rgba(255, 159, 64, 0.8)",
              },
            ],
          });

          setPieChartData({
            labels: ["คนไทย", "คนต่างชาติ"], // Example user types
            datasets: [
              {
                label: "จำนวน",
                data: [typecountnationalidcard, typecountpassportcard], // Example counts corresponding to labels, 55], // Example counts corresponding to labels
                backgroundColor: [
                  // Array of colors for each slice
                  "rgba(75, 192, 192, 0.8)", // Teal
                  "rgba(255, 159, 64, 0.8)", // Orange
                ],
                borderColor: [
                  // Optional: Border colors for slices
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
        });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2ms

    setIsLoading(false);
  };

  const fetchDatanumberusers = async (period: string) => {
    setIsLoading(true);

    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboardnumberusers`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              period: period,
            },
          }
        )
        .then((response) => {
          const numbercountnationalidcard = Number(
            response.data.numberusers.countnationalidcard
          );
          const numbercountpassportcard = Number(
            response.data.numberusers.countpassportcard
          );

          setBarChartData({
            labels: [response.data.numberusers.period],
            datasets: [
              {
                label: "คนไทย", // Example label
                data: [numbercountnationalidcard], // Example data
                backgroundColor: "rgba(75, 192, 192, 0.8)",
              },
              {
                label: "คนต่างชาติ", // Example label
                data: [numbercountpassportcard], // Example data
                backgroundColor: "rgba(255, 159, 64, 0.8)",
              },
            ],
          });
        });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2ms

    setIsLoading(false);
  };

  const fetchDatadashboardusertype = async (period: string) => {
    setIsLoading(true);

    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboardusertype`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              period: period,
            },
          }
        )
        .then((response) => {
          const typecountnationalidcard = Number(
            response.data.usertype.countnationalidcard
          );
          const typecountpassportcard = Number(
            response.data.usertype.countpassportcard
          );

          setPieChartData({
            labels: ["คนไทย", "คนต่างชาติ"], // Example user types
            datasets: [
              {
                label: "จำนวน",
                data: [typecountnationalidcard, typecountpassportcard], // Example counts corresponding to labels, 55], // Example counts corresponding to labels
                backgroundColor: [
                  // Array of colors for each slice
                  "rgba(75, 192, 192, 0.8)", // Teal
                  "rgba(255, 159, 64, 0.8)", // Orange
                ],
                borderColor: [
                  // Optional: Border colors for slices
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
        });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2ms

    setIsLoading(false);
  };

  const fetchDatadashboardusers = async (period: string) => {
    setIsLoading(true);

    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/dashboardusers`, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            period: period,
          },
        })
        .then((response) => {
          setUsers(response.data.users.result);
        });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }

    // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2ms

    setIsLoading(false);
  };

  // animation load
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>

      {/* Contact Center */}
      <div className="w-full">

        {/* header */}
        <div className="w-full flex flex-col justify-between items-start">
          <p className="text-4xl pt-4 font-bold">Dashboard</p>
          <p className="text-lg pt-2">{date}</p>
        </div>

        {/* เส้นคั่น */}
        {/* <hr className="mt-4 border-t-3 border-[#2B5F60]" /> */}

        {/*chart */}
        <div className="w-full min-h-[370px] grid grid-cols-1 md:grid-cols-2  gap-2 mt-2">

          {/* จำนวนผู้เข้าใช้งาน */}
          <div className="w-full h-full bg-[#FFFFFF] rounded-lg shadow-md">
            <div className="p-4 flex flex-row justify-between items-center">
              <p className="text-lg font-bold text-[#2B5F60]">
                จำนวนผู้เข้าใช้งาน
              </p>
              <select
                className="p-2  rounded-md border-solid border-2 border-[#2B5F60] border-opacity-50 text-[#2B5F60]"
                defaultValue={Selectnumberuser}
                onChange={(e) => {
                  setSelectNumberuser(e.target.value);
                  fetchDatanumberusers(e.target.value);
                }}
              >
                <option value={"today"}>Today</option>
                <option value={"thisweek"}>This week</option>
                <option value={"thismonth"}>This month</option>
                <option value={"thisyear"}>This year</option>
              </select>
            </div>

            <div className="w-full h-[280px] relative flex-grow p-4 px-10">
              {" "}
              {/* Use flex-grow to fill space, added padding */}
              {barChartData.datasets[0].data[0] != 0 &&
              barChartData.datasets[1].data[0] != 0 ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-lg">
                    ไม่พบข้อมูลจำนวนผู้เข้าใช้งาน
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ประเภทผู้ใช้ */}
          <div className=" h-full bg-[#FFFFFF] rounded-lg shadow-md">
            {/* title */}
            <div className="p-4 flex flex-row justify-between items-center">
              <p className="text-lg font-bold text-[#2B5F60]">ประเภทผู้ใช้</p>
              <select
                className="p-2  rounded-md border-solid border-2 border-[#2B5F60] border-opacity-50 text-[#2B5F60]"
                defaultValue={selectusertype}
                onChange={(e) => {
                  setSelectUsertype(e.target.value);
                  fetchDatadashboardusertype(e.target.value);
                }}
              >
                <option value={"today"}>Today</option>
                <option value={"thisweek"}>This week</option>
                <option value={"thismonth"}>This month</option>
                <option value={"thisyear"}>This year</option>
              </select>
            </div>

            {/* chart */}
            <div className="w-full h-[250px] relative flex-grow p-4 px-16">
              {pieChartData.datasets[0].data[0] != 0 &&
              pieChartData.datasets[0].data[1] != 0 ? (
                // Pass state variables
                <Pie data={pieChartData} options={pieChartOptions} />
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-lg">
                    ไม่พบข้อมูลประเภทผู้ใช้
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* table */}
        <div className="w-full min-h-[450px] p-2 mt-2 pb-4 bg-white rounded-lg shadow-md">
          {/* header table */}
          <div className="flex flex-row justify-between items-center px-[20px] text-white">
            <div className="flex flex-row justify-between items-center">
              <p className="text-xl font-bold text-[#2B5F60]">
                {" "}
                รายการผู้เข้าใช้งาน
              </p>
            </div>

            <div className=" my-4 rounded-sm bg-opacity-20">
              {/* <select className='p-2  rounded-md border-solid border-2 border-[#2B5F60] border-opacity-50' value={shopid} onChange={(e) => {
                productlist(e.target.value)
              }}>
                {shops.map((shop:Shop) => (
                  <option key={shop.shopid} value={shop.shopid}>
                    {shop.shopnameth}
                  </option>
                ))}
              </select> */}
              <select
                className="p-2  rounded-md border-solid border-2 border-[#2B5F60] border-opacity-50 text-[#2B5F60]"
                value={selectusers}
                onChange={(e) => {
                  setSelectUsers(e.target.value);
                  fetchDatadashboardusers(e.target.value);
                }}
              >
                <option value={"today"}>Today</option>
                <option value={"thisweek"}>This week</option>
                <option value={"thismonth"}>This month</option>
                <option value={"thisyear"}>This year</option>
              </select>
            </div>
          </div>

          {/* content table */}
          <div className="p-4 overflow-auto">
            <table className="min-w-[1536px] 2xl:w-full h-full table-auto text-center ">
              <thead className="border-b border-[#2B5F60] sticky top-0 z-10 bg-white">
                <tr>
                  {/* <th className='h-12 w-[100px]'>Shop Number</th> */}
                  <th className="h-12 w-[100px]">วันที่เข้าใช้งานล่าสุด</th>
                  <th className="h-12 w-[100px]">ประเภทผู้มาติดต่อ</th>
                  <th className="h-12 w-[100px]">กลุ่มผู้ใช้</th>
                  <th className="h-12 w-[100px]">ชื่อ นามสกุล</th>
                  <th className="h-12 w-[100px]">บัตรประชาชน</th>
                  <th className="h-12 w-[100px]">พาสปอร์ต</th>
                  <th className="h-12 w-[100px]">เบอร์โทร</th>
                  <th className="h-12 w-[100px]">เวลาหมดอายุ</th>
                </tr>
              </thead>

              {/* <tbody>
                {Array.isArray(dashboardshoplist) && dashboardshoplist.length > 0 ? dashboardshoplist.map((shop: any) => (
                  <tr key={shop.shopid} className='border-b border-gray-100 hover:bg-gray-50'>
                  
                    <td className='h-12'>{shop.shoptype}</td>
                    <td className='h-12'>{shop.shopnameth}</td>
                    <td className='h-12'>{shop.shopnameeng}</td>
                    <td className='h-12'>{shop.totalprice}</td>
                    <td className='h-12'>{shop.countorder}</td>

                  </tr>
                )): 
                  <tr>
                    <td className='h-96 text-xl' colSpan={5}> ไม่มีข้อมูลรายการร้านค้า</td>
                  </tr>
                }
              </tbody> */}

              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user: User) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="h-12 w-[100px]">{user.lastactivedate}</td>
                      <td className="h-12 w-[100px]">{user.visitortype}</td>
                      <td className="h-12 w-[100px]">{user.groupname}</td>
                      <td className="h-12 w-[100px]">
                        {user.name} {user.surname}
                      </td>
                      <td className="h-12 w-[100px]">{user.idcardnumber}</td>
                      <td className="h-12 w-[100px]">{user.passportnumber}</td>
                      <td className="h-12 w-[100px]">{user.phone}</td>
                      <td className="h-12 w-[100px]">{user.expiredate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="h-72 text-center text-lg text-gray-500"
                    >
                      ไม่พบข้อมูลผู้เข้าใช้งาน
                    </td>
                  </tr>
                )}

                {/* <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className='h-12'>2025-01-01 10:00</td>
                    <td className='h-12'>คนไทย</td>
                    <td className='h-12'>Smart</td>
                    <td className='h-12'>สุภาพร ใจดี</td>
                    <td className='h-12'>9876543210987</td>
                    <td className='h-12'>-</td>
                    <td className='h-12'>0901234567</td>
                    <td className='h-12'>2026-01-02 10:00</td>
                  </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

