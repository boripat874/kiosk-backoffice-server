import React from 'react'
// import Image from 'next/image'


// interface Shop {
//   shopid: string;
//   shopnameth: string;
// }


interface SelectdateProps {
  timestart?: string;
  timeend?: string;
  period?: string;
  periodRef: {
    current: string;
  };
  timestartRef?: {
    current: string;
  };
  timeendRef?: {
    current: string;
  };
  onChangePeriod: (value: string) => void;
  onChangeTimestart: (value: string) => void;
  onChangeTimeend: (value: string) => void;
}

export default function Selectdate({
    timestart,
    timeend,
    period,
    periodRef,
    onChangePeriod,
    onChangeTimestart,
    onChangeTimeend,
}:SelectdateProps) {

  return (
    <div className="w-full flex flex-col md:flex-row  justify-between md:justify-start items-top gap-2">
      {/* เลือกช่วงเวลา */}
      <div className="w-[160px]  xl:w-[180px] h-[40px] xl:h-[40px]">
        <select
          className="w-full h-full text-[14px] xl:text-[16px] rounded-md border-[#009f4d] px-2 border bg-white text-black"
          onChange={(e) => {
            onChangePeriod(e.target.value);
            periodRef.current = e.target.value;
          }}
          value={period}
        >
          <option value="today">วันนี้</option>
          <option value="thisweek">สัปดาห์นี้</option>
          <option value="thismonth">เดือนนี้</option>
          <option value="thisyear">ปีนี้</option>
          <option value="bydate">เลือกวันที่</option>

        </select>
      </div>

      {periodRef.current === "bydate" && (
        
        <div className='flex md:flex-row items-center gap-1'>

          <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-x-2 gap-y-1 md:gap-y-0">
            <p className="text-right text-[14px] lg:text-[16px] w-[80px]">เริ่มต้น</p>
            <input
              type="date"
              className="text-[14px] xl:text-[16px] h-[40px] w-[180px] md:w-[120px] xl:w-[140px] rounded-md border-[#009f4d] px-2 border text-black"
              // value={(new Date()).toISOString().split('T')[0]}
              value={timestart}
              onChange={(e) =>{

                if (new Date(e.target.value) > new Date(timeend || new Date().toISOString().split("T")[0])) {
                  onChangeTimestart(e.target.value);
                  onChangeTimeend(e.target.value)
                }else{

                  onChangeTimestart(e.target.value);
                }
                // onChangeTimestart && onChangeTimestart("1970-01-01");
                // console.log(e.target.value);
              }
                
              }
            />
          </div>

          <div className="flex flex-col md:flex-row justify-start items-start md:items-center gap-x-2 gap-y-1 md:gap-y-0">
            <p className="text-right text-[14px] lg:text-[16px]  w-[80px]">สิ้นสุด</p>
            <input
              type="date"
              className="text-[14px] xl:text-[16px] h-[40px] w-[180px] md:w-[120px] xl:w-[140px] rounded-md border-[#009f4d] px-2 border text-black"
              // value={(new Date()).toISOString().split('T')[0]}
              value={timeend}
              onChange={(e) =>{
                
                if(new Date(e.target.value) < new Date(timestart || new Date().toISOString().split("T")[0])) {
                  onChangeTimestart(e.target.value);
                  onChangeTimeend(e.target.value)
                }else{
                  onChangeTimeend(e.target.value)
                }
              }}
            />
          </div>

        </div>
        
      )}
    </div>
  );
}
