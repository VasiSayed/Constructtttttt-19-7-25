// import React, { useEffect, useRef, useState } from "react";
// import Drawer from "./Drawer";
// import profile from "../../src/Images/profile.jpg";
// import { CiCircleQuestion } from "react-icons/ci";
// import { IoMdArrowDropdown } from "react-icons/io";
// import {
//   FiMail,
//   FiPhone,
//   FiCalendar,
//   FiClock,
//   FiUser,
//   FiSettings,
//   FiLogOut,
//   FiBriefcase,
//   FiShield,
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "../ThemeContext";

// function Profile({ onClose }) {
//   const [manage, setManage] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const { theme } = useTheme();

//   const [userData, setUserData] = useState(null);
//   const [accesses, setAccesses] = useState([]);
  
//   // New state for organization/company/entity details
//   const [organizationDetails, setOrganizationDetails] = useState({
//     organization: null,
//     company: null,
//     entity: null,
//     loading: true,
//     error: null
//   });

//   // --- THEME PALETTE ---
//   const palette =
//     theme === "dark"
//       ? {
//           bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
//           card: "bg-slate-800/80 backdrop-blur-xl border-slate-700/50",
//           innerCard: "bg-slate-700/50 backdrop-blur-lg border-slate-600/30",
//           border: "border-slate-700/50",
//           text: "text-slate-100",
//           subtext: "text-slate-300",
//           mutedText: "text-slate-400",
//           accent: "bg-gradient-to-r from-blue-500 to-purple-600",
//           accentHover: "hover:from-blue-400 hover:to-purple-500",
//           primaryBtn:
//             "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500",
//           dangerBtn:
//             "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500",
//           icon: "text-blue-400",
//           surface: "bg-slate-800/60",
//           glassmorphism: "bg-white/5 backdrop-blur-xl border-white/10",
//         }
//       : {
//           bg: "bg-gradient-to-br from-gray-50 via-white to-gray-50",
//           card: "bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-xl",
//           innerCard: "bg-gray-50/80 backdrop-blur-lg border-gray-200/30",
//           border: "border-gray-200/50",
//           text: "text-gray-900",
//           subtext: "text-gray-600",
//           mutedText: "text-gray-500",
//           accent: "bg-gradient-to-r from-blue-600 to-purple-600",
//           accentHover: "hover:from-blue-500 hover:to-purple-500",
//           primaryBtn:
//             "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500",
//           dangerBtn:
//             "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500",
//           icon: "text-blue-500",
//           surface: "bg-gray-50/80",
//           glassmorphism: "bg-white/40 backdrop-blur-xl border-white/20",
//         };

//   // API base URL - adjust this to your actual API base URL
//   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

//   // Function to get auth headers
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("ACCESS_TOKEN");
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
//   };

//   // Function to fetch organization/company/entity details
//   const fetchOrganizationDetails = async (userData) => {
//     if (!userData) return;

//     try {
//       setOrganizationDetails(prev => ({ ...prev, loading: true, error: null }));
      
//       const headers = getAuthHeaders();
//       const results = {};

//       // Fetch organization details if org ID exists
//       if (userData.org) {
//         try {
//           const orgResponse = await fetch(`${API_BASE_URL}/organizations/${userData.org}/`, {
//             headers
//           });
//           if (orgResponse.ok) {
//             results.organization = await orgResponse.json();
//           }
//         } catch (error) {
//           console.warn('Error fetching organization:', error);
//         }
//       }

//       // Fetch company details if company ID exists
//       if (userData.company_id) {
//         try {
//           const companyResponse = await fetch(`${API_BASE_URL}/companies/${userData.company_id}/`, {
//             headers
//           });
//           if (companyResponse.ok) {
//             results.company = await companyResponse.json();
//           }
//         } catch (error) {
//           console.warn('Error fetching company:', error);
//         }
//       }

//       // Fetch entity details if entity ID exists
//       if (userData.entity_id) {
//         try {
//           const entityResponse = await fetch(`${API_BASE_URL}/entities/${userData.entity_id}/`, {
//             headers
//           });
//           if (entityResponse.ok) {
//             results.entity = await entityResponse.json();
//           }
//         } catch (error) {
//           console.warn('Error fetching entity:', error);
//         }
//       }

