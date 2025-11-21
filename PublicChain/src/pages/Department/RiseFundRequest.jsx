// src/pages/Department/RiseFundRequest.jsx
import React, { useEffect, useState, useRef } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api"; // keep for later integration
import {
  Send,
  Eye,
  Paperclip,
  Trash2,
  AlertTriangle,
  Users,
  Save,
  Copy,
  Zap,
} from "lucide-react"; // Importing modern icons

export default function RiseFundRequest() {
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [files, setFiles] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedId, setGeneratedId] = useState("");
  const [impactEstimate, setImpactEstimate] = useState("");
  const fileInputRef = useRef(null);

  const DRAFT_KEY = "rise_fund_request_draft";

  useEffect(() => {
    // Generate a simple request id
    setGeneratedId(() => {
      const now = Date.now().toString(36).slice(-6).toUpperCase();
      return `RFR-${now}`;
    });

    // Load draft if available
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setDepartment(d.department || "");
        setTitle(d.title || "");
        setAmount(d.amount || "");
        setUrgency(d.urgency || "Normal");
        setReason(d.reason || "");
        setContact(d.contact || "");
        setImpactEstimate(d.impactEstimate || "");
        // files can't be restored (browser security)
      } catch (e) {
        console.warn("Failed to load draft", e);
      }
    }
  }, []);

  useEffect(() => {
    // save a lightweight draft (no files)
    const draft = {
      department,
      title,
      amount,
      urgency,
      reason,
      contact,
      impactEstimate,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [department, title, amount, urgency, reason, contact, impactEstimate]);

  function validate() {
    const e = {};
    if (!department) e.department = "Select department";
    if (!title || title.trim().length < 6)
      e.title = "Enter a descriptive title (min 6 chars)";
    if (!amount || Number(amount.toString().replace(/[^0-9.]/g, "")) <= 0)
      e.amount = "Enter a valid amount";
    if (!reason || reason.trim().length < 10)
      e.reason = "Give a clear reason (min 10 chars)";
    if (!contact || contact.trim().length < 6)
      e.contact = "Provide a contact name or phone";
    return e;
  }

  function prettifyAmountInput(val) {
    const numeric = val.toString().replace(/[^0-9.]/g, "");
    if (!numeric) return "";
    const parts = numeric.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  function handleAmountChange(e) {
    const raw = e.target.value;
    setAmount(prettifyAmountInput(raw));
    const num = Number(raw.toString().replace(/[^0-9.]/g, ""));
    if (!isNaN(num) && num > 0) {
      // Adjusted calculation for impact estimate: 1 beneficiary unit per 20,000 for a more generous estimate
      setImpactEstimate(
        `Will support ~${Math.max(
          1,
          Math.round(num / 20000)
        )} beneficiary units`
      );
    } else {
      setImpactEstimate("");
    }
  }

  function handleFilesChange(e) {
    const newFiles = Array.from(e.target.files || []);
    // Limit to 5 files total
    const total = [...files, ...newFiles].slice(0, 5);
    setFiles(total);
    // reset input so same file can be re-attached if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(idx) {
    setFiles((f) => f.filter((_, i) => i !== idx));
  }

  function openFilePicker() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function submitRequest() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      // Prepare files as JSON string (for backend text column)
      const filesInfo = files.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      }));
      const payload = {
        department,
        title,
        amount: amount.toString().replace(/[^0-9.]/g, ""),
        urgency,
        reason,
        contact,
        files: JSON.stringify(filesInfo),
        impactEstimate,
        status: "Pending",
        generatedId,
      };
      await api.post("/api/rise-fund-request", payload);
      setSubmitting(false);
      localStorage.removeItem(DRAFT_KEY);
      setPreviewOpen(false);
      alert("Request submitted successfully.");
      // reset
      setDepartment("");
      setTitle("");
      setAmount("");
      setUrgency("Normal");
      setReason("");
      setContact("");
      setFiles([]);
      setImpactEstimate("");
      setGeneratedId(() => {
        const now = Date.now().toString(36).slice(-6).toUpperCase();
        return `RFR-${now}`;
      });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
      alert("Failed to submit. Check console for details.");
    }
  }

  // --- Utility for Urgency Styling ---
  const getUrgencyClasses = (level) => {
    switch (level) {
      case "Critical":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "High":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Normal":
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-slate-50">
      <DepartmentSidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300 tracking-tight">
              Rise Fund Request
            </h1>

            <div className="text-sm text-gray-400 mt-1">
              Create and submit vital funding requests quickly
            </div>
          </div>

          <div className="space-x-4 flex items-center">
            <div className="text-right p-2 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="text-xs text-purple-300 font-medium">
                Request ID
              </div>
              <div className="font-mono font-bold text-base text-cyan-300 tracking-wider">
                {generatedId}
              </div>
            </div>
            <button
              onClick={() => setPreviewOpen(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold shadow-2xl shadow-purple-900/50 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 flex items-center gap-2"
              type="button"
            >
              <Eye size={18} />
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form column - Sleek dark card with a subtle glow effect */}
          <div className="lg:col-span-2 bg-gray-900/70 rounded-3xl p-6 md:p-8 shadow-xl border border-purple-500/20 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPreviewOpen(true);
              }}
              className="space-y-7"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department */}
                <div>
                  <label className="text-sm text-purple-300 font-semibold mb-2 block">
                    Department
                  </label>
                  <select
                    className={`w-full rounded-xl px-4 py-3 bg-gray-800 placeholder:text-gray-500 text-white transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 border ${
                      errors.department
                        ? "border-red-500/50"
                        : "border-gray-700"
                    }`}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="" disabled className="text-gray-500">
                      Select Department
                    </option>
                    <option value="Public Works">Public Works</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Transport">Transport</option>
                  </select>
                  {errors.department && (
                    <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {errors.department}
                    </div>
                  )}
                </div>

                {/* Request Title */}
                <div>
                  <label className="text-sm text-purple-300 font-semibold mb-2 block">
                    Request Title
                  </label>
                  <input
                    className={`w-full rounded-xl px-4 py-3 bg-gray-800 placeholder:text-gray-500 text-white transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 border ${
                      errors.title ? "border-red-500/50" : "border-gray-700"
                    }`}
                    placeholder="Short descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  {errors.title && (
                    <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {errors.title}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Amount */}
                <div className="flex flex-col">
                  <label className="text-sm text-purple-300 font-semibold mb-2 block">
                    Amount Needed (₹)
                  </label>
                  <input
                    inputMode="numeric"
                    className={`w-full rounded-xl px-4 py-3 bg-gray-800 placeholder:text-gray-500 text-white font-mono text-lg transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 border ${
                      errors.amount ? "border-red-500/50" : "border-gray-700"
                    }`}
                    placeholder="1,00,000.00"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                  {errors.amount && (
                    <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {errors.amount}
                    </div>
                  )}
                </div>

                {/* Urgency dropdown */}
                <div className="flex flex-col">
                  <label className="text-sm text-purple-300 font-semibold mb-2 block">
                    Urgency Level
                  </label>
                  <select
                    className={`w-full rounded-xl px-4 py-3 bg-gray-800 transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 border ${
                      errors.urgency ? "border-red-500/50" : "border-gray-700"
                    } ${getUrgencyClasses(urgency)}`}
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                  <label className="text-sm text-purple-300 font-semibold mb-2 block">
                    Contact Person/Info
                  </label>
                  <input
                    className={`w-full rounded-xl px-4 py-3 bg-gray-800 placeholder:text-gray-500 text-white transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 border ${
                      errors.contact ? "border-red-500/50" : "border-gray-700"
                    }`}
                    placeholder="Name / Phone / Email"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                  {errors.contact && (
                    <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {errors.contact}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-purple-300 font-semibold mb-2 block">
                  Reason for Request
                </label>
                <textarea
                  rows={5}
                  className={`w-full rounded-xl px-4 py-3 bg-gray-800 placeholder:text-gray-500 text-white transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 border ${
                    errors.reason ? "border-red-500/50" : "border-gray-700"
                  }`}
                  placeholder="Explain what the funds will be used for, timelines, and expected outcomes (minimum 10 characters)."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                {errors.reason && (
                  <div className="text-xs text-red-400 mt-2 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {errors.reason}
                  </div>
                )}
              </div>
              {/* Attachments */}
              <div>
                <label className="text-sm text-purple-300 font-semibold mb-2 block">
                  Supporting Documents (max 5)
                </label>
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="w-fit px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-md shadow-emerald-900/50 hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Paperclip size={18} />
                    Attach File(s)
                  </button>
                  <div className="text-sm text-cyan-400 flex items-center gap-2">
                    <Paperclip size={14} />
                    {files.length} file(s) attached
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                  accept=".pdf,.doc,.docx,.jpg,.png" // Added file types for better UX
                />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 bg-gray-800/80 p-3 rounded-xl border border-gray-700 shadow-inner"
                    >
                      <div className="truncate text-sm text-gray-200">
                        {f.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-cyan-400 font-mono">
                          {Math.round(f.size / 1024)} KB
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Remove File"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                {/* Left Side: Preview Button */}
                <button
                  type="submit"
                  // Use the desired left-side style (e.g., the Save Draft style for prominence)
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold shadow-2xl shadow-purple-900/50 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 flex items-center gap-2"
                >
                  <Eye size={18} />
                  Preview
                </button>

                {/* Right Side: Save Draft Button */}
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(
                      DRAFT_KEY,
                      JSON.stringify({
                        department,
                        title,
                        amount,
                        urgency,
                        reason,
                        contact,
                        impactEstimate,
                      })
                    );
                    alert("Draft saved locally.");
                  }}
                  // Use the desired right-side style (e.g., the less prominent Save Draft style)
                  className="px-5 py-2 rounded-full bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Draft
                </button>
              </div>
            </form>

            <div className="mt-8 text-xs text-gray-500 border-t border-gray-800 pt-4">
              *Tip: Documents such as budget estimates, quotes, or photos are
              recommended. Max 5 files.
            </div>
          </div>

          {/* Right column - summary / analytics card (Modern design) */}
          <div className="bg-gray-900/70 rounded-3xl p-6 md:p-8 shadow-xl border border-cyan-500/20 backdrop-blur-sm h-fit sticky top-8">
            <h3 className="text-xl font-bold text-cyan-300 border-b border-gray-800 pb-3 mb-4">
              Request Overview
            </h3>
            <div className="space-y-4 text-sm text-gray-200">
              <div className="p-3 bg-gray-800/60 rounded-xl">
                <div className="text-xs text-purple-400">Title</div>
                <div className="font-medium mt-1">{title || "—"}</div>
              </div>
              <div className="p-3 bg-gray-800/60 rounded-xl">
                <div className="text-xs text-purple-400">Amount</div>
                <div className="font-medium mt-1 text-lg text-emerald-300">
                  {amount ? `₹ ${amount}` : "—"}
                </div>
              </div>
              <div
                className={`p-3 rounded-xl border-l-4 ${getUrgencyClasses(
                  urgency
                )}`}
              >
                <div className="text-xs text-purple-400">Urgency</div>
                <div className="font-bold mt-1">{urgency}</div>
              </div>
              <div className="p-3 bg-gray-800/60 rounded-xl">
                <div className="text-xs text-purple-400">Attachments</div>
                <div className="font-medium mt-1">
                  {files.length} file(s) attached
                </div>
              </div>
              <div className="p-3 bg-gray-800/60 rounded-xl">
                <div className="text-xs text-purple-400">Contact</div>
                <div className="font-medium mt-1">{contact || "—"}</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-800">
              <h4 className="text-md text-cyan-300 font-semibold mb-4">
                Quick Actions
              </h4>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(generatedId);
                    alert("Copied Request ID");
                  }}
                  className="px-4 py-2 text-sm rounded-xl bg-gray-800/80 border border-gray-700 text-gray-300 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  <Copy size={16} />
                  Copy Request ID
                </button>
                <button
                  onClick={() => {
                    setDepartment("Public Works");
                    setTitle("Sample: Urgent Road Repair in Sector 4");
                    setAmount("1,50,000");
                    setReason(
                      "Critical structural damage to main access road (Sector 4), requiring immediate asphalt patching and reinforcement. Timeline: 7 days. Expected outcome: Safe transport access restored for 500+ residents."
                    );
                    setContact("John Doe, Public Works Manager / 9999999999");
                    handleAmountChange({ target: { value: "150000" } }); // Manually trigger impact calc
                    alert("Filled with sample values");
                  }}
                  className="px-4 py-2 text-sm rounded-xl bg-gray-800/80 border border-purple-500/30 text-purple-300 hover:bg-purple-900/30 transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  <Zap size={16} />
                  Fill Sample Data
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem(DRAFT_KEY);
                    setDepartment("");
                    setTitle("");
                    setAmount("");
                    setUrgency("Normal");
                    setReason("");
                    setContact("");
                    setFiles([]);
                    setImpactEstimate("");
                    alert("Draft cleared");
                  }}
                  className="px-4 py-2 text-sm rounded-xl bg-gray-800/80 border border-red-500/30 text-red-400 hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                  type="button"
                >
                  <Trash2 size={16} />
                  Clear Local Draft
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal - Enhanced Dark/Glassmorphic Style */}
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900/95 rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl border border-cyan-400/30 animate-in fade-in-5 zoom-in-95">
              <div className="flex items-start justify-between pb-4 border-b border-gray-800">
                <div>
                  <h2 className="text-3xl font-bold text-cyan-300 tracking-tight">
                    Review & Submit
                  </h2>
                  <div className="text-sm text-gray-400 mt-1">
                    Confirm all details are correct before final submission.
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-purple-300">Request ID</div>
                  <div className="font-mono font-bold text-lg text-cyan-300">
                    {generatedId}
                  </div>
                  <button
                    onClick={() => setPreviewOpen(false)}
                    className="text-2xl text-gray-400 hover:text-white transition-colors mt-2"
                    type="button"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-300">
                    Key Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem title="Department" value={department} />
                    <DetailItem
                      title="Urgency"
                      value={urgency}
                      customClass={getUrgencyClasses(urgency)}
                    />
                    <DetailItem
                      title="Title"
                      value={title}
                      colSpan="col-span-2"
                    />
                    <DetailItem
                      title="Amount"
                      value={amount ? `₹ ${amount}` : "—"}
                      customClass="text-emerald-300 font-bold"
                    />
                    <DetailItem title="Contact" value={contact} />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-300">
                    Reason & Attachments
                  </h3>
                  <div className="mt-4">
                    <div className="text-xs text-gray-400">Reason</div>
                    <div className="bg-gray-800/40 p-4 rounded-xl mt-2 text-sm text-gray-200 border border-gray-700/50 min-h-[100px] whitespace-pre-wrap">
                      {reason || "—"}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="text-xs text-gray-400">Attachments</div>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                      {files.length ? (
                        files.map((f, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-gray-800/60 p-3 rounded-lg border border-gray-700/50"
                          >
                            <div className="truncate text-sm font-medium text-gray-200">
                              <Paperclip
                                size={14}
                                className="inline mr-2 text-cyan-400"
                              />
                              {f.name}
                            </div>
                            <div className="text-xs text-cyan-400 font-mono">
                              {Math.round(f.size / 1024)} KB
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 p-3 bg-gray-800/30 rounded-lg">
                          No supporting documents attached.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-800">
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="px-5 py-2 rounded-full bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                  type="button"
                >
                  Edit Request
                </button>
                <button
                  onClick={submitRequest}
                  disabled={submitting}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-semibold shadow-2xl shadow-emerald-900/50 hover:from-emerald-600 hover:to-cyan-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  <Send size={18} />
                  {submitting ? "Submitting..." : "Confirm & Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Reusable component for the Modal's detail display
const DetailItem = ({ title, value, customClass = "", colSpan = "" }) => (
  <div className={`${colSpan}`}>
    <div className="text-xs text-gray-400">{title}</div>
    <div className={`font-medium mt-1 text-gray-200 ${customClass}`}>
      {value || "—"}
    </div>
  </div>
);
