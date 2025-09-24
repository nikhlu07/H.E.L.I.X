from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json
import time
from datetime import datetime

app = FastAPI(title="Helix Data Flow Demo API")

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class AuthRequest(BaseModel):
    principal_id: str
    role: str
    method: str

class DemoLoginRequest(BaseModel):
    role: str

class TransactionData(BaseModel):
    user_id: str
    amount: float
    description: str
    category: str

# In-memory storage for demo
demo_data = {
    "transactions": [],
    "users": {},
    "stats": {
        "total_transactions": 0,
        "fraud_alerts": 0,
        "active_users": 0,
        "system_health": 100
    }
}

@app.get("/")
async def root():
    return {"message": "Helix Data Flow Demo API", "status": "running"}

@app.post("/api/v1/auth/demo-login/{role}")
async def demo_login(role: str):
    """Demo login endpoint"""
    timestamp = datetime.now().isoformat()

    user_data = {
        "principal_id": f"demo-{role}-{int(time.time())}",
        "role": role,
        "name": f"{role.replace('_', ' ').title()} User",
        "authenticated_at": timestamp,
        "demo_mode": True,
        "access_token": f"demo_token_{role}_{int(time.time())}"
    }

    # Update demo stats
    demo_data["stats"]["active_users"] += 1

    return {
        "access_token": user_data["access_token"],
        "token_type": "bearer",
        "principal_id": user_data["principal_id"],
        "role": user_data["role"],
        "user_info": {
            "name": user_data["name"],
            "title": f"{role.replace('_', ' ').title()} Officer",
            "permissions": ["read", "write"] if role != "citizen" else ["read"],
            "authenticated_at": timestamp,
            "demo_mode": True
        },
        "expires_in": 3600,
        "demo_mode": True
    }

@app.get("/api/v1/demo/stats")
async def get_demo_stats():
    """Get current demo statistics"""
    return {
        "data": demo_data["stats"],
        "message": "Demo stats retrieved successfully"
    }

@app.post("/api/v1/demo/transaction")
async def create_transaction(transaction: TransactionData):
    """Create a demo transaction"""
    transaction_id = len(demo_data["transactions"]) + 1
    timestamp = datetime.now().isoformat()

    new_transaction = {
        "id": transaction_id,
        "user_id": transaction.user_id,
        "amount": transaction.amount,
        "description": transaction.description,
        "category": transaction.category,
        "status": "processing",
        "timestamp": timestamp,
        "blockchain_status": "pending"
    }

    demo_data["transactions"].append(new_transaction)
    demo_data["stats"]["total_transactions"] += 1

    # Simulate fraud detection
    if transaction.amount > 10000:
        demo_data["stats"]["fraud_alerts"] += 1
        new_transaction["fraud_alert"] = True

    return {
        "data": new_transaction,
        "message": "Transaction created successfully",
        "flow_status": {
            "frontend_received": True,
            "backend_processing": True,
            "fraud_detection": "completed" if transaction.amount > 10000 else "passed",
            "blockchain_pending": True
        }
    }

@app.get("/api/v1/demo/transactions")
async def get_transactions():
    """Get all demo transactions"""
    return {
        "data": demo_data["transactions"],
        "message": f"Retrieved {len(demo_data['transactions'])} transactions"
    }

@app.post("/api/v1/demo/fraud-detect")
async def fraud_detection(transaction_id: int):
    """Simulate fraud detection on a transaction"""
    transaction = next((t for t in demo_data["transactions"] if t["id"] == transaction_id), None)

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    # Simulate fraud detection process
    time.sleep(1)  # Simulate processing time

    risk_score = 0.1 + (transaction["amount"] / 100000)  # Higher amount = higher risk
    is_fraudulent = risk_score > 0.7

    if is_fraudulent:
        demo_data["stats"]["fraud_alerts"] += 1
        transaction["fraud_alert"] = True
        transaction["status"] = "flagged"

    return {
        "data": {
            "transaction_id": transaction_id,
            "risk_score": risk_score,
            "is_fraudulent": is_fraudulent,
            "status": transaction["status"],
            "recommendation": "block" if is_fraudulent else "approve"
        },
        "message": "Fraud detection completed",
        "flow_status": {
            "frontend_request": True,
            "backend_processing": True,
            "ai_analysis": True,
            "blockchain_verification": "pending"
        }
    }

@app.get("/api/v1/demo/flow-status")
async def get_flow_status():
    """Get current data flow status"""
    return {
        "data": {
            "authentication": {
                "status": "active",
                "last_activity": datetime.now().isoformat(),
                "active_users": demo_data["stats"]["active_users"]
            },
            "data_processing": {
                "status": "active",
                "transactions_processed": demo_data["stats"]["total_transactions"],
                "fraud_alerts": demo_data["stats"]["fraud_alerts"]
            },
            "blockchain": {
                "status": "simulated",
                "canisters": ["helix_backend", "helix_frontend"],
                "last_sync": datetime.now().isoformat()
            },
            "real_time": {
                "status": "active",
                "websocket_connections": demo_data["stats"]["active_users"],
                "updates_per_second": 2
            }
        },
        "message": "Data flow status retrieved",
        "system_health": demo_data["stats"]["system_health"]
    }

@app.get("/api/v1/demo/reset")
async def reset_demo():
    """Reset demo data"""
    demo_data["transactions"] = []
    demo_data["stats"] = {
        "total_transactions": 0,
        "fraud_alerts": 0,
        "active_users": 0,
        "system_health": 100
    }

    return {
        "message": "Demo data reset successfully",
        "data": demo_data["stats"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