//       setOrganizationDetails({
//         ...results,
//         loading: false,
//         error: null
//       });

//     } catch (error) {
//       console.error('Error fetching organization details:', error);
//       setOrganizationDetails(prev => ({
//         ...prev,
//         loading: false,
//         error: 'Failed to load organization details'
//       }));
//     }
//   };

//   useEffect(() => {
//     const userString = localStorage.getItem("USER_DATA");
//     if (userString && userString !== "undefined") {
//       const parsedUserData = JSON.parse(userString);
//       setUserData(parsedUserData);
//       // Fetch organization details when user data is loaded
//       fetchOrganizationDetails(parsedUserData);
//     }
    
//     const accessString = localStorage.getItem("ACCESSES");
//     if (accessString && accessString !== "undefined") {
//       try {
//         setAccesses(JSON.parse(accessString));
//       } catch (e) {
//         setAccesses([]);
//       }
//     }
//   }, []);

//   // Extract unique roles
//   let allRoles = [];
//   if (Array.isArray(accesses)) {
//     accesses.forEach((access) => {
//       if (access.roles && Array.isArray(access.roles)) {
//         access.roles.forEach((role) => {
//           const roleStr = typeof role === "string" ? role : role?.role;
//           if (roleStr && !allRoles.includes(roleStr)) {
//             allRoles.push(roleStr);
//           }
//         });
//       }
//     });
//   }

//   let role = "User";
//   if (userData?.superadmin || userData?.is_staff) {
//     role = "Super Admin";
//   } else if (userData?.is_client) {
//     role = "Client";
//   } else if (userData?.is_manager) {
//     role = "Manager";
//   } else if (allRoles.length > 0) {
//     role = allRoles.join(", ");
//   }

//   useEffect(() => {
//     localStorage.setItem("ROLE", role);
//   }, [role]);

//   // Dropdown outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setManage(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Sign out logic
//   const handleSignOut = () => {
//     localStorage.removeItem("ACCESS_TOKEN");
//     localStorage.removeItem("REFRESH_TOKEN");
//     localStorage.removeItem("USER_DATA");
//     localStorage.removeItem("ACCESSES");
//     localStorage.removeItem("ROLE");
//     navigate("/login");
//     if (typeof onClose === "function") onClose();
//   };

//   // Helper function to check if contact data exists
//   const hasContactData = () => {
//     return (
//       isValidString(userData?.email) ||
//       isValidString(userData?.phone_number) ||
//       isValidString(userData?.date_joined) ||
//       isValidString(userData?.last_login)
//     );
//   };

//   // Helper function to safely check string values
//   const isValidString = (value) => {
//     return value && String(value).trim() !== "";
//   };

//   // Function to check if we have any organization/company/entity to display
//   const hasOrganizationData = () => {
//     return (
//       organizationDetails.organization ||
//       organizationDetails.company ||
//       organizationDetails.entity ||
//       isValidString(userData?.org)
//     );
//   };

//   return (
//     <Drawer onClose={onClose}>
//       <div
//         className={`w-full max-w-md mx-auto ${palette.bg} rounded-3xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col`}
//       >
//         {/* Header with Profile Picture */}
//         <div
//           className={`relative ${palette.card} ${palette.border} border rounded-t-3xl p-6 pb-4 flex-shrink-0`}
//         >
//           <div className="flex flex-col items-center">
//             {/* Profile Picture with Modern Ring */}
//             <div className="relative group">
//               <div
//                 className={`absolute -inset-1 ${palette.accent} rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500`}
//               ></div>
//               <div className="relative">
//                 <img
//                   src={profile}
//                   alt="profile"
//                   className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-2xl transform group-hover:scale-105 transition duration-300"
//                 />
//                 <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
//               </div>
//             </div>

