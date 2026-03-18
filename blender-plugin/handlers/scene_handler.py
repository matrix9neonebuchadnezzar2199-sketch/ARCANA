"""BL Scene Handler - 8 tools for scene management."""

import bpy
from ..utils.bpy_helpers import obj_to_dict


def bl_scene_list(params):
    scenes = [{"name": s.name, "objects": len(s.objects)} for s in bpy.data.scenes]
    return {"scenes": scenes, "count": len(scenes)}


def bl_scene_create(params):
    name = params.get("name", "Scene")
    scene = bpy.data.scenes.new(name=name)
    return {"name": scene.name}


def bl_scene_delete(params):
    name = params["name"]
    scene = bpy.data.scenes.get(name)
    if not scene:
        raise ValueError(f"Scene not found: {name}")
    bpy.data.scenes.remove(scene)
    return {"deleted": name}


def bl_scene_set_active(params):
    name = params["name"]
    scene = bpy.data.scenes.get(name)
    if not scene:
        raise ValueError(f"Scene not found: {name}")
    bpy.context.window.scene = scene
    return {"active": scene.name}


def bl_scene_list_objects(params):
    scene = bpy.context.scene
    objects = [obj_to_dict(obj) for obj in scene.objects]
    return {"scene": scene.name, "objects": objects, "count": len(objects)}


def bl_scene_set_unit(params):
    scene = bpy.context.scene
    system = params.get("system", "METRIC").upper()
    scene.unit_settings.system = system
    scale = params.get("scale")
    if scale is not None:
        scene.unit_settings.scale_length = scale
    return {"system": system, "scale": scene.unit_settings.scale_length}


def bl_scene_set_gravity(params):
    scene = bpy.context.scene
    scene.use_gravity = params.get("enable", True)
    g = params.get("gravity", [0, 0, -9.81])
    scene.gravity = g
    return {"gravity": list(scene.gravity), "enabled": scene.use_gravity}


def bl_scene_save(params):
    path = params.get("path", "")
    if path:
        bpy.ops.wm.save_as_mainfile(filepath=path)
    else:
        bpy.ops.wm.save_mainfile()
    return {"saved": bpy.data.filepath or path}


def get_routes():
    return {
        "bl_scene_list": bl_scene_list,
        "bl_scene_create": bl_scene_create,
        "bl_scene_delete": bl_scene_delete,
        "bl_scene_set_active": bl_scene_set_active,
        "bl_scene_list_objects": bl_scene_list_objects,
        "bl_scene_set_unit": bl_scene_set_unit,
        "bl_scene_set_gravity": bl_scene_set_gravity,
        "bl_scene_save": bl_scene_save,
    }
