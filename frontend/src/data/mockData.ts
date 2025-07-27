import { Statistics, CorruptionAlert, Claim, Budget, Vendor, Challenge } from '../types';

export const statistics: Statistics = {
  corruptionPrevented: 2500000,
  contractsAnalyzed: 1247,
  detectionAccuracy: 85,
  taxpayerMoneySaved: 890000,
  activeInvestigations: 23,
  governmentAgencies: 12
};

export const corruptionAlerts: CorruptionAlert[] = [
  {
    id: 'alert-001',
    type: 'shell-company',
    severity: 'critical',
    amount: 2000000,
    description: '$2M road contract blocked - Shell company detected',
    location: 'Maharashtra',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    status: 'blocked'
  },
  {
    id: 'alert-002',
    type: 'price-inflation',
    severity: 'high',
    amount: 850000,
    description: '$850K school supplies flagged - 40% price inflation',
    location: 'Karnataka',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    status: 'investigating'
  },
  {
    id: 'alert-003',
    type: 'phantom-project',
    severity: 'high',
    amount: 1500000,
    description: '$1.5M hospital equipment - Citizen challenge filed',
    location: 'Tamil Nadu',
    timestamp: new Date(Date.now() - 1000 * 60 * 18),
    status: 'investigating'
  },
  {
    id: 'alert-004',
    type: 'bid-rigging',
    severity: 'low',
    amount: 45000,
    description: '$45K IT purchase approved - All integrity checks passed',
    location: 'Delhi',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    status: 'resolved'
  },
  {
    id: 'alert-005',
    type: 'bid-rigging',
    severity: 'critical',
    amount: 3000000,
    description: '$3M bridge project - Bid rigging pattern detected',
    location: 'Gujarat',
    timestamp: new Date(Date.now() - 1000 * 60 * 32),
    status: 'blocked'
  },
  {
    id: 'alert-006',
    type: 'shell-company',
    severity: 'medium',
    amount: 120000,
    description: '$120K office supplies - Phantom vendor identified',
    location: 'Rajasthan',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    status: 'investigating'
  }
];

export const fraudPatterns = [
  {
    id: 'phantom-projects',
    title: 'Phantom Projects',
    description: 'Projects claimed complete but don\'t exist physically',
    icon: '👻',
    riskLevel: 'critical',
    cases: 45,
    prevented: '$12.5M'
  },
  {
    id: 'price-inflation',
    title: 'Price Inflation',
    description: 'Costs 40%+ above market rate with kickback patterns',
    icon: '📈',
    riskLevel: 'high',
    cases: 89,
    prevented: '$8.9M'
  },
  {
    id: 'shell-companies',
    title: 'Shell Companies',
    description: 'Fake vendors with no business history or real address',
    icon: '🏢',
    riskLevel: 'critical',
    cases: 67,
    prevented: '$15.2M'
  },
  {
    id: 'bid-rigging',
    title: 'Bid Rigging',
    description: 'Coordinated fake competition between colluding vendors',
    icon: '🎯',
    riskLevel: 'high',
    cases: 34,
    prevented: '$6.7M'
  },
  {
    id: 'supply-chain-fraud',
    title: 'Supply Chain Fraud',
    description: 'Payments to non-existent sub-contractors',
    icon: '🔗',
    riskLevel: 'medium',
    cases: 123,
    prevented: '$4.8M'
  },
  {
    id: 'timeline-manipulation',
    title: 'Timeline Manipulation',
    description: 'Claiming completion before actual work delivery',
    icon: '⏰',
    riskLevel: 'medium',
    cases: 76,
    prevented: '$3.1M'
  }
];

export const successStories = [
  {
    id: 'case-001',
    title: 'Ghost Highway Project',
    amount: 1200000,
    description: 'Vendor claimed road construction completion. Citizens reported no road exists. CorruptGuard investigation confirmed fraud.',
    status: 'prevented',
    location: 'Maharashtra',
    method: 'citizen-reporting'
  },
  {
    id: 'case-002',
    title: 'Inflated Medical Supplies',
    amount: 340000,
    description: 'School supplies quoted 60% above market rate. AI detected price manipulation pattern.',
    status: 'prevented',
    location: 'Karnataka',
    method: 'ai-detection'
  },
  {
    id: 'case-003',
    title: 'Phantom Sub-Contractor Scheme',
    amount: 890000,
    description: 'Main contractor claimed payments to 5 sub-contractors. Blockchain analysis revealed 3 were shell companies.',
    status: 'prevented',
    location: 'Tamil Nadu',
    method: 'blockchain-analysis'
  }
];

