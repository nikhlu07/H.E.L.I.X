"""
A simple script to demonstrate the FraudDetectionService without running the FastAPI server.

This script initializes the service, creates sample claims, and prints the analysis results.
To run: `python run_engine_demo.py`

Note: This requires Ollama to be running with the necessary models, as the MLFraudDetector
will be called directly.
"""

import asyncio
from datetime import datetime

# Import the main service and data model from your application
from main import FraudDetectionService, ClaimData

def print_header(title):
    """Prints a formatted header to the console."""
    print("\n" + "="*60)
    print(f"{title:^60}")
    print("="*60)

def print_analysis(fraud_score):
    """Prints the fraud analysis result in a readable format."""
    if not fraud_score:
        print("Analysis failed.")
        return

    print(f"Claim ID:       {fraud_score.claim_id}")
    print(f"Risk Level:     {fraud_score.risk_level.upper()}")
    print(f"Final Score:    {fraud_score.score}/100")
    print(f"Flags Triggered:  {', '.join(fraud_score.flags) if fraud_score.flags else 'None'}")
    print(f"Confidence:     {fraud_score.confidence:.2%}")
    print(f"Analysis Time:  {fraud_score.analysis_time_ms:.2f} ms")
    print("\n--- Reasoning ---")
    print(fraud_score.reasoning)


async def main():
    """Main function to set up the engine and run the demo."""
    print("Initializing the Hybrid Fraud Detection Engine...")
    # 1. Set up the fraud engine service
    # This loads the historical data automatically
    fraud_service = FraudDetectionService()
    print("Engine initialized successfully.")

    # 2. Define a low-risk sample claim
    low_risk_claim = ClaimData(
        claim_id=101,
        vendor_id="vendor_5",       # An established vendor from demo data
        amount=75234.90,          # A specific, non-round amount
        budget_id=3,
        allocation_id=1,
        invoice_hash="inv_lr_101",
        deputy_id="deputy_3",
        area="Road Construction",  # A common area
        timestamp=datetime.now()
    )

    # 3. Define a high-risk sample claim
    high_risk_claim = ClaimData(
        claim_id=202,
        vendor_id="vendor_new_99", # A brand new vendor
        amount=9500000.00,         # An extremely high, round amount
        budget_id=1,
        allocation_id=1,
        invoice_hash="inv_hr_202",
        deputy_id="deputy_1",
        area="Educational Technology", # An area with potentially lower costs
        timestamp=datetime.now()
    )

    # --- Run Analysis for Low-Risk Claim ---
    print_header("Analyzing Low-Risk Claim")
    low_risk_result = await fraud_service.analyze_claim(low_risk_claim)
    print_analysis(low_risk_result)

    # --- Run Analysis for High-Risk Claim ---
    print_header("Analyzing High-Risk Claim")
    high_risk_result = await fraud_service.analyze_claim(high_risk_claim)
    print_analysis(high_risk_result)


if __name__ == "__main__":
    # Ensure you have Ollama running before executing this script.
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"\n[ERROR] An error occurred: {e}")
        print("Please ensure your Ollama instance is running and accessible with the required models (gemma:latest, nomic-embed-text).")
