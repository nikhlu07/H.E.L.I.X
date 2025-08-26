import React from 'react';
import { Shield, CheckCircle, Database, Cpu, Network } from 'lucide-react';

interface SystemStatusProps {
  className?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  // Static system status data
  const services = [
    {
      name: 'Backend API',
      status: 'Operational',
      icon: Shield,
      description: 'FastAPI server running smoothly'
    },
    {
      name: 'ML Engine',
      status: 'Operational',
      icon: Cpu,
      description: 'Fraud detection model active'
    },
    {
      name: 'ICP Canisters',
      status: 'Operational',
      icon: Network,
      description: 'Blockchain integration ready'
    },
    {
      name: 'Database',
      status: 'Operational',
      icon: Database,
      description: 'Data persistence active'
    },
    {
      name: 'Authentication',
      status: 'Operational',
      icon: CheckCircle,
      description: 'Internet Identity connected'
    },
    {
      name: 'Fraud Detection',
      status: 'Operational',
      icon: Shield,
      description: 'Real-time monitoring active'
    }
  ];

  return (
    <section className={`py-12 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 text-slate-900">System Status</h2>
        <p className="text-center text-slate-600 mb-8">All systems operational and monitoring government procurement</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isUp = service.status === 'Operational';
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <Icon className="h-8 w-8 mr-3 text-blue-600" />
                  <h3 className="font-semibold text-lg text-slate-900">{service.name}</h3>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isUp ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-slate-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { SystemStatus };
export default SystemStatus;
