const BASE_URL="http://localhost:8080/mpl/players";

const API_ORIGIN = "http://localhost:8080";

export const imageSrc = (imageUrl) =>
  imageUrl ? `${API_ORIGIN}${imageUrl}` : null;

export class NetworkError extends Error {}

export async function searchPlayers(keyword){
    let res;
    try{
        res=await fetch(`${BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
    }catch{
        throw new NetworkError("Unable to connect the server.");
    }

    if(!res.ok){
        let message=`Search Failed (${res.status})`;

        try{
            const body=await res.json();
            message=body?.message||message;
        }catch{}
        throw new Error(message);
    }
    return res.json();
}