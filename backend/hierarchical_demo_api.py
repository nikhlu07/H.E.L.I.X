from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import json
import time
from datetime import datetime

app = FastAPI(title="Helix Hierarchical Data Flow Demo API")

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5175"],
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
    target_level: Optional[str] = None  # For hierarchical flow

class BudgetAllocation(BaseModel):
    from_role: str
    to_role: str
    amount: float
    project_name: str
    description: str

# In-memory storage for demo with hierarchical structure
demo_data = {
    "transactions": [],
    "budget_allocations": [],
    "role_data": {
        "main_government": {
            "total_budget": 1000000,
            "allocated_budget": 0,
            "pending_approvals": [],
            "sent_data": []
        },
        "state_head": {
            "received_budget": 0,
            "allocated_budget": 0,
            "pending_approvals": [],
            "received_data": [],
            "sent_data": []
        },
        "deputy": {
            "received_budget": 0,
            "allocated_budget": 0,
            "received_data": [],
            "processed_claims": []
        },
        "vendor": {
            "submitted_claims": [],
            "received_payments": []
        },
        "citizen": {
            "reports_submitted": [],
            "transparency_data": []
        }
    },
    "stats": {
        "total_transactions": 0,
        "fraud_alerts": 0,
        "active_users": 0,
        "system_health": 100,
        "hierarchical_flows": 0
    }
}

@app.get("/")
async def root():
    return {"message": "Helix Hierarchical Data Flow Demo API", "status": "running"}

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

@app.get("/api/v1/demo/role-data/{role}")
async def get_role_data(role: str):
    """Get role-specific data"""
    if role not in demo_data["role_data"]:
        raise HTTPException(status_code=404, detail="Role not found")
    
    return {
        "data": demo_data["role_data"][role],
        "message": f"Role data for {role} retrieved successfully"
    }

@app.post("/api/v1/demo/budget-allocation")
async def create_budget_allocation(allocation: BudgetAllocation):
    """Create a budget allocation from main government to state/deputy"""
    timestamp = datetime.now().isoformat()
    
    # Validate hierarchy flow
    valid_flows = {
        "main_government": ["state_head"],
        "state_head": ["deputy"],
        "deputy": ["vendor"]
    }
    
    if allocation.from_role not in valid_flows or allocation.to_role not in valid_flows.get(allocation.from_role, []):
        raise HTTPException(status_code=400, detail="Invalid hierarchical flow")
    
    # Check if sender has enough budget
    from_role_data = demo_data["role_data"][allocation.from_role]
    available_budget = from_role_data["total_budget"] - from_role_data["allocated_budget"]
    
    if allocation.amount > available_budget:
        raise HTTPException(status_code=400, detail="Insufficient budget")
    
    allocation_id = len(demo_data["budget_allocations"]) + 1
    
    new_allocation = {
        "id": allocation_id,
        "from_role": allocation.from_role,
        "to_role": allocation.to_role,
        "amount": allocation.amount,
        "project_name": allocation.project_name,
        "description": allocation.description,
        "status": "approved",
        "timestamp": timestamp,
        "flow_type": "budget_allocation"
    }
    
    # Update sender's data
    demo_data["role_data"][allocation.from_role]["allocated_budget"] += allocation.amount
    demo_data["role_data"][allocation.from_role]["sent_data"].append(new_allocation)
    
    # Update receiver's data
    if "received_budget" in demo_data["role_data"][allocation.to_role]:
        demo_data["role_data"][allocation.to_role]["received_budget"] += allocation.amount
    demo_data["role_data"][allocation.to_role]["received_data"].append(new_allocation)
    
    demo_data["budget_allocations"].append(new_allocation)
    demo_data["stats"]["hierarchical_flows"] += 1
    demo_data["stats"]["total_transactions"] += 1
    
    return {
        "data": new_allocation,
        "message": f"Budget allocated from {allocation.from_role} to {allocation.to_role}",
        "flow_status": {
            "sender_updated": True,
            "receiver_updated": True,
            "hierarchy_flow": f"{allocation.from_role} → {allocation.to_role}",
            "remaining_budget": available_budget - allocation.amount
        }
    }

