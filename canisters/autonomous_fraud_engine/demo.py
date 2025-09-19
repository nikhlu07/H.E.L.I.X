import asyncio
import logging

# To run this demo, execute the following command from the project's root directory:
# python -m canisters.autonomous_fraud_engine.demo

# This ensures that all relative imports within the package work correctly.

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import the main simulation engine from the package
from .engine import simulate_fraud_engine
import asyncio

async def main():
    """
    Main function to run the autonomous fraud engine simulation.
    """
    logger.info("=================================================")
    logger.info("    🚀 LAUNCHING H.E.L.I.X. DEMONSTRATION    ")
    logger.info("=================================================")

    await simulate_fraud_engine()

    logger.info("=================================================")
    logger.info("    ✅ DEMONSTRATION COMPLETE    ")
    logger.info("=================================================")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except ImportError as e:
        logger.error(f"ImportError: {e}")
        logger.error("Please run this script as a module from the project's root directory (H.E.L.I.X).")
        logger.error("Example: python -m canisters.autonomous_fraud_engine.demo")
    except Exception as e:
        logger.error(f"An unexpected error occurred during the simulation: {e}", exc_info=True)
