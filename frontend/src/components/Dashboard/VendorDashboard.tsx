import React, { useState } from 'react';
import { Upload, FileText, DollarSign, Clock, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';
import { mockClaims, calculateFraudScore, getRiskLevel } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { PDFReader } from '../common/PDFReader';
import { useContract } from '../../hooks/useContracts';
function VendorDashboardLegacy() {
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [supplierPayment, setSupplierPayment] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null);
  const { showToast } = useToast();
  // Add missing wallet hooks/state for legacy component
  const { getCkUSDCBalance, transferCkUSDC } = useContract()
  const [ckBalance, setCkBalance] = useState<string>('—')
  const [walletRecipient, setWalletRecipient] = useState('')
  const [walletAmount, setWalletAmount] = useState('')
  const [walletBusy, setWalletBusy] = useState(false)

  const handleRefreshBalance = async () => {
    try {
      setWalletBusy(true)
      const res = await getCkUSDCBalance()
      if (res) {
        setCkBalance(res.formatted)
        showToast('Balance refreshed', 'success')
      } else {
        showToast('Failed to fetch ckUSDC balance', 'error')
      }
    } catch (e) {
      showToast('Failed to fetch ckUSDC balance', 'error')
    } finally {
      setWalletBusy(false)
    }
  }

  const handleTransferCkUSDC = async () => {
    if (!walletRecipient || !walletAmount) {
      showToast('Please enter recipient principal and amount', 'warning')
      return
    }
    try {
      setWalletBusy(true)
      const tx = await transferCkUSDC(walletRecipient, walletAmount)
      if (tx !== null) {
        showToast(`Transfer submitted (Tx: ${String(tx)})`, 'success')
        await handleRefreshBalance()
        setWalletAmount('')
        setWalletRecipient('')
      } else {
        showToast('Transfer failed', 'error')
      }
    } catch (e) {
      showToast('Transfer failed', 'error')
    } finally {
      setWalletBusy(false)
    }
  }

  const handleFileSelect = (file: File, content: string) => {
    setUploadedDocument(content);
    showToast(`Document "${file.name}" uploaded and analyzed`, 'success');
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

  const vendorClaims = mockClaims.filter(claim => claim.vendorId === 'vendor-001');
  const totalEarnings = vendorClaims
    .filter(claim => claim.status === 'approved')
    .reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
              <p className="text-purple-200 text-lg">
                Manage your government contracts and submit payment claims
              </p>
            </div>
            <div className="text-6xl opacity-20">🏗️</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Contracts</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
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
                <p className="text-slate-600 text-sm font-medium">Pending Claims</p>
                <p className="text-2xl font-bold text-amber-600">2</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Risk Score</p>
                <p className="text-2xl font-bold text-blue-600">15</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Claim Submission */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="h-6 w-6 text-purple-600" />
                <span>Submit New Claim</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Claim Amount ($)
                </label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter claim amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Description
                </label>
                <textarea
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the completed work..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Invoice & Supporting Documents
                </label>
                <PDFReader onFileSelect={handleFileSelect} />
                {uploadedDocument && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Document uploaded and AI-analyzed
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitClaim}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Submit Claim
              </button>
            </div>
          </div>

          {/* Supply Chain Management */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                <span>Pay Sub-Suppliers</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  value={supplierPayment}
                  onChange={(e) => setSupplierPayment(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter payment amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Supplier Wallet Address
                </label>
                <input
                  type="text"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter ICP principal ID..."
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Payment Verification</h4>
                    <p className="text-sm text-amber-700">
                      All supplier payments are recorded on the blockchain for transparency and audit purposes
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePaySupplier}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>

        {/* My Claims */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">My Claims History</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Claim ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{claim.id}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{claim.description}</td>
                      <td className="py-3 px-4 font-semibold">${claim.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          claim.status === 'under-review' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {claim.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          claim.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {claim.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {claim.submittedAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Wallet - ckUSDC */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-indigo-600" />
              <span>Wallet (ckUSDC)</span>
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Current Balance</p>
                <p className="text-2xl font-bold text-indigo-600">{ckBalance}</p>
              </div>
              <button
                onClick={handleRefreshBalance}
                disabled={walletBusy}
                className="px-4 py-2 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {walletBusy ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient Principal</label>
                <input
                  type="text"
                  value={walletRecipient}
                  onChange={(e) => setWalletRecipient(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  placeholder="aaaaa-aa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (ckUSDC)</label>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>

            <button
              onClick={handleTransferCkUSDC}
              disabled={walletBusy}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-60"
            >
              {walletBusy ? 'Transferring…' : 'Send ckUSDC'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VendorDashboard() {
  const [claimAmount, setClaimAmount] = useState('')
  const [claimDescription, setClaimDescription] = useState('')
  const [supplierPayment, setSupplierPayment] = useState('')
  const [supplierAddress, setSupplierAddress] = useState('')
  const [uploadedDocument, setUploadedDocument] = useState<string | null>(null)
  const { showToast } = useToast()
  const { getCkUSDCBalance, transferCkUSDC } = useContract()
  const [ckBalance, setCkBalance] = useState<string>('—')
  const [walletRecipient, setWalletRecipient] = useState('')
  const [walletAmount, setWalletAmount] = useState('')
  const [walletBusy, setWalletBusy] = useState(false)

  const handleFileSelect = (file: File, content: string) => {
    setUploadedDocument(content)
    showToast(`Document "${file.name}" uploaded and analyzed`, 'success')
  }

  const handleRefreshBalance = async () => {
    try {
      setWalletBusy(true)
      const res = await getCkUSDCBalance()
      if (res) {
        setCkBalance(res.formatted)
        showToast('Balance refreshed', 'success')
      } else {
        showToast('Failed to fetch ckUSDC balance', 'error')
      }
    } catch (e) {
      showToast('Failed to fetch ckUSDC balance', 'error')
    } finally {
      setWalletBusy(false)
    }
  }

  const handleTransferCkUSDC = async () => {
    if (!walletRecipient || !walletAmount) {
      showToast('Please enter recipient principal and amount', 'warning')
      return
    }
    try {
      setWalletBusy(true)
      const tx = await transferCkUSDC(walletRecipient, walletAmount)
      if (tx !== null) {
        showToast(`Transfer submitted (Tx: ${String(tx)})`, 'success')
        await handleRefreshBalance()
        setWalletAmount('')
        setWalletRecipient('')
      } else {
        showToast('Transfer failed', 'error')
      }
    } catch (e) {
      showToast('Transfer failed', 'error')
    } finally {
      setWalletBusy(false)
    }
  }

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

  const vendorClaims = mockClaims.filter(claim => claim.vendorId === 'vendor-001');
  const totalEarnings = vendorClaims
    .filter(claim => claim.status === 'approved')
    .reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
              <p className="text-purple-200 text-lg">
                Manage your government contracts and submit payment claims
              </p>
            </div>
            <div className="text-6xl opacity-20">🏗️</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Contracts</p>
                <p className="text-2xl font-bold text-purple-600">5</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <FileText className="h-6 w-6 text-purple-600" />
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
                <p className="text-slate-600 text-sm font-medium">Pending Claims</p>
                <p className="text-2xl font-bold text-amber-600">2</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Risk Score</p>
                <p className="text-2xl font-bold text-blue-600">15</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Claim Submission */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Upload className="h-6 w-6 text-purple-600" />
                <span>Submit New Claim</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Claim Amount ($)
                </label>
                <input
                  type="number"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter claim amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Description
                </label>
                <textarea
                  value={claimDescription}
                  onChange={(e) => setClaimDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe the completed work..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Invoice & Supporting Documents
                </label>
                <PDFReader onFileSelect={handleFileSelect} />
                {uploadedDocument && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Document uploaded and AI-analyzed
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSubmitClaim}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Submit Claim
              </button>
            </div>
          </div>

          {/* Supply Chain Management */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                <span>Pay Sub-Suppliers</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  value={supplierPayment}
                  onChange={(e) => setSupplierPayment(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter payment amount..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Supplier Wallet Address
                </label>
                <input
                  type="text"
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm"
                  placeholder="Enter ICP principal ID..."
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Payment Verification</h4>
                    <p className="text-sm text-amber-700">
                      All supplier payments are recorded on the blockchain for transparency and audit purposes
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePaySupplier}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>

        {/* My Claims */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">My Claims History</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Claim ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Risk Level</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-sm">{claim.id}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{claim.description}</td>
                      <td className="py-3 px-4 font-semibold">${claim.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          claim.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          claim.status === 'under-review' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {claim.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          claim.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {claim.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {claim.submittedAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Performance & Compliance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.6/5</div>
              <div className="text-slate-600 font-medium">Average Rating</div>
              <div className="text-sm text-slate-500">Based on 47 completed projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-slate-600 font-medium">Risk Score</div>
              <div className="text-sm text-slate-500">Low risk vendor status</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-slate-600 font-medium">On-time Delivery</div>
              <div className="text-sm text-slate-500">Excellent compliance record</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}