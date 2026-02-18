import React from 'react'

interface Props {
  duration: string;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

export default function SeclectTime({ duration, setDuration , className}: Props) {
  return (
    <>
        <div className={`${className} text-[#2B5F60] border-[#2B5F60]  flex flex-row gap-2 items-center`}>
              
            <select 
            value={duration.split(":")[0]}
            className=' w-full border-1 rounded-lg p-2 h-[40px]'
            onChange={e => {

                const hour = e.target.value.padStart(2, "0");
                const minute = duration.split(":")[1] || "00";
                setDuration(`${hour}:${minute}`);

                // console.log(`${hour}:${minute}`);

            }}
            >
            {Array.from({ length: 23 }, (_, i) => {

            const timeHour = i + 1 > 9 ? `${i + 1}` : `0${i + 1}`;

            return (
                <option key={timeHour} value={timeHour}>
                {timeHour}
                </option>
            );
            
            })}
            </select>

            <span>:</span>

            <select 
            value={duration.split(":")[1]}
            className=' w-full border-1 rounded-lg p-2 h-[40px]'
            onChange={e => {

                const hour = duration.split(":")[0] || "00";
                const minute = e.target.value.padStart(2, "0");
                setDuration(`${hour}:${minute}`);

                // console.log(`${hour}:${minute}`);
                
            }}
            >
            <option  key={"00"} value={"00"}> {"00"} </option>

            {Array.from({ length: 59 }, (_, i) => {

                const timeHour = i + 1 > 9 ? `${i + 1}` : `0${i + 1}`;

                return (
                <option key={timeHour} value={timeHour}>
                    {timeHour}
                </option>
                );
            
            })}

            </select>
        </div>
    </>
  )
}
