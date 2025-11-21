import {
  FaHome,
  FaFolderOpen,
  FaMapMarkedAlt,
  FaCommentDots,
} from "react-icons/fa";

export default function Sidebar({ active = "Dashboard" }) {
  return (
    <aside className="bg-[#16213E] text-white w-64 min-h-screen flex flex-col py-8 px-4 shadow-xl rounded-r-3xl">
      <div className="mb-10 flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
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
        <span className="font-bold text-xl tracking-wide text-indigo-200">
          PublicChain
        </span>
      </div>
      <nav className="flex flex-col gap-2 mt-4">
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
      </nav>
    </aside>
  );
}

function SidebarButton({ label, active, href }) {
  let icon;
  if (label === "Dashboard") {
    icon = <FaHome className="w-5 h-5 mr-3 text-blue-400" />;
  } else if (label === "View All Projects") {
    icon = <FaFolderOpen className="w-5 h-5 mr-3 text-green-400" />;
  } else if (label === "Track by Location/Dept") {
    icon = <FaMapMarkedAlt className="w-5 h-5 mr-3 text-indigo-400" />;
  } else if (label === "Submit Feedback") {
    icon = <FaCommentDots className="w-5 h-5 mr-3 text-yellow-400" />;
  }
  return (
    <a
      href={href}
      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        active
          ? "bg-blue-500/30 text-blue-200 shadow-lg scale-105"
          : "hover:bg-indigo-700/30 text-indigo-200 hover:scale-105"
      }`}
      style={{ letterSpacing: "0.02em" }}
    >
      {icon}
      {label}
    </a>
  );
}
