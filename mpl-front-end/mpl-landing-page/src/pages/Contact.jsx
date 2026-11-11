import ContactInfo from "../components/contact/ContactInfo";

export default function Contact() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 pt-40 pb-28 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold sm:text-5xl">Contact us</h1>
        <p className="mt-4 max-w-xl text-white/70">
          Questions about registration, teams or the upcoming season? Reach us
          using the details below.
        </p>
        <div className="mt-12">
          <ContactInfo />
        </div>
      </div>
    </main>
  );
}