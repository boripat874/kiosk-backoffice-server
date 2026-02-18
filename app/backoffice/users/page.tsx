"use client"

import React, { useEffect, useState, useCallback } from 'react'
import Swal from "sweetalert2";
import axios from "axios";
import LoadingSpinner from "../../component/LoadingSpinner";
import { useRouter } from "next/navigation";
import Modal from "@/app/modal";
// import { format } from 'date-fns';
import Papa from 'papaparse'; // <--- Import Papaparse
import { formatDate } from 'date-fns';

// Define an interface for the expected user data structure from CSV (adjust based on your CSV columns)
interface CsvUserData {
  visitortype?: string; // Optional fields based on your CSV
  name: string;         // Required fields
  surname?: string;
  password?: string;     // Password might be required by API
  idcardnumber?: string;
  passportnumber?: string;
  phone?: string;
  expiredate?: string;
  // Add other fields expected from your CSV
}

// Define an interface for the user entry structure
interface UserEntry {
  id?: string | null; // Assuming id exists
  ugroupid?: string | null; // Add ugroupid if it's part of the user data
  visitortype?: string | null;
  routerid?: string | null;
  name?: string | null;
  surname?: string | null;
  user?: string | null;
  password?: string | null; // Might be present but often shouldn't be displayed/edited directly
  idcardnumber?: string | null;
  passportnumber?: string | null;
  phone?: string | null;
  create_at?: string | null;
  groupname?: string | null; // Add groupname if it comes with the user list
  expirationdate?: string | null;
  duration?: string | null;
  // Add other fields if they exist in the fetched user data
}

// Define an interface for the user group structure
interface UserGroupEntry {
  ugroupid: string | number;
  groupname: string | null;
}


