#!/usr/bin/env python3
"""
Helix Data Flow Demo API
Run this to start the demo backend server
"""

import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from demo_api import app
    import uvicorn

    print("🚀 Starting Helix Data Flow Demo API...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔄 Press Ctrl+C to stop the server")
    print("-" * 50)

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

except KeyboardInterrupt:
    print("\n🛑 Server stopped by user")
except Exception as e:
    print(f"❌ Error starting server: {e}")
    print("Make sure you have installed the requirements:")
    print("pip install -r backend/requirements.txt")
