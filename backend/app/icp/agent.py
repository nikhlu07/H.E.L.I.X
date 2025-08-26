"""
CorruptGuard ICP Agent Setup
Internet Computer Protocol agent configuration and management
"""

import asyncio
import json
from typing import Dict, Any, Optional, List, Union
from dataclasses import dataclass
from datetime import datetime

# Import from ic-py package (optional at import time)
# We guard these imports so the backend can start in environments
# where ic-py isn't installed (e.g., demo mode or during setup).
try:
    from ic.agent import Agent
    from ic.identity import Identity
    from ic.principal import Principal
    from ic.candid import encode, decode
    IC_AVAILABLE = True
    _IC_IMPORT_ERROR = None
except Exception as _e:  # ImportError or other issues under Py 3.13
    Agent = Identity = Principal = None  # type: ignore
    encode = decode = None  # type: ignore
    IC_AVAILABLE = False
    _IC_IMPORT_ERROR = _e

from app.config.settings import get_settings
from app.utils.logging import get_logger
from app.utils.exceptions import ICPError, ConfigurationError

logger = get_logger(__name__)


@dataclass
class ICPConfig:
    """ICP configuration data class"""
    network_url: str
    canister_id: str
    identity_pem_path: Optional[str] = None
    fetch_root_key: bool = True  # True for local development, False for mainnet


