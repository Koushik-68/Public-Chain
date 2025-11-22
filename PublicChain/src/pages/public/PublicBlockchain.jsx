import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "../../axios/api";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaPhone,
  FaInfoCircle,
  FaKey,
  FaLink,
  FaUnlink,
  FaCube,
  FaCubes,
} from "react-icons/fa";

export default function PublicBlockchain() {
  const [chain, setChain] = useState([]);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingVerify, setLoadingVerify] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blockchain chain
  useEffect(() => {
    async function fetchChain() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/blockchain/chain");
        const rows = res.data.chain || [];

        // Ensure fund_data is object (parse if string)
        const normalized = rows.map((block) => {
          let fundData = block.fund_data;
          if (typeof fundData === "string") {
            try {
              fundData = JSON.parse(fundData);
            } catch (e) {
              // leave as is if parse fails
            }
          }
          return { ...block, fund_data: fundData };
        });

        setChain(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load blockchain data.");
        setChain([]);
      } finally {
        setLoading(false);
      }
    }

    async function fetchVerify() {
      try {
        setLoadingVerify(true);
        const res = await axios.get("/api/blockchain/verify");
        setValid(!!res.data.valid);
      } catch (err) {
        console.error(err);
        // if verification API fails, consider chain invalid
        setValid(false);
      } finally {
        setLoadingVerify(false);
      }
    }

    fetchChain();
    fetchVerify();
  }, []);

  const formatDateTime = (value) => {
    if (!value) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return new Date(num).toLocaleString();
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined) return "-";
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString("en-IN");
  };

  const statusColor = valid
    ? "from-emerald-500 to-green-600"
    : "from-red-500 to-rose-600";
  const statusIcon = valid ? (
    <FaCheckCircle className="w-7 h-7 text-emerald-200" />
  ) : (
    <FaExclamationTriangle className="w-7 h-7 text-rose-200" />
  );
  const statusText = valid
    ? "Blockchain Verified"
    : "Blockchain Broken / Tampered";
  const statusDesc = valid
    ? "All fund release records are consistent and cryptographically secured."
    : "Some blocks do not match their original hashes. Data may have been changed.";

  const nodeIcon = valid ? (
    <FaLink className="w-3.5 h-3.5 text-emerald-100" />
  ) : (
    <FaUnlink className="w-3.5 h-3.5 text-rose-100" />
  );

  return (
    <div className="min-h-screen w-full flex flex-row bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <Sidebar active="Blockchain Explorer" />

      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4 md:px-10 relative overflow-hidden">
        {/* background glows */}
        <div className="pointer-events-none absolute -top-24 -right-10 w-72 h-72 bg-indigo-500/25 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute bottom-[-100px] left-[-40px] w-80 h-80 bg-emerald-500/20 blur-3xl rounded-full" />

        <div className="w-full max-w-6xl space-y-8 relative z-10">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/60 shadow-lg shadow-indigo-700/40">
                  <FaCubes className="text-indigo-200 w-7 h-7" />
                </span>
                Public Fund Blockchain
              </h1>
              <p className="text-sm md:text-base text-indigo-200/80 mt-2 max-w-2xl">
                Every released fund is sealed into a block and linked using
                cryptographic hashes. Any change in old data breaks the chain
                and is visible here.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-indigo-500/40 rounded-2xl px-4 py-3 text-xs md:text-sm text-indigo-100 shadow-md max-w-xs">
              <div className="flex items-center gap-2 font-semibold">
                <FaInfoCircle className="text-indigo-300" />
                <span>How this works</span>
              </div>
              <p className="mt-1 text-indigo-200/70">
                Each block contains fund details, hashes, and signatures. The
                chain is valid only if every block correctly links to the
                previous one.
              </p>
            </div>
          </header>

          {/* Global Blockchain Status */}
          <section
            className={`relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-gradient-to-r ${statusColor} text-white p-6 md:p-8`}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-white/15 blur-3xl -top-16 -left-12" />
              <div className="w-72 h-72 rounded-full bg-black/30 blur-3xl bottom-[-40px] right-[-80px]" />
            </div>

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">{statusIcon}</div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                    {statusText}
                    {loadingVerify && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-black/30 border border-white/20">
                        Checking...
                      </span>
                    )}
                  </h2>
                  <p className="text-sm md:text-base text-white/80 mt-1">
                    {statusDesc}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 border border-white/20">
                      <span className="w-3 h-3 rounded-sm bg-emerald-300 mr-1" />
                      Valid chain of blocks
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/20 border border-white/20">
                      <span className="w-3 h-3 rounded-sm bg-rose-300 mr-1" />
                      Broken / tampered chain
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl px-4 py-3 text-sm flex flex-col gap-2 min-w-[230px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-2">
                    <FaLink className="w-4 h-4" />
                    Total Blocks
                  </span>
                  <span className="font-bold text-xl">
                    {loading ? "..." : chain.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/85 mt-1">
                  <FaInfoCircle className="w-3 h-3" />
                  <span>
                    Any modification in earlier data changes its hash and breaks
                    the chain link visualization below.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div className="bg-red-900/40 border border-red-400/70 rounded-2xl p-4 text-red-100 text-sm shadow-lg">
              {error}
            </div>
          )}

          {/* Chain view */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaProjectDiagram className="text-indigo-300 w-6 h-6" />
              Blockchain Chain Visualization
            </h2>

            {loading ? (
              <div className="text-center text-indigo-200 py-10 font-medium">
                Loading blockchain blocks...
              </div>
            ) : chain.length === 0 ? (
              <div className="text-center text-indigo-200/80 py-10 font-medium bg-slate-900/60 rounded-2xl border border-slate-700">
                No blocks found yet. Once government releases funds, each
                transaction will appear here as a chained block.
              </div>
            ) : (
              <div className="relative flex flex-col md:flex-row gap-8 md:gap-10">
                {/* Left legend for chain type */}
                <div className="hidden md:flex flex-col gap-3 pt-2 min-w-[160px]">
                  <div className="flex items-center gap-2 text-xs text-indigo-200/80">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span>Valid chain link</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-rose-200/80">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span>Broken / tampered chain</span>
                  </div>
                </div>

                {/* Chain blocks */}
                <div className="relative flex-1">
                  {/* Vertical chain line */}
                  <div
                    className={`absolute left-5 top-0 bottom-0 ${
                      valid
                        ? "border-l-4 border-emerald-400"
                        : "border-l-4 border-rose-400 border-dashed"
                    }`}
                  />

                  <div className="space-y-6">
                    {chain.map((block, index) => {
                      const fund = block.fund_data || {};
                      const isFirst = index === 0;
                      const isLast = index === chain.length - 1;

                      return (
                        <div key={block.id} className="relative pl-10">
                          {/* Chain node circle with chain icon */}
                          <div
                            className={`absolute left-2 top-7 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                              valid
                                ? "bg-emerald-500 border-emerald-100 border-2"
                                : "bg-rose-500 border-rose-100 border-2"
                            }`}
                          >
                            {nodeIcon}
                          </div>

                          {/* Block card */}
                          <div className="bg-slate-900/80 rounded-3xl shadow-2xl border border-slate-700 p-5 md:p-6 backdrop-blur-sm">
                            {/* Block header row */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-indigo-300 font-semibold">
                                  <FaCube className="w-3 h-3" />
                                  Block #{index + 1}
                                </div>
                                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-300 font-semibold">
                                  <FaBuilding className="w-4 h-4" />
                                  {fund.department || "Unknown Department"}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white flex flex-wrap items-center gap-2">
                                  {fund.title || "Untitled Fund Release"}
                                  {isFirst && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-100 border border-indigo-400/50">
                                      Genesis Block
                                    </span>
                                  )}
                                  {isLast && chain.length > 1 && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/50">
                                      Latest Block
                                    </span>
                                  )}
                                </h3>
                                {fund.reason && (
                                  <p className="text-xs md:text-sm text-indigo-100/80">
                                    {fund.reason}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1 text-right">
                                <div className="flex items-center gap-1 text-[11px] text-indigo-200/80">
                                  <FaClock className="w-4 h-4" />
                                  <span>{formatDateTime(block.timestamp)}</span>
                                </div>
                                <div
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                                    fund.urgency === "High"
                                      ? "bg-red-500/20 text-red-200 border border-red-400/60"
                                      : fund.urgency === "Normal"
                                      ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/60"
                                      : "bg-indigo-500/20 text-indigo-100 border border-indigo-400/60"
                                  }`}
                                >
                                  Urgency: {fund.urgency || "Not specified"}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-300">
                                  <FaMoneyBillWave className="w-4 h-4" />₹
                                  {formatAmount(fund.amount)}
                                </div>
                              </div>
                            </div>

                            {/* Extra Info row */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] md:text-xs">
                              <div className="bg-indigo-900/60 rounded-2xl p-3 border border-indigo-500/50">
                                <div className="font-semibold text-indigo-100 mb-1">
                                  Contact
                                </div>
                                <div className="flex items-center gap-2 text-indigo-100/80">
                                  <FaPhone className="w-4 h-4 text-indigo-300" />
                                  <span>{fund.contact || "Not provided"}</span>
                                </div>
                              </div>

                              <div className="bg-slate-900/80 rounded-2xl p-3 border border-blue-500/50">
                                <div className="font-semibold text-blue-100 mb-1 flex items-center gap-2">
                                  <FaKey className="w-4 h-4 text-blue-300" />
                                  Block Hash
                                </div>
                                <div className="text-[10px] break-all text-blue-100/80">
                                  {block.block_hash}
                                </div>
                              </div>

                              <div className="bg-slate-900/80 rounded-2xl p-3 border border-slate-500/50">
                                <div className="font-semibold text-slate-100 mb-1 flex items-center gap-2">
                                  <FaLink className="w-4 h-4 text-slate-300" />
                                  Previous Hash
                                </div>
                                <div className="text-[10px] break-all text-slate-100/80">
                                  {block.prev_hash || "None (Genesis Block)"}
                                </div>
                              </div>
                            </div>

                            {/* Signature row */}
                            <div className="mt-3 bg-slate-900/80 rounded-2xl p-3 border border-slate-600 text-[10px] md:text-[11px] text-slate-100/90">
                              <span className="font-semibold text-slate-50">
                                Signature:
                              </span>{" "}
                              {block.signature}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
