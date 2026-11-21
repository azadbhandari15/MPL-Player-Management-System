const API_ORIGIN="https://mpl-player-management-system.onrender.com";

export const imageSrc=(url)=>(url?`${API_ORIGIN}${url}`:null);

export const formatPts=(n)=>`${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(n ?? 0))} pts`;