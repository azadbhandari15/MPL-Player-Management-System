import { useState, useEffect,useRef } from "react";
import { Menu, X ,ChevronDown } from "lucide-react";

const PLAYER_TYPES = ["Batsman", "Bowler", "All Rounder"];

export default function Navbar() {

  const [isOpen,setIsOpen]=useState(false);
  const [showRegister, setShowRegister]=useState(false);
  const navItems = [
    "Home",
    "About",
    "Teams",
    // "Schedule",
    // "Gallery",
    // "Auction",
    // "Champions",
    "Contact",
  ];

   const [typeOpen, setTypeOpen] = useState(false);
   const [playerType,setPlayerType]=useState("");
  const typeRef = useRef(null);

  useEffect(() => {
  function handleClickOutside(e) {
    if (typeRef.current && !typeRef.current.contains(e.target)) {
      setTypeOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  useEffect(()=>{
    function handleKey(e){
      if(e.key==="Escape") setShowRegister(false);
    }
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
  },[]);

  useEffect(()=>{
        document.body.style.overflow=showRegister?"hidden":"";
        return ()=>{document.body.style.overflow="";};
     },[showRegister]);

const [imagePreview, setImagePreview] = useState(null);

  function handleSubmit(e){
    e.preventDefault(e);
    setShowRegister(false);
  }   

  function handleImageChange(e){
    const file=e.target.files?.[0];
    if(!file){
      setImagePreview(null);
      return;
    }
    const reader=new FileReader();
    reader.onload=()=>setImagePreview(reader.result);
    reader.readAsDataURL(file);

  }

  return (
    <>
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

            <button onClick={()=>setShowRegister(true)} className="rounded-full bg-yellow-400 px-6 py-3 font-semibold text-black
                               transition-all duration-300
                               hover:scale-105
                               hover:bg-yellow-300
                               hover:shadow-lg hover:shadow-yellow-400/30">
              Register
            </button>

          </div>

          {/* Mobile Menu */}

          <button className="mr-6 lg:hidden" onClick={()=> setIsOpen(true)}>
            <Menu color="white" />
          </button>
        </div>
        {isOpen &&(
          <div className="lg:hidden mt-2 rounder-2xl border border-white/10 bg-stale-900/95 backdrop-blur-xl p-6 text-white">
            <div className="flex justify-end mb-4">
              <button onClick={()=>setIsOpen(false)}>
                <X color="white"/>
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {navItems.map((item)=>(
                <li key={item}>
                  <a href="#" onClick={()=>setIsOpen(false)} className="block text-lg hover:text-yellow-400">
                    {item}
                    </a>
                </li>
              ))}
            </ul>
            <button onClick={()=>{setIsOpen(false); 
              setShowRegister(false);
              }}
              className="mt-6 w-full rounder-full bg-yellow-400 px-6 py-3 font-semibold text-black"
              >Register</button>
          </div>

        )}

      </nav>
    </header>

    {showRegister && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={(e)=>{
        if(e.target===e.currentTarget) setShowRegister(false);
      }}>
        <div className="relative w-full max-w-md rounded-2xl border border-white/100 bg-slate-900 shadow-2xl p-8">
        <button onClick={()=>{setShowRegister(false)}} className="absolute top-4 right-4 text-white/70 hover:text-yellow-400">
          <X size={22}/>
        </button>
        <div className="mb-6 text-center">
          {/* <span className="text-3xl">🏏</span> */}
          <h2 className="mt-2 text-2xl font-bold text-white">Register Yourself</h2>
          <p className="text-sm text-yellow-400 uppercase tracking-widest">MPL Upcoming Season</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" required placeholder="Player Name" className="w-full rounded-lg bg-slate-800 border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-yellow-400"/>
          <input type="tel" required placeholder="Player Phone Number" className="w-full rounded-lg bg-slate-800 border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-yellow-400"/>
          <input type="email" required placeholder="Player Email" className="w-full rounded-lg bg-slate-800 border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-yellow-400"/>

        <div className="relative">
          {/* <select required defaultValue="" className="w-full appearance-none rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-white outline-none focus:border-yellow-400">
          <option value="" disabled>
            Player Type
          </option>
          <option value="BATSMAN">Batsman</option>
          <option value="BOWLER">Batsman</option>
          <option value="ALL_ROUNDER">All Rounder</option>
          </select> */}

          <button type="button" onClick={()=>setTypeOpen((o)=>!o)} className="w-full flex items-center justify-between rounded-xl bg-slate-800 border border-white/10 px-4 py-3 text-left text-white outline-none focus:border-yellow-400">
            <span className={playerType?"text-white":"text-white/40"}>{playerType || "Select Player Type"}</span>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/50"/>
          </button>
          {typeOpen &&(<div className="absolute z-10 mt-2 w-full rounded-xl border border-white/10 bg-slate-800/70 backdrop-blur-xl shadow-xl overflow-hidden">
          {PLAYER_TYPES.map((type)=>(
            <button key={type} type="button" onClick={()=>{
              setPlayerType(type);
              setTypeOpen(false);
            }} className={`block w-full px-4 py-3 text-left text-sm transition-colors hover:bg-yellow-400/20 hover:text-yellow-400 ${playerType===type?"text-yellow":"text-white"}`}>{type}</button>
          ))}

          </div>
          )}
          <input type="text" required value={playerType} readOnly tabIndex={-1} className="absolute inset -z-10 opacity-0 pointer-events-none" aria-hidden="true"/>
          
          </div>
          <input type="text" placeholder="Cric Hero Profile" className="w-full rounded-lg bg-slate-800 border-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-yellow-400"/>

          <div className="flex items-center gap-4">
            {imagePreview && (
              <img src={imagePreview} alt="Player Review" className="h-14 w-14 rounder-full object-cover border border-white/10"/> 
            )}
            <label className="flex-1 cursor-pointer rounded-lg bg-slate-800 border border-white/10 flex px-4 py-3 text-white/70 text-sm hover:border-yellow-400">{imagePreview ? "Change Photo":"Upload Photo"}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
            </label>

          </div>
          <button type="submit" className="mt-2 rounded full bg-yellow-400 px-6 py-3 font-semibold text-black transistion-all duration-300 hover:scale-105 hover:bg-yellow-300">Submit</button>
          
        </form>
        </div>
      </div>
    )}
  </>  
  );
  
}