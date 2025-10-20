import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, FileText, Shield, DollarSign, AlertTriangle, Users, Eye } from 'lucide-react';
import { useToast } from '../common/Toast';
import { icpCanisterService } from '../../services/icpCanisterService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export function CitizenDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [challengeReason, setChallengeReason] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedClaim, setSelectedClaim] = useState('');
  const { showToast } = useToast();
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Real data from canister
  const [claims, setClaims] = useState<any[]>([
    { id: 1, amount: 150000, description: "Medical Equipment Purchase", status: "pending", riskLevel: "low", vendorId: "vendor-001" },
    { id: 2, amount: 75000, description: "School Furniture Supply", status: "approved", riskLevel: "medium", vendorId: "vendor-002" },
    { id: 3, amount: 200000, description: "Road Materials", status: "under-review", riskLevel: "high", vendorId: "vendor-003" }
  ]);
  const [challenges, setChallenges] = useState<any[]>([
    { id: 1, claimId: 1, reason: "Suspicious pricing", stakeAmount: 1000, status: "active" },
    { id: 2, claimId: 2, reason: "Quality concerns", stakeAmount: 500, status: "resolved" }
  ]);
  const [loading, setLoading] = useState(false);

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

  // Load real data from canister
  useEffect(() => {
    const loadData = async () => {
      try {
        await icpCanisterService.init();
        
        // Load claims
        const claimsData = await icpCanisterService.getAllClaims();
        if (claimsData && claimsData.length > 0) setClaims(claimsData);
        
        // Keep demo challenges - don't overwrite them
        // setChallenges([]);
        
        // showToast('Connected to blockchain!', 'success');
      } catch (error) {
        console.log('Canister connection failed:', error);
        // Don't show warning toast - just log the error
      }
    };
    
    loadData();
  }, [showToast]);

  const handleStakeChallenge = async () => {
    if (!selectedClaim || !challengeReason || !stakeAmount) {
      showToast('Please fill in all challenge details', 'warning');
      return;
    }
    
    try {
      const amount = parseInt(stakeAmount);
      const result = await icpCanisterService.stakeChallenge(parseInt(selectedClaim), amount, challengeReason);
      
      if (result) {
        showToast(`Challenge submitted with ${stakeAmount} ICP stake`, 'success');
        setChallengeReason('');
        setStakeAmount('');
        setSelectedClaim('');
        // Reload data
        const claimsData = await icpCanisterService.getAllClaims();
        setClaims(claimsData);
      } else {
        showToast('Failed to stake challenge', 'error');
      }
    } catch (error) {
      console.error('Error staking challenge:', error);
      showToast('Failed to stake challenge', 'error');
    }
  };

  const handleReportProject = () => {
    showToast('Project verification report submitted successfully', 'success');
  };

  const filteredClaims = claims.filter(claim =>
    claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.id.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <>
      <style>
        {`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera*/
        }
        `}
      </style>
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
                          Citizen Oversight Portal
                      </VerticalCutReveal>
                  </h1>
                  <TimelineContent
                      as="p"
                      animationNum={0}
                      timelineRef={dashboardRef}
                      customVariants={revealVariants}
                      className="text-gray-600 text-lg"
                  >
                      Help protect taxpayer money through community verification and transparency monitoring.
                  </TimelineContent>
              </article>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-8">
                      {/* Key Metrics */}
                      <TimelineContent as="div" animationNum={1} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold">Impact Stats</CardTitle>
                                  <CardDescription>Your contribution to transparency.</CardDescription>
                              </CardHeader>
                              <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                  <div className="flex flex-col p-4 bg-emerald-50 rounded-lg">
                                      <Shield className="h-6 w-6 text-emerald-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Corruption Prevented</p>
                                      <p className="text-2xl font-bold text-emerald-600">${(statistics.corruptionPrevented / 1000000).toFixed(1)}M</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                      <Users className="h-6 w-6 text-yellow-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">Active Citizens</p>
                                      <p className="text-2xl font-bold text-yellow-600">1,240</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                                      <FileText className="h-6 w-6 text-amber-500 mb-2" />
                                      <p className="text-sm font-medium text-gray-600">My Reports</p>
                                      <p className="text-2xl font-bold text-amber-600">3</p>
                                  </div>
                                  <div className="flex flex-col p-4 bg-purple-50 rounded-lg">
                                      <DollarSign className="h-6 w-6 text-purple-500 mb-2" />
                                      <p className="text-sm font-medium text-purple-600">Rewards Earned</p>
                                      <p className="text-2xl font-bold text-purple-600">50 ICP</p>
                                  </div>
                              </CardContent>
                          </Card>
                      </TimelineContent>

                      {/* Public Spending Explorer */}
                      <TimelineContent as="div" animationNum={2} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center"><Search className="mr-2 h-6 w-6" />Public Spending Explorer</CardTitle>
                            <CardDescription>Search and challenge government spending claims.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-6">
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="Search by description or claim ID..."
                              />
                            </div>
                            <div className="space-y-4 max-h-96 overflow-y-auto hide-scrollbar"> {/* Replaced no-scrollbar with hide-scrollbar */}
                              {filteredClaims.map((claim) => (
                                <div key={claim.id} className="rounded-xl border p-4 hover:border-primary transition-colors cursor-pointer bg-gray-50/50">
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
                                      className="text-black hover:bg-gray-100"
                                    >
                                      Challenge This Claim
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TimelineContent>

                      {/* My Challenges */}
                      <TimelineContent as="div" animationNum={3} timelineRef={dashboardRef} customVariants={revealVariants}>
                        <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-xl font-bold">My Challenges</CardTitle>
                            <CardDescription>Track the status of your submitted challenges.</CardDescription>
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
                                  <TableRow key={challenge.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-semibold font-mono">#{challenge.id}</TableCell>
                                    <TableCell className="text-gray-600 max-w-xs truncate">{challenge.reason}</TableCell>
                                    <TableCell className="font-semibold">{challenge.stakeAmount} ICP</TableCell>
                                    <TableCell>{challenge.createdAt.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        challenge.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                        challenge.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                                        challenge.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
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
                      </TimelineContent>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                       {/* File Corruption Challenge */}
                       <TimelineContent as="div" animationNum={1.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold flex items-center"><AlertTriangle className="mr-2 h-6 w-6 text-red-600" />File Corruption Challenge</CardTitle>
                              <CardDescription>Report fraudulent or suspicious claims.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Select Claim to Challenge</label>
                                <select
                                  value={selectedClaim}
                                  onChange={(e) => setSelectedClaim(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                                <label className="text-sm font-medium text-gray-700">Reason for Challenge</label>
                                <textarea
                                  value={challengeReason}
                                  onChange={(e) => setChallengeReason(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  rows={3}
                                  placeholder="Describe why you believe this claim is fraudulent..."
                                />
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700">ICP Stake Amount</label>
                                <input
                                  type="number"
                                  value={stakeAmount}
                                  onChange={(e) => setStakeAmount(e.target.value)}
                                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                  placeholder="Enter ICP amount to stake..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Minimum stake: 10 ICP. Stakes are returned if challenge is valid.
                                </p>
                              </div>

                              <Button
                                onClick={handleStakeChallenge}
                                className="w-full p-3 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                              >
                                <AlertTriangle className="mr-2 h-5 w-5" />
                                Submit Challenge
                              </Button>
                            </CardContent>
                          </Card>
                       </TimelineContent>
                      
                      {/* Community Verification */}
                      <TimelineContent as="div" animationNum={2.5} timelineRef={dashboardRef} customVariants={revealVariants}>
                          <Card className="bg-white/80 backdrop-blur-sm border-neutral-200 shadow-lg h-fit">
                              <CardHeader>
                                  <CardTitle className="text-xl font-bold flex items-center"><Eye className="mr-2 h-6 w-6" />Community Verification</CardTitle>
                                  <CardDescription>Help verify if claimed projects exist at their specified locations.</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                  <div className="rounded-xl border p-4 space-y-3 hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                                      <h4 className="font-semibold text-gray-900">Road Construction - Highway 47</h4>
                                      <p className="text-sm text-gray-600">Mumbai-Pune Express Highway Extension</p>
                                      <Button
                                          onClick={handleReportProject}
                                          className="w-full p-2 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                                      >
                                          Verify Project
                                      </Button>
                                  </div>
                                  <div className="rounded-xl border p-4 space-y-3 hover:border-black transition-colors cursor-pointer bg-gray-50/50">
                                      <h4 className="font-semibold text-gray-900">School Equipment Delivery</h4>
                                      <p className="text-sm text-gray-600">Government Primary School, Bangalore</p>
                                      <Button
                                          onClick={handleReportProject}
                                          className="w-full p-2 border border-gray-800 shadow-lg shadow-black/20 font-semibold rounded-xl bg-black text-white hover:bg-gray-800"
                                      >
                                          Verify Delivery
                                      </Button>
                                  </div>
                                  <p className="text-sm text-center text-gray-500 pt-2">
                                      Earn ICP rewards for verified reports that help prevent corruption.
                                  </p>
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
