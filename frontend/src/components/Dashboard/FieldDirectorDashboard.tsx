import React from 'react';
import { Users, MapPin, DollarSign, AlertTriangle, UserPlus, Settings, BarChart3, Shield } from 'lucide-react';

// Mock data for a Field Director's perspective
const regionalData = {
  regionName: "East Africa Region",
  totalBudget: 15000000,
  allocatedBudget: 9500000,
  programManagersCount: 8,
  activePrograms: 23,
  regionalRiskScore: 45, // Example score
};

const programManagers = [
  { id: 'pm-001', name: 'John Carter', country: 'Kenya', programs: 5, performance: 4.5, risk: 20 },
  { id: 'pm-002', name: 'Asha Noor', country: 'Somalia', programs: 3, performance: 4.2, risk: 55 },
  { id: 'pm-003', name: 'Daniel Abebe', country: 'Ethiopia', programs: 4, performance: 3.8, risk: 30 },
];

const pendingAllocations = [
  { id: 'alloc-001', program: 'Emergency Food Aid - Tigray', amount: 1500000, priority: 'high' },
  { id: 'alloc-002', program: 'Medical Supplies - Dadaab Camp', amount: 750000, priority: 'medium' },
];

export function FieldDirectorDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-helix-gray-900 border border-helix-gray-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Field Director Dashboard</h1>
              <p className="text-helix-gray-300 text-lg">
                Managing the {regionalData.regionName}
              </p>
            </div>
            <div className="text-6xl opacity-20">🏆</div>
          </div>
        </div>

        {/* Regional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={DollarSign} title="Regional Budget" value={`$${(regionalData.totalBudget / 1000000).toFixed(1)}M`} color="primary" />
          <StatCard icon={Users} title="Program Managers" value={regionalData.programManagersCount} color="green" />
          <StatCard icon={BarChart3} title="Active Programs" value={regionalData.activePrograms} color="yellow" />
          <StatCard icon={Shield} title="Regional Risk" value={regionalData.regionalRiskScore} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fund Allocation */}
          <DashboardCard title="Allocate Regional Funds" icon={DollarSign}>
            <p className="text-helix-gray-400">Fund allocation controls will be available here.</p>
          </DashboardCard>

          {/* Program Manager Assignments */}
          <DashboardCard title="Program Manager Assignments" icon={UserPlus}>
            <p className="text-helix-gray-400">Program manager assignment controls will be available here.</p>
          </DashboardCard>
        </div>

        {/* Program Manager Performance */}
        <div className="mt-8">
          <DashboardCard title="Program Manager Performance" icon={Users}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-helix-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Manager</th>
                    <th className="text-left py-3 px-4 font-semibold">Country</th>
                    <th className="text-left py-3 px-4 font-semibold">Programs</th>
                    <th className="text-left py-3 px-4 font-semibold">Performance</th>
                    <th className="text-left py-3 px-4 font-semibold">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {programManagers.map((pm) => (
                    <tr key={pm.id} className="border-b border-helix-gray-800 hover:bg-helix-gray-800/50">
                      <td className="py-3 px-4 font-semibold">{pm.name}</td>
                      <td className="py-3 px-4 text-helix-gray-400">{pm.country}</td>
                      <td className="py-3 px-4 text-center">{pm.programs}</td>
                      <td className="py-3 px-4 font-semibold">{pm.performance}/5 ★</td>
                      <td className="py-3 px-4"><StatusBadge status={pm.risk < 30 ? 'low' : pm.risk < 60 ? 'medium' : 'high'} text={pm.risk} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

const StatusBadge = ({ status, text }) => {
  const statusStyles = {
    low: 'bg-green-900/50 text-green-300 border-green-700',
    medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    high: 'bg-red-900/50 text-red-300 border-red-700',
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusStyles[status]}`}>
      {text}
    </div>
  );
};
