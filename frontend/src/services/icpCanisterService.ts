// frontend/src/services/icpCanisterService.ts - NEW
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { authService } from '../auth/authService';

// Define the IDL interface based on your Motoko contract
const idlFactory = ({ IDL }: any) => {
  const Budget = IDL.Record({
    amount: IDL.Nat,
    purpose: IDL.Text,
    locked: IDL.Bool,
    lockTime: IDL.Int,
  });

  const Allocation = IDL.Record({
    stateHead: IDL.Principal,
    amount: IDL.Nat,
    area: IDL.Text,
    deputy: IDL.Principal,
    assigned: IDL.Bool,
    vendorAssigned: IDL.Opt(IDL.Principal),
  });

  const Claim = IDL.Record({
    vendor: IDL.Principal,
    amount: IDL.Nat,
    invoiceHash: IDL.Text,
    deputy: IDL.Principal,
    aiApproved: IDL.Bool,
    flagged: IDL.Bool,
    paid: IDL.Bool,
    escrowTime: IDL.Int,
    totalPaidToSuppliers: IDL.Nat,
    fraudScore: IDL.Opt(IDL.Nat),
    challengeCount: IDL.Nat,
  });

  const FraudAlert = IDL.Record({
    claimId: IDL.Nat,
    alertType: IDL.Text,
    severity: IDL.Text,
    description: IDL.Text,
    timestamp: IDL.Int,
    resolved: IDL.Bool,
  });

  const Result = (T: any) => IDL.Variant({ ok: T, err: IDL.Text });

  return IDL.Service({
    // Government functions
    proposeStateHead: IDL.Func([IDL.Principal], [Result(IDL.Null)], []),
    confirmStateHead: IDL.Func([IDL.Principal], [Result(IDL.Null)], []),
    lockBudget: IDL.Func([IDL.Nat, IDL.Text], [Result(IDL.Nat)], []),
    allocateBudget: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text, IDL.Principal], [Result(IDL.Null)], []),
    
    // Vendor functions
    proposeVendor: IDL.Func([IDL.Principal], [Result(IDL.Null)], []),
    approveVendor: IDL.Func([IDL.Principal], [Result(IDL.Null)], []),
    submitClaim: IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat, IDL.Text], [Result(IDL.Nat)], []),
    
    // Fraud detection functions
    updateFraudScore: IDL.Func([IDL.Nat, IDL.Nat], [Result(IDL.Null)], []),
    approveClaimByAI: IDL.Func([IDL.Nat, IDL.Bool, IDL.Text], [Result(IDL.Null)], []),
    addFraudAlert: IDL.Func([IDL.Nat, IDL.Text, IDL.Text, IDL.Text], [Result(IDL.Null)], []),
    
    // Challenge system
    stakeChallenge: IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result(IDL.Null)], []),
    
    // Query functions
    getClaim: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Record({
      vendor: IDL.Principal,
      amount: IDL.Nat,
      invoiceHash: IDL.Text,
      paid: IDL.Bool,
      flagged: IDL.Bool,
      fraudScore: IDL.Opt(IDL.Nat),
      challengeCount: IDL.Nat,
      totalPaidToSuppliers: IDL.Nat,
    }))], ['query']),
    
    getAllClaims: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Record({
      vendor: IDL.Principal,
      amount: IDL.Nat,
      flagged: IDL.Bool,
      fraudScore: IDL.Opt(IDL.Nat),
      challengeCount: IDL.Nat,
    })))], ['query']),
    
    getHighRiskClaims: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))], ['query']),
    getFraudAlerts: IDL.Func([IDL.Nat], [IDL.Vec(FraudAlert)], ['query']),
    getBudgetTransparency: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Record({
      amount: IDL.Nat,
      purpose: IDL.Text,
      allocated: IDL.Nat,
      remaining: IDL.Nat,
    })))], ['query']),
    
    getSystemStats: IDL.Func([], [IDL.Record({
      totalBudget: IDL.Nat,
      activeClaims: IDL.Nat,
      flaggedClaims: IDL.Nat,
      totalChallenges: IDL.Nat,
      vendorCount: IDL.Nat,
    })], ['query']),
  });
};

// Types for better TypeScript support
export interface Budget {
  amount: bigint;
  purpose: string;
  locked: boolean;
  lockTime: bigint;
}

export interface Claim {
  vendor: Principal;
  amount: bigint;
  invoiceHash: string;
  deputy: Principal;
  aiApproved: boolean;
  flagged: boolean;
  paid: boolean;
  escrowTime: bigint;
  totalPaidToSuppliers: bigint;
  fraudScore?: bigint;
  challengeCount: bigint;
}

