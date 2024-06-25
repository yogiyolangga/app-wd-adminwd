import { HiUserGroup } from "react-icons/hi";
import { BiSolidHome } from "react-icons/bi";
import { PiHandGrabbingFill } from "react-icons/pi";
import { HiOutlineLogout } from "react-icons/hi";
import { BsDatabaseFillLock } from "react-icons/bs";
import { RiSettings5Fill } from "react-icons/ri";

import { useLocation, useNavigate } from "react-router-dom";
import { TbDatabaseCog } from "react-icons/tb";
import { BsDatabaseFillCheck } from "react-icons/bs";
import { FaMagento } from "react-icons/fa";

export function Sidebar() {
  const path = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userAdminWd");
    localStorage.removeItem("tokenAdminWd");
    navigate("/login");
  };

  return (
    <>
      <div className="absolute z-10 -left-6 top-1/2 -translate-y-1/2 w-[55px] h-[300px] rounded-[47px] bg-[#602BF8] drop-shadow-md flex flex-col items-center justify-evenly">
        <a href="/">
          <BiSolidHome
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/" ? "text-white" : "text-zinc-400"
            }`}
              title="Home"
          />
        </a>
        <a href="/grabbed">
          <PiHandGrabbingFill
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/grabbed" ? "text-white" : "text-zinc-400"
            }`}
              title="Grabbed"
          />
        </a>
        <a href="/data-process">
          <TbDatabaseCog
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/data-process" ? "text-white" : "text-zinc-400"
            }`}
              title="On Process"
          />
        </a>
        <a href="/data-process-supadmin">
          <BsDatabaseFillLock
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/data-process-supadmin"
                ? "text-white"
                : "text-zinc-400"
            }`}
              title="On Process"
          />
        </a>
        <a href="/history">
          <BsDatabaseFillCheck
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname.includes("history") ? "text-white" : "text-zinc-400"
            }`}
              title="History"
          />
        </a>
        <div className="relative group cursor-pointer">
          <div>
            <RiSettings5Fill
              className={`w-[24px] h-[24px] hover:text-white ${
                path.pathname.includes("admin") ||
                path.pathname.includes("agent")
                  ? "text-white"
                  : "text-zinc-400"
              }`}
              title="Access"
            />
          </div>
          <a
            href="/admin"
            className="absolute right-1 opacity-0 -top-3 bg-[#602BF8] p-3 rounded-l-full group-hover:right-9 group-hover:opacity-100 duration-200"
          >
            <HiUserGroup
              className={`w-[24px] h-[24px] hover:text-white ${
                path.pathname == "/admin" ? "text-white" : "text-zinc-400"
              }`}
              title="Admin"
            />
          </a>
          <a
            href="/agent"
            className="absolute left-1 opacity-0 -top-3 bg-[#602BF8] p-3 rounded-r-full group-hover:left-9 group-hover:opacity-100 duration-200"
          >
            <FaMagento
              className={`w-[24px] h-[24px] hover:text-white ${
                path.pathname == "/agent" ? "text-white" : "text-zinc-400"
              }`}
              title="Agent"
            />
          </a>
        </div>
        <div className="cursor-pointer">
          <HiOutlineLogout
            className="w-[24px] h-[24px] hover:text-white text-zinc-400"
            onClick={handleLogout}
              title="Logout"
          />
        </div>
      </div>
    </>
  );
}
