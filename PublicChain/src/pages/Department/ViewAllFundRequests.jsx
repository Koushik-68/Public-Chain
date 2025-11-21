import React, { useEffect, useState } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api";

export default function ViewAllFundRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await api.get("/api/fund-requests");
        setRequests(res.data.requests || []);
      } catch (err) {
        setError("Failed to load fund requests.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-blue-50">
      <DepartmentSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-100">
          All Fund Requests
        </h1>
        {loading && <div className="mb-4">Loading fund requests...</div>}
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? (
              <div className="col-span-full text-blue-300">
                No fund requests found.
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-800 rounded-xl p-5 shadow border border-blue-400/20 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                  onClick={() => setSelectedRequest(request)}
                  title="View details"
                >
                  <h2 className="text-lg font-semibold text-blue-200 mb-2">
                    {request.title}
                  </h2>
                  <div className="text-xs text-blue-300 mb-1">
                    Department: {request.department}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Amount: ₹{request.amount}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Urgency: {request.urgency}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Status: {request.status}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Request ID: {request.generated_id}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Date:{" "}
                    {request.created_at &&
                      new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for fund request details */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-blue-400/30 relative animate-fade-in">
              <button
                className="absolute top-3 right-3 text-blue-200 hover:text-red-400 text-2xl font-bold"
                onClick={() => setSelectedRequest(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-100 mb-4 text-center">
                Fund Request Details
              </h2>
              <table className="w-full text-sm text-blue-200 border-separate border-spacing-y-2">
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
      </main>
    </div>
  );
}
