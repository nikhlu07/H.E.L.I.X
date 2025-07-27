"""
CorruptGuard Request Validation Middleware
Enhanced request validation and sanitization
"""

import re
import json
from typing import Any, Dict, List, Optional
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.utils.exceptions import ValidationError
from app.utils.logging import get_logger, log_security_event

logger = get_logger(__name__)


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """
    Request validation and sanitization middleware
    """
    
    # Security patterns to detect malicious content
    SECURITY_PATTERNS = {
        'sql_injection': [
            r'(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)',
            r'\b(drop|delete|insert|update)\s+(table|from|into)',
            r'(\bor\b|\band\b).*[\'"][^\'"]*(=|like)',
            r'[\'"];?\s*(drop|delete|insert|update|select)',
        ],
        'xss': [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on(load|error|click|mouseover)\s*=',
            r'<iframe[^>]*>.*?</iframe>',
        ],
        'path_traversal': [
            r'\.\./|\.\.\%2f',
            r'%2e%2e%2f|%2e%2e/',
            r'\.\.\\|\.\.%5c',
        ],
        'command_injection': [
            r'[;&|`$]',
            r'\b(cat|ls|pwd|whoami|id|ps|kill)\b',
            r'>[>\s]*(/dev/null|/tmp)',
        ]
    }
    
    # Suspicious user agents
    SUSPICIOUS_USER_AGENTS = [
        'sqlmap', 'nikto', 'nmap', 'dirb', 'burpsuite',
        'metasploit', 'havij', 'w3af', 'acunetix'
    ]
    
    # Rate limiting (simple in-memory implementation)
    request_counts = {}
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Validate and sanitize incoming requests
        """
        
        # Perform security validations
        await self.validate_request_security(request)
        
        # Validate content type for POST/PUT requests
        if request.method in ["POST", "PUT", "PATCH"]:
            await self.validate_content_type(request)
        
        # Validate request size
        await self.validate_request_size(request)
        
        # Check rate limiting
        await self.check_rate_limiting(request)
        
        # Process the request
        response = await call_next(request)
        
        # Add security headers to response
        self.add_security_headers(response)
        
        return response
    
    async def validate_email(email: str) -> bool:
    """
    Validate email format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}request_security(self, request: Request) -> None:
        """
        Validate request for security threats
        """
        
        client_ip = self.get_client_ip(request)
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Check for suspicious user agents
        for suspicious_agent in self.SUSPICIOUS_USER_AGENTS:
            if suspicious_agent in user_agent:
                log_security_event(
                    event_type="SUSPICIOUS_USER_AGENT",
                    description=f"Suspicious user agent detected: {user_agent}",
                    client_ip=client_ip,
                    severity="high"
                )
                raise ValidationError("Invalid user agent")
        
        # Check URL path for malicious patterns
        path = str(request.url.path)
        query = str(request.url.query) if request.url.query else ""
        
        for threat_type, patterns in self.SECURITY_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, path + query, re.IGNORECASE):
                    log_security_event(
                        event_type=f"SECURITY_THREAT_{threat_type.upper()}",
                        description=f"Malicious pattern detected in URL: {pattern}",
                        client_ip=client_ip,
                        severity="critical"
                    )
                    raise ValidationError(f"Invalid request: security violation detected")
        
        # Validate headers
        await self.validate_headers(request)
    
    async def validate_headers(self, request: Request) -> None:
        """
        Validate request headers
        """
        
        headers = request.headers
        client_ip = self.get_client_ip(request)
        
        # Check for oversized headers
        for name, value in headers.items():
            if len(name) > 100:
                raise ValidationError(f"Header name too long: {name[:50]}...")
            if len(value) > 8192:  # 8KB limit
                raise ValidationError(f"Header value too long: {name}")
        
        # Validate Content-Length
        content_length = headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > 10 * 1024 * 1024:  # 10MB limit
                    raise ValidationError("Request body too large")
            except ValueError:
                raise ValidationError("Invalid Content-Length header")
        
        # Check for potential header injection
        for name, value in headers.items():
            if '\n' in value or '\r' in value:
                log_security_event(
                    event_type="HEADER_INJECTION",
                    description=f"Header injection attempt in {name}",
                    client_ip=client_ip,
                    severity="high"
                )
                raise ValidationError("Invalid header format")
    
    async def validate_content_type(self, request: Request) -> None:
        """
        Validate content type for requests with body
        """
        
        content_type = request.headers.get("content-type", "")
        
        # List of allowed content types
        allowed_types = [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain"
        ]
        
        # Check if content type is allowed
        if not any(allowed in content_type for allowed in allowed_types):
            raise ValidationError(f"Unsupported content type: {content_type}")
    
    async def validate_request_size(self, request: Request) -> None:
        """
        Validate request size limits
        """
        
        # Check URL length
        if len(str(request.url)) > 2048:  # 2KB URL limit
            raise ValidationError("URL too long")
        
        # Check query parameter count
        if len(request.query_params) > 50:
            raise ValidationError("Too many query parameters")
        
        # Validate individual query parameters
        for key, value in request.query_params.items():
            if len(key) > 100:
                raise ValidationError(f"Query parameter name too long: {key[:50]}...")
            if len(value) > 1000:
                raise ValidationError(f"Query parameter value too long: {key}")
    
    async def check_rate_limiting(self, request: Request) -> None:
        """
        Simple rate limiting check
        """
        
        client_ip = self.get_client_ip(request)
        
        # Simple rate limiting (in production, use Redis or similar)
        from datetime import datetime, timedelta
        
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=1)
        
        # Clean old entries
        self.request_counts = {
            ip: [(timestamp, count) for timestamp, count in requests 
                 if timestamp > window_start]
            for ip, requests in self.request_counts.items()
        }
        
        # Count requests for this IP
        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []
        
        self.request_counts[client_ip].append((now, 1))
        
        # Check if rate limit exceeded
        total_requests = sum(count for _, count in self.request_counts[client_ip])
        
        if total_requests > 100:  # 100 requests per minute
            log_security_event(
                event_type="RATE_LIMIT_EXCEEDED",
                description=f"Rate limit exceeded: {total_requests} requests",
                client_ip=client_ip,
                severity="medium"
            )
            raise ValidationError("Rate limit exceeded. Please try again later.")
    
    def add_security_headers(self, response: Response) -> None:
        """
        Add security headers to response
        """
        
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
            "X-Permitted-Cross-Domain-Policies": "none"
        }
        
        for header, value in security_headers.items():
            response.headers[header] = value
    
    def get_client_ip(self, request: Request) -> str:
        """
        Extract client IP address from request
        """
        # Check for forwarded IP first
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        # Check for real IP
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        # Fall back to client host
        if request.client:
            return request.client.host
        
        return "unknown"