//             {/* User Name & ID */}
//             <div className="text-center mt-4 space-y-2">
//               {isValidString(userData?.username) && (
//                 <h2 className={`text-xl font-bold ${palette.text} tracking-tight`}>
//                   {userData.username}
//                 </h2>
//               )}
//               {isValidString(userData?.user_id) && (
//                 <div className={`flex items-center justify-center gap-2 ${palette.subtext}`}>
//                   <FiUser size={14} />
//                   <span className="text-sm font-medium">ID: {userData.user_id}</span>
//                   <CiCircleQuestion size={14} className={`${palette.icon} hover:scale-110 transition-transform cursor-help`} />
//                 </div>
//               )}
//             </div>

//             {/* Role Badge */}
//             <div className="mt-3">
//               <div
//                 className={`inline-flex items-center gap-2 px-3 py-1.5 ${palette.accent} text-white rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-300`}
//               >
//                 <FiShield size={14} />
//                 {role}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Content Area */}
//         <div
//           className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
//           style={{ scrollbarWidth: "thin" }}
//         >
//           {/* Project Roles Section */}
//           {accesses?.length > 0 && (
//             <div className={`${palette.innerCard} ${palette.border} border rounded-2xl p-4`}>
//               <div className={`flex items-center gap-2 mb-3 ${palette.text}`}>
//                 <FiBriefcase size={16} className={palette.icon} />
//                 <h3 className="font-semibold text-sm">Project Access</h3>
//               </div>
//               <div className="space-y-2">
//                 {accesses.slice(0, 3).map(
//                   (access, idx) =>
//                     isValidString(access.project_id) && (
//                       <div
//                         key={idx}
//                         className={`${palette.glassmorphism} rounded-xl p-3 ${palette.border} border`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <span className={`font-semibold ${palette.text} text-sm`}>
//                             Project {access.project_id}
//                           </span>
//                           <div className="flex flex-wrap gap-1">
//                             {access.roles?.slice(0, 2).map((role, j) => {
//                               const roleStr =
//                                 typeof role === "string" ? role : role?.role;
//                               return isValidString(roleStr) ? (
//                                 <span
//                                   key={j}
//                                   className={`px-2 py-1 ${palette.accent} text-white rounded-lg text-xs font-medium shadow-sm`}
//                                 >
//                                   {roleStr}
//                                 </span>
//                               ) : null;
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     )
//                 )}
//                 {accesses.length > 3 && (
//                   <div className={`text-center ${palette.mutedText} text-xs`}>
//                     +{accesses.length - 3} more projects
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Contact Information */}
//           {hasContactData() && (
//             <div className={`${palette.innerCard} ${palette.border} border rounded-2xl p-4`}>
//               <h3 className={`font-semibold ${palette.text} mb-3 flex items-center gap-2 text-sm`}>
//                 <FiMail size={16} className={palette.icon} />
//                 Contact Details
//               </h3>
//               <div className="space-y-2">
//                 {isValidString(userData?.email) && (
//                   <div className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                     <FiMail size={14} className={palette.icon} />
//                     <div>
//                       <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                         Email
//                       </p>
//                       <p className={`${palette.text} font-medium text-sm`}>{userData.email}</p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.phone_number) && (
//                   <div className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                     <FiPhone size={14} className={palette.icon} />
//                     <div>
//                       <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                         Phone
//                       </p>
//                       <p className={`${palette.text} font-medium text-sm`}>{userData.phone_number}</p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.date_joined) && (
//                   <div className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                     <FiCalendar size={14} className={palette.icon} />
//                     <div>
//                       <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                         Joined
//                       </p>
//                       <p className={`${palette.text} font-medium text-sm`}>{userData.date_joined}</p>
//                     </div>
//                   </div>
//                 )}
//                 {isValidString(userData?.last_login) && (
//                   <div className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                     <FiClock size={14} className={palette.icon} />
//                     <div>
//                       <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                         Last Login
//                       </p>
//                       <p className={`${palette.text} font-medium text-sm`}>{userData.last_login}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Enhanced Organization Section */}
//           {hasOrganizationData() && (
//             <div className={`${palette.innerCard} ${palette.border} border rounded-2xl p-4 relative`} ref={dropdownRef}>
//               <h3 className={`font-semibold ${palette.text} mb-3 flex items-center gap-2 text-sm`}>
//                 <FiBriefcase size={16} className={palette.icon} />
//                 Organization Details
//               </h3>
              
