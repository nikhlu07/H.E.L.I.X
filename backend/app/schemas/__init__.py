from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.sql import func
from app.database import Base


class FraudResult(Base):
    __tablename__ = "fraud_results"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, index=True, nullable=False)
    score = Column(Integer, nullable=False)
    risk_level = Column(String(20), nullable=False)
    flags = Column(Text, nullable=True)
    reasoning = Column(Text, nullable=True)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class FraudAuditLog(Base):
    __tablename__ = "fraud_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    user_principal = Column(String(100), nullable=True)
    claim_id = Column(Integer, nullable=True)
    severity = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

