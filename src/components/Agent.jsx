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

export default function Agent() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userAdminWd");
  const token = localStorage.getItem("tokenAdminWd");
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [hideAddAgent, setHideAddAgent] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [agentList, setAgentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getStatus, setGetStatus] = useState("");
  const [editId, setEditId] = useState();

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

  const getAgent = async () => {
    setLoading(true);
    setGetStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await Axios.get(`${apiUrl}/adminwd/agent`);

      if (response.data.error) {
        console.log(response.data.error);
      } else if (response.data.success) {
        setAgentList(response.data.result);
      } else {
        console.log("Error geting data");
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
      <div className="relative bg-white w-full max-w-[863px] lg:w-3/4 min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header fullname={fullname} />
        <Sidebar />
        <div
          className={`${
            hideAddAgent ? "hidden" : ""
          } duration-150 border-b pb-1`}
        >
          <AddAdmin apiUrl={apiUrl} getAgent={getAgent} />
        </div>
        <div className="">
          <Admins
            apiUrl={apiUrl}
            setHideAddAgent={setHideAddAgent}
            hideAddAgent={hideAddAgent}
            agentList={agentList}
            loading={loading}
            getAgent={getAgent}
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
          agentList={agentList}
          apiUrl={apiUrl}
          getAgent={getAgent}
        />
      </div>
    </>
  );
}

