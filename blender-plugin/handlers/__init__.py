"""
ARCANA Handlers - auto-register all tool handlers.
"""

from ..utils.command_router import register_routes


def register_all():
    """Import and register all handler modules."""
    from . import (
        object_handler,
        mesh_handler,
        material_handler,
        modifier_handler,
        sculpt_handler,
        animation_handler,
        camera_handler,
        light_handler,
        render_handler,
        scene_handler,
        node_handler,
        uv_handler,
        particle_handler,
        armature_handler,
        grease_pencil_handler,
        geometry_nodes_handler,
        compositor_handler,
        texture_paint_handler,
        vse_handler,
    )
    from .character import (
        body_handler,
        face_handler,
        hair_handler,
        material_handler as char_material_handler,
        expression_handler,
        export_handler,
    )

    modules = [
        object_handler, mesh_handler, material_handler, modifier_handler,
        sculpt_handler, animation_handler, camera_handler, light_handler,
        render_handler, scene_handler, node_handler, uv_handler,
        particle_handler, armature_handler, grease_pencil_handler,
        geometry_nodes_handler, compositor_handler, texture_paint_handler,
        vse_handler,
        body_handler, face_handler, hair_handler, char_material_handler,
        expression_handler, export_handler,
    ]

    for mod in modules:
        if hasattr(mod, 'get_routes'):
            register_routes(mod.get_routes())
