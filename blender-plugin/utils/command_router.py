"""
Command Router - maps tool IDs to handler functions.
"""

_routes = {}


def register_route(tool_id, handler_func):
    """Register a tool_id -> handler mapping."""
    _routes[tool_id] = handler_func


def register_routes(mapping: dict):
    """Register multiple routes at once."""
    _routes.update(mapping)


def route_command(tool_id: str, params: dict):
    """Find and execute the handler for a given tool_id."""
    handler = _routes.get(tool_id)
    if handler is None:
        # Try prefix matching for category
        raise ValueError(f"Unknown tool: {tool_id}. Available: {len(_routes)} tools registered.")
    return handler(params)


def get_registered_count():
    return len(_routes)


def list_routes():
    return list(_routes.keys())