class RequestBodyValidationMiddleware(BaseHTTPMiddleware):
    """
    Request body validation middleware
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Validate request body content
        """
        
        if request.method in ["POST", "PUT", "PATCH"]:
            await self.validate_request_body(request)
        
        return await call_next(request)
    
    async def validate_request_body(self, request: Request) -> None:
        """
        Validate request body for security and format
        """
        
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            await self.validate_json_body(request)
        elif "multipart/form-data" in content_type:
            await self.validate_multipart_body(request)
    
    async def validate_json_body(self, request: Request) -> None:
        """
        Validate JSON request body
        """
        
        try:
            # Try to read and parse the body
            body = await request.body()
            
            if len(body) > 1024 * 1024:  # 1MB limit for JSON
                raise ValidationError("JSON body too large")
            
            if body:
                try:
                    json_data = json.loads(body)
                    await self.validate_json_content(json_data, request)
                except json.JSONDecodeError as e:
                    raise ValidationError(f"Invalid JSON format: {str(e)}")
        
        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            logger.error(f"Error validating JSON body: {str(e)}")
    
    async def validate_json_content(self, data: Any, request: Request) -> None:
        """
        Validate JSON content for security threats
        """
        
        def check_value(value: Any, path: str = "") -> None:
            if isinstance(value, str):
                # Check for malicious patterns in string values
                for threat_type, patterns in RequestValidationMiddleware.SECURITY_PATTERNS.items():
                    for pattern in patterns:
                        if re.search(pattern, value, re.IGNORECASE):
                            log_security_event(
                                event_type=f"JSON_THREAT_{threat_type.upper()}",
                                description=f"Malicious pattern in JSON at {path}: {pattern}",
                                client_ip=self.get_client_ip(request),
                                severity="high"
                            )
                            raise ValidationError(f"Invalid content in field: {path}")
                
                # Check string length
                if len(value) > 10000:  # 10KB string limit
                    raise ValidationError(f"String too long in field: {path}")
            
            elif isinstance(value, dict):
                if len(value) > 100:  # Max 100 keys per object
                    raise ValidationError(f"Too many keys in object: {path}")
                
                for key, val in value.items():
                    if len(str(key)) > 100:  # Max key length
                        raise ValidationError(f"Key too long: {path}.{str(key)[:50]}...")
                    check_value(val, f"{path}.{key}" if path else key)
            
            elif isinstance(value, list):
                if len(value) > 1000:  # Max 1000 items per array
                    raise ValidationError(f"Array too long: {path}")
                
                for i, item in enumerate(value):
                    check_value(item, f"{path}[{i}]")
        
        check_value(data)
    
    async def validate_multipart_body(self, request: Request) -> None:
        """
        Validate multipart form data
        """
        
        # Basic validation for multipart data
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > 50 * 1024 * 1024:  # 50MB limit for multipart
                    raise ValidationError("Multipart body too large")
            except ValueError:
                raise ValidationError("Invalid Content-Length for multipart")
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"


