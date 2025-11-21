import { useEffect, useState } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaUserCheck, FaSyncAlt, FaIdBadge } from "react-icons/fa";

export default function VerifiedUsers() {
  const [verified, setVerified] = useState([]);
  const [loadingVerified, setLoadingVerified] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchVerified();
    // Optionally add polling if needed
  }, []);

  async function fetchVerified() {
    setLoadingVerified(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/verified-users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setVerified(res.data.users || []);
    } catch (err) {
      // Optionally show error for verified users
      setVerified([]);
    } finally {
      setLoadingVerified(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      <AdminSidebar />

      <div className="flex-1 relative">
        {/* soft background glows */}
        <div className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-52 w-52 rounded-full bg-green-500/20 blur-3xl" />

        <div className="flex-1 flex flex-col pt-20">
          <div className="w-full flex justify-center">
            <div className="max-w-5xl w-full px-4 md:px-8 pb-10 relative">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 shadow-lg shadow-emerald-500/30">
                    <FaUserCheck className="text-emerald-300 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-200 tracking-wide">
                      Verified Users ({verified.length})
                    </h3>
                    <p className="text-xs md:text-sm text-emerald-200/70 mt-1">
                      All departments that have successfully completed
                      verification.
                    </p>
                  </div>
                </div>

                <button
                  className="px-6 md:px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-green-400/40 text-sm md:text-lg inline-flex items-center gap-2"
                  onClick={fetchVerified}
                >
                  <FaSyncAlt
                    className={loadingVerified ? "animate-spin" : ""}
                  />
                  {loadingVerified ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {/* Content */}
              {loadingVerified ? (
                <div className="text-center py-10 text-emerald-300 text-lg">
                  Loading verified users...
                </div>
              ) : verified.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border border-dashed border-gray-600 rounded-2xl bg-slate-900/60">
                  <p className="text-base">
                    No verified users found at the moment.
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Once departments are verified, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-6 py-3 border-b border-emerald-500/30 flex items-center justify-between">
                    <span className="text-sm text-emerald-200/80">
                      Total verified departments:{" "}
                      <span className="font-bold text-emerald-100">
                        {verified.length}
                      </span>
                    </span>
                  </div>
                  <div
                    className="overflow-x-auto"
                    style={{ maxHeight: "70vh", overflowY: "auto" }}
                  >
                    <table className="w-full text-sm md:text-base text-left border-separate border-spacing-y-2 min-w-[1100px] mx-auto">
                      <thead>
                        <tr className="bg-emerald-900/60 text-emerald-100 text-sm md:text-base">
                          <th className="px-6 py-4 rounded-l-xl">
                            Department Name
                          </th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">State</th>
                          <th className="px-6 py-4">District</th>
                          <th className="px-6 py-4">Head</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Contact</th>
                          <th className="px-6 py-4">Verified At</th>
                          <th className="px-6 py-4 rounded-r-xl">Username</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verified.map((u) => (
                          <tr
                            key={u.id}
                            className="bg-slate-800/70 text-emerald-50 hover:bg-emerald-900/40 transition-all text-sm md:text-base cursor-pointer"
                            onClick={() => setSelectedUser(u)}
                            title="View details"
                          >
                            <td className="px-6 py-4 font-semibold truncate max-w-[260px]">
                              <div className="flex items-center gap-2">
                                <FaIdBadge className="text-emerald-300 shrink-0" />
                                <span>{u.department_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">{u.department_type}</td>
                            <td className="px-6 py-4">{u.state}</td>
                            <td className="px-6 py-4">{u.district}</td>
                            <td className="px-6 py-4">{u.head_name}</td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4">{u.contact_number}</td>
                            <td className="px-6 py-4 text-[11px] md:text-xs">
                              {u.verified_at
                                ? new Date(u.verified_at).toLocaleString()
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 font-mono text-sm">
                              {u.username || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal for user details */}
          {selectedUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-slate-950 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-emerald-400/40 relative animate-fade-in text-emerald-50">
                <button
                  className="absolute top-3 right-3 text-emerald-200 hover:text-red-400 text-2xl font-bold"
                  onClick={() => setSelectedUser(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-emerald-100 mb-4 text-center flex items-center justify-center gap-2">
                  <FaUserCheck className="text-emerald-300" />
                  User Details
                </h2>
                <div className="border border-emerald-500/30 rounded-xl p-4 bg-slate-900/70">
                  <table className="w-full text-xs md:text-sm text-emerald-50 border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Department Name
                        </td>
                        <td>{selectedUser.department_name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Type
                        </td>
                        <td>{selectedUser.department_type}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          State
                        </td>
                        <td>{selectedUser.state}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          District
                        </td>
                        <td>{selectedUser.district}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Head
                        </td>
                        <td>{selectedUser.head_name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Email
                        </td>
                        <td>{selectedUser.email}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Contact
                        </td>
                        <td>{selectedUser.contact_number}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Verified At
                        </td>
                        <td>
                          {selectedUser.verified_at
                            ? new Date(
                                selectedUser.verified_at
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Username
                        </td>
                        <td>{selectedUser.username || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-emerald-200 pr-3">
                          Address
                        </td>
                        <td>{selectedUser.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
