# backend/app/config/settings.py - UPDATED
from pydantic_settings import BaseSettings
from typing import Optional, List
import secrets
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "CorruptGuard API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True  # Set to True for development
    ENVIRONMENT: str = "development"
    
    # API Configuration
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "0.0.0.0"]
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_SECRET_KEY: str = secrets.token_urlsafe(32)
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Security
    jwt_secret_key: str = secrets.token_urlsafe(32)
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60 * 24  # 24 hours
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",  # Alternative React port
        "https://localhost:3000", # HTTPS React
        "http://127.0.0.1:3000",  # Alternative localhost
        "http://127.0.0.1:5173",  # Vite dev server
        "http://localhost:5173",  # Vite dev server
    ]
    cors_origins: list = [
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",  # Alternative React port
        "https://localhost:3000", # HTTPS React
        "http://127.0.0.1:3000",  # Alternative localhost
        "http://127.0.0.1:5173",  # Vite dev server
        "http://localhost:5173",  # Vite dev server
    ]
    cors_allow_credentials: bool = True
    cors_allow_methods: list = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    cors_allow_headers: list = ["*"]
    
    # ICP Configuration
    icp_network: str = "local"  # local, testnet, mainnet
    icp_canister_id: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"  # Your canister ID
    icp_agent_host: str = "http://127.0.0.1:4943"  # Local dfx
    icp_identity_provider: str = "https://identity.ic0.app"
    
    # Internet Identity
    ii_canister_id: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"  # II canister for local
    ii_derivation_origin: Optional[str] = None
    ii_alternative_origins: list = []
    
    # Principal Configuration
    main_government_principal: str = "rdmx6-jaaaa-aaaah-qcaiq-cai"
    demo_principals: dict = {
        "main_government": "rdmx6-jaaaa-aaaah-qcaiq-cai",
        "state_head": "renrk-eyaaa-aaaah-qcaia-cai",
        "deputy": "rrkah-fqaaa-aaaah-qcaiq-cai",
        "vendor": "radvj-tiaaa-aaaah-qcaiq-cai",
        "citizen": "raahe-xyaaa-aaaah-qcaiq-cai"
    }
    
    # Database (for future use)
    database_url: str = "sqlite:///./corruptguard.db"
    database_echo: bool = False
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    log_file: Optional[str] = None
    
    # Fraud Detection
    FRAUD_DETECTION_ENABLED: bool = True
    fraud_detection_enabled: bool = True
    fraud_scoring_endpoint: Optional[str] = None
    fraud_alert_threshold: int = 70
    fraud_critical_threshold: int = 85
    
    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds
    
    # Monitoring
    enable_metrics: bool = True
    metrics_endpoint: str = "/metrics"
    health_check_endpoint: str = "/health"
    
    # File Upload
    max_upload_size: int = 10 * 1024 * 1024  # 10MB
    allowed_file_types: list = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"]
    upload_directory: str = "./uploads"
    
    # Email (for notifications)
    smtp_server: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_username: Optional[str] = None
    smtp_password: Optional[str] = None
    smtp_use_tls: bool = True
    
    # Government Configuration
    max_state_heads: int = 10
    max_deputies: int = 50
    max_vendors: int = 100
    max_budget_amount: int = 100_000_000  # 100M
    
    # Corruption Detection Rules
    corruption_rules: dict = {
        "high_amount_threshold": 1_000_000,
        "round_number_penalty": 30,
        "new_vendor_penalty": 25,
        "after_hours_penalty": 15,
        "similar_claims_penalty": 10,
        "max_fraud_score": 100
    }
    
    # Staking Configuration
    stake_amount: int = 1_000_000  # 1 ICP in e8s
    reward_amount: int = 5_000_000  # 5 ICP in e8s
    challenge_timeout: int = 86_400  # 24 hours in seconds
    
    # Role Configuration
    role_confirmation_delay: int = 0  # 0 for testing, 86400 for production
    budget_lock_duration: int = 0  # 0 for testing, 3600 for production
    escrow_duration: int = 86_400  # 24 hours
    
    # Demo Mode
    demo_mode: bool = True
    demo_auto_approve: bool = True
    demo_skip_verification: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Create settings instance
def get_settings() -> Settings:
    """Factory function to get settings instance"""
    return Settings()

settings = Settings()

# Environment-specific configurations
def get_icp_config():
    """Get ICP configuration based on network"""
    if settings.icp_network == "local":
        return {
            "agent_host": "http://127.0.0.1:4943",
            "canister_id": settings.icp_canister_id,
            "identity_provider": "http://127.0.0.1:4943?canisterId=rdmx6-jaaaa-aaaah-qcaiq-cai"
        }
    elif settings.icp_network == "testnet":
        return {
            "agent_host": "https://testnet.dfinity.network",
            "canister_id": settings.icp_canister_id,
            "identity_provider": "https://identity.ic0.app"
        }
    else:  # mainnet
        return {
            "agent_host": "https://ic0.app",
            "canister_id": settings.icp_canister_id,
            "identity_provider": "https://identity.ic0.app"
        }

def get_cors_config():
    """Get CORS configuration"""
    return {
        "allow_origins": settings.cors_origins,
        "allow_credentials": settings.cors_allow_credentials,
        "allow_methods": settings.cors_allow_methods,
        "allow_headers": settings.cors_allow_headers,
    }

def get_logging_config():
    """Get logging configuration"""
    import logging
    
    level = getattr(logging, settings.log_level.upper(), logging.INFO)
    
    config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": settings.log_format,
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "formatter": "default",
                "level": level,
            },
        },
        "root": {
            "level": level,
            "handlers": ["console"],
        },
        "loggers": {
            "uvicorn": {
                "level": level,
                "handlers": [],
                "propagate": True,
            },
            "uvicorn.error": {
                "level": level,
                "handlers": [],
                "propagate": True,
            },
            "uvicorn.access": {
                "level": level,
                "handlers": [],
                "propagate": True,
            },
        },
    }
    
    # Add file handler if specified
    if settings.log_file:
        config["handlers"]["file"] = {
            "class": "logging.FileHandler",
            "filename": settings.log_file,
            "formatter": "default",
            "level": level,
        }
        config["root"]["handlers"].append("file")
    
    return config