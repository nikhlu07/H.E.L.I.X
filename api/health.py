import json
import sys
import os

# Add the parent directory to the path so we can import from the main API
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import main as api_main

def handler(request):
    """Handler for /api/health endpoint"""
    request.path = '/api/health'
    return api_main(request)
