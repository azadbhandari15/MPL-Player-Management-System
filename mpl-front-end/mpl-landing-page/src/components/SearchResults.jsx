import {X} from 'lucide-react';

export default function SearchResults({status,results, onSelect, onClose}){
    if(status=== "idle") return null;

    return(
        <div className="fixed left-1/2 top-28 z-40 w-[calc(100%-3rem)] max-x-l -translate-x-1/2 rounder-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-yellow-400">Search Results</p>
                <button onClick={onClose} aria-label="Close Results"><X size={18} color="white"/>Close</button>
            </div>
            {status==="loading"} && <p className="py-6 text-center text-white/60">Searching .....</p>

            {status==="empty" && (<p className="py-6 text-center text-white/60">No Player Found</p>)}
            {status==="success" && 
            <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                {results.map((p)=>{
                    <button onClick={()=>{onSelect(p)}} className="flex w-full items-center gap-4 rounded-xl bg-slate-800 p-3 text-left transistion hover:bg-slate-700">
                        <img src={p.imageurl || "https://via.placeholder.com/56?text=🏏"} alt="p.playerName" className="h-14 w-14 rounder-full border border-white/10 object-cover"></img>
                        <div className="font-semibold text-white">{p.playerName}</div>
                        <div className="text-sm text-yellow-400">{p.playerId}</div>
                    </button>
                })}
            </ul>
            }
        </div>
    );
}