class ICPAgent:
    """
    ICP Agent for interacting with CorruptGuard canister
    """
    
    def __init__(self, config: ICPConfig):
        self.config = config
        self.agent: Optional[Agent] = None
        self.identity: Optional[Identity] = None
        self.canister_principal: Optional[Principal] = None
        self._initialized = False
    
    async def initialize(self) -> None:
        """
        Initialize ICP agent and connections
        """
        try:
            if not IC_AVAILABLE:
                raise ConfigurationError(
                    "ic-py is not available. Install dependencies (pip install -r backend/requirements.txt) "
                    "or run in demo mode to avoid ICP initialization. Underlying error: "
                    f"{_IC_IMPORT_ERROR}"
                )
            logger.info(f"🔗 Initializing ICP agent for network: {self.config.network_url}")
            
            # Setup identity
            if self.config.identity_pem_path:
                self.identity = Identity.from_pem_file(self.config.identity_pem_path)
                logger.info("✅ Identity loaded from PEM file")
            else:
                # Create anonymous identity for read-only operations
                self.identity = Identity()
                logger.info("⚠️  Using anonymous identity")
            
            # Create agent
            self.agent = Agent(self.identity, host=self.config.network_url)
            
            # Fetch root key for local development
            if self.config.fetch_root_key:
                await self.agent.fetch_root_key()
                logger.info("🔑 Root key fetched for local development")
            
            # Set canister principal
            self.canister_principal = Principal.from_str(self.config.canister_id)
            
            # Test connection
            await self.test_connection()
            
            self._initialized = True
            logger.info("🎉 ICP agent initialized successfully")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize ICP agent: {str(e)}")
            raise ICPError(f"ICP agent initialization failed: {str(e)}")
    
    async def test_connection(self) -> bool:
        """
        Test connection to the canister
        """
        try:
            # Try to get canister status or make a simple query
            result = await self.query_method("getSystemStats", [])
            logger.info("✅ ICP connection test successful")
            return True
            
        except Exception as e:
            logger.warning(f"⚠️  ICP connection test failed: {str(e)}")
            return False
    
    def ensure_initialized(self) -> None:
        """
        Ensure the agent is initialized before use
        """
        if not self._initialized:
            raise ICPError("ICP agent not initialized. Call initialize() first.")
    
    async def query_method(self, method_name: str, args: List[Any], 
                          decode_response: bool = True) -> Any:
        """
        Query a canister method (read-only)
        
        Args:
            method_name: Name of the canister method
            args: Method arguments
            decode_response: Whether to decode the response
            
        Returns:
            Method response
        """
        self.ensure_initialized()
        
        try:
            logger.debug(f"🔍 Querying method: {method_name} with args: {args}")
            
            # Encode arguments
            encoded_args = encode(args) if args else b''
            
            # Make query call
            response = await self.agent.query_raw(
                self.canister_principal,
                method_name,
                encoded_args
            )
            
            # Decode response if requested
            if decode_response and response:
                decoded_response = decode(response)
                logger.debug(f"✅ Query successful: {method_name}")
                return decoded_response
            
            return response
            
        except Exception as e:
            error_msg = f"Query failed for {method_name}: {str(e)}"
            logger.error(f"❌ {error_msg}")
            raise ICPError(error_msg)
    
    async def update_method(self, method_name: str, args: List[Any], 
                           caller_principal: Optional[str] = None,
                           decode_response: bool = True) -> Any:
        """
        Call an update method on the canister (state-changing)
        
        Args:
            method_name: Name of the canister method
            args: Method arguments
            caller_principal: Principal making the call
            decode_response: Whether to decode the response
            
        Returns:
            Method response
        """
        self.ensure_initialized()
        
        transaction_id = None
        success = False
        
        try:
            logger.info(f"📝 Calling update method: {method_name} with args: {args}")
            
            # Encode arguments
            encoded_args = encode(args) if args else b''
            
            # Make update call
            response = await self.agent.update_raw(
                self.canister_principal,
                method_name,
                encoded_args
            )
            
            # Get transaction ID if available
            transaction_id = getattr(response, 'request_id', None)
            
            # Decode response if requested
            decoded_response = None
            if decode_response and response:
                decoded_response = decode(response)
            
            success = True
            logger.info(f"✅ Update successful: {method_name}")
            
            # Log transaction
            logger.info(f"Transaction: {method_name} - Success: {success} - ID: {transaction_id}")
            
            return decoded_response or response
            
        except Exception as e:
            error_msg = f"Update failed for {method_name}: {str(e)}"
            logger.error(f"❌ {error_msg}")
            raise ICPError(error_msg)
    
    async def call_with_retry(self, method_name: str, args: List[Any], 
                             is_update: bool = False, max_retries: int = 3,
                             caller_principal: Optional[str] = None) -> Any:
        """
        Call method with retry logic for better reliability
        
        Args:
            method_name: Name of the canister method
            args: Method arguments
            is_update: Whether this is an update call
            max_retries: Maximum number of retries
            caller_principal: Principal making the call
            
        Returns:
            Method response
        """
        last_exception = None
        
        for attempt in range(max_retries):
            try:
                if is_update:
                    return await self.update_method(method_name, args, caller_principal)
                else:
                    return await self.query_method(method_name, args)
                    
            except ICPError as e:
                last_exception = e
                if attempt < max_retries - 1:
                    delay = 2 ** attempt  # Exponential backoff
                    logger.warning(f"⚠️  Attempt {attempt + 1} failed, retrying in {delay}s: {str(e)}")
                    await asyncio.sleep(delay)
                else:
                    logger.error(f"❌ All {max_retries} attempts failed")
        
        raise last_exception
    
    async def get_canister_status(self) -> Dict[str, Any]:
        """
        Get canister status information
        """
        try:
            # This would typically call a canister management method
            # For now, return basic status
            status = {
                "canister_id": self.config.canister_id,
                "status": "running",
                "agent_initialized": self._initialized,
                "network": self.config.network_url,
                "last_check": datetime.utcnow().isoformat()
            }
            
            # Try to get actual canister info if possible
            try:
                stats = await self.query_method("getSystemStats", [])
                if stats:
                    status["system_stats"] = stats
                    status["responsive"] = True
            except:
                status["responsive"] = False
            
            return status
            
        except Exception as e:
            logger.error(f"❌ Failed to get canister status: {str(e)}")
            return {
                "canister_id": self.config.canister_id,
                "status": "error",
                "error": str(e),
                "last_check": datetime.utcnow().isoformat()
            }
    
    async def close(self) -> None:
        """
        Close agent connections and cleanup
        """
        try:
            self._initialized = False
            logger.info("🔌 ICP agent connections closed")
            
        except Exception as e:
            logger.error(f"❌ Error closing ICP agent: {str(e)}")