# Validation utility functions
def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Sanitize string input
    """
    if not isinstance(value, str):
        return str(value)
    
    # Remove potential XSS characters
    value = re.sub(r'[<>&"\']', '', value)
    
    # Limit length
    if len(value) > max_length:
        value = value[:max_length]
    
    return value.strip()


def validate_
    return bool(re.match(pattern, email))


def validate_phone(phone: str) -> bool:
    """
    Validate phone number format
    """
    # Basic phone validation (can be enhanced)
    pattern = r'^\+?[\d\s\-\(\)]{10,15}request_security(self, request: Request) -> None:
        """
        Validate request for security threats
        """
        
        client_ip = self.get_client_ip(request)
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Check for suspicious user agents
        for suspicious_agent in self.SUSPICIOUS_USER_AGENTS:
            if suspicious_agent in user_agent:
                log_security_event(
                    event_type="SUSPICIOUS_USER_AGENT",
                    description=f"Suspicious user agent detected: {user_agent}",
                    client_ip=client_ip,
                    severity="high"
                )
                raise ValidationError("Invalid user agent")
        
        # Check URL path for malicious patterns
        path = str(request.url.path)
        query = str(request.url.query) if request.url.query else ""
        
        for threat_type, patterns in self.SECURITY_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, path + query, re.IGNORECASE):
                    log_security_event(
                        event_type=f"SECURITY_THREAT_{threat_type.upper()}",
                        description=f"Malicious pattern detected in URL: {pattern}",
                        client_ip=client_ip,
                        severity="critical"
                    )
                    raise ValidationError(f"Invalid request: security violation detected")
        
        # Validate headers
        await self.validate_headers(request)
    
    async def validate_headers(self, request: Request) -> None:
        """
        Validate request headers
        """
        
        headers = request.headers
        client_ip = self.get_client_ip(request)
        
        # Check for oversized headers
        for name, value in headers.items():
            if len(name) > 100:
                raise ValidationError(f"Header name too long: {name[:50]}...")
            if len(value) > 8192:  # 8KB limit
                raise ValidationError(f"Header value too long: {name}")
        
        # Validate Content-Length
        content_length = headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > 10 * 1024 * 1024:  # 10MB limit
                    raise ValidationError("Request body too large")
            except ValueError:
                raise ValidationError("Invalid Content-Length header")
        
        # Check for potential header injection
        for name, value in headers.items():
            if '\n' in value or '\r' in value:
                log_security_event(
                    event_type="HEADER_INJECTION",
                    description=f"Header injection attempt in {name}",
                    client_ip=client_ip,
                    severity="high"
                )
                raise ValidationError("Invalid header format")
    
    async def validate_content_type(self, request: Request) -> None:
        """
        Validate content type for requests with body
        """
        
        content_type = request.headers.get("content-type", "")
        
        # List of allowed content types
        allowed_types = [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain"
        ]
        
        # Check if content type is allowed
        if not any(allowed in content_type for allowed in allowed_types):
            raise ValidationError(f"Unsupported content type: {content_type}")
    
    async def validate_request_size(self, request: Request) -> None:
        """
        Validate request size limits
        """
        
        # Check URL length
        if len(str(request.url)) > 2048:  # 2KB URL limit
            raise ValidationError("URL too long")
        
        # Check query parameter count
        if len(request.query_params) > 50:
            raise ValidationError("Too many query parameters")
        
        # Validate individual query parameters
        for key, value in request.query_params.items():
            if len(key) > 100:
                raise ValidationError(f"Query parameter name too long: {key[:50]}...")
            if len(value) > 1000:
                raise ValidationError(f"Query parameter value too long: {key}")
    
    async def check_rate_limiting(self, request: Request) -> None:
        """
        Simple rate limiting check
        """
        
        client_ip = self.get_client_ip(request)
        
        # Simple rate limiting (in production, use Redis or similar)
        from datetime import datetime, timedelta
        
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=1)
        
        # Clean old entries
        self.request_counts = {
            ip: [(timestamp, count) for timestamp, count in requests 
                 if timestamp > window_start]
            for ip, requests in self.request_counts.items()
        }
        
        # Count requests for this IP
        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []
        
        self.request_counts[client_ip].append((now, 1))
        
        # Check if rate limit exceeded
        total_requests = sum(count for _, count in self.request_counts[client_ip])
        
        if total_requests > 100:  # 100 requests per minute
            log_security_event(
                event_type="RATE_LIMIT_EXCEEDED",
                description=f"Rate limit exceeded: {total_requests} requests",
                client_ip=client_ip,
                severity="medium"
            )
            raise ValidationError("Rate limit exceeded. Please try again later.")
    
    def add_security_headers(self, response: Response) -> None:
        """
        Add security headers to response
        """
        
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
            "X-Permitted-Cross-Domain-Policies": "none"
        }
        
        for header, value in security_headers.items():
            response.headers[header] = value
    
    def get_client_ip(self, request: Request) -> str:
        """
        Extract client IP address from request
        """
        # Check for forwarded IP first
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        # Check for real IP
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        # Fall back to client host
        if request.client:
            return request.client.host
        
        return "unknown"


class RequestBodyValidationMiddleware(BaseHTTPMiddleware):
    """
    Request body validation middleware
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Validate request body content
        """
        
        if request.method in ["POST", "PUT", "PATCH"]:
            await self.validate_request_body(request)
        
        return await call_next(request)
    
    async def validate_request_body(self, request: Request) -> None:
        """
        Validate request body for security and format
        """
        
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            await self.validate_json_body(request)
        elif "multipart/form-data" in content_type:
            await self.validate_multipart_body(request)
    
    async def validate_json_body(self, request: Request) -> None:
        """
        Validate JSON request body
        """
        
        try:
            # Try to read and parse the body
            body = await request.body()
            
            if len(body) > 1024 * 1024:  # 1MB limit for JSON
                raise ValidationError("JSON body too large")
            
            if body:
                try:
                    json_data = json.loads(body)
                    await self.validate_json_content(json_data, request)
                except json.JSONDecodeError as e:
                    raise ValidationError(f"Invalid JSON format: {str(e)}")
        
        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            logger.error(f"Error validating JSON body: {str(e)}")
    
    async def validate_json_content(self, data: Any, request: Request) -> None:
        """
        Validate JSON content for security threats
        """
        
        def check_value(value: Any, path: str = "") -> None:
            if isinstance(value, str):
                # Check for malicious patterns in string values
                for threat_type, patterns in RequestValidationMiddleware.SECURITY_PATTERNS.items():
                    for pattern in patterns:
                        if re.search(pattern, value, re.IGNORECASE):
                            log_security_event(
                                event_type=f"JSON_THREAT_{threat_type.upper()}",
                                description=f"Malicious pattern in JSON at {path}: {pattern}",
                                client_ip=self.get_client_ip(request),
                                severity="high"
                            )
                            raise ValidationError(f"Invalid content in field: {path}")
                
                # Check string length
                if len(value) > 10000:  # 10KB string limit
                    raise ValidationError(f"String too long in field: {path}")
            
            elif isinstance(value, dict):
                if len(value) > 100:  # Max 100 keys per object
                    raise ValidationError(f"Too many keys in object: {path}")
                
                for key, val in value.items():
                    if len(str(key)) > 100:  # Max key length
                        raise ValidationError(f"Key too long: {path}.{str(key)[:50]}...")
                    check_value(val, f"{path}.{key}" if path else key)
            
            elif isinstance(value, list):
                if len(value) > 1000:  # Max 1000 items per array
                    raise ValidationError(f"Array too long: {path}")
                
                for i, item in enumerate(value):
                    check_value(item, f"{path}[{i}]")
        
        check_value(data)
    
    async def validate_multipart_body(self, request: Request) -> None:
        """
        Validate multipart form data
        """
        
        # Basic validation for multipart data
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > 50 * 1024 * 1024:  # 50MB limit for multipart
                    raise ValidationError("Multipart body too large")
            except ValueError:
                raise ValidationError("Invalid Content-Length for multipart")
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"


# Validation utility functions
def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Sanitize string input
    """
    if not isinstance(value, str):
        return str(value)
    
    # Remove potential XSS characters
    value = re.sub(r'[<>&"\']', '', value)
    
    # Limit length
    if len(value) > max_length:
        value = value[:max_length]
    
    return value.strip()


