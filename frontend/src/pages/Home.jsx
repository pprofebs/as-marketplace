import HeroSection from "../components/features/Sections/HeroSection";
import ProductSection from "../components/features/Sections/ProductSection";
import TestimonialSection from "../components/features/Sections/TestimonialsSection";
import BenefitSection from "../components/features/Sections/BenefitsSection";


function Home () {
    return (
        <div>
            <HeroSection title={"Buy your used airsoft gun from here"} secondaryTitle={"Give me some sweet money from the ads."}/>
            <ProductSection/> 
            <BenefitSection />
            <TestimonialSection />      
        </div>
    )
}
export default Home;