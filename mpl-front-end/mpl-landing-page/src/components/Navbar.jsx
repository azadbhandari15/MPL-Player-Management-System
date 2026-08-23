import { Menu } from "lucide-react";

export default function Navbar() {
  const navItems = [
    "Home",
    "About",
    "Teams",
    "Schedule",
    "Gallery",
    "Auction",
    "Champions",
    "Contact",
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="mx-auto max-w-7xl px-6">

        <div className="mt-4 flex h-20 items-center justify-between rounded-2xl
                        border border-white/10
                        bg-slate-900/70
                        backdrop-blur-xl
                        shadow-2xl">

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
              <li key={item}>
                <a
                  href="#"
                  className="relative transition duration-300 hover:text-yellow-400
                  after:absolute
                  after:left-0
                  after:-bottom-2
                  after:h-[2px]
                  after:w-0
                  after:bg-yellow-400
                  after:transition-all
                  hover:after:w-full"
                >
                  {item}
                </a>
              </li>
            ))}

          </ul>

          {/* Register Button */}

          <div className="hidden lg:block px-6">

            <button className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black
                               transition-all duration-300
                               hover:scale-105
                               hover:bg-yellow-300
                               hover:shadow-lg hover:shadow-yellow-400/30">

              Register

            </button>

          </div>

          {/* Mobile Menu */}

          <button className="mr-6 lg:hidden">

            <Menu color="white" />

          </button>

        </div>

      </nav>
    </header>
  );
}