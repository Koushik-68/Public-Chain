import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaCommentDots, FaSyncAlt, FaEye } from "react-icons/fa";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacksAdmin();
  }, []);

  async function fetchFeedbacksAdmin() {
    setLoadingFeedbacks(true);
    try {
      const res = await api.get("/api/feedback");
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white">
      <AdminSidebar />

      <div className="flex-1 relative">
        {/* soft glow backgrounds */}
        <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-amber-400/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-52 w-52 rounded-full bg-yellow-500/20 blur-3xl" />

        <div className="flex-1 flex flex-col items-center justify-start pt-16 pb-10">
          <div className="w-full max-w-5xl px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/60 shadow-lg shadow-amber-500/40">
                  <FaCommentDots className="text-amber-200 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-amber-100 tracking-wide">
                    All Feedbacks ({feedbacks.length})
                  </h2>
                  <p className="text-xs md:text-sm text-amber-200/80 mt-1">
                    Citizens’ feedback on public projects for transparency and
                    improvement.
                  </p>
                </div>
              </div>

              <button
                className="px-6 md:px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-yellow-400/60 text-sm md:text-lg inline-flex items-center gap-2"
                onClick={fetchFeedbacksAdmin}
              >
                <FaSyncAlt className={loadingFeedbacks ? "animate-spin" : ""} />
                {loadingFeedbacks ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Content */}
            {loadingFeedbacks ? (
              <div className="text-center py-10 text-yellow-300 text-lg">
                Loading feedbacks...
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-10 text-gray-400 border border-dashed border-gray-600 rounded-2xl bg-slate-900/70">
                <p className="text-base">No feedbacks found.</p>
                <p className="text-xs mt-1 text-gray-500">
                  Once citizens submit feedback on projects, they will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-amber-400/40 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-3 border-b border-amber-400/40 flex items-center justify-between">
                  <span className="text-sm text-amber-100/80">
                    Total feedbacks:{" "}
                    <span className="font-bold text-amber-50">
                      {feedbacks.length}
                    </span>
                  </span>
                </div>
                <div
                  className="overflow-x-auto"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <table className="w-full text-sm md:text-base text-left border-separate border-spacing-y-2 min-w-[900px] mx-auto">
                    <thead>
                      <tr className="bg-amber-900/70 text-amber-100 text-sm md:text-base">
                        <th className="px-6 py-4 rounded-l-xl">Project</th>
                        <th className="px-6 py-4">Feedback</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 rounded-r-xl text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((f) => (
                        <tr
                          key={f.id}
                          className="bg-slate-800/80 text-amber-50 hover:bg-amber-900/40 transition-all cursor-pointer"
                          onClick={() => setSelectedFeedback(f)}
                          title="View details"
                        >
                          <td className="px-6 py-4 font-semibold truncate max-w-[220px]">
                            {f.project}
                          </td>
                          <td className="px-6 py-4 truncate max-w-[320px]">
                            {f.feedback}
                          </td>
                          <td className="px-6 py-4">{f.rating}</td>
                          <td className="px-6 py-4">
                            {f.submitted_at &&
                              new Date(f.submitted_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center gap-1 text-amber-200">
                              <FaEye />
                              <span className="text-xs md:text-sm">View</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modal for feedback details */}
          {selectedFeedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-slate-950 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-amber-400/40 relative animate-fade-in text-amber-50">
                <button
                  className="absolute top-3 right-3 text-amber-200 hover:text-red-400 text-2xl font-bold"
                  onClick={() => setSelectedFeedback(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-amber-100 mb-4 text-center flex items-center justify-center gap-2">
                  <FaCommentDots className="text-amber-300" />
                  Feedback Details
                </h2>
                <div className="border border-amber-400/40 rounded-xl p-4 bg-slate-900/80">
                  <table className="w-full text-xs md:text-sm text-amber-50 border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-semibold text-amber-200 pr-3">
                          Project
                        </td>
                        <td>{selectedFeedback.project}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-amber-200 pr-3">
                          Feedback
                        </td>
                        <td>{selectedFeedback.feedback}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-amber-200 pr-3">
                          Rating
                        </td>
                        <td>{selectedFeedback.rating}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-amber-200 pr-3">
                          Date
                        </td>
                        <td>
                          {selectedFeedback.submitted_at &&
                            new Date(
                              selectedFeedback.submitted_at
                            ).toLocaleString()}
                        </td>
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
