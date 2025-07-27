"""
CorruptGuard Logging Middleware
Request/response logging and performance monitoring
"""

import time
import uuid
from typing import Dict, Any
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.utils.logging import get_logger, log_user_action, log_performance_metric

logger = get_logger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Request and response logging middleware
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Log request and response details with performance metrics
        """
        
        # Generate unique request ID
        request_id = str(uuid.uuid4())
        
        # Add request ID to request state
        request.state.request_id = request_id
        
        # Start timing
        start_time = time.time()
        
        # Get client information
        client_info = self.get_client_info(request)
        
        # Log incoming request
        await self.log_request(request, request_id, client_info)
        
        try:
            # Process the request
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log successful response
            await self.log_response(request, response, request_id, process_time, client_info)
            
            # Log performance metrics
            log_performance_metric(
                operation=f"{request.method} {request.url.path}",
                duration_ms=process_time * 1000,
                success=True,
                details={
                    "status_code": response.status_code,
                    "user_agent": client_info.get("user_agent"),
                    "client_ip": client_info.get("ip")
                }
            )
            
            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}s"
            
            return response
            
        except Exception as exc:
            # Calculate processing time for failed requests
            process_time = time.time() - start_time
            
            # Log failed request
            await self.log_error(request, exc, request_id, process_time, client_info)
            
            # Log performance metrics for failures
            log_performance_metric(
                operation=f"{request.method} {request.url.path}",
                duration_ms=process_time * 1000,
                success=False,
                details={
                    "error": str(exc),
                    "user_agent": client_info.get("user_agent"),
                    "client_ip": client_info.get("ip")
                }
            )
            
            # Re-raise the exception
            raise exc
    
    async def log_request(self, request: Request, request_id: str, client_info: Dict[str, Any]) -> None:
        """
        Log incoming request details
        """
        
        # Extract user information if available
        user_principal = request.headers.get("X-Principal-ID", "anonymous")
        
        # Create request log entry
        request_log = {
            "request_id": request_id,
            "method": request.method,
            "url": str(request.url),
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "headers": dict(request.headers),
            "client_ip": client_info.get("ip"),
            "user_agent": client_info.get("user_agent"),
            "user_principal": user_principal,
            "content_type": request.headers.get("content-type"),
            "content_length": request.headers.get("content-length"),
        }
        
        # Log sensitive endpoints with higher detail
        sensitive_paths = ["/auth", "/login", "/token", "/admin"]
        is_sensitive = any(path in request.url.path for path in sensitive_paths)
        
        if is_sensitive:
            logger.info(f"SENSITIVE_REQUEST: {request_id} {request.method} {request.url.path} from {client_info.get('ip')}")
        else:
            logger.info(f"REQUEST: {request_id} {request.method} {request.url.path}")
        
        # Log detailed request info in debug mode
        logger.debug(f"REQUEST_DETAILS: {request_log}")
        
        # Log user action if authenticated
        if user_principal != "anonymous":
            log_user_action(
                user_principal=user_principal,
                action="API_REQUEST",
                resource=f"{request.method} {request.url.path}",
                details={
                    "request_id": request_id,
                    "client_ip": client_info.get("ip"),
                    "user_agent": client_info.get("user_agent")
                }
            )
    
    async def log_response(
        self, 
        request: Request, 
        response: Response, 
        request_id: str, 
        process_time: float,
        client_info: Dict[str, Any]
    ) -> None:
        """
        Log response details and performance metrics
        """
        
        response_log = {
            "request_id": request_id,
            "status_code": response.status_code,
            "process_time": f"{process_time:.3f}s",
            "response_headers": dict(response.headers),
            "content_type": response.headers.get("content-type"),
            "content_length": response.headers.get("content-length"),
        }
        
        # Log response based on status code
        if response.status_code >= 500:
            logger.error(f"RESPONSE_ERROR: {request_id} {response.status_code} {process_time:.3f}s")
        elif response.status_code >= 400:
            logger.warning(f"RESPONSE_CLIENT_ERROR: {request_id} {response.status_code} {process_time:.3f}s")
        else:
            logger.info(f"RESPONSE_SUCCESS: {request_id} {response.status_code} {process_time:.3f}s")
        
        # Log detailed response info in debug mode
        logger.debug(f"RESPONSE_DETAILS: {response_log}")
        
        # Log slow requests
        if process_time > 5.0:  # Requests taking more than 5 seconds
            logger.warning(f"SLOW_REQUEST: {request_id} took {process_time:.3f}s - {request.method} {request.url.path}")
    
    async def log_error(
        self, 
        request: Request, 
        exc: Exception, 
        request_id: str, 
        process_time: float,
        client_info: Dict[str, Any]
    ) -> None:
        """
        Log request errors and exceptions
        """
        
        error_log = {
            "request_id": request_id,
            "error_type": type(exc).__name__,
            "error_message": str(exc),
            "process_time": f"{process_time:.3f}s",
            "method": request.method,
            "path": request.url.path,
            "client_ip": client_info.get("ip"),
            "user_agent": client_info.get("user_agent")
        }
        
        logger.error(f"REQUEST_ERROR: {request_id} {type(exc).__name__}: {str(exc)}")
        logger.debug(f"ERROR_DETAILS: {error_log}")
    
    def get_client_info(self, request: Request) -> Dict[str, Any]:
        """
        Extract client information from request
        """
        
        # Get client IP
        client_ip = "unknown"
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        elif request.headers.get("x-real-ip"):
            client_ip = request.headers.get("x-real-ip")
        elif request.client:
            client_ip = request.client.host
        
        return {
            "ip": client_ip,
            "user_agent": request.headers.get("user-agent", "unknown"),
            "referer": request.headers.get("referer"),
            "origin": request.headers.get("origin"),
            "accept": request.headers.get("accept"),
            "accept_language": request.headers.get("accept-language"),
            "accept_encoding": request.headers.get("accept-encoding")
        }


class PerformanceMonitoringMiddleware(BaseHTTPMiddleware):
    """
    Performance monitoring and metrics collection middleware
    """
    
    # Performance thresholds
    SLOW_REQUEST_THRESHOLD = 2.0  # seconds
    VERY_SLOW_REQUEST_THRESHOLD = 5.0  # seconds
    
    def __init__(self, app, slow_threshold: float = None, very_slow_threshold: float = None):
        super().__init__(app)
        if slow_threshold:
            self.SLOW_REQUEST_THRESHOLD = slow_threshold
        if very_slow_threshold:
            self.VERY_SLOW_REQUEST_THRESHOLD = very_slow_threshold
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Monitor request performance and collect metrics
        """
        
        start_time = time.time()
        
        # Add performance tracking to request state
        request.state.start_time = start_time
        
        try:
            response = await call_next(request)
            
            # Calculate metrics
            end_time = time.time()
            duration = end_time - start_time
            
            # Log performance metrics
            await self.log_performance_metrics(request, response, duration)
            
            return response
            
        except Exception as exc:
            # Log performance for failed requests
            end_time = time.time()
            duration = end_time - start_time
            
            await self.log_error_performance(request, exc, duration)
            raise exc
    
    async def log_performance_metrics(self, request: Request, response: Response, duration: float) -> None:
        """
        Log performance metrics for successful requests
        """
        
        endpoint = f"{request.method} {request.url.path}"
        
        # Basic performance logging
        if duration > self.VERY_SLOW_REQUEST_THRESHOLD:
            logger.critical(f"VERY_SLOW_REQUEST: {endpoint} took {duration:.3f}s (threshold: {self.VERY_SLOW_REQUEST_THRESHOLD}s)")
        elif duration > self.SLOW_REQUEST_THRESHOLD:
            logger.warning(f"SLOW_REQUEST: {endpoint} took {duration:.3f}s (threshold: {self.SLOW_REQUEST_THRESHOLD}s)")
        
        # Collect detailed metrics
        metrics = {
            "endpoint": endpoint,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration * 1000, 2),
            "duration_seconds": round(duration, 3),
            "timestamp": time.time(),
            "client_ip": self.get_client_ip(request),
            "user_agent": request.headers.get("user-agent"),
            "content_length": response.headers.get("content-length"),
            "content_type": response.headers.get("content-type")
        }
        
        # Log structured metrics
        logger.info(f"PERFORMANCE_METRICS: {metrics}")
        
        # Store metrics for analytics (in production, send to metrics service)
        await self.store_metrics(metrics)
    
    async def log_error_performance(self, request: Request, exc: Exception, duration: float) -> None:
        """
        Log performance metrics for failed requests
        """
        
        endpoint = f"{request.method} {request.url.path}"
        
        error_metrics = {
            "endpoint": endpoint,
            "method": request.method,
            "path": request.url.path,
            "error_type": type(exc).__name__,
            "error_message": str(exc),
            "duration_ms": round(duration * 1000, 2),
            "duration_seconds": round(duration, 3),
            "timestamp": time.time(),
            "client_ip": self.get_client_ip(request)
        }
        
        logger.error(f"ERROR_PERFORMANCE: {error_metrics}")
        
        # Store error metrics
        await self.store_error_metrics(error_metrics)
    
    async def store_metrics(self, metrics: Dict[str, Any]) -> None:
        """
        Store performance metrics (implement with your metrics service)
        """
        # In production, send to metrics collection service like:
        # - Prometheus
        # - DataDog
        # - New Relic
        # - CloudWatch
        # - Custom analytics service
        pass
    
    async def store_error_metrics(self, metrics: Dict[str, Any]) -> None:
        """
        Store error metrics (implement with your metrics service)
        """
        # In production, send to error tracking service like:
        # - Sentry
        # - Rollbar
        # - Bugsnag
        # - Custom error tracking
        pass
    
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


