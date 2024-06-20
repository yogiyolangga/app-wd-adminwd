import { HiUserGroup } from "react-icons/hi";
import { BiSolidHome } from "react-icons/bi";
import { PiHandGrabbingFill } from "react-icons/pi";
import { HiOutlineClipboardList, HiOutlineLogout } from "react-icons/hi";

import { useLocation, useNavigate } from "react-router-dom";
import { TbDatabaseCog } from "react-icons/tb";
import { BsDatabaseFillCheck } from "react-icons/bs";

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
        <a href="/data-process">
          <TbDatabaseCog
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/data-process" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/history">
          <BsDatabaseFillCheck
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
        <div className="cursor-pointer">
          <HiOutlineLogout
            className="w-[24px] h-[24px] hover:text-white text-zinc-400"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
}
