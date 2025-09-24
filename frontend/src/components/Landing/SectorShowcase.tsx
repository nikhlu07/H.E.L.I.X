import React from 'react';
import { Building2, Heart, Code } from 'lucide-react';

export function SectorShowcase() {
  const sectors = [
    {
      icon: Building2,
      title: "Government (Core)",
      subtitle: "Our Primary Focus",
      description: "CorruptGuard is purpose-built for government procurement fraud detection with full backend integration and ICP canisters.",
      features: ["Real-time procurement monitoring", "AI fraud detection", "Blockchain transparency", "Citizen oversight"],
      status: "Live",
      statusText: "System Ready",
      buttonText: "Try Live Demo",
      isPrimary: true,
    },
    {
      icon: Heart,
      title: "NGOs (Adaptable)",
      subtitle: "Open Source Extension",
      description: "Our open-source approach allows NGOs to adapt CorruptGuard's fraud detection for donor fund transparency and project monitoring.",
      features: ["Adaptable data models", "Configurable alerts", "Custom reporting", "Donor transparency"],
      status: "OSS",
      statusText: "Open Source",
      buttonText: "View Adaptation Guide",
      isPrimary: false,
    },
    {
      icon: Code,
      title: "Private (Future)",
      subtitle: "Hackathon Potential",
      description: "Companies can leverage our open-source fraud detection algorithms for supply chain auditing and vendor verification systems.",
      features: ["Reusable algorithms", "API integration", "Custom workflows", "Compliance tracking"],
      status: "API",
      statusText: "Ready",
      buttonText: "Explore API Docs",
      isPrimary: false,
    }
  ];

  return (
    <div className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Built for Every Sector
          </h2>
          <p className="text-xl text-helix-gray-300 max-w-3xl mx-auto">
            H.E.L.I.X. provides tailored solutions for governments, NGOs, and private companies to ensure transparency and fight corruption.
          </p>
        </div>

        {/* Sector Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            const isPrimary = sector.isPrimary;

            return (
              <div 
                key={index}
                className={`flex flex-col bg-helix-gray-900 rounded-3xl p-8 shadow-md border transition-all duration-300 ${isPrimary ? 'border-primary shadow-primary/20' : 'border-helix-gray-800 hover:border-helix-gray-700'}`}
              >
                <div className="flex-grow">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isPrimary ? 'bg-primary' : 'bg-helix-gray-800'}`}>
                    <Icon className={`w-8 h-8 ${isPrimary ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{sector.title}</h3>
                    <p className={`text-sm font-medium mb-4 ${isPrimary ? 'text-primary' : 'text-helix-gray-400'}`}>{sector.subtitle}</p>
                    <p className="text-helix-gray-400 leading-relaxed mb-6">{sector.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {sector.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${isPrimary ? 'bg-primary' : 'bg-helix-gray-700'}`}></div>
                        <span className="text-helix-gray-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer with Status and Button */}
                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-6 text-sm">
                        <span className={`font-bold px-3 py-1 rounded-full ${isPrimary ? 'bg-primary/10 text-primary' : 'bg-helix-gray-800 text-helix-gray-300'}`}>{sector.status}</span>
                        <span className="text-helix-gray-400">{sector.statusText}</span>
                    </div>
                    <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${isPrimary ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-helix-gray-800 text-foreground hover:bg-helix-gray-700'}`}>
                        {sector.buttonText}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
