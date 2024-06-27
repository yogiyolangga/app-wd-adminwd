import { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import Loading from "./Loading";

import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import { PiHandCoinsFill } from "react-icons/pi";
import { BiLoaderCircle } from "react-icons/bi";
import { FaSort } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { ImCloudUpload } from "react-icons/im";

import TotalWdAgent from "./TotalWdAgent";

export default function DataProcessSuperAdmin() {
  const [dataDetails, setDataDetails] = useState(false);
  const [evidencePath, setEvidencePath] = useState("");
  const [idDetail, setIdDetail] = useState();
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userAdminWd");
  const token = localStorage.getItem("tokenAdminWd");
  const role = localStorage.getItem("roleAdminWd");
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [dataWdFromDb, setDataWdFromDb] = useState([]);

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (role != "administrator") {
      alert("You can't access this page");
      navigate("/");
    }
  }, []);

  const getDataWdFromDb = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const response = await Axios.get(`${apiUrl}/adminwd/datawd`);
      if (response.data.success) {
        setDataWdFromDb(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get data wd from db");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdminData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const response = await Axios.get(
        `${apiUrl}/adminwd/dataadmin/${userLogin}`
      );
      if (response.data.success) {
        setFullname(response.data.result[0].fullname);
        setProfilePic(response.data.result[0].profile);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get operator agent data");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminData();
    getDataWdFromDb();
  }, []);

  useEffect(() => {
    // Function to handle the escape key event
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setDataDetails(false); // Set state to false when Escape is pressed
        setEvidencePath("");
      }
    };

    // Add event listener to the window
    window.addEventListener("keydown", handleKeydown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []); // Empty dependency array means this effect runs only on mount and unmount

  const rupiah = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <>
      <div className="relative bg-white w-full max-w-[90%]  min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header fullname={fullname} profilePic={profilePic} />
        <Sidebar />
        <div>
          <Data
            setDataDetails={setDataDetails}
            setIdDetail={setIdDetail}
            dataWdFromDb={dataWdFromDb}
            loading={loading}
            rupiah={rupiah}
            apiUrl={apiUrl}
            getAdminData={getAdminData}
            getDataWdFromDb={getDataWdFromDb}
            setDataWdFromDb={setDataWdFromDb}
            userLogin={userLogin}
          />
        </div>
        <div className="px-6 mx-auto">
          <TotalWdAgent dataWdFromDb={dataWdFromDb} />
        </div>
      </div>
      <div
        className={`${
          dataDetails ? "flex" : "hidden"
        } fixed min-w-full min-h-screen top-0 justify-center bg-zinc-800 bg-opacity-30 backdrop-blur-sm items-center z-10`}
      >
        <DataDetails
          setDataDetails={setDataDetails}
          dataWdFromDb={dataWdFromDb}
          idDetail={idDetail}
          rupiah={rupiah}
          fullname={fullname}
          apiUrl={apiUrl}
          setEvidencePath={setEvidencePath}
          evidencePath={evidencePath}
          getDataWdFromDb={getDataWdFromDb}
        />
      </div>
    </>
  );
}

