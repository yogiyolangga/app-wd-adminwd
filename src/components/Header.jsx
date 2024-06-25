import { useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header({ fullname }) {
  const path = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userAdminWd");
    localStorage.removeItem("tokenAdminWd");
    navigate("/login");
  };
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold text-[21px]">Dashboard</h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className={`hover:underline ${
              path.pathname == "/" ? "underline" : ""
            }`}
          >
            home
          </a>
          <a
            href="/grabbed"
            className={`hover:underline ${
              path.pathname == "/grabbed" ? "underline" : ""
            }`}
          >
            grabbed
          </a>
          <a
            href="/data-process"
            className={`hover:underline ${
              path.pathname == "/data-process" ? "underline" : ""
            }`}
          >
            onprocess
          </a>
          <a
            href="/data-process-supadmin"
            className={`hover:underline ${
              path.pathname == "/data-process-supadmin" ? "underline" : ""
            }`}
          >
            **
          </a>
          <a
            href="/history"
            className={`hover:underline ${
              path.pathname.includes("history") ? "underline" : ""
            }`}
          >
            history
          </a>
          <div className="relative cursor-pointer group">
            <p>access</p>
            <div className="absolute z-10 flex flex-col gap-2 item-center top-0 scale-0 -left-2.5 bg-gray-400 p-2 rounded-md group-hover:opacity-100 group-hover:scale-100 group-hover:top-5 duration-200">
              <a
                href="/admin"
                className={`hover:underline ${
                  path.pathname == "/admin" ? "underline" : ""
                }`}
              >
                account
              </a>
              <a
                href="/agent"
                className={`hover:underline ${
                  path.pathname == "/agent" ? "underline" : ""
                }`}
              >
                agent
              </a>
            </div>
          </div>
          <span className="kanit-medium">{fullname}</span>
          <div className="relative group cursor-pointer">
            <FaUserCircle className="text-lg" />
            <span
              className="absolute w-20 text-center p-1 bg-zinc-300 left-1/2 -translate-x-1/2 rounded-md top-5 kanit-medium cursor-pointer scale-0 group-hover:scale-100 text-zinc-700"
              onClick={handleLogout}
            >
              Log out
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
