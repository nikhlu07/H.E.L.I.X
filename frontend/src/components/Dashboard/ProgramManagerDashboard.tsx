import React from 'react';
import { MapPin, Users, CheckCircle, Clock, AlertTriangle, Building, Truck, FileText } from 'lucide-react';

// Mock data for a Program Manager's perspective
const programData = {
  programName: "Emergency Food Aid - Tigray",
  fieldDirector: "Daniel Abebe",
  allocatedBudget: 1500000,
  spentBudget: 450000,
  activeTasks: 5,
  completedTasks: 12,
  pendingVerifications: 3,
};

const tasks = [
  { id: 'task-001', name: 'Secure Local Transport', status: 'completed', deadline: '2024-01-15' },
  { id: 'task-002', name: 'Establish Distribution Point', status: 'in-progress', deadline: '2024-01-25' },
  { id: 'task-003', name: 'Coordinate with Local Partners', status: 'in-progress', deadline: '2024-01-28' },
  { id: 'task-004', name: 'Submit Initial Report', status: 'pending', deadline: '2024-02-01' },
];

const deliveryVerifications = [
  { id: 'ver-001', type: 'Food Supplies', location: 'Mekelle Camp', quantity: '500 units', status: 'pending' },
  { id: 'ver-002', type: 'Medical Kits', location: 'Adigrat Town', quantity: '100 kits', status: 'verified' },
];

export function ProgramManagerDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-helix-gray-900 border border-helix-gray-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Program Manager Dashboard</h1>
          <p className="text-helix-gray-300 text-lg">{programData.programName}</p>
          <p className="text-helix-gray-400 text-sm mt-1">Reporting to: {programData.fieldDirector}</p>
        </div>

        {/* Program Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={DollarSign} title="Program Budget" value={`$${(programData.allocatedBudget / 1000000).toFixed(2)}M`} color="primary" />
          <StatCard icon={Clock} title="Active Tasks" value={programData.activeTasks} color="yellow" />
          <StatCard icon={CheckCircle} title="Pending Verifications" value={programData.pendingVerifications} color="red" />
          <StatCard icon={TrendingUp} title="Budget Utilization" value={`${Math.round((programData.spentBudget / programData.allocatedBudget) * 100)}%`} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Management */}
          <div className="lg:col-span-2">
            <DashboardCard title="Task Management" icon={FileText}>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="bg-helix-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{task.name}</p>
                      <p className="text-sm text-helix-gray-400">Deadline: {task.deadline}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>

          {/* Delivery Verification */}
          <DashboardCard title="Delivery Verification" icon={CheckCircle}>
            <div className="space-y-4">
              {deliveryVerifications.map(ver => (
                <div key={ver.id} className="bg-helix-gray-800 p-4 rounded-lg">
                  <p className="font-semibold">{ver.type} - {ver.location}</p>
                  <p className="text-sm text-helix-gray-400">Quantity: {ver.quantity}</p>
                  <div className="flex justify-between items-center mt-2">
                    <StatusBadge status={ver.status} />
                    {ver.status === 'pending' && (
                      <button className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-md hover:bg-helix-accent-dark">
                        Verify
                      </button>
                    )}
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

// --- Reusable Components (assuming they are in a shared file) ---

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
    completed: 'bg-green-900/50 text-green-300 border-green-700',
    'in-progress': 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    pending: 'bg-red-900/50 text-red-300 border-red-700',
    verified: 'bg-blue-900/50 text-blue-300 border-blue-700', // Note: blue is used here for verified status
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-helix-gray-700'}`}>
      {status.replace('-', ' ').toUpperCase()}
    </div>
  );
};
