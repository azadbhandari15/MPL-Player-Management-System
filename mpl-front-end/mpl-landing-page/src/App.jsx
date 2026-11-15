import {Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";


export default function App(){
  return (
    <>
    <ScrollToTop/>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element ={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/teams" element={<Teams />} />
      <Route path="/teams/:ownerId" element={<TeamDetails />} />
    </Routes>
    </>
  )
}