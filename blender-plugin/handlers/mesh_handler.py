"""BL Mesh Handler - 10 tools for mesh editing."""

import bpy
import bmesh
from ..utils.bpy_helpers import get_object, select_only, ensure_mode


def bl_mesh_edit_vertices(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bm = bmesh.from_edit_mesh(obj.data)
    indices = params.get("indices", [])
    offset = params.get("offset", [0, 0, 0])
    count = 0
    for v in bm.verts:
        if not indices or v.index in indices:
            v.co.x += offset[0]
            v.co.y += offset[1]
            v.co.z += offset[2]
            count += 1
    bmesh.update_edit_mesh(obj.data)
    ensure_mode('OBJECT')
    return {"name": obj.name, "verticesMoved": count}


def bl_mesh_extrude_faces(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    amount = params.get("amount", 1.0)
    bpy.ops.mesh.extrude_region_move(TRANSFORM_OT_translate={"value": (0, 0, amount)})
    ensure_mode('OBJECT')
    return {"name": obj.name, "extruded": amount}


def bl_mesh_subdivide(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    cuts = params.get("cuts", 1)
    bpy.ops.mesh.subdivide(number_cuts=cuts)
    ensure_mode('OBJECT')
    return {"name": obj.name, "cuts": cuts}


def bl_mesh_merge_vertices(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    threshold = params.get("threshold", 0.0001)
    bpy.ops.mesh.remove_doubles(threshold=threshold)
    ensure_mode('OBJECT')
    return {"name": obj.name, "threshold": threshold}


def bl_mesh_flip_normals(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.flip_normals()
    ensure_mode('OBJECT')
    return {"name": obj.name, "flipped": True}


def bl_mesh_smooth_shade(params):
    obj = get_object(params["name"])
    select_only(obj)
    smooth = params.get("smooth", True)
    if smooth:
        bpy.ops.object.shade_smooth()
    else:
        bpy.ops.object.shade_flat()
    return {"name": obj.name, "smooth": smooth}


def bl_mesh_separate(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('EDIT')
    mode = params.get("mode", "SELECTED").upper()
    bpy.ops.mesh.separate(type=mode)
    ensure_mode('OBJECT')
    return {"name": obj.name, "separated": mode}


def bl_mesh_join(params):
    names = params.get("names", [])
    for n in names:
        obj = get_object(n)
        obj.select_set(True)
    if names:
        bpy.context.view_layer.objects.active = get_object(names[0])
    bpy.ops.object.join()
    return {"joined": bpy.context.active_object.name}


def bl_mesh_apply_transforms(params):
    obj = get_object(params["name"])
    select_only(obj)
    loc = params.get("location", True)
    rot = params.get("rotation", True)
    scale = params.get("scale", True)
    bpy.ops.object.transform_apply(location=loc, rotation=rot, scale=scale)
    return {"name": obj.name, "applied": {"location": loc, "rotation": rot, "scale": scale}}


def bl_mesh_get_stats(params):
    obj = get_object(params["name"])
    mesh = obj.data
    return {
        "name": obj.name,
        "vertices": len(mesh.vertices),
        "edges": len(mesh.edges),
        "polygons": len(mesh.polygons),
        "materials": len(mesh.materials),
    }


def get_routes():
    return {
        "bl_mesh_edit_vertices": bl_mesh_edit_vertices,
        "bl_mesh_extrude_faces": bl_mesh_extrude_faces,
        "bl_mesh_subdivide": bl_mesh_subdivide,
        "bl_mesh_merge_vertices": bl_mesh_merge_vertices,
        "bl_mesh_flip_normals": bl_mesh_flip_normals,
        "bl_mesh_smooth_shade": bl_mesh_smooth_shade,
        "bl_mesh_separate": bl_mesh_separate,
        "bl_mesh_join": bl_mesh_join,
        "bl_mesh_apply_transforms": bl_mesh_apply_transforms,
        "bl_mesh_get_stats": bl_mesh_get_stats,
    }
