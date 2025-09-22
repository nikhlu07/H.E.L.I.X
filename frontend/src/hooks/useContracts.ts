// frontend/src/hooks/useContract.ts - NEW
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { icpCanisterService, useICP } from '../services/icpCanisterService';
import { authService } from '../auth/authService';

export interface ContractState {
  loading: boolean;
  error: string | null;
  connected: boolean;
}

export interface BudgetData {
  id: number;
  amount: number;
  purpose: string;
  allocated: number;
  remaining: number;
  utilizationPercentage: number;
}

export interface ClaimData {
  claimId: number;
  vendor: string;
  amount: number;
  formattedAmount: string;
  invoiceHash: string;
  deputy: string;
  aiApproved: boolean;
  flagged: boolean;
  paid: boolean;
  fraudScore?: number;
  riskLevel: string;
  challengeCount: number;
  status: string;
  alerts: FraudAlert[];
}

export interface FraudAlert {
  type: string;
  severity: string;
  description: string;
  timestamp: number;
  resolved: boolean;
}

export interface SystemStats {
  totalBudget: number;
  activeClaims: number;
  flaggedClaims: number;
  totalChallenges: number;
  vendorCount: number;
  fraudRate: number;
  challengeRate: number;
}

export const useContract = () => {
  const { user, isAuthenticated } = useAuth();
  const icp = useICP();
  const [state, setState] = useState<ContractState>({
    loading: false,
    error: null,
    connected: false
  });

  // Initialize ICP connection
  useEffect(() => {
    const initConnection = async () => {
      if (isAuthenticated) {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
          await icpCanisterService.init();
          const connected = await icpCanisterService.checkConnection();
          setState(prev => ({ ...prev, connected, loading: false }));
        } catch (error) {
          console.error('Failed to connect to ICP canister:', error);
          setState(prev => ({ 
            ...prev, 
            connected: false, 
            loading: false, 
            error: 'Failed to connect to blockchain canister'
          }));
        }
      }
    };

    initConnection();
  }, [isAuthenticated]);

  // Generic contract call wrapper
  const callContract = useCallback(async <T>(
    operation: () => Promise<T>,
    errorMessage: string = 'Contract operation failed'
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await operation();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      console.error(`Contract call failed:`, error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : errorMessage
      }));
      return null;
    }
  }, []);

  // Government Operations
  const lockBudget = useCallback(async (amount: number, purpose: string) => {
    return callContract(
      () => icp.lockBudget(amount, purpose),
      'Failed to lock budget'
    );
  }, [callContract, icp]);

  const allocateBudget = useCallback(async (
    budgetId: number, 
    amount: number, 
    area: string, 
    deputy: string
  ) => {
    return callContract(
      () => icp.allocateBudget(budgetId, amount, area, deputy),
      'Failed to allocate budget'
    );
  }, [callContract, icp]);

  const proposeStateHead = useCallback(async (principal: string) => {
    return callContract(
      () => icp.proposeStateHead(principal),
      'Failed to propose state head'
    );
  }, [callContract, icp]);

  const confirmStateHead = useCallback(async (principal: string) => {
    return callContract(
      () => icp.confirmStateHead(principal),
      'Failed to confirm state head'
    );
  }, [callContract, icp]);

  const proposeVendor = useCallback(async (principal: string) => {
    return callContract(
      () => icp.proposeVendor(principal),
      'Failed to propose vendor'
    );
  }, [callContract, icp]);

  const approveVendor = useCallback(async (principal: string) => {
    return callContract(
      () => icp.approveVendor(principal),
      'Failed to approve vendor'
    );
  }, [callContract, icp]);

  // Vendor Operations
  const submitClaim = useCallback(async (
    budgetId: number,
    allocationId: number,
    amount: number,
    invoiceData: string
  ) => {
    return callContract(
      () => icp.submitClaim(budgetId, allocationId, amount, invoiceData),
      'Failed to submit claim'
    );
  }, [callContract, icp]);

  // Fraud Detection Operations
  const updateFraudScore = useCallback(async (claimId: number, score: number) => {
    return callContract(
      () => icp.updateFraudScore(claimId, score),
      'Failed to update fraud score'
    );
  }, [callContract, icp]);

  const approveClaimByAI = useCallback(async (
    claimId: number, 
    approve: boolean, 
    reason: string
  ) => {
    return callContract(
      () => icp.approveClaimByAI(claimId, approve, reason),
      'Failed to process claim approval'
    );
  }, [callContract, icp]);

  const addFraudAlert = useCallback(async (
    claimId: number,
    alertType: string,
    severity: string,
    description: string
  ) => {
    return callContract(
      () => icp.addFraudAlert(claimId, alertType, severity, description),
      'Failed to add fraud alert'
    );
  }, [callContract, icp]);

  // Challenge System
  const stakeChallenge = useCallback(async (
    invoiceHash: string,
    reason: string,
    evidence: string
  ) => {
    return callContract(
      () => icp.stakeChallenge(invoiceHash, reason, evidence),
      'Failed to stake challenge'
    );
  }, [callContract, icp]);

  // Query Operations
  const getClaim = useCallback(async (claimId: number) => {
    return callContract(
      () => icp.getClaim(claimId),
      'Failed to get claim details'
    );
  }, [callContract, icp]);

  const getAllClaims = useCallback(async (): Promise<ClaimData[] | null> => {
    const result = await callContract(
      async () => {
        const claims = await icp.getAllClaims();
        const claimsWithDetails: ClaimData[] = [];
        
        for (const [claimId, claimSummary] of claims) {
          const claimDetails = await icp.getClaim(claimId);
          if (claimDetails) {
            const alerts = await icp.getFraudAlerts(claimId);
            
            claimsWithDetails.push({
              claimId,
              vendor: icpCanisterService.principalToString(claimDetails.vendor),
              amount: Number(claimDetails.amount),
              formattedAmount: icpCanisterService.formatAmount(claimDetails.amount),
              invoiceHash: claimDetails.invoiceHash,
              deputy: icpCanisterService.principalToString(claimDetails.deputy),
              aiApproved: claimDetails.aiApproved,
              flagged: claimDetails.flagged,
              paid: claimDetails.paid,
              fraudScore: claimDetails.fraudScore ? Number(claimDetails.fraudScore) : undefined,
              riskLevel: calculateRiskLevel(claimDetails.fraudScore ? Number(claimDetails.fraudScore) : undefined),
              challengeCount: Number(claimDetails.challengeCount),
              status: getClaimStatus(claimDetails),
              alerts: alerts.map(alert => ({
                type: alert.alertType,
                severity: alert.severity,
                description: alert.description,
                timestamp: Number(alert.timestamp),
                resolved: alert.resolved
              }))
            });
          }
        }
        
        return claimsWithDetails;
      },
      'Failed to get all claims'
    );
    
    return result;
  }, [callContract, icp]);

  const getHighRiskClaims = useCallback(async () => {
    return callContract(
      () => icp.getHighRiskClaims(),
      'Failed to get high-risk claims'
    );
  }, [callContract, icp]);

  const getBudgetTransparency = useCallback(async (): Promise<BudgetData[] | null> => {
    const result = await callContract(
      async () => {
        const budgets = await icp.getBudgetTransparency();
        return budgets.map(([budgetId, budget]) => ({
          id: budgetId,
          amount: Number(budget.amount),
          purpose: budget.purpose,
          allocated: Number(budget.allocated),
          remaining: Number(budget.remaining),
          utilizationPercentage: Number(budget.amount) > 0 
            ? Number(((Number(budget.allocated) / Number(budget.amount)) * 100).toFixed(2))
            : 0
        }));
      },
      'Failed to get budget transparency data'
    );
    
    return result;
  }, [callContract, icp]);

  const getSystemStats = useCallback(async (): Promise<SystemStats | null> => {
    const result = await callContract(
      async () => {
        const stats = await icp.getSystemStats();
        const fraudRate = Number(stats.activeClaims) > 0 
          ? (Number(stats.flaggedClaims) / Number(stats.activeClaims)) * 100 
          : 0;
        const challengeRate = Number(stats.activeClaims) > 0 
          ? (Number(stats.totalChallenges) / Number(stats.activeClaims)) * 100 
          : 0;

        return {
          totalBudget: Number(stats.totalBudget),
          activeClaims: Number(stats.activeClaims),
          flaggedClaims: Number(stats.flaggedClaims),
          totalChallenges: Number(stats.totalChallenges),
          vendorCount: Number(stats.vendorCount),
          fraudRate: Number(fraudRate.toFixed(2)),
          challengeRate: Number(challengeRate.toFixed(2))
        };
      },
      'Failed to get system statistics'
    );
    
    return result;
  }, [callContract, icp]);

  const getFraudAlerts = useCallback(async (claimId: number) => {
    return callContract(
      () => icp.getFraudAlerts(claimId),
      'Failed to get fraud alerts'
    );
  }, [callContract, icp]);

  // Backend API Integration (for operations not on canister)
  const callBackendAPI = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.apiCall(endpoint, options);
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      setState(prev => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      console.error('Backend API call failed:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'API call failed'
      }));
      return null;
    }
  }, []);

  // Backend-specific operations
  const createBudgetViaAPI = useCallback(async (amount: number, purpose: string) => {
    return callBackendAPI('/api/v1/government/budget/create', {
      method: 'POST',
      body: JSON.stringify({ amount, purpose })
    });
  }, [callBackendAPI]);

  const allocateBudgetViaAPI = useCallback(async (
    budgetId: number,
    amount: number,
    area: string,
    deputy: string
  ) => {
    return callBackendAPI(`/api/v1/government/budget/${budgetId}/allocate`, {
      method: 'POST',
      body: JSON.stringify({ amount, area, deputy })
    });
  }, [callBackendAPI]);

  const submitClaimViaAPI = useCallback(async (claimData: {
    budgetId: number;
    allocationId: number;
    amount: number;
    description: string;
    workDetails: string;
  }) => {
    return callBackendAPI('/api/v1/vendor/claim/submit', {
      method: 'POST',
      body: JSON.stringify({
        budget_id: claimData.budgetId,
        allocation_id: claimData.allocationId,
        amount: claimData.amount,
        description: claimData.description,
        work_details: claimData.workDetails
      })
    });
  }, [callBackendAPI]);

  const getVendorClaimsViaAPI = useCallback(async () => {
    return callBackendAPI('/api/v1/vendor/claims/my-claims');
  }, [callBackendAPI]);

  const getVendorDashboardViaAPI = useCallback(async () => {
    return callBackendAPI('/api/v1/vendor/performance/dashboard');
  }, [callBackendAPI]);

  const getSystemStatsViaAPI = useCallback(async () => {
    return callBackendAPI('/api/v1/government/stats/system');
  }, [callBackendAPI]);

  const getBudgetTransparencyViaAPI = useCallback(async () => {
    return callBackendAPI('/api/v1/government/budget/transparency');
  }, [callBackendAPI]);

  const getHighRiskClaimsViaAPI = useCallback(async () => {
    return callBackendAPI('/api/v1/government/fraud/alerts/high-risk');
  }, [callBackendAPI]);

  const stakeChallengeViaAPI = useCallback(async (
    invoiceHash: string,
    reason: string,
    evidence: string
  ) => {
    return callBackendAPI('/api/v1/citizen/challenge/stake', {
      method: 'POST',
      body: JSON.stringify({
        invoice_hash: invoiceHash,
        reason,
        evidence
      })
    });
  }, [callBackendAPI]);

  // Utility functions
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshConnection = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await icpCanisterService.init();
      const connected = await icpCanisterService.checkConnection();
      setState(prev => ({ ...prev, connected, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        connected: false, 
        loading: false, 
        error: 'Failed to refresh connection'
      }));
    }
  }, []);

  // Combined operations (use backend API for better UX, canister for verification)
  const createBudgetCombined = useCallback(async (amount: number, purpose: string) => {
    // First call backend API for immediate response
    const apiResult = await createBudgetViaAPI(amount, purpose);
    
    if (apiResult?.success) {
      // Then verify on canister (background operation)
      setTimeout(async () => {
        try {
          await lockBudget(amount, purpose);
        } catch (error) {
          console.warn('Canister verification failed for budget creation:', error);
        }
      }, 1000);
    }
    
    return apiResult;
  }, [createBudgetViaAPI, lockBudget]);

  const submitClaimCombined = useCallback(async (claimData: {
    budgetId: number;
    allocationId: number;
    amount: number;
    description: string;
    workDetails: string;
  }) => {
    // Submit via API first
    const apiResult = await submitClaimViaAPI(claimData);
    
    if (apiResult?.success) {
      // Verify on canister (background)
      setTimeout(async () => {
        try {
          const invoiceData = JSON.stringify({
            description: claimData.description,
            workDetails: claimData.workDetails,
            timestamp: new Date().toISOString()
          });
          await submitClaim(claimData.budgetId, claimData.allocationId, claimData.amount, invoiceData);
        } catch (error) {
          console.warn('Canister verification failed for claim submission:', error);
        }
      }, 1000);
    }
    
    return apiResult;
  }, [submitClaimViaAPI, submitClaim]);

  return {
    // State
    ...state,
    
    // Direct canister operations
    lockBudget,
    allocateBudget,
    proposeStateHead,
    confirmStateHead,
    proposeVendor,
    approveVendor,
    submitClaim,
    updateFraudScore,
    approveClaimByAI,
    addFraudAlert,
    stakeChallenge,
    
    // Query operations
    getClaim,
    getAllClaims,
    getHighRiskClaims,
    getBudgetTransparency,
    getSystemStats,
    getFraudAlerts,
    
    // Backend API operations
    createBudgetViaAPI,
    allocateBudgetViaAPI,
    submitClaimViaAPI,
    getVendorClaimsViaAPI,
    getVendorDashboardViaAPI,
    getSystemStatsViaAPI,
    getBudgetTransparencyViaAPI,
    getHighRiskClaimsViaAPI,
    stakeChallengeChallengeViaAPI,
    
    // Combined operations (recommended for UX)
    createBudgetCombined,
    submitClaimCombined,
    
    // Utilities
    clearError,
    refreshConnection,
    callContract,
    callBackendAPI
  };
};

