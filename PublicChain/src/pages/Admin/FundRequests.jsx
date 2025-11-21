import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function FundRequests() {
  const [fundRequests, setFundRequests] = useState([]);
  const [loadingFundRequests, setLoadingFundRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchFundRequestsAdmin();
  }, []);

  async function fetchFundRequestsAdmin() {
    setLoadingFundRequests(true);
    try {
      const res = await api.get("/api/fund-requests");
      setFundRequests(res.data.requests || []);
    } catch (err) {
      setFundRequests([]);
    } finally {
      setLoadingFundRequests(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-green-100 mb-4 text-center">
              All Fund Requests
            </h2>
            <button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-green-400/40 text-lg"
              onClick={fetchFundRequestsAdmin}
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
          {loadingFundRequests ? (
            <div className="text-center py-8 text-green-300">
              Loading fund requests...
            </div>
          ) : fundRequests.length === 0 ? (
            <div className="text-center py-6 text-gray-400 border border-dashed border-gray-600 rounded-lg">
              <p>No fund requests found.</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="overflow-x-auto"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                <table className="w-full text-base text-left border-separate border-spacing-y-3 min-w-[1100px] mx-auto">
                  <thead>
                    <tr className="bg-green-900/40 text-green-200 text-lg">
                      <th className="px-8 py-5 rounded-l-xl">Department</th>
                      <th className="px-8 py-5">Title</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5">Urgency</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5 rounded-r-xl">Request ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fundRequests.map((r) => (
                      <tr
                        key={r.id}
                        className="bg-green-700/40 text-green-100 hover:bg-green-800/30 transition-all text-base cursor-pointer"
                        onClick={() => setSelectedRequest(r)}
                        title="View details"
                      >
                        <td className="px-8 py-5">{r.department}</td>
                        <td className="px-8 py-5">{r.title}</td>
                        <td className="px-8 py-5">₹{r.amount}</td>
                        <td className="px-8 py-5">{r.urgency}</td>
                        <td className="px-8 py-5">{r.status}</td>
                        <td className="px-8 py-5">
                          {r.created_at &&
                            new Date(r.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5">{r.generated_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        {/* Modal for fund request details */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-green-400/30 relative animate-fade-in text-green-900">
              <button
                className="absolute top-3 right-3 text-green-700 hover:text-red-400 text-2xl font-bold"
                onClick={() => setSelectedRequest(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-green-900 mb-4 text-center">
                Fund Request Details
              </h2>
              <table className="w-full text-sm text-green-900 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-semibold">Department</td>
                    <td>{selectedRequest.department}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Title</td>
                    <td>{selectedRequest.title}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Amount</td>
                    <td>₹{selectedRequest.amount}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Urgency</td>
                    <td>{selectedRequest.urgency}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Reason</td>
                    <td>{selectedRequest.reason}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Contact</td>
                    <td>{selectedRequest.contact}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Impact Estimate</td>
                    <td>{selectedRequest.impact_estimate}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td>{selectedRequest.status}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Request ID</td>
                    <td>{selectedRequest.generated_id}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Date</td>
                    <td>
                      {selectedRequest.created_at &&
                        new Date(selectedRequest.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Files</td>
                    <td>
                      {selectedRequest.files
                        ? JSON.parse(selectedRequest.files)
                            .map((f) => f.name)
                            .join(", ")
                        : "No files"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
