import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import projectImage from "../Images/Project.png";
import { getProjectLevelDetails } from "../api";
import toast from "react-hot-toast";
import SiteBarHome from "./SiteBarHome";
import axios from "axios";
import { useTheme } from "../ThemeContext"; // <- ThemeContext import

const ProjectDetailsPage = () => {
  const { theme } = useTheme(); // <- use theme

  // --- Theme palette ---
  const palette =
    theme === "dark"
      ? {
          bg: "bg-slate-900",
          card: "bg-slate-800 border-slate-700 text-slate-100",
          border: "border-slate-700",
          text: "text-slate-100",
          heading: "text-purple-300",
          shadow: "shadow-2xl",
          imgOverlay: "bg-slate-900 bg-opacity-60 text-slate-100",
        }
      : {
          bg: "bg-gray-100",
          card: "bg-white border-gray-200 text-gray-900",
          border: "border-gray-200",
          text: "text-gray-900",
          heading: "text-purple-800",
          shadow: "shadow-lg",
          imgOverlay: "bg-gray-800 bg-opacity-50 text-white",
        };

  const { id: projectIdFromUrl } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const projectFromState = location.state?.project;
  const projectId =
    projectFromState?.id || projectFromState?.project_id || projectIdFromUrl;

  const projectImg = projectFromState?.image_url || projectImage;
  const [projectLevelData, setProjectLevelData] = useState([]);

  useEffect(() => {
    if (!projectId) {
      navigate("/");
      return;
    }
    const fetchProjectTower = async () => {
      try {
        const token = localStorage.getItem("ACCESS_TOKEN");
        const response = await axios.get(
          `https://konstruct.world/projects/buildings/by_project/${projectId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          setProjectLevelData(response.data);
        } else {
          setProjectLevelData([]);
          toast.error("Invalid or empty response from server.");
        }
      } catch (error) {
        setProjectLevelData([]);
        toast.error("Something went wrong while fetching project levels.");
      }
    };
    fetchProjectTower();
  }, [projectId, navigate]);

  const handleImageClick = (proj) => {
    navigate(`/Level/${proj}`, {
      state: { projectLevelData },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={`flex ${palette.bg} min-h-screen`}>
      <SiteBarHome />
      <div className={`my-5 w-[85%] mt-5 ml-[16%] mr-[1%]`}>
        <div className={`max-w-7xl mx-auto pt-3 px-5 pb-8 rounded ${palette.card} ${palette.shadow} ${palette.border} border`}>
          <div className="mb-8">
            <h2 className={`text-4xl font-bold text-center mb-4 ${palette.heading}`}>
              {projectFromState?.project_name || `Project ${projectId}`}
            </h2>
          </div>
          <div>
            {projectLevelData && projectLevelData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {projectLevelData.map((proj) => (
                  <div
                    key={proj.id}
                    className={`relative rounded-xl overflow-hidden cursor-pointer transition transform hover:scale-105 ${palette.card} ${palette.shadow} ${palette.border} border`}
                    onClick={() => handleImageClick(proj.id)}
                  >
                    <img
                      src={projectImg}
                      alt={`${
                        proj.name || proj.naming_convention || "Project"
                      } Background`}
                      className="w-full h-80 object-cover"
                    />
                    <div className={`absolute bottom-0 left-0 right-0 p-2 text-sm font-semibold ${palette.imgOverlay}`}>
                      {proj.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center ${palette.text} text-lg font-semibold mt-10`}>
                No projects available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
