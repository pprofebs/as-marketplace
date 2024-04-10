import HeroSection from "../components/features/Sections/HeroSection";
import ProductSection from "../components/features/Sections/ProductSection";
import TestimonialSection from "../components/features/Sections/TestimonialsSection";
import BenefitSection from "../components/features/Sections/BenefitsSection";


function Home () {
    return (
        <div>
            <HeroSection title={"Az airsoft piactér"} secondaryTitle={"Találd meg a tökéletes airsoft felszerelést következő játékodhoz"}/>
            <ProductSection/>
            <BenefitSection />
            <TestimonialSection />
        </div>
    )
}
export default Home;