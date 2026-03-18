"""BL Animation Handler - 10 tools for animation and keyframe operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only


def bl_anim_insert_keyframe(params):
    obj = get_object(params["name"])
    frame = params.get("frame", bpy.context.scene.frame_current)
    data_path = params.get("dataPath", "location")
    bpy.context.scene.frame_set(frame)
    obj.keyframe_insert(data_path=data_path)
    return {"name": obj.name, "frame": frame, "dataPath": data_path}


def bl_anim_delete_keyframe(params):
    obj = get_object(params["name"])
    frame = params.get("frame", bpy.context.scene.frame_current)
    data_path = params.get("dataPath", "location")
    bpy.context.scene.frame_set(frame)
    obj.keyframe_delete(data_path=data_path)
    return {"name": obj.name, "frame": frame, "deleted": data_path}


def bl_anim_set_frame_range(params):
    scene = bpy.context.scene
    scene.frame_start = params.get("start", 1)
    scene.frame_end = params.get("end", 250)
    return {"start": scene.frame_start, "end": scene.frame_end}


def bl_anim_set_current_frame(params):
    frame = params.get("frame", 1)
    bpy.context.scene.frame_set(frame)
    return {"frame": frame}


def bl_anim_set_fps(params):
    scene = bpy.context.scene
    fps = params.get("fps", 24)
    scene.render.fps = fps
    return {"fps": fps}


def bl_anim_create_action(params):
    name = params.get("name", "Action")
    action = bpy.data.actions.new(name=name)
    obj_name = params.get("object")
    if obj_name:
        obj = get_object(obj_name)
        if not obj.animation_data:
            obj.animation_data_create()
        obj.animation_data.action = action
    return {"action": action.name}


def bl_anim_create_bone(params):
    obj = get_object(params["armature"])
    select_only(obj)
    bpy.ops.object.mode_set(mode='EDIT')
    bone = obj.data.edit_bones.new(params.get("boneName", "Bone"))
    head = params.get("head", [0, 0, 0])
    tail = params.get("tail", [0, 0, 1])
    bone.head = head
    bone.tail = tail
    parent_name = params.get("parent")
    if parent_name:
        parent = obj.data.edit_bones.get(parent_name)
        if parent:
            bone.parent = parent
    bpy.ops.object.mode_set(mode='OBJECT')
    return {"armature": obj.name, "bone": bone.name}


def bl_anim_play(params):
    bpy.ops.screen.animation_play()
    return {"playing": True}


def bl_anim_stop(params):
    bpy.ops.screen.animation_cancel()
    return {"playing": False}


def bl_anim_list_actions(params):
    actions = [{"name": a.name, "frames": a.frame_range[:]} for a in bpy.data.actions]
    return {"actions": actions, "count": len(actions)}


def get_routes():
    return {
        "bl_anim_insert_keyframe": bl_anim_insert_keyframe,
        "bl_anim_delete_keyframe": bl_anim_delete_keyframe,
        "bl_anim_set_frame_range": bl_anim_set_frame_range,
        "bl_anim_set_current_frame": bl_anim_set_current_frame,
        "bl_anim_set_fps": bl_anim_set_fps,
        "bl_anim_create_action": bl_anim_create_action,
        "bl_anim_create_bone": bl_anim_create_bone,
        "bl_anim_play": bl_anim_play,
        "bl_anim_stop": bl_anim_stop,
        "bl_anim_list_actions": bl_anim_list_actions,
    }
