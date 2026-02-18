"use client";

import Link from "next/link";
import { useRouter,usePathname } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect,useState ,useCallback ,useRef} from "react";
import Image from "next/image";
import ButtomSidebar from "@/app/component/ButtonSidebar";
import SubButtomSidebar from "./component/SubButtonSidebar";

// import Modal from "./modal";
// import Image from "next/image";
// import ButtomSidebar from "@/app/component/ButtomSidebar";
// import { set } from "date-fns";
// import SidebarLoadingspinner from "./component/SidebarLoadingspinner";

export default function Sidebar() {
  const [level, setLevel] = useState("");
  const router = useRouter();
  const pathname = usePathname(); // ดึง URL ปัจจุบัน
  // const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [showLabelWithDelay, setShowLabelWithDelay] = useState(false);
  const [hoversidebar, setHoverSidebar] = useState(false);
  const logoutTextTimerRef = useRef<NodeJS.Timeout | null>(null);
  // const [isMobile, setIsMobile] = useState(false);

  // const LABEL_DISPLAY_DELAY = isMobile ? 0 : 400;
  const LABEL_DISPLAY_DELAY = 400;

  // const [username, setUsername] = useState("");
  // const [isShow, setShowModal] = useState(false);
  // const [name, setName] = useState("");
  // const [username, setUsername] = useState("");

  // const [countNotiUnread, setCountNotiUnread] = useState(0);
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  // const [statusDashboard, setStatusDashboard] = useState(false);
  // const [statusPromotions, setStatusPromotions] = useState(false);
  // const [statusShop, setStatusShop] = useState(false);
  // const [statusProduct, setStatusProduct] = useState(false);
  // const [statusUser, setStatusUser] = useState(false);
  // const [statusReport, setStatusReport] = useState(false);
  // const [statusEventlog, setStatusEventlog] = useState(false);
  // const [statusNotification, setStatusNotification] = useState(false);
  // const [statusSetting, setStatusSetting] = useState(false);

  // const resetStatus = () => {
  //   setStatusDashboard(false);
  //   setStatusPromotions(false);
  //   setStatusShop(false);
  //   setStatusProduct(false);
  //   setStatusUser(false);
  //   setStatusReport(false);
  //   setStatusEventlog(false);
  //   setStatusNotification(false);
  //   setStatusSetting(false);
  // };

  useEffect(() => {
    fetchData(); // เรียกและตรวจสอบข้อมูล user

    // let token = localStorage.getItem("token");

    // if (token) {

    //   router.push('/backoffice/dashboard');

    // } else {
    //   localStorage.removeItem("token"); // ล้าง token เผื่อมีค่าเก่าที่ไม่ถูกต้อง
    //   router.push("/");
    // }

    const interval = setInterval(() => {
      fetchData(); // เรียกและตรวจสอบข้อมูล user
    }, 30000); // ตรวจสอบและอัปเดตทุก 30 วินาที

    // const interval2 = setInterval(() => {
    //   fetchData2(); // ตรวจสอบข้อมูลการแจ้งเตือนใหม่
    // }, 3000); // ตรวจสอบและอัปเดตทุก 3 วินาที

    return () => {
      clearInterval(interval);
    }; // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  useEffect(()=>{

    if (hoversidebar) {

      if (logoutTextTimerRef.current) {
        clearTimeout(logoutTextTimerRef.current);
      }

      logoutTextTimerRef.current = setTimeout(() => {
        setShowLabelWithDelay(true);
      }, LABEL_DISPLAY_DELAY);

    } else {

      if (logoutTextTimerRef.current) {
        clearTimeout(logoutTextTimerRef.current);
      }

      setShowLabelWithDelay(false); // Hide immediately
    }

    return () => { // Cleanup on unmount or if hoversidebar changes
      if (logoutTextTimerRef.current) {
        clearTimeout(logoutTextTimerRef.current);
      }
    };

  },[hoversidebar]);

  // เรียกและตรวจสอบข้อมูล user
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.removeItem("token");
        router.push("/");
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/checklogin`, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data) {

        setName(res.data.name); 
        setLevel(res.data.level);
      } else {
        localStorage.removeItem("token"); // ล้าง token เผื่อมีค่าเก่าที่ไม่ถูกต้อง
        router.push("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: `${error}`,
      });
    }
  }, [router]);

  // const fetchData2 = async ();

  const handleLogout = async() => {
    
    // if (localStorage.getItem("token")) {
    //   localStorage.removeItem("token");
    // }
    await Swal.fire({
      title: "ออกจากระบบ",
      text: "คุณต้องการออกจากระบบหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async(result) => {

      if (result.isConfirmed) {

        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/logout`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "ออกจากระบบสำเร็จ",
          text: "คุณได้ทำการออกจากระบบเรียบร้อย",
          showConfirmButton: false,
          timer: 1500,
        });

        localStorage.removeItem("token");
        router.push("/");
      }
    });

  };

  return (
    <div
      className={`sticky top-0 left-0 z-[100] 
        bg-[#58A776] h-screen rounded-[10px]
        ${hoversidebar ? "w-[150px] xl:w-[200px]" : "w-[65px] xl:w-[90px]"}  
        transition-all durationease-in-out duration-500
      `}
      onMouseEnter={() => {
        setHoverSidebar(true);
      }}
      onMouseLeave={() => setHoverSidebar(false)}
    >
      <div className="relative w-full h-full">
        <div className="text-sm xl:text-base flex flex-col justify-center items-center space-y-2">

          {/* Logo */}
          <div className=" w-full py-4 flex justify-center items-center">

            <Link
              className="flex flex-col justify-center items-center gap-2"
              href="/backoffice/dashboard"
            >
              <Image
                className="max-h-[80px] flex flex-row items-center px-2 xl:px-4 object-cover rounded-2xl"
                src={
                  true ? "/img/user-profile.png" : "https://placehold.co/90x90"
                }
                width={100}
                height={80}
                alt="logo"
              />

              {hoversidebar && (
                <p className="text-white h-[20px]">
                  {showLabelWithDelay && "Kiosk wifi Backoffice"}
                </p>
              )}
            </Link>
          </div>

          {/* Dashboard */}
          <ButtomSidebar
            labelButton="Dashboard"
            hrefButton="/backoffice/dashboard"
            showLabelWithDelay={showLabelWithDelay}
            hoversidebar={hoversidebar}
          >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="w-[25px] h-[25px]"
                fill={
                  pathname === "/backoffice/dashboard" ? "#58A776" : "#FFFFFF"
                }
              >
                <path d="M21.5003 1.25V7.25C21.5008 7.39807 21.4574 7.54296 21.3757 7.66642C21.2939 7.78988 21.1774 7.88637 21.0409 7.94375C20.9484 7.98049 20.8499 7.99957 20.7503 8C20.5512 7.99916 20.3599 7.92199 20.2159 7.78437L17.7503 5.30938L12.2847 10.7844C12.1425 10.9252 11.9504 11.0042 11.7503 11.0042C11.5502 11.0042 11.3581 10.9252 11.2159 10.7844L8.00031 7.55938L1.78469 13.7844C1.64072 13.922 1.44947 13.9992 1.25031 14C1.05153 13.9973 0.860929 13.9204 0.715938 13.7844C0.575101 13.6422 0.496094 13.4501 0.496094 13.25C0.496094 13.0499 0.575101 12.8578 0.715938 12.7156L7.46594 5.96563C7.60813 5.82479 7.80018 5.74578 8.00031 5.74578C8.20045 5.74578 8.39249 5.82479 8.53469 5.96563L11.7503 9.19062L16.6909 4.25L14.2159 1.78438C14.1142 1.67594 14.0452 1.54091 14.017 1.39491C13.9888 1.24891 14.0025 1.09791 14.0566 0.959375C14.115 0.823599 14.2117 0.707812 14.3349 0.626214C14.4582 0.544615 14.6025 0.500751 14.7503 0.5H20.7503C20.9492 0.5 21.14 0.579018 21.2806 0.71967C21.4213 0.860322 21.5003 1.05109 21.5003 1.25Z" />
              </svg>

          </ButtomSidebar>

          {/* Users */}
          {level === "Admin" && (
          <ButtomSidebar
            labelButton="Users"
            hrefButton="/backoffice/users"
            showLabelWithDelay={showLabelWithDelay}
            hoversidebar={hoversidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-[25px] h-[20px]"
              fill={pathname === "/backoffice/users" ? "#58A776" : "#FFFFFF"}
            >
              <path d="M11.3625 14.8033C12.3688 14.1348 13.1331 13.1601 13.5424 12.0235C13.9516 10.8869 13.9841 9.64875 13.635 8.49224C13.2859 7.33574 12.5737 6.32236 11.6039 5.60207C10.634 4.88178 9.45806 4.49286 8.25001 4.49286C7.04196 4.49286 5.866 4.88178 4.89617 5.60207C3.92633 6.32236 3.21416 7.33574 2.86503 8.49224C2.51591 9.64875 2.54838 10.8869 2.95766 12.0235C3.36693 13.1601 4.13125 14.1348 5.13751 14.8033C3.42092 15.4345 1.93883 16.5763 0.890635 18.0751C0.80876 18.1863 0.760027 18.3184 0.750072 18.4561C0.740118 18.5938 0.769349 18.7315 0.834385 18.8533C0.898652 18.9742 0.994453 19.0756 1.11163 19.1466C1.22882 19.2175 1.36302 19.2555 1.50001 19.2564H15C15.137 19.2555 15.2712 19.2175 15.3884 19.1466C15.5056 19.0756 15.6014 18.9742 15.6656 18.8533C15.7307 18.7315 15.7599 18.5938 15.7499 18.4561C15.74 18.3184 15.6913 18.1863 15.6094 18.0751C14.5612 16.5763 13.0791 15.4345 11.3625 14.8033Z" />
              <path d="M23.2595 18.075C22.2053 16.5781 20.7209 15.437 19.0032 14.8032C20.0127 14.1372 20.7802 13.1633 21.1916 12.0261C21.603 10.8889 21.6363 9.64931 21.2866 8.49167C20.9369 7.33403 20.2228 6.32021 19.2506 5.60102C18.2784 4.88182 17.1 4.49568 15.8907 4.50004C15.3746 4.50277 14.861 4.5721 14.3626 4.70629C14.2455 4.74145 14.1385 4.80401 14.0505 4.8888C13.9624 4.97358 13.8959 5.07813 13.8563 5.19379C13.8186 5.30849 13.8091 5.43061 13.8287 5.54976C13.8483 5.66891 13.8964 5.78157 13.9688 5.87816C14.8167 7.01739 15.3038 8.38452 15.3673 9.80323C15.4308 11.2219 15.0678 12.6271 14.3251 13.8375C14.2298 13.9984 14.1973 14.1887 14.2336 14.372C14.2699 14.5554 14.3726 14.7189 14.522 14.8313C14.8032 15.05 15.0751 15.275 15.3376 15.5063L15.3845 15.5532C16.3851 16.4792 17.197 17.5903 17.7751 18.825C17.8344 18.9541 17.9296 19.0633 18.0492 19.1398C18.1689 19.2162 18.3081 19.2567 18.4501 19.2563H22.6407C22.7777 19.2554 22.9119 19.2174 23.0291 19.1465C23.1463 19.0755 23.2421 18.9741 23.3063 18.8532C23.3706 18.7316 23.4002 18.5948 23.3919 18.4575C23.3837 18.3203 23.3378 18.188 23.2595 18.075Z" />
            </svg>

          </ButtomSidebar>

          )}

          

          {/* Administrators */}
          {level === "Admin" && (
            
            <ButtomSidebar
              labelButton="Administrators"
              hrefButton="/backoffice/administrator"
              showLabelWithDelay={showLabelWithDelay}
              hoversidebar={hoversidebar}
            >
              <i className="pl-1 fa-solid fa-user-tie text-xl"></i>

            </ButtomSidebar>

          )}

          {/* Report */}
          {/* <ButtomSidebar
              labelButton="Report"
              hrefButton="/backoffice/report"
              showLabelWithDelay={showLabelWithDelay}
              hoversidebar={hoversidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 21"
                className="w-[25px] h-[20px] stroke-2 stroke-linejoin-round stroke-linecap-round"
                fill={pathname === "/backoffice/report" ? "#FFFFFF" : "#58A776"}
                stroke={
                  pathname === "/backoffice/report" ? "#58A776" : "#FFFFFF"
                }
              >
                <path d="M11 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V7M11 1L17 7M11 1V7H17M13 12H5M13 16H5M7 8H5" />
              </svg>

          </ButtomSidebar> */}

          <SubButtomSidebar

            label="Report"
            hoveraction={hoversidebar}
            data={[
                    {
                      label: "รายการปริมาณการเข้าใช้งาน",
                      urllink: "/backoffice/report/TrafficVolume",
                    },
                    {
                      label: "รายงาน List Account",
                      urllink: "/backoffice/report/ListAccount",
                    },
                    {
                      label: "รายงาน Account Details",
                      urllink: "/backoffice/report/AccountDetails",
                    },
                  ]}
          > 
           
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-[25px] h-[20px]"
              fill={(pathname === "/backoffice/report/TrafficVolume") || 
                (pathname === "/backoffice/report/ListAccount") ||
                (pathname.startsWith("/backoffice/report/AccountDetails/"))
                
                ? "#58A776" : "#FFFFFF"}
            >
              <path d="M11.3625 14.8033C12.3688 14.1348 13.1331 13.1601 13.5424 12.0235C13.9516 10.8869 13.9841 9.64875 13.635 8.49224C13.2859 7.33574 12.5737 6.32236 11.6039 5.60207C10.634 4.88178 9.45806 4.49286 8.25001 4.49286C7.04196 4.49286 5.866 4.88178 4.89617 5.60207C3.92633 6.32236 3.21416 7.33574 2.86503 8.49224C2.51591 9.64875 2.54838 10.8869 2.95766 12.0235C3.36693 13.1601 4.13125 14.1348 5.13751 14.8033C3.42092 15.4345 1.93883 16.5763 0.890635 18.0751C0.80876 18.1863 0.760027 18.3184 0.750072 18.4561C0.740118 18.5938 0.769349 18.7315 0.834385 18.8533C0.898652 18.9742 0.994453 19.0756 1.11163 19.1466C1.22882 19.2175 1.36302 19.2555 1.50001 19.2564H15C15.137 19.2555 15.2712 19.2175 15.3884 19.1466C15.5056 19.0756 15.6014 18.9742 15.6656 18.8533C15.7307 18.7315 15.7599 18.5938 15.7499 18.4561C15.74 18.3184 15.6913 18.1863 15.6094 18.0751C14.5612 16.5763 13.0791 15.4345 11.3625 14.8033Z" />
              <path d="M23.2595 18.075C22.2053 16.5781 20.7209 15.437 19.0032 14.8032C20.0127 14.1372 20.7802 13.1633 21.1916 12.0261C21.603 10.8889 21.6363 9.64931 21.2866 8.49167C20.9369 7.33403 20.2228 6.32021 19.2506 5.60102C18.2784 4.88182 17.1 4.49568 15.8907 4.50004C15.3746 4.50277 14.861 4.5721 14.3626 4.70629C14.2455 4.74145 14.1385 4.80401 14.0505 4.8888C13.9624 4.97358 13.8959 5.07813 13.8563 5.19379C13.8186 5.30849 13.8091 5.43061 13.8287 5.54976C13.8483 5.66891 13.8964 5.78157 13.9688 5.87816C14.8167 7.01739 15.3038 8.38452 15.3673 9.80323C15.4308 11.2219 15.0678 12.6271 14.3251 13.8375C14.2298 13.9984 14.1973 14.1887 14.2336 14.372C14.2699 14.5554 14.3726 14.7189 14.522 14.8313C14.8032 15.05 15.0751 15.275 15.3376 15.5063L15.3845 15.5532C16.3851 16.4792 17.197 17.5903 17.7751 18.825C17.8344 18.9541 17.9296 19.0633 18.0492 19.1398C18.1689 19.2162 18.3081 19.2567 18.4501 19.2563H22.6407C22.7777 19.2554 22.9119 19.2174 23.0291 19.1465C23.1463 19.0755 23.2421 18.9741 23.3063 18.8532C23.3706 18.7316 23.4002 18.5948 23.3919 18.4575C23.3837 18.3203 23.3378 18.188 23.2595 18.075Z" />
            </svg>

          </SubButtomSidebar>
      
          {/* Event log */}
          <ButtomSidebar
              labelButton="Event log"
              hrefButton="/backoffice/eventlog"
              showLabelWithDelay={showLabelWithDelay}
              hoversidebar={hoversidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 23"
                className="w-[25px] h-[20px]"
                fill={
                  pathname === "/backoffice/eventlog" ? "#58A776" : "#FFFFFF"
                }
              >
                <path d="M0 21.6667V2.16667H3.25V0H5.41667V2.16667H14.0833V0H16.25V2.16667H19.5V10.8333H17.3333V8.66667H2.16667V19.5H9.75V21.6667H0ZM17.3333 23.8333C16.0153 23.8333 14.8644 23.4228 13.8808 22.6016C12.8971 21.7804 12.2785 20.7466 12.025 19.5H13.7042C13.9389 20.2944 14.3859 20.9444 15.0453 21.45C15.7047 21.9556 16.4674 22.2083 17.3333 22.2083C18.3806 22.2083 19.2743 21.8382 20.0146 21.0979C20.7549 20.3576 21.125 19.4639 21.125 18.4167C21.125 17.3694 20.7549 16.4757 20.0146 15.7354C19.2743 14.9951 18.3806 14.625 17.3333 14.625C16.8097 14.625 16.3222 14.7196 15.8708 14.9088C15.4194 15.0981 15.0222 15.3646 14.6792 15.7083H16.25V17.3333H11.9167V13H13.5417V14.5438C14.0292 14.0743 14.5979 13.6998 15.2479 13.4203C15.8979 13.1408 16.5931 13.0007 17.3333 13C18.8319 13 20.1096 13.5283 21.1662 14.5849C22.2228 15.6415 22.7507 16.9188 22.75 18.4167C22.7493 19.9146 22.221 21.1922 21.1651 22.2495C20.1092 23.3068 18.8319 23.8348 17.3333 23.8333ZM2.16667 6.5H17.3333V4.33333H2.16667V6.5Z" />
              </svg>

          </ButtomSidebar>

        </div>

        <div className="text-sm xl:text-base w-full absolute bottom-10  flex flex-col justify-center items-center gap-2">
          <div className={`p-2 grid grid-cols-1 items-center gap-3`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-full h-[20px] stroke-2 stroke-linejoin-round stroke-linecap-round"
              fill={"#58A776"}
              stroke={"#FFFFFF"}
            >
              <path d="M10 11C11.6569 11 13 9.65685 13 8C13 6.34315 11.6569 5 10 5C8.34315 5 7 6.34315 7 8C7 9.65685 8.34315 11 10 11ZM10 11C12.761 11 15 12.79 15 15M10 11C7.239 11 5 12.79 5 15M4 1H16C17.6569 1 19 2.34315 19 4V16C19 17.6569 17.6569 19 16 19H4C2.34315 19 1 17.6569 1 16V4C1 2.34315 2.34315 1 4 1Z" />
            </svg>

            {hoversidebar && showLabelWithDelay && (
              <p className="w-full text-center text-white font-semibold">{name}</p>
            )}
          </div>

          <button
            className="max-w-[300px] bg-[#08D110] flex flex-row justify-center items-center gap-3 p-3 rounded-md shadow-md hover:bg-[#509654]"
            onClick={handleLogout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-[25px] h-[20px]"
              fill={"#FFFFFF"}
            >
              <path d="M10.0395 0C12.4187 0 14.3606 1.87393 14.4696 4.22624L14.4745 4.435V5.368C14.4745 5.78221 14.1387 6.118 13.7245 6.118C13.3448 6.118 13.031 5.83585 12.9813 5.46977L12.9745 5.368V4.435C12.9745 2.8721 11.7525 1.59426 10.2119 1.50498L10.0395 1.5H5.16447C3.60241 1.5 2.32472 2.72213 2.23545 4.26258L2.23047 4.435V15.565C2.23047 17.1278 3.45237 18.4057 4.99212 18.495L5.16447 18.5H10.0495C11.6068 18.5 12.8805 17.2824 12.9695 15.7478L12.9745 15.576V14.633C12.9745 14.2188 13.3103 13.883 13.7245 13.883C14.1042 13.883 14.418 14.1652 14.4676 14.5312L14.4745 14.633V15.576C14.4745 17.9472 12.6077 19.8831 10.2638 19.9949L10.0495 20H5.16447C2.78602 20 0.844309 18.1259 0.735296 15.7737L0.730469 15.565V4.435C0.730469 2.05594 2.60423 0.113862 4.95578 0.00482809L5.16447 0H10.0395ZM18.0345 6.48086L18.1188 6.55329L21.0468 9.46829C21.0732 9.49445 21.0963 9.52108 21.1175 9.54924L21.0468 9.46829C21.0774 9.4987 21.1047 9.53109 21.129 9.56505C21.1461 9.5888 21.1618 9.6139 21.1761 9.63994C21.1787 9.645 21.1813 9.64997 21.1839 9.65496C21.1966 9.67894 21.2078 9.70381 21.2177 9.72936C21.2217 9.74054 21.2258 9.75186 21.2296 9.76324C21.2369 9.78427 21.243 9.80591 21.2482 9.82793C21.2506 9.8397 21.253 9.85137 21.2552 9.86309C21.2593 9.88353 21.2623 9.90462 21.2644 9.92596C21.2655 9.94082 21.2665 9.95553 21.2671 9.97025C21.2678 9.98012 21.268 9.98999 21.268 9.9999L21.2671 10.0282C21.2666 10.0436 21.2655 10.059 21.264 10.0743L21.268 9.9999C21.268 10.0467 21.2637 10.0926 21.2555 10.1371C21.253 10.1482 21.2506 10.1599 21.2478 10.1715C21.2428 10.1947 21.2364 10.2172 21.229 10.2392C21.2252 10.2494 21.2215 10.2598 21.2175 10.27C21.2082 10.2949 21.1974 10.319 21.1854 10.3424C21.1824 10.3477 21.1792 10.3536 21.176 10.3595C21.1416 10.4228 21.0985 10.48 21.0483 10.5302L21.0469 10.5312L18.1189 13.4472C17.8254 13.7395 17.3505 13.7385 17.0583 13.445C16.7925 13.1782 16.7692 12.7615 16.9876 12.4684L17.0604 12.3844L18.6995 10.749L8.47697 10.7499C8.06276 10.7499 7.72697 10.4141 7.72697 9.9999C7.72697 9.6202 8.00912 9.30641 8.3752 9.25675L8.47697 9.2499L18.7015 9.249L17.0605 7.61631C16.7937 7.35064 16.7685 6.93403 16.9857 6.63993L17.0582 6.55565C17.3238 6.28879 17.7404 6.26366 18.0345 6.48086Z" />
            </svg>

            {hoversidebar && showLabelWithDelay && (
              <p className=" text-white font-semibold">Logout</p>
            )}
          </button>
        </div>
      </div>

      {/* <Modal title="แก้ไขข้อมูลผู้ใช้งาน" isOpen={isShow} onClose={handleCloseModal}>
                <div>
                    <div>ชื่อผู้ใช้งาน</div>
                    <input type="text" value={name}
                        onChange={(e) => setName(e.target.value)} className="form-control" />

                    <div className="mt-3">username</div>
                    <input type="text" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control" />

                    <div className="mt-3">รหัสผ่าน</div>
                    <input type="text"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control" />

                    <div className="mt-3">ยืนยันรหัสผ่าน</div>
                    <input type="text"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control" />

                    <div className="mt-3">
                        <button className="btn" onClick={handleSave}>
                            <i className="fa fa-save mr-2"></i>
                            บันทึก
                        </button>
                    </div>
                </div>
            </Modal> */}
    </div>
  );
}