//               {organizationDetails.loading ? (
//                 <div className={`flex items-center justify-center p-4 ${palette.glassmorphism} rounded-xl ${palette.border} border`}>
//                   <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                   <span className={`ml-2 ${palette.mutedText} text-sm`}>Loading...</span>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {/* Organization */}
//                   {organizationDetails.organization && (
//                     <div className={`p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}>
//                           {organizationDetails.organization.name ? organizationDetails.organization.name[0] : 'O'}
//                         </div>
//                         <div>
//                           <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                             Organization
//                           </p>
//                           <p className={`font-semibold ${palette.text} text-sm`}>
//                             {organizationDetails.organization.name || organizationDetails.organization.organization_name || `Org ${userData.org}`}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Company */}
//                   {organizationDetails.company && (
//                     <div className={`p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}>
//                           {organizationDetails.company.name ? organizationDetails.company.name[0] : 'C'}
//                         </div>
//                         <div>
//                           <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                             Company
//                           </p>
//                           <p className={`font-semibold ${palette.text} text-sm`}>
//                             {organizationDetails.company.name || organizationDetails.company.company_name}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Entity */}
//                   {organizationDetails.entity && (
//                     <div className={`p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}>
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}>
//                           {organizationDetails.entity.name ? organizationDetails.entity.name[0] : 'E'}
//                         </div>
//                         <div>
//                           <p className={`text-xs ${palette.mutedText} uppercase tracking-wide`}>
//                             Entity
//                           </p>
//                           <p className={`font-semibold ${palette.text} text-sm`}>
//                             {organizationDetails.entity.name || organizationDetails.entity.entity_name}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Fallback to org ID if no names were fetched but org exists */}
//                   {!organizationDetails.organization && !organizationDetails.company && !organizationDetails.entity && isValidString(userData?.org) && (
//                     <button
//                       onClick={() => setManage(!manage)}
//                       className={`w-full flex items-center justify-between p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-all duration-300 group`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}>
//                           {isValidString(userData?.organization_name)
//                             ? String(userData.organization_name)[0]
//                             : String(userData.org)[0]}
//                         </div>
//                         <div className="text-left">
//                           <p className={`font-semibold ${palette.text} text-sm`}>
//                             {userData.organization_name || `Organization ${userData.org}`}
//                           </p>
//                           <p className={`text-xs ${palette.mutedText}`}>
//                             Org ID: {userData.org}
//                           </p>
//                         </div>
//                       </div>
//                       <IoMdArrowDropdown
//                         size={18}
//                         className={`${palette.icon} transition-transform duration-300 group-hover:rotate-180 ${manage ? "rotate-180" : ""}`}
//                       />
//                     </button>
//                   )}

