import { useEffect, useState } from "react";
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

export default function Grabbed() {
  const [dataDetails, setDataDetails] = useState(false);
  const [indexDetail, setIndexDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await fetch("https://dummyjson.com/users")
        .then((res) => res.json())
        .then((data) => {
          setData(data?.users);
        });

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

  return (
    <>
      <div className="relative bg-white w-full max-w-[90%]  min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header />
        <Sidebar />
        <div>
          <Data
            setDataDetails={setDataDetails}
            setIndexDetail={setIndexDetail}
            data={data}
            loading={loading}
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
          data={data}
          indexDetail={indexDetail}
        />
      </div>
    </>
  );
}

const Data = ({ setDataDetails, setIndexDetail, data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const filteredData = data.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  let pages = [];

  for (let i = 1; i <= Math.ceil(sortedData.length / postPerPage); i++) {
    pages.push(i);
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / postPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all filtered items
      setSelectedItems(currentData.map((item) => item.id));
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

  const handleCheckboxChange = (data_id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(data_id)) {
        // Hapus id dari selectedItems jika sudah ada
        return prevSelectedItems.filter((id) => id !== data_id);
      } else {
        // Tambah id ke selectedItems jika belum ada
        return [...prevSelectedItems, data_id];
      }
    });
  };

  const handleClickDetail = (id) => {
    setIndexDetail(id);
    setDataDetails(true);
  };

  const handleMultiple = () => {
    // Multiple selection logic here
    console.log(selectedItems);
  };

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
              <span className="text-sm">15-Jun-24</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-zinc-200">
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
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center">
                      <span></span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="pl-1 pr-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("firstName")}
                  >
                    <div className="flex items-center">
                      <span>Username</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("lastName")}
                  >
                    <div className="flex items-center">
                      <span>Agent</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("phone")}
                  >
                    <div className="flex items-center">
                      <span>Nama Rekening</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("username")}
                  >
                    <div className="flex items-center">
                      <span>Bank Tujuan</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("ip")}
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
                  <tr key={index} className="border-b hover:bg-zinc-100">
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          name={item.id}
                          id={item.id}
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </div>
                    </td>
                    <td className="px-1 py-4">
                      <div className="p-1 rounded-md bg-blue-500 hover:opacity-80 w-fit">
                        <TbListDetails
                          className="text-lg text-white cursor-pointer"
                          onClick={() => handleClickDetail(index)}
                          title="Details"
                        />
                      </div>
                    </td>
                    <td className="pl-1 pr-3 py-4">{item.firstName}</td>
                    <td className="px-6 py-4">{item.lastName}</td>
                    <td className="px-6 py-4">{item.phone}</td>
                    <td className="px-6 py-4">{item.username}</td>
                    <td className="px-6 py-4 kanit-medium text-xl">
                      {item.ip}
                    </td>
                    <td className="px-6 py-4 flex gap-1">
                      <button
                        className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                        title="Confirm"
                      >
                        <GiConfirmed className="text-zinc-100" />
                      </button>
                      <button
                        className="py-1 px-2 rounded-md bg-[#2bf83c] hover:bg-opacity-80"
                        title="Cancel"
                      >
                        <PiHandCoinsFill className="text-zinc-900" />
                      </button>
                      <button
                        className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80"
                        title="Reject"
                      >
                        <GiCancel className="text-zinc-100" />
                      </button>
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
                  onChange={(e) => setPostPerPage(e.target.value)}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="30">30 / page</option>
                  <option value="40">40 / page</option>
                  <option value="50">50 / page</option>
                </select>
                <li>
                  <div
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg cursor-pointer"
                    onClick={() => prevPage()}
                  >
                    <TbPlayerTrackPrevFilled />
                  </div>
                </li>
                {pages.map((page, index) => (
                  <li key={index}>
                    <div
                      className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer border border-gray-300 ${
                        page == currentPage
                          ? "bg-[#602BF8] text-white"
                          : "bg-white text-gray-500"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </div>
                  </li>
                ))}
                <li>
                  <div
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg cursor-pointer"
                    onClick={() => nextPage()}
                  >
                    <TbPlayerTrackNextFilled />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        )}
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
                handleMultiple();
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
                handleMultiple();
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
                handleMultiple();
              }
            }}
          >
            <GiCancel className="text-zinc-100" />
          </button>
        </div>
      </div>
    </>
  );
};

const DataDetails = ({ setDataDetails, data, indexDetail }) => {
  return (
    <>
      {indexDetail === undefined ? (
        ""
      ) : (
        <div className="p-3 bg-white shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Agent</div>
            <div className="flex-1 px-2 kanit-semibold text-xl">
              {data[indexDetail].lastName}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Operator</div>
            <div className="flex-1 px-2">{data[indexDetail].firstName}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">User ID</div>
            <div className="flex-1 px-2">{data[indexDetail].username}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Bank/e-Wallet</div>
            <div className="flex-1 px-2">{data[indexDetail].gender}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nama Rekening</div>
            <div className="flex-1 px-2">{data[indexDetail].username}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nominal Withdraw</div>
            <div className="flex-1 px-2">{data[indexDetail].phone}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Sisa Saldo</div>
            <div className="flex-1 px-2">{data[indexDetail].ip}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Timestamp</div>
            <div className="flex-1 px-2">{data[indexDetail].birthDate}</div>
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
