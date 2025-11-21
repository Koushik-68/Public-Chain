import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
// import Modal from "../../components/Modal"; // Not used now

export default function PendingRegistrations() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPending() {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/pending-users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPending(res.data.users || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function verify(userId) {
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/api/admin/verify-user",
        { userId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const { username, password } = res.data;
      setMessage(
        `Verified user ${userId}. Username: ${username} Password: ${password}`
      );
      setPending((p) => p.filter((u) => u.id !== userId));
      setModalOpen(false);
      setSelected(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verify failed");
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-indigo-300 mb-4 text-center">
              Pending Registrations
            </h2>
            <button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-green-400/40 text-lg"
              onClick={fetchPending}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582M20 20v-5h-.581M5.635 19A8.001 8.001 0 0012 20a8 8 0 008-8m-1.365-7A8.001 8.001 0 0012 4a8 8 0 00-8 8"
                  />
                </svg>
                Refresh
              </span>
            </button>
          </div>

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

          {loading ? (
            <div className="text-center py-8 text-indigo-300">
              Loading registrations...
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-6 text-gray-400 border border-dashed border-gray-600 rounded-lg">
              <p>
                All clear! No pending registrations currently require
                verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4">
              {pending.map((u) => (
                <div
                  key={u.id}
                  className="bg-indigo-800/60 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-900/80 transition-all border border-indigo-500/30 min-h-[180px] min-w-[180px]"
                  onClick={() => {
                    setSelected(u);
                    setModalOpen(true);
                  }}
                >
                  <div className="font-bold text-lg text-indigo-200 mb-2 truncate w-full text-center">
                    {u.department_name}
                  </div>
                  <div className="text-indigo-300 text-sm mb-1">
                    {u.department_type}
                  </div>
                  <div className="text-indigo-400 text-xs mb-1">
                    {u.state}, {u.district}
                  </div>
                  <div className="text-indigo-400 text-xs mb-1">
                    Head: {u.head_name}
                  </div>
                  <div className="text-indigo-400 text-xs mb-1">{u.email}</div>
                  <div className="text-indigo-400 text-xs">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 rounded bg-green-700/40 text-green-300 text-xs font-semibold">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {modalOpen && selected && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-indigo-950 rounded-xl shadow-2xl p-8 w-full max-w-lg relative">
                <button
                  className="absolute top-4 right-4 text-indigo-300 hover:text-white text-xl font-bold"
                  onClick={() => {
                    setModalOpen(false);
                    setSelected(null);
                  }}
                >
                  &times;
                </button>
                <h3 className="text-lg font-bold text-indigo-200 mb-4 text-center">
                  Registration Details
                </h3>
                <table className="w-full text-base text-left border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="font-bold text-indigo-300">
                        Department Name
                      </td>
                      <td>{selected.department_name}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">Type</td>
                      <td>{selected.department_type}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">State</td>
                      <td>{selected.state}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">District</td>
                      <td>{selected.district}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">Head</td>
                      <td>{selected.head_name}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">Email</td>
                      <td>{selected.email}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">Contact</td>
                      <td>{selected.contact_number}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-indigo-300">
                        Registered At
                      </td>
                      <td>
                        {selected.created_at
                          ? new Date(selected.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-center mt-6">
                  <button
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold shadow hover:scale-105 transition border border-green-400/40 text-base"
                    onClick={() => verify(selected.id)}
                  >
                    Verify & Generate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
