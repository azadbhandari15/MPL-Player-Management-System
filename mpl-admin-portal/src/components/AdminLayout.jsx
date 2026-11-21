import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const LINKS = [
  { label: "Dashboard", to: "/" },
  { label: "Teams", to: "/teams" },
  { label: "Players", to: "/players" },
  { label: "Live Auction", to: "/auction" },
];

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-white text-neutral-900 md:flex">
      <aside className="bg-black p-4 text-white md:min-h-screen md:w-60">
        <div className="flex items-center gap-2 px-2 pb-4 text-xl font-bold">
          <span>🏏</span>
          <span>
            MPL <span className="text-brand-500">Admin</span>
          </span>
        </div>

        <nav className="flex gap-2 md:flex-col">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand-600 font-semibold text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="mt-4 w-full rounded-lg border border-white/20 px-3 py-2 text-sm text-white/70 transition hover:border-brand-500 hover:text-brand-500 md:mt-8"
        >
          Log out
        </button>
      </aside>

      <main className="flex-1 bg-white p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}