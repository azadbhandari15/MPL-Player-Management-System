const COMMITTEE = [
  { name: "Sam Ashrafi", role: "Commitee Head", phone: "+91 00000 00000" },
  { name: "Avinash Singh", role: "Treasurer", phone: "+91 00000 00000" },
  { name: "Shreshtha Das", role: "Disciplinary Head", phone: "+91 00000 00000" },
  { name: "Zaid Khan", role: "Stock Manager ", phone: "+91 00000 00000" },
];
 
export default function ContactInfo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMMITTEE.map((m,i)=>(
            <div key={i} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-semibold text-white">{m.name}</h3>
                <p className="mt-1 text-sm text-yellow-400">{m.role}</p>
                <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="mt-4 block text-white/80 hover:text-yellow-400">{m.phone}</a>
            </div>
        ))}
    </div>   
  );
}