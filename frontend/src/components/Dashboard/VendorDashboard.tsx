import React, { useState } from 'react';
import { Upload, FileText, DollarSign, Clock, CheckCircle, AlertTriangle, Building, Truck, Wallet } from 'lucide-react';
import { mockClaims, calculateFraudScore, getRiskLevel } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { PDFReader } from '../common/PDFReader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useContract } from '../../hooks/useContracts';

export function VendorDashboard() {
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const { showToast } = useToast();
  const [supplierPayment, setSupplierPayment] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');

  const { getCkUSDCBalance, transferCkUSDC } = useContract();
  const [ckBalance, setCkBalance] = useState<string>('—');
  const [walletRecipient, setWalletRecipient] = useState('');
  const [walletAmount, setWalletAmount] = useState('');
  const [walletBusy, setWalletBusy] = useState(false);

  const handleFileSelect = (file: File, content: string) => {
    setUploadedDocument(content);
    showToast(`Document "${file.name}" uploaded and analyzed`, 'success');
  };

  const handlePaySupplier = () => {
    if (!supplierPayment || !supplierAddress) {
      showToast('Please fill in all supplier payment details', 'warning');
      return;
    }
    showToast(`Payment of $${supplierPayment} initiated to supplier`, 'success');
    setSupplierPayment('');
    setSupplierAddress('');
  };

  const handleRefreshBalance = async () => {
    try {
      setWalletBusy(true);
      const res = await getCkUSDCBalance();
      if (res) {
        setCkBalance(res.formatted);
        showToast('Balance refreshed', 'success');
      } else {
        showToast('Failed to fetch ckUSDC balance', 'error');
      }
    } catch (e) {
      showToast('Failed to fetch ckUSDC balance', 'error');
    } finally {
      setWalletBusy(false);
    }
  };

  const handleTransferCkUSDC = async () => {
    if (!walletRecipient || !walletAmount) {
      showToast('Please enter recipient principal and amount', 'warning');
      return;
    }
    try {
      setWalletBusy(true);
      const tx = await transferCkUSDC(walletRecipient, walletAmount);
      if (tx !== null) {
        showToast(`Transfer submitted (Tx: ${String(tx)})`, 'success');
        await handleRefreshBalance();
        setWalletAmount('');
        setWalletRecipient('');
      } else {
        showToast('Transfer failed', 'error');
      }
    } catch (e) {
      showToast('Transfer failed', 'error');
    } finally {
      setWalletBusy(false);
    }
  };

  const handleSubmitClaim = () => {
    if (!claimAmount || !claimDescription) {
      showToast('Please fill in all claim details', 'warning');
      return;
    }

    const newClaim = {
      id: `claim-${Date.now()}`,
      budgetId: 'budget-001',
      vendorId: 'vendor-001',
      amount: parseInt(claimAmount),
      description: claimDescription,
      status: 'pending' as const,
      riskLevel: 'low' as const,
      fraudScore: 0,
      submittedAt: new Date(),
      submittedBy: 'vendor-001',
      documents: []
    };

    const fraudScore = calculateFraudScore(newClaim);
    const riskLevel = getRiskLevel(fraudScore);

    if (riskLevel === 'critical') {
      showToast('Claim blocked due to high fraud risk - Please review details', 'error');
    } else if (riskLevel === 'high') {
      showToast('Claim flagged for manual review due to elevated risk', 'warning');
    } else {
      showToast('Claim submitted successfully for processing', 'success');
    }

    setClaimAmount('');
    setClaimDescription('');
    setUploadedDocument(null);
  };

  const vendorClaims = mockClaims.filter(claim => claim.vendorId === 'vendor-001');
  const totalEarnings = vendorClaims
    .filter(claim => claim.status === 'approved')
    .reduce((sum, claim) => sum + claim.amount, 0);
  const pendingClaimsCount = vendorClaims.filter(claim => claim.status === 'pending' || claim.status === 'under-review').length;

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
              <Building className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Vendor Dashboard
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Manage your contracts, claims, and project deliverables.
            </p>
          </div>

          {/* Vendor Overview Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                <DollarSign className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-gray-500">From approved claims</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
                <Truck className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">5</div>
                <p className="text-xs text-gray-500">Across all contracts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Claims</CardTitle>
                <Clock className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{pendingClaimsCount}</div>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Vendor Risk Score</CardTitle>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">15</div>
                <p className="text-xs text-gray-500">Low risk profile</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Submit New Claim</CardTitle>
                <p className="text-gray-600">Fill out the form to submit a new payment claim.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claim Amount ($)
                  </label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Description
                  </label>
                  <textarea
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe the work completed for this claim..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Invoice & Supporting Documents
                  </label>
                  <PDFReader onFileSelect={handleFileSelect} />
                  {uploadedDocument && (
                    <div className="mt-3 flex items-center space-x-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>Document uploaded and ready for submission.</span>
                    </div>
                  )}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">AI-Powered Fraud Detection</h4>
                      <p className="text-sm text-yellow-700">
                        Your submission will be automatically analyzed for compliance and fraud indicators.
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSubmitClaim}
                  className="w-full cta-gradient font-semibold"
                  size="lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Submit Claim for Review
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center"><DollarSign className="mr-2 h-6 w-6 text-emerald-600" />Pay Sub-Suppliers</CardTitle>
                <p className="text-gray-600">Send payments to your suppliers and subcontractors.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Amount ($)
                  </label>
                  <input
                      type="number"
                      value={supplierPayment}
                      onChange={(e) => setSupplierPayment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter payment amount..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier Wallet Address
                  </label>
                  <input
                      type="text"
                      value={supplierAddress}
                      onChange={(e) => setSupplierAddress(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                      placeholder="Enter ICP principal ID..."
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-amber-800 mb-1">Payment Verification</h4>
                            <p className="text-sm text-amber-700">
                                All supplier payments are recorded on the blockchain for transparency and audit purposes.
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handlePaySupplier}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    size="lg"
                >
                    Process Payment
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center"><Wallet className="mr-2 h-6 w-6 text-blue-600" />Wallet (ckUSDC)</CardTitle>
                <p className="text-gray-600">Manage and transfer your ckUSDC funds.</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
                    <div>
                        <p className="text-sm font-medium text-gray-600">Current Balance</p>
                        <p className="text-2xl font-bold text-blue-600">{ckBalance}</p>
                    </div>
                    <Button
                        onClick={handleRefreshBalance}
                        disabled={walletBusy}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {walletBusy ? 'Refreshing…' : 'Refresh'}
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Principal</label>
                        <input
                            type="text"
                            value={walletRecipient}
                            onChange={(e) => setWalletRecipient(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
                            placeholder="aaaaa-aa"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (ckUSDC)</label>
                        <input
                            type="number"
                            value={walletAmount}
                            onChange={(e) => setWalletAmount(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="0.00"
                            min="0"
                        />
                    </div>
                </div>
                <Button
                    onClick={handleTransferCkUSDC}
                    disabled={walletBusy}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    size="lg"
                >
                    {walletBusy ? 'Transferring…' : 'Send ckUSDC'}
                </Button>
            </CardContent>
          </Card>

          {/* Claims History */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">My Claims History</CardTitle>
              <p className="text-gray-600">Track the status of all your submitted claims.</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorClaims.map((claim) => (
                    <TableRow key={claim.id} className="table-row-hover">
                      <TableCell className="font-mono text-xs">{claim.id.substring(0, 15)}...</TableCell>
                      <TableCell className="font-semibold max-w-xs truncate">{claim.description}</TableCell>
                      <TableCell>${claim.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          claim.status === 'under-review' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {claim.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          claim.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {claim.riskLevel.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {claim.submittedAt.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold">Performance & Compliance</CardTitle>
                <p className="text-gray-600">Your performance metrics and compliance status.</p>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <div className="text-3xl font-bold text-emerald-600 mb-1">4.6/5</div>
                    <div className="text-sm font-medium text-gray-600">Average Rating</div>
                    <p className="text-xs text-gray-500">Based on 47 completed projects</p>
                </div>
                <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">15</div>
                    <div className="text-sm font-medium text-gray-600">Risk Score</div>
                    <p className="text-xs text-gray-500">Low risk vendor status</p>
                </div>
                <div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">92%</div>
                    <div className="text-sm font-medium text-gray-600">On-time Delivery</div>
                    <p className="text-xs text-gray-500">Excellent compliance record</p>
                </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