class ICPConnectionManager:
    """
    Manager for ICP agent instances and connection pooling
    """
    
    def __init__(self):
        self.agents: Dict[str, ICPAgent] = {}
        self.default_agent: Optional[ICPAgent] = None
    
    async def initialize_default_agent(self) -> ICPAgent:
        """
        Initialize the default ICP agent from settings
        """
        try:
            settings = get_settings()
            
            # Create config from settings
            config = ICPConfig(
                network_url=getattr(settings, 'ICP_NETWORK_URL', 'https://ic0.app'),
                canister_id=getattr(settings, 'ICP_CANISTER_ID', 'rdmx6-jaaaa-aaaah-qcaiq-cai'),
                identity_pem_path=getattr(settings, 'ICP_IDENTITY_PEM_PATH', None),
                fetch_root_key=getattr(settings, 'ICP_FETCH_ROOT_KEY', True)
            )
            
            # Validate required settings
            if not config.canister_id:
                raise ConfigurationError("ICP_CANISTER_ID not configured")
            
            # Create and initialize agent
            agent = ICPAgent(config)
            await agent.initialize()
            
            # Store as default
            self.default_agent = agent
            self.agents['default'] = agent
            
            logger.info("🎯 Default ICP agent initialized")
            return agent
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize default ICP agent: {str(e)}")
            raise ICPError(f"Default agent initialization failed: {str(e)}")
    
    def get_agent(self, name: str = 'default') -> ICPAgent:
        """
        Get an ICP agent by name
        
        Args:
            name: Agent name
            
        Returns:
            ICP agent instance
        """
        agent = self.agents.get(name)
        if not agent:
            raise ICPError(f"ICP agent '{name}' not found")
        
        if not agent._initialized:
            raise ICPError(f"ICP agent '{name}' not initialized")
        
        return agent
    
    async def add_agent(self, name: str, config: ICPConfig) -> ICPAgent:
        """
        Add a new ICP agent with custom configuration
        
        Args:
            name: Agent name
            config: ICP configuration
            
        Returns:
            Initialized ICP agent
        """
        try:
            agent = ICPAgent(config)
            await agent.initialize()
            
            self.agents[name] = agent
            logger.info(f"✅ ICP agent '{name}' added")
            
            return agent
            
        except Exception as e:
            logger.error(f"❌ Failed to add ICP agent '{name}': {str(e)}")
            raise ICPError(f"Failed to add agent '{name}': {str(e)}")
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Check health of all managed agents
        """
        health_status = {
            "total_agents": len(self.agents),
            "healthy_agents": 0,
            "agents": {}
        }
        
        for name, agent in self.agents.items():
            try:
                status = await agent.get_canister_status()
                is_healthy = status.get("responsive", False) and agent._initialized
                
                health_status["agents"][name] = {
                    "healthy": is_healthy,
                    "status": status
                }
                
                if is_healthy:
                    health_status["healthy_agents"] += 1
                    
            except Exception as e:
                health_status["agents"][name] = {
                    "healthy": False,
                    "error": str(e)
                }
        
        health_status["overall_healthy"] = (
            health_status["healthy_agents"] == health_status["total_agents"]
        )
        
        return health_status
    
    async def close_all(self) -> None:
        """
        Close all agent connections
        """
        for name, agent in self.agents.items():
            try:
                await agent.close()
                logger.info(f"✅ Closed ICP agent: {name}")
            except Exception as e:
                logger.error(f"❌ Error closing agent {name}: {str(e)}")
        
        self.agents.clear()
        self.default_agent = None
        logger.info("🔌 All ICP agents closed")


# Global connection manager instance
icp_manager = ICPConnectionManager()


# Convenience functions for common operations
async def get_default_agent() -> ICPAgent:
    """
    Get the default ICP agent
    """
    if not icp_manager.default_agent:
        await icp_manager.initialize_default_agent()
    
    return icp_manager.default_agent


async def query_canister(method_name: str, args: List[Any] = None,
                        agent_name: str = 'default') -> Any:
    """
    Convenience function to query canister method
    """
    agent = icp_manager.get_agent(agent_name)
    return await agent.query_method(method_name, args or [])


async def update_canister(method_name: str, args: List[Any] = None,
                         caller_principal: Optional[str] = None,
                         agent_name: str = 'default') -> Any:
    """
    Convenience function to call canister update method
    """
    agent = icp_manager.get_agent(agent_name)
    return await agent.update_method(method_name, args or [], caller_principal)


# Utility functions for Principal handling
def validate_principal_format(principal_str: str) -> bool:
    """
    Validate Principal ID format
    """
    try:
        Principal.from_str(principal_str)
        return True
    except:
        return False


def principal_to_bytes(principal_str: str) -> bytes:
    """
    Convert Principal string to bytes
    """
    try:
        principal = Principal.from_str(principal_str)
        return principal.bytes
    except Exception as e:
        raise ICPError(f"Invalid Principal format: {str(e)}")


def bytes_to_principal(principal_bytes: bytes) -> str:
    """
    Convert Principal bytes to string
    """
    try:
        principal = Principal(principal_bytes)
        return str(principal)
    except Exception as e:
        raise ICPError(f"Invalid Principal bytes: {str(e)}")


# Alias for backward compatibility
async def get_icp_agent():
    """
    Get the default ICP agent (alias for get_default_agent)
    """
    return await get_default_agent()