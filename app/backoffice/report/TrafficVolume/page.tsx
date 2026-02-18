"use client"

import React, { useEffect, useState ,useRef} from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "@/app/component/LoadingSpinner";
import Seclectdate from "@/app/component/selectdate";

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

// Define an interface for the report entry structure
// interface ReportEntry {
//   id: number | string; // Assuming id exists
//   create_at: string | null;
//   lastactivedate: string | null;
//   visitortype: string | null;
//   groupname: string | null;
//   name: string | null;
//   surname: string | null;
//   idcardnumber: string | null;
//   passportnumber: string | null;
//   phone: string | null;
//   expiredate: string | null;
//   duration: string | null;
// }

export default function ReportPage() {

  // const [reportslist, setReportslist] = useState([]);
  const [period, setPeriod] = useState("today");
  const [timestart, setTimeStart] = useState(`${new Date().toISOString().split("T")[0]}`);
  const [timeend, setTimeEnd] = useState(`${new Date().toISOString().split("T")[0]}`);

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);

  // const [search, setSearch] = useState("");

  const periodRef = useRef(period); // สร้าง ref เก็บค่า period
  // const timestartRef = useRef(timestart); // สร้าง ref เก็บค่า shopid
  // const timeendRef = useRef(timeend); // สร้าง ref เก็บค่า shopid

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
      labels: ["คนไทย", "คนต่างชาติ"],
      datasets: [
        {
          label: "จำนวน", // Example label
          data: [0], // Example data
          backgroundColor: "rgba(75, 192, 192, 0.8)",
        },
        {
          data: [0], // Example data
          backgroundColor: "rgba(255, 159, 64, 0.8)",
        },
      ],
    });

  // --- Add State for Pie Chart ---
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const, // Position legend to the right for Pie
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
        data: [0, 0], // Example counts corresponding to labels
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
    fetchData();
  }, [periodRef.current, timestart, timeend]);

  const fetchDataFirst = async () => {

    setIsLoading(true);

    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/reporttraffic_volume`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              period: periodRef.current,
              date_start: timestart,
              date_end: timeend,
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

  const fetchData = async () => {

    try {
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/reporttraffic_volume`,
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              period: periodRef.current,
              date_start: timestart,
              date_end: timeend,
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

  };
  
  // Wrap fetchDataFirst in useCallback
  // const fetchDataFirst = useCallback(async () => {

  //   setIsLoading(true);

  //   try{

  //     await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reportlistall`,{
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //         "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
  //         "Authorization": `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       params: {
  //         search: search
  //       }
  //     })
  //     .then((response) => {
  //       // console.log(response.data);
  //       setReportslist(response.data.result);
        
  //     })

  //   }catch(error){
  //     console.log(error);

  //     Swal.fire({
  //       icon: 'error',
  //       title: 'เกิดข้อผิดพลาด',
  //       text: 'กรุณาลองใหม่อีกครั้ง',
  //       timer: 2000
  //     });
  //   }

  //   // await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2ms

  //   setIsLoading(false);

  // }, [search]);

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
          onChangeTimestart={setTimeStart}
          onChangeTimeend={setTimeEnd}
        />
      </div>

      {/* table */}
      <div className="w-full min-h-[650px] bg-white p-4 rounded-lg shadow-md mt-2 mb-0">

        {/* header table */}
        <div className="flex flex-col justify-between items-center text-white">

          
          <div className="flex flex-row justify-start items-center w-full px-4 py-2">

            <p className="text-start text-2xl font-bold text-[#2B5F60]">
              รายการปริมาณการเข้าใช้งาน
            </p>

          </div>

          {/*chart */}
          <div className="w-full h-[700px] grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
  
            {/* จำนวนผู้เข้าใช้งาน */}
            <div className="w-full h-full bg-[#FFFFFF] rounded-lg shadow-md">

              {/* <div className="p-4 flex flex-row justify-between items-center">
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
              </div> */}

              <div className='w-full p-4 '>

                <p className="text-lg text-center font-bold text-[#2B5F60]">
                  จำนวนผู้เข้าใช้งาน
                </p>

              </div>
  
              <div className="w-full h-[650px] relative flex-grow p-4 px-10">
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
            <div className="bg-[#FFFFFF] rounded-lg shadow-md flex flex-col justify-between items-center">

              {/* title */}
              {/* <div className="p-4 flex flex-row justify-between items-center">
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
              </div> */}
  
              <div className='w-full p-4'>
                <p className="text-lg text-center font-bold text-[#2B5F60]">
                  ประเภทผู้ใช้
                </p>
              </div>

              {/* chart */}
              <div className="w-[70%] h-[620px] relative flex-grow p-4 px-16">

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

        </div>

        {/* content table */}

      </div>
    </div>
  );
}

