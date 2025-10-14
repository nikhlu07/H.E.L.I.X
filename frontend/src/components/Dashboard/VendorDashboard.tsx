import React, { useState, useRef } from 'react';
import { Upload, DollarSign, Clock, CheckCircle, AlertTriangle, Building, Truck, Wallet, Eye } from 'lucide-react';
import { mockClaims, calculateFraudScore, getRiskLevel } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { PDFReader } from '../common/PDFReader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useContract } from '../../hooks/useContracts';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

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
    <section
        className="py-16 px-4 bg-white w-full relative min-h-screen flex items-start"
        ref={dashboardRef}
    >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#0000001a_1px,transparent_1px),linear-gradient(to_bottom,#0000001a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_40%_50%_at_50%_50%,#000_70%,transparent_110%)]"></div>
        <main className="max-w-7xl mx-auto w-full z-10">
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
                      Vendor Dashboard
                  </VerticalCutReveal>
              </h1>
              <TimelineContent
                  as="p"
                  animationNum={0}
                  timelineRef={dashboardRef}
                  customVariants={revealVariants}
                  className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                  Manage your contracts, claims, and project deliverables with full transparency and efficiency.
              </TimelineContent>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                      <CardTitle className="text-xl font-bold">Vendor Overview</CardTitle>
                      <CardDescription>Your real-time performance and financial snapshot.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                          <DollarSign className="h-6 w-6 text-gray-500 mb-2" />
                          <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                          <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col p-4 bg-gray-50 rounded-lg">
                          <Truck className="h-6 w-6 text-gray-500 mb-2" />
                          <p className="text-sm font-medium text-gray-600">Active Projects</p>
                          <p className="text-2xl font-bold text-gray-900">5</p>
                      </div>
                      <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                          <Clock className="h-6 w-6 text-yellow-600 mb-2" />
                          <p className="text-sm font-medium text-yellow-700">Pending Claims</p>
                          <p className="text-2xl font-bold text-yellow-800">{pendingClaimsCount}</p>
                      </div>
                      <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                          <p className="text-sm font-medium text-green-700">Risk Score</p>
                          <p className="text-2xl font-bold text-green-800">15</p>
                      </div>
                  </CardContent>
                </Card>
              </TimelineContent>

              <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Submit New Claim</CardTitle>
                    <CardDescription>Fill out the form to submit a new payment claim.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Claim Amount ($)</label>
                        <input
                          type="number"
                          value={claimAmount}
                          onChange={(e) => setClaimAmount(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="e.g., 5000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Upload Invoice</label>
                        <PDFReader onFileSelect={handleFileSelect} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Work Description</label>
                      <textarea
                        value={claimDescription}
                        onChange={(e) => setClaimDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        rows={3}
                        placeholder="Describe the work completed for this claim..."
                      />
                    </div>
                    <Button
                      onClick={handleSubmitClaim}
                      className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Claim for Review
                    </Button>
                  </CardContent>
                </Card>
              </TimelineContent>

              <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">My Claims History</CardTitle>
                    <CardDescription>Track the status of all your submitted claims.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claim ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vendorClaims.map((claim) => (
                          <TableRow key={claim.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-mono text-xs">{claim.id.substring(0, 15)}...</TableCell>
                            <TableCell className="font-medium">${claim.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                                claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                                'bg-green-100 text-green-800'
                              }`}>{claim.riskLevel}</span>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                                claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>{claim.status}</span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                                    <Eye className="mr-1 h-4 w-4" /> Details
                                </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TimelineContent>
            </div>

            <div className="space-y-8">
              <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center"><Wallet className="mr-2 h-6 w-6" />Wallet (ckUSDC)</CardTitle>
                    <CardDescription>Manage and transfer your ckUSDC funds.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
                          <div>
                              <p className="text-sm font-medium text-gray-600">Balance</p>
                              <p className="text-2xl font-bold text-gray-900">{ckBalance}</p>
                          </div>
                          <Button
                              onClick={handleRefreshBalance}
                              disabled={walletBusy}
                              className="p-2 h-auto bg-gray-800 text-white hover:bg-black text-xs"
                          >
                              {walletBusy ? '...' : 'Refresh'}
                          </Button>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Recipient Principal</label>
                          <input
                              type="text"
                              value={walletRecipient}
                              onChange={(e) => setWalletRecipient(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                              placeholder="aaaaa-aa"
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Amount (ckUSDC)</label>
                          <input
                              type="number"
                              value={walletAmount}
                              onChange={(e) => setWalletAmount(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                              placeholder="0.00"
                          />
                      </div>
                      <Button
                          onClick={handleTransferCkUSDC}
                          disabled={walletBusy}
                          className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                      >
                          {walletBusy ? 'Transferring…' : 'Send ckUSDC'}
                      </Button>
                  </CardContent>
                </Card>
              </TimelineContent>

              <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center"><Building className="mr-2 h-6 w-6" />Pay Sub-Suppliers</CardTitle>
                    <CardDescription>Send payments to your suppliers and subcontractors.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Payment Amount ($)</label>
                      <input
                          type="number"
                          value={supplierPayment}
                          onChange={(e) => setSupplierPayment(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Enter payment amount..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Supplier Wallet Address</label>
                      <input
                          type="text"
                          value={supplierAddress}
                          onChange={(e) => setSupplierAddress(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono text-sm"
                          placeholder="Enter ICP principal ID..."
                      />
                    </div>
                    <Button
                        onClick={handlePaySupplier}
                        className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                    >
                        Process Payment
                    </Button>
                  </CardContent>
                </Card>
              </TimelineContent>
            </div>
          </div>
        </main>
    </section>
  );
}
