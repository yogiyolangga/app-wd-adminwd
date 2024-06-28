import Header from "./Header";
import { Sidebar } from "./Sidebar";

import { useEffect, useState } from "react";
import Axios from "axios";

import { RiAccountPinCircleFill } from "react-icons/ri";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ImPencil2 } from "react-icons/im";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";
import { TiCancelOutline } from "react-icons/ti";

import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userAdminWd");
  const token = localStorage.getItem("tokenAdminWd");
  const role = localStorage.getItem("roleAdminWd");
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [hideAddAdmin, setHideAddAdmin] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getStatus, setGetStatus] = useState("");
  const [editId, setEditId] = useState();

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

  const getAdminData = async () => {
    try {
      const response = await Axios.get(
        `${apiUrl}/adminwd/dataadmin/${userLogin}`
      );
      if (response.data.success) {
        setFullname(response.data.result[0].fullname);
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

  useEffect(() => {
    getAdminData();
  }, []);

  const getAdmin = async () => {
    setLoading(true);
    setGetStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await Axios.get(`${apiUrl}/admin`);

      if (response.data.error) {
        setGetStatus(response.data.error);
      } else if (response.data.success) {
        setAdminList(response.data.result);
      } else {
        setGetStatus("Something running error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Function to handle the escape key event
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setEditForm(false); // Set state to false when Escape is pressed
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
      <div className="relative bg-white dark:bg-zinc-700 w-full max-w-[863px] lg:w-3/4 min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header fullname={fullname} profilePic={profilePic} />
        <Sidebar />
        <div
          className={`${
            hideAddAdmin ? "hidden" : ""
          } duration-150 border-b pb-1`}
        >
          <AddAdmin apiUrl={apiUrl} getAdmin={getAdmin} />
        </div>
        <div className="">
          <Admins
            apiUrl={apiUrl}
            setHideAddAdmin={setHideAddAdmin}
            hideAddAdmin={hideAddAdmin}
            adminList={adminList}
            loading={loading}
            getStatus={getStatus}
            getAdmin={getAdmin}
            setEditForm={setEditForm}
            setEditId={setEditId}
          />
        </div>
      </div>
      <div
        className={`${
          editForm ? "flex" : "hidden"
        } fixed min-w-full min-h-screen top-0 justify-center bg-zinc-800 bg-opacity-30 backdrop-blur-sm items-center z-10`}
      >
        <EditAdmin
          setEditForm={setEditForm}
          editId={editId}
          adminList={adminList}
          apiUrl={apiUrl}
          getAdmin={getAdmin}
        />
      </div>
    </>
  );
}

const AddAdmin = ({ apiUrl, getAdmin }) => {
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regisStatus, setRegisStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const spaceRegex = /\s/;

      if (username.length < 5) {
        setRegisStatus("Username minimal 5 karakter ya!");
      } else if (spaceRegex.test(username)) {
        setRegisStatus("Username Invalid!");
      } else if (fullname.length < 5) {
        setRegisStatus("Isi name lengkap yang lengkap :)");
      } else if (password.length < 8) {
        setRegisStatus("Password minimal 8 karakter ya!");
      } else {
        const response = await Axios.post(`${apiUrl}/admin/register`, {
          fullname: fullname,
          username: username,
          password: password,
        });

        if (response.data.success) {
          setRegisStatus(response.data.success);
          getAdmin();
        } else if (response.data.error) {
          setRegisStatus(response.data.error);
        } else {
          console.log("Something Error");
        }
      }

      setLoading(false);
      setFullname("");
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full px-6 flex flex-col justify-center items-center gap-1 dark:text-zinc-50"
      >
        <div className="w-1/2">
          <label htmlFor="fullname" className="text-sm pl-2">
            Nama Lengkap
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiAccountPinCircleFill className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type="text"
              id="fullname"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Nama Lengkap"
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="username" className="text-sm pl-2">
            Username
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaRegCircleUser className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type="text"
              id="username"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="password" className="text-sm pl-2">
            Password
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiLockPasswordFill className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type={passwordType}
              id="password"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <GoEyeClosed
              className={`w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50 cursor-pointer ${
                passwordType === "password" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("text")}
            />
            <GoEye
              className={`w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50 cursor-pointer ${
                passwordType === "text" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("password")}
            />
          </div>
        </div>
        <div className="w-1/2">
          <p className="text-red-500 text-sm text-center">{regisStatus}</p>
        </div>
        <div className="w-1/2">
          <button
            type="submit"
            className="w-full rounded-full flex justify-center items-center text-white bg-gradient-to-tl from-[#00E1FD] to-[#602BF8] dark:from-zinc-900 dark:to-zinc-800 h-10 hover:opacity-70"
          >
            {loading === true ? (
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

const Admins = ({
  apiUrl,
  setHideAddAdmin,
  hideAddAdmin,
  adminList,
  loading,
  getStatus,
  getAdmin,
  setEditForm,
  setEditId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    getAdmin();
  }, []);

  const handleDeleteAdmin = async (id) => {
    const confirmation = window.confirm("Kamu yakin ?");
    if (confirmation) {
      try {
        const response = await Axios.delete(`${apiUrl}/admin/${id}`);

        if (response.data.success) {
          getAdmin();
        } else if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Something Error!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickEdit = (id) => {
    setEditForm(true);
    setEditId(id);
  };

  const filteredData = adminList.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all filtered items
      setSelectedItems(filteredData.map((item) => item.admin_id));
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    // Update select all checkbox status based on filtered data and selected items
    if (
      filteredData.length > 0 &&
      selectedItems.length === filteredData.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [filteredData, selectedItems]);

  const handleCheckboxChange = (admin_id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(admin_id)) {
        // Hapus admin_id dari selectedItems jika sudah ada
        return prevSelectedItems.filter((id) => id !== admin_id);
      } else {
        // Tambah admin_id ke selectedItems jika belum ada
        return [...prevSelectedItems, admin_id];
      }
    });
  };

  const handleDeleteMultipleAdmin = async () => {
    setLoadingDelete(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.delete(`${apiUrl}/multiple/admin`, {
        data: { ids: selectedItems },
      });
      if (response.data.success) {
        alert("Hapus Berhasil!");
        getAdmin();
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Something might error!");
      }

      setLoadingDelete(false);
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="w-full px-6 flex flex-col">
        <div className="w-full flex justify-center">
          <p className="text-red-500 text-sm">{getStatus}</p>
        </div>

        {loading ? (
          <div className="pt-2">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full flex justify-start gap-2 pb-1 items-center">
              {hideAddAdmin ? (
                <button
                  className="py-1 px-2 rounded-md bg-[#602BF8] dark:bg-zinc-900 hover:bg-opacity-80"
                  onClick={() => setHideAddAdmin(false)}
                >
                  <MdGroupAdd className="text-lg text-zinc-100" />
                </button>
              ) : (
                <button
                  className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80"
                  onClick={() => setHideAddAdmin(true)}
                >
                  <TiCancelOutline className="text-lg text-zinc-100" />
                </button>
              )}
              <input
                type="text"
                placeholder="Cari Nama..."
                className="border p-1 rounded-md outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <div className="w-full flex justify-evenly items-center gap-1 py-1 border dark:bg-zinc-900 dark:text-zinc-50">
              <div className="w-10 flex justify-center">
                <input
                  type="checkbox"
                  name="id"
                  id="id"
                  className="cursor-pointer"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </div>
              <div className="flex-1 flex justify-center kanit-medium">
                Name
              </div>
              <div className="flex-1 flex justify-center kanit-medium">
                Username
              </div>
              <div className="w-20"></div>
            </div>
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="w-full flex justify-evenly items-center gap-1 py-1 border dark:text-zinc-50"
              >
                <div className="w-10 flex justify-center">
                  <input
                    type="checkbox"
                    name={item.admin_id}
                    id={item.admin_id}
                    className="cursor-pointer"
                    checked={selectedItems.includes(item.admin_id)}
                    onChange={() => handleCheckboxChange(item.admin_id)}
                  />
                </div>
                <div className="flex-1 flex justify-center">
                  {item.fullname}
                </div>
                <div className="flex-1 flex justify-center">
                  {item.username}
                </div>
                <div className="w-20 flex justify-center gap-1">
                  <button
                    className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                    onClick={() => handleClickEdit(item.admin_id)}
                  >
                    <ImPencil2 className="text-zinc-100" />
                  </button>
                  <button className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80">
                    <RiDeleteBin6Fill
                      className="text-zinc-100"
                      onClick={() => handleDeleteAdmin(item.admin_id)}
                    />
                  </button>
                </div>
              </div>
            ))}
            <button
              className={`px-2 py-1 rounded-md bg-[#f82b2b] text-zinc-100 my-1 hover:bg-opacity-80 ${
                selectedItems.length < 1 ? "opacity-10 cursor-not-allowed" : ""
              }`}
              disabled={selectedItems.length < 1 ? true : false}
              onClick={() => {
                const confirm = window.confirm("Kamu yakin menghapus data");
                if (confirm) {
                  handleDeleteMultipleAdmin();
                }
              }}
            >
              {loadingDelete ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const EditAdmin = ({ setEditForm, editId, adminList, apiUrl, getAdmin }) => {
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [adminId, setAdminId] = useState();
  const [newFullname, setNewFullname] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [status, setStatus] = useState("");

  const dataSelect = adminList.find((item) => item.admin_id === editId);

  const handleUpadateAdmin = async () => {
    setLoading(true);
    try {
      const response = await Axios.put(`${apiUrl}/admin`, {
        adminId: adminId,
        newFullname: newFullname,
        newUsername: newUsername,
        newPass: newPass,
      });
      if (response.data.success) {
        setEditForm(false);
        getAdmin();
        setLoading(false);
        setNewPass("");
      } else if (response.data.error) {
        console.log(response.data.error);
        setStatus(response.data.error);
      } else {
        console.log("Something Error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editId != undefined) {
      setNewFullname(dataSelect.fullname);
      setNewUsername(dataSelect.username);
      setNewPass("");
      setAdminId(dataSelect.admin_id);
    }
  }, [editId]);

  return (
    <>
      <div className="p-3 bg-white dark:bg-zinc-900 dark:text-zinc-50 shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
        <div className="">
          <label htmlFor="edit-fullname" className="text-sm pl-2">
            Nama Lengkap
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiAccountPinCircleFill className="w-[24px] h-[24px] text-zinc-700" />
            <input
              type="text"
              id="edit-fullname"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Nama Lengkap"
              value={newFullname}
              onChange={(e) => {
                setNewFullname(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="">
          <label htmlFor="edit-username" className="text-sm pl-2">
            Username
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaRegCircleUser className="w-[24px] h-[24px] text-zinc-700" />
            <input
              type="text"
              id="edit-username"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="">
          <label htmlFor="edit-password" className="text-sm pl-2">
            Password
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiLockPasswordFill className="w-[24px] h-[24px] text-zinc-700" />
            <input
              type={passwordType}
              id="edit-password"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => {
                setNewPass(e.target.value);
              }}
            />
            <GoEyeClosed
              className={`w-[24px] h-[24px] text-zinc-700 cursor-pointer ${
                passwordType === "password" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("text")}
            />
            <GoEye
              className={`w-[24px] h-[24px] text-zinc-700 cursor-pointer ${
                passwordType === "text" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("password")}
            />
          </div>
        </div>
        <div className="w-1/2">
          <p className="text-red-500 text-sm text-center">{status}</p>
        </div>
        <div className="w-full flex pt-2 justify-center gap-2">
          <button
            className="px-3 rounded-xl flex justify-center items-center text-white bg-gradient-to-tl from-[#00E1FD] to-[#602BF8] h-10 hover:opacity-70"
            onClick={handleUpadateAdmin}
          >
            {loading === true ? (
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
            ) : (
              "Update"
            )}
          </button>
          <button
            type="button"
            className="px-3 rounded-xl flex justify-center items-center text-white bg-gradient-to-tl from-[#f500fd] to-[#f82b2b] h-10 hover:opacity-70"
            onClick={() => setEditForm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
