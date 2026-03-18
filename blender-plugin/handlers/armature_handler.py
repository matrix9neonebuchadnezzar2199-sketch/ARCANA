"""BL Armature Handler - 10 tools for armature/bone operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only, ensure_mode


def bl_armature_create(params):
    name = params.get("name", "Armature")
    location = params.get("location", [0, 0, 0])
    bpy.ops.object.armature_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    return {"name": obj.name, "bones": len(obj.data.bones)}


def bl_armature_add_bone(params):
    obj = get_object(params["armature"])
    select_only(obj)
    ensure_mode('EDIT')
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
            bone.use_connect = params.get("connected", False)
    ensure_mode('OBJECT')
    return {"armature": obj.name, "bone": bone.name}


def bl_armature_remove_bone(params):
    obj = get_object(params["armature"])
    select_only(obj)
    ensure_mode('EDIT')
    bone_name = params["boneName"]
    bone = obj.data.edit_bones.get(bone_name)
    if not bone:
        raise ValueError(f"Bone not found: {bone_name}")
    obj.data.edit_bones.remove(bone)
    ensure_mode('OBJECT')
    return {"armature": obj.name, "removed": bone_name}


def bl_armature_set_parent(params):
    obj = get_object(params["armature"])
    select_only(obj)
    ensure_mode('EDIT')
    child = obj.data.edit_bones.get(params["child"])
    parent = obj.data.edit_bones.get(params["parent"])
    if not child or not parent:
        raise ValueError("Child or parent bone not found")
    child.parent = parent
    child.use_connect = params.get("connected", False)
    ensure_mode('OBJECT')
    return {"child": params["child"], "parent": params["parent"]}


def bl_armature_rename_bone(params):
    obj = get_object(params["armature"])
    bone = obj.data.bones.get(params["oldName"])
    if not bone:
        raise ValueError(f"Bone not found: {params['oldName']}")
    bone.name = params["newName"]
    return {"oldName": params["oldName"], "newName": bone.name}


def bl_armature_set_ik(params):
    obj = get_object(params["armature"])
    select_only(obj)
    ensure_mode('POSE')
    bone_name = params["bone"]
    pose_bone = obj.pose.bones.get(bone_name)
    if not pose_bone:
        raise ValueError(f"Pose bone not found: {bone_name}")
    ik = pose_bone.constraints.new('IK')
    ik.chain_count = params.get("chainLength", 2)
    target_name = params.get("target")
    if target_name:
        ik.target = bpy.data.objects.get(target_name)
    ensure_mode('OBJECT')
    return {"armature": obj.name, "bone": bone_name, "ik": True}


def bl_armature_auto_weights(params):
    armature = get_object(params["armature"])
    mesh_obj = get_object(params["mesh"])
    mesh_obj.select_set(True)
    armature.select_set(True)
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.parent_set(type='ARMATURE_AUTO')
    return {"armature": armature.name, "mesh": mesh_obj.name, "weights": "automatic"}


def bl_armature_set_pose(params):
    obj = get_object(params["armature"])
    select_only(obj)
    ensure_mode('POSE')
    bone_name = params["bone"]
    pose_bone = obj.pose.bones.get(bone_name)
    if not pose_bone:
        raise ValueError(f"Pose bone not found: {bone_name}")
    import math
    rotation = params.get("rotation")
    if rotation:
        pose_bone.rotation_euler = [math.radians(r) for r in rotation]
    location = params.get("location")
    if location:
        pose_bone.location = location
    ensure_mode('OBJECT')
    return {"bone": bone_name, "posed": True}


def bl_armature_list_bones(params):
    obj = get_object(params["armature"])
    bones = []
    for b in obj.data.bones:
        bones.append({
            "name": b.name,
            "parent": b.parent.name if b.parent else None,
            "head": list(b.head_local),
            "tail": list(b.tail_local),
            "connected": b.use_connect,
        })
    return {"armature": obj.name, "bones": bones, "count": len(bones)}


def bl_armature_set_rest_pose(params):
    obj = get_object(params["armature"])
    select_only(obj)
    ensure_mode('POSE')
    bpy.ops.pose.armature_apply()
    ensure_mode('OBJECT')
    return {"armature": obj.name, "restPoseApplied": True}


def get_routes():
    return {
        "bl_armature_create": bl_armature_create,
        "bl_armature_add_bone": bl_armature_add_bone,
        "bl_armature_remove_bone": bl_armature_remove_bone,
        "bl_armature_set_parent": bl_armature_set_parent,
        "bl_armature_rename_bone": bl_armature_rename_bone,
        "bl_armature_set_ik": bl_armature_set_ik,
        "bl_armature_auto_weights": bl_armature_auto_weights,
        "bl_armature_set_pose": bl_armature_set_pose,
        "bl_armature_list_bones": bl_armature_list_bones,
        "bl_armature_set_rest_pose": bl_armature_set_rest_pose,
    }
