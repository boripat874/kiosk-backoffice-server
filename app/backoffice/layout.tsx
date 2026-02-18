import Sidebar from "@/app/sidebar";

export default function BackOfficeLayout({ children }: {
    children: React.ReactNode
}) {
  return (
    <>
      <div className="flex">

          <Sidebar />

          <div className="content">

            {children}

          </div>

      </div>
    </>
  )
}
