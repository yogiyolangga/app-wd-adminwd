import Header from "./Header";
import { Sidebar } from "./Sidebar";

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

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Axios from "axios";
import io from "socket.io-client";

import { PiHandEyeFill } from "react-icons/pi";
import { MdToday } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import WidgetInfo from "./WidgetInfo";

const socket = io(import.meta.env.VITE_API_URL);

export default function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userAdminWd");
  const token = localStorage.getItem("tokenAdminWd");
  const navigate = useNavigate();
  const [dataWdFromDb, setDataWdFromDb] = useState([]);
  const [fullname, setFullname] = useState("");
  const [adminId, setAdminId] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loadingGrab, setLoadingGrab] = useState(false);

  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    socket.on("data_inserted", (data) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data.message]);
      getDataWdFromDb();
    });

    return () => {
      socket.off("data_inserted");
    };
  }, []);

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  const getDataWdFromDb = async () => {
    try {
      const response = await Axios.get(`${apiUrl}/adminwd/datawd`);
      if (response.data.success) {
        setDataWdFromDb(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get data wd from db");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    getAdminData();
    getDataWdFromDb();
  }, []);

  return (
    <>
      <div className="relative bg-white dark:bg-zinc-700 w-full max-w-[863px] lg:w-3/4 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header fullname={fullname} profilePic={profilePic} />
        <Sidebar />
        <WidgetInfo />
        <div className="px-4">
          <GrabSection
            adminId={adminId}
            apiUrl={apiUrl}
            setLoadingGrab={setLoadingGrab}
            navigate={navigate}
          />
        </div>
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

const GrabSection = ({ adminId, apiUrl, setLoadingGrab, navigate }) => {
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
        navigate("/grabbed");
      } else if (response.data.pending) {
        alert(response.data.pending);
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
              amount === 3 ? "bg-[#602BF8] dark:bg-zinc-950" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(3)}
          >
            3
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 5 ? "bg-[#602BF8] dark:bg-zinc-950" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(5)}
          >
            5
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 10 ? "bg-[#602BF8] dark:bg-zinc-950" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(10)}
          >
            10
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 20 ? "bg-[#602BF8] dark:bg-zinc-950" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(20)}
          >
            20
          </div>
          <div
            className={`p-3 rounded-full w-8 h-8 flex justify-center items-center font-bold text-white hover:scale-105 duration-100 cursor-pointer ${
              amount === 1000 ? "bg-[#602BF8] dark:bg-zinc-950" : "bg-[#999899]"
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
