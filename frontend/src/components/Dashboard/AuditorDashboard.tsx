import React, { useState } from 'react';
import { Search, Shield, FileText, TrendingUp, ChevronDown, Eye } from 'lucide-react';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function AuditorDashboard() {
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>(null);
  const { showToast } = useToast();

  const auditData = {
    transactionsAudited: 1250,
    highRiskFlags: 42,
    openInvestigations: 5,
    complianceRate: 99.1,
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
      low: 'bg-emerald-100 text-emerald-800',
      medium: 'bg-amber-100 text-amber-800',
      high: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${riskStyles[risk]}`}>
        {risk.toUpperCase()}
      </span>
    );
  };

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
          .table-row-hover:hover {
            background-color: #F7FAFC;
          }
        `}</style>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main className="container mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex rounded-full bg-yellow-100 p-4">
              <Shield className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Auditor Dashboard
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Independent Oversight & Compliance Monitoring
            </p>
          </div>

          {/* Audit Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Transactions Audited</CardTitle>
                <FileText className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{auditData.transactionsAudited.toLocaleString()}</div>
                <p className="text-xs text-gray-500">In the last 90 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Network Compliance</CardTitle>
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{auditData.complianceRate}%</div>
                <p className="text-xs text-gray-500">Overall compliance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">High-Risk Flags</CardTitle>
                <Shield className="h-5 w-5 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{auditData.highRiskFlags}</div>
                <p className="text-xs text-gray-500">Require investigation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Open Investigations</CardTitle>
                <Search className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">{auditData.openInvestigations}</div>
                <p className="text-xs text-gray-500">Currently under review</p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Explorer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Transaction Explorer</CardTitle>
              <p className="text-gray-600">Search, filter, and investigate transactions across the network.</p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(txn => (
                    <React.Fragment key={txn.id}>
                      <TableRow className="table-row-hover cursor-pointer" onClick={() => toggleTxnExpansion(txn.id)}>
                        <TableCell>
                          <div className="font-semibold">{txn.type}</div>
                          <div className="text-sm text-gray-600">{txn.id}</div>
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
                            <div className="p-4 bg-gray-100">
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
                                  className="bg-amber-600 hover:bg-amber-700 text-white"
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
        </main>
      </div>
    </>
  );
}
