import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaProjectDiagram, FaSyncAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjectsAdmin();
  }, []);

  async function fetchProjectsAdmin() {
    setLoadingProjects(true);
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
      <AdminSidebar />

      <div className="flex-1 relative">
        {/* soft glow backgrounds */}
        <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-16 h-52 w-52 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="flex-1 flex flex-col items-center justify-start pt-16 pb-10">
          <div className="w-full max-w-5xl px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/50 shadow-lg shadow-blue-500/40">
                  <FaProjectDiagram className="text-blue-200 text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-blue-100 tracking-wide">
                    All Projects
                  </h2>
                  <p className="text-xs md:text-sm text-blue-200/80 mt-1">
                    List of all registered public projects with budget and
                    status.
                  </p>
                </div>
              </div>

              <button
                className="px-6 md:px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 transition-all border border-blue-400/60 text-sm md:text-lg inline-flex items-center gap-2"
                onClick={fetchProjectsAdmin}
              >
                <FaSyncAlt className={loadingProjects ? "animate-spin" : ""} />
                {loadingProjects ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Content */}
            {loadingProjects ? (
              <div className="text-center py-10 text-blue-300 text-lg">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-10 text-gray-400 border border-dashed border-gray-600 rounded-2xl bg-slate-900/70">
                <p className="text-base">No projects found.</p>
                <p className="text-xs mt-1 text-gray-500">
                  Once departments add projects, they will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950/80 border border-blue-500/30 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-3 border-b border-blue-500/30 flex items-center justify-between">
                  <span className="text-sm text-blue-100/80">
                    Total projects:{" "}
                    <span className="font-bold text-blue-50">
                      {projects.length}
                    </span>
                  </span>
                </div>
                <div
                  className="overflow-x-auto"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <table className="w-full text-sm md:text-base text-left border-separate border-spacing-y-2 min-w-[1100px] mx-auto">
                    <thead>
                      <tr className="bg-blue-900/70 text-blue-100 text-sm md:text-base">
                        <th className="px-6 py-4 rounded-l-xl">Project Name</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Budget</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Start</th>
                        <th className="px-6 py-4 rounded-r-xl">End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr
                          key={p.id}
                          className="bg-slate-800/80 text-blue-50 hover:bg-blue-900/40 transition-all cursor-pointer"
                          onClick={() => setSelectedProject(p)}
                          title="View details"
                        >
                          <td className="px-6 py-4 font-semibold truncate max-w-[260px]">
                            {p.project_name}
                          </td>
                          <td className="px-6 py-4">{p.department_id}</td>
                          <td className="px-6 py-4">{p.type}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1">
                              <FaMapMarkerAlt className="text-blue-300" />
                              <span>{p.location}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4">₹{p.budget}</td>
                          <td className="px-6 py-4">{p.status}</td>
                          <td className="px-6 py-4">{p.start_date}</td>
                          <td className="px-6 py-4">{p.end_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modal for project details */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-slate-950 rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-blue-400/40 relative animate-fade-in text-blue-50">
                <button
                  className="absolute top-3 right-3 text-blue-200 hover:text-red-400 text-2xl font-bold"
                  onClick={() => setSelectedProject(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-blue-100 mb-4 text-center flex items-center justify-center gap-2">
                  <FaProjectDiagram className="text-blue-300" />
                  Project Details
                </h2>
                <div className="border border-blue-500/30 rounded-xl p-4 bg-slate-900/80">
                  <table className="w-full text-xs md:text-sm text-blue-50 border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Project Name
                        </td>
                        <td>{selectedProject.project_name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Department
                        </td>
                        <td>{selectedProject.department_id}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Type
                        </td>
                        <td>{selectedProject.type}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Location
                        </td>
                        <td>{selectedProject.location}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Budget
                        </td>
                        <td>₹{selectedProject.budget}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Status
                        </td>
                        <td>{selectedProject.status}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Start Date
                        </td>
                        <td>{selectedProject.start_date}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          End Date
                        </td>
                        <td>{selectedProject.end_date}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-blue-200 pr-3">
                          Description
                        </td>
                        <td>{selectedProject.description}</td>
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
