import json
import os
from typing import Dict, Any

def handler(event, context):
    """Main API handler for Vercel serverless functions"""

    # Get the path from the request
    path = event.get('path', '/').lstrip('/')

    # Route to appropriate handler
    if path.startswith('api/'):
        return handle_api_request(path, event, context)
    else:
        return handle_frontend_request(path, event, context)

def handle_api_request(path: str, event: dict, context) -> dict:
    """Handle API requests"""

    # Remove 'api/' prefix
    api_path = path[4:] if path.startswith('api/') else path

    if api_path == 'health':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'status': 'healthy', 'message': 'Helix API is running'})
        }

    elif api_path == 'demo':
        return handle_demo_api(event)

    elif api_path == 'hierarchical':
        return handle_hierarchical_api(event)

    else:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'API endpoint not found'})
        }

def handle_demo_api(event: dict) -> dict:
    """Handle demo API requests"""

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'Demo API endpoint',
                'data': {
                    'governments': ['Main Government', 'State Government', 'Local Government'],
                    'transactions': 1250,
                    'budget_allocated': 2500000
                }
            })
        }

    elif method == 'POST':
        # Handle demo data submission
        body = json.loads(event.get('body', '{}'))
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'Demo data received',
                'received_data': body
            })
        }

def handle_hierarchical_api(event: dict) -> dict:
    """Handle hierarchical data flow API"""

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'hierarchy': {
                    'main_government': {
                        'name': 'Main Government',
                        'budget': 10000000,
                        'children': ['state_government']
                    },
                    'state_government': {
                        'name': 'State Government',
                        'budget': 5000000,
                        'children': ['deputy_government']
                    },
                    'deputy_government': {
                        'name': 'Deputy Government',
                        'budget': 1000000,
                        'children': ['vendor']
                    }
                },
                'transactions': [
                    {
                        'id': 'TXN001',
                        'from': 'main_government',
                        'to': 'state_government',
                        'amount': 5000000,
                        'status': 'approved'
                    }
                ]
            })
        }

def handle_frontend_request(path: str, event: dict, context) -> dict:
    """Handle frontend requests - serve index.html for SPA routing"""

    # For any frontend route, serve the main index.html
    # This enables client-side routing

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html',
            'Cache-Control': 'public, max-age=0, must-revalidate'
        },
        'body': get_index_html()
    }

def get_index_html() -> str:
    """Get the built index.html content"""

    try:
        with open('frontend/dist/index.html', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return '<html><body><h1>Frontend not built yet. Run npm run build</h1></body></html>'
