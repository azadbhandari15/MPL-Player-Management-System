const BASE_URL = "https://mpl-player-management-system.onrender.com";
const TOKEN_KEY = "mpl_admin_key";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => (onUnauthorized = fn);

export async function api(path, { method = "GET", body } = {}) {
  const token = tokenStore.get();
  const isForm = body instanceof FormData;   // multipart upload: let the browser set Content-Type
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body && !isForm ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error("Connection Problem. Please try again later.");
  }

  if (res.status === 401) {
    console.warn("401 UNAUTHORIZED from:", path, "with token:", token);
    onUnauthorized();
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