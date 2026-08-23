export default function FeatureCard({
    icon: Icon,
    title,
    description,}) {

        return (
            <div className="group rounded-2xl border border-white/10 bg-slate-900 
            p-5 transition-all duration-300 hover:border-yellow-400/50 hover:-translate-y-1 hover:shadow:xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition">
                    <Icon size={24}/>
                </div>

                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-400">{description}</p>
            </div>
        );
}