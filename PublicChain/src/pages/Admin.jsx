// import { useEffect, useState } from "react";
// import api from "../axios/api";
// import AdminSidebar from "../components/Admin/AdminSidebar";

// export default function Admin() {
//   const [pending, setPending] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [showPending, setShowPending] = useState(false);

//   // New states for admin modals
//   const [showProjects, setShowProjects] = useState(false);
//   const [showFundRequests, setShowFundRequests] = useState(false);
//   const [showFeedbacks, setShowFeedbacks] = useState(false);
//   const [projects, setProjects] = useState([]);
//   const [fundRequests, setFundRequests] = useState([]);
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [loadingProjects, setLoadingProjects] = useState(false);
//   const [loadingFundRequests, setLoadingFundRequests] = useState(false);
//   const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

//   // initial load + polling every 10s so new registrations appear automatically
//   useEffect(() => {
//     fetchPending();
//   }, []);

//   async function fetchPending() {
//     setLoading(true);
//     setMessage(null);
//     try {
//       const res = await api.get("/api/admin/pending-users");
//       setPending(res.data.users || []);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Failed to load");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Fetch all projects
//   async function fetchProjectsAdmin() {
//     setLoadingProjects(true);
//     try {
//       const res = await api.get("/api/projects");
//       setProjects(res.data.projects || []);
//     } catch (err) {
//       setProjects([]);
//     } finally {
//       setLoadingProjects(false);
//     }
//   }
//   // Fetch all fund requests
//   async function fetchFundRequestsAdmin() {
//     setLoadingFundRequests(true);
//     try {
//       const res = await api.get("/api/fund-requests");
//       setFundRequests(res.data.requests || []);
//     } catch (err) {
//       setFundRequests([]);
//     } finally {
//       setLoadingFundRequests(false);
//     }
//   }
//   // Fetch all feedbacks
//   async function fetchFeedbacksAdmin() {
//     setLoadingFeedbacks(true);
//     try {
//       const res = await api.get("/api/feedback");
//       setFeedbacks(res.data.feedbacks || []);
//     } catch (err) {
//       setFeedbacks([]);
//     } finally {
//       setLoadingFeedbacks(false);
//     }
//   }

//   async function verify(userId) {
//     setMessage(null);
//     try {
//       const res = await api.post("/api/admin/verify-user", { userId });
//       // show returned credentials
//       const { username, password } = res.data;
//       setMessage(
//         `Verified user ${userId}. Username: ${username} Password: ${password}`
//       );
//       // remove verified user from list
//       setPending((p) => p.filter((u) => u.id !== userId));
//       // refresh verified users
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Verify failed");
//     }
//   }

//   return (
//     <div className="flex min-h-screen">
//       <AdminSidebar />
//       <div className="flex-1 max-w-4xl mx-auto p-4 md:p-8">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 tracking-wide">
//             Admin Portal
//           </h2>
//           <p className="text-indigo-300 text-lg font-light mt-1">
//             Review and authorize pending department registrations.
//           </p>
//           <button
//             className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-green-400/40 text-lg"
//             onClick={() => {
//               fetchPending();
//             }}
//           >
//             <span className="inline-flex items-center gap-2">
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4 4v5h.582M20 20v-5h-.581M5.635 19A8.001 8.001 0 0012 20a8 8 0 008-8m-1.365-7A8.001 8.001 0 0012 4a8 8 0 00-8 8"
//                 />
//               </svg>
//               Refresh Updates
//             </span>
//           </button>
//         </div>

//         {/* Message Box for Errors/Success */}
//         {message && (
//           <div
//             className={`mb-6 p-4 rounded-xl shadow-lg border-l-4 ${
//               message.includes("Verified")
//                 ? "bg-green-900/40 border-green-500 text-green-300"
//                 : "bg-red-900/40 border-red-500 text-red-300"
//             }`}
//           >
//             <div className="text-sm font-medium">{message}</div>
//           </div>
//         )}

