"""BL Object Handler - 10 tools for object CRUD operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only, obj_to_dict


def bl_object_create(params):
    obj_type = params.get("type", "CUBE").upper()
    name = params.get("name", "")
    location = params.get("location", [0, 0, 0])

    if obj_type == "CUBE":
        bpy.ops.mesh.primitive_cube_add(location=location)
    elif obj_type == "SPHERE":
        bpy.ops.mesh.primitive_uv_sphere_add(location=location)
    elif obj_type == "CYLINDER":
        bpy.ops.mesh.primitive_cylinder_add(location=location)
    elif obj_type == "PLANE":
        bpy.ops.mesh.primitive_plane_add(location=location)
    elif obj_type == "CONE":
        bpy.ops.mesh.primitive_cone_add(location=location)
    elif obj_type == "TORUS":
        bpy.ops.mesh.primitive_torus_add(location=location)
    elif obj_type == "EMPTY":
        bpy.ops.object.empty_add(location=location)
    elif obj_type == "MONKEY":
        bpy.ops.mesh.primitive_monkey_add(location=location)
    else:
        bpy.ops.mesh.primitive_cube_add(location=location)

    obj = bpy.context.active_object
    if name:
        obj.name = name
    return obj_to_dict(obj)


def bl_object_delete(params):
    name = params.get("name", "")
    if name:
        obj = get_object(name)
        select_only(obj)
    bpy.ops.object.delete()
    return {"deleted": name or "selected"}


def bl_object_duplicate(params):
    name = params.get("name", "")
    if name:
        obj = get_object(name)
        select_only(obj)
    bpy.ops.object.duplicate()
    new_obj = bpy.context.active_object
    return obj_to_dict(new_obj)


def bl_object_rename(params):
    old_name = params["name"]
    new_name = params["newName"]
    obj = get_object(old_name)
    obj.name = new_name
    return {"oldName": old_name, "newName": obj.name}


def bl_object_set_location(params):
    obj = get_object(params["name"])
    loc = params.get("location", [0, 0, 0])
    obj.location = loc
    return obj_to_dict(obj)


def bl_object_set_rotation(params):
    obj = get_object(params["name"])
    rot = params.get("rotation", [0, 0, 0])
    import math
    obj.rotation_euler = [math.radians(r) for r in rot]
    return obj_to_dict(obj)


def bl_object_set_scale(params):
    obj = get_object(params["name"])
    scale = params.get("scale", [1, 1, 1])
    obj.scale = scale
    return obj_to_dict(obj)


def bl_object_set_visibility(params):
    obj = get_object(params["name"])
    visible = params.get("visible", True)
    obj.hide_viewport = not visible
    obj.hide_render = not visible
    return {"name": obj.name, "visible": visible}


def bl_object_set_parent(params):
    child = get_object(params["child"])
    parent = get_object(params["parent"])
    child.parent = parent
    return {"child": child.name, "parent": parent.name}


def bl_object_list(params):
    filter_type = params.get("type", "").upper()
    objects = bpy.data.objects
    if filter_type:
        objects = [o for o in objects if o.type == filter_type]
    return {"objects": [obj_to_dict(o) for o in objects], "count": len(list(objects))}


def get_routes():
    return {
        "bl_object_create": bl_object_create,
        "bl_object_delete": bl_object_delete,
        "bl_object_duplicate": bl_object_duplicate,
        "bl_object_rename": bl_object_rename,
        "bl_object_set_location": bl_object_set_location,
        "bl_object_set_rotation": bl_object_set_rotation,
        "bl_object_set_scale": bl_object_set_scale,
        "bl_object_set_visibility": bl_object_set_visibility,
        "bl_object_set_parent": bl_object_set_parent,
        "bl_object_list": bl_object_list,
    }
