# backend/app/config/icp_config.py
"""
Internet Identity and ICP Network Configuration
"""

from typing import Dict, List, Optional
from pydantic import BaseSettings, validator
import os

class ICPNetworkConfig(BaseSettings):
    """ICP Network Configuration"""
    
    # Network URLs
    LOCAL_NETWORK_URL: str = "http://127.0.0.1:4943"
    MAINNET_NETWORK_URL: str = "https://ic0.app"
    TESTNET_NETWORK_URL: str = "https://ic0.testnet.app"
    
    # Internet Identity URLs
    LOCAL_II_URL: str = "http://127.0.0.1:4943/?canisterId=rdmx6-jaaaa-aaaah-qcaiq-cai"
    MAINNET_II_URL: str = "https://identity.ic0.app"
    TESTNET_II_URL: str = "https://identity.ic0.testnet.app"
    
    # Default canister IDs
    DEFAULT_PROCUREMENT_CANISTER: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
    DEFAULT_FRAUD_ENGINE_CANISTER: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
    
    # Network selection
    NETWORK: str = "local"  # local, testnet, mainnet
    
    @validator('NETWORK')
    def validate_network(cls, v):
        if v not in ['local', 'testnet', 'mainnet']:
            raise ValueError('NETWORK must be local, testnet, or mainnet')
        return v
    
    @property
    def network_url(self) -> str:
        """Get the current network URL"""
        if self.NETWORK == "mainnet":
            return self.MAINNET_NETWORK_URL
        elif self.NETWORK == "testnet":
            return self.TESTNET_NETWORK_URL
        else:
            return self.LOCAL_NETWORK_URL
    
    @property
    def ii_url(self) -> str:
        """Get the current Internet Identity URL"""
        if self.NETWORK == "mainnet":
            return self.MAINNET_II_URL
        elif self.NETWORK == "testnet":
            return self.TESTNET_II_URL
        else:
            return self.LOCAL_II_URL
    
    @property
    def fetch_root_key(self) -> bool:
        """Whether to fetch root key (False for mainnet)"""
        return self.NETWORK != "mainnet"

class InternetIdentityConfig(BaseSettings):
    """Internet Identity Configuration"""
    
    # II Provider settings
    II_PROVIDER_URL: str = "https://identity.ic0.app"
    II_DOMAIN: Optional[str] = None  # Current domain for II validation
    
    # Delegation settings
    MAX_DELEGATION_CHAIN_LENGTH: int = 10
    DELEGATION_EXPIRY_BUFFER: int = 300  # 5 minutes buffer
    
    # Authentication settings
    AUTH_TIMEOUT_SECONDS: int = 300  # 5 minutes
    MAX_AUTH_ATTEMPTS: int = 3
    
    # Role mapping (can be overridden by canister)
    DEFAULT_ROLES: List[str] = [
        "citizen",
        "vendor", 
        "deputy",
        "state_head",
        "main_government"
    ]
    
    # Demo mode settings
    ENABLE_DEMO_MODE: bool = True
    DEMO_ROLE_MAPPING: Dict[str, str] = {
        "demo_citizen": "citizen",
        "demo_vendor": "vendor",
        "demo_deputy": "deputy",
        "demo_state": "state_head",
        "demo_gov": "main_government"
    }

class CanisterConfig(BaseSettings):
    """Canister Configuration"""
    
    # Canister IDs
    PROCUREMENT_CANISTER_ID: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
    FRAUD_ENGINE_CANISTER_ID: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
    
    # Canister methods
    PROCUREMENT_METHODS: List[str] = [
        "getSystemStats",
        "getUserRole",
        "isMainGovernment",
        "isStateHead",
        "isDeputy",
        "isVendor"
    ]
    
    FRAUD_ENGINE_METHODS: List[str] = [
        "analyzeClaim",
        "getRules",
        "getHistory",
        "updateRules"
    ]
    
    # Timeout settings
    QUERY_TIMEOUT_SECONDS: int = 30
    UPDATE_TIMEOUT_SECONDS: int = 60
    
    # Retry settings
    MAX_RETRIES: int = 3
    RETRY_DELAY_SECONDS: int = 2

# Configuration instances
icp_network_config = ICPNetworkConfig()
ii_config = InternetIdentityConfig()
canister_config = CanisterConfig()

# Environment-based configuration
def get_icp_config() -> Dict[str, any]:
    """Get ICP configuration based on environment"""
    
    # Determine network from environment
    network = os.getenv("ICP_NETWORK", "local")
    
    if network == "mainnet":
        return {
            "network_url": icp_network_config.MAINNET_NETWORK_URL,
            "ii_url": icp_network_config.MAINNET_II_URL,
            "fetch_root_key": False,
            "canister_id": os.getenv("ICP_CANISTER_ID", canister_config.PROCUREMENT_CANISTER_ID)
        }
    elif network == "testnet":
        return {
            "network_url": icp_network_config.TESTNET_NETWORK_URL,
            "ii_url": icp_network_config.TESTNET_II_URL,
            "fetch_root_key": True,
            "canister_id": os.getenv("ICP_CANISTER_ID", canister_config.PROCUREMENT_CANISTER_ID)
        }
    else:  # local
        return {
            "network_url": icp_network_config.LOCAL_NETWORK_URL,
            "ii_url": icp_network_config.LOCAL_II_URL,
            "fetch_root_key": True,
            "canister_id": os.getenv("ICP_CANISTER_ID", canister_config.PROCUREMENT_CANISTER_ID)
        }

def get_ii_config() -> Dict[str, any]:
    """Get Internet Identity configuration"""
    return {
        "provider_url": ii_config.II_PROVIDER_URL,
        "domain": ii_config.II_DOMAIN or os.getenv("II_DOMAIN"),
        "max_delegation_length": ii_config.MAX_DELEGATION_CHAIN_LENGTH,
        "delegation_expiry_buffer": ii_config.DELEGATION_EXPIRY_BUFFER,
        "auth_timeout": ii_config.AUTH_TIMEOUT_SECONDS,
        "max_auth_attempts": ii_config.MAX_AUTH_ATTEMPTS,
        "enable_demo_mode": ii_config.ENABLE_DEMO_MODE,
        "demo_roles": ii_config.DEMO_ROLE_MAPPING
    }

def get_canister_config() -> Dict[str, any]:
    """Get canister configuration"""
    return {
        "procurement_id": canister_config.PROCUREMENT_CANISTER_ID,
        "fraud_engine_id": canister_config.FRAUD_ENGINE_CANISTER_ID,
        "procurement_methods": canister_config.PROCUREMENT_METHODS,
        "fraud_methods": canister_config.FRAUD_ENGINE_METHODS,
        "query_timeout": canister_config.QUERY_TIMEOUT_SECONDS,
        "update_timeout": canister_config.UPDATE_TIMEOUT_SECONDS,
        "max_retries": canister_config.MAX_RETRIES,
        "retry_delay": canister_config.RETRY_DELAY_SECONDS
    }
