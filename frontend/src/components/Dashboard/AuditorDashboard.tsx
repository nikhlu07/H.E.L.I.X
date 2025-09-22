import React from 'react';
import { Search, Shield, FileText, TrendingUp } from 'lucide-react';

// Mock data for an Auditor's perspective
const auditData = {
  transactionsAudited: 1250,
  highRiskFlags: 42,
  openInvestigations: 5,
  complianceRate: 99.1,
};

const transactions = [
  { id: 'TXN-001', type: 'Fund Transfer', from: 'Lead Agency', to: 'Field Director - EA', amount: 500000, status: 'cleared', risk: 'low' },
  { id: 'TXN-002', type: 'Payment', from: 'Program Manager - Tigray', to: 'Local Supplier - ABC', amount: 20000, status: 'flagged', risk: 'high' },
  { id: 'TXN-003', type: 'Shipment', from: 'Logistics Partner - GT', to: 'Warehouse - Adigrat', amount: 0, status: 'cleared', risk: 'low' },
];

export function AuditorDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-helix-gray-900 border border-helix-gray-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Auditor Dashboard</h1>
          <p className="text-helix-gray-300 text-lg">Independent Oversight & Compliance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={FileText} title="Transactions Audited" value={auditData.transactionsAudited.toLocaleString()} color="primary" />
          <StatCard icon={TrendingUp} title="Network Compliance" value={`${auditData.complianceRate}%`} color="green" />
          <StatCard icon={Shield} title="High-Risk Flags" value={auditData.highRiskFlags} color="yellow" />
          <StatCard icon={Search} title="Open Investigations" value={auditData.openInvestigations} color="red" />
        </div>

        {/* Transaction Explorer */}
        <DashboardCard title="Transaction Explorer" icon={Search}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full bg-helix-gray-800 border border-helix-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Search by Transaction ID, Partner, or Amount..."
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-helix-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(txn => (
                  <tr key={txn.id} className="border-b border-helix-gray-800 hover:bg-helix-gray-800/50">
                    <td className="py-3 px-4 font-mono text-sm">{txn.id}</td>
                    <td className="py-3 px-4">{txn.type}</td>
                    <td className="py-3 px-4">{txn.amount > 0 ? `$${txn.amount.toLocaleString()}` : 'N/A'}</td>
                    <td className="py-3 px-4"><StatusBadge status={txn.status} /></td>
                    <td className="py-3 px-4"><StatusBadge status={txn.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
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
    cleared: 'bg-green-900/50 text-green-300 border-green-700',
    flagged: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    low: 'bg-green-900/50 text-green-300 border-green-700',
    medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    high: 'bg-red-900/50 text-red-300 border-red-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusStyles[status] || 'bg-helix-gray-700'}`}>
      {status.toUpperCase()}
    </div>
  );
};
