import React, { useState } from 'react';
import { Package, DollarSign, Clock, CheckCircle, FileText, Truck } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

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
    <>
      <style>{`
          body {
              font-family: 'Inter', sans-serif;
              background: #F7FAFC;
          }
          .card {
              background: #FFFFFF;
              border: 1px solid #E2E8F0;
              transition: all 0.3s ease;
              border-radius: 0.75rem;
          }
          .card:hover {
              border-color: #F59E0B; /* yellow-500 */
              transform: translateY(-5px);
              box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 8px 10px -6px rgba(245, 158, 11, 0.1);
          }
          .cta-gradient {
              background: linear-gradient(90deg, #FBBF24, #F59E0B); /* yellow-400 to yellow-500 */
              color: white;
              transition: opacity 0.3s ease;
          }
          .cta-gradient:hover {
              opacity: 0.9;
          }
          .table-row-hover:hover {
            background-color: #F7FAFC;
          }
        `}</style>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex rounded-full bg-yellow-100 p-4">
              <Package className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Sub-Supplier Dashboard
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Manage material deliveries and track payments from main vendors
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Orders</CardTitle>
                <Package className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{pendingOrders.length}</div>
                <p className="text-xs text-gray-500">Awaiting delivery</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">${totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-gray-500">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Payments</CardTitle>
                <Clock className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">1</div>
                <p className="text-xs text-gray-500">Awaiting payment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Reliability Score</CardTitle>
                <CheckCircle className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <p className="text-xs text-gray-500">On-time delivery</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Delivery Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Submit Delivery</CardTitle>
                <p className="text-gray-600">Submit a new delivery for verification.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter invoice number..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Amount ($)
                  </label>
                  <input
                    type="number"
                    value={deliveryAmount}
                    onChange={(e) => setDeliveryAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter delivery amount..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials Delivered
                  </label>
                  <textarea
                    value={deliveryDescription}
                    onChange={(e) => setDeliveryDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the materials delivered..."
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Delivery Documentation</h4>
                        <p className="text-sm text-blue-700 mb-3">
                        Upload delivery receipts, quality certificates, and material specifications.
                        </p>
                        <Button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Upload Documents
                        </Button>
                    </div>
                    </div>
                </div>

                <Button
                  onClick={handleSubmitDelivery}
                  className="w-full cta-gradient font-semibold"
                  size="lg"
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Submit Delivery
                </Button>
              </CardContent>
            </Card>

            {/* Pending Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Pending Orders</CardTitle>
                <p className="text-gray-600">Active and upcoming orders.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="rounded-xl border p-4 transition-all duration-300 ease-in-out hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{order.description}</h4>
                        <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                        <p className="text-sm text-gray-600">From: {order.vendor}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-yellow-600">
                        ${order.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500">
                        Due: {order.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Delivery History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Delivery History</CardTitle>
              <p className="text-gray-600">A record of all completed deliveries.</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery ID</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedDeliveries.map((delivery) => (
                    <TableRow key={delivery.id} className="table-row-hover">
                      <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                      <TableCell>{delivery.vendor}</TableCell>
                      <TableCell className="max-w-xs truncate">{delivery.description}</TableCell>
                      <TableCell className="font-semibold">${delivery.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {delivery.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {delivery.completedDate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