// Helper functions
function calculateRiskLevel(fraudScore?: number): string {
  if (fraudScore === undefined) return 'unknown';
  if (fraudScore >= 80) return 'critical';
  if (fraudScore >= 60) return 'high';
  if (fraudScore >= 30) return 'medium';
  return 'low';
}

function getClaimStatus(claim: any): string {
  if (claim.paid) return 'paid';
  if (claim.flagged) return 'flagged';
  if (claim.aiApproved) return 'approved';
  return 'pending';
}

// Hook for role-specific contract operations
export const useRoleBasedContract = () => {
  const { user } = useAuth();
  const contract = useContract();

  const getAvailableOperations = useCallback(() => {
    if (!user) return [];

    const operations = [];

    if (user.role === 'main_government') {
      operations.push(
        'lockBudget',
        'proposeStateHead',
        'confirmStateHead',
        'proposeVendor',
        'approveVendor',
        'updateFraudScore',
        'approveClaimByAI',
        'addFraudAlert'
      );
    }

    if (user.role === 'state_head' || user.role === 'main_government') {
      operations.push('allocateBudget');
    }

    if (user.role === 'vendor') {
      operations.push('submitClaim');
    }

    if (user.role === 'citizen') {
      operations.push('stakeChallenge');
    }

    // All authenticated users can query
    operations.push(
      'getClaim',
      'getAllClaims',
      'getBudgetTransparency',
      'getSystemStats'
    );

    return operations;
  }, [user]);

  return {
    ...contract,
    availableOperations: getAvailableOperations(),
    canPerformOperation: useCallback((operation: string) => {
      return getAvailableOperations().includes(operation);
    }, [getAvailableOperations])
  };
};