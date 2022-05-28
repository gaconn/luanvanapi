//components
import Footer from "../layouts/Footer/Footer"
import Header from "../layouts/Header"
import Navbar from "../layouts/NavBar"
import Section from "../layouts/Section"
import Auth from "../components/Authenticate"

const Home  = () => {
    return <>
    <Header/>  
    <Navbar/>    
    <Section/>
    <Auth/>
    <Footer/>
    </>
}

export default Home