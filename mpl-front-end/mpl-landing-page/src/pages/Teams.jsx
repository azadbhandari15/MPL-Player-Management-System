import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import { fetchTeams,formatPurse } from "../api/teamApi";

export default function Teams(){
    const [teams, setTeams]=useState([]);
    const [status, setStatus]=useState("loading");
    const [error, setError]=useState("");
    const [attempt, setAttempt]=useState(0);

    useEffect(()=>{
        let cancelled=false;
        setStatus("loading");
        fetchTeams().then((data)=>{
            if(cancelled) return;
            
            setTeams(data);
            setStatus(data.length?"success":"empty");
        }).catch((err)=>{
            if(cancelled)
                return;
            setError(err.message);
            setStatus("error");
        });

        return ()=>{
            cancelled=true;
        };
    },[attempt]);


    return (
        <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-36 text-white">
            <div className="max-auto max-w-7xl">
                <h1 className="text-center text-4xl font-bold">
                    MPL Season 4 <span className="text-yellow-400">Teams</span>
                </h1>
                <p className="mt-2 text-center text-white/60">Select a team to view owner details</p>

                {status==="loading"  && (<p className="mt-16 text-center text-white/60">Loading Teams....</p>)}
                {status==="error" && (
                    <div className="mt-16 text-center">
                        <p className="text-red-400">{error}</p>
                        <button onClick={()=>setAttempt((a)=>a+1)} className="mt-4 rounded-full bg-yellow-400 px-6 py-2 font-semibold text-black hover:bg-yellow-300">Retry</button>
                    </div>
                )}
                {status==="empty" && (
                    <p className="mt-16 text-center text-white/60">No Teams Found.</p>
                )}

                {status==="success" && (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {teams.map((team)=>(
                            <Link key={team.ownerRegistrationId} to={`/teams/${team.ownerRegistrationId}`} className="group rounder-2xl border border-white/10 bg-slate-900 p-6 shadow-xl transistion-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-yellow-400/10">
                                <div className="text-4xl">🏏</div>
                                <h2 className="mt-4 text-2xl font-bold transistion-colors group-hover:text-yellow-400">{team.teamName}</h2>
                                <p className="mt-4 text-xs uppercase tracking-widest text-white/50">Available Purse</p>
                                <p className="text-xl font-semibold text-yellow-400">{formatPurse(team.availablePurse)}</p>
                                <p className="mt-4 text-sm text-white/60 transition-colors group-hover:text-yellow-400">View Details→</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}