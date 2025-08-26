#!/usr/bin/env python3
"""
Start script for CorruptGuard Backend
Handles environment setup and server startup
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    # Get the project root directory
    project_root = Path(__file__).parent
    backend_dir = project_root / "backend"
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    # Set environment variables
    env = os.environ.copy()
    env.update({
        'PYTHONPATH': str(backend_dir),
        'ENVIRONMENT': 'development',
        'DEBUG': 'true',
        'HOST': '0.0.0.0',
        'PORT': '8000',
        'ICP_CANISTER_ID': 'rdmx6-jaaaa-aaaah-qcaiq-cai',  # Demo canister ID
        'demo_mode': 'true'
    })
    
    print("🚀 Starting CorruptGuard Backend...")
    print(f"📁 Working directory: {backend_dir}")
    print(f"🌐 Server will be available at: http://localhost:8000")
    print(f"🔧 Debug mode: {env.get('DEBUG', 'false')}")
    print(f"🔗 ICP Canister ID: {env.get('ICP_CANISTER_ID')}")
    print("-" * 50)
    
    try:
        # Start the FastAPI server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload",
            "--log-level", "info"
        ], env=env, check=True)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