export default function UsersPage() {

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCreate, setIsOpenCreate] = useState(false);
  const [isOpenImportCreate, setIsOpenImportCreate] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [date, setDate] = useState("-");
  const [isLoading, setIsLoading] = useState(false);
  const router =  useRouter();

  const [userGroups, setUserGroups] = useState<UserGroupEntry[]>([]);
  const [userslist, setUserslist] = useState<UserEntry[]>([]);
  const [search, setSearch] = useState("");


  const [visitortype, setVisitortype] = useState("");
  const [routerid, setRouterid] = useState("");
  const [userid, setUserid] = useState("");
  const [ugroupid, setGroupId] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [nationalidcard, setNationalidcard] = useState("");
  const [passportcard, setPassportcard] = useState("");
  const [phone, setPhone] = useState("");
  const [expiredate, setExpiredate] = useState("");
  // const [create_at, setCreate_at] = useState("");
  // const [expirationdate, setExpirationdate] = useState("");

  // const convertDate = (DateString: string) =>{

  //   if (DateString && typeof DateString === 'string') {
  //     const inputFormatString = DateString.replace(" ", "T");
  //     // inputFormatString will be "2025-04-28T16:59"
  //     return inputFormatString.toString();
  //   } else {
  //     return "";
  //   }
  
  // }

  useEffect(() => {
  
    const updateThaiDate = () => { // Renamed for clarity
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
    };

    updateThaiDate(); // Initial update
    fetchDataFirst();

    const intervalId = setInterval(updateThaiDate, 2000);

    return () => {
      clearInterval(intervalId);
    };

  },[])

  // Wrap fetchDataFirst in useCallback
  const fetchDataFirst = useCallback(async () => {
    setIsLoading(true);

    // await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 2ms
    try {

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/userslistall`,{
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            search: search
          }
      })
      .then((response) => {

        setUserslist(response.data.result);

      })

    } catch (error) {
      console.error("Error fetching user groups for import modal:", error);
    }

    setIsLoading(false);

  }, [search]);

  const handleOpenCreate = async() => {

    setIsLoading(true);

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groupuserslistall`,{
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      setUserGroups(response.data.result);
      setGroupId(response.data.result[0].ugroupid);
      // console.log(ugroupid);
    }).catch(error => {
      console.error(error);
    });


    setIsLoading(false);

    handleClear();
    setIsOpenCreate(true);
  };

  const handleOpenImportCreate = async() => {

    try {
      setIsLoading(true);

      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groupuserslistall`,{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserGroups(response.data.result);
      });
      setIsLoading(false);
      setIsOpenImportCreate(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOpenCreate(false);
    setIsOpenImportCreate(false);
  };

  const handleEdit = async(id: string) => {

    setIsLoading(true);

    const user = userslist.find((u: UserEntry) => u.id === id);

    if (user) {
      setVisitortype(user.visitortype || "");
      setRouterid(user.routerid || "");
      setUserid(user.id || "");
      setGroupId(user.ugroupid || "");
      setUser(user.user || "");
      setName(user.name || "");
      setSurname(user.surname || "");
      setPassword(user.password || "");
      setNationalidcard(user.idcardnumber || "");
      setPassportcard(user.passportnumber || "");
      setPhone(user.phone || "");
      setExpiredate(user.expirationdate || "");
      // setCreate_at(user.create_at || "");
    }

    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/groupuserslistall`,{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
    })
    .then((response) => {
      setUserGroups(response.data.result);
      
    });

    setIsLoading(false);

    setIsOpen(true);
  };

  const handleEditSave = async() => {

    setIsLoading(true);

    try {

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/usersupdate`,{
          "id": userid,
          "ugroupid": ugroupid,
          "routerid": routerid,
          "visitortype": visitortype,
          "name": name,
          "surname": surname,
          "Username" : user,
          "password": password,
          "idcardnumber": nationalidcard,
          "passportnumber": passportcard,
          "phone": phone,
          "expiredate": expiredate
        },
        {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        }
      )
      .then(() => {

        Swal.fire({
          icon: "success",
          title: "แก้ไขข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          fetchDataFirst();
        })

      })

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    setIsLoading(false);
    handleCloseModal();

  };

  // handle clear
  const handleClear = () => {

    setVisitortype("");
    setUserid("");
    // setGroupId("");
    setName("");
    setSurname("");
    setPassword("");
    setNationalidcard("");
    setPassportcard("");
    setPhone("");
    setExpiredate(formatDate(new Date(), "yyyy-MM-dd"));
    // setCreate_at("");

  };

  // handle add
  const handleCreate = async() => {
    setIsLoading(true);

    try {

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userscreate`,{
          // "userid": userid,
          "routerid": routerid,
          "ugroupid": ugroupid,
          "visitortype": visitortype,
          "name": name,
          "surname": surname,
          // "Username" : user,
          "password": password,
          "idcardnumber": nationalidcard,
          "passportnumber": passportcard,
          "phone": phone,
          "expiredate": expiredate
        },
        {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then(() => {

          Swal.fire({
            icon: "success",
            title: "เพิ่มข้อมูลสำเร็จ",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            setIsLoading(false);
            fetchDataFirst();
          })
          
        })  
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "กรุณาลองใหม่อีกครั้ง",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsLoading(false);
    }

    setIsLoading(false);
    handleCloseModal();

  }

  // --- Handle CSV Import Submission ---
  const handleImport = async(file: File | null, selectedGroupId: string) => {

    if (!file || !selectedGroupId) {
      Swal.fire({ icon: "warning", title: "ข้อมูลไม่ครบ", text: "กรุณาเลือกกลุ่มผู้ใช้และไฟล์ CSV" });
      return;
    }

    setIsLoading(true);

    try {
       // Use Papaparse to read and parse the CSV file
       Papa.parse<CsvUserData>(file, { // Use the interface for type safety
           header: true, // Assumes the first row is headers
           skipEmptyLines: true,
           complete: async (results) => {
               console.log("Parsed CSV Data:", results.data);
               // console.log("Parsing Errors:", results.errors);

               if (results.errors.length > 0) {
                   console.error("CSV Parsing Errors:", results.errors);
                   // Show more specific error if possible
                   const errorMessages = results.errors.map(err => `Row ${err.row}: ${err.message}`).join('\n');
                   Swal.fire({ icon: "error", title: "ข้อผิดพลาดในการอ่านไฟล์ CSV", text: `พบปัญหาในไฟล์:\n${errorMessages.substring(0, 200)}...` }); // Limit error message length
                   setIsLoading(false);
                   return;
               }

               if (!results.data || results.data.length === 0) {
                   Swal.fire({ icon: "warning", title: "ไฟล์ว่างเปล่า", text: "ไม่พบข้อมูลผู้ใช้ในไฟล์ CSV ที่เลือก" });
                   setIsLoading(false);
                   return;
               }

               // ตรวจสอบ expiredate format
                const invalidRows = results.data.filter(
                  (row) =>
                    row.expiredate &&
                    !/^\d{4}-\d{2}-\d{2}$/.test(row.expiredate.trim())
                );

                if (invalidRows.length > 0) {
                  Swal.fire({
                    icon: "error",
                    title: "รูปแบบวันหมดอายุไม่ถูกต้อง",
                    text: `กรุณาใช้รูปแบบ yyyy-mm-dd`,
                  });
                  setIsLoading(false);
                  return;
                }

               // --- Prepare data for the API ---
               // Assuming your API expects an object like: { ugroupid: "...", userslist: [...] }
               // Adjust the 'userslist' array structure based on your API requirements
               const apiPayload = {
                   ugroupid: selectedGroupId,
                   users: results.data.map(row => ({
                       // Map CSV columns (keys from PapaParse with header:true) to API fields
                       visitortype: row.visitortype || "", // Provide defaults if needed
                       name: row.name || "",             // Ensure required fields exist
                       surname: row.surname || "",
                       password: row.password || "",       // Ensure password is included if required by API
                       idcardnumber: row.idcardnumber || "",
                       passportnumber: row.passportnumber || "",
                       phone: row.phone || "",
                       expiredate: row.expiredate || "",
                       // Add other necessary fields expected by your API
                   })).filter(user => user.name) // Example: Filter out rows without a name
               };

               // console.log("API Payload:", apiPayload);

               // --- Send data to the API ---
               try {
                   // *** Replace with your actual import endpoint ***
                   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/usersimport`, apiPayload, {
                      headers: {
                         'Content-Type': 'application/json', // Send as JSON
                         "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                         "Authorization": `Bearer ${localStorage.getItem("token")}`,
                      },
                   });

                   // Assuming API returns success message or count
                   // console.log("API Response:", response.data);
                   Swal.fire({ icon: "success", title: "นำเข้าข้อมูลสำเร็จ", 
                    text: response.data?.message || `${apiPayload.users.length} ผู้ใช้ถูกนำเข้าเรียบร้อยแล้ว`, 
                    showConfirmButton: false ,
                    timer: 1000

                  }); // Show confirm button for success
                   fetchDataFirst(); // Refresh the user list
                   handleCloseModal(); // Close the import modal

               } catch (apiError) {
                   console.error("Error sending data to API:", apiError);
                   let errorMessage = "เกิดข้อผิดพลาดระหว่างการส่งข้อมูลไปยังเซิร์ฟเวอร์";
                   if (axios.isAxiosError(apiError) && apiError.response?.data?.message) {
                       errorMessage = apiError.response.data.message; // Use server's error message if available
                   }
                   Swal.fire({ icon: "error", title: "นำเข้าข้อมูลล้มเหลว", text: errorMessage });
                  //  if (axios.isAxiosError(apiError) && apiError.response?.status === 401) {
                  //     router.push('/login');
                  //  }
               } finally {
                  setIsLoading(false); // Ensure loading is turned off after API call attempt
               }
           },
           error: (error: Error) => {
               console.error("Error reading file:", error);
               Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "ไม่สามารถอ่านไฟล์ที่เลือกได้" });
               setIsLoading(false);
           }
       });

    } catch (error) {
       // Catch unexpected errors during setup
       console.error("Unexpected error during import setup:", error);
       Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: "กรุณาลองใหม่อีกครั้ง" });
       setIsLoading(false);
    }
    // Note: setIsLoading(false) is handled within the Papa.parse callbacks (complete/error)
 }
 
  // handle delete
  const handleDelete = async(id: string) => {

    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบผู้ใช้งานนี้หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/usersdelete`,{
              "id": id
            },
            {
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
                  "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {

              Swal.fire({
                icon: "success",
                title: "ลบข้อมูลสำเร็จ",
                showConfirmButton: false,
                timer: 1000,

              }).then(() => {

                fetchDataFirst();

              })

            })  
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "กรุณาลองใหม่อีกครั้ง",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  
  }

  // animation load
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div>

        {/* header */}
        <div className="w-full flex flex-col justify-between items-start">
          <p className="text-4xl pt-4 font-bold">Users</p>
          <p className="text-lg pt-2">{date}</p>
        </div>

        {/* table */}
        <div className="w-full min-h-[820px] bg-white mt-2 p-4 rounded-lg shadow-md">

          {/* header table */}
          <div className="flex flex-row justify-between items-center text-white">
            <div className="flex flex-row justify-between items-center p-4">
              <p className="text-2xl font-bold text-[#2B5F60]">
                รายการผู้เข้าใช้งาน
              </p>
            </div>

            {/* <div className='p-4'>
                <button className='btn' onClick={handleOpenCreate}> <i className="fa-solid fa-plus"></i> เพิ่มร้านค้า</button>
              </div> */}

            <div className="p-4 flex flex-col-reverse xl:flex-row items-start justify-center gap-2">


              {/* <button
                className="btn w-[230px] flex flex-row items-center justify-center gap-x-3"
                onClick={() => {
                  router.push("/backoffice/users/administrator");
                }}
              >
                <i className="fa-solid fa-user"></i>
                <p>จัดการ Administrator</p>
              </button> */}

              <button
                className="btn w-[190px] flex flex-row items-center justify-center gap-x-3"
                onClick={() => {
                  router.push("/backoffice/users/groupuser");
                }}
              >
                <i className="fa-solid fa-user-group"></i>
                <p>จัดการกลุ่มผู้ใช้</p>
              </button>

              <button
                className="btn w-[190px] flex flex-row items-center justify-center gap-x-3"
                onClick={() => {
                  handleOpenCreate();
                }}
              >
                <i className="fa-solid fa-plus"></i> เพิ่มผู้เข้าใช้งาน
              </button>

              <button
                className="btn w-[130px] flex flex-row items-center justify-center gap-x-3"
                onClick={() => {
                  handleOpenImportCreate();
                }}
              >
                <i className="fa-solid fa-file-import"></i> Import
              </button>

              <div className="w-[300px] relative ">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                <input
                  type="text"
                  placeholder="Search for users..."
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
            <table className="min-w-[1536px] 2xl:w-full p-4 table-auto text-center ">
              <thead className="border-b border-[#2B5F60] bg-white sticky top-0">
                <tr>
                  <th className="h-12 w-[100px]">วันที่ขอเข้าใช้งาน</th>
                  <th className="h-12 w-[100px]">ประเภทผู้มาติดต่อ</th>
                  <th className="h-12 w-[100px]">กลุ่มผู้ใช้</th>
                  <th className="h-12 w-[100px]">ชื่อ นามสกุล</th>
                  <th className="h-12 w-[100px]">บัตรประชาชน</th>
                  <th className="h-12 w-[100px]">พาสปอร์ต</th>
                  <th className="h-12 w-[100px]">เบอร์โทร</th>
                  <th className="h-12 w-[100px]">เวลาหมดอายุ</th>
                  <th className="h-12 w-[100px]">Action</th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(userslist) && userslist.length > 0 ? (
                  userslist.map((user: UserEntry) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="h-12 w-[100px]">{user.create_at}</td>
                      <td className="h-12 w-[100px]">{user.visitortype}</td>
                      <td className="h-12 w-[100px]">{user.groupname}</td>
                      <td className="h-12 w-[100px]">
                        {user.name} {user.surname}
                      </td>
                      <td className="h-12 w-[100px]">{user.idcardnumber}</td>
                      <td className="h-12 w-[100px]">{user.passportnumber}</td>
                      <td className="h-12 w-[100px]">{user.phone}</td>
                      <td className='h-12 w-[100px]'>{user.expirationdate}</td>

                      <td className="h-12 w-[100px]">
                        <button
                          className="btn-edit mr-2"
                          onClick={() => handleEdit(user.id as string)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user.id as string)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="h-96 text-center text-lg text-gray-500"
                    >
                      ไม่พบข้อมูลผู้เข้าใช้งาน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* แก้ไข */}
      <Modal
        title="แก้ไขผู้เข้าใช้งาน"
        isOpen={isOpen}
        onClose={handleCloseModal}
      >
        <div className="w-[300px] md:w-[700px] flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 w-full min-h-[300px] overflow-y-auto">
            
            <div>
              <div>กลุ่มผู้ใช้</div>
              <select
                className="w-full h-[42px] border border-[#2B5F60] rounded-md p-2 mb-2"
                defaultValue={ugroupid}
                onChange={(e) => setGroupId(e.target.value)}
              >
                {Array.isArray(userGroups) && userGroups.length > 0 ? (
                  userGroups.map((usergroup: UserGroupEntry) => (
                    <option key={usergroup.ugroupid} value={usergroup.ugroupid}>
                      {usergroup.groupname}
                    </option>
                  ))
                ) : (
                  <option value="">ไม่มีข้อมูลกลุ่มผู้ใช้</option> // Fallback if group array is empty
                )}
              </select>

            </div>

            <div>
              <div>ประเภทผู้มาติดต่อ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                value={visitortype}
                onChange={(e) => setVisitortype(e.target.value)}
                placeholder='กรุณากรอกประเภทผู้มาติดต่อ'
              />

            </div>

            <div>
              <div>ชื่อ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='กรุณากรอกชื่อ'
              />

            </div>

            <div>
              <div>นามสกุล <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder='กรุณากรอกนามสกุล'
              />

            </div>

            <div>
              <div>บัตรประชาชน</div>
              <input
                className="mb-2 p-2"
                type="text"
                value={nationalidcard}
                onChange={(e) => setNationalidcard(e.target.value)}
                placeholder='กรุณากรอกบัตรประชาชน'
              />

            </div>

            <div>
              <div>พาสปอร์ต</div>
              <input
                className="mb-2 p-2"
                type="text"
                value={passportcard}
                onChange={(e) => setPassportcard(e.target.value)}
                placeholder='กรุณากรอกพาสปอร์ต'
              />

            </div>

            <div>
              <div>เบอร์โทรศัพท์</div>
              <input
                className="mb-2 p-2"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='กรุณากรอกเบอร์โทรศัพท์'
              />

            </div>

            {/* <div>เวลาหมดอายุ</div>
            <input 
              className="mb-2 p-2" 
              type="datetime-local" 
              value={expirationdate}
              onChange={(e) => {
                // console.log(e.target.value);
                // console.log(expirationdate);
                setExpirationdate(e.target.value)
              }}
            />     */}

            <div>
              <div>Password <span className="text-red-500">*</span></div>
              <div className="relative">
                <input
                  className="w-full p-2 border border-[#2B5F60] rounded-md"
                  type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='กรุณากรอกรหัสผ่าน'
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible ? (
                    <i className="fa-solid fa-eye-slash"></i> // Eye-slash icon for hidden
                  ) : (
                    <i className="fa-solid fa-eye"></i> // Eye icon for visible
                  )}
                </button>
              </div>

            </div>

            <div>
              <div>เวลาหมดอายุ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="date"
                value={expiredate}
                onChange={(e) => setExpiredate(e.target.value)}
              />
            </div>


          </div>

          <div className="mt-2 border-t border-[#2B5F60] pt-2">
            <button className="btn mr-2" onClick={handleEditSave}>
              <i className="fa-solid fa-save mr-2"></i>
              บันทึก
            </button>
          </div>
        </div>
      </Modal>

      {/* สร้าง */}
      <Modal
        title="เพิ่มผู้เข้าใช้งาน"
        isOpen={isOpenCreate}
        onClose={handleCloseModal}
      >
        <div className="w-[300px] md:w-[700px] flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 w-full min-h-[300px] overflow-y-auto">

            <div>
              <div>กลุ่มผู้ใช้ <span className="text-red-500">*</span></div>
              <select
                className="w-full h-[42px] border border-[#2B5F60] rounded-md p-2 mb-2"
                onChange={(e) => setGroupId(e.target.value)}
              >
                {Array.isArray(userGroups) && userGroups.length > 0 ? (
                  userGroups.map((usergroup: UserGroupEntry) => (
                    <option key={usergroup.ugroupid} value={usergroup.ugroupid}>
                      {usergroup.groupname}
                    </option>
                  ))
                ) : (
                  <option value="">ไม่มีข้อมูลกลุ่มผู้ใช้</option> // Fallback if group array is empty
                )}
              </select>

            </div>

            <div>
              <div>ประเภทผู้มาติดต่อ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                onChange={(e) => setVisitortype(e.target.value)}
                placeholder="กรุณากรอกประเภทผู้มาติดต่อ"
              />

            </div>

            <div>
              <div>ชื่อ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="กรุณากรอกชื่อ"
              />

            </div>

            <div>
              <div>นามสกุล <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="text"
                onChange={(e) => setSurname(e.target.value)}
                placeholder="กรุณากรอกนามสกุล"
              />

            </div>

            <div>
              <div>บัตรประชาชน</div>
              <input
                className="mb-2 p-2"
                type="text"
                onChange={(e) => setNationalidcard(e.target.value)}
                placeholder="กรุณากรอกบัตรประชาชน"
              />
            </div>

            <div>
              <div>พาสปอร์ต</div>
              <input
                className="mb-2 p-2"
                type="text"
                onChange={(e) => setPassportcard(e.target.value)}
                placeholder="กรุณากรอกพาสปอร์ต"
              />
            </div>

            <div>
              <div>เบอร์โทรศัพท์ </div>
              <input
                className="mb-2 p-2"
                type="text"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="กรุณากรอกเบอร์โทรศัพท์"
              />
            </div>

            {/* <div>เวลาหมดอายุ</div>
            <input 
              className="mb-2 p-2" 
              type="datetime-local" 
              // value={convertDate(expirationdate).toString()}
              onChange={(e) => setExpirationdate(e.target.value)}
            />  */}

            {/* <div>User</div> */}
            {/* <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /> */}

            <div>
              <div>Password <span className="text-red-500">*</span></div>
              <div className="relative">
                <input
                  className="w-full p-2 border border-[#2B5F60] rounded-md"
                  type={isPasswordVisible ? "text" : "password"} // Toggle between text and password
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรุณากรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {isPasswordVisible ? (
                    <i className="fa-solid fa-eye-slash"></i> // Eye-slash icon for hidden
                  ) : (
                    <i className="fa-solid fa-eye"></i> // Eye icon for visible
                  )}
                </button>
              </div>

            </div>

            <div>
              <div>เวลาหมดอายุ <span className="text-red-500">*</span></div>
              <input
                className="mb-2 p-2"
                type="date"
                value={expiredate}
                onChange={(e) => setExpiredate(e.target.value)}
              />
            </div>

          </div>

        </div>
        <div className="mt-2 pt-2 border-t border-[#2B5F60]">
          <button className="btn mr-2" onClick={handleCreate}>
            <i className="fa-solid fa-plus mr-2"></i>
            เพิ่ม
          </button>
        </div>
      </Modal>

      {/* Import Modal - Pass the handler */}
      <ImportModal
        isOpen={isOpenImportCreate}
        onClose={handleCloseModal}
        onImportSubmit={handleImport} // <--- Pass the new handler
        userGroups={userGroups} // Pass fetched groups
        isLoading={isLoading} // Pass loading state
      />
      {/* End Modals */}
    </>
  );
}

// --- Separate Import Modal Component (No changes needed here) ---
interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSubmit: (file: File | null, groupId: string) => void; // Keep the signature
  userGroups: UserGroupEntry[];
  isLoading: boolean;
}

function ImportModal({ isOpen, onClose, onImportSubmit, userGroups, isLoading }: ImportModalProps) {

const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [selectedGroupId, setSelectedGroupId] = useState<string>("");

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
  setSelectedFile(event.target.files[0]);
  } else {
  setSelectedFile(null);
}
};

const handleSubmit = async() => {
// Call the passed handler with the current state
onImportSubmit(selectedFile, selectedGroupId);
};

// Reset state when modal closes
useEffect(() => {
  if (!isOpen) {
    setSelectedFile(null);
    setSelectedGroupId("");
  }else{
    if (userGroups.length > 0) setSelectedGroupId(String(userGroups[0].ugroupid)); 
  }
}, [isOpen]);


return (
  <Modal title="นำเข้าผู้ใช้จาก CSV" isOpen={isOpen} onClose={onClose}>
    <div className="flex flex-col gap-4 p-1">
      <div>
        <label htmlFor="import-group" className="block mb-1 font-medium">
          เลือกกลุ่มผู้ใช้
        </label>
        <select
          id="import-group"
          className="w-full p-2 border rounded mb-3 bg-white"
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          required
          disabled={isLoading} // Disable while loading groups/submitting
        >
          {/* <option value="" disabled>
            -- เลือกกลุ่มที่จะนำเข้า --
          </option> */}
          {Array.isArray(userGroups) &&
            userGroups.map((group: UserGroupEntry) => (
              <option key={group.ugroupid} value={group.ugroupid}>
                {group.groupname}
              </option>
            ))}
          {userGroups.length === 0 && !isLoading && (
            <option value="" disabled>
              ไม่พบกลุ่มผู้ใช้
            </option>
          )}
          {isLoading && (
            <option value="" disabled>
              กำลังโหลดกลุ่ม...
            </option>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="import-file" className="block mb-1 font-medium">
          เลือกไฟล์ CSV
        </label>
        <input
          id="import-file"
          className="w-full p-2 border rounded mb-3 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#e0f6f7] file:text-[#2B5F60] hover:file:bg-[#919999] disabled:opacity-50" // Basic file input styling
          type="file"
          accept=".csv, text/csv"
          onChange={handleFileChange}
          required
          disabled={isLoading} // Disable while submitting
        />
        {selectedFile && (
          <p className="text-sm text-[#2B5F60] mt-1">
            ไฟล์ที่เลือก: {selectedFile.name}
          </p>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-[#2B5F60] flex justify-start">
        <button
          className="btn"
          onClick={()=> {
            console.log("onClick")
            handleSubmit();
          }} // Calls the internal handler which calls the prop
          disabled={!selectedFile || !selectedGroupId || isLoading} // Disable if no file/group or loading
        >
          {isLoading && (
            <LoadingSpinner />
          )}
          นำเข้า
        </button>
      </div>
    </div>
  </Modal>
);
}

 