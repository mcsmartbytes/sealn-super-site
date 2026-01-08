'use client';

export default function Services() {
  const services = [
    {
      title: 'Sealcoating',
      description: 'Protect and extend the life of your pavement with professional sealcoating.',
      benefits: ['UV Protection', 'Weather Resistance', 'Prevents Cracking', 'Extends Lifespan'],
      icon: '🛡️'
    },
    {
      title: 'Line Striping',
      description: 'Clear, durable markings for safety and organization.',
      benefits: ['ADA Compliant', 'High Visibility', 'Long-lasting Paint', 'Custom Layouts'],
      icon: '📐'
    },
    {
      title: 'Crack Filling',
      description: 'Prevent small cracks from becoming costly repairs.',
      benefits: ['Water Prevention', 'Cost Effective', 'Quick Application', 'Prevents Expansion'],
      icon: '🔧'
    },
    {
      title: 'Maintenance',
      description: 'Complete parking lot upkeep and repair services.',
      benefits: ['Regular Inspections', 'Preventive Care', 'Emergency Repairs', 'Long-term Planning'],
      icon: '🔄'
    }
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-brand-navy">Our Services</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional parking lot services designed to protect your investment and enhance safety
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="group h-80 [perspective:1000px]">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front of card */}
                <div className="absolute inset-0 bg-white p-6 rounded-lg shadow-lg border-t-4 border-brand-gold [backface-visibility:hidden]">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="font-bold text-2xl mb-3 text-brand-navy">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                  <p className="text-sm text-brand-gold mt-4 font-medium">Hover for details →</p>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 bg-brand-navy p-6 rounded-lg shadow-lg [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl mb-4 text-brand-gold">{service.title} Benefits</h3>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-brand-gold mr-2">✓</span>
                          <span className="text-white">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="#contact"
                    className="block text-center w-full py-2 bg-brand-gold text-brand-dark font-semibold rounded hover:bg-yellow-500 transition mt-4"
                  >
                    Get Free Quote
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
