const BASE_URL="https://mpl-player-management-system.onrender.com/mpl/owner";

async function request(url){
    let res;
    try{
        res =await fetch(url);
    }catch{
        throw new Error("Connection problem. Please try again later.")
    }

    if(!res.ok){
        let message;
        try{
            const data =await res.json();
            message=data?.message;
        }catch{
            
        }
        throw new Error(message || `Request failed (${res.status})`);
    }

   return res.json();
}

 export const fetchTeams = ()=> request(`${BASE_URL}/retrieve-team-name`);

 export const fetchOwnerDetails=(ownerId)=>request(`${BASE_URL}/owner-details/${encodeURIComponent(ownerId)}`);

 export const formatPurse=(amount)=>`${new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(amount??0)} pts`;