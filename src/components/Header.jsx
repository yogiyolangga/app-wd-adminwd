import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Header({ fullname, profilePic }) {
  const [theme, setTheme] = useState(null);
  const path = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const role = localStorage.getItem("roleAdminWd");

  const handleLogout = () => {
    localStorage.removeItem("userAdminWd");
    localStorage.removeItem("tokenAdminWd");
    localStorage.removeItem("roleAdminWd");
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    } else if (localStorage.getItem("theme") === "light") {
      setTheme("light");
    } else if (window.matchMedia("(prefers-color-scheme : dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="py-0.5 px-1 w-[50px] bg-zinc-200 rounded-xl cursor-pointer border-2 border-black group"
            onClick={handleThemeSwitch}
          >
            <div className="w-[20px] h-[20px] flex justify-center items-center rounded-full border-2 border-black bg-yellow-400 dark:bg-zinc-600 dark:translate-x-full duration-300 group-hover:scale-105">
              <FaRegLightbulb className="text-sm" />
            </div>
          </div>
          <h1 className="font-bold text-[21px] text-zinc-950 dark:text-zinc-200">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname == "/" ? "underline" : ""
            }`}
          >
            home
          </a>
          <a
            href="/grabbed"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname == "/grabbed" ? "underline" : ""
            }`}
          >
            grabbed
          </a>
          <a
            href="/data-process"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname == "/data-process" ? "underline" : ""
            }`}
          >
            onprocess
          </a>
          <a
            href="/data-process-supadmin"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname == "/data-process-supadmin" ? "underline" : ""
            } ${role != "administrator" ? "hidden" : ""}`}
          >
            **
          </a>
          <a
            href="/history"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname.includes("history") ? "underline" : ""
            }`}
          >
            history
          </a>
          <div
            className={`dark:text-zinc-200 relative cursor-pointer group ${
              role != "administrator" ? "hidden" : ""
            }`}
          >
            <p
              className={`${
                path.pathname.includes("admin") ||
                path.pathname.includes("agent")
                  ? "underline"
                  : ""
              }`}
            >
              access
            </p>
            <div className="absolute z-10 flex flex-col gap-2 item-center top-0 scale-0 -left-2.5 bg-gray-200 dark:bg-zinc-800 p-2 rounded-md group-hover:opacity-100 group-hover:scale-100 group-hover:top-5 duration-200">
              <a
                href="/admin"
                className={`dark:text-zinc-200 hover:underline ${
                  path.pathname == "/admin" ? "underline" : ""
                }`}
              >
                account
              </a>
              <a
                href="/agent"
                className={`dark:text-zinc-200 hover:underline ${
                  path.pathname == "/agent" ? "underline" : ""
                }`}
              >
                agent
              </a>
            </div>
          </div>
          <a
            href="/profile"
            className={`flex items-center gap-1 hover:underline ${
              path.pathname.includes("profile") ? "underline" : ""
            }`}
          >
            <span className="kanit-medium dark:text-zinc-200">{fullname}</span>
            <div className="relative group cursor-pointer">
              {profilePic ? (
                <img
                  src={`${apiUrl}/${profilePic}`}
                  alt="Profile"
                  className="w-[28px] h-[28px] rounded-full"
                />
              ) : (
                <FaUserCircle className="text-[28px]" />
              )}
              <span
                className="absolute w-20 text-center p-1 bg-zinc-300 left-1/2 -translate-x-1/2 rounded-md top-7 kanit-medium cursor-pointer scale-0 group-hover:scale-100 text-zinc-700"
                onClick={handleLogout}
              >
                Log out
              </span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
