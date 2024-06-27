import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Axios from "axios";
import Header from "./Header";
import { Sidebar } from "./Sidebar";

import profilePicDefault from "../assets/profile-default.png";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Profile() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userAdminWd");
  const token = localStorage.getItem("tokenAdminWd");
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [adminId, setAdminId] = useState("");
  const [usernameAdmin, setUsernameAdmin] = useState("");
  const [roleAdminWd, setRoleAdminWd] = useState("");
  const [profilePic, setProfilePic] = useState("");

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
        setAdminId(response.data.result[0].admin_id);
        setUsernameAdmin(response.data.result[0].username);
        setRoleAdminWd(response.data.result[0].role);
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

  return (
    <>
      <div className="relative bg-white max-w-[863px] lg:w-3/4  min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header fullname={fullname} profilePic={profilePic} />
        <Sidebar />
        <div>
          <DataProfile
            adminId={adminId}
            fullname={fullname}
            usernameAdmin={usernameAdmin}
            roleAdminWd={roleAdminWd}
            apiUrl={apiUrl}
            profilePic={profilePic}
          />
        </div>
      </div>
    </>
  );
}

const DataProfile = ({
  adminId,
  fullname,
  usernameAdmin,
  roleAdminWd,
  apiUrl,
  profilePic,
}) => {
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setImagePath(file);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", imagePath);
      formData.append("adminid", adminId);

      const response = await Axios.put(
        `${apiUrl}/adminwd/profilepic`,
        formData
      );

      if (response.data.success) {
        alert("Success");
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
    setNewName(fullname);
    setNewUsername(usernameAdmin);
  }, [fullname, usernameAdmin]);

  const handleSpanClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex w-full flex-col gap-2 justify-center items-center">
          <form
            className="flex flex-col items-center gap-1"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            {imagePath ? (
              <img
                src={URL.createObjectURL(imagePath)}
                alt="Profile"
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <img
                src={profilePic ? `${apiUrl}/${profilePic}` : profilePicDefault}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              ref={fileInputRef}
              className="hidden"
            />
            <span
              className="hover:underline cursor-pointer"
              onClick={handleSpanClick}
            >
              change picture
            </span>
            <button
              className={`px-2 py-1 rounded-md bg-[#602BF8] text-white hover:opacity-80 ${
                imagePath ? "" : "hidden"
              }`}
              type="submit"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="text-lg animate-spin" />
              ) : (
                "Save Image"
              )}
            </button>
          </form>
          <div className="flex w-1/2 border flex-col gap-1 px-1">
            <div className="flex justify-between items-center border-b kanit-regular">
              <div>Name</div>
              <input
                type="text"
                value={newName}
                readOnly={true}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-zinc-100 outline-none p-1 rounded border"
              />
            </div>
            <div className="flex justify-between items-center border-b kanit-regular">
              <div>Username</div>
              <input
                type="text"
                value={newUsername}
                readOnly={true}
                onChange={(e) => setNewUsername(e.target.value)}
                className="bg-zinc-100 outline-none p-1 rounded"
              />
            </div>
            <div className="flex justify-between items-center border-b kanit-regular">
              <div>Role</div>
              <input
                type="text"
                value={roleAdminWd}
                readOnly={true}
                className="bg-zinc-100 outline-none p-1 rounded"
              />
            </div>
          </div>
          <div>
            <button
              className="px-2 py-1 rounded-md bg-[#602BF8] text-white hover:opacity-80"
              onClick={() => alert("Prevent")}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