//         {/* Pending Requests Section (popup modal) */}
//         {showPending && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//             <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-indigo-400/30 relative animate-fadeIn">
//               <button
//                 className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold focus:outline-none"
//                 onClick={() => setShowPending(false)}
//                 title="Close"
//               >
//                 &times;
//               </button>
//               <h3 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
//                 Pending Department Registrations ({pending.length})
//               </h3>
//               {loading ? (
//                 <div className="text-center py-10 text-indigo-300">
//                   <svg
//                     className="animate-spin h-6 w-6 mx-auto mb-3 text-indigo-400"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Loading registrations...
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
//                   {pending.length === 0 && (
//                     <div className="text-center py-6 text-gray-400 border border-dashed border-gray-600 rounded-lg">
//                       <p>
//                         All clear! No pending registrations currently require
//                         verification.
//                       </p>
//                     </div>
//                   )}
//                   {pending.map((u) => (
//                     <div
//                       key={u.id}
//                       className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30 shadow-xl transition-all duration-300 hover:border-blue-400/50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
//                     >
//                       <div className="flex-1 min-w-0">
//                         <div className="font-extrabold text-xl text-white mb-1 truncate">
//                           {u.department_name}
//                         </div>
//                         <div className="text-sm font-medium text-indigo-300 mb-2">
//                           {u.department_type} -{" "}
//                           <span className="text-gray-400">
//                             {u.state}, {u.district}
//                           </span>
//                         </div>

//                         <div className="text-sm text-gray-300 space-y-0.5">
//                           <p className="truncate">
//                             <span className="font-semibold text-indigo-200">
//                               Head:
//                             </span>{" "}
//                             {u.head_name}
//                           </p>
//                           <p className="truncate">
//                             <span className="font-semibold text-indigo-200">
//                               Email:
//                             </span>{" "}
//                             {u.email}
//                           </p>
//                           <p>
//                             <span className="font-semibold text-indigo-200">
//                               Contact:
//                             </span>{" "}
//                             {u.contact_number}
//                           </p>
//                         </div>
//                         <div className="text-xs text-gray-400 mt-3">
//                           Registered:{" "}
//                           {u.created_at
//                             ? new Date(u.created_at).toLocaleString()
//                             : "N/A"}
//                         </div>
//                       </div>

//                       <div className="ml-0 md:ml-4 shrink-0 w-full md:w-auto">
//                         <button
//                           onClick={() => verify(u.id)}
//                           className="w-full md:w-auto text-white font-bold py-2.5 px-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500/50 mt-2 tracking-wider bg-gradient-to-r from-green-500 to-teal-600 shadow-green-500/40 hover:shadow-teal-400/50 hover:scale-[1.02]"
//                         >
//                           Verify & Generate
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* New Buttons for Admin Actions */}
//         <div className="flex justify-center gap-6 mb-10">
//           <button
//             className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-blue-400/40 text-lg"
//             onClick={() => {
//               fetchProjectsAdmin();
//               setShowProjects(true);
//             }}
//           >
//             View All Projects
//           </button>
//           <button
//             className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-green-400/40 text-lg"
//             onClick={() => {
//               fetchFundRequestsAdmin();
//               setShowFundRequests(true);
//             }}
//           >
//             View Fund Requests
//           </button>
//           <button
//             className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-yellow-400/40 text-lg"
//             onClick={() => {
//               fetchFeedbacksAdmin();
//               setShowFeedbacks(true);
//             }}
//           >
//             View Feedbacks
//           </button>
//         </div>

