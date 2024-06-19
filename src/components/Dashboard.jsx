import Header from "./Header";
import { Sidebar } from "./Sidebar";

import chat from "../assets/chat.svg";
import pending from "../assets/pending.png";
import grab from "../assets/grab.png";
import today from "../assets/today.png";
import bca from "../assets/bca.png";
import bni from "../assets/bni.png";
import bri from "../assets/bri.png";
import mandiri from "../assets/mandiri.png";
import danamon from "../assets/danamon.png";
import dana from "../assets/dana.png";
import ovo from "../assets/ovo.png";
import gopay from "../assets/gopay.png";
import all from "../assets/all.png";
import { useState } from "react";

export default function Dashboard() {
  return (
    <>
      <div className="relative bg-white w-full max-w-[863px] lg:w-3/4 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header />
        <Sidebar />
        <Widget />
        <Amout />
        <div className="w-full flex flex-wrap gap-4 justify-evenly">
          <GrabButton src={bca} />
          <GrabButton src={bni} />
          <GrabButton src={bri} />
          <GrabButton src={mandiri} />
          <GrabButton src={danamon} />
          <GrabButton src={dana} />
          <GrabButton src={ovo} />
          <GrabButton src={gopay} />
          <GrabButton src={all} />
        </div>
      </div>
    </>
  );
}

const Widget = () => {
  return (
    <>
      <div className="w-full flex justify-end gap-8">
        <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
          <div className="flex justify-between px-6 items-center">
            <div className="text-[14px] font-light">TODAY REQUEST</div>
            <div>
              <img src={today} alt="Chat" className="w-[24px] h-[24px] " />
            </div>
          </div>
          <div className="font-extrabold text-[40px] px-6">85</div>
          <hr className="w-full bg-[#DDDBE2] mt-3" />
          <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
            <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
          </div>
          <div className="px-6">
            <h1 className="text-[12px] font-bold text-black">
              Process Average
            </h1>
          </div>
        </div>
        <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
          <div className="flex justify-between px-6 items-center">
            <div className="text-[14px] font-light">PENDING REQUEST</div>
            <div>
              <img src={pending} alt="Chat" className="w-[24px] h-[24px] " />
            </div>
          </div>
          <div className="font-extrabold text-[40px] px-6">30</div>
          <hr className="w-full bg-[#DDDBE2] mt-3" />
          <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
            <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
          </div>
          <div className="px-6">
            <h1 className="text-[12px] font-bold text-black">Last Min Queue</h1>
          </div>
        </div>
        <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
          <div className="flex justify-between px-6 items-center">
            <div className="text-[14px] font-light">NEW MESSAGES</div>
            <div>
              <img src={chat} alt="Chat" className="w-[24px] h-[24px] " />
            </div>
          </div>
          <div className="font-extrabold text-[40px] px-6">85</div>
          <hr className="w-full bg-[#DDDBE2] mt-3" />
          <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
            <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
          </div>
          <div className="px-6">
            <h1 className="text-[12px] font-bold text-black">Response Rate</h1>
          </div>
        </div>
      </div>
    </>
  );
};

const Amout = () => {
  const [amount, setAmount] = useState(100);

  return (
    <>
      <div className="w-full flex flex-col gap-3 py-1 px-6">
        {/* <div className="w-full h-[10px] rounded-full bg-zinc-500">
          <div className="w-1/2 h-[10px] rounded-full bg-[#602BF8]"></div>
        </div> */}
        <div className="w-full flex gap-3">
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
              amount === 100 ? "bg-[#602BF8]" : "bg-[#999899]"
            }`}
            onClick={() => setAmount(100)}
          >
            All
          </div>
        </div>
      </div>
    </>
  );
};

const GrabButton = ({ src }) => {
  return (
    <>
      <div className="px-3 py-3 w-[200px] rounded-xl bg-[#ffffff] cursor-pointer hover:scale-105 duration-100 shadow-xl flex items-center justify-evenly">
        <img src={src} alt="Bank" className="w-[90px]" />
        <img src={grab} alt="Grab" className="w-[40px]" />
      </div>
    </>
  );
};
