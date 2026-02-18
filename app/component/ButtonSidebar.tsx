import React from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";


interface ButtonSidebarProps {
  labelButton: string;
  hrefButton: string;
  children: React.ReactNode;
  showLabelWithDelay?: boolean;
  hoversidebar?: boolean;
  className?: string;
}

export default function ButtonSidebar({
    labelButton,
    hrefButton,
    showLabelWithDelay,
    hoversidebar,
    // className,
    children,
}: ButtonSidebarProps) {

    const pathname = usePathname(); // ดึง URL ปัจจุบัน
 
  return (
    <>
        <div
            className={` w-full h-[44px] rounded-[10px] bg-[#58A776] hover:border-b-2 border-[#96db9a] text-white ${
              pathname === hrefButton ? "shadow-md" : "shadow-none"
            }`}
        >
        <Link
            className={`
           
            ${
                pathname === hrefButton
                ? "bg-white text-[#58A776] "
                : "bg-[#58A776] text-white"
            }  h-full py-2  
            ${showLabelWithDelay ? "pl-2 xl:pl-4 " : "pl-4 xl:pl-7"} 
            rounded-md flex  items-center  gap-3 font-semibold
            `}
            href={hrefButton}
        >
            {children}

            {hoversidebar && (
            <p className="text-sm xl:text-base font-semibold">
                {showLabelWithDelay && labelButton}
            </p>
            )}

            {/* {isLoading && <SidebarLoadingspinner size="small" color="#58A776" />} */}
        </Link>
        </div>
    </>
  )
}
