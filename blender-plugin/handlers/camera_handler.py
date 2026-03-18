"""BL Camera Handler - 6 tools for camera operations."""

import bpy
import math
from ..utils.bpy_helpers import get_object, select_only, obj_to_dict


def bl_camera_create(params):
    name = params.get("name", "Camera")
    location = params.get("location", [0, -10, 5])
    bpy.ops.object.camera_add(location=location)
    cam_obj = bpy.context.active_object
    cam_obj.name = name
    rotation = params.get("rotation")
    if rotation:
        cam_obj.rotation_euler = [math.radians(r) for r in rotation]
    return obj_to_dict(cam_obj)


def bl_camera_set_focal(params):
    obj = get_object(params["name"])
    if obj.type != 'CAMERA':
        raise ValueError(f"{obj.name} is not a camera")
    obj.data.lens = params.get("focalLength", 50)
    return {"name": obj.name, "focalLength": obj.data.lens}


def bl_camera_set_fov(params):
    obj = get_object(params["name"])
    if obj.type != 'CAMERA':
        raise ValueError(f"{obj.name} is not a camera")
    fov = params.get("fov", 60)
    obj.data.angle = math.radians(fov)
    return {"name": obj.name, "fov": fov}


def bl_camera_set_clip(params):
    obj = get_object(params["name"])
    if obj.type != 'CAMERA':
        raise ValueError(f"{obj.name} is not a camera")
    obj.data.clip_start = params.get("near", 0.1)
    obj.data.clip_end = params.get("far", 1000)
    return {"name": obj.name, "near": obj.data.clip_start, "far": obj.data.clip_end}


def bl_camera_set_active(params):
    obj = get_object(params["name"])
    if obj.type != 'CAMERA':
        raise ValueError(f"{obj.name} is not a camera")
    bpy.context.scene.camera = obj
    return {"active_camera": obj.name}


def bl_camera_set_dof(params):
    obj = get_object(params["name"])
    if obj.type != 'CAMERA':
        raise ValueError(f"{obj.name} is not a camera")
    obj.data.dof.use_dof = params.get("enable", True)
    obj.data.dof.focus_distance = params.get("focusDistance", 5.0)
    obj.data.dof.aperture_fstop = params.get("fstop", 2.8)
    return {"name": obj.name, "dof": True, "focusDistance": obj.data.dof.focus_distance}


def get_routes():
    return {
        "bl_camera_create": bl_camera_create,
        "bl_camera_set_focal": bl_camera_set_focal,
        "bl_camera_set_fov": bl_camera_set_fov,
        "bl_camera_set_clip": bl_camera_set_clip,
        "bl_camera_set_active": bl_camera_set_active,
        "bl_camera_set_dof": bl_camera_set_dof,
    }
