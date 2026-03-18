"""
Blender Python helpers - common bpy operations.
"""

import bpy
import mathutils


def get_object(name: str):
    """Get object by name, raise if not found."""
    obj = bpy.data.objects.get(name)
    if obj is None:
        raise ValueError(f"Object not found: {name}")
    return obj


def get_active_object():
    """Get the active object."""
    obj = bpy.context.active_object
    if obj is None:
        raise ValueError("No active object")
    return obj


def select_only(obj):
    """Deselect all, then select and activate obj."""
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def ensure_mode(mode: str):
    """Switch to the given mode if not already in it."""
    if bpy.context.mode != mode:
        if mode == 'OBJECT':
            bpy.ops.object.mode_set(mode='OBJECT')
        elif mode == 'EDIT':
            bpy.ops.object.mode_set(mode='EDIT')
        elif mode == 'SCULPT':
            bpy.ops.object.mode_set(mode='SCULPT')
        elif mode == 'WEIGHT_PAINT':
            bpy.ops.object.mode_set(mode='WEIGHT_PAINT')
        elif mode == 'TEXTURE_PAINT':
            bpy.ops.object.mode_set(mode='TEXTURE_PAINT')
        elif mode == 'VERTEX_PAINT':
            bpy.ops.object.mode_set(mode='VERTEX_PAINT')
        elif mode == 'POSE':
            bpy.ops.object.mode_set(mode='POSE')


def vec3(x=0, y=0, z=0):
    return mathutils.Vector((x, y, z))


def color4(r=1, g=1, b=1, a=1):
    return (r, g, b, a)


def obj_to_dict(obj):
    """Serialize a Blender object to a dict summary."""
    return {
        "name": obj.name,
        "type": obj.type,
        "location": list(obj.location),
        "rotation": list(obj.rotation_euler),
        "scale": list(obj.scale),
        "visible": obj.visible_get(),
    }
