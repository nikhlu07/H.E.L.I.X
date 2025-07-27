import React, { useState } from 'react';
import { Search, MapPin, Camera, FileText, Shield, DollarSign, AlertTriangle, Users } from 'lucide-react';
import { mockClaims, mockChallenges, statistics } from '../../data/mockData';
import { useToast } from '../common/Toast';

export function CitizenDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [challengeReason, setChallengeReason] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedClaim, setSelectedClaim] = useState('');
  const { showToast } = useToast();

  const handleStakeChallenge = () => {
    if (!selectedClaim || !challengeReason || !stakeAmount) {
      showToast('Please fill in all challenge details', 'warning');
      return;
    }
    showToast(`Challenge submitted with ${stakeAmount} ICP stake`, 'success');
    setChallengeReason('');
    setStakeAmount('');
    setSelectedClaim('');
  };

  const handleReportProject = () => {
    showToast('Project verification report submitted successfully', 'success');
  };

  const filteredClaims = mockClaims.filter(claim => 
    claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Citizen Oversight Portal</h1>
              <p className="text-slate-200 text-lg">
                Help protect taxpayer money through community verification and transparency monitoring
              </p>
            </div>
            <div className="text-6xl opacity-20">👩‍💻</div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Corruption Prevented</p>
                <p className="text-2xl font-bold text-emerald-600">${(statistics.corruptionPrevented / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Citizens</p>
                <p className="text-2xl font-bold text-blue-600">1,240</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">My Reports</p>
                <p className="text-2xl font-bold text-amber-600">3</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Rewards Earned</p>
                <p className="text-2xl font-bold text-purple-600">50 ICP</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Public Spending Explorer */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <Search className="h-6 w-6 text-blue-600" />
                <span>Public Spending Explorer</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search government spending..."
                />
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredClaims.map((claim) => (
                  <div key={claim.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{claim.description}</h3>
                        <p className="text-sm text-slate-600 font-mono">ID: {claim.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">${claim.amount.toLocaleString()}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          claim.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          claim.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          claim.riskLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {claim.riskLevel.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Submitted: {claim.submittedAt.toLocaleDateString()}</span>
                      <button
                        onClick={() => setSelectedClaim(claim.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Challenge This Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Corruption Reporting */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span>File Corruption Challenge</span>
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Claim to Challenge
                </label>
                <select
                  value={selectedClaim}
                  onChange={(e) => setSelectedClaim(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Choose a claim...</option>
                  {mockClaims.map((claim) => (
                    <option key={claim.id} value={claim.id}>
                      {claim.id} - ${claim.amount.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Challenge
                </label>
                <textarea
                  value={challengeReason}
                  onChange={(e) => setChallengeReason(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={4}
                  placeholder="Describe why you believe this claim is fraudulent..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ICP Stake Amount
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter ICP amount to stake..."
                />
                <p className="text-xs text-slate-500 mt-1">
                  Minimum stake: 10 ICP. Stakes are returned if challenge is valid.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Camera className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Evidence Upload</h4>
                    <p className="text-sm text-amber-700 mb-3">
                      Upload photos, documents, or other evidence to support your challenge
                    </p>
                    <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Choose Files
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStakeChallenge}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Submit Challenge
              </button>
            </div>
          </div>
        </div>

        {/* My Challenges */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="h-6 w-6 text-purple-600" />
              <span>My Challenges</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockChallenges.map((challenge) => (
                <div key={challenge.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">Challenge #{challenge.id}</h3>
                      <p className="text-sm text-slate-600">{challenge.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-purple-600">{challenge.stakeAmount} ICP</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                        challenge.status === 'investigating' ? 'bg-amber-100 text-amber-800' :
                        challenge.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {challenge.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{challenge.location?.address}</span>
                    </div>
                    <span>Filed: {challenge.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community Verification */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Community Verification Needed
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Help verify if these claimed projects actually exist at their specified locations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">Road Construction - Highway 47</h4>
                <p className="text-sm text-slate-600 mb-3">Mumbai-Pune Express Highway Extension</p>
                <button
                  onClick={handleReportProject}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Verify Project
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-2">School Equipment Delivery</h4>
                <p className="text-sm text-slate-600 mb-3">Government Primary School, Bangalore</p>
                <button
                  onClick={handleReportProject}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Verify Delivery
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Earn ICP rewards for verified reports that help prevent corruption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}