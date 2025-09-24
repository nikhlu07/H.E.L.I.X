import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Shield, BarChart3, Globe } from 'lucide-react';

export function DemoTest() {
  const navigate = useNavigate();

  const demoFeatures = [
    {
      icon: Shield,
      title: "Authentication",
      description: "Test user authentication flows",
      color: "blue",
      action: () => navigate('/login')
    },
    {
      icon: Users,
      title: "Role Management",
      description: "Test different user roles",
      color: "green",
      action: () => navigate('/role-selection')
    },
    {
      icon: BarChart3,
      title: "Dashboard Features",
      description: "Explore dashboard functionality",
      color: "purple",
      action: () => navigate('/dashboard/government')
    },
    {
      icon: Globe,
      title: "Multi-country",
      description: "Test international scalability",
      color: "orange",
      action: () => navigate('/multi-country-demo')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">H.E.L.I.X. Demo Testing Suite</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onClick={feature.action}
                  className={`bg-${feature.color}-50 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-${feature.color}-100 hover:border-${feature.color}-300`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className={`w-6 h-6 text-${feature.color}-600`} />
                    <h3 className={`font-semibold text-${feature.color}-900`}>{feature.title}</h3>
                  </div>
                  <p className={`text-${feature.color}-700 text-sm mb-4`}>{feature.description}</p>
                  <button className={`bg-${feature.color}-600 text-white px-4 py-2 rounded-md hover:bg-${feature.color}-700 transition-colors text-sm`}>
                    Try Now
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">Demo Features Available</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• Internet Identity authentication integration</li>
              <li>• Role-based access control (7 different roles)</li>
              <li>• Real-time fraud detection dashboard</li>
              <li>• Multi-country compliance testing</li>
              <li>• Blockchain transparency features</li>
              <li>• Citizen oversight and reporting tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}