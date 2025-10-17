# Database (`app/database/`)

## Overview

This directory contains database configuration and session management for H.E.L.I.X. It uses SQLAlchemy ORM for database operations, providing a clean abstraction layer for data persistence.

## Purpose

The database module provides:

- **Database Connection**: SQLAlchemy engine configuration
- **Session Management**: Database session lifecycle management
- **ORM Base**: Declarative base for model definitions
- **Connection Pooling**: Efficient database connection management
- **Dependency Injection**: FastAPI-compatible database session provider

## Contents

### Files

- **__init__.py** - Database initialization, engine setup, and session management

## Database Architecture

```
FastAPI Application
    ↓
get_db() Dependency
    ↓
SessionLocal (Session Factory)
    ↓
SQLAlchemy Engine
    ↓
SQLite Database (helix.db)
```

## Key Components

### Database Engine

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool

DATABASE_URL = "sqlite:///./helix.db"

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,  # No connection pooling for SQLite
    connect_args={"check_same_thread": False}  # SQLite-specific
)
```

### Session Factory

```python
from sqlalchemy.orm import sessionmaker

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
```

### Declarative Base

```python
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# All models inherit from Base
class FraudResult(Base):
    __tablename__ = "fraud_results"
    # ...
```

### Database Dependency

```python
def get_db():
    """FastAPI dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Usage Examples

### Using Database in API Endpoints

```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db

@router.post("/fraud/analyze")
async def analyze_fraud(
    claim_data: ClaimData,
    db: Session = Depends(get_db)
):
    # Database session automatically injected
    fraud_result = FraudResult(
        claim_id=claim_data.claim_id,
        score=85,
        risk_level="high"
    )
    
    db.add(fraud_result)
    db.commit()
    db.refresh(fraud_result)
    
    return fraud_result
```

### Defining Database Models

```python
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
from datetime import datetime

class FraudResult(Base):
    __tablename__ = "fraud_results"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, unique=True, index=True)
    score = Column(Integer)
    risk_level = Column(String)
    flags = Column(String)  # Comma-separated
    reasoning = Column(String)
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Creating Tables

```python
from app.database import Base, engine

# Create all tables
Base.metadata.create_all(bind=engine)
```

### Querying Data

```python
from app.database import get_db
from sqlalchemy.orm import Session

def get_fraud_results(db: Session, limit: int = 100):
    return db.query(FraudResult)\
        .order_by(FraudResult.created_at.desc())\
        .limit(limit)\
        .all()

def get_fraud_result_by_claim(db: Session, claim_id: int):
    return db.query(FraudResult)\
        .filter(FraudResult.claim_id == claim_id)\
        .first()
```


### Transaction Management

```python
from app.database import get_db
from sqlalchemy.orm import Session

async def create_fraud_alert(db: Session, alert_data: dict):
    try:
        # Start transaction
        alert = FraudAlert(**alert_data)
        db.add(alert)
        
        # Additional operations
        audit_log = AuditLog(action="fraud_alert_created")
        db.add(audit_log)
        
        # Commit transaction
        db.commit()
        
        return alert
    except Exception as e:
        # Rollback on error
        db.rollback()
        raise e
```

## Database Configuration

### SQLite (Default)

```python
DATABASE_URL = "sqlite:///./helix.db"

# SQLite-specific settings
connect_args = {"check_same_thread": False}
poolclass = NullPool  # No connection pooling
```

### PostgreSQL (Production)

```python
DATABASE_URL = "postgresql://user:password@localhost/helix"

# PostgreSQL settings
poolclass = QueuePool
pool_size = 5
max_overflow = 10
pool_pre_ping = True  # Verify connections before use
```

### MySQL

```python
DATABASE_URL = "mysql+pymysql://user:password@localhost/helix"

# MySQL settings
poolclass = QueuePool
pool_size = 5
pool_recycle = 3600  # Recycle connections after 1 hour
```

## Database Models

### Current Models

H.E.L.I.X. currently stores:

- **FraudResult**: Fraud analysis results
- **FraudAuditLog**: Audit trail of fraud detection events
- **UserSession**: User authentication sessions (future)
- **SystemMetrics**: Performance and health metrics (future)

### Example Model Structure

```python
class FraudResult(Base):
    __tablename__ = "fraud_results"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    claim_id = Column(Integer, unique=True, index=True)
    
    # Fraud Analysis Data
    score = Column(Integer)
    risk_level = Column(String)
    flags = Column(String)
    reasoning = Column(String)
    confidence = Column(Float)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    # Relationships (future)
    # claim = relationship("Claim", back_populates="fraud_result")
```

## Migration Strategy

### Alembic Setup (Future)

For production, use Alembic for database migrations:

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Add fraud_results table"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Manual Migrations

For development, use direct table creation:

```python
from app.database import Base, engine

# Drop all tables (development only!)
Base.metadata.drop_all(bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)
```

## Performance Optimization

### Indexing

```python
class FraudResult(Base):
    __tablename__ = "fraud_results"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, unique=True, index=True)  # Indexed
    created_at = Column(DateTime, default=datetime.utcnow, index=True)  # Indexed
```

### Query Optimization

```python
# Use select_related for joins
results = db.query(FraudResult)\
    .join(Claim)\
    .filter(FraudResult.score > 70)\
    .all()

# Use pagination
results = db.query(FraudResult)\
    .offset(skip)\
    .limit(limit)\
    .all()

# Use specific columns
results = db.query(FraudResult.claim_id, FraudResult.score)\
    .filter(FraudResult.risk_level == "high")\
    .all()
```

### Connection Pooling

```python
# Production configuration
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,           # Number of connections to maintain
    max_overflow=10,       # Additional connections when needed
    pool_pre_ping=True,    # Verify connections before use
    pool_recycle=3600      # Recycle connections after 1 hour
)
```

## Testing

### Test Database Setup

```python
# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestSessionLocal = sessionmaker(bind=test_engine)

# Create test database
Base.metadata.create_all(bind=test_engine)
```

### Test Database Dependency

```python
def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Override in tests
app.dependency_overrides[get_db] = override_get_db
```

## Security Considerations

### SQL Injection Prevention

SQLAlchemy ORM automatically prevents SQL injection:

```python
# Safe - parameterized query
db.query(FraudResult).filter(FraudResult.claim_id == user_input).first()

# Unsafe - raw SQL (avoid)
db.execute(f"SELECT * FROM fraud_results WHERE claim_id = {user_input}")
```

### Connection Security

```python
# Use SSL for production databases
DATABASE_URL = "postgresql://user:password@localhost/db?sslmode=require"

# Encrypt connection strings
import os
DATABASE_URL = os.getenv("DATABASE_URL")  # Store in environment
```

## Monitoring

### Database Health Check

```python
from sqlalchemy import text

def check_database_health(db: Session) -> bool:
    try:
        db.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
```

### Query Performance Logging

```python
# Enable SQL logging
engine = create_engine(
    DATABASE_URL,
    echo=True  # Log all SQL queries
)
```

## Related Documentation

- [Configuration](../config/README.md) - Database configuration settings
- [Schemas](../schemas/README.md) - Pydantic models for data validation
- [API Layer](../api/README.md) - API endpoints using database
- [Main Application](../README.md) - Application architecture
