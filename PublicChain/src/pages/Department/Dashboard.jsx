import DepartmentSidebar from "./DepartmentSidebar";
import { useEffect, useState } from "react";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

export default function DepartmentDashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // NEW: project details modal state
  const [selectedProject, setSelectedProject] = useState(null); // NEW

  // NEW: feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const res = await api.get("/api/me");
        if (mounted) setUser(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function fetchDepartmentProjects() {
      try {
        if (!user || !user.department_name) return;
        const res = await api.get(
          `/api/projects?department=${encodeURIComponent(user.department_name)}`
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    }

    async function fetchDepartmentFeedbacks() {
      try {
        if (!user || !user.department_name) return;
        const res = await api.get(
          `/api/feedbacks?department=${encodeURIComponent(
            user.department_name
          )}`
        );
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        console.error(err);
        setFeedbacks([]);
      }
    }

    fetchProfile();

    // When user is loaded, fetch projects + feedbacks
    if (user && user.department_name) {
      fetchDepartmentProjects();
      fetchDepartmentFeedbacks();
    }

    return () => {
      mounted = false;
    };
  }, [navigate, user]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // ---- Stats ----
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter(
    (p) => p.status && p.status.toLowerCase() === "ongoing"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status && p.status.toLowerCase() === "completed"
  ).length;
  const totalBudget = projects.reduce(
    (sum, p) => sum + (parseFloat(p.budget) || 0),
    0
  );
  const verifiedProjects = projects.filter(
    (p) => p.blockchain_verify === 1
  ).length;
  const unresolvedFeedbacks = feedbacks.filter((f) => !f.resolved).length;
  const resolvedFeedbacks = feedbacks.filter((f) => f.resolved).length;

  // Use ViewAllProjects logic for sorting and filtering
  const recentProjects = [...projects]
    .sort((a, b) => {
      // Sort by start_date (desc), fallback to created_at
      const da = a.start_date
        ? new Date(a.start_date).getTime()
        : a.created_at
        ? new Date(a.created_at).getTime()
        : 0;
      const db = b.start_date
        ? new Date(b.start_date).getTime()
        : b.created_at
        ? new Date(b.created_at).getTime()
        : 0;
      return db - da;
    })
    .slice(0, 5);

  const recentFeedbacks = [...feedbacks]
    .sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);

  // open feedback details modal
  function handleViewFeedbackDetails(fb) {
    setActiveFeedback(fb);
    setShowFeedbackModal(true);
  }

  // NEW: open project details modal
  function handleViewProjectDetails(project) {
    setSelectedProject(project);
  }

  // helper to get feedback text
  function getFeedbackText(f) {
    return f.feedback || f.message || f.comment || "No message provided.";
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      <DepartmentSidebar />

      {/* Main area fills remaining space (full width next to sidebar) */}
      <main className="flex-1 w-full max-w-full p-8 overflow-x-hidden">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-300">
            Department Dashboard
          </h1>
          <button
            className="ml-4 p-2 rounded-full bg-blue-900 hover:bg-blue-700 shadow-lg border border-blue-400/40"
            onClick={() => setShowProfile(true)}
            title="View Profile"
          >
            <svg
              className="w-8 h-8 text-blue-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 20c0-2.5 3-4 6-4s6 1.5 6 4"
              />
            </svg>
          </button>
        </div>

        {/* Profile Popup Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-blue-400/30 relative animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold focus:outline-none"
                onClick={() => setShowProfile(false)}
                title="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-blue-200 mb-6 text-center">
                Profile
              </h2>
              {loading ? (
                <div className="text-blue-300">Loading profile...</div>
              ) : user ? (
                <div className="space-y-4 text-blue-100">
                  <div className="flex items-center gap-4">
                    <svg
                      className="w-14 h-14 text-blue-300"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 20c0-2.5 3-4 6-4s6 1.5 6 4"
                      />
                    </svg>
                    <div>
                      <div className="font-bold text-xl">{user.name}</div>
                      <div className="text-blue-300 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="font-semibold">Role:</span> {user.role}
                    </div>
                    <div>
                      <span className="font-semibold">Department:</span>{" "}
                      {user.department_name}
                    </div>
                    <div>
                      <span className="font-semibold">Type:</span>{" "}
                      {user.department_type}
                    </div>
                    <div>
                      <span className="font-semibold">Contact:</span>{" "}
                      {user.contact_number}
                    </div>
                  </div>
                  <div className="text-xs text-blue-300 mt-4 text-center">
                    Member since:{" "}
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "N/A"}
                  </div>
                  <button
                    onClick={logout}
                    className="w-full mt-6 text-sm text-red-400 font-bold px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-900/60 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="text-red-300">No user data</div>
              )}
            </div>
          </div>
        )}

        {/* ---- Stats widgets ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-blue-400/30">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">
              Total Projects
            </h2>
            <p className="text-3xl font-extrabold text-blue-200 mb-2">
              {totalProjects}
            </p>
            <p className="text-gray-300">
              All projects managed by your department.
            </p>
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-green-400/30">
            <h2 className="text-2xl font-bold text-green-300 mb-2">
              Ongoing Projects
            </h2>
            <p className="text-3xl font-extrabold text-green-200 mb-2">
              {ongoingProjects}
            </p>
            <p className="text-gray-300">Projects currently in progress.</p>
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-indigo-400/30">
            <h2 className="text-2xl font-bold text-indigo-300 mb-2">
              Completed Projects
            </h2>
            <p className="text-3xl font-extrabold text-indigo-200 mb-2">
              {completedProjects}
            </p>
            <p className="text-gray-300">Projects marked as completed.</p>
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-yellow-400/30">
            <h2 className="text-2xl font-bold text-yellow-300 mb-2">
              Total Budget
            </h2>
            <p className="text-3xl font-extrabold text-yellow-200 mb-2">
              ₹{totalBudget.toLocaleString()}
            </p>
            <p className="text-gray-300">
              Total budget allocated to your projects.
            </p>
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-blue-400/30">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">
              Verified Projects
            </h2>
            <p className="text-3xl font-extrabold text-blue-200 mb-2">
              {verifiedProjects}
            </p>
            <p className="text-gray-300">Projects verified on blockchain.</p>
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-green-400/30">
            <h2 className="text-2xl font-bold text-green-300 mb-2">
              Unresolved Feedbacks
            </h2>
            <p className="text-3xl font-extrabold text-green-200 mb-2">
              {unresolvedFeedbacks}
            </p>
            <p className="text-gray-300">Feedbacks/issues not yet resolved.</p>
          </div>

          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-indigo-400/30">
            <h2 className="text-2xl font-bold text-indigo-300 mb-2">
              Resolved Feedbacks
            </h2>
            <p className="text-3xl font-extrabold text-indigo-200 mb-2">
              {resolvedFeedbacks}
            </p>
            <p className="text-gray-300">
              Feedbacks/issues marked as resolved.
            </p>
          </div>
        </div>

        {/* Recent Projects + Recent Feedbacks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-blue-400/30">
            {/* NEW: header with View All Projects button */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-blue-300">
                Recent Projects
              </h2>
              <button
                className="text-sm text-blue-300 underline hover:text-blue-100"
                onClick={() => navigate("/department/projects")} // adjust path if needed
              >
                View All Projects
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <p className="text-gray-300 text-sm">
                No projects found for this department.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map((p) => (
                  <li
                    key={p.id}
                    className="border-b border-gray-700/60 pb-2 last:border-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-blue-100 text-sm">
                          {p.title ||
                            p.name ||
                            p.project_name ||
                            "Untitled Project"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {p.location ? p.location + " • " : ""}
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString()
                            : "No date"}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          p.status && p.status.toLowerCase() === "completed"
                            ? "bg-green-900/60 text-green-200"
                            : p.status && p.status.toLowerCase() === "ongoing"
                            ? "bg-yellow-900/60 text-yellow-200"
                            : "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {p.status || "Unknown"}
                      </span>
                    </div>

                    {/* NEW: View details button for project */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[10px] text-gray-500">
                        {p.start_date && `Start: ${p.start_date}`}
                      </div>
                      <button
                        onClick={() => handleViewProjectDetails(p)}
                        className="text-[11px] underline text-blue-300 hover:text-blue-100"
                      >
                        View details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Feedbacks */}
          <div className="bg-gray-800/70 rounded-2xl p-6 shadow-lg border border-green-400/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-green-300">
                Recent Feedbacks
              </h2>
            </div>
            {recentFeedbacks.length === 0 ? (
              <p className="text-gray-300 text-sm">
                No feedback received yet for this department.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentFeedbacks.map((f) => (
                  <li
                    key={f.id}
                    className="border-b border-gray-700/60 pb-2 last:border-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-blue-100 font-semibold">
                          {f.citizen_name || "Public User"}
                        </div>
                        <div className="text-xs text-gray-300 mt-1 line-clamp-2">
                          {getFeedbackText(f)}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          f.resolved
                            ? "bg-green-900/60 text-green-200"
                            : "bg-red-900/60 text-red-200"
                        }`}
                      >
                        {f.resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[10px] text-gray-500">
                        {(f.created_at || f.submitted_at) &&
                          new Date(
                            f.created_at || f.submitted_at
                          ).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleViewFeedbackDetails(f)}
                        className="text-[11px] underline text-green-300 hover:text-green-100"
                      >
                        View details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* NEW: Project Details Modal (tabular, like DepartmentProjects) */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-blue-400/30 relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-blue-200 hover:text-red-400 text-2xl font-bold"
                onClick={() => setSelectedProject(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-100 mb-4 text-center">
                Project Details
              </h2>
              <table className="w-full text-sm text-blue-200 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-semibold">Project Name</td>
                    <td>
                      {selectedProject.project_name ||
                        selectedProject.title ||
                        selectedProject.name ||
                        "Untitled Project"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Department</td>
                    <td>
                      {selectedProject.department_name ||
                        selectedProject.department_id ||
                        "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Type</td>
                    <td>{selectedProject.type || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Location</td>
                    <td>{selectedProject.location || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Budget</td>
                    <td>
                      {selectedProject.budget
                        ? `₹${selectedProject.budget}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Officer</td>
                    <td>{selectedProject.officer || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Contact</td>
                    <td>{selectedProject.contact || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td>{selectedProject.status || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Start Date</td>
                    <td>{selectedProject.start_date || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">End Date</td>
                    <td>{selectedProject.end_date || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Blockchain Verified</td>
                    <td>
                      {selectedProject.blockchain_verify === 1 ||
                      selectedProject.blockchain_verify === true
                        ? "Yes"
                        : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Description</td>
                    <td>{selectedProject.description || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Details Modal (table style like SubmitFeedback) */}
        {showFeedbackModal && activeFeedback && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-gray-900 text-blue-50 rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative">
              <button
                className="absolute top-4 right-4 text-xl text-gray-400 hover:text-red-400"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setActiveFeedback(null);
                }}
              >
                &times;
              </button>

              <h3 className="text-2xl font-bold text-green-200 mb-4">
                Feedback Details
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-blue-700 rounded-xl text-sm">
                  <thead className="bg-blue-950/60">
                    <tr>
                      <th className="px-4 py-2 border border-blue-800 text-left">
                        Project
                      </th>
                      <th className="px-4 py-2 border border-blue-800 text-left">
                        Citizen
                      </th>
                      <th className="px-4 py-2 border border-blue-800 text-left">
                        Feedback
                      </th>
                      <th className="px-4 py-2 border border-blue-800 text-center">
                        Rating
                      </th>
                      <th className="px-4 py-2 border border-blue-800 text-center">
                        Status
                      </th>
                      <th className="px-4 py-2 border border-blue-800 text-center">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-gray-800/70">
                      <td className="px-4 py-2 border border-blue-800 align-top">
                        {activeFeedback.project ||
                          activeFeedback.project_name ||
                          "-"}
                      </td>
                      <td className="px-4 py-2 border border-blue-800 align-top">
                        {activeFeedback.citizen_name || "Anonymous Citizen"}
                      </td>
                      <td className="px-4 py-2 border border-blue-800 align-top">
                        {getFeedbackText(activeFeedback)}
                      </td>
                      <td className="px-4 py-2 border border-blue-800 text-center align-top">
                        {activeFeedback.rating != null
                          ? activeFeedback.rating
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border border-blue-800 text-center align-top">
                        {activeFeedback.resolved ? "Resolved" : "Pending"}
                      </td>
                      <td className="px-4 py-2 border border-blue-800 text-center align-top">
                        {activeFeedback.created_at ||
                        activeFeedback.submitted_at
                          ? new Date(
                              activeFeedback.created_at ||
                                activeFeedback.submitted_at
                            ).toLocaleString()
                          : "No date"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
