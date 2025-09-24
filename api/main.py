import json
from typing import Dict, Any

def main(request):
    """Main API handler for Vercel serverless functions"""

    # Handle CORS
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }

    # Handle preflight requests
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': headers,
            'body': ''
        }

    try:
        # Get request body for POST requests
        if request.method == 'POST':
            body = request.get('body', '{}')
            if isinstance(body, str):
                data = json.loads(body)
            else:
                data = body
        else:
            data = {}

        # Route to appropriate handler
        if request.path == '/api/health':
            return {
                'statusCode': 200,
                'headers': {**headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'status': 'healthy',
                    'message': 'Helix API is running on Vercel',
                    'timestamp': '2024-12-19T12:00:00Z'
                })
            }

        elif request.path == '/api/demo':
            return handle_demo_api(request, data, headers)

        elif request.path == '/api/hierarchical':
            return handle_hierarchical_api(request, data, headers)

        else:
            return {
                'statusCode': 404,
                'headers': {**headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'API endpoint not found'})
            }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {**headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }

def handle_demo_api(request, data: dict, headers: dict) -> dict:
    """Handle demo API requests"""

    if request.method == 'GET':
        return {
            'statusCode': 200,
            'headers': {**headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'Demo API endpoint',
                'data': {
                    'governments': ['Main Government', 'State Government', 'Local Government'],
                    'transactions': 1250,
                    'budget_allocated': 2500000,
                    'fraud_detected': 5
                }
            })
        }

    elif request.method == 'POST':
        # Handle demo data submission
        return {
            'statusCode': 200,
            'headers': {**headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'Demo data received',
                'received_data': data,
                'processed': True
            })
        }

def handle_hierarchical_api(request, data: dict, headers: dict) -> dict:
    """Handle hierarchical data flow API"""

    if request.method == 'GET':
        return {
            'statusCode': 200,
            'headers': {**headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'hierarchy': {
                    'main_government': {
                        'name': 'Main Government',
                        'budget': 10000000,
                        'allocated': 7500000,
                        'remaining': 2500000,
                        'children': ['state_government']
                    },
                    'state_government': {
                        'name': 'State Government',
                        'budget': 5000000,
                        'allocated': 3000000,
                        'remaining': 2000000,
                        'children': ['deputy_government']
                    },
                    'deputy_government': {
                        'name': 'Deputy Government',
                        'budget': 1000000,
                        'allocated': 500000,
                        'remaining': 500000,
                        'children': ['vendor']
                    }
                },
                'transactions': [
                    {
                        'id': 'TXN001',
                        'from': 'main_government',
                        'to': 'state_government',
                        'amount': 5000000,
                        'status': 'approved',
                        'timestamp': '2024-12-19T10:00:00Z'
                    },
                    {
                        'id': 'TXN002',
                        'from': 'state_government',
                        'to': 'deputy_government',
                        'amount': 1000000,
                        'status': 'pending',
                        'timestamp': '2024-12-19T11:00:00Z'
                    }
                ],
                'stats': {
                    'total_budget': 16000000,
                    'allocated': 10500000,
                    'remaining': 5500000,
                    'transactions_count': 2
                }
            })
        }

    elif request.method == 'POST':
        # Handle hierarchical data submission
        return {
            'statusCode': 200,
            'headers': {**headers, 'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'Hierarchical data processed',
                'data': data,
                'status': 'success'
            })
        }
