import React, { useState } from "react";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser, FaMoon, FaSun } from "react-icons/fa6";
import { GoCalendar } from "react-icons/go";
import { CgMenuGridO } from "react-icons/cg";
import Notification from "./Notification";
import Profile from "./Profile";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProject } from "../store/userSlice";

import { useTheme } from "../ThemeContext"; // <<-- Make sure this is imported

function Header() {
  const [isNotification, setIsNotification] = useState(false);
  const [isProfile, setIsProfile] = useState(false);

  const dispatch = useDispatch();
  const projects = useSelector((state) => state.user.projects);
  const selectedProject = useSelector((state) => state.user.selectedProject.id);
  const { theme, toggleTheme } = useTheme();

  const rolee = localStorage.getItem("ROLE");
  const token = localStorage.getItem("TOKEN");
  const allowuser =
    rolee === "Manager" || rolee === "Super Admin" || rolee === "Admin";

  const navigate = useNavigate();



  const handleProject = (e) => {
    dispatch(setSelectedProject(e.target.value));
  };

  const handleUserSetupClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/user-setup");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white text-gray-900 flex items-center justify-between px-3 py-2 shadow-md border">
        <div className="flex items-center space-x-8">
          <span className="text-lg flex items-center space-x-2">
            <h2 className="text-black font-medium">🔗 Konstruct</h2>
          </span>
          <NavLink
            to="/config"
            className={({ isActive }) =>
              !isActive ? "font-normal" : "text-gray-800 underline font-normal"
            }
          >
            Home
          </NavLink>
        </div>
        <ul className="hidden md:flex justify-end items-center gap-5 py-2 uppercase text-sm">
          {projects.length > 0 && (
            <select
              className="bg-gray-700 text-white rounded-md p-2"
              onChange={handleProject}
              value={selectedProject}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.project_name}
                </option>
              ))}
            </select>
          )}

          {/* <button>
            <CiSearch className="text-xl" />
          </button>
          <button>
            <IoIosNotificationsOutline className="text-xl" />
          </button> */}
          {/* <button>
            <GoCalendar className="text-lg" />
          </button> */}
          {/* <NavLink
            to="/blog"
            className={({ isActive }) =>
              !isActive ? "font-normal" : "font-medium"
            }
          >
            <HiOutlineBuildingStorefront className="text-lg" />
          </NavLink> */}
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              !isActive
                ? "font-normal flex items-center gap-1"
                : "font-medium flex items-center gap-1 text-purple-600"
            }
            title="Analytics Dashboard"
          >
            📊 Analytics
          </NavLink>
          {allowuser && (
            <NavLink
              to={rolee === "Manager" ? "/user" : "/setup"}
              className={({ isActive }) =>
                !isActive ? "font-normal" : "font-medium"
              }
            >
              <IoSettingsOutline className="text-lg" />
            </NavLink>
          )}

          <button onClick={() => setIsProfile(true)}>
            <FaRegCircleUser className="text-lg" />
          </button>
          {/* <button onClick={() => setIsNotification(true)}>
            <CgMenuGridO className="text-xl" />
          </button> */}
          {/* ---- Theme Toggle Button ---- */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 bg-gray-800 hover:bg-yellow-400 transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? (
              <FaSun className="text-yellow-300" />
            ) : (
              <FaMoon className="text-gray-700" />
            )}
          </button>
        </ul>
      </nav>
      {isProfile && <Profile onClose={() => setIsProfile(false)} />}
      {isNotification && (
        <Notification onClose={() => setIsNotification(false)} />
      )}
    </>
  );
}

export default Header;