//         {/* Modal: All Projects */}
//         {showProjects && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full border border-blue-400/30 relative animate-fade-in text-blue-900">
//               <button
//                 className="absolute top-3 right-3 text-blue-700 hover:text-red-400 text-2xl font-bold"
//                 onClick={() => setShowProjects(false)}
//                 title="Close"
//               >
//                 ×
//               </button>
//               <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
//                 All Projects
//               </h2>
//               {loadingProjects ? (
//                 <div className="text-center py-8 text-blue-400">
//                   Loading projects...
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto max-h-[60vh]">
//                   <table className="w-full text-sm text-blue-900 border-separate border-spacing-y-2">
//                     <thead>
//                       <tr className="bg-blue-100">
//                         <th>Project Name</th>
//                         <th>Department</th>
//                         <th>Type</th>
//                         <th>Location</th>
//                         <th>Budget</th>
//                         <th>Status</th>
//                         <th>Start</th>
//                         <th>End</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {projects.map((p) => (
//                         <tr key={p.id} className="bg-blue-50">
//                           <td>{p.project_name}</td>
//                           <td>{p.department_id}</td>
//                           <td>{p.type}</td>
//                           <td>{p.location}</td>
//                           <td>₹{p.budget}</td>
//                           <td>{p.status}</td>
//                           <td>{p.start_date}</td>
//                           <td>{p.end_date}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Modal: Fund Requests */}
//         {showFundRequests && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//             <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-3xl w-full border border-green-400/30 relative animate-fade-in text-green-100">
//               <button
//                 className="absolute top-3 right-3 text-green-200 hover:text-red-400 text-2xl font-bold"
//                 onClick={() => setShowFundRequests(false)}
//                 title="Close"
//               >
//                 ×
//               </button>
//               <h2 className="text-xl font-bold text-green-100 mb-4 text-center">
//                 All Fund Requests
//               </h2>
//               {loadingFundRequests ? (
//                 <div className="text-center py-8 text-green-300">
//                   Loading fund requests...
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto max-h-[60vh]">
//                   <table className="w-full text-sm text-green-100 border-separate border-spacing-y-2">
//                     <thead>
//                       <tr className="bg-green-800/40">
//                         <th>Department</th>
//                         <th>Title</th>
//                         <th>Amount</th>
//                         <th>Urgency</th>
//                         <th>Status</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {fundRequests.map((r) => (
//                         <tr key={r.id} className="bg-green-900/30">
//                           <td>{r.department}</td>
//                           <td>{r.title}</td>
//                           <td>₹{r.amount}</td>
//                           <td>{r.urgency}</td>
//                           <td>{r.status}</td>
//                           <td>
//                             {r.created_at &&
//                               new Date(r.created_at).toLocaleDateString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Modal: Feedbacks */}
//         {showFeedbacks && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//             <div className="bg-yellow-50 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border border-yellow-400/30 relative animate-fade-in text-yellow-900">
//               <button
//                 className="absolute top-3 right-3 text-yellow-700 hover:text-red-400 text-2xl font-bold"
//                 onClick={() => setShowFeedbacks(false)}
//                 title="Close"
//               >
//                 ×
//               </button>
//               <h2 className="text-xl font-bold text-yellow-900 mb-4 text-center">
//                 All Feedbacks
//               </h2>
//               {loadingFeedbacks ? (
//                 <div className="text-center py-8 text-yellow-400">
//                   Loading feedbacks...
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto max-h-[60vh]">
//                   <table className="w-full text-sm text-yellow-900 border-separate border-spacing-y-2">
//                     <thead>
//                       <tr className="bg-yellow-100">
//                         <th>Project</th>
//                         <th>Feedback</th>
//                         <th>Rating</th>
//                         <th>Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {feedbacks.map((f) => (
//                         <tr key={f.id} className="bg-yellow-50">
//                           <td>{f.project}</td>
//                           <td>{f.feedback}</td>
//                           <td>{f.rating}</td>
//                           <td>
//                             {f.submitted_at &&
//                               new Date(f.submitted_at).toLocaleString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="mt-8 text-center text-sm text-gray-500">
//           <p>PublicChain Security & Audit Log</p>
//         </div>
//       </div>
//     </div>
//   );
// }
