const API_ORIGIN="http://localhost:8080";

export const imageSrc=(url)=>(url?`${API_ORIGIN}${url}`:null);

export const formatPts=(n)=>`${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(n ?? 0))} pts`;