@app.post("/api/v1/demo/transaction")
async def create_transaction(transaction: TransactionData):
    """Create a demo transaction with hierarchical flow"""
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
        "blockchain_status": "pending",
        "hierarchical_flow": []
    }

    # Determine hierarchical flow based on user role
    user_role = transaction.user_id.split('-')[1] if '-' in transaction.user_id else "unknown"
    
    if user_role == "main_government":
        new_transaction["hierarchical_flow"] = ["main_government", "state_head", "deputy"]
        new_transaction["current_level"] = "main_government"
        new_transaction["next_level"] = "state_head"
    elif user_role == "state_head":
        new_transaction["hierarchical_flow"] = ["state_head", "deputy", "vendor"]
        new_transaction["current_level"] = "state_head"
        new_transaction["next_level"] = "deputy"
    elif user_role == "deputy":
        new_transaction["hierarchical_flow"] = ["deputy", "vendor"]
        new_transaction["current_level"] = "deputy"
        new_transaction["next_level"] = "vendor"
    else:
        new_transaction["hierarchical_flow"] = [user_role]
        new_transaction["current_level"] = user_role
        new_transaction["next_level"] = None

    demo_data["transactions"].append(new_transaction)
    demo_data["stats"]["total_transactions"] += 1

    # Simulate fraud detection
    if transaction.amount > 10000:
        demo_data["stats"]["fraud_alerts"] += 1
        new_transaction["fraud_alert"] = True

    return {
        "data": new_transaction,
        "message": "Transaction created with hierarchical flow",
        "flow_status": {
            "frontend_received": True,
            "backend_processing": True,
            "fraud_detection": "completed" if transaction.amount > 10000 else "passed",
            "blockchain_pending": True,
            "hierarchical_flow": new_transaction["hierarchical_flow"],
            "current_level": new_transaction["current_level"],
            "next_level": new_transaction["next_level"]
        }
    }

@app.get("/api/v1/demo/transactions")
async def get_transactions():
    """Get all demo transactions"""
    return {
        "data": demo_data["transactions"],
        "message": f"Retrieved {len(demo_data['transactions'])} transactions"
    }

@app.get("/api/v1/demo/hierarchical-flow")
async def get_hierarchical_flow():
    """Get current hierarchical data flow status"""
    return {
        "data": {
            "government_hierarchy": {
                "main_government": {
                    "total_budget": demo_data["role_data"]["main_government"]["total_budget"],
                    "allocated": demo_data["role_data"]["main_government"]["allocated_budget"],
                    "remaining": demo_data["role_data"]["main_government"]["total_budget"] - demo_data["role_data"]["main_government"]["allocated_budget"],
                    "sent_allocations": len(demo_data["role_data"]["main_government"]["sent_data"])
                },
                "state_head": {
                    "received_budget": demo_data["role_data"]["state_head"]["received_budget"],
                    "allocated": demo_data["role_data"]["state_head"]["allocated_budget"],
                    "received_items": len(demo_data["role_data"]["state_head"]["received_data"]),
                    "sent_items": len(demo_data["role_data"]["state_head"]["sent_data"])
                },
                "deputy": {
                    "received_budget": demo_data["role_data"]["deputy"]["received_budget"],
                    "allocated": demo_data["role_data"]["deputy"]["allocated_budget"],
                    "received_items": len(demo_data["role_data"]["deputy"]["received_data"])
                }
            },
            "flow_summary": {
                "total_hierarchical_flows": demo_data["stats"]["hierarchical_flows"],
                "active_levels": ["main_government", "state_head", "deputy"],
                "flow_direction": "top_down"
            }
        },
        "message": "Hierarchical flow status retrieved"
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
                "fraud_alerts": demo_data["stats"]["fraud_alerts"],
                "hierarchical_flows": demo_data["stats"]["hierarchical_flows"]
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
            },
            "hierarchy": {
                "government_levels": 3,
                "active_flows": demo_data["stats"]["hierarchical_flows"],
                "flow_direction": "main_government → state_head → deputy → vendor"
            }
        },
        "message": "Data flow status retrieved",
        "system_health": demo_data["stats"]["system_health"]
    }

@app.get("/api/v1/demo/reset")
async def reset_demo():
    """Reset demo data"""
    demo_data["transactions"] = []
    demo_data["budget_allocations"] = []
    demo_data["role_data"]["main_government"]["allocated_budget"] = 0
    demo_data["role_data"]["main_government"]["sent_data"] = []
    demo_data["role_data"]["state_head"]["received_budget"] = 0
    demo_data["role_data"]["state_head"]["received_data"] = []
    demo_data["role_data"]["state_head"]["sent_data"] = []
    demo_data["role_data"]["deputy"]["received_budget"] = 0
    demo_data["role_data"]["deputy"]["received_data"] = []
    demo_data["stats"] = {
        "total_transactions": 0,
        "fraud_alerts": 0,
        "active_users": 0,
        "system_health": 100,
        "hierarchical_flows": 0
    }

    return {
        "message": "Demo data reset successfully",
        "data": demo_data["stats"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
