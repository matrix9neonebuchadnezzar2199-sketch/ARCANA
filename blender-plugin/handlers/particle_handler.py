"""BL Particle Handler - 8 tools for particle system operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only


def bl_particle_add(params):
    obj = get_object(params["name"])
    select_only(obj)
    bpy.ops.object.particle_system_add()
    ps = obj.particle_systems[-1]
    ps_name = params.get("systemName")
    if ps_name:
        ps.name = ps_name
    ps.settings.count = params.get("count", 1000)
    ps.settings.type = 'EMITTER'
    return {"object": obj.name, "system": ps.name, "count": ps.settings.count}


def bl_particle_add_hair(params):
    obj = get_object(params["name"])
    select_only(obj)
    bpy.ops.object.particle_system_add()
    ps = obj.particle_systems[-1]
    ps_name = params.get("systemName")
    if ps_name:
        ps.name = ps_name
    ps.settings.type = 'HAIR'
    ps.settings.count = params.get("count", 500)
    ps.settings.hair_length = params.get("length", 0.5)
    return {"object": obj.name, "system": ps.name, "type": "HAIR", "count": ps.settings.count}


def bl_particle_set_count(params):
    obj = get_object(params["name"])
    sys_name = params.get("system")
    ps = obj.particle_systems.get(sys_name) if sys_name else obj.particle_systems[-1]
    if not ps:
        raise ValueError("Particle system not found")
    ps.settings.count = params.get("count", 1000)
    return {"object": obj.name, "system": ps.name, "count": ps.settings.count}


def bl_particle_set_lifetime(params):
    obj = get_object(params["name"])
    sys_name = params.get("system")
    ps = obj.particle_systems.get(sys_name) if sys_name else obj.particle_systems[-1]
    if not ps:
        raise ValueError("Particle system not found")
    ps.settings.lifetime = params.get("lifetime", 50)
    ps.settings.lifetime_random = params.get("random", 0.0)
    return {"system": ps.name, "lifetime": ps.settings.lifetime}


def bl_particle_set_size(params):
    obj = get_object(params["name"])
    sys_name = params.get("system")
    ps = obj.particle_systems.get(sys_name) if sys_name else obj.particle_systems[-1]
    if not ps:
        raise ValueError("Particle system not found")
    ps.settings.particle_size = params.get("size", 0.05)
    ps.settings.size_random = params.get("random", 0.0)
    return {"system": ps.name, "size": ps.settings.particle_size}


def bl_particle_set_velocity(params):
    obj = get_object(params["name"])
    sys_name = params.get("system")
    ps = obj.particle_systems.get(sys_name) if sys_name else obj.particle_systems[-1]
    if not ps:
        raise ValueError("Particle system not found")
    ps.settings.normal_factor = params.get("normal", 1.0)
    ps.settings.tangent_factor = params.get("tangent", 0.0)
    ps.settings.object_align_factor = params.get("objectAlign", [0, 0, 0])
    return {"system": ps.name, "normal": ps.settings.normal_factor}


def bl_particle_remove(params):
    obj = get_object(params["name"])
    select_only(obj)
    idx = params.get("index", len(obj.particle_systems) - 1)
    obj.particle_systems.active_index = idx
    bpy.ops.object.particle_system_remove()
    return {"object": obj.name, "removed": idx}


def bl_particle_list(params):
    obj = get_object(params["name"])
    systems = [{"name": ps.name, "type": ps.settings.type, "count": ps.settings.count} for ps in obj.particle_systems]
    return {"object": obj.name, "systems": systems, "count": len(systems)}


def get_routes():
    return {
        "bl_particle_add": bl_particle_add,
        "bl_particle_add_hair": bl_particle_add_hair,
        "bl_particle_set_count": bl_particle_set_count,
        "bl_particle_set_lifetime": bl_particle_set_lifetime,
        "bl_particle_set_size": bl_particle_set_size,
        "bl_particle_set_velocity": bl_particle_set_velocity,
        "bl_particle_remove": bl_particle_remove,
        "bl_particle_list": bl_particle_list,
    }
