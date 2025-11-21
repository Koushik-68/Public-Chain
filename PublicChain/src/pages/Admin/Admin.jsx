import { useEffect, useState, useRef } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  FaUsersCog,
  FaUserClock,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaCommentDots,
  FaTasks,
  FaCheckCircle,
  FaChartPie,
  FaSyncAlt,
} from "react-icons/fa";

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [verified, setVerified] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fundRequests, setFundRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showFundRequests, setShowFundRequests] = useState(false);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingFundRequests, setLoadingFundRequests] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const pollingRef = useRef();

  // Real-time polling every 10s
  useEffect(() => {
    fetchAllData();
    pollingRef.current = setInterval(fetchAllData, 10000);
    return () => clearInterval(pollingRef.current);
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [pendingRes, verifiedRes, projectsRes, fundRes, feedbackRes] =
        await Promise.all([
          api.get("/api/admin/pending-users"),
          api.get("/api/admin/verified-users"),
          api.get("/api/projects"),
          api.get("/api/fund-requests"),
          api.get("/api/feedback"),
        ]);
      setPending(pendingRes.data.users || []);
      setVerified(verifiedRes.data.users || []);
      setProjects(projectsRes.data.projects || []);
      setFundRequests(fundRes.data.requests || []);
      setFeedbacks(feedbackRes.data.feedbacks || []);
    } catch (err) {
      setMessage("Failed to load some data");
    } finally {
      setLoading(false);
    }
  }

  async function verify(userId) {
    setMessage(null);
    try {
      const res = await api.post("/api/admin/verify-user", { userId });
      const { username, password } = res.data;
      setMessage(
        `Verified user ${userId}. Username: ${username} Password: ${password}`
      );
      setPending((p) => p.filter((u) => u.id !== userId));
      fetchAllData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Verify failed");
    }
  }

  // --- Widgets ---
  const totalPending = pending.length;
  const totalVerified = verified.length;
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
  const totalFundRequests = fundRequests.length;
  const totalFeedbacks = feedbacks.length;
  const unresolvedFeedbacks = feedbacks.filter((f) => !f.resolved).length;
  const resolvedFeedbacks = feedbacks.filter((f) => f.resolved).length;

  // --- Recent Activity Log ---
  const recentActivity = [
    ...pending.slice(0, 2).map((u) => ({
      type: "Pending Registration",
      text: `${u.department_name} (${u.state})`,
    })),
    ...fundRequests.slice(0, 2).map((r) => ({
      type: "Fund Request",
      text: `${r.title} - ₹${r.amount}`,
    })),
    ...feedbacks
      .slice(0, 2)
      .map((f) => ({ type: "Feedback", text: `${f.project}: ${f.feedback}` })),
    ...projects.slice(0, 2).map((p) => ({
      type: "Project",
      text: `${p.project_name} (${p.status})`,
    })),
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <AdminSidebar />
      <div className="flex-1 relative">
        {/* subtle background glows */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h2 className="inline-flex items-center gap-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-cyan-300 tracking-wide">
                <span className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-400 via-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-2xl font-black">
                  A
                </span>
                Admin Portal
              </h2>
              <p className="text-indigo-200/80 text-sm md:text-base font-light mt-2 max-w-xl">
                Real-time dashboard for government admin. Data auto-refreshes
                every few seconds to keep you up-to-date.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={fetchAllData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 border border-indigo-500/70 shadow-md shadow-indigo-900/50 text-xs md:text-sm font-semibold hover:bg-slate-800/80 hover:scale-105 transition"
              >
                <FaSyncAlt
                  className={loading ? "animate-spin text-cyan-300" : ""}
                />
                {loading ? "Refreshing data..." : "Refresh now"}
              </button>
              {/* <div className="flex items-center gap-2 text-xs text-emerald-300/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live monitoring enabled
              </div> */}
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Pending */}
            <div className="bg-gradient-to-br from-emerald-900/70 via-emerald-800/60 to-emerald-700/50 rounded-2xl shadow-xl p-5 border border-emerald-400/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-black/20">
                  <FaUserClock className="text-emerald-300 text-xl" />
                </div>
                <span className="text-xs uppercase tracking-widest text-emerald-200/70">
                  Registrations
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-100 mb-1">
                {totalPending}
              </div>
              <div className="text-sm text-emerald-100/80 font-semibold">
                Pending Registrations
              </div>
              <button
                className="mt-4 w-full px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 hover:scale-[1.02] transition"
                onClick={() => setShowPending(true)}
              >
                Review Pending
              </button>
            </div>

            {/* Verified */}
            <div className="bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-blue-700/50 rounded-2xl shadow-xl p-5 border border-blue-400/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-black/20">
                  <FaUsersCog className="text-blue-300 text-xl" />
                </div>
                <span className="text-xs uppercase tracking-widest text-blue-200/70">
                  Departments
                </span>
              </div>
              <div className="text-3xl font-black text-blue-100 mb-1">
                {totalVerified}
              </div>
              <div className="text-sm text-blue-100/80 font-semibold">
                Verified Users
              </div>
              <button
                className="mt-4 w-full px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/40 hover:bg-blue-500 hover:scale-[1.02] transition"
                onClick={() => (window.location.href = "/admin/verified-users")}
              >
                Open List
              </button>
            </div>

            {/* Projects */}
            <div className="bg-gradient-to-br from-indigo-900/70 via-indigo-800/60 to-indigo-700/50 rounded-2xl shadow-xl p-5 border border-indigo-400/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-black/20">
                  <FaProjectDiagram className="text-indigo-200 text-xl" />
                </div>
                <span className="text-xs uppercase tracking-widest text-indigo-200/70">
                  Projects
                </span>
              </div>
              <div className="text-3xl font-black text-indigo-100 mb-1">
                {totalProjects}
              </div>
              <div className="text-sm text-indigo-100/80 font-semibold">
                Registered Projects
              </div>
              <button
                className="mt-4 w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/40 hover:bg-indigo-500 hover:scale-[1.02] transition"
                onClick={() => setShowProjects(true)}
              >
                View Projects
              </button>
            </div>

            {/* Fund Requests */}
            <div className="bg-gradient-to-br from-amber-900/70 via-amber-800/60 to-amber-700/50 rounded-2xl shadow-xl p-5 border border-amber-400/40 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-black/20">
                  <FaMoneyBillWave className="text-amber-300 text-xl" />
                </div>
                <span className="text-xs uppercase tracking-widest text-amber-200/70">
                  Finance
                </span>
              </div>
              <div className="text-3xl font-black text-amber-100 mb-1">
                {totalFundRequests}
              </div>
              <div className="text-sm text-amber-100/80 font-semibold">
                Fund Requests
              </div>
              <button
                className="mt-4 w-full px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/40 hover:bg-amber-400 hover:scale-[1.02] transition"
                onClick={() => setShowFundRequests(true)}
              >
                Review Requests
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
            <div className="bg-slate-950/70 rounded-xl p-4 text-center border border-indigo-500/30 shadow">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FaTasks className="text-indigo-300" />
                <div className="text-sm text-indigo-100 font-semibold">
                  Ongoing Projects
                </div>
              </div>
              <div className="text-2xl font-extrabold text-indigo-50">
                {ongoingProjects}
              </div>
            </div>
            <div className="bg-slate-950/70 rounded-xl p-4 text-center border border-emerald-500/30 shadow">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FaCheckCircle className="text-emerald-300" />
                <div className="text-sm text-emerald-100 font-semibold">
                  Completed
                </div>
              </div>
              <div className="text-2xl font-extrabold text-emerald-50">
                {completedProjects}
              </div>
            </div>
            <div className="bg-slate-950/70 rounded-xl p-4 text-center border border-amber-500/30 shadow">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FaChartPie className="text-amber-300" />
                <div className="text-sm text-amber-100 font-semibold">
                  Total Budget
                </div>
              </div>
              <div className="text-2xl font-extrabold text-amber-50">
                ₹{totalBudget.toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-950/70 rounded-xl p-4 text-center border border-pink-500/30 shadow">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FaCommentDots className="text-pink-300" />
                <div className="text-sm text-pink-100 font-semibold">
                  Unresolved Feedbacks
                </div>
              </div>
              <div className="text-2xl font-extrabold text-pink-50">
                {unresolvedFeedbacks}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition border border-green-400/40 text-sm md:text-lg"
              onClick={() => setShowPending(true)}
            >
              Verify Pending Registrations
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 transition border border-blue-400/40 text-sm md:text-lg"
              onClick={() => setShowProjects(true)}
            >
              View All Projects
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold shadow-lg hover:scale-105 transition border border-yellow-400/40 text-sm md:text-lg"
              onClick={() => setShowFundRequests(true)}
            >
              View Fund Requests
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold shadow-lg hover:scale-105 transition border border-pink-400/40 text-sm md:text-lg"
              onClick={() => setShowFeedbacks(true)}
            >
              View Feedbacks ({totalFeedbacks})
            </button>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-slate-950/80 rounded-2xl p-6 mb-8 shadow border border-indigo-400/30 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-indigo-100 mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Recent Activity
            </h3>
            <ul className="space-y-3">
              {recentActivity.length === 0 ? (
                <li className="text-gray-400 text-sm">
                  No recent activity recorded.
                </li>
              ) : (
                recentActivity.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-indigo-50"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                    <div>
                      <div className="font-semibold text-indigo-200">
                        {a.type}
                      </div>
                      <div className="text-indigo-100/80">{a.text}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Message Box for Errors/Success */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl shadow-lg border-l-4 ${
                message.includes("Verified")
                  ? "bg-green-900/40 border-green-500 text-green-300"
                  : "bg-red-900/40 border-red-500 text-red-300"
              }`}
            >
              <div className="text-sm font-medium">{message}</div>
            </div>
          )}

          {/* Modal: Pending Registrations */}
          {showPending && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-indigo-400/30 relative animate-fadeIn">
                <button
                  className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold focus:outline-none"
                  onClick={() => setShowPending(false)}
                  title="Close"
                >
                  &times;
                </button>
                <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3 flex items-center justify-between">
                  <span>
                    Pending Department Registrations ({pending.length})
                  </span>
                </h3>
                {loading ? (
                  <div className="text-center py-10 text-indigo-300">
                    Loading registrations...
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {pending.length === 0 && (
                      <div className="text-center py-6 text-gray-400 border border-dashed border-gray-600 rounded-lg">
                        <p>
                          All clear! No pending registrations currently require
                          verification.
                        </p>
                      </div>
                    )}
                    {pending.map((u) => (
                      <div
                        key={u.id}
                        className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30 shadow-xl transition-all duration-300 hover:border-blue-400/50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-xl text-white mb-1 truncate">
                            {u.department_name}
                          </div>
                          <div className="text-sm font-medium text-indigo-300 mb-2">
                            {u.department_type} -{" "}
                            <span className="text-gray-400">
                              {u.state}, {u.district}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 space-y-0.5">
                            <p className="truncate">
                              <span className="font-semibold text-indigo-200">
                                Head:
                              </span>{" "}
                              {u.head_name}
                            </p>
                            <p className="truncate">
                              <span className="font-semibold text-indigo-200">
                                Email:
                              </span>{" "}
                              {u.email}
                            </p>
                            <p>
                              <span className="font-semibold text-indigo-200">
                                Contact:
                              </span>{" "}
                              {u.contact_number}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400 mt-3">
                            Registered:{" "}
                            {u.created_at
                              ? new Date(u.created_at).toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                        <div className="ml-0 md:ml-4 shrink-0 w-full md:w-auto">
                          <button
                            onClick={() => verify(u.id)}
                            className="w-full md:w-auto text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500/50 mt-2 tracking-wider bg-gradient-to-r from-green-500 to-teal-600 shadow-green-500/40 hover:shadow-teal-400/50 hover:scale-[1.02]"
                          >
                            Verify & Generate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: All Projects */}
          {showProjects && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full border border-blue-400/30 relative animate-fade-in text-blue-900">
                <button
                  className="absolute top-3 right-3 text-blue-700 hover:text-red-400 text-2xl font-bold"
                  onClick={() => setShowProjects(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
                  All Projects
                </h2>
                {loadingProjects ? (
                  <div className="text-center py-8 text-blue-400">
                    Loading projects...
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-sm text-blue-900 border-separate border-spacing-y-2">
                      <thead>
                        <tr className="bg-blue-100">
                          <th>Project Name</th>
                          <th>Department</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Budget</th>
                          <th>Start</th>
                          <th>End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} className="bg-blue-50">
                            <td>{p.project_name}</td>
                            <td>{p.department_id}</td>
                            <td>{p.type}</td>
                            <td>{p.status}</td>
                            <td>₹{p.budget}</td>
                            <td>{p.start_date}</td>
                            <td>{p.end_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: Fund Requests */}
          {showFundRequests && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-3xl w-full border border-green-400/30 relative animate-fade-in text-green-100">
                <button
                  className="absolute top-3 right-3 text-green-200 hover:text-red-400 text-2xl font-bold"
                  onClick={() => setShowFundRequests(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-green-100 mb-4 text-center">
                  All Fund Requests
                </h2>
                {loadingFundRequests ? (
                  <div className="text-center py-8 text-green-300">
                    Loading fund requests...
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-sm text-green-100 border-separate border-spacing-y-2">
                      <thead>
                        <tr className="bg-green-800/40">
                          <th>Department</th>
                          <th>Title</th>
                          <th>Amount</th>
                          <th>Urgency</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fundRequests.map((r) => (
                          <tr key={r.id} className="bg-green-900/30">
                            <td>{r.department}</td>
                            <td>{r.title}</td>
                            <td>₹{r.amount}</td>
                            <td>{r.urgency}</td>
                            <td>{r.status}</td>
                            <td>
                              {r.created_at &&
                                new Date(r.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: Feedbacks */}
          {showFeedbacks && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-yellow-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-yellow-400/30 relative animate-fade-in text-yellow-900">
                <button
                  className="absolute top-3 right-3 text-yellow-700 hover:text-red-400 text-2xl font-bold"
                  onClick={() => setShowFeedbacks(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-yellow-900 mb-4 text-center">
                  All Feedbacks
                </h2>
                {loadingFeedbacks ? (
                  <div className="text-center py-8 text-yellow-400">
                    Loading feedbacks...
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-sm text-yellow-900 border-separate border-spacing-y-2">
                      <thead>
                        <tr className="bg-yellow-100">
                          <th>Project</th>
                          <th>Feedback</th>
                          <th>Rating</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((f) => (
                          <tr key={f.id} className="bg-yellow-50">
                            <td>{f.project}</td>
                            <td>{f.feedback}</td>
                            <td>{f.rating}</td>
                            <td>
                              {f.submitted_at &&
                                new Date(f.submitted_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-xs md:text-sm text-gray-500">
            <p>PublicChain Security &amp; Audit Log</p>
          </div>
        </div>
      </div>
    </div>
  );
}
