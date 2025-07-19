import React, { useEffect, useState } from "react";
import axios from "axios";
import SiteBarSetup from "./SideBarSetup";
import { useTheme } from "../ThemeContext";

// API endpoints (edit as per your backend)
const API_URL = "https://konstruct.world/projects/all-purposes/";
const CLIENT_USERS_URL = "https://konstruct.world/users/clients/";
const CLIENT_PURPOSE_URL = "https://konstruct.world/projects/client-purpose/"; // assign
const CLIENT_PURPOSE_DETAIL_URL = (userId) => `https://konstruct.world/projects/client-purpose/${userId}/`; // view assigned
const CLIENT_PURPOSE_SOFT_DELETE_URL = (assignmentId) => `https://konstruct.world/projects/client-purpose/${assignmentId}/soft-delete/`; // remove assigned

function PurposeCenter() {
  const { theme } = useTheme();
  const [tab, setTab] = useState("manage");

  // Purposes
  const [purposes, setPurposes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState("");

  // Mapping
  const [users, setUsers] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [assignStatus, setAssignStatus] = useState({});
  const [selectedPurposes, setSelectedPurposes] = useState({});
  const [assignedPurposes, setAssignedPurposes] = useState({});
  const [viewingUserId, setViewingUserId] = useState(null);

  // Theme palette
  const palette = theme === "dark"
    ? {
        bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
        card: "bg-slate-800/80 backdrop-blur-sm border-slate-700",
        cardAlt: "bg-slate-700/60",
        text: "text-white",
        textSecondary: "text-slate-300",
        textMuted: "text-slate-400",
        accent: "text-amber-400",
        accentBg: "bg-amber-500",
        border: "border-slate-700",
        hover: "hover:bg-slate-700/50"
      }
    : {
        bg: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50",
        card: "bg-white/90 backdrop-blur-sm border-orange-200",
        cardAlt: "bg-orange-50/80",
        text: "text-gray-900",
        textSecondary: "text-gray-700",
        textMuted: "text-gray-500",
        accent: "text-orange-600",
        accentBg: "bg-orange-500",
        border: "border-orange-200",
        hover: "hover:bg-orange-50"
      };

  // Fetch all purposes
  const fetchPurposes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurposes(res.data);
    } catch (e) {
      setError("Failed to load purposes.");
    }
    setLoading(false);
  };

  // Fetch client users
  const fetchClientUsers = async () => {
    setMapLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await axios.get(CLIENT_USERS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (e) {
      setError("Failed to load users.");
    }
    setMapLoading(false);
  };

  // Fetch assigned purposes for a client (uses /client-purpose/<client_id>/ endpoint)
  const fetchAssignedPurposes = async (userId) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      const res = await axios.get(
        CLIENT_PURPOSE_DETAIL_URL(userId),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignedPurposes((prev) => ({
        ...prev,
        [userId]: res.data
      }));
    } catch (e) {
      setAssignedPurposes((prev) => ({
        ...prev,
        [userId]: []
      }));
    }
  };

  useEffect(() => {
    if (tab === "manage") fetchPurposes();
    if (tab === "map") fetchClientUsers();
  }, [tab]);

  // Add new purpose
  const handleAddPurpose = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAddLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      await axios.post(API_URL, { name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Purpose added successfully!");
      setName("");
      fetchPurposes();
    } catch (e) {
      if (e.response && e.response.status === 400 && e.response.data?.name?.[0]) {
        setError(e.response.data.name[0]);
      } else {
        setError("Failed to add purpose.");
      }
    }
    setAddLoading(false);
  };

  // Multi-select for mapping
  const handleSelectChange = (userId, selectedOptions) => {
    setSelectedPurposes(prev => ({
      ...prev,
      [userId]: Array.from(selectedOptions, option => Number(option.value)),
    }));
  };

  // Assign purposes to user
  const handleAssign = async (userId) => {
    const purposeIds = selectedPurposes[userId];
    if (!purposeIds || purposeIds.length === 0) return;
    setAssignStatus(prev => ({ ...prev, [userId]: "assigning" }));
    setError("");
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      // Assign multiple purposes
      const promises = purposeIds.map(purposeId =>
        axios.post(
          CLIENT_PURPOSE_URL,
          { client_id: userId, purpose_id: purposeId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(promises);
      setAssignStatus(prev => ({ ...prev, [userId]: "success" }));
      fetchAssignedPurposes(userId);
      setTimeout(() => {
        setAssignStatus(prev => ({ ...prev, [userId]: undefined }));
      }, 3000);
    } catch (e) {
      setAssignStatus(prev => ({ ...prev, [userId]: "error" }));
    }
  };

  // Remove (soft delete) assigned purpose by assignmentId
  const handleRemovePurpose = async (userId, assignmentId) => {
    if (!window.confirm("Remove this purpose from client?")) return;
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      await axios.patch(
        CLIENT_PURPOSE_SOFT_DELETE_URL(assignmentId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAssignedPurposes(userId);
    } catch (e) {
      alert("Failed to remove purpose.");
    }
  };

  return (
    <div className={`flex min-h-screen ${palette.bg}`}>
      <SiteBarSetup />
      <div className="flex-1 flex flex-col mt-5 ml-[16%] px-6 w-[84%]">
        <div className="max-w-4xl mx-auto pt-2">
          {/* Tab Switch */}
          <div className="flex gap-2 mb-10 justify-center">
            <button
              className={`px-7 py-3 text-lg rounded-t-xl font-semibold border-b-2 transition-all ${
                tab === "manage"
                  ? `bg-white shadow-lg border-orange-500 text-orange-600`
                  : `bg-orange-50 border-transparent text-gray-400`
              }`}
              onClick={() => setTab("manage")}
            >
              🎯 Purpose Management
            </button>
            <button
              className={`px-7 py-3 text-lg rounded-t-xl font-semibold border-b-2 transition-all ${
                tab === "map"
                  ? `bg-white shadow-lg border-orange-500 text-orange-600`
                  : `bg-orange-50 border-transparent text-gray-400`
              }`}
              onClick={() => setTab("map")}
            >
              🔗 Purpose Mapping
            </button>
          </div>

          {/* --- Purpose Management Tab --- */}
          {tab === "manage" && (
            <div className={`${palette.card} border ${palette.border} rounded-2xl shadow-xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-3 h-3 rounded-full ${palette.accentBg}`}></div>
                <h2 className={`text-2xl font-bold ${palette.accent}`}>
                  Create New Purpose
                </h2>
              </div>
              <form className="space-y-4" onSubmit={handleAddPurpose}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className={`block text-sm font-medium ${palette.textSecondary} mb-2`}>
                      Purpose Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter purpose name"
                      className={`w-full px-4 py-3 rounded-xl border ${palette.border} ${palette.card} ${palette.text} focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none`}
                      required
                      disabled={addLoading}
                    />
                  </div>
                  <div className="sm:flex-shrink-0 sm:self-end">
                    <button
                      type="submit"
                      disabled={addLoading || !name.trim()}
                      className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 flex items-center gap-2"
                    >
                      {addLoading ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <span>➕</span>
                          Add Purpose
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <span className="text-red-700">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <span className="text-green-500 text-lg">✅</span>
                    <span className="text-green-700">{success}</span>
                  </div>
                )}
              </form>
              {/* Purpose List */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-2 h-2 rounded-full ${palette.accentBg}`}></div>
                  <h3 className={`text-xl font-semibold ${palette.accent}`}>
                    Existing Purposes ({purposes.length})
                  </h3>
                </div>
                {loading ? (
                  <div className="py-8 text-center text-gray-500">Loading...</div>
                ) : (
                  <div className={`${palette.cardAlt} rounded-xl overflow-hidden border ${palette.border}`}>
                    {purposes.length === 0 ? (
                      <div className="text-center py-12">
                        <div className={`text-6xl ${palette.textMuted} mb-4`}>📋</div>
                        <p className={`${palette.textMuted} text-lg`}>No purposes created yet</p>
                        <p className={`${palette.textMuted} text-sm mt-2`}>Add your first purpose above to get started</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`${palette.card} border-b ${palette.border}`}>
                              <th className={`py-4 px-6 text-left text-sm font-semibold ${palette.textSecondary} uppercase tracking-wider`}>#</th>
                              <th className={`py-4 px-6 text-left text-sm font-semibold ${palette.textSecondary} uppercase tracking-wider`}>Purpose Name</th>
                              <th className={`py-4 px-6 text-left text-sm font-semibold ${palette.textSecondary} uppercase tracking-wider`}>Created Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {purposes.map((purpose, idx) => (
                              <tr key={purpose.id} className={`${palette.hover} transition-colors`}>
                                <td className={`py-4 px-6 text-sm ${palette.textMuted}`}>{String(idx + 1).padStart(2, '0')}</td>
                                <td className={`py-4 px-6`}><span className={`font-medium ${palette.text}`}>{purpose.name}</span></td>
                                <td className={`py-4 px-6 text-sm ${palette.textSecondary}`}>
                                  {new Date(purpose.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- Purpose Mapping Tab --- */}
          {tab === "map" && (
            <div className={`${palette.card} border ${palette.border} rounded-2xl shadow-xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-3 h-3 rounded-full ${palette.accentBg}`}></div>
                <h2 className={`text-2xl font-bold ${palette.accent}`}>
                  Assign and Manage Purposes for Clients
                </h2>
              </div>
              {mapLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"></div>
                  <span className={`ml-3 ${palette.textSecondary}`}>Loading clients...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`text-6xl ${palette.textMuted} mb-4`}>👥</div>
                  <p className={`${palette.textMuted} text-lg`}>No clients found</p>
                  <p className={`${palette.textMuted} text-sm mt-2`}>Add clients to start assigning purposes</p>
                </div>
              ) : (
                <div className={`${palette.cardAlt} rounded-xl overflow-hidden border ${palette.border}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${palette.card} border-b ${palette.border}`}>
                          <th className={`py-4 px-6 text-left text-sm font-semibold ${palette.textSecondary} uppercase tracking-wider`}>Client</th>
                          <th className={`py-4 px-6 text-left text-sm font-semibold ${palette.textSecondary} uppercase tracking-wider`}>Map Purposes</th>
                          <th className={`py-4 px-6 text-left text-sm font-semibold ${palette.textSecondary} uppercase tracking-wider`}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                          <tr key={user.id} className={`${palette.hover} transition-colors`}>
                            <td className={`py-6 px-6`}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                                  {(user.username || user.email || user.name || "U").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className={`font-semibold ${palette.text}`}>{user.username || user.name || "Unknown User"}</div>
                                  {user.email && (
                                    <div className={`text-sm ${palette.textMuted}`}>{user.email}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-6 px-6">
                              <select
                                multiple
                                className="w-full p-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-200"
                                style={{ minHeight: "80px", background: theme === "dark" ? "#23232e" : "#fff", color: palette.text }}
                                value={selectedPurposes[user.id] || []}
                                onChange={e => handleSelectChange(user.id, e.target.selectedOptions)}
                              >
                                {purposes.map(purpose => (
                                  <option key={purpose.id} value={purpose.id}>
                                    {purpose.name}
                                  </option>
                                ))}
                              </select>
                              <div className="text-xs text-gray-400 mt-1">
                                Hold <b>Ctrl</b> (Windows) or <b>Cmd</b> (Mac) to select multiple
                              </div>
                              {(selectedPurposes[user.id] || []).length > 0 && (
                                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                                  {selectedPurposes[user.id].length} purpose(s) selected
                                </div>
                              )}
                            </td>
                            <td className="py-6 px-6 flex flex-col gap-2">
                              <button
                                disabled={
                                  !(selectedPurposes[user.id] && selectedPurposes[user.id].length > 0) ||
                                  assignStatus[user.id] === "assigning"
                                }
                                onClick={() => handleAssign(user.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                                  assignStatus[user.id] === "assigning"
                                    ? "bg-yellow-500 text-white cursor-not-allowed"
                                    : assignStatus[user.id] === "success"
                                    ? "bg-green-500 text-white"
                                    : assignStatus[user.id] === "error"
                                    ? "bg-red-500 text-white"
                                    : (selectedPurposes[user.id] && selectedPurposes[user.id].length > 0)
                                    ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                {assignStatus[user.id] === "assigning" ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Assigning...
                                  </>
                                ) : assignStatus[user.id] === "success" ? (
                                  <>
                                    <span>✅</span>
                                    Assigned
                                  </>
                                ) : assignStatus[user.id] === "error" ? (
                                  <>
                                    <span>❌</span>
                                    Error
                                  </>
                                ) : (
                                  <>
                                    <span>🎯</span>
                                    Assign ({(selectedPurposes[user.id] || []).length})
                                  </>
                                )}
                              </button>
                              <button
                                className="text-sm text-blue-600 underline hover:text-blue-900 mt-2"
                                onClick={() => {
                                  setViewingUserId(viewingUserId === user.id ? null : user.id);
                                  if (viewingUserId !== user.id) fetchAssignedPurposes(user.id);
                                }}
                              >
                                {viewingUserId === user.id ? "Hide Assigned" : "View Assigned"}
                              </button>
                              {viewingUserId === user.id && (
                                <div className="mt-2 rounded border p-2 bg-orange-50 dark:bg-slate-700">
                                  <div className="font-bold text-xs mb-1">Assigned Purposes:</div>
                                  {Array.isArray(assignedPurposes[user.id]) && assignedPurposes[user.id].length === 0 ? (
                                    <div className="text-gray-400 text-xs">No purposes assigned</div>
                                  ) : (
                                    <ul className="text-xs space-y-1">
                                      {assignedPurposes[user.id]?.map(ap => (
                                        <li key={ap.id} className="flex items-center justify-between">
                                          <span>{ap.purpose_name || ap.name}</span>
                                          <button
                                            className="ml-2 px-2 py-1 text-xs rounded bg-red-200 hover:bg-red-400 text-red-900"
                                            onClick={() => handleRemovePurpose(user.id, ap.id)}
                                          >Remove</button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PurposeCenter;
