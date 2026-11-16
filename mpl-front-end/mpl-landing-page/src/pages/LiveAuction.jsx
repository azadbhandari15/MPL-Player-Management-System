import { useEffect,useState } from "react";
import { useLiveAuction } from "../api/useLiveAuction";
import { imageSrc } from "../api/playerApi";
import { formatPurse } from "../api/teamApi";


function PlayerPhoto({imageUrl,name}){
    const [failed,setFailed]=useState(false);

    useEffect(()=>setFailed(false),[imageUrl]);

    if(!imageUrl || failed){
        return (
            <div className="flex h-56 w-56 items-center justify-center rounded-full border-4 border-yellow-400 bg-slate-800 text-7xl">
                🏏
            </div>
        );
    }

    return (
        <img src={imageSrc(imageUrl)} alt={name} onError={()=>setFailed(true)} className="h-56 w-56 rounded-full border-4 border-yellow-400 object-cover shadow-xl shadow-yellow-400/10"/>
    );
}

export default function LiveAuction(){
    const {state, connected, loaded} = useLiveAuction();
    const [bump,setBump]=useState(null);

    useEffect(()=>{
        if(state?.currentBid == null)
            return;
        setBump(true);

        const t= setTimeout(()=>setBump(false),300);
        return ()=> clearTimeout(t);
    },[state?.currentBid]);


    return (
    <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-36 text-white">
        <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">
                    Live <span className="text-yellow-400">Auction</span>
                </h1>
                <span className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${connected ? "bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}`}>
                <span className={`h-2 w-2 rounded-full ${connected ? "animate-pulse bg-green-400":"bg-red-400"}`}/>
                {connected ? "Live":"Reconnecting"}
                </span>
            </div>
            {!loaded && (<p className="mt-20 text-center text-white/60">Loading auction ...</p>)}

            {loaded && !state && (
                <div className="mt-16 rounded-2xl border border-white/10 bg-slate-900 p-12 text-center">
                    <div className="text-6xl">⏳</div>
                    <h2 className="mt-4 text-2xl font-bold">Waiting for the next player</h2>
                    <p className="mt-2 text-white/60">The next will appear here as soon as bidding starts.</p>
                </div>
            )}

            {state && (
                <section className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
                    <div className="flex flex-col items-center gap-8 md:flex-row">
                        <PlayerPhoto imageUrl={state.imageUrl} name={state.playerName}/>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-xs uppercase tracking-widest text-white/50">
                            Now Bidding
                            </p>
                            <h2 className="mt-1 text-4xl font-bold">{state.playerName}</h2>
                            <span className="mt-3 inline-block rounded-full bg-yellow-400/20 px-4 py-1 text-sm font-semibold text-yellow-400">
                            {state.playerType?.replace("_","")}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-800 p-5 text-center">
                            <p className="text-xs uppercase tracking-widest text-white/50">
                            Current Bid
                            </p>
                            <p className={`mt-2 text-4xl font-bold text-yellow-400 transition-transform duration-300 ${bump? "scale-110":"scale-100"}`}>
                                {state.currentBid != null ? formatPurse(state.currentBid) : "—"}
                            </p>
                        </div>

                        <div className="rounded-xl bg-slate-800 p-5 text-center">
                            <p className="text-xs uppercase tracking-widest text-white/50">
                              Highest Bidder
                            </p>
                            <p className="mt-2 text-2xl font-bold">
                                {state.highestBidderTeam || "No bids yet"}
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>

    </main>
  );
}