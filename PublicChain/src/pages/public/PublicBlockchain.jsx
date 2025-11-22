import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axios from "../../axios/api";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
  FaUnlink,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaPhone,
  FaInfoCircle,
  FaKey,
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
    ? "from-emerald-500 to-sky-500"
    : "from-red-500 to-rose-500";

  const statusIcon = valid ? (
    <FaCheckCircle className="w-7 h-7 text-emerald-600" />
  ) : (
    <FaExclamationTriangle className="w-7 h-7 text-rose-600" />
  );

  const statusText = valid
    ? "Blockchain Verified"
    : "Blockchain Broken / Tampered";

  const statusDesc = valid
    ? "All fund release records are consistent and cryptographically secured."
    : "Some blocks do not match their original hashes. Data may have been changed.";

  const nodeIcon = valid ? (
    <FaLink className="w-3.5 h-3.5 text-emerald-600" />
  ) : (
    <FaUnlink className="w-3.5 h-3.5 text-rose-600" />
  );

  return (
    <div className="min-h-screen w-full flex flex-row bg-[#f4f6fb]">
      <Sidebar active="Blockchain Explorer" />

      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4 md:px-10">
        <div className="w-full max-w-6xl space-y-8">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#16213E] flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-white shadow-md border border-indigo-100">
                  <FaCubes className="text-indigo-500 w-7 h-7" />
                </span>
                Public Fund Blockchain
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">
                Every released fund is sealed into a block and connected using
                cryptographic hashes. Any change in old data breaks the chain
                and becomes visible here.
              </p>
            </div>

            <div className="bg-white border border-indigo-100 rounded-2xl px-4 py-3 text-xs md:text-sm text-gray-700 shadow-sm max-w-xs">
              <div className="flex items-center gap-2 font-semibold text-indigo-700">
                <FaInfoCircle className="text-indigo-500" />
                <span>How this works</span>
              </div>
              <p className="mt-1 text-gray-600">
                Each block holds fund details, hashes, and a signature. The
                chain is valid only if every block correctly links to the
                previous one.
              </p>
            </div>
          </header>

          {/* Global Blockchain Status */}
          <section className="relative overflow-hidden rounded-3xl shadow-md border border-gray-200 bg-white">
            <div className={`w-full h-2 bg-gradient-to-r ${statusColor}`} />

            <div className="p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{statusIcon}</div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {statusText}
                    {loadingVerify && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-600">
                        Checking...
                      </span>
                    )}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    {statusDesc}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      Valid chain of blocks
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                      <span className="w-3 h-3 rounded-full bg-rose-400" />
                      Broken / tampered chain
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl px-4 py-3 text-sm flex flex-col gap-2 min-w-[230px] border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-2 text-gray-800">
                    <FaLink className="w-4 h-4 text-indigo-500" />
                    Total Blocks
                  </span>
                  <span className="font-bold text-xl text-gray-900">
                    {loading ? "..." : chain.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                  <FaInfoCircle className="w-3 h-3 text-gray-500" />
                  <span>
                    Editing any old block changes its hash and breaks the chain
                    link shown below.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm shadow-sm">
              {error}
            </div>
          )}

          {/* Chain view */}
          <section>
            <h2 className="text-2xl font-bold text-[#16213E] mb-4 flex items-center gap-2">
              <FaProjectDiagram className="text-indigo-500 w-6 h-6" />
              Blockchain Chain
            </h2>

            {loading ? (
              <div className="text-center text-gray-600 py-10 font-medium">
                Loading blockchain blocks...
              </div>
            ) : chain.length === 0 ? (
              <div className="text-center text-gray-600 py-10 font-medium bg-white rounded-2xl border border-dashed border-gray-300">
                No blocks found yet. Once government releases funds, each
                transaction will appear here as a chained block.
              </div>
            ) : (
              <div className="relative flex flex-col md:flex-row gap-8 md:gap-10 max-h-[70vh] overflow-y-auto pr-2">
                {/* legend (desktop) */}
                <div className="hidden md:flex flex-col gap-3 pt-2 min-w-[160px] text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span>Valid chain link</span>
                  </div>
                  <div className="flex items-center gap-2">
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
                          {/* Chain node circle */}
                          <div
                            className={`absolute left-3 top-7 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                              valid
                                ? "bg-emerald-50 border border-emerald-400"
                                : "bg-rose-50 border border-rose-400"
                            }`}
                          >
                            {nodeIcon}
                          </div>

                          {/* Block card */}
                          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-5 md:p-6">
                            {/* Block header row */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-indigo-500 font-semibold">
                                  <FaCube className="w-3 h-3" />
                                  Block #{index + 1}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                                  <FaBuilding className="w-4 h-4 text-indigo-400" />
                                  {fund.department || "Unknown Department"}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-[#16213E] flex flex-wrap items-center gap-2">
                                  {fund.title || "Untitled Fund Release"}
                                  {isFirst && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                      Genesis Block
                                    </span>
                                  )}
                                  {isLast && chain.length > 1 && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Latest Block
                                    </span>
                                  )}
                                </h3>
                                {fund.reason && (
                                  <p className="text-xs md:text-sm text-gray-600">
                                    {fund.reason}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1 text-right">
                                <div className="flex items-center gap-1 text-[11px] text-gray-500">
                                  <FaClock className="w-4 h-4" />
                                  <span>{formatDateTime(block.timestamp)}</span>
                                </div>
                                <div
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
                                    fund.urgency === "High"
                                      ? "bg-red-50 text-red-600 border border-red-200"
                                      : fund.urgency === "Normal"
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                                  }`}
                                >
                                  Urgency: {fund.urgency || "Not specified"}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                                  <FaMoneyBillWave className="w-4 h-4" />₹
                                  {formatAmount(fund.amount)}
                                </div>
                              </div>
                            </div>

                            {/* Extra Info row */}
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] md:text-xs">
                              <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-100">
                                <div className="font-semibold text-indigo-700 mb-1">
                                  Contact
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                  <FaPhone className="w-4 h-4 text-indigo-400" />
                                  <span>{fund.contact || "Not provided"}</span>
                                </div>
                              </div>

                              <div className="bg-blue-50 rounded-2xl p-3 border border-blue-100">
                                <div className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
                                  <FaKey className="w-4 h-4 text-blue-400" />
                                  Block Hash
                                </div>
                                <div className="text-[10px] break-all text-gray-700">
                                  {block.block_hash}
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
                                <div className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                  <FaLink className="w-4 h-4 text-gray-400" />
                                  Previous Hash
                                </div>
                                <div className="text-[10px] break-all text-gray-700">
                                  {block.prev_hash || "None (Genesis Block)"}
                                </div>
                              </div>
                            </div>

                            {/* Signature row */}
                            <div className="mt-3 bg-slate-50 rounded-2xl p-3 border border-slate-200 text-[10px] md:text-[11px] text-gray-700">
                              <span className="font-semibold text-gray-900">
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