export interface ClaimSummary {
  vendor: Principal;
  amount: bigint;
  flagged: boolean;
  fraudScore?: bigint;
  challengeCount: bigint;
}

export interface FraudAlert {
  claimId: bigint;
  alertType: string;
  severity: string;
  description: string;
  timestamp: bigint;
  resolved: boolean;
}

export interface SystemStats {
  totalBudget: bigint;
  activeClaims: bigint;
  flaggedClaims: bigint;
  totalChallenges: bigint;
  vendorCount: bigint;
}

export interface BudgetTransparency {
  amount: bigint;
  purpose: string;
  allocated: bigint;
  remaining: bigint;
}

class ICPCanisterService {
  private actor: any = null;
  private agent: HttpAgent | null = null;
  private canisterId: string;

  constructor() {
    this.canisterId = process.env.REACT_APP_CANISTER_ID || 'rdmx6-jaaaa-aaaah-qcaiq-cai';
  }

  async init(): Promise<void> {
    try {
      const host = process.env.REACT_APP_IC_HOST || 'http://127.0.0.1:4943';
      
      this.agent = new HttpAgent({ host });
      
      // Only fetch root key in development
      if (process.env.NODE_ENV === 'development') {
        await this.agent.fetchRootKey();
      }

      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });

      console.log('ICP Canister service initialized');
    } catch (error) {
      console.error('Failed to initialize ICP canister service:', error);
      throw error;
    }
  }

  private async ensureActor(): Promise<void> {
    if (!this.actor) {
      await this.init();
    }
  }

  // Helper to handle Result types from Motoko
  private handleResult(result: any): any {
    if ('ok' in result) {
      return result.ok;
    } else if ('err' in result) {
      throw new Error(`Canister error: ${result.err}`);
    }
    return result;
  }

  // Government Functions
  async proposeStateHead(principal: string): Promise<void> {
    await this.ensureActor();
    const principalObj = Principal.fromText(principal);
    const result = await this.actor.proposeStateHead(principalObj);
    return this.handleResult(result);
  }

  async confirmStateHead(principal: string): Promise<void> {
    await this.ensureActor();
    const principalObj = Principal.fromText(principal);
    const result = await this.actor.confirmStateHead(principalObj);
    return this.handleResult(result);
  }

  async lockBudget(amount: number, purpose: string): Promise<number> {
    await this.ensureActor();
    const result = await this.actor.lockBudget(BigInt(amount), purpose);
    const budgetId = this.handleResult(result);
    return Number(budgetId);
  }

  async allocateBudget(
    budgetId: number,
    amount: number,
    area: string,
    deputy: string
  ): Promise<void> {
    await this.ensureActor();
    const deputyPrincipal = Principal.fromText(deputy);
    const result = await this.actor.allocateBudget(
      BigInt(budgetId),
      BigInt(amount),
      area,
      deputyPrincipal
    );
    return this.handleResult(result);
  }

  // Vendor Functions
  async proposeVendor(principal: string): Promise<void> {
    await this.ensureActor();
    const principalObj = Principal.fromText(principal);
    const result = await this.actor.proposeVendor(principalObj);
    return this.handleResult(result);
  }

  async approveVendor(principal: string): Promise<void> {
    await this.ensureActor();
    const principalObj = Principal.fromText(principal);
    const result = await this.actor.approveVendor(principalObj);
    return this.handleResult(result);
  }

  async submitClaim(
    budgetId: number,
    allocationId: number,
    amount: number,
    invoiceData: string
  ): Promise<number> {
    await this.ensureActor();
    const result = await this.actor.submitClaim(
      BigInt(budgetId),
      BigInt(allocationId),
      BigInt(amount),
      invoiceData
    );
    const claimId = this.handleResult(result);
    return Number(claimId);
  }

  // Fraud Detection Functions
  async updateFraudScore(claimId: number, score: number): Promise<void> {
    await this.ensureActor();
    const result = await this.actor.updateFraudScore(BigInt(claimId), BigInt(score));
    return this.handleResult(result);
  }

  async approveClaimByAI(claimId: number, approve: boolean, reason: string): Promise<void> {
    await this.ensureActor();
    const result = await this.actor.approveClaimByAI(BigInt(claimId), approve, reason);
    return this.handleResult(result);
  }

  async addFraudAlert(
    claimId: number,
    alertType: string,
    severity: string,
    description: string
  ): Promise<void> {
    await this.ensureActor();
    const result = await this.actor.addFraudAlert(
      BigInt(claimId),
      alertType,
      severity,
      description
    );
    return this.handleResult(result);
  }

  // Challenge System
  async stakeChallenge(invoiceHash: string, reason: string, evidence: string): Promise<void> {
    await this.ensureActor();
    const result = await this.actor.stakeChallenge(invoiceHash, reason, evidence);
    return this.handleResult(result);
  }

  // Query Functions
  async getClaim(claimId: number): Promise<Claim | null> {
    await this.ensureActor();
    const result = await this.actor.getClaim(BigInt(claimId));
    return result.length > 0 ? result[0] : null;
  }

  async getAllClaims(): Promise<Array<[number, ClaimSummary]>> {
    await this.ensureActor();
    const result = await this.actor.getAllClaims();
    return result.map(([id, claim]: [bigint, any]) => [Number(id), claim]);
  }

  async getHighRiskClaims(): Promise<Array<[number, number]>> {
    await this.ensureActor();
    const result = await this.actor.getHighRiskClaims();
    return result.map(([id, score]: [bigint, bigint]) => [Number(id), Number(score)]);
  }

  async getFraudAlerts(claimId: number): Promise<FraudAlert[]> {
    await this.ensureActor();
    return await this.actor.getFraudAlerts(BigInt(claimId));
  }

  async getBudgetTransparency(): Promise<Array<[number, BudgetTransparency]>> {
    await this.ensureActor();
    const result = await this.actor.getBudgetTransparency();
    return result.map(([id, budget]: [bigint, any]) => [Number(id), budget]);
  }

  async getSystemStats(): Promise<SystemStats> {
    await this.ensureActor();
    const result = await this.actor.getSystemStats();
    return {
      totalBudget: result.totalBudget,
      activeClaims: result.activeClaims,
      flaggedClaims: result.flaggedClaims,
      totalChallenges: result.totalChallenges,
      vendorCount: result.vendorCount,
    };
  }

  // Utility function to convert Principal to string
  principalToString(principal: Principal): string {
    return principal.toString();
  }

  // Utility function to format amounts
  formatAmount(amount: bigint): string {
    return (Number(amount) / 1_000_000).toFixed(2); // Convert from e8s to ICP
  }

  // Check connection status
  async checkConnection(): Promise<boolean> {
    try {
      await this.ensureActor();
      await this.getSystemStats();
      return true;
    } catch (error) {
      console.error('ICP connection check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const icpCanisterService = new ICPCanisterService();

// React hook for using ICP canister service
export const useICP = () => {
  return {
    canisterService: icpCanisterService,
    
    // Government operations
    proposeStateHead: icpCanisterService.proposeStateHead.bind(icpCanisterService),
    confirmStateHead: icpCanisterService.confirmStateHead.bind(icpCanisterService),
    lockBudget: icpCanisterService.lockBudget.bind(icpCanisterService),
    allocateBudget: icpCanisterService.allocateBudget.bind(icpCanisterService),
    
    // Vendor operations
    proposeVendor: icpCanisterService.proposeVendor.bind(icpCanisterService),
    approveVendor: icpCanisterService.approveVendor.bind(icpCanisterService),
    submitClaim: icpCanisterService.submitClaim.bind(icpCanisterService),
    
    // Fraud detection
    updateFraudScore: icpCanisterService.updateFraudScore.bind(icpCanisterService),
    approveClaimByAI: icpCanisterService.approveClaimByAI.bind(icpCanisterService),
    addFraudAlert: icpCanisterService.addFraudAlert.bind(icpCanisterService),
    
    // Challenge system
    stakeChallenge: icpCanisterService.stakeChallenge.bind(icpCanisterService),
    
    // Queries
    getClaim: icpCanisterService.getClaim.bind(icpCanisterService),
    getAllClaims: icpCanisterService.getAllClaims.bind(icpCanisterService),
    getHighRiskClaims: icpCanisterService.getHighRiskClaims.bind(icpCanisterService),
    getFraudAlerts: icpCanisterService.getFraudAlerts.bind(icpCanisterService),
    getBudgetTransparency: icpCanisterService.getBudgetTransparency.bind(icpCanisterService),
    getSystemStats: icpCanisterService.getSystemStats.bind(icpCanisterService),
    
    // Utilities
    checkConnection: icpCanisterService.checkConnection.bind(icpCanisterService),
    formatAmount: icpCanisterService.formatAmount.bind(icpCanisterService),
  };
};