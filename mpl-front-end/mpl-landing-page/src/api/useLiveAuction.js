import { useEffect, useRef, useState } from "react";
const BASE="https://mpl-player-management-system.onrender.com/mpl/auction";

export function useLiveAuction(onEvent){
    const [state,setState]=useState(null);
    const [connected,setConnected]=useState(false);
    const [loaded,setLoaded] =useState(false);

    const onEventRef=useRef(onEvent);
    onEventRef.current=onEvent;

    useEffect(()=>{
        let cancelled=false;
        
        async function loadSnapshot() {
            try{
                const res=await(`${BASE/state}`);
                if(cancelled)
                    return;

                setState(res.status=== 200? await res.json():null);
            }catch{

            }
            finally{
                if(!cancelled)
                    setLoaded(true);
            }
        }

        loadSnapshot();

        const es=new EventSource(`${BASE}/stream`);
        es.onopen =()=>{
            setConnected(true);
            loadSnapshot();
        };
        es.onerror =()=>setConnected(false);
        es.addEventListener("auction-update",(e)=>{
            const event=JSON.parse(e.data);
            setState(event.type === "PLAYER_SOLD" ? null : event.state);
            onEventRef.current?.(event);
        });

        return ()=>{
            cancelled=true;
            es.close();
        };
    },[]);

    return {state,connected,loaded};
}