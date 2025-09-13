import React from 'react';
import { Truck, DollarSign, Clock, CheckCircle } from 'lucide-react';

// Mock data for a Logistics Partner
const logisticsData = {
  partnerName: "Global Transport Inc.",
  activeShipments: 12,
  totalFreightValue: 2500000,
  pendingPayments: 3,
  onTimeDeliveryRate: 98.5,
};

const shipments = [
  { id: 'SHIP-001', origin: 'Warehouse A', destination: 'Mekelle Camp', status: 'in-transit', value: 150000 },
  { id: 'SHIP-002', origin: 'Port of Djibouti', destination: 'Adigrat Town', status: 'delivered', value: 75000 },
  { id: 'SHIP-003', origin: 'Warehouse B', destination: 'Nairobi Hub', status: 'pending-pickup', value: 320000 },
];

const payments = [
  { id: 'PAY-001', shipmentId: 'SHIP-002', amount: 5000, status: 'paid', date: '2024-01-20' },
  { id: 'PAY-002', shipmentId: 'SHIP-001', amount: 12000, status: 'pending', date: '2024-01-22' },
];

export function LogisticsPartnerDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-helix-gray-900 border border-helix-gray-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Logistics Partner Dashboard</h1>
          <p className="text-helix-gray-300 text-lg">{logisticsData.partnerName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Truck} title="Active Shipments" value={logisticsData.activeShipments} color="primary" />
          <StatCard icon={DollarSign} title="Total Freight Value" value={`$${(logisticsData.totalFreightValue / 1000000).toFixed(2)}M`} color="green" />
          <StatCard icon={Clock} title="Pending Payments" value={logisticsData.pendingPayments} color="yellow" />
          <StatCard icon={CheckCircle} title="On-Time Delivery" value={`${logisticsData.onTimeDeliveryRate}%`} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipment Management */}
          <div className="lg:col-span-2">
            <DashboardCard title="Shipment Management" icon={Truck}>
              <div className="space-y-4">
                {shipments.map(shipment => (
                  <div key={shipment.id} className="bg-helix-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{shipment.id}: {shipment.origin} to {shipment.destination}</p>
                      <p className="text-sm text-helix-gray-400">Value: ${shipment.value.toLocaleString()}</p>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Payment Overview */}
          <DashboardCard title="Payment Overview" icon={DollarSign}>
            <div className="space-y-4">
              {payments.map(payment => (
                <div key={payment.id} className="bg-helix-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">Payment for {payment.shipmentId}</p>
                  <p className="text-lg font-bold text-primary">${payment.amount.toLocaleString()}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-helix-gray-400">Date: {payment.date}</p>
                    <StatusBadge status={payment.status} />
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Components ---

const DashboardCard = ({ title, icon: Icon, children }) => (
  <div className="bg-helix-gray-900 rounded-2xl shadow-lg border border-helix-gray-800 h-full">
    <div className="p-6 border-b border-helix-gray-800">
      <h2 className="text-xl font-bold flex items-center space-x-2">
        <Icon className="h-6 w-6 text-primary" />
        <span>{title}</span>
      </h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colors = {
    primary: 'text-primary',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-helix-gray-900 rounded-2xl p-6 shadow-lg border border-helix-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-helix-gray-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
        </div>
        <div className={`p-3 bg-helix-gray-800 rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors[color]}`} />
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'in-transit': 'bg-blue-900/50 text-blue-300 border-blue-700',
    delivered: 'bg-green-900/50 text-green-300 border-green-700',
    'pending-pickup': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    paid: 'bg-green-900/50 text-green-300 border-green-700',
    pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-helix-gray-700'}`}>
      {status.replace('-', ' ').toUpperCase()}
    </div>
  );
};
