const BASE_URL="http://localhost:8080";
const TOKEN_KEY="mpl_admin_key";


export const tokenStore={
    get:()=>sessionStorage.getItem(TOKEN_KEY),
    set:(t)=>sessionStorage.setItem(TOKEN_KEY,t),
    clear:()=>sessionStorage.removeItem(TOKEN_KEY)
};

let onUnauthoried =()=>{};
export const setUnauthorizedHandler =(fn)=>(onUnauthoried = fn);

export async function api(path, {method="GET",body}={}){
    const token=tokenStore.get();
    let res;
    try{
        res=await fetch(`${BASE_URL}${path}`,
            {method,
                headers:{
                    ...(body?{"Content-Type":"application/json"}:{}),
                    ...(token?{Authorization:`Bearer ${token}`}:{})    
                },
                body: body ? JSON.stringify(body) : undefined,
            }
        );
    }catch{
        throw new Error("Connection Problem. Please try again later.")
    }

    if(res.status === 401){
        onUnauthoried();
        throw new Error("Session Expired. Please log in again");
    }

    const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON body */
  }

  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data;
}