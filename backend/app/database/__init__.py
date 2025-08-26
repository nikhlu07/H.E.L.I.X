from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.config.settings import get_settings

settings = get_settings()

DATABASE_URL = getattr(settings, 'database_url', 'sqlite:///./corruptguard.db')

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

