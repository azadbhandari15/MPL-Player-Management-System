import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, tokenStore, setUnauthorizedHandler } from "../api/client";
import { EP } from "../api/endpoints";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());

  const clearSession = useCallback(() => {
    tokenStore.clear();
    setToken(null);
  }, []);

  // Automatically log out locally whenever the backend returns 401
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
  }, [clearSession]);

  async function login(username, password) {
    const data = await api(EP.login, {
      method: "POST",
      body: { username, password },
    });

    const receivedToken = typeof data === "string" ? data : data?.token;
    if (!receivedToken) {
      throw new Error("Token missing in login response");
    }

    tokenStore.set(receivedToken);
    setToken(receivedToken);
  }

  async function logout() {
    try {
      await api(EP.logout, { method: "POST" });
    } catch {
      /* Clear local session even if server logout fails */
    } finally {
      clearSession();
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}