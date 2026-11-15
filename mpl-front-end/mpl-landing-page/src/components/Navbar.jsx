import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { searchPlayers, NetworkError } from "../api/playerApi";
import Toast from "./Toast";
import SearchResults from "./SearchResults";
import PlayerDetailCard from "./PlayerDetailCard";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Teams", to: "/teams" },
    { label: "Contact", to: "/contact" },
    {label:"Live Auction" ,to:"/liveauction"}
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchStatus, setSearchStatus] = useState("idle");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [toast, setToast] = useState(null);

  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setSearchOpen(false);
    runSearch(q);
  }

  async function runSearch(keyword) {
    setSearchStatus("loading");
    setToast(null);
    try {
      const data = await searchPlayers(keyword);
      setSearchResults(data);
      setSearchStatus(data.length > 0 ? "success" : "empty");
    } catch (err) {
      setSearchStatus("idle");
      setToast({
        message:
          err instanceof NetworkError
            ? "Connection Problem. Please Try Again Later"
            : err.message,
        keyword,
        canRetry: err instanceof NetworkError,
      });
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50">
        <nav className="mx-auto max-w-7xl px-6">
          <div
            className="mt-4 flex h-20 items-center justify-between rounded-2xl
                        border border-white/10
                        bg-slate-900/70
                        backdrop-blur-xl
                        shadow-2xl"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-6">
              <span className="text-3xl">🏏</span>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Mandi Premier League
                </h1>
                <p className="text-xs text-yellow-400 tracking-widest uppercase">
                  Since 2024
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8 text-white">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="relative transition duration-300 hover:text-yellow-400 after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center px-6"
              role="search"
            >
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Player Info"
                  aria-label="Search"
                  className="w-44 xl:w-64 rounded-full bg-slate-800/80 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-yellow-400"
                />
              </div>
            </form>

            {/* Mobile Buttons */}
            <div className="mr-6 flex items-center gap-4 lg:hidden">
              <button
                aria-label="Search"
                onClick={() => {
                  setSearchOpen((o) => !o);
                  setIsOpen(false);
                }}
              >
                <Search color="white" />
              </button>
              <button aria-label="Menu" onClick={() => setIsOpen(true)}>
                <Menu color="white" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <form
              onSubmit={handleSearch}
              role="search"
              className="lg:hidden mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-4"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Player Info"
                  aria-label="Search"
                  className="w-full rounded-full bg-slate-800 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-yellow-400"
                />
              </div>
              <button
                type="button"
                aria-label="Close Search"
                onClick={() => setSearchOpen(false)}
              >
                <X color="white" size={20} />
              </button>
            </form>
          )}

          {/* Mobile Menu */}
          {isOpen && (
            <div className="lg:hidden mt-2 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-6 text-white">
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsOpen(false)}>
                  <X color="white" />
                </button>
              </div>
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="block text-lg hover:text-yellow-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </header>

      <SearchResults
        status={searchStatus}
        results={searchResults}
        onSelect={(p) => {
          setSelectedPlayer(p);
          setSearchStatus("idle");
        }}
        onclose={() => setSearchStatus("idle")}
      />
      <PlayerDetailCard
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
      {toast && (
        <Toast
          message={toast.message}
          onRetry={toast.canRetry ? () => runSearch(toast.keyword) : undefined}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}