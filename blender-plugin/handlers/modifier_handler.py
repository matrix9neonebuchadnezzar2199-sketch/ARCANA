"""BL Modifier Handler - 10 tools for modifier operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only


def bl_mod_add(params):
    obj = get_object(params["name"])
    mod_type = params.get("type", "SUBSURF").upper()
    mod_name = params.get("modName", mod_type.title())
    mod = obj.modifiers.new(name=mod_name, type=mod_type)
    return {"object": obj.name, "modifier": mod.name, "type": mod.type}


def bl_mod_remove(params):
    obj = get_object(params["name"])
    mod_name = params["modName"]
    mod = obj.modifiers.get(mod_name)
    if not mod:
        raise ValueError(f"Modifier not found: {mod_name}")
    obj.modifiers.remove(mod)
    return {"object": obj.name, "removed": mod_name}


def bl_mod_apply(params):
    obj = get_object(params["name"])
    select_only(obj)
    mod_name = params["modName"]
    bpy.ops.object.modifier_apply(modifier=mod_name)
    return {"object": obj.name, "applied": mod_name}


def bl_mod_subsurf(params):
    obj = get_object(params["name"])
    mod = obj.modifiers.new(name="Subdivision", type='SUBSURF')
    mod.levels = params.get("viewport", 2)
    mod.render_levels = params.get("render", 3)
    return {"object": obj.name, "modifier": mod.name, "viewport": mod.levels, "render": mod.render_levels}


def bl_mod_mirror(params):
    obj = get_object(params["name"])
    mod = obj.modifiers.new(name="Mirror", type='MIRROR')
    mod.use_axis[0] = params.get("x", True)
    mod.use_axis[1] = params.get("y", False)
    mod.use_axis[2] = params.get("z", False)
    mod.use_clip = params.get("clipping", True)
    return {"object": obj.name, "modifier": mod.name}


def bl_mod_array(params):
    obj = get_object(params["name"])
    mod = obj.modifiers.new(name="Array", type='ARRAY')
    mod.count = params.get("count", 3)
    offset = params.get("offset", [1, 0, 0])
    mod.relative_offset_displace = offset
    return {"object": obj.name, "modifier": mod.name, "count": mod.count}


def bl_mod_solidify(params):
    obj = get_object(params["name"])
    mod = obj.modifiers.new(name="Solidify", type='SOLIDIFY')
    mod.thickness = params.get("thickness", 0.01)
    return {"object": obj.name, "modifier": mod.name, "thickness": mod.thickness}


def bl_mod_bevel(params):
    obj = get_object(params["name"])
    mod = obj.modifiers.new(name="Bevel", type='BEVEL')
    mod.width = params.get("width", 0.02)
    mod.segments = params.get("segments", 3)
    return {"object": obj.name, "modifier": mod.name}


def bl_mod_boolean(params):
    obj = get_object(params["name"])
    target = get_object(params["target"])
    mod = obj.modifiers.new(name="Boolean", type='BOOLEAN')
    mod.operation = params.get("operation", "DIFFERENCE").upper()
    mod.object = target
    return {"object": obj.name, "modifier": mod.name, "operation": mod.operation, "target": target.name}


def bl_mod_list(params):
    obj = get_object(params["name"])
    mods = [{"name": m.name, "type": m.type} for m in obj.modifiers]
    return {"object": obj.name, "modifiers": mods, "count": len(mods)}


def get_routes():
    return {
        "bl_mod_add": bl_mod_add,
        "bl_mod_remove": bl_mod_remove,
        "bl_mod_apply": bl_mod_apply,
        "bl_mod_subsurf": bl_mod_subsurf,
        "bl_mod_mirror": bl_mod_mirror,
        "bl_mod_array": bl_mod_array,
        "bl_mod_solidify": bl_mod_solidify,
        "bl_mod_bevel": bl_mod_bevel,
        "bl_mod_boolean": bl_mod_boolean,
        "bl_mod_list": bl_mod_list,
    }
