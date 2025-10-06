import React, { useState } from 'react';
import { Search, MapPin, Camera, FileText, Shield, DollarSign, AlertTriangle, Users, Eye, ChevronDown } from 'lucide-react';
import { mockClaims, mockChallenges, statistics } from '../../data/mockData';
import { useToast } from '../common/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function CitizenDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [challengeReason, setChallengeReason] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedClaim, setSelectedClaim] = useState('');
  const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);
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

  const toggleChallengeExpansion = (challengeId: string) => {
    setExpandedChallengeId(prevId => (prevId === challengeId ? null : challengeId));
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
              <Users className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 md:text-6xl">
              Citizen Oversight Portal
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Help protect taxpayer money through community verification and transparency monitoring.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Corruption Prevented</CardTitle>
                <Shield className="h-5 w-5 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">${(statistics.corruptionPrevented / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-gray-500">Value of funds protected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Citizens</CardTitle>
                <Users className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">1,240</div>
                <p className="text-xs text-gray-500">Community members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">My Reports</CardTitle>
                <FileText className="h-5 w-5 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">3</div>
                <p className="text-xs text-gray-500">Challenges & Verifications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rewards Earned</CardTitle>
                <DollarSign className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">50 ICP</div>
                <p className="text-xs text-gray-500">For successful reports</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Public Spending Explorer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center"><Search className="mr-2 h-6 w-6 text-yellow-600" />Public Spending Explorer</CardTitle>
                <p className="text-gray-600">Search and challenge government spending claims.</p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Search by description or claim ID..."
                  />
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredClaims.map((claim) => (
                    <div key={claim.id} className="rounded-xl border p-4 hover:border-yellow-500 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{claim.description}</h3>
                          <p className="text-sm text-gray-600 font-mono">ID: {claim.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">${claim.amount.toLocaleString()}</div>
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
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Submitted: {claim.submittedAt.toLocaleDateString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClaim(claim.id)}
                          className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                        >
                          Challenge This Claim
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* File Corruption Challenge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />File Corruption Challenge</CardTitle>
                <p className="text-gray-600">Report fraudulent or suspicious claims.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Claim to Challenge
                  </label>
                  <select
                    value={selectedClaim}
                    onChange={(e) => setSelectedClaim(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Challenge
                  </label>
                  <textarea
                    value={challengeReason}
                    onChange={(e) => setChallengeReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe why you believe this claim is fraudulent..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ICP Stake Amount
                  </label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter ICP amount to stake..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum stake: 10 ICP. Stakes are returned if challenge is valid.
                  </p>
                </div>

                <Button
                  onClick={handleStakeChallenge}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
                  size="lg"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Submit Challenge
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* My Challenges */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold">My Challenges</CardTitle>
              <p className="text-gray-600">Track the status of your submitted challenges.</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challenge ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Stake</TableHead>
                    <TableHead>Filed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockChallenges.map((challenge) => (
                    <TableRow key={challenge.id} className="table-row-hover">
                      <TableCell className="font-semibold font-mono">#{challenge.id}</TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">{challenge.reason}</TableCell>
                      <TableCell className="font-semibold">{challenge.stakeAmount} ICP</TableCell>
                      <TableCell>{challenge.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          challenge.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                          challenge.status === 'investigating' ? 'bg-amber-100 text-amber-800' :
                          challenge.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {challenge.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {challenge.location?.address}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Community Verification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center"><Eye className="mr-2 h-6 w-6 text-yellow-600" />Community Verification</CardTitle>
              <p className="text-gray-600">Help verify if claimed projects exist at their specified locations.</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border p-4 space-y-3 hover:border-yellow-500 transition-colors">
                        <h4 className="font-semibold text-gray-900">Road Construction - Highway 47</h4>
                        <p className="text-sm text-gray-600">Mumbai-Pune Express Highway Extension</p>
                        <Button
                            onClick={handleReportProject}
                            className="w-full cta-gradient font-semibold"
                        >
                            Verify Project
                        </Button>
                    </div>
                    <div className="rounded-xl border p-4 space-y-3 hover:border-yellow-500 transition-colors">
                        <h4 className="font-semibold text-gray-900">School Equipment Delivery</h4>
                        <p className="text-sm text-gray-600">Government Primary School, Bangalore</p>
                        <Button
                            onClick={handleReportProject}
                            className="w-full cta-gradient font-semibold"
                        >
                            Verify Delivery
                        </Button>
                    </div>
                </div>
                <p className="text-sm text-center text-gray-500 mt-6">
                    Earn ICP rewards for verified reports that help prevent corruption.
                </p>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