const AddAdmin = ({ apiUrl, getAgent }) => {
  const [loading, setLoading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [provider, setProvider] = useState("");
  const [addAgentStatus, setAddAgentStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAddAgentStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (agentName === "") {
        setAddAgentStatus("Isi nama agent!");
      } else if (provider === "") {
        setAddAgentStatus("Pilih Provider");
      } else {
        const response = await Axios.post(`${apiUrl}/adminwd/addagent`, {
          agentName,
          provider,
        });

        if (response.data.success) {
          setAddAgentStatus(response.data.success);
          getAgent();
        } else if (response.data.error) {
          setAddAgentStatus(response.data.error);
        } else {
          console.log("Something Error");
        }
      }

      setLoading(false);
      setAgentName("");
      setProvider("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full px-6 flex flex-col justify-center items-center gap-1"
      >
        <div className="w-1/2">
          <label htmlFor="agent" className="text-sm pl-2">
            Agent
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiAccountPinCircleFill className="w-[24px] h-[24px] text-zinc-700" />
            <input
              type="text"
              id="agent"
              className="flex-1 h-full rounded-md outline-none"
              placeholder="Agent"
              value={agentName}
              onChange={(e) => {
                setAgentName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="agentName" className="text-sm pl-2">
            Provider
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaRegCircleUser className="w-[24px] h-[24px] text-zinc-700" />
            <select
              name="provider"
              id="provider"
              value={provider}
              className="flex-1 h-full rounded-md outline-none"
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="">Pilih Provider</option>
              <option value="IDNTOTO">IDNTOTO</option>
              <option value="IDNSPORT">IDNSPORT</option>
              <option value="MSC">MSC</option>
              <option value="NEXUS">NEXUS</option>
              <option value="SBO">SBO</option>
            </select>
          </div>
        </div>
        <div className="w-1/2">
          <p className="text-red-500 text-sm text-center">{addAgentStatus}</p>
        </div>
        <div className="w-1/2">
          <button
            type="submit"
            className="w-full rounded-full flex justify-center items-center text-white bg-gradient-to-tl from-[#00E1FD] to-[#602BF8] h-10 hover:opacity-70"
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
  setHideAddAgent,
  hideAddAgent,
  agentList,
  loading,
  getAgent,
  setEditForm,
  setEditId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    getAgent();
  }, []);

  const handleDeleteAgent = async (id) => {
    const confirmation = window.confirm("Kamu yakin ?");
    if (confirmation) {
      try {
        const response = await Axios.delete(`${apiUrl}/agent/${id}`);

        if (response.data.success) {
          getAgent();
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

  const filteredData = agentList.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all filtered items
      setSelectedItems(filteredData.map((item) => item.agent_id));
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

  const handleCheckboxChange = (agent_id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(agent_id)) {
        // Hapus agent_id dari selectedItems jika sudah ada
        return prevSelectedItems.filter((id) => id !== agent_id);
      } else {
        // Tambah agent_id ke selectedItems jika belum ada
        return [...prevSelectedItems, agent_id];
      }
    });
  };

  const handleDeleteMultipleAgent = async () => {
    setLoadingDelete(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.delete(`${apiUrl}/adminwd/agent`, {
        data: { ids: selectedItems },
      });
      if (response.data.success) {
        alert("Hapus Berhasil!");
        getAgent();
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
        <div className="w-full flex justify-center"></div>

        {loading ? (
          <div className="pt-2">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full flex justify-start gap-2 pb-1 items-center">
              {hideAddAgent ? (
                <button
                  className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                  onClick={() => setHideAddAgent(false)}
                >
                  <MdGroupAdd className="text-lg text-zinc-100" />
                </button>
              ) : (
                <button
                  className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80"
                  onClick={() => setHideAddAgent(true)}
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
            <div className="w-full flex justify-evenly items-center gap-1 py-1 border">
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
                Provider
              </div>
              <div className="w-20"></div>
            </div>
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="w-full flex justify-evenly items-center gap-1 py-1 border"
              >
                <div className="w-10 flex justify-center">
                  <input
                    type="checkbox"
                    name={item.agent_id}
                    id={item.agent_id}
                    className="cursor-pointer"
                    checked={selectedItems.includes(item.agent_id)}
                    onChange={() => handleCheckboxChange(item.agent_id)}
                  />
                </div>
                <div className="flex-1 flex justify-center">{item.name}</div>
                <div className="flex-1 flex justify-center">
                  {item.provider}
                </div>
                <div className="w-20 flex justify-center gap-1">
                  <button
                    className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                    onClick={() => handleClickEdit(item.agent_id)}
                  >
                    <ImPencil2 className="text-zinc-100" />
                  </button>
                  <button className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80">
                    <RiDeleteBin6Fill
                      className="text-zinc-100"
                      onClick={() => handleDeleteAgent(item.agent_id)}
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
                  handleDeleteMultipleAgent();
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

const EditAdmin = ({ setEditForm, editId, agentList, apiUrl, getAgent }) => {
  const [loading, setLoading] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newProvider, setNewProvider] = useState("");

  const dataSelect = agentList.find((item) => item.agent_id === editId);

  const handleUpadateAdmin = async () => {
    setLoading(true);
    try {
      const response = await Axios.put(`${apiUrl}/adminwd/agent`, {
        editId,
        newAgentName,
        newProvider,
      });
      if (response.data.success) {
        setEditForm(false);
        getAgent();
        setLoading(false);
      } else if (response.data.error) {
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
    if (editId != undefined) {
      setNewAgentName(dataSelect.name);
      setNewProvider(dataSelect.provider);
    }
  }, [editId]);

  return (
    <>
      <div className="p-3 bg-white shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
      <div className="">
          <label htmlFor="agent" className="text-sm pl-2">
            Agent
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiAccountPinCircleFill className="w-[24px] h-[24px] text-zinc-700" />
            <input
              type="text"
              id="agent"
              className="flex-1 h-full rounded-md outline-none"
              placeholder="Agent"
              value={newAgentName}
              onChange={(e) => {
                setNewAgentName(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="">
          <label htmlFor="agentName" className="text-sm pl-2">
            Provider
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaRegCircleUser className="w-[24px] h-[24px] text-zinc-700" />
            <select
              name="provider"
              id="provider"
              value={newProvider}
              className="flex-1 h-full rounded-md outline-none"
              onChange={(e) => setNewProvider(e.target.value)}
            >
              <option value="">Pilih Provider</option>
              <option value="IDNTOTO">IDNTOTO</option>
              <option value="IDNSPORT">IDNSPORT</option>
              <option value="MSC">MSC</option>
              <option value="NEXUS">NEXUS</option>
              <option value="SBO">SBO</option>
            </select>
          </div>
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
