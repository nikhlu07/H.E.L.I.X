import React from 'react';
import { Building2, Heart, Factory } from 'lucide-react';

export function SectorShowcase() {
  const sectors = [
    {
      icon: Building2,
      title: "Government (Core)",
      subtitle: "Our Primary Focus",
      description: "CorruptGuard is purpose-built for government procurement fraud detection with full backend integration and ICP canisters.",
      features: ["Real-time procurement monitoring", "AI fraud detection", "Blockchain transparency", "Citizen oversight"],
      color: "blue",
      stats: { value: "Live", label: "System Ready" }
    },
    {
      icon: Heart,
      title: "NGOs (Adaptable)",
      subtitle: "Open Source Extension",
      description: "Our open-source approach allows NGOs to adapt CorruptGuard's fraud detection for donor fund transparency and project monitoring.",
      features: ["Adaptable data models", "Configurable alerts", "Custom reporting", "Donor transparency"],
      color: "green",
      stats: { value: "OSS", label: "Open Source" }
    },
    {
      icon: Factory,
      title: "Private (Future)",
      subtitle: "Hackathon Potential",
      description: "Companies can leverage our open-source fraud detection algorithms for supply chain auditing and vendor verification systems.",
      features: ["Reusable algorithms", "API integration", "Custom workflows", "Compliance tracking"],
      color: "purple",
      stats: { value: "API", label: "Ready" }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "from-blue-50 to-indigo-50",
        icon: "from-blue-100 to-indigo-100",
        iconColor: "bg-blue-600",
        text: "text-blue-600",
        button: "from-blue-600 to-indigo-600"
      },
      green: {
        bg: "from-green-50 to-emerald-50",
        icon: "from-green-100 to-emerald-100",
        iconColor: "bg-green-600",
        text: "text-green-600",
        button: "from-green-600 to-emerald-600"
      },
      purple: {
        bg: "from-purple-50 to-pink-50",
        icon: "from-purple-100 to-pink-100",
        iconColor: "bg-purple-600",
        text: "text-purple-600",
        button: "from-purple-600 to-pink-600"
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-4 h-4 bg-gray-600 rounded-full relative">
              <div className="absolute inset-1 bg-white rounded-full"></div>
            </div>
            <span>Multi-Sector Platform</span>
          </div>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Built for Government,
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Adaptable for All
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            CorruptGuard is purpose-built for government procurement security, but our open-source approach 
            means NGOs and companies can adapt our proven fraud detection technology for their needs.
          </p>
        </div>

        {/* Sector Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {sectors.map((sector, index) => {
            const colors = getColorClasses(sector.color);
            const Icon = sector.icon;
            
            return (
              <div 
                key={index}
                className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors.icon} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    <div className={`w-8 h-8 ${colors.iconColor} rounded-lg relative z-10 flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{sector.title}</h3>
                    <p className={`text-sm font-medium ${colors.text} mb-4`}>{sector.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed mb-6">{sector.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <ul className="space-y-3">
                      {sector.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 ${colors.iconColor} rounded-full`}></div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className={`text-3xl font-bold ${colors.text}`}>{sector.stats.value}</div>
                      <div className="text-gray-600 text-sm font-medium">{sector.stats.label}</div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a 
                    href="https://github.com/nikhlu07/Corruptguard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full bg-gradient-to-r ${colors.button} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    <span>
                      {sector.title.includes('Core') ? 'Try Live Demo' : 
                       sector.title.includes('Adaptable') ? 'View Adaptation Guide' : 
                       'Explore API Docs'}
                    </span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Open Source CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Open Source & Hackathon Ready</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              CorruptGuard is built with government procurement in mind, but we're making it open source 
              so other sectors can adapt our fraud detection technology. Perfect for hackathons and innovation challenges.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-6">
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>MIT Licensed</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>API First</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Adaptable Core</span>
              </span>
            </div>
            <a 
              href="https://github.com/nikhlu07/Corruptguard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>View on GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}