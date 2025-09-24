import React, { useState, useEffect } from 'react';
import { Shield, Database, Globe, Activity, TrendingUp, Users, Plus, AlertTriangle } from 'lucide-react';
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
}

export function DemoDashboard({ userRole, userName }: DashboardProps) {
  const [showDemo, setShowDemo] = useState(false);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudAlerts: 0,
    activeUsers: 0,
    systemHealth: 100
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch stats from backend
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/demo/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use mock data if backend is not available
      setStats(prev => ({
        ...prev,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2),
      }));
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

  // Create a demo transaction
  const createTransaction = async () => {
    setIsLoading(true);
    try {
      const transactionData = {
        user_id: `demo-${userRole}`,
        amount: Math.random() * 10000 + 1000,
        description: `Demo transaction from ${userRole}`,
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
        await fetchStats();
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchStats();
    fetchTransactions();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchStats();
      fetchTransactions();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRoleIcon = () => {
    switch (userRole) {
      case 'main_government': return <Shield className="w-6 h-6" />;
      case 'vendor': return <Database className="w-6 h-6" />;
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
              <h1 className="text-xl font-bold">Helix Dashboard</h1>
              <p className="text-gray-400">{userName} • {userRole.replace('_', ' ').toUpperCase()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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

        {/* Activity Feed */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Click "Create Transaction" to see data flow in action</p>
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
