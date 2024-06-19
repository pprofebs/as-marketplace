import React from 'react';
import ReasonCard from '../Cards/ReasonCard';

const BenefitSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Miért válassz minket?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ReasonCard
            name="Ellenőrzött hirdetések"
            description="A mi felületünkre csak ellenőrzött hirdetések kerülnek fel."
          />
          <ReasonCard
            name="Kiváló termékek"
            description="A felkerült termékek jó vagy kiváló állapotúak."
          />
          <ReasonCard
            name="A közösség tagjaitól"
            description="Airsoftosoktól airsoftosoknak."
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
