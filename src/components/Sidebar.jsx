import question from "../assets/question.png";

import { HiUserGroup } from "react-icons/hi";
import { BiSolidHome } from "react-icons/bi";
import { PiHandGrabbingFill } from "react-icons/pi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { useLocation } from "react-router-dom";

export function Sidebar() {
  const path = useLocation();
  return (
    <>
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-[55px] h-[300px] rounded-[47px] bg-[#602BF8] drop-shadow-md flex flex-col items-center justify-evenly">
        <a href="/">
          <BiSolidHome
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/grabbed">
          <PiHandGrabbingFill
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/grabbed" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/">
          <HiOutlineClipboardList
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/admin">
          <HiUserGroup
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/admin" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/">
          <img src={question} alt="Icon" className="w-[24px] h-[24px]" />
        </a>
      </div>
    </>
  );
}
