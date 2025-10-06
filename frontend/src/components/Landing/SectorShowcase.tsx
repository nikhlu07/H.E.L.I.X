import React from 'react';
import { Building2, Heart, Code } from 'lucide-react';

export function SectorShowcase() {
  const sectors = [
    {
      icon: Building2,
      title: "Government (Core)",
      description: "Purpose-built for government procurement fraud detection with full backend integration and ICP canisters.",
      isPrimary: true,
    },
    {
      icon: Heart,
      title: "NGOs (Adaptable)",
      description: "Our open-source approach allows NGOs to adapt CorruptGuard for donor fund transparency and project monitoring.",
      isPrimary: false,
    },
    {
      icon: Code,
      title: "Private (Future)",
      description: "Companies can leverage our open-source fraud detection algorithms for supply chain auditing and vendor verification.",
      isPrimary: false,
    }
  ];

  return (
    <section id="howitworks" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 mb-4">A Unified Platform for Every Role.</h2>
          <p className="text-lg text-gray-600">Our role-specific workflows ensure seamless adoption and maximum security at every stage of the supply chain.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <div 
                key={index}
                className={`feature-card text-center p-8 rounded-xl ${sector.isPrimary ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className={`flex items-center justify-center h-16 w-16 rounded-full mx-auto mb-4 border-2 ${sector.isPrimary ? 'bg-white text-yellow-600 border-yellow-200' : 'bg-white text-gray-600 border-gray-200'}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{sector.title}</h3>
                <p className="text-gray-600 text-sm">{sector.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