def validate_
    return bool(re.match(pattern, phone))


def validate_principal_id_format(principal_id: str) -> bool:
    """
    Validate ICP Principal ID format
    """
    if not principal_id or not isinstance(principal_id, str):
        return False
    
    if len(principal_id) < 10 or len(principal_id) > 100:
        return False
    
    if not principal_id.endswith("-cai"):
        return False
    
    # Check valid characters
    valid_chars = set("abcdefghijklmnopqrstuvwxyz234567-")
    return all(c.lower() in valid_chars for c in principal_id)request_security(self, request: Request) -> None:
        """
        Validate request for security threats
        """
        
        client_ip = self.get_client_ip(request)
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Check for suspicious user agents
        for suspicious_agent in self.SUSPICIOUS_USER_AGENTS:
            if suspicious_agent in user_agent:
                log_security_event(
                    event_type="SUSPICIOUS_USER_AGENT",
                    description=f"Suspicious user agent detected: {user_agent}",
                    client_ip=client_ip,
                    severity="high"
                )
                raise ValidationError("Invalid user agent")
        
        # Check URL path for malicious patterns
        path = str(request.url.path)
        query = str(request.url.query) if request.url.query else ""
        
        for threat_type, patterns in self.SECURITY_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, path + query, re.IGNORECASE):
                    log_security_event(
                        event_type=f"SECURITY_THREAT_{threat_type.upper()}",
                        description=f"Malicious pattern detected in URL: {pattern}",
                        client_ip=client_ip,
                        severity="critical"
                    )
                    raise ValidationError(f"Invalid request: security violation detected")
        
        # Validate headers
        await self.validate_headers(request)
    
    async def validate_headers(self, request: Request) -> None:
        """
        Validate request headers
        """
        
        headers = request.headers
        client_ip = self.get_client_ip(request)
        
        # Check for oversized headers
        for name, value in headers.items():
            if len(name) > 100:
                raise ValidationError(f"Header name too long: {name[:50]}...")
            if len(value) > 8192:  # 8KB limit
                raise ValidationError(f"Header value too long: {name}")
        
        # Validate Content-Length
        content_length = headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > 10 * 1024 * 1024:  # 10MB limit
                    raise ValidationError("Request body too large")
            except ValueError:
                raise ValidationError("Invalid Content-Length header")
        
        # Check for potential header injection
        for name, value in headers.items():
            if '\n' in value or '\r' in value:
                log_security_event(
                    event_type="HEADER_INJECTION",
                    description=f"Header injection attempt in {name}",
                    client_ip=client_ip,
                    severity="high"
                )
                raise ValidationError("Invalid header format")
    
    async def validate_content_type(self, request: Request) -> None:
        """
        Validate content type for requests with body
        """
        
        content_type = request.headers.get("content-type", "")
        
        # List of allowed content types
        allowed_types = [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain"
        ]
        
        # Check if content type is allowed
        if not any(allowed in content_type for allowed in allowed_types):
            raise ValidationError(f"Unsupported content type: {content_type}")
    
    async def validate_request_size(self, request: Request) -> None:
        """
        Validate request size limits
        """
        
        # Check URL length
        if len(str(request.url)) > 2048:  # 2KB URL limit
            raise ValidationError("URL too long")
        
        # Check query parameter count
        if len(request.query_params) > 50:
            raise ValidationError("Too many query parameters")
        
        # Validate individual query parameters
        for key, value in request.query_params.items():
            if len(key) > 100:
                raise ValidationError(f"Query parameter name too long: {key[:50]}...")
            if len(value) > 1000:
                raise ValidationError(f"Query parameter value too long: {key}")
    
    async def check_rate_limiting(self, request: Request) -> None:
        """
        Simple rate limiting check
        """
        
        client_ip = self.get_client_ip(request)
        
        # Simple rate limiting (in production, use Redis or similar)
        from datetime import datetime, timedelta
        
        now = datetime.utcnow()
        window_start = now - timedelta(minutes=1)
        
        # Clean old entries
        self.request_counts = {
            ip: [(timestamp, count) for timestamp, count in requests 
                 if timestamp > window_start]
            for ip, requests in self.request_counts.items()
        }
        
        # Count requests for this IP
        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []
        
        self.request_counts[client_ip].append((now, 1))
        
        # Check if rate limit exceeded
        total_requests = sum(count for _, count in self.request_counts[client_ip])
        
        if total_requests > 100:  # 100 requests per minute
            log_security_event(
                event_type="RATE_LIMIT_EXCEEDED",
                description=f"Rate limit exceeded: {total_requests} requests",
                client_ip=client_ip,
                severity="medium"
            )
            raise ValidationError("Rate limit exceeded. Please try again later.")
    
    def add_security_headers(self, response: Response) -> None:
        """
        Add security headers to response
        """
        
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": "default-src 'self'",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
            "X-Permitted-Cross-Domain-Policies": "none"
        }
        
        for header, value in security_headers.items():
            response.headers[header] = value
    
    def get_client_ip(self, request: Request) -> str:
        """
        Extract client IP address from request
        """
        # Check for forwarded IP first
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        # Check for real IP
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        # Fall back to client host
        if request.client:
            return request.client.host
        
        return "unknown"


