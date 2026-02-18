
import Link from "next/link"
import React, { useState, useEffect, useRef } from 'react';
// import Image from "next/image"; // Import the Image component
import { usePathname } from 'next/navigation'; // Import usePathname
import { BiChevronUp , BiChevronDown } from "react-icons/bi";
// import IconSVG from "@/public/icons/icon.svg"; // ปรับ path ให้ตรงกับตำแหน่งไฟล์ .svg

interface ButtomSidebardata{
  label:string
  urllink:string
}

interface ButtomSidebarProps {
  countShow?: number
  label: string
  data: Array<ButtomSidebardata>
  hoveraction?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

function SubButtomSidebar( {countShow,label,data ,hoveraction , children , onClick}: ButtomSidebarProps , ) {
  const [showLabelWithDelay, setShowLabelWithDelay] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false); // State to control sub-menu visibility on click
  const labelTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentPathname = usePathname(); // Get current pathname
  const [isMobile, setIsMobile] = useState(true);

  const [status, setStatus] = useState(false);

  
  useEffect(() => {
    // Check screen size
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
    
  const LABEL_DISPLAY_DELAY = isMobile ? 0 : 400;

  // const router = useRouter();

  useEffect(() => {

    if (hoveraction) {

      // If sidebar is intended to be expanded (hoveraction is true)
      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
      }
      labelTimerRef.current = setTimeout(() => {
        setShowLabelWithDelay(true);
      }, LABEL_DISPLAY_DELAY);

    } else {

      // If sidebar is intended to be collapsed (hoveraction is false)
      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
      }
      setIsSubMenuOpen(false); // Close sub-menu when sidebar collapses
      setShowLabelWithDelay(false); // Hide label immediately

    }

    // Cleanup function to clear the timer if the component unmounts or hoveraction changes
    return () => {

      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
      }
      
    };
  }, [hoveraction]); // Re-run this effect whenever hoveraction changes

  useEffect( () => {

    for (let index = 0; index < (data.length); index++) {
      if(currentPathname.startsWith(data[index].urllink)){
        setStatus(true);
        return;
      }else{
        setStatus(false);
      }
    
    }
   
  }, [currentPathname]);

  const handleButtonClick = () => {

    // data.forEach(element => {
    //   if(currentPathname !== element.urllink){
    //     router.push(data[0].urllink);
    //   }

    // });

    // if(currentPathname !== "/backoffice/report/TrafficVolume" && currentPathname !== "/backoffice/report/ListAccount"){
                  
    //   router.push("/backoffice/report/TrafficVolume");
    // }

    if (onClick) {
      onClick(); // Call the parent's onClick (e.g., to set status)
    }

    if (hoveraction) { // Only toggle sub-menu if sidebar is expanded
      setIsSubMenuOpen(!isSubMenuOpen);
    }
  };

  return (
    <div className={`relative w-full ${status ? "bg-white" : " bg-[#58A776]"} md:rounded-tl-lg md:rounded-bl-lg rounded-tl-xl rounded-bl-xl flex flex-col justify-start`}>

      <button
      
        onClick={handleButtonClick} // Use the new handler

        className={`relative w-full h-[44px] hover:border-b-2 border-[#96db9a] md:rounded-tl-lg md:rounded-bl-lg rounded-tl-xl rounded-bl-xl ${
          status ? "bg-white" : " bg-[#58A776]"
        } flex items-center justify-between pr-2`}
      >

        {/* <Link href={urllink}> */}
        <div className="flex items-center">
          {/* ไอคอน */}
          <div
            className={`h-full py-2  
            ${showLabelWithDelay ? "pl-2 xl:pl-4 " : "pl-4 xl:pl-7"} 
            rounded-md flex  items-center  gap-3 font-semibold`}
          >
            {children}
          </div>
          {showLabelWithDelay ? (
            <span
              className={`ml-8 md:ml-2 xl:ml-4 text-[16px] md:text-[10px] xl:text-sm font-semibold ${
                status ? "text-[#3DA48F]" : "text-white"
              }`}
            >
              {label}
            </span>
          ) : null}
        </div>

        {showLabelWithDelay ? (
          isSubMenuOpen ? (
            <BiChevronUp
              size={25}
              className={`ml-2 ${status ? "text-white" : "text-[#3DA48F]"}`}
            />
          ) : (
            <BiChevronDown
              size={25}
              className={`ml-2 ${status ? "text-white" : "text-[#3DA48F]"}`}
            />
          )
        ) : null}

        {/* </Link> */}

        {/* บน */}
        {/* <div
            className={`absolute -top-[18px] -right-[1px] ${
              status ? "block" : "hidden"
            }`}
          >
            <Image
              src="/sidebar/vectorPathTop.svg" // ตัวอย่างไฟล์ .svg สำหรับส่วนบน
              alt="top icon"
              // className="w-[20px] h-[20px]"
              width={20} // Add width prop
              height={20} // Add height prop
            />
          </div> */}

        {/* ล่าง */}
      </button>
      
      {/* Render sub-links only if sidebar is hovered AND sub-menu is open */}
      {hoveraction &&
        isSubMenuOpen && // Removed showLabelWithDelay from this condition as it's for the main button label
        showLabelWithDelay &&
        // status &&
        data?.map((item, index) => {

          if(index === (countShow ?? data.length)-1){
            return;
          }

          return(
          // Using a div here as the button handles the click for toggling.
          // The Link component inside handles navigation.
          <div key={index} className="w-full flex flex-col justify-start items-start">
            <Link
              href={item.urllink}
              className={`text-[16px] md:text-[10px] xl:text-sm flex items-center justify-center w-full h-[35px] xl:h-[45px] md:rounded-bl-lg rounded-bl-xl
                ${
                  currentPathname === item.urllink
                    ?  "text-[#58A776] bg-white" // Active link style
                    : "text-white bg-[#077a33]"// Default and hover style
                }`}
            >
              {item.label}
            </Link>
          </div>
        )
        })}
    </div>
  );
}

export default SubButtomSidebar