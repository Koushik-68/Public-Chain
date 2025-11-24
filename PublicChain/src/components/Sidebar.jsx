import {
  FaHome,
  FaFolderOpen,
  FaMapMarkedAlt,
  FaCommentDots,
  FaLink,
} from "react-icons/fa";

export default function Sidebar({ active = "Dashboard" }) {
  return (
    <aside className="bg-white border-r border-slate-200 text-slate-900 w-72 min-h-screen flex flex-col py-8 px-5 shadow-sm">
      {/* Brand / Emblem */}
      <div className="mb-10 flex items-center gap-3 px-1">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center shadow-md">
          {/* --- OLD ORIGINAL SYMBOL RESTORED --- */}
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        <div>
          <span className="font-semibold text-base text-slate-900 tracking-wide">
            PublicChain Portal
          </span>
          <p className="text-[11px] text-slate-500">
            Citizen Transparency Dashboard
          </p>
        </div>
      </div>

      <div className="px-1 mb-4">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Navigation
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarButton
          label="Dashboard"
          active={active === "Dashboard"}
          href="/public"
        />
        <SidebarButton
          label="View All Projects"
          active={active === "View All Projects"}
          href="/public/view-all-projects"
        />
        <SidebarButton
          label="Track by Location/Dept"
          active={active === "Track by Location/Dept"}
          href="/public/track-by-location-dept"
        />
        <SidebarButton
          label="Submit Feedback"
          active={active === "Submit Feedback"}
          href="/public/submit-feedback"
        />
        <SidebarButton
          label="Blockchain Explorer"
          active={active === "Blockchain Explorer"}
          href="/public/blockchain"
        />
      </nav>

      <div className="mt-auto pt-8 px-1 text-[11px] text-slate-500 border-t border-slate-200">
        Citizen View • Read-only
      </div>
    </aside>
  );
}

function SidebarButton({ label, active, href }) {
  let icon;
  if (label === "Dashboard") {
    icon = <FaHome className="w-5 h-5" />;
  } else if (label === "View All Projects") {
    icon = <FaFolderOpen className="w-5 h-5" />;
  } else if (label === "Track by Location/Dept") {
    icon = <FaMapMarkedAlt className="w-5 h-5" />;
  } else if (label === "Submit Feedback") {
    icon = <FaCommentDots className="w-5 h-5" />;
  } else if (label === "Blockchain Explorer") {
    icon = <FaLink className="w-5 h-5" />;
  }

  return (
    <a
      href={href}
      className={`flex items-center justify-between px-5 py-4 rounded-xl text-base font-medium transition-all duration-150
      ${
        active
          ? "bg-slate-900 text-white shadow-md scale-[1.03]"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-4">
        <span className={`${active ? "text-emerald-300" : "text-slate-500"}`}>
          {icon}
        </span>

        {label}
      </span>

      {active && (
        <span className="text-[10px] uppercase tracking-wider text-emerald-300">
          Active
        </span>
      )}
    </a>
  );
}