const Data = ({
  setDataDetails,
  setIdDetail,
  dataWdFromDb,
  loading,
  rupiah,
  apiUrl,
  getDataWdFromDb,
  userLogin,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [byStatusData, setByStatusData] = useState([]);
  const [statusData, setStatusData] = useState("all");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const filtered = dataWdFromDb.filter((item) => item.status != "pulled");
    setByStatusData(filtered);
  }, [dataWdFromDb]);

  const handleFilterByStatus = (status) => {
    if (status === "all") {
      const filtered = dataWdFromDb.filter((item) => item.status != "pulled");
      setByStatusData(filtered);
      setStatusData(status);
    } else {
      const filtered = dataWdFromDb.filter((item) => item.status === status);
      setByStatusData(filtered);
      setStatusData(status);
    }
  };

  const filteredData = byStatusData.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();

    const fieldsToFilter = [
      item.agent_name,
      item.member_username,
      item.account_name,
      item.bank_name,
      item.account_number,
      item.nominal,
      item.admin_name,
    ];

    return fieldsToFilter.some((value) => {
      if (value === null || value === undefined) {
        return false;
      }
      return value.toString().toLowerCase().includes(searchTermLower);
    });
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentData = sortedData.slice(firstPostIndex, lastPostIndex);

  const totalPages = Math.ceil(byStatusData.length / postPerPage);

  const [maxPagesToShow] = useState(5);

  const getPageNumbers = () => {
    let pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        // Jika halaman saat ini di awal (1, 2, 3, ...)
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > maxPagesToShow) {
          pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman lebih lanjut
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        // Jika halaman saat ini di akhir (..., 98, 99, 100)
        pageNumbers.push(1);
        pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman sebelumnya
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Jika halaman saat ini di tengah (misalnya 6, 7, 8, ..., 95, 96, 97)
        pageNumbers.push(1);
        pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman sebelumnya

        // Menentukan range halaman sebelum dan sesudah currentPage
        const startPage = currentPage - 1;
        const endPage = currentPage + 1;

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman lebih lanjut
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePostPerPage = (value) => {
    setPostPerPage(value);
    setCurrentPage(1);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all filtered items
      setSelectedItems(currentData.map((item) => item.data_wd_id));
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    // Update select all checkbox status based on filtered data and selected items
    if (
      filteredData.length > 0 &&
      selectedItems.length === currentData.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [filteredData, selectedItems]);

  const handleCheckboxChange = (data_wd_id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(data_wd_id)) {
        // Hapus id dari selectedItems jika sudah ada
        return prevSelectedItems.filter((id) => id !== data_wd_id);
      } else {
        // Tambah id ke selectedItems jika belum ada
        return [...prevSelectedItems, data_wd_id];
      }
    });
  };

  const handleClickDetail = (id) => {
    setIdDetail(id);
    setDataDetails(true);
  };

  const cancelDataGrab = async (id) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/cancelwd/${id}`);
      if (response.data.success) {
        getDataWdFromDb();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDataGrab = async (id) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/confirmwd/${id}`);
      if (response.data.success) {
        getDataWdFromDb();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectDataGrab = async (id) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/rejectwd/${id}`);
      if (response.data.success) {
        getDataWdFromDb();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMultiple = async (action) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/multipleaction`, {
        selectedItems,
        action,
      });
      if (response.data.success) {
        getDataWdFromDb();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  function getToday() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = today.getMonth(); // getMonth() returns 0-11
    let yyyy = today.getFullYear();

    // Array nama bulan
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Mengambil nama bulan dari array
    let month = monthNames[mm];

    return dd + "-" + month + "-" + yyyy;
  }

  const today = getToday();

  function StringTruncate(string, maxLength = 15) {
    if (string.length <= maxLength) {
      return string;
    } else {
      return string.substring(0, maxLength) + "...";
    }
  }

  return (
    <>
      <div className="w-full py-2 flex flex-col gap-1 px-6">
        {loading ? (
          <div className="pt-2">
            <Loading />
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md rounded-md">
            <div className="flex-1 flex justify-start px-2 items-center">
              <span className="text-sm kanit-medium">{today}</span>
            </div>
            <div className="flex flex-col md:flex-row px-2 py-1 justify-between items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="border p-1 rounded-md outline-none w-full max-w-80 min-w-52"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 p-1 rounded-md border flex-1 justify-center">
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-blue-300"
                  onClick={() => handleFilterByStatus("all")}
                >
                  All
                </button>
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-green-300"
                  onClick={() => handleFilterByStatus("success")}
                >
                  Success
                </button>
                <button
                  className="w-24 flex justify-center items-center border p-1 rounded-md shadow-md bg-yellow-300"
                  onClick={() => handleFilterByStatus("grab")}
                >
                  OnProcess
                </button>
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-orange-300"
                  onClick={() => handleFilterByStatus("pending")}
                >
                  Pending
                </button>
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-red-600 text-white"
                  onClick={() => handleFilterByStatus("reject")}
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="px-2">
              <h1>Menampilkan Data : {statusData}</h1>
            </div>
            <table className="w-full text-left">
              <thead className="bg-zinc-200">
                <tr>
                  <th scope="col" className="px-3 py-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="cursor-pointer w-4 h-4"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span></span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="pl-1 pr-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("agent_name")}
                  >
                    <div className="flex items-center">
                      <span>Agent</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="pl-1 pr-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("member_username")}
                  >
                    <div className="flex items-center">
                      <span>Username</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("account_name")}
                  >
                    <div className="flex items-center">
                      <span>Nama Rekening</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("bank_name")}
                  >
                    <div className="flex items-center">
                      <span>Bank Tujuan</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("nominal")}
                  >
                    <div className="flex items-center">
                      <span>Nominal</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className={`px-3 py-3 kanit-medium cursor-pointer`}
                    onClick={() => handleSort("admin_name")}
                  >
                    <div className="flex items-center">
                      <span>Admin</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-zinc-100">
                    <td className="w-4 px-3 py-2">
                      <div className="flex items-center">
                        <input
                          name={item.data_wd_id}
                          id={item.data_wd_id}
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedItems.includes(item.data_wd_id)}
                          onChange={() => handleCheckboxChange(item.data_wd_id)}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="p-1 rounded-md bg-blue-500 hover:opacity-80 w-fit">
                        <TbListDetails
                          className="text-lg text-white cursor-pointer"
                          onClick={() => handleClickDetail(item.data_wd_id)}
                          title="Details"
                        />
                      </div>
                    </td>
                    <td className="pl-1 pr-3 py-2">{item.agent_name}</td>
                    <td className="pl-1 pr-3 py-2">{item.member_username}</td>
                    <td className="px-3 py-2">
                      {StringTruncate(item.account_name)}
                    </td>
                    <td className="px-3 py-2 flex flex-col">
                      <div>{item.bank_name}</div>
                      <div>{item.account_number}</div>
                    </td>
                    <td className="px-3 py-2 kanit-medium text-xl">
                      {rupiah.format(item.nominal)}
                    </td>
                    <td className={`px-3 py-2`}>
                      {item.admin_name === null ? "-" : item.admin_name}
                    </td>
                    <td className="px-3 py-2">
                      {loadingAction ? (
                        <BiLoaderCircle className="text-2xl animate-spin" />
                      ) : (
                        <div className={`flex justify-center gap-1`}>
                          <button
                            className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                            title="Confirm"
                            onClick={() => {
                              const confirm = window.confirm(
                                "Withdraw sudah diproses ?"
                              );
                              if (confirm) {
                                confirmDataGrab(item.data_wd_id);
                              }
                            }}
                          >
                            <GiConfirmed className="text-zinc-100" />
                          </button>
                          <button
                            className="py-1 px-2 rounded-md bg-[#2bf83c] hover:bg-opacity-80"
                            title="Cancel"
                            onClick={() => {
                              const confirm = window.confirm(
                                "Yakin ingin cancel ?"
                              );
                              if (confirm) {
                                cancelDataGrab(item.data_wd_id);
                              }
                            }}
                          >
                            <PiHandCoinsFill className="text-zinc-900" />
                          </button>
                          <button
                            className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80"
                            title="Reject"
                            onClick={() => {
                              const confirm = window.confirm(
                                "Yakin ingin reject ?"
                              );
                              if (confirm) {
                                rejectDataGrab(item.data_wd_id);
                              }
                            }}
                          >
                            <GiCancel className="text-zinc-100" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex p-2 items-center justify-between pt-4"
              aria-label="Table navigation"
            >
              <span className="">
                Menampilkan{" "}
                <span className="">{`${firstPostIndex + 1} - ${
                  lastPostIndex <= filteredData.length
                    ? lastPostIndex
                    : filteredData.length
                }`}</span>{" "}
                dari <span className="">{filteredData.length}</span>
              </span>
              <ul className="inline-flex gap-1 -space-x-px text-sm h-8">
                <select
                  name="post-per-page"
                  id="post-per-page"
                  className="outline-none border rounded-md"
                  value={postPerPage}
                  onChange={(e) => handlePostPerPage(e.target.value)}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="30">30 / page</option>
                  <option value="40">40 / page</option>
                  <option value="50">50 / page</option>
                  <option value="100">100 / page</option>
                </select>
                <li>
                  <div
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg cursor-pointer"
                    onClick={handlePrevPage}
                  >
                    <TbPlayerTrackPrevFilled />
                  </div>
                </li>
                {getPageNumbers().map((page, index) => (
                  <li key={index}>
                    <div
                      className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer border border-gray-300 ${
                        page == currentPage
                          ? "bg-[#602BF8] text-white"
                          : "bg-white text-gray-500"
                      }`}
                      onClick={() => {
                        if (page !== "...") setCurrentPage(page);
                      }}
                    >
                      {page}
                    </div>
                  </li>
                ))}
                <li>
                  <div
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-pointer"
                    onClick={handleNextPage}
                  >
                    <TbPlayerTrackNextFilled />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        )}
        {loadingAction ? (
          <div>
            <BiLoaderCircle className="text-xl animate-spin" />
          </div>
        ) : (
          <div
            className={`flex justify-start gap-2 p-2 ${
              selectedItems.length < 1 ? "opacity-30" : ""
            }`}
          >
            <button
              className={`py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80 ${
                selectedItems.length < 1 ? "cursor-not-allowed" : ""
              }`}
              disabled={selectedItems.length < 1 ? true : false}
              title="Confirm"
              onClick={() => {
                const confirm = window.confirm("Confirm Yang di Pilih ?");
                if (confirm) {
                  handleMultiple("success");
                }
              }}
            >
              <GiConfirmed className="text-zinc-100" />
            </button>
            <button
              className={`py-1 px-2 rounded-md bg-[#2bf83c] hover:bg-opacity-80 ${
                selectedItems.length < 1 ? "cursor-not-allowed" : ""
              }`}
              disabled={selectedItems.length < 1 ? true : false}
              title="Cancel"
              onClick={() => {
                const confirm = window.confirm("Cancel Grab Yang di Pilih ?");
                if (confirm) {
                  handleMultiple("pending");
                }
              }}
            >
              <PiHandCoinsFill className="text-zinc-900" />
            </button>
            <button
              className={`py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80 ${
                selectedItems.length < 1 ? "cursor-not-allowed" : ""
              }`}
              disabled={selectedItems.length < 1 ? true : false}
              title="Reject"
              onClick={() => {
                const confirm = window.confirm("Reject Yang di Pilih ?");
                if (confirm) {
                  handleMultiple("reject");
                }
              }}
            >
              <GiCancel className="text-zinc-100" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const DataDetails = ({
  setDataDetails,
  dataWdFromDb,
  idDetail,
  rupiah,
  apiUrl,
  evidencePath,
  setEvidencePath,
  getDataWdFromDb,
}) => {
  const [loadUploadEvidence, setLoadUploadEvidence] = useState(false);
  const fileEvidenceRef = useRef(null);

  const dataCheck = dataWdFromDb.find((item) => item.data_wd_id === idDetail);

  const handleChangeEvidence = (e) => {
    const file = e.target.files[0];
    setEvidencePath(file);
  };

  const handleUploadEvidence = async () => {
    setLoadUploadEvidence(true);
    const formData = new FormData();
    formData.append("image", evidencePath);
    formData.append("wdid", idDetail);

    try {
      const response = await Axios.put(`${apiUrl}/adminwd/evidence`, formData);

      if (response.data.success) {
        alert("Success!");
        getDataWdFromDb();
        setDataDetails(false);
        setEvidencePath("");
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Something error!");
      }

      setLoadUploadEvidence(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIconUploadClick = () => {
    fileEvidenceRef.current.click();
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);

    // Ambil tahun, bulan, dan hari (UTC)
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() dimulai dari 0
    const day = String(date.getUTCDate()).padStart(2, "0");

    // Ambil jam, menit, dan detik (UTC)
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    // Gabungkan menjadi format yang diinginkan
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCloseDetails = () => {
    setDataDetails(false);
    setEvidencePath("");
  };

  return (
    <>
      {idDetail === undefined || dataCheck === undefined ? (
        ""
      ) : (
        <div className="p-3 bg-white shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Agent</div>
            <div className="flex-1 px-2 kanit-medium">
              {dataCheck.agent_name}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Operator Input</div>
            <div className="flex-1 px-2">{dataCheck.operator_name}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Username Member</div>
            <div className="flex-1 px-2">{dataCheck.member_username}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Bank/e-Wallet</div>
            <div className="flex-1 px-2">{dataCheck.bank_name}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nama Rekening</div>
            <div className="flex-1 px-2">{dataCheck.account_name}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nomor Rekening</div>
            <div className="flex-1 px-2">{dataCheck.account_number}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nominal Withdraw</div>
            <div className="flex-1 px-2">
              {rupiah.format(dataCheck.nominal)}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Sisa Saldo</div>
            <div className="flex-1 px-2">
              {rupiah.format(dataCheck.last_balance)}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Waktu Withdraw</div>
            <div className="flex-1 px-2">{dataCheck.wd_time}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Waktu Input</div>
            <div className="flex-1 px-2">
              {formatDate(dataCheck.input_date)}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Status</div>
            <div className="flex-1 px-2">{dataCheck.status}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Bukti</div>
            <div className="flex-1 flex items-center gap-1 px-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeEvidence}
                ref={fileEvidenceRef}
                className="hidden"
              />
              {dataCheck.evidence ? (
                <a
                  href={`${apiUrl}/${dataCheck.evidence}`}
                  target="_blank"
                  className="underline"
                >
                  lihat
                </a>
              ) : (
                <span>Tidak Tersedia</span>
              )}
              <ImCloudUpload
                className="text-xl text-[#602BF8] cursor-pointer"
                onClick={handleIconUploadClick}
              />
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 flex items-center px-2 border-r">Admin</div>
            <div className="flex-1 flex gap-2 items-center px-2">
              <div>
                {dataCheck.admin_name === null ? "-" : dataCheck.admin_name}
              </div>
              <div>
                {dataCheck.profile ? (
                  <a href={`${apiUrl}/${dataCheck.profile}`} target="_blank">
                    <img
                      src={`${apiUrl}/${dataCheck.profile}`}
                      alt="Profile"
                      className="w-14 h-14 rounded-full"
                    />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex gap-2 justify-center items-center py-2">
            <button
              className="px-2 py-1 rounded-md bg-zinc-200"
              onClick={handleCloseDetails}
            >
              Close
            </button>
            <button
              className={`${
                evidencePath ? "" : "hidden"
              } bg-[#602BF8] rounded-md px-2 py-1 text-zinc-100 text-base`}
              onClick={handleUploadEvidence}
            >
              {loadUploadEvidence ? (
                <BiLoaderCircle className="animate-spin text-base" />
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
