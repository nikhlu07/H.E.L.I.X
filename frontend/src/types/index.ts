export interface User {
  id: string;
  name: string;
  role: UserRole;
  principal?: string;
  avatar?: string;
  region?: string;
  department?: string;
}

export type UserRole = 'main-government' | 'state-head' | 'deputy' | 'vendor' | 'sub-supplier' | 'citizen';

export interface Claim {
  id: string;
  budgetId: string;
  allocationId?: string;
  vendorId: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review' | 'blocked';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  fraudScore: number;
  submittedAt: Date;
  submittedBy: string;
  documents: string[];
  reviewNotes?: string;
}

export interface Budget {
  id: string;
  totalAmount: number;
  allocatedAmount: number;
  remainingAmount: number;
  purpose: string;
  createdBy: string;
  createdAt: Date;
  status: 'active' | 'locked' | 'completed';
}

export interface Allocation {
  id: string;
  budgetId: string;
  amount: number;
  area: string;
  deputyId: string;
  allocatedBy: string;
  allocatedAt: Date;
  status: 'pending' | 'approved' | 'active' | 'completed';
}

export interface Vendor {
  id: string;
  name: string;
  principal: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  registrationDate: Date;
  completedProjects: number;
  averageRating: number;
  riskScore: number;
  address: string;
  contactEmail: string;
  businessType: string;
}

export interface Challenge {
  id: string;
  invoiceHash: string;
  challengerId: string;
  reason: string;
  evidence: string[];
  stakeAmount: number;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  createdAt: Date;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface CorruptionAlert {
  id: string;
  type: 'phantom-project' | 'price-inflation' | 'shell-company' | 'bid-rigging' | 'supply-chain-fraud' | 'timeline-manipulation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  amount: number;
  description: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'blocked';
}

export interface Statistics {
  corruptionPrevented: number;
  contractsAnalyzed: number;
  detectionAccuracy: number;
  taxpayerMoneySaved: number;
  activeInvestigations: number;
  governmentAgencies: number;
}