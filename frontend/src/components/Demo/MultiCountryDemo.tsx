import React from 'react';

interface MultiCountryDemoProps {
  onBack: () => void;
}

export function MultiCountryDemo({ onBack }: MultiCountryDemoProps) {
  const countries = [
    { name: 'India', flag: '🇮🇳', currency: '₹', compliance: '98%' },
    { name: 'United States', flag: '🇺🇸', currency: '$', compliance: '95%' },
    { name: 'United Kingdom', flag: '🇬🇧', currency: '£', compliance: '96%' },
    { name: 'Germany', flag: '🇩🇪', currency: '€', compliance: '97%' },
    { name: 'Japan', flag: '🇯🇵', currency: '¥', compliance: '94%' },
    { name: 'Australia', flag: '🇦🇺', currency: 'A$', compliance: '93%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Multi-Country Demo</h1>
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-6">
            Demonstrating H.E.L.I.X.'s global scalability and cross-border compliance capabilities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{country.flag}</span>
                  <h3 className="font-semibold text-gray-900">{country.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Currency:</span>
                    <span className="text-sm font-medium">{country.currency}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Compliance:</span>
                    <span className="text-sm font-medium text-green-600">{country.compliance}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium text-blue-600">Active</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  View Dashboard
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Global Features</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Cross-border transaction monitoring</li>
              <li>• Multi-currency compliance tracking</li>
              <li>• International regulatory alignment</li>
              <li>• Global fraud pattern detection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}