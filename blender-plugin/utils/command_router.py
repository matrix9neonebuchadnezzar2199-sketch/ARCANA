"""
Command Router - maps tool IDs to handler functions.
Supports alias mapping and explicit not-implemented tracking.
"""

_routes = {}
_aliases = {}
_not_implemented = set()


def register_route(tool_id, handler_func):
    """Register a tool_id -> handler mapping."""
    _routes[tool_id] = handler_func


def register_routes(mapping: dict):
    """Register multiple routes at once."""
    _routes.update(mapping)


def register_alias(alias_id, target_id):
    """Register an alias: alias_id will be routed to target_id's handler."""
    _aliases[alias_id] = target_id


def register_aliases(mapping: dict):
    """Register multiple aliases at once."""
    _aliases.update(mapping)


def register_not_implemented(tool_ids):
    """Register tool IDs that are known but not yet implemented."""
    _not_implemented.update(tool_ids)


def route_command(tool_id: str, params: dict):
    """Find and execute the handler for a given tool_id."""
    # Direct match
    handler = _routes.get(tool_id)
    if handler:
        return handler(params)

    # Alias match
    resolved = _aliases.get(tool_id)
    if resolved:
        handler = _routes.get(resolved)
        if handler:
            return handler(params)

    # Known but not implemented
    if tool_id in _not_implemented:
        raise NotImplementedError(
            f"Tool '{tool_id}' is recognized but not yet implemented in the Blender plugin."
        )

    raise ValueError(
        f"Unknown tool: {tool_id}. "
        f"Registered: {len(_routes)} routes, {len(_aliases)} aliases, "
        f"{len(_not_implemented)} not-implemented."
    )


def get_registered_count():
    return len(_routes)


def get_alias_count():
    return len(_aliases)


def get_not_implemented_count():
    return len(_not_implemented)


def list_routes():
    return list(_routes.keys())


def list_aliases():
    return dict(_aliases)


def list_not_implemented():
    return sorted(_not_implemented)
