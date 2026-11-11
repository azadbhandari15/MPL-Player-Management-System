import { useEffect } from "react";

export default function Toast({message,onRetry, onClose, duration=6000}){
    useEffect(()=>{
     const t=setTimeout(onClose,duration);
     return ()=> clearTimeout(t);
    },[message,duration]);


return (
    <div className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-4 rounder-xl border border-white/10 bg-slate-800 px-5 py-3 text-sm text-white shadow-2xl">
        <span>{message}</span>
        {onRetry && (<button onClick={onRetry} className="font-semibold text-yellow-400 hover:text-yellow-300">Retry</button>)}
        <button onClick={onClose} aria-label="Dismiss" className="text-white/50 hover:text-white">X</button>
    </div>
);
}