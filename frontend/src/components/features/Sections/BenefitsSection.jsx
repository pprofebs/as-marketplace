import ReasonCard from "../Cards/reasonCard";


const BenefitSection = () => {
    return (
        <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReasonCard name={"Secure transaction"}  description={"It secure"}/>
            <ReasonCard name={"Secure transaction"}  description={"It secure"}/>
            <ReasonCard name={"Secure transaction"}  description={"It secure"}/>
          </div>
        </div>
      </section>
    )
}
export default BenefitSection;