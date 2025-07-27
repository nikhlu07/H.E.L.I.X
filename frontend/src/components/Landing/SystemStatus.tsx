import React from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface SystemStatusProps {
  className?: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  // You can replace these with actual API calls or context data
  const systemStatuses = [
    {
      name: 'Blockchain Network',
      status: 'operational',
      latency: '23ms',
      icon: Shield
    },
    {
      name: 'Verification System',
      status: 'operational',
      latency: '46ms',
      icon: CheckCircle
    },
    {
      name: 'Fraud Detection',
      status: 'degraded',
      latency: '189ms',
      icon: AlertTriangle
    }
  ];

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">System Status</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {systemStatuses.map((item) => (
            <div key={item.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <item.icon className="h-6 w-6 mr-3 text-blue-600" />
                <h3 className="font-semibold text-lg">{item.name}</h3>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm ${item.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.status === 'operational' ? 'Operational' : 'Degraded Performance'}
                </span>
                <span className="text-gray-500 text-sm">{item.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { SystemStatus };
export default SystemStatus;
