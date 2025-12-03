

// import Hero from "./components/home/hero";
import Herosecond from "./components/home/herosecond";
import Services from "./components/home/services";
import About from "./components/home/about";
import Testomonials from "./components/home/testomonials";
import Ctasection from "./components/home/ctasection";
import Contactus from "./components/home/contactus";
import Banner from "./components/home/Banner";
import HomePopup from "./components/home/HomePopup";

export default function Home() {
  return (
    
      <>
      <HomePopup />
        {/* <Hero/> */}
        <Banner/>
        <Herosecond/>
        <Services/>
        <About/>
        <Testomonials/>
        <Ctasection/>
        <Contactus/>
      </>
    
  );
}
