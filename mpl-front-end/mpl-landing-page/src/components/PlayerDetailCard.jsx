import {X} from "lucide-react";

const TYPE_LABELS={BATSMAN:"Batsman", BOWLER:"Bowler",ALL_ROUNDER:"All Rounder"};

function Row({label, children}){
    return (
        <div className="flex justify-between gap-4 border-b border-white/5 py-2 text-sm">
            <span className="text-white/50">{label}</span>
            <span className="break-all text-right text-white">{children}</span>
        </div>
    )
}

export default function PlayerDetailCard({player, onClose}){
    if(!player) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm" onClick={(e)=>{e.target === e.currentTarget && onClose()}}>
            <div className="relative w-full max-x-sm rounder-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-yellow-400">
                <X size={22}/>
            </button>
            <div className="mb-6 flex flex-col items-center">
                <img src={player.imageUrl||"https://via.placeholder.com/96?text=🏏"} alt={player.playerName} className="h-24 w-24 rounder-full border-2 border-yellow-400 object-cover"/>
                <h3 className="mt-3 text-xl font-bold text-white">{player.playerName}</h3>
                <p className="text-yellow-400">{player.playerId}</p>
            </div>
            <Row label="Type">{TYPE_LABELS[player.playerType] || player.playerType}</Row>
            <Row label="Status">{player.registrationStatus}</Row>
            <Row label="Phone">{player.contactNumber}</Row>
            <Row label="Email">{player.playerEmail}</Row>
            {player.cricHerosProfile && <Row label="CricHeros">{player.cricHerosProfile}</Row>}
            </div>
        </div>
    );
}