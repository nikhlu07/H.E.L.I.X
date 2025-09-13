import React from 'react';
import { Package, DollarSign, Clock, CheckCircle } from 'lucide-react';

// Mock data for a Local Supplier
const supplierData = {
  supplierName: "Community Provisions Co.",
  activeOrders: 3,
  totalEarnings: 45000,
  pendingPayments: 1,
  reliabilityScore: 99.2,
};

const purchaseOrders = [
  { id: 'PO-001', from: 'Program Manager - Tigray', item: 'Grain Supplies', quantity: 500, value: 20000, status: 'in-progress' },
  { id: 'PO-002', from: 'Program Manager - Dadaab', item: 'Medical Kits', quantity: 100, value: 15000, status: 'pending-acceptance' },
  { id: 'PO-003', from: 'Logistics Partner - Global Transport', item: 'Warehouse Services', quantity: 1, value: 10000, status: 'in-progress' },
];

const paymentHistory = [
  { id: 'PAY-LS-001', orderId: 'PO-001', amount: 20000, status: 'pending', date: '2024-01-25' },
  { id: 'PAY-LS-002', orderId: 'PO-XYZ', amount: 18000, status: 'paid', date: '2024-01-15' },
];

export function LocalSupplierDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-helix-gray-900 border border-helix-gray-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Local Supplier Dashboard</h1>
          <p className="text-helix-gray-300 text-lg">{supplierData.supplierName}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Package} title="Active Purchase Orders" value={supplierData.activeOrders} color="primary" />
          <StatCard icon={DollarSign} title="Total Earnings" value={`$${supplierData.totalEarnings.toLocaleString()}`} color="green" />
          <StatCard icon={Clock} title="Pending Payments" value={supplierData.pendingPayments} color="yellow" />
          <StatCard icon={CheckCircle} title="Reliability Score" value={`${supplierData.reliabilityScore}%`} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Purchase Orders */}
          <div className="lg:col-span-2">
            <DashboardCard title="Purchase Orders" icon={Package}>
              <div className="space-y-4">
                {purchaseOrders.map(order => (
                  <div key={order.id} className="bg-helix-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{order.item} (x{order.quantity})</p>
                        <p className="text-sm text-helix-gray-400">From: {order.from}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-2 flex justify-between items-end">
                      <p className="text-lg font-bold text-primary">${order.value.toLocaleString()}</p>
                      {order.status === 'pending-acceptance' && (
                        <button className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-md hover:bg-helix-accent-dark">
                          Accept Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Payment History */}
          <DashboardCard title="Payment History" icon={DollarSign}>
            <div className="space-y-4">
              {paymentHistory.map(payment => (
                <div key={payment.id} className="bg-helix-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">Payment for {payment.orderId}</p>
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
    'in-progress': 'bg-blue-900/50 text-blue-300 border-blue-700',
    'pending-acceptance': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    paid: 'bg-green-900/50 text-green-300 border-green-700',
    pending: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-helix-gray-700'}`}>
      {status.replace('-', ' ').toUpperCase()}
    </div>
  );
};
