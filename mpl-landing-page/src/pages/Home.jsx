import Navbar  from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import About from "../components/About"

function Home(){
    return (
        <>
        <Navbar />
        <Hero />
        <Stats />
        <About />
        </>
    )
}

export default Home;