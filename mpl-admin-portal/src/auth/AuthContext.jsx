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

  // Any 401 from the API logs the admin out locally
  useEffect(() => setUnauthorizedHandler(clearSession), [clearSession]);

  async function login(username, password) {
    const data = await api(EP.login, {
      method: "POST",
      body: { username, password },
      publicCall: true,
    });
    tokenStore.set(data.token);
    setToken(data.token);
  }

  async function logout() {
    try {
      await api(EP.logout, { method: "POST" });
    } catch {
      /* log out locally even if the server call fails */
    }
    clearSession();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}