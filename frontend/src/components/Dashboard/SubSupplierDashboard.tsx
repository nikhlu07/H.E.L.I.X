import React, { useState, useRef } from 'react';
import { Package, DollarSign, Clock, CheckCircle, FileText, Truck } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function SubSupplierDashboard() {
  const [deliveryAmount, setDeliveryAmount] = useState('');
  const [deliveryDescription, setDeliveryDescription] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const { showToast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
      visible: (i: number) => ({
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
              delay: i * 0.2,
              duration: 0.5,
          },
      }),
      hidden: {
          filter: "blur(10px)",
          y: -20,
          opacity: 0,
      },
  };

  // Mock data for sub-supplier
  const dashboardData = {
    activeOrders: 2,
    reliabilityScore: 98,
  };

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
  const pendingPayments = 1; // Mock data

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

  return (
    <>
      <section
          className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start"
          ref={dashboardRef}
      >
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
          <main className="max-w-7xl mx-auto w-full z-10">
              {/* Header */}
              <article className="text-center mb-12">
                  <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                      <VerticalCutReveal
                          splitBy="words"
                          staggerDuration={0.15}
                          staggerFrom="first"
                          reverse={true}
                          containerClassName="justify-center"
                          transition={{
                              type: "spring",
                              stiffness: 250,
                              damping: 40,
                              delay: 0,
                          }}
                      >
                          Sub-Supplier Dashboard
                      </VerticalCutReveal>
                  </h1>
                  <TimelineContent
                      as="p"
                      animationNum={0}
                      timelineRef={dashboardRef}
                      customVariants={revealVariants}
                      className="text-gray-600 text-lg"
                  >
                      Manage material deliveries and track payments from main vendors.
                  </TimelineContent>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* Key Metrics */}
                      <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold">Supplier Overview</CardTitle>
                                  <CardDescription>Real-time overview of your activities.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                                      <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <Package className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Active Orders</p>
                                      <p className="text-2xl font-bold text-gray-900">{dashboardData.activeOrders}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                      <Clock className="h-6 w-6 text-yellow-500 mb-2" />
                                      <p className="text-sm font-medium text-yellow-600">Pending Payments</p>
                                      <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                      <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                                      <p className="text-sm font-medium text-green-600">Reliability Score</p>
                                      <p className="text-2xl font-bold text-green-600">{dashboardData.reliabilityScore}%</p>
                                  </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Pending Orders */}
                      <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">Pending Orders</CardTitle>
                            <CardDescription>Active and upcoming orders from vendors.</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {pendingOrders.map((order) => (
                              <div key={order.id} className="rounded-xl border p-4 space-y-3 hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{order.description}</h3>
                                    <p className="text-sm text-gray-600">From: {order.vendor} (ID: {order.id})</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-lg font-bold text-gray-800">₹{order.amount.toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Due: {order.dueDate}</p>
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </TimelineContent>

                      {/* Delivery History */}
                      <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">Delivery History</CardTitle>
                            <CardDescription>A record of all completed and paid deliveries.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Delivery ID</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Completed</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {completedDeliveries.map((delivery) => (
                                  <TableRow key={delivery.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-mono text-sm">{delivery.id}</TableCell>
                                    <TableCell className="font-semibold">{delivery.description}</TableCell>
                                    <TableCell>₹{delivery.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {delivery.status}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{delivery.completedDate}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TimelineContent>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                       {/* Submit Delivery */}
                       <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold">Submit New Delivery</CardTitle>
                              <CardDescription>Submit a new delivery for verification and payment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Invoice Number</label>
                                <input
                                  type="text"
                                  value={invoiceNumber}
                                  onChange={(e) => setInvoiceNumber(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="e.g., INV-2024-001"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Delivery Amount (₹)</label>
                                <input
                                  type="number"
                                  value={deliveryAmount}
                                  onChange={(e) => setDeliveryAmount(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="e.g., 25000"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">Materials Delivered</label>
                                <textarea
                                  value={deliveryDescription}
                                  onChange={(e) => setDeliveryDescription(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  rows={3}
                                  placeholder="e.g., 500 bags of cement, 2 tons of steel rebar"
                                />
                              </div>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                  <div className="flex items-start space-x-3">
                                  <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                                  <div>
                                      <h4 className="font-semibold text-yellow-800 mb-1">Delivery Documentation</h4>
                                      <p className="text-sm text-yellow-700 mb-3">
                                      Upload delivery receipts, quality certificates, etc.
                                      </p>
                                      <Button className="bg-yellow-100 hover:bg-blue-200 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                      Upload Documents
                                      </Button>
                                  </div>
                                  </div>
                              </div>
                              <Button onClick={handleSubmitDelivery} className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800">
                                <Truck className="mr-2 h-5 w-5" />
                                Submit Delivery
                              </Button>
                            </CardContent>
                          </Card>
                       </TimelineContent>
                  </div>
              </div>
          </main>
      </section>
    </>
  );
}
