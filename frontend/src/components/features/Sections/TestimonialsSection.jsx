import TestimonialCard from "../Cards/testimonialCard";


const TestimonialSection = () => {
    return (
        <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial Cards */}
           <TestimonialCard name={"John Doe"} recommendation={"F yeah!"} />
           <TestimonialCard name={"John Doe"} recommendation={"F yeah!"} />
          </div>
        </div>
      </section>
    )
}
export default TestimonialSection;