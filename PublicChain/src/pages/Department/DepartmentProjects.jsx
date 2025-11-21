// src/pages/Department/DepartmentProjects.jsx
import React, { useEffect, useState } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api";

export default function DepartmentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-blue-50">
      <DepartmentSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-100">
          Department Projects
        </h1>
        {loading && <div className="mb-4">Loading projects...</div>}
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-blue-300">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800 rounded-xl p-5 shadow border border-blue-400/20 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                  onClick={() => setSelectedProject(project)}
                  title="View details"
                >
                  <h2 className="text-lg font-semibold text-blue-200 mb-2">
                    {project.project_name}
                  </h2>
                  <div className="text-xs text-blue-300 mb-1">
                    Department: {project.department_id}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Type: {project.type}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Location: {project.location}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Budget: ₹{project.budget}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Officer: {project.officer}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Contact: {project.contact}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Status: {project.status}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Start: {project.start_date}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    End: {project.end_date}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Blockchain: {project.blockchain_verify === 1 ? "Yes" : "No"}
                  </div>
                  <div className="text-xs text-blue-300 mb-1">
                    Description: {project.description}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for project details */}
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
                    <td>{selectedProject.project_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Department</td>
                    <td>{selectedProject.department_id}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Type</td>
                    <td>{selectedProject.type}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Location</td>
                    <td>{selectedProject.location}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Budget</td>
                    <td>₹{selectedProject.budget}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Officer</td>
                    <td>{selectedProject.officer}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Contact</td>
                    <td>{selectedProject.contact}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td>{selectedProject.status}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Start Date</td>
                    <td>{selectedProject.start_date}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">End Date</td>
                    <td>{selectedProject.end_date}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Blockchain Verified</td>
                    <td>
                      {selectedProject.blockchain_verify === 1 ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Description</td>
                    <td>{selectedProject.description}</td>
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
