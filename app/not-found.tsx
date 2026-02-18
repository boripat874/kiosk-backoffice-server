import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center gap-4   
      text-center '>
      <p className='text-2xl'>404 | ไม่มีหน้านี้อยู่ในระบบ</p>
      <Link href="/backoffice/dashboard">
        <button className='btn text-white font-bold py-2 px-4 rounded'>
          กลับไปหน้าแรก
        </button>
      </Link>
    </div>
  );
}