import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "./Header";
import { Sidebar } from "./Sidebar";
import Loading from "./Loading";

import { GiConfirmed, GiCancel } from "react-icons/gi";
import { PiHandCoinsFill } from "react-icons/pi";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { FaSort } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { BiLoaderCircle } from "react-icons/bi";

import grab from "../assets/grab.png";
import bca from "../assets/bca.png";
import bni from "../assets/bni.png";
import bri from "../assets/bri.png";
import mandiri from "../assets/mandiri.png";
import danamon from "../assets/danamon.png";
import dana from "../assets/dana.png";
import ovo from "../assets/ovo.png";
import gopay from "../assets/gopay.png";
import all from "../assets/all.png";

export default function Grabbed() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userAdminWd");
  const token = localStorage.getItem("tokenAdminWd");
  const navigate = useNavigate();
  const [dataWdFromDb, setDataWdFromDb] = useState([]);
  const [fullname, setFullname] = useState("");
  const [adminId, setAdminId] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [dataDetails, setDataDetails] = useState(false);
  const [idDetail, setIdDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingGrab, setLoadingGrab] = useState(false);

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  const getAdminData = async () => {
    try {
      const response = await Axios.get(
        `${apiUrl}/adminwd/dataadmin/${userLogin}`
      );
      if (response.data.success) {
        setFullname(response.data.result[0].fullname);
        setAdminId(response.data.result[0].admin_id);
        setProfilePic(response.data.result[0].profile);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get admin data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const response = await Axios.get(`${apiUrl}/adminwd/grab/${userLogin}`);

      if (response.data.success) {
        setDataWdFromDb(response.data.result);
      } else if (response.data.error) {
        alert("Error From Server, maybe sql");
        console.log(response.data.error);
      } else {
        console.log("Something Error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminData();
    getData();
  }, []);

  useEffect(() => {
    // Function to handle the escape key event
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setDataDetails(false); // Set state to false when Escape is pressed
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
      <div className="relative bg-white dark:bg-zinc-700 w-full max-w-[90%]  min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header fullname={fullname} profilePic={profilePic} />
        <Sidebar />
        <div className={`px-4 ${dataWdFromDb.length < 1 ? "" : "hidden"}`}>
          <GrabSection
            adminId={adminId}
            apiUrl={apiUrl}
            setLoadingGrab={setLoadingGrab}
            navigate={navigate}
            getData={getData}
          />
        </div>
        <div>
          <Data
            setDataDetails={setDataDetails}
            setIdDetail={setIdDetail}
            dataWdFromDb={dataWdFromDb}
            setDataWdFromDb={setDataWdFromDb}
            loading={loading}
            rupiah={rupiah}
            apiUrl={apiUrl}
          />
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
        />
      </div>
      <div
        className={`${
          loadingGrab ? "flex" : "hidden"
        } fixed min-w-full min-h-screen top-0 justify-center bg-zinc-800 bg-opacity-30 backdrop-blur-sm items-center gap-1 z-10`}
      >
        <BiLoaderCircle className="text-xl animate-spin" />
        <h1 className="text-zinc-800 kanit-medium">On it</h1>
      </div>
    </>
  );
}

const Data = ({
  setDataDetails,
  setIdDetail,
  dataWdFromDb,
  setDataWdFromDb,
  loading,
  rupiah,
  apiUrl,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [loadingAction, setLoadingAction] = useState(false);

  const filteredData = dataWdFromDb.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();

    const fieldsToFilter = [
      item.member_username,
      item.agent_name,
      item.account_name,
      item.account_number,
      item.bank_name,
      item.nominal,
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

  const totalPages = Math.ceil(dataWdFromDb.length / postPerPage);

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
        setDataWdFromDb(dataWdFromDb.filter((item) => item.data_wd_id != id));
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
        setDataWdFromDb(dataWdFromDb.filter((item) => item.data_wd_id != id));
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
        setDataWdFromDb(dataWdFromDb.filter((item) => item.data_wd_id != id));
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
        setDataWdFromDb(
          dataWdFromDb.filter(
            (item) => !selectedItems.includes(item.data_wd_id)
          )
        );
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

  function copyText(value) {
    navigator.clipboard.writeText(value);
  }

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

  return (
    <>
      <div className="w-full py-2 flex flex-col gap-1 px-6">
        {loading ? (
          <div className="pt-2">
            <Loading />
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md rounded-md">
            <div className="flex px-2 py-1 justify-between">
              <input
                type="text"
                placeholder="Cari..."
                className="border p-1 rounded-md outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
              <span className="text-sm kanit-regular dark:text-zinc-200">{getToday()}</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-zinc-200 dark:bg-zinc-600 dark:text-zinc-50">
                <tr>
                  <th scope="col" className="p-4">
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
                    className="px-6 py-3 kanit-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span></span>
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
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("agent_name")}
                  >
                    <div className="flex items-center">
                      <span>Agent</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("account_name")}
                  >
                    <div className="flex items-center">
                      <span>Nama Rekening</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("bank_name")}
                  >
                    <div className="flex items-center">
                      <span>Bank Tujuan</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("nominal")}
                  >
                    <div className="flex items-center">
                      <span>Nominal</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:text-zinc-50">
                    <td className="w-4 p-4">
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
                    <td className="px-1 py-4">
                      <div className="p-1 rounded-md bg-blue-500 hover:opacity-80 w-fit">
                        <TbListDetails
                          className="text-lg text-white cursor-pointer"
                          onClick={() => handleClickDetail(item.data_wd_id)}
                          title="Details"
                        />
                      </div>
                    </td>
                    <td className="pl-1 pr-3 py-4">{item.member_username}</td>
                    <td className="px-3 py-1">{item.agent_name}</td>
                    <td className="px-3 py-1">{item.account_name}</td>
                    <td
                      className="px-3 py-1 cursor-pointer active:opacity-70"
                      onClick={() => copyText(item.account_number)}
                    >
                      {`${item.bank_name} | ${item.account_number}`}
                    </td>
                    <td
                      className="px-3 py-1 kanit-medium text-xl cursor-pointer active:opacity-70"
                      onClick={() => copyText(item.nominal)}
                    >
                      {rupiah.format(item.nominal)}
                    </td>
                    {loadingAction ? (
                      <td className="px-3 py-1 flex items-center justify-center">
                        <BiLoaderCircle className="text-2xl animate-spin" />
                      </td>
                    ) : (
                      <td className="px-3 py-1">
                        <div className="flex gap-1">
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
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex p-2 items-center justify-between pt-4"
              aria-label="Table navigation"
            >
              <span className="dark:text-zinc-50">
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
                  className="outline-none border rounded-md dark:bg-zinc-600 dark:text-zinc-50"
                  value={postPerPage}
                  onChange={(e) => setPostPerPage(e.target.value)}
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
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white dark:bg-zinc-600 dark:text-zinc-50 border border-gray-300 rounded-s-lg cursor-pointer"
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
                          ? "bg-[#602BF8] text-white dark:bg-zinc-950"
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
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white dark:bg-zinc-600 dark:text-zinc-50 border border-gray-300 rounded-e-lg cursor-pointer"
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

const DataDetails = ({ setDataDetails, dataWdFromDb, idDetail, rupiah }) => {
  const dataCheck = dataWdFromDb.find((item) => item.data_wd_id === idDetail);

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

  return (
    <>
      {idDetail === undefined || dataCheck === undefined ? (
        ""
      ) : (
        <div className="p-3 bg-white shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Agent</div>
            <div className="flex-1 px-2 kanit-semibold text-xl">
              {dataCheck.agent_name === undefined ? "" : dataCheck.agent_name}
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
          <div className="w-full flex justify-center items-center py-2">
            <button
              className="px-2 py-1 rounded-md bg-zinc-200"
              onClick={() => setDataDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const GrabSection = ({ adminId, apiUrl, setLoadingGrab, getData }) => {
  const [amount, setAmount] = useState(1000);

  const handleGrab = async (bankName) => {
    setLoadingGrab(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await Axios.put(`${apiUrl}/adminwd/grabbing`, {
        amount,
        bankName,
        adminId,
      });
      if (response.data.success) {
        getData();
      } else if (response.data.error) {
        alert("Gagal mengambil data!");
        console.log(response.data.error);
      } else {
        alert("Terjadi kesalahan");
        console.log("Something error!");
      }
      setLoadingGrab(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Amout amount={amount} setAmount={setAmount} />
      <div className="w-full flex flex-wrap gap-4 justify-evenly border rounded-md py-5">
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"bca"}
          src={bca}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"bni"}
          src={bni}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"bri"}
          src={bri}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"mandiri"}
          src={mandiri}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"danamon"}
          src={danamon}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"dana"}
          src={dana}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"ovo"}
          src={ovo}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"gopay"}
          src={gopay}
        />
        <GrabButton
          handleGrab={handleGrab}
          amount={amount}
          bankName={"all"}
          src={all}
        />
      </div>
    </>
  );
};

const Amout = ({ amount, setAmount }) => {
  return (
    <>
      <div className="w-full flex flex-col gap-3 pb-3 px-6">
        {/* <div className="w-full h-[10px] rounded-full bg-zinc-500">
          <div className="w-1/2 h-[10px] rounded-full bg-[#602BF8]"></div>
        </div> */}
        <div className="w-full flex gap-3">
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 3 ? "bg-[#602BF8]" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(3)}
          >
            3
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 5 ? "bg-[#602BF8]" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(5)}
          >
            5
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 10 ? "bg-[#602BF8]" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(10)}
          >
            10
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 20 ? "bg-[#602BF8]" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(20)}
          >
            20
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 1000 ? "bg-[#602BF8]" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(1000)}
          >
            All
          </div>
        </div>
      </div>
    </>
  );
};

const GrabButton = ({ src, handleGrab, bankName }) => {
  return (
    <>
      <div
        className="px-3 py-3 w-[200px] min-h-20 rounded-xl bg-[#ffffff] dark:bg-zinc-900 cursor-pointer hover:scale-105 duration-100 shadow-xl dark:shadow-zinc-500 flex justify-center items-center active:scale-95"
        onClick={() => handleGrab(bankName)}
      >
        <div className="flex w-full items-center justify-center gap-1">
          <img src={src} alt="Bank" className="w-[90px] h-auto" />
          <img src={grab} alt="Grab" className="w-[40px] h-auto" />
        </div>
      </div>
    </>
  );
};
