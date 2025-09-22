import React, { useState } from 'react';
import { Package, DollarSign, Clock, CheckCircle, AlertTriangle, FileText, Truck } from 'lucide-react';
import { useToast } from '../common/Toast';

export function SubSupplierDashboard() {
  const [deliveryAmount, setDeliveryAmount] = useState('');
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const { showToast } = useToast();

  const handleSubmitDelivery = () => {
    if (!deliveryAmount || !deliveryDescription || !invoiceNumber) {
      showToast('Please fill in all delivery details', 'warning');
      return;
    }

    showToast('Delivery submitted successfully for verification', 'success');
    setDeliveryAmount('');
    setDeliveryDescription('');
    setInvoiceNumber('');
  };

  // Mock data for sub-supplier
  const pendingOrders = [
    {
      id: 'SUB-001',
      vendor: 'BuildCorp Ltd',
      description: 'Construction Materials - Cement and Steel',
      amount: 50000,
      dueDate: '2024-02-15',
      status: 'pending'
    },
    {
      id: 'SUB-002', 
      vendor: 'BuildCorp Ltd',
      description: 'Electrical Equipment and Wiring',
      amount: 25000,
      dueDate: '2024-02-20',
      status: 'in-progress'
    }
  ];

  const completedDeliveries = [
    {
      id: 'DEL-001',
      vendor: 'BuildCorp Ltd',
      description: 'Plumbing Materials',
      amount: 15000,
      completedDate: '2024-01-28',
      status: 'paid'
    },
    {
      id: 'DEL-002',
      vendor: 'BuildCorp Ltd', 
      description: 'Roofing Materials',
      amount: 30000,
      completedDate: '2024-01-25',
      status: 'paid'
    }
  ];

  const totalEarnings = completedDeliveries.reduce((sum, del) => sum + del.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sub-Supplier Dashboard</h1>
              <p className="text-teal-200 text-lg">
                Manage material deliveries and track payments from main vendors
              </p>
            </div>
            <div className="text-6xl opacity-20">📦</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Orders</p>
                <p className="text-2xl font-bold text-teal-600">{pendingOrders.length}</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-xl">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold text-emerald-600">${totalEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-amber-600">1</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Reliability Score</p>
                <p className="text-2xl font-bold text-blue-600">98%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Delivery Submission */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Truck className="h-6 w-6 text-teal-600" />
                <span>Submit Delivery</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter invoice number..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Delivery Amount ($)
                </label>
                <input
                  type="number"
                  value={deliveryAmount}
                  onChange={(e) => setDeliveryAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Enter delivery amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Materials Delivered
                </label>
                <textarea
                  value={deliveryDescription}
                  onChange={(e) => setDeliveryDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the materials delivered..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">Delivery Documentation</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Upload delivery receipts, quality certificates, and material specifications
                    </p>
                    <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Upload Documents
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitDelivery}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Submit Delivery
              </button>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Package className="h-6 w-6 text-amber-600" />
                <span>Pending Orders</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900">{order.description}</h4>
                        <p className="text-sm text-slate-600">Order ID: {order.id}</p>
                        <p className="text-sm text-slate-600">From: {order.vendor}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-teal-600">
                        ${order.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        Due: {order.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery History */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Delivery History</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Delivery ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {completedDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{delivery.id}</td>
                      <td className="py-3 px-4">{delivery.vendor}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{delivery.description}</td>
                      <td className="py-3 px-4 font-semibold">${delivery.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {delivery.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {delivery.completedDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 border border-teal-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Supplier Performance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">98%</div>
              <div className="text-slate-600 font-medium">Reliability Score</div>
              <div className="text-sm text-slate-500">On-time delivery rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">24</div>
              <div className="text-slate-600 font-medium">Completed Orders</div>
              <div className="text-sm text-slate-500">This month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
              <div className="text-slate-600 font-medium">Quality Rating</div>
              <div className="text-sm text-slate-500">Vendor feedback average</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}