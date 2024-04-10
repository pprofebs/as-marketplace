import React from 'react';
import ReasonCard from '../Cards/ReasonCard';

const BenefitSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ReasonCard
            name="Secure Transactions"
            description="Our platform ensures secure transactions."
          />
          <ReasonCard
            name="Quality Products"
            description="Explore a range of high-quality airsoft products."
          />
          <ReasonCard
            name="Exceptional Service"
            description="Experience exceptional customer service."
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
