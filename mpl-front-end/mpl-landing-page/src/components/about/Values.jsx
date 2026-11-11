const MPLVALUES=[
    {
        title:"Open to Every Player",
        text:"Batsman, Bowler or All Rounder, anyone can register and be seen."
    },
    {
        title:"Fair Play",
        text:"Clear Rules, honest umpiring and respect for opponents on and off the field"
    },
    {
        title:"Community First",
        text:"The League belongs to the town: players, families and supporters"
    }
];

export default function Values(){
    return (
        <section className="px-6 py-16 pb-28">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-3xl font-bold">What we Stand For</h2>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    {MPLVALUES.map((v)=>(
                        <div key={v.title} className="border-l-2 border-yellow-400 pl-5">
                            <h3 className="text-lg font-semibold">{v.title}</h3>
                            <p className="mt-2 text-sm text-white/65 leading-relaxed">{v.text}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

