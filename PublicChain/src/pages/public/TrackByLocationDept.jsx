import Sidebar from "../../components/Sidebar";
// Default data for demo purposes
const departments = [
  "All Departments",
  "Infrastructure",
  "Health",
  "Education",
];
const states = ["All States", "State A", "State B", "State C"];
const initialProjects = [
  {
    name: "Smart City Initiative",
    department: "Infrastructure",
    state: "State A",
    district: "Banglore",
    status: "Ongoing",
  },
  {
    name: "Health Outreach",
    department: "Health",
    state: "State B",
    district: "Mysore",
    status: "Completed",
  },
  {
    name: "Education Reform",
    department: "Education",
    state: "State C",
    district: "Davanagere",
    status: "Ongoing",
  },
];
import { useState } from "react";

export default function TrackByLocationDept() {
  // --- ADDED state for filters/search so variables exist ---
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(departments[0]);
  const [state, setState] = useState(states[0]);
  const [district, setDistrict] = useState("");

  // Analytics: count projects per department and state
  const deptCounts = departments.slice(1).map((dept) => ({
    name: dept,
    count: initialProjects.filter((p) => p.department === dept).length,
  }));
  const stateCounts = states.slice(1).map((stateName) => ({
    name: stateName,
    count: initialProjects.filter((p) => p.state === stateName).length,
  }));

  // --- ADDED filtered computation based on search & filters ---
  const filtered = initialProjects.filter((p) => {
    // search by project name (case-insensitive)
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // department filter
    if (
      department &&
      department !== "All Departments" &&
      p.department !== department
    ) {
      return false;
    }
    // state filter
    if (state && state !== "All States" && p.state !== state) {
      return false;
    }
    // district filter (partial match)
    if (
      district &&
      !p.district.toLowerCase().includes(district.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full flex flex-row">
      <Sidebar active="Track by Location/Dept" />
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-8 bg-gradient-to-br from-[#e9eafc] to-[#f3f6ff]">
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#16213E] mb-6">
            Track Projects by Location / Department
          </h2>
          {/* Analytics charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="text-lg font-semibold text-indigo-700 mb-4">
                Projects by Department
              </h4>
              <div className="flex gap-4 items-end h-24">
                {deptCounts.map((d, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-blue-400 rounded-t-xl"
                      style={{ height: `${d.count * 30}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{d.name}</span>
                    <span className="text-xs text-indigo-700 font-bold">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="text-lg font-semibold text-indigo-700 mb-4">
                Projects by State
              </h4>
              <div className="flex gap-4 items-end h-24">
                {stateCounts.map((s, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-indigo-400 rounded-t-xl"
                      style={{ height: `${s.count * 30}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{s.name}</span>
                    <span className="text-xs text-indigo-700 font-bold">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Search and filter bar */}
          <div className="flex flex-wrap gap-4 mb-8 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            >
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            >
              {states.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District..."
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            />
          </div>
          {/* Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-3 text-center text-indigo-400 text-lg py-12">
                No projects found.
              </div>
            ) : (
              filtered.map((project, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2"
                >
                  <h3 className="text-xl font-bold text-blue-700 mb-1">
                    {project.name}
                  </h3>
                  <div className="text-sm text-indigo-700">
                    Department: {project.department}
                  </div>
                  <div className="text-sm text-gray-700">
                    State: {project.state}
                  </div>
                  <div className="text-sm text-gray-700">
                    District: {project.district}
                  </div>
                  <div className="text-sm text-gray-700">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        project.status === "Ongoing"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <button className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition-transform">
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