export const mockClaims: Claim[] = [
  {
    id: 'claim-001',
    budgetId: 'budget-001',
    vendorId: 'vendor-001',
    amount: 45000,
    description: 'Office supplies and furniture for government building',
    status: 'approved',
    riskLevel: 'low',
    fraudScore: 25,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    submittedBy: 'vendor-001',
    documents: ['invoice-001.pdf', 'delivery-receipt-001.pdf']
  },
  {
    id: 'claim-002',
    budgetId: 'budget-002',
    vendorId: 'vendor-002',
    amount: 2000000,
    description: 'Road construction project Phase 1',
    status: 'blocked',
    riskLevel: 'critical',
    fraudScore: 85,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    submittedBy: 'vendor-002',
    documents: ['contract-002.pdf'],
    reviewNotes: 'Shell company detected - no physical address verification'
  },
  {
    id: 'claim-003',
    budgetId: 'budget-003',
    vendorId: 'vendor-003',
    amount: 500000,
    description: 'School building renovation and equipment',
    status: 'under-review',
    riskLevel: 'medium',
    fraudScore: 45,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    submittedBy: 'vendor-003',
    documents: ['proposal-003.pdf', 'budget-breakdown-003.xlsx']
  }
];

export const mockBudgets: Budget[] = [
  {
    id: 'budget-001',
    totalAmount: 50000000,
    allocatedAmount: 35000000,
    remainingAmount: 15000000,
    purpose: 'Infrastructure Development 2024',
    createdBy: 'gov-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    status: 'active'
  },
  {
    id: 'budget-002',
    totalAmount: 25000000,
    allocatedAmount: 18000000,
    remainingAmount: 7000000,
    purpose: 'Education Modernization Program',
    createdBy: 'gov-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
    status: 'active'
  }
];

export const mockVendors: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'TechBuild Construction Ltd',
    principal: 'rujvh-nqaaa-aaaah-qcq3c-cai',
    status: 'approved',
    registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    completedProjects: 47,
    averageRating: 4.6,
    riskScore: 15,
    address: '123 Industrial Area, Mumbai',
    contactEmail: 'contracts@techbuild.com',
    businessType: 'Construction'
  },
  {
    id: 'vendor-002',
    name: 'QuickBuild Solutions',
    principal: 'shell-company-001',
    status: 'suspended',
    registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    completedProjects: 0,
    averageRating: 0,
    riskScore: 95,
    address: 'No physical address found',
    contactEmail: 'fake@quickbuild.fake',
    businessType: 'Unknown'
  },
  {
    id: 'vendor-003',
    name: 'EduTech Supplies Co',
    principal: 'ret45-hqaaa-aaaah-qcq3f-cai',
    status: 'approved',
    registrationDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    completedProjects: 23,
    averageRating: 4.2,
    riskScore: 28,
    address: '456 Business Park, Bangalore',
    contactEmail: 'orders@edutech.com',
    businessType: 'Educational Equipment'
  }
];

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge-001',
    invoiceHash: '0xabc123def456',
    challengerId: 'citizen-001',
    reason: 'Project claimed complete but road does not exist at specified location',
    evidence: ['photo-001.jpg', 'gps-coordinates.txt'],
    stakeAmount: 100,
    status: 'investigating',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Claimed Highway Extension, Mumbai'
    }
  },
  {
    id: 'challenge-002',
    invoiceHash: '0xdef789ghi012',
    challengerId: 'citizen-002',
    reason: 'School equipment never delivered despite payment completion',
    evidence: ['school-visit-video.mp4', 'principal-statement.pdf'],
    stakeAmount: 50,
    status: 'resolved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: 'Government Primary School, Bangalore'
    }
  }
];

export function calculateFraudScore(claim: Claim): number {
  let score = 10; // Base score
  
  // Amount-based scoring
  if (claim.amount > 1000000) score += 40;
  if (claim.amount.toString().endsWith('00000')) score += 30;
  if (claim.amount % 100000 === 0) score += 20;
  
  // Vendor-based scoring
  const vendor = mockVendors.find(v => v.id === claim.vendorId);
  if (!vendor || vendor.completedProjects === 0) score += 25;
  
  // Time-based scoring
  const submitHour = claim.submittedAt.getHours();
  if (submitHour < 9 || submitHour > 17) score += 15;
  
  // Pattern-based scoring
  const vendorClaims = mockClaims.filter(c => c.vendorId === claim.vendorId);
  if (vendorClaims.length > 3) score += 10;
  
  // Add random variance for demo
  score += Math.floor(Math.random() * 20);
  
  return Math.min(score, 100);
}

export function getRiskLevel(fraudScore: number): 'low' | 'medium' | 'high' | 'critical' {
  if (fraudScore < 30) return 'low';
  if (fraudScore < 60) return 'medium';
  if (fraudScore < 80) return 'high';
  return 'critical';
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'low': return 'text-emerald-600 bg-emerald-50';
    case 'medium': return 'text-amber-600 bg-amber-50';
    case 'high': return 'text-orange-600 bg-orange-50';
    case 'critical': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function getRiskIcon(riskLevel: string): string {
  switch (riskLevel) {
    case 'low': return '✅';
    case 'medium': return '⚠️';
    case 'high': return '🚨';
    case 'critical': return '🔴';
    default: return '❓';
  }
}