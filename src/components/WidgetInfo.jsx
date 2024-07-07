import { useState, useEffect } from "react";

import Axios from "axios";
import io from "socket.io-client";

import { PiHandEyeFill } from "react-icons/pi";
import { MdToday } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";

const socket = io(import.meta.env.VITE_API_URL);

export default function WidgetInfo() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [dataWdFromDb, setDataWdFromDb] = useState([]);

  const [receivedMessages, setReceivedMessages] = useState([]);

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
    getDataWdFromDb();
  }, []);

  const todayRequest = dataWdFromDb.filter(
    (item) =>
      item.status === "pending" ||
      item.status === "grab" ||
      item.status === "success"
  );

  const pendingRequest = dataWdFromDb.filter(
    (item) => item.status === "pending"
  );

  const [barWidthPending, setBarWidthPending] = useState("2");
  const totalDuration = 5 * 60 * 1000; // 10 minutes in milliseconds

  useEffect(() => {
    const startTime =
      pendingRequest.length > 0 ? pendingRequest[0].input_date : "";
    const startTimestamp = new Date(startTime).getTime();
    const interval = setInterval(() => {
      const currentTimestamp = new Date().getTime();
      const elapsedTime = currentTimestamp - startTimestamp;
      const progress = Math.min((elapsedTime / totalDuration) * 100, 100);
      setBarWidthPending(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingRequest, totalDuration]);

  const processRequest = dataWdFromDb.filter((item) => item.status === "grab");

  const [barWidthOnProcess, setBarWidthOnProcess] = useState("2");

  useEffect(() => {
    if (processRequest.length > 100) {
      setBarWidthOnProcess("100");
    } else {
      setBarWidthOnProcess(processRequest.length);
    }
  }, [processRequest]);

  return (
    <>
      <>
        <div className="w-full flex justify-center gap-8">
          <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
            <div className="flex justify-between px-6 items-center">
              <div className="text-[14px] font-light dark:text-zinc-200">
                TODAY REQUEST
              </div>
              <div>
                <MdToday className="w-[24px] h-[24px] dark:text-zinc-200" />
              </div>
            </div>
            <div className="font-extrabold text-[40px] px-6 dark:text-zinc-200">
              {todayRequest.length}
            </div>
            <hr className="w-full bg-[#DDDBE2] mt-3" />
            <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
              <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
            </div>
            <div className="px-6">
              <h1 className="text-[12px] font-bold text-black dark:text-zinc-200">
                Process Average
              </h1>
            </div>
          </div>
          <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
            <div className="flex justify-between px-6 items-center">
              <div className="text-[14px] font-light dark:text-zinc-200">
                PENDING REQUEST
              </div>
              <div>
                <MdOutlinePendingActions className="w-[24px] h-[24px] dark:text-zinc-200" />
              </div>
            </div>
            <div className="font-extrabold text-[40px] px-6 dark:text-zinc-200">
              {pendingRequest.length}
            </div>
            <hr className="w-full bg-[#DDDBE2] mt-3" />
            <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
              <div
                style={{ width: `${barWidthPending < 101 ? barWidthPending : "0"}%` }}
                className={`h-[7px] rounded-[31px] ${
                  barWidthPending > "80" ? "bg-[#f82b2b]" : "bg-[#602BF8]"
                } duration-100`}
              ></div>
            </div>
            <div className="px-6">
              <h1 className="text-[12px] font-bold text-black dark:text-zinc-200">
                waiting time
              </h1>
            </div>
          </div>
          <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
            <div className="flex justify-between px-6 items-center">
              <div className="text-[14px] font-light dark:text-zinc-200">
                ON PROCESS
              </div>
              <div>
                <PiHandEyeFill className="w-[24px] h-[24px] text-black dark:text-zinc-200" />
              </div>
            </div>
            <div className="font-extrabold text-[40px] px-6 dark:text-zinc-200">
              {processRequest.length}
            </div>
            <hr className="w-full bg-[#DDDBE2] mt-3" />
            <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
              <div
                style={{ width: `${barWidthOnProcess}%` }}
                className={`h-[7px] rounded-[31px] ${
                  barWidthOnProcess > "80" ? "bg-[#f82b2b]" : "bg-[#602BF8]"
                } duration-100`}
              ></div>
            </div>
            <div className="px-6">
              <h1 className="text-[12px] font-bold text-black dark:text-zinc-200">
                total grab
              </h1>
            </div>
          </div>
        </div>
      </>
    </>
  );
}
