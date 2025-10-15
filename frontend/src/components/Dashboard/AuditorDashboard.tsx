import React, { useState, useRef } from 'react';
import { Search, Shield, FileText, TrendingUp, ChevronDown, Eye, AlertTriangle, Brain, Zap, Activity, Target } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function AuditorDashboard() {
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>(null);
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

  const auditData = {
    transactionsAudited: 1250,
    highRiskFlags: 42,
    openInvestigations: 5,
    complianceRate: 99.1,
    aiFraudDetections: 158,
    autonomousInterventions: 12,
    aiModelsActive: 7,
    transactionsAnalyzedByAI: 8760,
    currentAIAnalysis: 'High-value transfers to new beneficiaries in East Africa.',
    aiAccuracyRate: 98.7,
  };

  const transactions = [
    { id: 'TXN-001', type: 'Fund Transfer', from: 'Lead Agency', to: 'Field Director - EA', amount: 500000, status: 'cleared', risk: 'low', date: '2024-01-15', description: 'Monthly operational fund for Eastern Amhara.' },
    { id: 'TXN-002', type: 'Payment', from: 'Program Manager - Tigray', to: 'Local Supplier - ABC', amount: 20000, status: 'flagged', risk: 'high', date: '2024-01-18', description: 'Urgent procurement of medical supplies.' },
    { id: 'TXN-003', type: 'Shipment', from: 'Logistics Partner - GT', to: 'Warehouse - Adigrat', amount: 0, status: 'cleared', risk: 'low', date: '2024-01-20', description: 'Shipment of 500 metric tons of grain.' },
    { id: 'TXN-004', type: 'Payment', from: 'Field Director - Oromia', to: 'Construction Co - XYZ', amount: 120000, status: 'pending', risk: 'medium', date: '2024-01-22', description: 'Initial payment for new school construction.' },
  ];

  const handleInvestigation = (txnId: string) => {
    showToast(`Transaction ${txnId} has been flagged for a full investigation.`, 'warning');
  };

  const toggleTxnExpansion = (txnId: string) => {
    setExpandedTxnId(prevId => (prevId === txnId ? null : txnId));
  };

  const RiskBadge = ({ risk }: { risk: 'low' | 'medium' | 'high' }) => {
    const riskStyles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskStyles[risk]}`}>
        {risk.toUpperCase()}
      </span>
    );
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
                          Auditor Dashboard
                      </VerticalCutReveal>
                  </h1>
                  <TimelineContent
                      as="p"
                      animationNum={0}
                      timelineRef={dashboardRef}
                      customVariants={revealVariants}
                      className="text-gray-600 text-lg"
                  >
                      Independent Oversight & Compliance Monitoring.
                  </TimelineContent>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* Key Metrics */}
                      <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold">Audit Overview</CardTitle>
                                  <CardDescription>Real-time compliance and transaction metrics.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                  <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                                      <FileText className="h-6 w-6 text-gray-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Transactions Audited</p>
                                      <p className="text-2xl font-bold text-gray-900">{auditData.transactionsAudited.toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                                      <TrendingUp className="h-6 w-6 text-green-500 mb-2" />
                                      <p className="text-sm font-medium text-green-600">Network Compliance</p>
                                      <p className="text-2xl font-bold text-green-600">{auditData.complianceRate}%</p>
                                  </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* AI Analysis Overview */}
                      <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><Brain className="mr-2 h-6 w-6 text-indigo-600" />AI Analysis Overview</CardTitle>
                                  <CardDescription>Insights into AI-driven monitoring and performance.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                  <div className="flex flex-col p-4 bg-indigo-50 rounded-lg">
                                      <Activity className="h-6 w-6 text-indigo-500 mb-2" />
                                      <p className="text-sm font-medium text-indigo-600">Models Active</p>
                                      <p className="text-2xl font-bold text-indigo-600">{auditData.aiModelsActive}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-purple-50 rounded-lg">
                                      <Zap className="h-6 w-6 text-purple-500 mb-2" />
                                      <p className="text-sm font-medium text-purple-600">Txns Analyzed by AI</p>
                                      <p className="text-2xl font-bold text-purple-600">{auditData.transactionsAnalyzedByAI.toLocaleString()}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                                      <Target className="h-6 w-6 text-blue-500 mb-2" />
                                      <p className="text-sm font-medium text-blue-600">AI Accuracy Rate</p>
                                      <p className="text-2xl font-bold text-blue-600">{auditData.aiAccuracyRate}%</p>
                                  </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Current AI Focus */}
                      <TimelineContent as="div" animationNum={1.7} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><Eye className="mr-2 h-6 w-6 text-gray-600" />Current AI Focus</CardTitle>
                                  <CardDescription>Real-time insights into the AI engine's active analysis.</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-lg font-semibold text-gray-800">{auditData.currentAIAnalysis}</p>
                                  <p className="text-sm text-gray-500 mt-2">Last updated: Just now</p>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Transaction Explorer */}
                      <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">Transaction Explorer</CardTitle>
                            <CardDescription>Search, filter, and investigate transactions across the network.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="Search by Transaction ID, Partner, or Amount..."
                                />
                                </div>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Transaction</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Risk</TableHead>
                                  <TableHead className="text-right">Details</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {transactions.map(txn => (
                                    <React.Fragment key={txn.id}>
                                    <TableRow className="hover:bg-gray-50/50 cursor-pointer" onClick={() => toggleTxnExpansion(txn.id)}>
                                        <TableCell>
                                            <div className="font-semibold">{txn.type}</div>
                                            <div className="text-sm text-gray-600 font-mono">{txn.id}</div>
                                        </TableCell>
                                        <TableCell>
                                            {txn.amount > 0 ? `₹${txn.amount.toLocaleString()}` : 'N/A'}
                                        </TableCell>
                                        <TableCell>{txn.date}</TableCell>
                                        <TableCell>
                                            <RiskBadge risk={txn.risk as 'low' | 'medium' | 'high'} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedTxnId === txn.id ? 'rotate-180' : ''}`} />
                                        </TableCell>
                                    </TableRow>
                                    {expandedTxnId === txn.id && (
                                        <TableRow>
                                        <TableCell colSpan={5} className="p-0">
                                            <div className="p-4 bg-gray-100/80">
                                            <h4 className="font-bold mb-2">Transaction Details</h4>
                                            <p className="text-sm text-gray-700 mb-3">{txn.description}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div><strong>From:</strong> {txn.from}</div>
                                                <div><strong>To:</strong> {txn.to}</div>
                                                <div><strong>Status:</strong> <span className="font-medium">{txn.status.toUpperCase()}</span></div>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                onClick={() => handleInvestigation(txn.id)}
                                                size="sm"
                                                className="p-2 h-auto border border-primary shadow-lg shadow-yellow-800/20 font-semibold rounded-xl bg-primary text-black "
                                                >
                                                <Search className="mr-2 h-4 w-4" />
                                                Initiate Investigation
                                                </Button>
                                            </div>
                                            </div>
                                        </TableCell>
                                        </TableRow>
                                    )}
                                    </React.Fragment>
                                ))}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TimelineContent>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                       <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />Risk Center</CardTitle>
                              <CardDescription>Monitor high-risk flags and open cases.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 sm:grid-cols-2">
                                <div className="flex flex-col p-4 bg-red-50 rounded-lg">
                                    <Shield className="h-6 w-6 text-red-500 mb-2" />
                                    <p className="text-sm font-medium text-red-600">High-Risk Flags</p>
                                    <p className="text-2xl font-bold text-red-600">{auditData.highRiskFlags}</p>
                                </div>
                                <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                    <Search className="h-6 w-6 text-yellow-500 mb-2" />
                                    <p className="text-sm font-medium text-yellow-600">Open Investigations</p>
                                    <p className="text-2xl font-bold text-yellow-600">{auditData.openInvestigations}</p>
                                </div>
                            </CardContent>
                          </Card>
                       </TimelineContent>

                       {/* AI Engine Insights */}
                       <TimelineContent as="div" animationNum={2.0} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><Brain className="mr-2 h-6 w-6 text-blue-600" />AI Engine Insights</CardTitle>
                                  <CardDescription>Performance metrics for AI-powered fraud detection.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2">
                                  <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                                      <Zap className="h-6 w-6 text-blue-500 mb-2" />
                                      <p className="text-sm font-medium text-blue-600">Fraud Engine Detections</p>
                                      <p className="text-2xl font-bold text-blue-600">{auditData.aiFraudDetections}</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-purple-50 rounded-lg">
                                      <Shield className="h-6 w-6 text-purple-500 mb-2" />
                                      <p className="text-sm font-medium text-purple-600">Autonomous Interventions</p>
                                      <p className="text-2xl font-bold text-purple-600">{auditData.autonomousInterventions}</p>
                                  </div>
                              </CardContent>
                          </Card>
                       </TimelineContent>

                       <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg h-fit">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><FileText className="mr-2 h-6 w-6" />Manual Audit</CardTitle>
                                  <CardDescription>Start a new investigation from scratch.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Transaction or Entity ID</label>
                                  <input
                                    type="text"
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                                    placeholder="Enter ID..."
                                  />
                                  <Button
                                    onClick={() => showToast('Manual investigation started.', 'success')}
                                    className="w-full mt-2 p-2 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                                  >
                                    <Search className="mr-2 h-5 w-5" />
                                    Start Investigation
                                  </Button>
                                </div>
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
