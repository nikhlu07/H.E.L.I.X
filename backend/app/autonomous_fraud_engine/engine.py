import asyncio
import logging
import random
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import all the components using relative imports
from .data.types import Transaction
from .core.guards import AutonomousTransactionGuard
from .core.self_healing import SelfHealingFraudPipeline
from .core.resource_manager import AutonomousResourceManager
from .core.security import AutonomousSecurityManager
from .core.audit import AutonomousAuditManager

async def simulate_fraud_engine():
    """
    Simulates the autonomous fraud detection engine's operations.
    """
    logger.info("🚀 Starting H.E.L.I.X. Autonomous Fraud Engine Simulation")

    # Instantiate core components
    transaction_guard = AutonomousTransactionGuard()
    self_healing_pipeline = SelfHealingFraudPipeline()
    resource_manager = AutonomousResourceManager()
    security_manager = AutonomousSecurityManager()
    audit_manager = AutonomousAuditManager()

    logger.info("✅ Core components instantiated.")

    # --- Simulation Loop ---
    for i in range(5): # Simulate 5 cycles
        logger.info(f"--- Cycle {i+1}/5 ---")

        # 1. Simulate a new incoming transaction
        new_transaction = Transaction(
            transaction_id=f"txn_{int(datetime.now().timestamp())}_{i}",
            vendor=f"vendor_{random.choice(['A', 'B', 'C'])}_{random.randint(1,100)}",
            amount=random.uniform(50000, 20000000),
            description="Simulated procurement transaction",
            timestamp=datetime.now(),
            status="pending"
        )
        logger.info(f"📥 New transaction received: {new_transaction.transaction_id} for ₹{new_transaction.amount:,.2f}")

        # 2. Autonomous Transaction Screening
        await transaction_guard.autonomous_transaction_screening(new_transaction.__dict__)
        await asyncio.sleep(0.5)

        # 3. Periodic System Health Check & Self-Healing
        if i % 2 == 0: # Run every other cycle
            logger.info("🩺 Performing autonomous health check...")
            await self_healing_pipeline.autonomous_health_check()
            await asyncio.sleep(1)

        # 4. Periodic Resource Management
        if i % 3 == 0: # Run every third cycle
            logger.info("⚙️ Performing autonomous resource scaling...")
            await resource_manager.autonomous_scaling()
            await asyncio.sleep(0.5)

        # 5. Periodic Security Hardening
        if i % 4 == 0: # Run every fourth cycle
            logger.info("🛡️ Performing autonomous security hardening...")
            await security_manager.autonomous_security_hardening()
            await asyncio.sleep(1)

    # --- Final Report ---
    logger.info("📊 Generating final audit report...")
    final_report = await audit_manager.generate_audit_report(time_period="simulation")
    logger.info(f"--- Audit Report ---")
    for key, value in final_report.items():
        if isinstance(value, dict):
            logger.info(f"  {key}:")
            for sub_key, sub_value in value.items():
                logger.info(f"    {sub_key}: {sub_value}")
        else:
            logger.info(f"  {key}: {value}")
    logger.info("--- End of Report ---")

    logger.info("🏁 H.E.L.I.X. Simulation Finished")

if __name__ == "__main__":
    # This script is designed to be run as a module from the parent directory.
    # Example: python -m autonomous_fraud_engine.engine
    try:
        asyncio.run(simulate_fraud_engine())
    except ImportError as e:
        logger.error(f"ImportError: {e}")
        logger.error("Please run this script as a module from the project's root directory.")
        logger.error("Example: python -m autonomous_fraud_engine.engine")
