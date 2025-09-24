import React, { useState, useEffect } from 'react';
import { Shield, Database, Activity, TrendingUp, Users, Plus, AlertTriangle, ArrowDown, ArrowRight } from 'lucide-react';
import { DemoFlow } from './DemoFlow';

interface DashboardProps {
  userRole: string;
  userName: string;
}

interface Transaction {
  id: number;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  status: string;
  timestamp: string;
  fraud_alert?: boolean;
  hierarchical_flow?: string[];
  current_level?: string;
  next_level?: string;
}

interface BudgetAllocation {
  from_role: string;
  to_role: string;
  amount: number;
  project_name: string;
  description: string;
}

export function HierarchicalDashboard({ userRole, userName }: DashboardProps) {
  const [showDemo, setShowDemo] = useState(false);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudAlerts: 0,
    activeUsers: 0,
    systemHealth: 100,
    hierarchicalFlows: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [roleData, setRoleData] = useState<any>({});
  const [hierarchyFlow, setHierarchyFlow] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/demo/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          totalTransactions: data.data.total_transactions,
          fraudAlerts: data.data.fraud_alerts,
          activeUsers: data.data.active_users,
          systemHealth: data.data.system_health,
          hierarchicalFlows: data.data.hierarchical_flows || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Fetch role-specific data
  const fetchRoleData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/demo/role-data/${userRole}`);
      if (response.ok) {
        const data = await response.json();
        setRoleData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch role data:', error);
    }
  };

  // Fetch hierarchical flow data
  const fetchHierarchyFlow = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/demo/hierarchical-flow');
      if (response.ok) {
        const data = await response.json();
        setHierarchyFlow(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch hierarchy flow:', error);
    }
  };

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/demo/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // Create a budget allocation (for government roles)
  const createBudgetAllocation = async () => {
    if (!['main_government', 'state_head', 'deputy'].includes(userRole)) {
      alert('Only government roles can allocate budget');
      return;
    }

    setIsLoading(true);
    try {
      const targetRole = userRole === 'main_government' ? 'state_head' : 
                        userRole === 'state_head' ? 'deputy' : 'vendor';
      
      const allocationData: BudgetAllocation = {
        from_role: userRole,
        to_role: targetRole,
        amount: Math.random() * 50000 + 10000,
        project_name: `Project ${Date.now()}`,
        description: `Budget allocation from ${userRole} to ${targetRole}`
      };

      const response = await fetch('http://localhost:8000/api/v1/demo/budget-allocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allocationData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Budget allocated:', result);
        
        // Refresh all data
        await Promise.all([fetchStats(), fetchRoleData(), fetchHierarchyFlow(), fetchTransactions()]);
      }
    } catch (error) {
      console.error('Failed to create budget allocation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a demo transaction
  const createTransaction = async () => {
    setIsLoading(true);
    try {
      const transactionData = {
        user_id: `demo-${userRole}`,
        amount: Math.random() * 10000 + 1000,
        description: `Transaction from ${userRole}`,
        category: userRole === 'vendor' ? 'procurement' : 'general'
      };

      const response = await fetch('http://localhost:8000/api/v1/demo/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Transaction created:', result);

        // Refresh data
        await Promise.all([fetchStats(), fetchTransactions()]);
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    Promise.all([fetchStats(), fetchRoleData(), fetchHierarchyFlow(), fetchTransactions()]);

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      Promise.all([fetchStats(), fetchRoleData(), fetchHierarchyFlow(), fetchTransactions()]);
    }, 3000);

    return () => clearInterval(interval);
  }, [userRole]);

  const getRoleIcon = () => {
    switch (userRole) {
      case 'main_government': return <Shield className="w-6 h-6" />;
      case 'state_head': return <Database className="w-6 h-6" />;
      case 'deputy': return <Activity className="w-6 h-6" />;
      case 'vendor': return <TrendingUp className="w-6 h-6" />;
      case 'citizen': return <Users className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              {getRoleIcon()}
            </div>
            <div>
              <h1 className="text-xl font-bold">Helix Hierarchical Dashboard</h1>
              <p className="text-gray-400">{userName} • {userRole.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {['main_government', 'state_head', 'deputy'].includes(userRole) && (
              <button
                onClick={createBudgetAllocation}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <ArrowDown className="w-4 h-4" />
                <span>{isLoading ? 'Allocating...' : 'Allocate Budget'}</span>
              </button>
            )}
            <button
              onClick={createTransaction}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isLoading ? 'Creating...' : 'Create Transaction'}</span>
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Show Data Flow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Hierarchical Flows</p>
                <p className="text-2xl font-bold text-purple-500">{stats.hierarchicalFlows}</p>
              </div>
              <ArrowDown className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Fraud Alerts</p>
                <p className="text-2xl font-bold text-red-500">{stats.fraudAlerts}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold text-blue-500">{stats.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">System Health</p>
                <p className="text-2xl font-bold text-green-500">{stats.systemHealth}%</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Hierarchical Flow Visualization */}
        {hierarchyFlow.government_hierarchy && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold mb-6">Government Hierarchy Data Flow</h2>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="bg-blue-600 rounded-lg p-4 mb-2">
                  <Shield className="w-8 h-8 mx-auto text-white" />
                </div>
                <h3 className="font-semibold">Main Government</h3>
                <p className="text-sm text-gray-400">Budget: ${hierarchyFlow.government_hierarchy.main_government?.total_budget?.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Allocated: ${hierarchyFlow.government_hierarchy.main_government?.allocated?.toLocaleString()}</p>
              </div>
              
              <ArrowRight className="w-6 h-6 text-purple-500" />
              
              <div className="text-center">
                <div className="bg-purple-600 rounded-lg p-4 mb-2">
                  <Database className="w-8 h-8 mx-auto text-white" />
                </div>
                <h3 className="font-semibold">State Head</h3>
                <p className="text-sm text-gray-400">Received: ${hierarchyFlow.government_hierarchy.state_head?.received_budget?.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Items: {hierarchyFlow.government_hierarchy.state_head?.received_items}</p>
              </div>
              
              <ArrowRight className="w-6 h-6 text-purple-500" />
              
              <div className="text-center">
                <div className="bg-green-600 rounded-lg p-4 mb-2">
                  <Activity className="w-8 h-8 mx-auto text-white" />
                </div>
                <h3 className="font-semibold">Deputy</h3>
                <p className="text-sm text-gray-400">Received: ${hierarchyFlow.government_hierarchy.deputy?.received_budget?.toLocaleString()}</p>
                <p className="text-sm text-gray-400">Items: {hierarchyFlow.government_hierarchy.deputy?.received_items}</p>
              </div>
            </div>
          </div>
        )}

        {/* Role-specific Data */}
        {roleData && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold mb-4">Your Role Data</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Budget Information</h3>
                {roleData.total_budget && (
                  <p className="text-sm text-gray-300">Total Budget: ${roleData.total_budget.toLocaleString()}</p>
                )}
                {roleData.allocated_budget !== undefined && (
                  <p className="text-sm text-gray-300">Allocated: ${roleData.allocated_budget.toLocaleString()}</p>
                )}
                {roleData.received_budget !== undefined && (
                  <p className="text-sm text-gray-300">Received: ${roleData.received_budget.toLocaleString()}</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Activity</h3>
                {roleData.sent_data && (
                  <p className="text-sm text-gray-300">Sent Items: {roleData.sent_data.length}</p>
                )}
                {roleData.received_data && (
                  <p className="text-sm text-gray-300">Received Items: {roleData.received_data.length}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Click "Create Transaction" or "Allocate Budget" to see hierarchical data flow</p>
              </div>
            ) : (
              transactions.slice(-5).reverse().map((transaction) => (
                <div
                  key={transaction.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-l-4 ${
                    transaction.fraud_alert
                      ? 'bg-red-900/20 border-l-red-500'
                      : transaction.status === 'processing'
                      ? 'bg-blue-900/20 border-l-blue-500'
                      : 'bg-green-900/20 border-l-green-500'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.fraud_alert ? 'bg-red-500 animate-pulse' :
                    transaction.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{transaction.description}</span>
                      {transaction.fraud_alert && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>${transaction.amount.toLocaleString()}</span>
                      <span>{transaction.category}</span>
                      {transaction.hierarchical_flow && (
                        <span className="text-purple-400">Flow: {transaction.hierarchical_flow.join(' → ')}</span>
                      )}
                      <span>{new Date(transaction.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      transaction.fraud_alert ? 'bg-red-900/50 text-red-300' :
                      transaction.status === 'processing' ? 'bg-blue-900/50 text-blue-300' :
                      'bg-green-900/50 text-green-300'
                    }`}>
                      {transaction.fraud_alert ? 'FLAGGED' : transaction.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Demo Flow Component */}
      <DemoFlow isVisible={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
