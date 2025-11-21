import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

export default function PublicView() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const navigate = useNavigate();

  // Get all projects from backend
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    }
    fetchProjects();
  }, []);

  // ---- Stats ----
  const totalProjects = projects.length;

  const ongoingProjects = projects.filter(
    (p) => p.status && p.status.toLowerCase() === "ongoing"
  ).length;

  const verifiedProjects = projects.filter(
    (p) => p.blockchain_verify === 1
  ).length;

  const totalBudget = projects.reduce(
    (sum, p) => sum + (parseFloat(p.budget) || 0),
    0
  );

  const stats = [
    { label: "Total Projects", value: totalProjects },
    { label: "Funds Allocated", value: `₹${totalBudget.toLocaleString()}` },
    { label: "Ongoing Projects", value: ongoingProjects },
    { label: "Verified on Blockchain", value: verifiedProjects },
  ];

  const icons = [
    // Total Projects
    <svg
      key="icon-0"
      className="w-8 h-8 text-blue-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 6h16M4 12h10M4 18h6" />
    </svg>,

    // Funds Allocated
    <svg
      key="icon-1"
      className="w-8 h-8 text-green-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 8c-2.21 0-4 .79-4 3s1.79 3 4 3 4 .79 4 3-1.79 3-4 3" />
      <path d="M12 3v3m0 12v3" />
    </svg>,

    // Ongoing
    <svg
      key="icon-2"
      className="w-8 h-8 text-indigo-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l3 3" />
    </svg>,

    // Verified on Blockchain
    <svg
      key="icon-3"
      className="w-8 h-8 text-yellow-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M5 12l4 4L19 6" />
    </svg>,
  ];

  // Latest updates: show last 3 projects (by start date)
  const filteredUpdates = [...projects]
    .filter(
      (p) =>
        (selectedDepartment === "" || p.department_id === selectedDepartment) &&
        (p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    .slice(0, 4); // latest 3

  // Department-wise fund data
  const departmentTotals = {};
  projects.forEach((p) => {
    const dept = p.department_id || "Unknown";
    const amt = parseFloat(p.budget) || 0;
    departmentTotals[dept] = (departmentTotals[dept] || 0) + amt;
  });
  const departmentLabels = Object.keys(departmentTotals);
  const departmentValues = departmentLabels.map(
    (d) => departmentTotals[d] / 10000000 // just to shrink bar height
  );

  // ---- JSX Part ----
  return (
    <div className="min-h-screen w-full flex flex-row">
      <Sidebar active="Dashboard" />
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-8 bg-gradient-to-br from-[#e9eafc] to-[#f3f6ff]">
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#16213E] mb-6">
            Welcome to PublicChain – Empowering Citizens through Transparency
          </h2>

          {/* Search Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, updates..."
              className="w-full md:w-1/2 px-4 py-2 rounded-2xl border-2 border-blue-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            />
          </div>

          {/* Section Divider */}
          <div className="w-full border-b-2 border-blue-100 mb-8"></div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center border-2 border-blue-100 hover:scale-105 transition-transform group"
              >
                <div className="mb-2">{icons[i]}</div>
                <span
                  className={`text-2xl font-extrabold mb-1 ${
                    i === 1
                      ? "text-green-600"
                      : i === 2
                      ? "text-indigo-600"
                      : i === 3
                      ? "text-yellow-500"
                      : "text-blue-600"
                  }`}
                >
                  {stat.value}
                </span>
                <span className="text-base text-gray-700 font-semibold group-hover:text-blue-700 transition-colors text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Section Divider */}
          <div className="w-full border-b-2 border-blue-100 mb-8"></div>

          {/* Latest Updates Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-indigo-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              Latest Updates
            </h3>
            {/* Department Filter for Updates */}
            <div className="mb-4 flex gap-2 items-center">
              <label className="font-semibold text-blue-700">
                Filter by Department:
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-2 py-1 rounded border border-blue-200 bg-white text-gray-800"
              >
                <option value="">All</option>
                {departmentLabels.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {selectedDepartment && (
                <button
                  className="px-2 py-1 rounded border border-blue-200 bg-white text-blue-700 font-semibold"
                  onClick={() => setSelectedDepartment("")}
                  title="Clear department filter"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredUpdates.length === 0 ? (
                <div className="col-span-full text-blue-300">
                  No recent updates found.
                </div>
              ) : (
                filteredUpdates.map((u, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg p-5 flex flex-col gap-2 border-2 border-indigo-100 hover:scale-105 transition-transform"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                        {u.project_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {u.start_date}
                      </span>
                    </div>
                    <span className="text-gray-700">{u.description}</span>
                    <div className="flex gap-2 text-xs text-gray-500">
                      <span>Department: {u.department_id}</span>
                      <span>Status: {u.status}</span>
                    </div>
                    <button
                      className="mt-2 px-4 py-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow hover:scale-105 transition-transform"
                      onClick={() => setSelectedUpdate(u)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Project Details Modal */}
            {selectedUpdate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-blue-400/30 relative animate-fade-in text-blue-900">
                  <button
                    className="absolute top-3 right-3 text-blue-700 hover:text-red-400 text-2xl font-bold"
                    onClick={() => setSelectedUpdate(null)}
                    title="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
                    Project Details
                  </h2>
                  <table className="w-full text-sm text-blue-900 border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-semibold">Project Name</td>
                        <td>{selectedUpdate.project_name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Department</td>
                        <td>{selectedUpdate.department_id}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Type</td>
                        <td>{selectedUpdate.type}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Location</td>
                        <td>{selectedUpdate.location}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Budget</td>
                        <td>₹{selectedUpdate.budget}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Officer</td>
                        <td>{selectedUpdate.officer}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Contact</td>
                        <td>{selectedUpdate.contact}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Status</td>
                        <td>{selectedUpdate.status}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Start Date</td>
                        <td>{selectedUpdate.start_date}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">End Date</td>
                        <td>{selectedUpdate.end_date}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Blockchain Verified</td>
                        <td>
                          {selectedUpdate.blockchain_verify === 1
                            ? "Yes"
                            : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Description</td>
                        <td>{selectedUpdate.description}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Section Divider */}
          <div className="w-full border-b-2 border-blue-100 mb-8"></div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fund Distribution by Department */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
              <h4 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Fund Distribution by Department
              </h4>
              <div className="flex items-end h-32 gap-4">
                {departmentValues.length === 0 ? (
                  <div className="text-gray-400 text-sm">
                    No department data available
                  </div>
                ) : (
                  departmentValues.map((v, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className={`w-8 rounded-t-xl ${
                          [
                            "bg-blue-400",
                            "bg-green-400",
                            "bg-indigo-400",
                            "bg-yellow-400",
                            "bg-pink-400",
                            "bg-orange-400",
                            "bg-teal-400",
                            "bg-gray-400",
                          ][i % 8]
                        }`}
                        style={{ height: `${Math.max(20, v * 10)}px` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">
                        {departmentLabels[i]}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Budget Project */}
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl p-6 border-2 border-indigo-100">
              <h4 className="text-lg font-bold text-indigo-700 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" />
                </svg>
                Top Budget Project
              </h4>
              <div className="flex flex-col items-center justify-center h-32">
                {projects.length > 0 ? (
                  (() => {
                    const topProject = [...projects].sort(
                      (a, b) => parseFloat(b.budget) - parseFloat(a.budget)
                    )[0];
                    return (
                      <div className="text-center">
                        <div className="font-bold text-lg text-indigo-700 mb-2">
                          {topProject.project_name}
                        </div>
                        <div className="text-sm text-gray-700">
                          <b>
                            Budget:<u>₹{topProject.budget}</u>{" "}
                          </b>
                        </div>
                        <div className="text-sm text-gray-700">
                          <b> Department: {topProject.department_id}</b>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-gray-400">No data</div>
                )}
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div className="w-full border-b-2 border-blue-100 mb-8"></div>

          {/* Call to Action & Feedback */}
          <div className="mt-12 flex flex-col items-center">
            <h3 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-green-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2l4-4" />
              </svg>
              Transparency Matters
            </h3>
            <p className="text-gray-700 mb-4 text-center max-w-xl">
              All verified projects are recorded on the blockchain for public
              audit. Click below to explore transparency reports and verify
              project authenticity.
            </p>
            <div className="flex gap-4">
              <button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                onClick={() =>
                  window.open(
                    "https://www.google.com/search?q=blockchain+transparency+reports",
                    "_blank"
                  )
                }
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2l4-4" />
                </svg>
                Verify on Blockchain
              </button>
              <button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-600 text-white font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                onClick={() => navigate("/public/submit-feedback")}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 20h9" />
                  <path d="M12 4v16" />
                </svg>
                Submit Feedback
              </button>
            </div>
            {showFeedback && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-400/30 relative animate-fade-in text-blue-900">
                  <button
                    className="absolute top-3 right-3 text-blue-700 hover:text-red-400 text-2xl font-bold"
                    onClick={() => setShowFeedback(false)}
                    title="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
                    Submit Feedback
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowFeedback(false);
                      alert("Thank you for your feedback!");
                    }}
                  >
                    <textarea
                      className="w-full p-2 border rounded mb-4"
                      rows={4}
                      placeholder="Your feedback..."
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded bg-blue-600 text-white font-bold"
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
