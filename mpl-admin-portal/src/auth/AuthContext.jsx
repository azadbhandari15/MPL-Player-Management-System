import { createContext, useCallback,useContext, useEffect, useState } from "react";
import {api, tokenStore, setUnauthorizedHandler } from "../api/client";

const AuthContext= createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({children}){
    const [token, setToken] = useState(()=> tokenStore.get());

    const logout = useCallback(()=>{
        tokenStore.clear(),
        setToken(null)
    },[]);

    useEffect(()=>setUnauthorizedHandler(logout),[logout]);

    async function login(username,password){
        const data=await api("/mpl/admin/login",{
            method:"POST",
            body:{username,password}
        });
        tokenStore.set(data.token);
        setToken(data.token);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated: !!token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}