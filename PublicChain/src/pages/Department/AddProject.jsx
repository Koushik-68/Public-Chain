// src/pages/Department/AddProject.jsx
import { useEffect, useState, useRef } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

export default function AddProject() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const [form, setForm] = useState({
    projectName: "",
    departmentId: "",
    type: "Development", // Development / Maintenance / Scholarship / Other
    location: "",
    budget: "",
    officer: "",
    contact: "",
    startDate: "",
    endDate: "",
    description: "",
    blockchainVerify: true,
    status: "Draft", // Draft / Pending / Active / Completed
  });

  const [files, setFiles] = useState([]); // File objects
  const [filePreviews, setFilePreviews] = useState([]); // preview URLs
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDepartments() {
      setLoadingDepts(true);
      try {
        const res = await api.get("/api/departments");
        if (!mounted) return;
        setDepartments(res.data.departments || []);
      } catch (err) {
        if (mounted) {
          // fallback data
          setDepartments([
            { id: "pwd", name: "Public Works Department" },
            { id: "edu", name: "Education Department" },
            { id: "health", name: "Health Department" },
          ]);
        }
      } finally {
        if (mounted) setLoadingDepts(false);
      }
    }

    fetchDepartments();

    return () => {
      mounted = false;
      filePreviews.forEach((u) => u && URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-generate simple project id preview (not persisted)
  const projectIdPreview = form.projectName
    ? `PRJ-${form.projectName.replace(/\s+/g, "-").slice(0, 12).toUpperCase()}`
    : "PRJ-XXXX";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFilesChange(e) {
    const chosen = Array.from(e.target.files || []);
    const maxFiles = 6;
    const allowed = chosen.slice(0, maxFiles - files.length);
    const newFiles = [...files, ...allowed];
    setFiles(newFiles);

    const newPreviews = allowed.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : null
    );
    setFilePreviews((p) => [...p, ...newPreviews]);
  }

  function removeFile(index) {
    setFiles((old) => old.filter((_, i) => i !== index));
    setFilePreviews((old) => {
      const toRevoke = old[index];
      if (toRevoke) URL.revokeObjectURL(toRevoke);
      return old.filter((_, i) => i !== index);
    });
  }

  function clearForm() {
    setForm({
      projectName: "",
      departmentId: "",
      type: "Development",
      location: "",
      budget: "",
      officer: "",
      contact: "",
      startDate: "",
      endDate: "",
      description: "",
      blockchainVerify: true,
      status: "Draft",
    });
    setFiles([]);
    filePreviews.forEach((u) => u && URL.revokeObjectURL(u));
    setFilePreviews([]);
  }

  async function handleSubmit(e, publish = false) {
    e.preventDefault();

    // basic validation
    if (!form.projectName || !form.departmentId || !form.budget) {
      setMessage({ type: "error", text: "Please fill required fields." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("projectName", form.projectName);
      payload.append("departmentId", form.departmentId);
      payload.append("type", form.type);
      payload.append("location", form.location);
      payload.append("budget", form.budget);
      payload.append("officer", form.officer);
      payload.append("contact", form.contact);
      payload.append("startDate", form.startDate || "");
      payload.append("endDate", form.endDate || "");
      payload.append("description", form.description || "");
      payload.append("blockchainVerify", form.blockchainVerify ? "1" : "0");
      payload.append("status", publish ? "Pending" : form.status);

      files.forEach((f) => {
        payload.append("documents", f, f.name);
      });

      const res = await api.post("/api/projects", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({
        type: "success",
        text: res.data.message || "Project submitted successfully.",
      });

      clearForm();

      if (publish) {
        setTimeout(() => navigate("/department/projects"), 900);
      }
    } catch (err) {
      console.error("Add project error", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Something went wrong while submitting the project.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- JSX RETURN ----------
  return (
    <div className="flex min-h-screen bg-slate-950 text-blue-50">
      <DepartmentSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto">
        {/* header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-blue-100">
              Add New Project
            </h1>
            <p className="text-xs text-blue-300/70 mt-1">
              Fill in project details, attach documents, and optionally verify
              on blockchain.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-300/70">Project ID (preview)</div>
            <div className="font-mono text-sm bg-gray-900/60 px-3 py-1 rounded-lg border border-blue-400/20">
              {projectIdPreview}
            </div>
          </div>
        </div>

        {/* messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "error"
                ? "bg-red-900/50 border border-red-600"
                : "bg-green-900/40 border border-green-400/40"
            }`}
          >
            <div className="text-sm">{message.text}</div>
          </div>
        )}

        {/* main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left: form */}
          <section className="lg:col-span-2 bg-gray-800/60 rounded-2xl p-6 shadow border border-blue-400/20">
            <form
              onSubmit={(e) => handleSubmit(e, false)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Project Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="projectName"
                    value={form.projectName}
                    onChange={handleChange}
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E.g., Primary School Lab Upgrade - District X"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="mt-2 w-full max-w-xs bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {loadingDepts ? (
                      <option>Loading...</option>
                    ) : (
                      departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                  >
                    <option>Development</option>
                    <option>Maintenance</option>
                    <option>Scholarship</option>
                    <option>Digital Learning</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                    placeholder="District / City / Village"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Budget (₹) <span className="text-red-400">*</span>
                  </label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                    placeholder="Amount in INR"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Officer In Charge
                  </label>
                  <input
                    name="officer"
                    value={form.officer}
                    onChange={handleChange}
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                    placeholder="Name of the officer"
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Contact
                  </label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                    placeholder="Phone / Email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    type="date"
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm text-blue-200 font-semibold">
                    End Date
                  </label>
                  <input
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    type="date"
                    className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-blue-200 font-semibold">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full bg-gray-900/60 border border-blue-400/10 rounded-lg px-3 py-2"
                  placeholder="Short description, objectives, and expected outcomes"
                />
              </div>

              {/* Upload area */}
              <div className="border-dashed border-2 border-blue-400/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-blue-200 font-semibold">
                      Upload Documents & Photos
                    </div>
                    <div className="text-xs text-blue-300/70">
                      PDFs, images, reports (max 6 files)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-600"
                    >
                      Choose Files
                    </button>
                  </div>
                </div>

                {/* previews */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {files.length === 0 && (
                    <div className="text-sm text-blue-300/60">
                      No files uploaded yet.
                    </div>
                  )}
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="relative bg-gray-900/50 rounded-lg p-2 border border-blue-300/10"
                    >
                      {filePreviews[i] ? (
                        <img
                          src={filePreviews[i]}
                          alt={f.name}
                          className="w-full h-28 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-28 flex items-center justify-center text-xs text-blue-200/70">
                          <div>
                            <div className="font-semibold">{f.name}</div>
                            <div className="text-xs mt-1">
                              {(f.size / 1024).toFixed(0)} KB
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute -top-2 -right-2 bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center shadow"
                        title="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.blockchainVerify}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          blockchainVerify: e.target.checked,
                        }))
                      }
                      className="form-checkbox h-4 w-4 text-blue-500"
                    />
                    <span className="text-blue-200">
                      Record hash on blockchain
                    </span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm ml-4">
                    <input
                      type="checkbox"
                      checked={form.status === "Active"}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          status: e.target.checked ? "Active" : "Draft",
                        }))
                      }
                      className="form-checkbox h-4 w-4 text-green-400"
                    />
                    <span className="text-blue-200">Set Active</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-gray-700/60 hover:bg-gray-700 text-blue-100 border border-blue-400/10"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-gray-900 font-semibold shadow hover:opacity-95"
                  >
                    {submitting ? "Submitting..." : "Submit & Verify"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* right: quick stats / recent projects */}
          <aside className="bg-gray-800/60 rounded-2xl p-6 shadow border border-blue-400/10">
            <h3 className="text-lg font-bold text-blue-200 mb-3">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-900/30 p-3 rounded-lg">
                <div>
                  <div className="text-sm text-blue-200/80">Your Projects</div>
                  <div className="font-bold text-xl">24</div>
                </div>
                <button
                  onClick={() => navigate("/department/projects")}
                  className="px-3 py-1 rounded bg-blue-700/60 hover:bg-blue-600"
                >
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-900/30 p-3 rounded-lg">
                <div>
                  <div className="text-sm text-blue-200/80">
                    Pending Verifications
                  </div>
                  <div className="font-bold text-xl text-yellow-300">3</div>
                </div>
                <button
                  onClick={() => navigate("/department/verification")}
                  className="px-3 py-1 rounded bg-yellow-700/60 hover:bg-yellow-600"
                >
                  Verify
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-900/30 p-3 rounded-lg">
                <div>
                  <div className="text-sm text-blue-200/80">Recent Alerts</div>
                  <div className="font-bold text-lg text-red-300">1</div>
                </div>
                <button
                  onClick={() => navigate("/department/alerts")}
                  className="px-3 py-1 rounded bg-red-700/50 hover:bg-red-600"
                >
                  View
                </button>
              </div>
            </div>

            <hr className="my-4 border-blue-400/10" />

            <div>
              <h4 className="text-sm text-blue-200/80 mb-2">Tips</h4>
              <ul className="text-xs text-blue-300/70 space-y-1">
                <li>- Use clear project names for easy search</li>
                <li>- Attach photos & receipts for blockchain proof</li>
                <li>- Keep budgets and timelines realistic</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
