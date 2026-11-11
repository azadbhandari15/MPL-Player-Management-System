const HIGHLIGHTS=[
    {value:"2024",label:"Sigma Playboys Emerged as an Inaugral Champions"},
    {value:"Jan 2025",label:"Maqsad XI won Season 2"},
    {value:"Nov 2025", label:"Sam Ashrafi Defended his MPL title with Victory Fighters"},
    {value:"Nov 2026",label:"Mini MPL will take place"}
]

export default function Highlights(){
return (
    <section className="px-6 py-8">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
        {HIGHLIGHTS.map((h)=>(
            <div key={h.label} className="bg-slate-900 px-6 py-8">
                <dd className="text-4xl font-bold text-yellow-400">{h.value}</dd>
                <dt className="mt-2 text-sm text-white/60">{h.label}</dt>
            </div>
        ))}
        </dl>
    </section>
)
}

