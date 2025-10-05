export default function Services() {
  const services = [
    {
      title: 'Sealcoating',
      description: 'Protect and extend the life of your pavement with professional sealcoating.',
      benefits: ['UV Protection', 'Weather Resistance', 'Prevents Cracking', 'Extends Lifespan']
    },
    {
      title: 'Line Striping',
      description: 'Clear, durable markings for safety and organization.',
      benefits: ['ADA Compliant', 'High Visibility', 'Long-lasting Paint', 'Custom Layouts']
    },
    {
      title: 'Crack Filling',
      description: 'Prevent small cracks from becoming costly repairs.',
      benefits: ['Water Prevention', 'Cost Effective', 'Quick Application', 'Prevents Expansion']
    },
    {
      title: 'Maintenance',
      description: 'Complete parking lot upkeep and repair services.',
      benefits: ['Regular Inspections', 'Preventive Care', 'Emergency Repairs', 'Long-term Planning']
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
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition border-t-4 border-brand-gold">
              <h3 className="font-bold text-2xl mb-3 text-brand-navy">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-brand-gold mr-2">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block text-center w-full py-2 bg-brand-gold text-brand-dark font-semibold rounded hover:bg-yellow-500 transition"
              >
                Get Free Quote
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
