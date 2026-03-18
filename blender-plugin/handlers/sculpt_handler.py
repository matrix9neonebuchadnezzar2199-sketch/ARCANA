"""BL Sculpt Handler - 8 tools for sculpting."""

import bpy
from ..utils.bpy_helpers import get_object, select_only, ensure_mode


def bl_sculpt_enable(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('SCULPT')
    return {"name": obj.name, "mode": "SCULPT"}


def bl_sculpt_set_brush(params):
    brush_name = params.get("brush", "SculptDraw")
    brush = bpy.data.brushes.get(brush_name)
    if brush:
        bpy.context.tool_settings.sculpt.brush = brush
    return {"brush": brush_name}


def bl_sculpt_set_strength(params):
    strength = params.get("strength", 0.5)
    ts = bpy.context.tool_settings.sculpt
    if ts.brush:
        ts.brush.strength = strength
    return {"strength": strength}


def bl_sculpt_set_radius(params):
    radius = params.get("radius", 50)
    ts = bpy.context.tool_settings.sculpt
    if ts.brush:
        ts.brush.size = radius
    return {"radius": radius}


def bl_sculpt_set_symmetry(params):
    sculpt = bpy.context.tool_settings.sculpt
    sculpt.use_symmetry_x = params.get("x", True)
    sculpt.use_symmetry_y = params.get("y", False)
    sculpt.use_symmetry_z = params.get("z", False)
    return {"x": sculpt.use_symmetry_x, "y": sculpt.use_symmetry_y, "z": sculpt.use_symmetry_z}


def bl_sculpt_dyntopo(params):
    enable = params.get("enable", True)
    if enable:
        if not bpy.context.sculpt_object.use_dynamic_topology_sculpting:
            bpy.ops.sculpt.dynamic_topology_toggle()
    else:
        if bpy.context.sculpt_object.use_dynamic_topology_sculpting:
            bpy.ops.sculpt.dynamic_topology_toggle()
    detail = params.get("detail", 12.0)
    bpy.context.scene.tool_settings.sculpt.detail_size = detail
    return {"dyntopo": enable, "detail": detail}


def bl_sculpt_mask(params):
    action = params.get("action", "clear").lower()
    if action == "clear":
        bpy.ops.paint.mask_flood_fill(mode='VALUE', value=0)
    elif action == "fill":
        bpy.ops.paint.mask_flood_fill(mode='VALUE', value=1)
    elif action == "invert":
        bpy.ops.paint.mask_flood_fill(mode='INVERT')
    return {"mask": action}


def bl_sculpt_remesh(params):
    obj = bpy.context.active_object
    voxel_size = params.get("voxelSize", 0.05)
    obj.data.remesh_voxel_size = voxel_size
    bpy.ops.object.voxel_remesh()
    return {"name": obj.name, "voxelSize": voxel_size, "vertices": len(obj.data.vertices)}


def get_routes():
    return {
        "bl_sculpt_enable": bl_sculpt_enable,
        "bl_sculpt_set_brush": bl_sculpt_set_brush,
        "bl_sculpt_set_strength": bl_sculpt_set_strength,
        "bl_sculpt_set_radius": bl_sculpt_set_radius,
        "bl_sculpt_set_symmetry": bl_sculpt_set_symmetry,
        "bl_sculpt_dyntopo": bl_sculpt_dyntopo,
        "bl_sculpt_mask": bl_sculpt_mask,
        "bl_sculpt_remesh": bl_sculpt_remesh,
    }
