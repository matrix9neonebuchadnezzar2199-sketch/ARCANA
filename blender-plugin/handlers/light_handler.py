"""BL Light Handler - 6 tools for light operations."""

import bpy
from ..utils.bpy_helpers import get_object, obj_to_dict


def bl_light_create(params):
    light_type = params.get("type", "POINT").upper()
    name = params.get("name", "Light")
    location = params.get("location", [0, 0, 5])
    bpy.ops.object.light_add(type=light_type, location=location)
    obj = bpy.context.active_object
    obj.name = name
    energy = params.get("energy")
    if energy is not None:
        obj.data.energy = energy
    return obj_to_dict(obj)


def bl_light_set_color(params):
    obj = get_object(params["name"])
    if obj.type != 'LIGHT':
        raise ValueError(f"{obj.name} is not a light")
    c = params["color"]
    obj.data.color = (c.get("r", 1), c.get("g", 1), c.get("b", 1))
    return {"name": obj.name, "color": params["color"]}


def bl_light_set_energy(params):
    obj = get_object(params["name"])
    if obj.type != 'LIGHT':
        raise ValueError(f"{obj.name} is not a light")
    obj.data.energy = params.get("energy", 1000)
    return {"name": obj.name, "energy": obj.data.energy}


def bl_light_set_shadow(params):
    obj = get_object(params["name"])
    if obj.type != 'LIGHT':
        raise ValueError(f"{obj.name} is not a light")
    obj.data.use_shadow = params.get("enable", True)
    if hasattr(obj.data, 'shadow_soft_size'):
        obj.data.shadow_soft_size = params.get("softness", 0.25)
    return {"name": obj.name, "shadow": obj.data.use_shadow}


def bl_light_set_spot(params):
    obj = get_object(params["name"])
    if obj.type != 'LIGHT' or obj.data.type != 'SPOT':
        raise ValueError(f"{obj.name} is not a spot light")
    import math
    obj.data.spot_size = math.radians(params.get("angle", 45))
    obj.data.spot_blend = params.get("blend", 0.15)
    return {"name": obj.name, "angle": params.get("angle", 45)}


def bl_light_list(params):
    lights = [obj for obj in bpy.data.objects if obj.type == 'LIGHT']
    return {"lights": [{"name": l.name, "type": l.data.type, "energy": l.data.energy} for l in lights], "count": len(lights)}


def get_routes():
    return {
        "bl_light_create": bl_light_create,
        "bl_light_set_color": bl_light_set_color,
        "bl_light_set_energy": bl_light_set_energy,
        "bl_light_set_shadow": bl_light_set_shadow,
        "bl_light_set_spot": bl_light_set_spot,
        "bl_light_list": bl_light_list,
    }