//                   {/* Management Dropdown */}
//                   {manage && (
//                     <div className={`absolute top-full left-0 right-0 mt-2 ${palette.card} rounded-2xl ${palette.border} border shadow-2xl p-4 z-50 transform animate-in slide-in-from-top-2 duration-300`}>
//                       <button
//                         className={`w-full ${palette.primaryBtn} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg`}
//                         onClick={() => alert("Organization management coming soon!")}
//                       >
//                         <FiSettings size={14} />
//                         Manage Organization
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {organizationDetails.error && (
//                 <div className={`p-3 bg-red-500/10 border border-red-500/20 rounded-xl`}>
//                   <p className="text-red-400 text-sm">{organizationDetails.error}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="h-4"></div>
//         </div>

//         {/* Action Buttons */}
//         <div className={`${palette.card} ${palette.border} border-t rounded-b-3xl p-4 flex-shrink-0`}>
//           <div className="grid grid-cols-2 gap-3">
//             <button
//               className={`${palette.primaryBtn} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg text-sm`}
//               onClick={() => alert("Account details feature coming soon!")}
//             >
//               <FiUser size={14} />
//               My Account
//             </button>
//             <button
//               className={`${palette.dangerBtn} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg text-sm`}
//               onClick={handleSignOut}
//             >
//               <FiLogOut size={14} />
//               Sign Out
//             </button>
//           </div>
//         </div>
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
//       </div>
//     </Drawer>
//   );
// }

// export default Profile;

import React, { useEffect, useRef, useState } from "react";
import Drawer from "./Drawer";
import profile from "../../src/Images/profile.jpg";
import { CiCircleQuestion } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { organnizationInstance } from "../api/axiosInstance";
 // Update this import path

function Profile({ onClose }) {
  const [manage, setManage] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
const [hydrated, setHydrated] = useState(false);

  const [userData, setUserData] = useState(null);
  const [accesses, setAccesses] = useState([]);

  // New state for organization/company/entity details
  const [organizationDetails, setOrganizationDetails] = useState({
    organization: null,
    company: null,
    entity: null,
    loading: true,
    error: null,
  });

  // --- THEME PALETTE ---
  const palette =
    theme === "dark"
      ? {
          bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
          card: "bg-slate-800/80 backdrop-blur-xl border-slate-700/50",
          innerCard: "bg-slate-700/50 backdrop-blur-lg border-slate-600/30",
          border: "border-slate-700/50",
          text: "text-slate-100",
          subtext: "text-slate-300",
          mutedText: "text-slate-400",
          accent: "bg-gradient-to-r from-blue-500 to-purple-600",
          accentHover: "hover:from-blue-400 hover:to-purple-500",
          primaryBtn:
            "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500",
          dangerBtn:
            "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500",
          icon: "text-blue-400",
          surface: "bg-slate-800/60",
          glassmorphism: "bg-white/5 backdrop-blur-xl border-white/10",
        }
      : {
          bg: "bg-gradient-to-br from-gray-50 via-white to-gray-50",
          card: "bg-white/90 backdrop-blur-xl border-gray-200/50 shadow-xl",
          innerCard: "bg-gray-50/80 backdrop-blur-lg border-gray-200/30",
          border: "border-gray-200/50",
          text: "text-gray-900",
          subtext: "text-gray-600",
          mutedText: "text-gray-500",
          accent: "bg-gradient-to-r from-blue-600 to-purple-600",
          accentHover: "hover:from-blue-500 hover:to-purple-500",
          primaryBtn:
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500",
          dangerBtn:
            "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500",
          icon: "text-blue-500",
          surface: "bg-gray-50/80",
          glassmorphism: "bg-white/40 backdrop-blur-xl border-white/20",
        };

  // Function to fetch organization/company/entity details using organnizationInstance
  const fetchOrganizationDetails = async (userData) => {
    if (!userData) return;

    try {
      setOrganizationDetails((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const results = {};

      // Fetch organization details if org ID exists
      if (userData.org) {
        try {
          console.log("Fetching organization with ID:", userData.org);
          const orgResponse = await organnizationInstance.get(
            `organizations/${userData.org}/`
          );
          console.log(
            "Organization response:",
            orgResponse.status,
            orgResponse.data
          );
          results.organization = orgResponse.data;
        } catch (error) {
          console.warn(
            "Error fetching organization:",
            error.response?.status,
            error.message
          );
        }
      }

      // Fetch company details if company ID exists
      if (userData.company_id || userData.company) {
        const companyId = userData.company_id || userData.company;
        try {
          console.log("Fetching company with ID:", companyId);
          const companyResponse = await organnizationInstance.get(
            `companies/${companyId}/`
          );
          console.log(
            "Company response:",
            companyResponse.status,
            companyResponse.data
          );
          results.company = companyResponse.data;
        } catch (error) {
          console.warn(
            "Error fetching company:",
            error.response?.status,
            error.message
          );
        }
      }

      // Fetch entity details if entity ID exists
      if (userData.entity_id || userData.entity) {
        const entityId = userData.entity_id || userData.entity;
        try {
          console.log("Fetching entity with ID:", entityId);
          const entityResponse = await organnizationInstance.get(
            `entities/${entityId}/`
          );
          console.log(
            "Entity response:",
            entityResponse.status,
            entityResponse.data
          );
          results.entity = entityResponse.data;
        } catch (error) {
          console.warn(
            "Error fetching entity:",
            error.response?.status,
            error.message
          );
        }
      }

      setOrganizationDetails({
        ...results,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching organization details:", error);
      setOrganizationDetails((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load organization details",
      }));
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("USER_DATA");
    if (userString && userString !== "undefined") {
      const parsedUserData = JSON.parse(userString);
      setUserData(parsedUserData);
      // Fetch organization details when user data is loaded
      fetchOrganizationDetails(parsedUserData);
    }
    
    const accessString = localStorage.getItem("ACCESSES");
    if (accessString && accessString !== "undefined") {
      try {
        setAccesses(JSON.parse(accessString));
      } catch (e) {
        setAccesses([]);
      }
    }
    setHydrated(true);
  }, []);

useEffect(() => {
  if (hydrated && !userData) {
    navigate("/login", { replace: true });
  }
}, [hydrated, userData, navigate]);

  // Extract unique roles
  let allRoles = [];
  if (Array.isArray(accesses)) {
    accesses.forEach((access) => {
      if (access.roles && Array.isArray(access.roles)) {
        access.roles.forEach((role) => {
          const roleStr = typeof role === "string" ? role : role?.role;
          if (roleStr && !allRoles.includes(roleStr)) {
            allRoles.push(roleStr);
          }
        });
      }
    });
  }

  

let role = "User";

if (userData?.superadmin || userData?.is_staff) {
  role = "Super Admin";
} else if (userData?.is_client) {
  role = "Admin";
} else if (userData?.is_manager) {
  role = "Manager";
} else if (allRoles.length > 0) {
  // Remove duplicates and join roles
  const uniqueRoles = [...new Set(allRoles)];
  role = uniqueRoles.join(", ");
} else {
  role = "User";
}



  useEffect(() => {
    localStorage.setItem("ROLE", role);
  }, [role]);

  // Dropdown outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setManage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sign out logic
  const handleSignOut = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("USER_DATA");
    localStorage.removeItem("ACCESSES");
    localStorage.removeItem("ROLE");
    navigate("/login");
    if (typeof onClose === "function") onClose();
  };

  // Helper function to check if contact data exists
  const hasContactData = () => {
    return (
      isValidString(userData?.email) ||
      isValidString(userData?.phone_number) ||
      isValidString(userData?.date_joined) ||
      isValidString(userData?.last_login)
    );
  };

  // Helper function to safely check string values
  const isValidString = (value) => {
    return value && String(value).trim() !== "";
  };

  // Function to check if we have any organization/company/entity to display
  const hasOrganizationData = () => {
    return (
      organizationDetails.organization ||
      organizationDetails.company ||
      organizationDetails.entity ||
      isValidString(userData?.org)
    );
  };

  return (
    <Drawer onClose={onClose}>
      <div
        className={`w-full max-w-md mx-auto ${palette.bg} rounded-3xl overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col`}
      >
        {/* Header with Profile Picture */}
        <div
          className={`relative ${palette.card} ${palette.border} border rounded-t-3xl p-6 pb-4 flex-shrink-0`}
        >
          <div className="flex flex-col items-center">
            {/* Profile Picture with Modern Ring */}
            <div className="relative group">
              <div
                className={`absolute -inset-1 ${palette.accent} rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500`}
              ></div>
              <div className="relative">
                <img
                  src={profile}
                  alt="profile"
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-2xl transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>

            {/* User Name & ID */}
            <div className="text-center mt-4 space-y-2">
              {isValidString(userData?.username) && (
                <h2
                  className={`text-xl font-bold ${palette.text} tracking-tight`}
                >
                  {userData.username}
                </h2>
              )}
              {isValidString(userData?.user_id) && (
                <div
                  className={`flex items-center justify-center gap-2 ${palette.subtext}`}
                >
                  <FiUser size={14} />
                  <span className="text-sm font-medium">
                    ID: {userData.user_id}
                  </span>
                  <CiCircleQuestion
                    size={14}
                    className={`${palette.icon} hover:scale-110 transition-transform cursor-help`}
                  />
                </div>
              )}
            </div>

            {/* Role Badge */}
            <div className="mt-3">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 ${palette.accent} text-white rounded-full text-sm font-semibold shadow-lg transform hover:scale-105 transition-all duration-300`}
              >
                <FiShield size={14} />
                {role}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div
          className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Project Roles Section */}
          {accesses?.length > 0 && (
            <div
              className={`${palette.innerCard} ${palette.border} border rounded-2xl p-4`}
            >
              <div className={`flex items-center gap-2 mb-3 ${palette.text}`}>
                <FiBriefcase size={16} className={palette.icon} />
                <h3 className="font-semibold text-sm">Project Access</h3>
              </div>
              <div className="space-y-2">
                {accesses.slice(0, 3).map(
                  (access, idx) =>
                    isValidString(access.project_id) && (
                      <div
                        key={idx}
                        className={`${palette.glassmorphism} rounded-xl p-3 ${palette.border} border`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${palette.text} text-sm`}
                          >
                            Project {access.project_id}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {access.roles?.slice(0, 2).map((role, j) => {
                              const roleStr =
                                typeof role === "string" ? role : role?.role;
                              return isValidString(roleStr) ? (
                                <span
                                  key={j}
                                  className={`px-2 py-1 ${palette.accent} text-white rounded-lg text-xs font-medium shadow-sm`}
                                >
                                  {roleStr}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                    )
                )}
                {accesses.length > 3 && (
                  <div className={`text-center ${palette.mutedText} text-xs`}>
                    +{accesses.length - 3} more projects
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Information */}
          {hasContactData() && (
            <div
              className={`${palette.innerCard} ${palette.border} border rounded-2xl p-4`}
            >
              <h3
                className={`font-semibold ${palette.text} mb-3 flex items-center gap-2 text-sm`}
              >
                <FiMail size={16} className={palette.icon} />
                Contact Details
              </h3>
              <div className="space-y-2">
                {isValidString(userData?.email) && (
                  <div
                    className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                  >
                    <FiMail size={14} className={palette.icon} />
                    <div>
                      <p
                        className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                      >
                        Email
                      </p>
                      <p className={`${palette.text} font-medium text-sm`}>
                        {userData.email}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.phone_number) && (
                  <div
                    className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                  >
                    <FiPhone size={14} className={palette.icon} />
                    <div>
                      <p
                        className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                      >
                        Phone
                      </p>
                      <p className={`${palette.text} font-medium text-sm`}>
                        {userData.phone_number}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.date_joined) && (
                  <div
                    className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                  >
                    <FiCalendar size={14} className={palette.icon} />
                    <div>
                      <p
                        className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                      >
                        Joined
                      </p>
                      <p className={`${palette.text} font-medium text-sm`}>
                        {userData.date_joined}
                      </p>
                    </div>
                  </div>
                )}
                {isValidString(userData?.last_login) && (
                  <div
                    className={`flex items-center gap-3 p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                  >
                    <FiClock size={14} className={palette.icon} />
                    <div>
                      <p
                        className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                      >
                        Last Login
                      </p>
                      <p className={`${palette.text} font-medium text-sm`}>
                        {userData.last_login}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Organization Section */}
          {hasOrganizationData() && (
            <div
              className={`${palette.innerCard} ${palette.border} border rounded-2xl p-4 relative`}
              ref={dropdownRef}
            >
              <h3
                className={`font-semibold ${palette.text} mb-3 flex items-center gap-2 text-sm`}
              >
                <FiBriefcase size={16} className={palette.icon} />
                Organization Details
              </h3>

              {organizationDetails.loading ? (
                <div
                  className={`flex items-center justify-center p-4 ${palette.glassmorphism} rounded-xl ${palette.border} border`}
                >
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className={`ml-2 ${palette.mutedText} text-sm`}>
                    Loading...
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Organization */}
                  {organizationDetails.organization && (
                    <div
                      className={`p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}
                        >
                          {organizationDetails.organization.organization_name
                            ? organizationDetails.organization
                                .organization_name[0]
                            : "O"}
                        </div>
                        <div>
                          <p
                            className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                          >
                            Organization
                          </p>
                          <p
                            className={`font-semibold ${palette.text} text-sm`}
                          >
                            {organizationDetails.organization
                              .organization_name || `Org ${userData.org}`}
                          </p>
                          {organizationDetails.organization.contact_email && (
                            <p className={`text-xs ${palette.mutedText}`}>
                              {organizationDetails.organization.contact_email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Company */}
                  {organizationDetails.company && (
                    <div
                      className={`p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}
                        >
                          {organizationDetails.company.name
                            ? organizationDetails.company.name[0]
                            : "C"}
                        </div>
                        <div>
                          <p
                            className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                          >
                            Company
                          </p>
                          <p
                            className={`font-semibold ${palette.text} text-sm`}
                          >
                            {organizationDetails.company.name}
                          </p>
                          {(organizationDetails.company.region ||
                            organizationDetails.company.country) && (
                            <p className={`text-xs ${palette.mutedText}`}>
                              {[
                                organizationDetails.company.region,
                                organizationDetails.company.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Entity */}
                  {organizationDetails.entity && (
                    <div
                      className={`p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}
                        >
                          {organizationDetails.entity.name
                            ? organizationDetails.entity.name[0]
                            : "E"}
                        </div>
                        <div>
                          <p
                            className={`text-xs ${palette.mutedText} uppercase tracking-wide`}
                          >
                            Entity
                          </p>
                          <p
                            className={`font-semibold ${palette.text} text-sm`}
                          >
                            {organizationDetails.entity.name}
                          </p>
                          {(organizationDetails.entity.state ||
                            organizationDetails.entity.region ||
                            organizationDetails.entity.zone) && (
                            <p className={`text-xs ${palette.mutedText}`}>
                              {[
                                organizationDetails.entity.state,
                                organizationDetails.entity.region,
                                organizationDetails.entity.zone,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback to org ID if no names were fetched but org exists */}
                  {!organizationDetails.organization &&
                    !organizationDetails.company &&
                    !organizationDetails.entity &&
                    isValidString(userData?.org) && (
                      <button
                        onClick={() => setManage(!manage)}
                        className={`w-full flex items-center justify-between p-3 ${palette.glassmorphism} rounded-xl ${palette.border} border hover:scale-[1.02] transition-all duration-300 group`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 ${palette.accent} text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-lg`}
                          >
                            {isValidString(userData?.organization_name)
                              ? String(userData.organization_name)[0]
                              : String(userData.org)[0]}
                          </div>
                          <div className="text-left">
                            <p
                              className={`font-semibold ${palette.text} text-sm`}
                            >
                              {userData.organization_name ||
                                `Organization ${userData.org}`}
                            </p>
                            <p className={`text-xs ${palette.mutedText}`}>
                              Org ID: {userData.org}
                            </p>
                          </div>
                        </div>
                        <IoMdArrowDropdown
                          size={18}
                          className={`${
                            palette.icon
                          } transition-transform duration-300 group-hover:rotate-180 ${
                            manage ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                  {/* Management Dropdown */}
                  {manage && (
                    <div
                      className={`absolute top-full left-0 right-0 mt-2 ${palette.card} rounded-2xl ${palette.border} border shadow-2xl p-4 z-50 transform animate-in slide-in-from-top-2 duration-300`}
                    >
                      <button
                        className={`w-full ${palette.primaryBtn} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg`}
                        onClick={() =>
                          alert("Organization management coming soon!")
                        }
                      >
                        <FiSettings size={14} />
                        Manage Organization
                      </button>
                    </div>
                  )}
                </div>
              )}

              {organizationDetails.error && (
                <div
                  className={`p-3 bg-red-500/10 border border-red-500/20 rounded-xl`}
                >
                  <p className="text-red-400 text-sm">
                    {organizationDetails.error}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="h-4"></div>
        </div>

        {/* Action Buttons */}
        <div
          className={`${palette.card} ${palette.border} border-t rounded-b-3xl p-4 flex-shrink-0`}
        >
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`${palette.primaryBtn} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg text-sm`}
              onClick={() => alert("Account details feature coming soon!")}
            >
              <FiUser size={14} />
              My Account
            </button>
            <button
              className={`${palette.dangerBtn} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg text-sm`}
              onClick={handleSignOut}
            >
              <FiLogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
      </div>
    </Drawer>
  );
}

export default Profile;