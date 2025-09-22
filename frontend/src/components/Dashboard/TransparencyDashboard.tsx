import React, { useState } from 'react';
import { Building2, Heart, Factory, AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';

export function TransparencyDashboard() {
  const [selectedSector, setSelectedSector] = useState<'government' | 'ngo' | 'private'>('government');

  const sectorData = {
    government: {
      title: "Government Procurement",
      icon: Building2,
      color: "blue",
      stats: {
        totalContracts: "2,847",
        flaggedAnomalies: "23",
        fundsProtected: "₹2.4B",
        transparency: "94%"
      },
      recentAlerts: [
        { id: 1, type: "high", message: "Unusual bidding pattern detected in Highway Project #2847", time: "2 hours ago" },
        { id: 2, type: "medium", message: "Vendor concentration risk in IT procurement", time: "4 hours ago" },
        { id: 3, type: "low", message: "Price variance in office supplies contract", time: "6 hours ago" }
      ],
      transactions: [
        { id: 1, vendor: "ABC Construction Ltd", amount: "₹45,00,000", status: "flagged", risk: "high" },
        { id: 2, vendor: "Tech Solutions Inc", amount: "₹12,50,000", status: "approved", risk: "low" },
        { id: 3, vendor: "Office Supplies Co", amount: "₹3,75,000", status: "review", risk: "medium" }
      ]
    },
    ngo: {
      title: "NGO Fund Tracking",
      icon: Heart,
      color: "green",
      stats: {
        totalProjects: "156",
        flaggedAnomalies: "8",
        fundsTracked: "$2.8M",
        transparency: "97%"
      },
      recentAlerts: [
        { id: 1, type: "medium", message: "Unusual expense pattern in Education Project #156", time: "1 hour ago" },
        { id: 2, type: "low", message: "Budget variance in Healthcare Initiative", time: "3 hours ago" },
        { id: 3, type: "low", message: "Vendor payment delay in Water Project", time: "5 hours ago" }
      ],
      transactions: [
        { id: 1, vendor: "Local School Supplies", amount: "$15,000", status: "approved", risk: "low" },
        { id: 2, vendor: "Medical Equipment Co", amount: "$28,500", status: "review", risk: "medium" },
        { id: 3, vendor: "Water Pump Systems", amount: "$42,000", status: "approved", risk: "low" }
      ]
    },
    private: {
      title: "Supply Chain Audit",
      icon: Factory,
      color: "purple",
      stats: {
        totalVendors: "1,247",
        flaggedAnomalies: "31",
        costSavings: "$1.2M",
        compliance: "91%"
      },
      recentAlerts: [
        { id: 1, type: "high", message: "Potential fraud in Raw Materials procurement", time: "30 minutes ago" },
        { id: 2, type: "medium", message: "Vendor performance decline detected", time: "2 hours ago" },
        { id: 3, type: "medium", message: "Price manipulation in Electronics category", time: "4 hours ago" }
      ],
      transactions: [
        { id: 1, vendor: "Steel Corp Ltd", amount: "$85,000", status: "flagged", risk: "high" },
        { id: 2, vendor: "Electronics Supplier", amount: "$32,000", status: "review", risk: "medium" },
        { id: 3, vendor: "Packaging Solutions", amount: "$18,500", status: "approved", risk: "low" }
      ]
    }
  };

  const currentData = sectorData[selectedSector];
  const Icon = currentData.icon;

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "from-blue-50 to-indigo-50",
        text: "text-blue-600",
        button: "bg-blue-600",
        border: "border-blue-200"
      },
      green: {
        bg: "from-green-50 to-emerald-50",
        text: "text-green-600",
        button: "bg-green-600",
        border: "border-green-200"
      },
      purple: {
        bg: "from-purple-50 to-pink-50",
        text: "text-purple-600",
        button: "bg-purple-600",
        border: "border-purple-200"
      }
    };
    return colors[color as keyof typeof colors];
  };

  const colors = getColorClasses(currentData.color);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flagged': return 'text-red-600 bg-red-50';
      case 'review': return 'text-yellow-600 bg-yellow-50';
      case 'approved': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TransparencyX Dashboard</h1>
          <p className="text-gray-600">Real-time fraud detection and transparency monitoring</p>
        </div>

        {/* Sector Selector */}
        <div className="flex space-x-4 mb-8">
          {Object.entries(sectorData).map(([key, data]) => {
            const SectorIcon = data.icon;
            const isActive = selectedSector === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedSector(key as any)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? `${getColorClasses(data.color).button} text-white shadow-lg` 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <SectorIcon className="w-5 h-5" />
                <span>{data.title}</span>
              </button>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(currentData.stats).map(([key, value], index) => (
            <div key={key} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  {index === 0 && <Users className={`w-6 h-6 ${colors.text}`} />}
                  {index === 1 && <AlertTriangle className={`w-6 h-6 ${colors.text}`} />}
                  {index === 2 && <TrendingUp className={`w-6 h-6 ${colors.text}`} />}
                  {index === 3 && <CheckCircle className={`w-6 h-6 ${colors.text}`} />}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Alerts */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Alerts</h3>
            <div className="space-y-4">
              {currentData.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    alert.type === 'high' ? 'bg-red-500' : 
                    alert.type === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{alert.message}</p>
                    <p className="text-gray-500 text-sm mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>
            <div className="space-y-4">
              {currentData.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{transaction.vendor}</p>
                    <p className="text-gray-600 text-sm">{transaction.amount}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(transaction.risk)}`}>
                      {transaction.risk} risk
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Demo Mode Active</h4>
              <p className="text-blue-700">This is a demonstration of TransparencyX capabilities. Real data would be integrated through our API.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}