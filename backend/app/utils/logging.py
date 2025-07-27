"""
CorruptGuard Logging Configuration
Government-grade logging with security and audit trail support
"""

import logging
import logging.config
import sys
from pathlib import Path
from typing import Optional
import structlog
from datetime import datetime

from app.config.settings import get_settings

settings = get_settings()

def setup_logging(log_file: Optional[str] = None) -> None:
    """
    Setup comprehensive logging configuration for CorruptGuard
    
    Args:
        log_file: Optional path to log file
    """
    
    # Create logs directory if it doesn't exist
    if log_file:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Configure standard logging
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S"
            },
            "simple": {
                "format": "%(levelname)s - %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": settings.log_level.upper(),
                "formatter": "detailed" if settings.DEBUG else "simple",
                "stream": sys.stdout
            }
        },
        "loggers": {
            "app": {
                "level": settings.log_level.upper(),
                "handlers": ["console"],
                "propagate": False
            },
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False
            },
            "sqlalchemy.engine": {
                "level": "INFO" if getattr(settings, 'database_echo', False) else "WARNING",
                "handlers": ["console"],
                "propagate": False
            }
        },
        "root": {
            "level": settings.log_level.upper(),
            "handlers": ["console"]
        }
    }
    
    # Add file handler if log file specified
    if log_file or getattr(settings, 'log_file', None):
        file_path = log_file or settings.log_file
        logging_config["handlers"]["file"] = {
            "class": "logging.handlers.RotatingFileHandler",
            "level": settings.log_level.upper(),
            "formatter": "detailed",
            "filename": file_path,
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "encoding": "utf8"
        }
        
        # Add file handler to all loggers
        for logger_name in logging_config["loggers"]:
            logging_config["loggers"][logger_name]["handlers"].append("file")
        logging_config["root"]["handlers"].append("file")
    
    # Apply logging configuration
    logging.config.dictConfig(logging_config)
    
    # Configure structured logging for production
    if getattr(settings, 'is_production', False):
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer()
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )

def get_logger(name: str) -> logging.Logger:
    """
    Get a configured logger instance
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)

# Security audit logger for sensitive operations
def get_audit_logger() -> logging.Logger:
    """
    Get audit logger for security-sensitive operations
    
    Returns:
        Audit logger instance
    """
    audit_logger = logging.getLogger("audit")
    
    # Create audit-specific handler if in production
    if getattr(settings, 'is_production', False) and not audit_logger.handlers:
        audit_handler = logging.FileHandler("logs/audit.log")
        audit_formatter = logging.Formatter(
            "%(asctime)s - AUDIT - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        audit_handler.setFormatter(audit_formatter)
        audit_logger.addHandler(audit_handler)
        audit_logger.setLevel(logging.INFO)
    
    return audit_logger

# Fraud detection logger for corruption analysis
def get_fraud_logger() -> logging.Logger:
    """
    Get fraud detection logger for corruption analysis tracking
    
    Returns:
        Fraud detection logger instance
    """
    fraud_logger = logging.getLogger("fraud_detection")
    
    # Create fraud-specific handler
    if not fraud_logger.handlers:
        if getattr(settings, 'is_production', False):
            fraud_handler = logging.FileHandler("logs/fraud_detection.log")
        else:
            fraud_handler = logging.StreamHandler()
            
        fraud_formatter = logging.Formatter(
            "%(asctime)s - FRAUD - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        fraud_handler.setFormatter(fraud_formatter)
        fraud_logger.addHandler(fraud_handler)
        fraud_logger.setLevel(logging.INFO)
    
    return fraud_logger

# ICP transaction logger for blockchain operations
def get_icp_logger() -> logging.Logger:
    """
    Get ICP transaction logger for blockchain operations
    
    Returns:
        ICP logger instance
    """
    icp_logger = logging.getLogger("icp_transactions")
    
    # Create ICP-specific handler
    if not icp_logger.handlers:
        if getattr(settings, 'is_production', False):
            icp_handler = logging.FileHandler("logs/icp_transactions.log")
        else:
            icp_handler = logging.StreamHandler()
            
        icp_formatter = logging.Formatter(
            "%(asctime)s - ICP - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        icp_handler.setFormatter(icp_formatter)
        icp_logger.addHandler(icp_handler)
        icp_logger.setLevel(logging.INFO)
    
    return icp_logger

# Utility functions for structured logging
def log_user_action(
    user_principal: str,
    action: str,
    resource: str,
    details: Optional[dict] = None
):
    """
    Log user actions for audit trail
    
    Args:
        user_principal: User's ICP Principal ID
        action: Action performed (CREATE, UPDATE, DELETE, etc.)
        resource: Resource affected
        details: Additional details
    """
    audit_logger = get_audit_logger()
    
    log_data = {
        "user_principal": user_principal,
        "action": action,
        "resource": resource,
        "timestamp": datetime.utcnow().isoformat(),
        "details": details or {}
    }
    
    audit_logger.info(f"User action: {action} on {resource}", extra=log_data)

def log_fraud_detection(
    claim_id: str,
    fraud_score: int,
    risk_level: str,
    detection_method: str,
    details: Optional[dict] = None
):
    """
    Log fraud detection events
    
    Args:
        claim_id: Claim identifier
        fraud_score: Calculated fraud score (0-100)
        risk_level: Risk level (low, medium, high, critical)
        detection_method: Method used for detection
        details: Additional detection details
    """
    fraud_logger = get_fraud_logger()
    
    log_data = {
        "claim_id": claim_id,
        "fraud_score": fraud_score,
        "risk_level": risk_level,
        "detection_method": detection_method,
        "timestamp": datetime.utcnow().isoformat(),
        "details": details or {}
    }
    
    fraud_logger.warning(
        f"Fraud detection: Claim {claim_id} scored {fraud_score} ({risk_level})",
        extra=log_data
    )

def log_icp_transaction(
    transaction_type: str,
    canister_id: str,
    method: str,
    user_principal: str,
    success: bool,
    details: Optional[dict] = None
):
    """
    Log ICP blockchain transactions
    
    Args:
        transaction_type: Type of transaction
        canister_id: Target canister ID
        method: Canister method called
        user_principal: User's Principal ID
        success: Whether transaction succeeded
        details: Additional transaction details
    """
    icp_logger = get_icp_logger()
    
    log_data = {
        "transaction_type": transaction_type,
        "canister_id": canister_id,
        "method": method,
        "user_principal": user_principal,
        "success": success,
        "timestamp": datetime.utcnow().isoformat(),
        "details": details or {}
    }
    
    level = logging.INFO if success else logging.ERROR
    icp_logger.log(
        level,
        f"ICP transaction: {transaction_type} - {method} ({'SUCCESS' if success else 'FAILED'})",
        extra=log_data
    )