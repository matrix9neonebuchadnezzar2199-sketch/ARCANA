"""BL UV Handler - 8 tools for UV mapping operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only, ensure_mode


def bl_uv_unwrap(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    method = params.get("method", "ANGLE_BASED")
    bpy.ops.uv.unwrap(method=method)
    ensure_mode('OBJECT')
    return {"name": obj.name, "method": method}


def bl_uv_smart_project(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    angle = params.get("angleLimit", 66.0)
    margin = params.get("margin", 0.001)
    bpy.ops.uv.smart_project(angle_limit=angle, island_margin=margin)
    ensure_mode('OBJECT')
    return {"name": obj.name, "angleLimit": angle, "margin": margin}


def bl_uv_pack(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    margin = params.get("margin", 0.001)
    bpy.ops.uv.pack_islands(margin=margin)
    ensure_mode('OBJECT')
    return {"name": obj.name, "packed": True, "margin": margin}


def bl_uv_average_scale(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.average_islands_scale()
    ensure_mode('OBJECT')
    return {"name": obj.name, "averaged": True}


def bl_uv_mark_seam(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    edges = params.get("edges", [])
    if not edges:
        bpy.ops.mesh.mark_seam(clear=False)
    else:
        import bmesh
        bm = bmesh.from_edit_mesh(obj.data)
        for idx in edges:
            if idx < len(bm.edges):
                bm.edges[idx].seam = True
        bmesh.update_edit_mesh(obj.data)
    ensure_mode('OBJECT')
    return {"name": obj.name, "seamsMarked": True}


def bl_uv_clear_seam(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.mark_seam(clear=True)
    ensure_mode('OBJECT')
    return {"name": obj.name, "seamsCleared": True}


def bl_uv_project_from_view(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.project_from_view(scale_to_bounds=params.get("scaleToBounds", True))
    ensure_mode('OBJECT')
    return {"name": obj.name, "projected": True}


def bl_uv_cube_project(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    size = params.get("cubeSize", 1.0)
    bpy.ops.uv.cube_project(cube_size=size)
    ensure_mode('OBJECT')
    return {"name": obj.name, "cubeProjected": True, "size": size}


def get_routes():
    return {
        "bl_uv_unwrap": bl_uv_unwrap,
        "bl_uv_smart_project": bl_uv_smart_project,
        "bl_uv_pack": bl_uv_pack,
        "bl_uv_average_scale": bl_uv_average_scale,
        "bl_uv_mark_seam": bl_uv_mark_seam,
        "bl_uv_clear_seam": bl_uv_clear_seam,
        "bl_uv_project_from_view": bl_uv_project_from_view,
        "bl_uv_cube_project": bl_uv_cube_project,
    }