class RequestBodyValidationMiddleware(BaseHTTPMiddleware):
    """
    Request body validation middleware
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Validate request body content
        """
        
        if request.method in ["POST", "PUT", "PATCH"]:
            await self.validate_request_body(request)
        
        return await call_next(request)
    
    async def validate_request_body(self, request: Request) -> None:
        """
        Validate request body for security and format
        """
        
        content_type = request.headers.get("content-type", "")
        
        if "application/json" in content_type:
            await self.validate_json_body(request)
        elif "multipart/form-data" in content_type:
            await self.validate_multipart_body(request)
    
    async def validate_json_body(self, request: Request) -> None:
        """
        Validate JSON request body
        """
        
        try:
            # Try to read and parse the body
            body = await request.body()
            
            if len(body) > 1024 * 1024:  # 1MB limit for JSON
                raise ValidationError("JSON body too large")
            
            if body:
                try:
                    json_data = json.loads(body)
                    await self.validate_json_content(json_data, request)
                except json.JSONDecodeError as e:
                    raise ValidationError(f"Invalid JSON format: {str(e)}")
        
        except Exception as e:
            if isinstance(e, ValidationError):
                raise
            logger.error(f"Error validating JSON body: {str(e)}")
    
    async def validate_json_content(self, data: Any, request: Request) -> None:
        """
        Validate JSON content for security threats
        """
        
        def check_value(value: Any, path: str = "") -> None:
            if isinstance(value, str):
                # Check for malicious patterns in string values
                for threat_type, patterns in RequestValidationMiddleware.SECURITY_PATTERNS.items():
                    for pattern in patterns:
                        if re.search(pattern, value, re.IGNORECASE):
                            log_security_event(
                                event_type=f"JSON_THREAT_{threat_type.upper()}",
                                description=f"Malicious pattern in JSON at {path}: {pattern}",
                                client_ip=self.get_client_ip(request),
                                severity="high"
                            )
                            raise ValidationError(f"Invalid content in field: {path}")
                
                # Check string length
                if len(value) > 10000:  # 10KB string limit
                    raise ValidationError(f"String too long in field: {path}")
            
            elif isinstance(value, dict):
                if len(value) > 100:  # Max 100 keys per object
                    raise ValidationError(f"Too many keys in object: {path}")
                
                for key, val in value.items():
                    if len(str(key)) > 100:  # Max key length
                        raise ValidationError(f"Key too long: {path}.{str(key)[:50]}...")
                    check_value(val, f"{path}.{key}" if path else key)
            
            elif isinstance(value, list):
                if len(value) > 1000:  # Max 1000 items per array
                    raise ValidationError(f"Array too long: {path}")
                
                for i, item in enumerate(value):
                    check_value(item, f"{path}[{i}]")
        
        check_value(data)
    
    async def validate_multipart_body(self, request: Request) -> None:
        """
        Validate multipart form data
        """
        
        # Basic validation for multipart data
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                length = int(content_length)
                if length > 50 * 1024 * 1024:  # 50MB limit for multipart
                    raise ValidationError("Multipart body too large")
            except ValueError:
                raise ValidationError("Invalid Content-Length for multipart")
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("x-real-ip")
        if real_ip:
            return real_ip
        
        if request.client:
            return request.client.host
        
        return "unknown"


# Validation utility functions
def sanitize_string(value: str, max_length: int = 1000) -> str:
    """
    Sanitize string input
    """
    if not isinstance(value, str):
        return str(value)
    
    # Remove potential XSS characters
    value = re.sub(r'[<>&"\']', '', value)
    
    # Limit length
    if len(value) > max_length:
        value = value[:max_length]
    
    return value.strip()


def validate_