class SecurityAuditMiddleware(BaseHTTPMiddleware):
    """
    Security audit and compliance logging middleware
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        """
        Audit security-relevant events and compliance
        """
        
        # Check for security-sensitive operations
        await self.audit_security_events(request)
        
        response = await call_next(request)
        
        # Audit response for sensitive data
        await self.audit_response_security(request, response)
        
        return response
    
    async def audit_security_events(self, request: Request) -> None:
        """
        Audit security-relevant request events
        """
        
        # Define security-sensitive endpoints
        sensitive_endpoints = [
            "/auth", "/login", "/logout", "/token",
            "/admin", "/government", "/fraud",
            "/roles", "/vendor", "/budget"
        ]
        
        # Check if this is a sensitive operation
        is_sensitive = any(endpoint in request.url.path for endpoint in sensitive_endpoints)
        
        if is_sensitive:
            user_principal = request.headers.get("X-Principal-ID", "anonymous")
            client_ip = self.get_client_ip(request)
            
            audit_log = {
                "event_type": "SENSITIVE_API_ACCESS",
                "endpoint": request.url.path,
                "method": request.method,
                "user_principal": user_principal,
                "client_ip": client_ip,
                "user_agent": request.headers.get("user-agent"),
                "timestamp": time.time(),
                "referer": request.headers.get("referer")
            }
            
            logger.info(f"SECURITY_AUDIT: {audit_log}")
            
            # Log to audit trail (in production, send to SIEM system)
            await self.log_audit_event(audit_log)
    
    async def audit_response_security(self, request: Request, response: Response) -> None:
        """
        Audit response for security compliance
        """
        
        # Check for potential data exposure
        content_type = response.headers.get("content-type", "")
        
        if "application/json" in content_type and response.status_code == 200:
            # Log successful data access for audit trail
            user_principal = request.headers.get("X-Principal-ID", "anonymous")
            
            if user_principal != "anonymous":
                audit_log = {
                    "event_type": "DATA_ACCESS",
                    "endpoint": request.url.path,
                    "method": request.method,
                    "user_principal": user_principal,
                    "status_code": response.status_code,
                    "timestamp": time.time()
                }
                
                logger.debug(f"DATA_ACCESS_AUDIT: {audit_log}")
    
    async def log_audit_event(self, audit_log: Dict[str, Any]) -> None:
        """
        Log audit event to compliance system
        """
        # In production, send to:
        # - SIEM system
        # - Compliance logging service
        # - Security audit database
        # - Government audit trail system
        pass
    
    def get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        if request.client:
            return request.client.host
        
        return "unknown"