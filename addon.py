"""
ARCANA Bridge - Single-file Blender Add-on
Auto-generated from blender-plugin/ sources.
Connects Blender to ARCANA MCP Server via WebSocket.
"""

bl_info = {
    "name": "ARCANA Bridge",
    "author": "ARCANA Project",
    "version": (6, 4, 0),
    "blender": (3, 6, 0),
    "location": "View3D > Sidebar > ARCANA",
    "description": "Connect Blender to ARCANA MCP Server via WebSocket",
    "category": "Development",
}

import bpy
import mathutils
import json
import threading
import time
import queue
import socket
import struct
import hashlib
import base64
import os
import math
import traceback
import io
from contextlib import redirect_stdout
from bpy.props import StringProperty, IntProperty, BoolProperty

# ============================================================
# bpy_helpers
# ============================================================
"""
Blender Python helpers - common bpy operations.
"""



def get_object(name: str):
    """Get object by name, raise if not found."""
    obj = bpy.data.objects.get(name)
    if obj is None:
        raise ValueError(f"Object not found: {name}")
    return obj


def get_active_object():
    """Get the active object."""
    obj = bpy.context.active_object
    if obj is None:
        raise ValueError("No active object")
    return obj


def select_only(obj):
    """Deselect all, then select and activate obj."""
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def ensure_mode(mode: str):
    """Switch to the given mode if not already in it."""
    if bpy.context.mode != mode:
        if mode == 'OBJECT':
            bpy.ops.object.mode_set(mode='OBJECT')
        elif mode == 'EDIT':
            bpy.ops.object.mode_set(mode='EDIT')
        elif mode == 'SCULPT':
            bpy.ops.object.mode_set(mode='SCULPT')
        elif mode == 'WEIGHT_PAINT':
            bpy.ops.object.mode_set(mode='WEIGHT_PAINT')
        elif mode == 'TEXTURE_PAINT':
            bpy.ops.object.mode_set(mode='TEXTURE_PAINT')
        elif mode == 'VERTEX_PAINT':
            bpy.ops.object.mode_set(mode='VERTEX_PAINT')
        elif mode == 'POSE':
            bpy.ops.object.mode_set(mode='POSE')


def vec3(x=0, y=0, z=0):
    return mathutils.Vector((x, y, z))


def color4(r=1, g=1, b=1, a=1):
    return (r, g, b, a)


def obj_to_dict(obj):
    """Serialize a Blender object to a dict summary."""
    return {
        "name": obj.name,
        "type": obj.type,
        "location": list(obj.location),
        "rotation": list(obj.rotation_euler),
        "scale": list(obj.scale),
        "visible": obj.visible_get(),
    }


# ============================================================
# command_router
# ============================================================
"""
Command Router - maps tool IDs to handler functions.
Supports alias mapping and explicit not-implemented tracking.
"""

_routes = {}
_aliases = {}
_not_implemented = set()


def register_route(tool_id, handler_func):
    """Register a tool_id -> handler mapping."""
    _routes[tool_id] = handler_func


def register_routes(mapping: dict):
    """Register multiple routes at once."""
    _routes.update(mapping)


def register_alias(alias_id, target_id):
    """Register an alias: alias_id will be routed to target_id's handler."""
    _aliases[alias_id] = target_id


def register_aliases(mapping: dict):
    """Register multiple aliases at once."""
    _aliases.update(mapping)


def register_not_implemented(tool_ids):
    """Register tool IDs that are known but not yet implemented."""
    _not_implemented.update(tool_ids)


def route_command(tool_id: str, params: dict):
    """Find and execute the handler for a given tool_id."""
    # Direct match
    handler = _routes.get(tool_id)
    if handler:
        return handler(params)

    # Alias match
    resolved = _aliases.get(tool_id)
    if resolved:
        handler = _routes.get(resolved)
        if handler:
            return handler(params)

    # Known but not implemented
    if tool_id in _not_implemented:
        raise NotImplementedError(
            f"Tool '{tool_id}' is recognized but not yet implemented in the Blender plugin."
        )

    raise ValueError(
        f"Unknown tool: {tool_id}. "
        f"Registered: {len(_routes)} routes, {len(_aliases)} aliases, "
        f"{len(_not_implemented)} not-implemented."
    )


def get_registered_count():
    return len(_routes)


def get_alias_count():
    return len(_aliases)


def get_not_implemented_count():
    return len(_not_implemented)


def list_routes():
    return list(_routes.keys())


def list_aliases():
    return dict(_aliases)


def list_not_implemented():
    return sorted(_not_implemented)


# ============================================================
# Handler: animation_handler
# ============================================================
"""BL Animation Handler - 10 tools for animation and keyframe operations."""



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


def animation_handler_get_routes():
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


# ============================================================
# Handler: armature_handler
# ============================================================
"""BL Armature Handler - 10 tools for armature/bone operations."""



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


def armature_handler_get_routes():
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


# ============================================================
# Handler: camera_handler
# ============================================================
"""BL Camera Handler - 6 tools for camera operations."""



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


def camera_handler_get_routes():
    return {
        "bl_camera_create": bl_camera_create,
        "bl_camera_set_focal": bl_camera_set_focal,
        "bl_camera_set_fov": bl_camera_set_fov,
        "bl_camera_set_clip": bl_camera_set_clip,
        "bl_camera_set_active": bl_camera_set_active,
        "bl_camera_set_dof": bl_camera_set_dof,
    }


# ============================================================
# Handler: compositor_handler
# ============================================================
"""BL Compositor Handler - 7 tools for compositor node operations."""



def _get_comp_tree():
    scene = bpy.context.scene
    scene.use_nodes = True
    return scene.node_tree


def bl_comp_enable(params):
    scene = bpy.context.scene
    scene.use_nodes = params.get("enable", True)
    return {"compositing": scene.use_nodes}


def bl_comp_add_node(params):
    tree = _get_comp_tree()
    node_type = params.get("type", "CompositorNodeBrightContrast")
    node = tree.nodes.new(type=node_type)
    loc = params.get("location", [0, 0])
    node.location = loc
    name = params.get("name")
    if name:
        node.label = name
    return {"node": node.name, "type": node.bl_idname}


def bl_comp_connect(params):
    tree = _get_comp_tree()
    from_node = tree.nodes.get(params["fromNode"])
    to_node = tree.nodes.get(params["toNode"])
    if not from_node or not to_node:
        raise ValueError("Node not found")
    from_idx = params.get("fromOutput", 0)
    to_idx = params.get("toInput", 0)
    tree.links.new(from_node.outputs[from_idx], to_node.inputs[to_idx])
    return {"linked": True}


def bl_comp_set_value(params):
    tree = _get_comp_tree()
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    input_name = params.get("input")
    value = params.get("value")
    if input_name is not None and value is not None:
        inp = node.inputs.get(input_name) if isinstance(input_name, str) else node.inputs[input_name]
        if inp:
            inp.default_value = value
    return {"node": node.name, "set": True}


def bl_comp_add_filter(params):
    tree = _get_comp_tree()
    filter_type = params.get("filter", "BLUR").upper()
    type_map = {
        "BLUR": "CompositorNodeBlur",
        "SHARPEN": "CompositorNodeFilter",
        "GLARE": "CompositorNodeGlare",
        "DENOISE": "CompositorNodeDenoise",
        "DEFOCUS": "CompositorNodeDefocus",
    }
    node_type = type_map.get(filter_type, "CompositorNodeBlur")
    node = tree.nodes.new(type=node_type)
    return {"node": node.name, "filter": filter_type}


def bl_comp_set_mix(params):
    tree = _get_comp_tree()
    node_name = params.get("node")
    node = tree.nodes.get(node_name) if node_name else None
    if not node:
        node = tree.nodes.new(type="CompositorNodeMixRGB")
    node.blend_type = params.get("blendType", "MIX").upper()
    fac = params.get("factor")
    if fac is not None:
        node.inputs["Fac"].default_value = fac
    return {"node": node.name, "blendType": node.blend_type}


def bl_comp_list_nodes(params):
    tree = _get_comp_tree()
    nodes = [{"name": n.name, "type": n.bl_idname, "muted": n.mute} for n in tree.nodes]
    return {"nodes": nodes, "count": len(nodes)}


def compositor_handler_get_routes():
    return {
        "bl_comp_enable": bl_comp_enable,
        "bl_comp_add_node": bl_comp_add_node,
        "bl_comp_connect": bl_comp_connect,
        "bl_comp_set_value": bl_comp_set_value,
        "bl_comp_add_filter": bl_comp_add_filter,
        "bl_comp_set_mix": bl_comp_set_mix,
        "bl_comp_list_nodes": bl_comp_list_nodes,
    }


# ============================================================
# Handler: geometry_nodes_handler
# ============================================================
"""BL Geometry Nodes Handler - 10 tools for geometry node operations."""



def bl_geonodes_create_tree(params):
    name = params.get("name", "GeometryNodes")
    tree = bpy.data.node_groups.new(name=name, type='GeometryNodeTree')
    # Add default input/output
    tree.inputs.new('NodeSocketGeometry', "Geometry")
    tree.outputs.new('NodeSocketGeometry', "Geometry")
    input_node = tree.nodes.new('NodeGroupInput')
    output_node = tree.nodes.new('NodeGroupOutput')
    input_node.location = (-300, 0)
    output_node.location = (300, 0)
    tree.links.new(input_node.outputs[0], output_node.inputs[0])
    return {"name": tree.name}


def bl_geonodes_add_node(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    node_type = params.get("type", "GeometryNodeMeshCube")
    node = tree.nodes.new(type=node_type)
    loc = params.get("location", [0, 0])
    node.location = loc
    name = params.get("name")
    if name:
        node.label = name
    return {"node": node.name, "type": node.bl_idname, "location": list(node.location)}


def bl_geonodes_connect(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    from_node = tree.nodes.get(params["fromNode"])
    to_node = tree.nodes.get(params["toNode"])
    if not from_node or not to_node:
        raise ValueError("Node not found")
    from_idx = params.get("fromOutput", 0)
    to_idx = params.get("toInput", 0)
    tree.links.new(from_node.outputs[from_idx], to_node.inputs[to_idx])
    return {"linked": True}


def bl_geonodes_set_value(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    input_name = params.get("input")
    value = params.get("value")
    if input_name is not None and value is not None:
        inp = node.inputs.get(input_name) if isinstance(input_name, str) else node.inputs[input_name]
        if inp:
            inp.default_value = value
    return {"node": node.name, "set": True}


def bl_geonodes_add_group_input(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    socket_type = params.get("socketType", "NodeSocketFloat")
    name = params.get("inputName", "Value")
    tree.inputs.new(socket_type, name)
    return {"tree": tree.name, "input": name, "type": socket_type}


def bl_geonodes_add_group_output(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    socket_type = params.get("socketType", "NodeSocketFloat")
    name = params.get("outputName", "Result")
    tree.outputs.new(socket_type, name)
    return {"tree": tree.name, "output": name, "type": socket_type}


def bl_geonodes_assign(params):
    obj = get_object(params["object"])
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    mod = None
    for m in obj.modifiers:
        if m.type == 'NODES':
            mod = m
            break
    if not mod:
        mod = obj.modifiers.new(name="GeometryNodes", type='NODES')
    mod.node_group = tree
    return {"object": obj.name, "tree": tree.name}


def bl_geonodes_list_nodes(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    nodes = [{"name": n.name, "type": n.bl_idname, "location": list(n.location)} for n in tree.nodes]
    return {"tree": tree.name, "nodes": nodes, "count": len(nodes)}


def bl_geonodes_remove_node(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    node_name = params["node"]
    node = tree.nodes.get(node_name)
    if not node:
        raise ValueError(f"Node not found: {node_name}")
    tree.nodes.remove(node)
    return {"tree": tree.name, "removed": node_name}


def bl_geonodes_duplicate(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    new_tree = tree.copy()
    new_name = params.get("newName")
    if new_name:
        new_tree.name = new_name
    return {"original": tree.name, "copy": new_tree.name}


def geometry_nodes_handler_get_routes():
    return {
        "bl_geonodes_create_tree": bl_geonodes_create_tree,
        "bl_geonodes_add_node": bl_geonodes_add_node,
        "bl_geonodes_connect": bl_geonodes_connect,
        "bl_geonodes_set_value": bl_geonodes_set_value,
        "bl_geonodes_add_group_input": bl_geonodes_add_group_input,
        "bl_geonodes_add_group_output": bl_geonodes_add_group_output,
        "bl_geonodes_assign": bl_geonodes_assign,
        "bl_geonodes_list_nodes": bl_geonodes_list_nodes,
        "bl_geonodes_remove_node": bl_geonodes_remove_node,
        "bl_geonodes_duplicate": bl_geonodes_duplicate,
    }


# ============================================================
# Handler: grease_pencil_handler
# ============================================================
"""BL Grease Pencil Handler - 8 tools for grease pencil operations."""



def bl_gp_create(params):
    name = params.get("name", "GPencil")
    location = params.get("location", [0, 0, 0])
    bpy.ops.object.gpencil_add(type='EMPTY', location=location)
    obj = bpy.context.active_object
    obj.name = name
    return {"name": obj.name, "type": "GPENCIL"}


def bl_gp_add_layer(params):
    obj = get_object(params["name"])
    if obj.type != 'GPENCIL':
        raise ValueError(f"{obj.name} is not a grease pencil object")
    layer_name = params.get("layer", "Layer")
    layer = obj.data.layers.new(layer_name)
    layer.frames.new(bpy.context.scene.frame_current)
    return {"object": obj.name, "layer": layer.info}


def bl_gp_add_frame(params):
    obj = get_object(params["name"])
    if obj.type != 'GPENCIL':
        raise ValueError(f"{obj.name} is not a grease pencil object")
    layer_name = params.get("layer")
    layer = obj.data.layers.get(layer_name) if layer_name else obj.data.layers.active
    if not layer:
        raise ValueError("No layer found")
    frame_num = params.get("frame", bpy.context.scene.frame_current)
    frame = layer.frames.new(frame_num)
    return {"object": obj.name, "layer": layer.info, "frame": frame.frame_number}


def bl_gp_set_brush(params):
    brush_name = params.get("brush", "Draw Pencil")
    brush = bpy.data.brushes.get(brush_name)
    if brush:
        ts = bpy.context.tool_settings
        ts.gpencil_paint.brush = brush
    return {"brush": brush_name}


def bl_gp_set_color(params):
    obj = get_object(params["name"])
    if obj.type != 'GPENCIL':
        raise ValueError(f"{obj.name} is not a grease pencil object")
    mat_name = params.get("material", "GPMaterial")
    mat = bpy.data.materials.get(mat_name)
    if not mat:
        mat = bpy.data.materials.new(mat_name)
        bpy.data.materials.create_gpencil_data(mat)
    c = params.get("color", {"r": 0, "g": 0, "b": 0})
    mat.grease_pencil.color = (c.get("r", 0), c.get("g", 0), c.get("b", 0), 1.0)
    if mat.name not in [m.name for m in obj.data.materials]:
        obj.data.materials.append(mat)
    return {"object": obj.name, "material": mat.name, "color": c}


def bl_gp_set_thickness(params):
    obj = get_object(params["name"])
    if obj.type != 'GPENCIL':
        raise ValueError(f"{obj.name} is not a grease pencil object")
    layer = obj.data.layers.active
    if layer:
        layer.line_change = params.get("thickness", 0)
    return {"object": obj.name, "thickness": params.get("thickness", 0)}


def bl_gp_add_modifier(params):
    obj = get_object(params["name"])
    if obj.type != 'GPENCIL':
        raise ValueError(f"{obj.name} is not a grease pencil object")
    mod_type = params.get("type", "GP_SMOOTH").upper()
    mod_name = params.get("modName", mod_type)
    mod = obj.grease_pencil_modifiers.new(name=mod_name, type=mod_type)
    return {"object": obj.name, "modifier": mod.name, "type": mod.type}


def bl_gp_list(params):
    gp_objects = [obj for obj in bpy.data.objects if obj.type == 'GPENCIL']
    result = []
    for obj in gp_objects:
        layers = [{"name": l.info, "frames": len(l.frames)} for l in obj.data.layers]
        result.append({"name": obj.name, "layers": layers})
    return {"objects": result, "count": len(result)}


def grease_pencil_handler_get_routes():
    return {
        "bl_gp_create": bl_gp_create,
        "bl_gp_add_layer": bl_gp_add_layer,
        "bl_gp_add_frame": bl_gp_add_frame,
        "bl_gp_set_brush": bl_gp_set_brush,
        "bl_gp_set_color": bl_gp_set_color,
        "bl_gp_set_thickness": bl_gp_set_thickness,
        "bl_gp_add_modifier": bl_gp_add_modifier,
        "bl_gp_list": bl_gp_list,
    }


# ============================================================
# Handler: light_handler
# ============================================================
"""BL Light Handler - 6 tools for light operations."""



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
    obj.data.spot_size = math.radians(params.get("angle", 45))
    obj.data.spot_blend = params.get("blend", 0.15)
    return {"name": obj.name, "angle": params.get("angle", 45)}


def bl_light_list(params):
    lights = [obj for obj in bpy.data.objects if obj.type == 'LIGHT']
    return {"lights": [{"name": l.name, "type": l.data.type, "energy": l.data.energy} for l in lights], "count": len(lights)}


def light_handler_get_routes():
    return {
        "bl_light_create": bl_light_create,
        "bl_light_set_color": bl_light_set_color,
        "bl_light_set_energy": bl_light_set_energy,
        "bl_light_set_shadow": bl_light_set_shadow,
        "bl_light_set_spot": bl_light_set_spot,
        "bl_light_list": bl_light_list,
    }


# ============================================================
# Handler: material_handler
# ============================================================
"""BL Material Handler - 8 tools for material operations."""



def bl_material_create(params):
    name = params.get("name", "Material")
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    color = params.get("color")
    if color:
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Base Color"].default_value = (color.get("r", 0.8), color.get("g", 0.8), color.get("b", 0.8), 1.0)
    return {"name": mat.name}


def bl_material_assign(params):
    obj = get_object(params["object"])
    mat_name = params["material"]
    mat = bpy.data.materials.get(mat_name)
    if not mat:
        raise ValueError(f"Material not found: {mat_name}")
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)
    return {"object": obj.name, "material": mat.name}


def bl_material_set_color(params):
    mat_name = params["name"]
    mat = bpy.data.materials.get(mat_name)
    if not mat:
        raise ValueError(f"Material not found: {mat_name}")
    if not mat.use_nodes:
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        c = params["color"]
        bsdf.inputs["Base Color"].default_value = (c.get("r", 0.8), c.get("g", 0.8), c.get("b", 0.8), 1.0)
    return {"name": mat.name, "color": params["color"]}


def bl_material_set_metallic(params):
    mat = bpy.data.materials.get(params["name"])
    if not mat or not mat.use_nodes:
        raise ValueError(f"Material not found or no nodes: {params['name']}")
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Metallic"].default_value = params.get("value", 0.0)
    return {"name": mat.name, "metallic": params.get("value", 0.0)}


def bl_material_set_roughness(params):
    mat = bpy.data.materials.get(params["name"])
    if not mat or not mat.use_nodes:
        raise ValueError(f"Material not found or no nodes: {params['name']}")
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Roughness"].default_value = params.get("value", 0.5)
    return {"name": mat.name, "roughness": params.get("value", 0.5)}


def bl_material_set_transparency(params):
    mat = bpy.data.materials.get(params["name"])
    if not mat or not mat.use_nodes:
        raise ValueError(f"Material not found: {params['name']}")
    mat.blend_method = 'BLEND'
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Alpha"].default_value = params.get("alpha", 0.5)
    return {"name": mat.name, "alpha": params.get("alpha", 0.5)}


def bl_material_add_texture(params):
    mat = bpy.data.materials.get(params["name"])
    if not mat or not mat.use_nodes:
        raise ValueError(f"Material not found: {params['name']}")
    tree = mat.node_tree
    tex_node = tree.nodes.new('ShaderNodeTexImage')
    path = params.get("path", "")
    if path:
        img = bpy.data.images.load(path)
        tex_node.image = img
    bsdf = tree.nodes.get("Principled BSDF")
    if bsdf:
        tree.links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])
    return {"name": mat.name, "texture": path}


def bl_material_list(params):
    mats = bpy.data.materials
    return {"materials": [{"name": m.name, "users": m.users} for m in mats], "count": len(mats)}


def material_handler_get_routes():
    return {
        "bl_material_create": bl_material_create,
        "bl_material_assign": bl_material_assign,
        "bl_material_set_color": bl_material_set_color,
        "bl_material_set_metallic": bl_material_set_metallic,
        "bl_material_set_roughness": bl_material_set_roughness,
        "bl_material_set_transparency": bl_material_set_transparency,
        "bl_material_add_texture": bl_material_add_texture,
        "bl_material_list": bl_material_list,
    }


# ============================================================
# Handler: mesh_handler
# ============================================================
"""BL Mesh Handler - 10 tools for mesh editing."""

import bmesh


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


def mesh_handler_get_routes():
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


# ============================================================
# Handler: modifier_handler
# ============================================================
"""BL Modifier Handler - 10 tools for modifier operations."""



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


def modifier_handler_get_routes():
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


# ============================================================
# Handler: node_handler
# ============================================================
"""BL Node Handler - 10 tools for shader/compositor node operations."""



def _get_node_tree(params):
    mat_name = params.get("material")
    if mat_name:
        mat = bpy.data.materials.get(mat_name)
        if not mat or not mat.use_nodes:
            raise ValueError(f"Material not found or no nodes: {mat_name}")
        return mat.node_tree
    tree_name = params.get("tree")
    if tree_name:
        tree = bpy.data.node_groups.get(tree_name)
        if not tree:
            raise ValueError(f"Node tree not found: {tree_name}")
        return tree
    raise ValueError("Specify 'material' or 'tree'")


def bl_node_add(params):
    tree = _get_node_tree(params)
    node_type = params.get("type", "ShaderNodeMath")
    node = tree.nodes.new(type=node_type)
    loc = params.get("location", [0, 0])
    node.location = loc
    name = params.get("name")
    if name:
        node.name = name
        node.label = name
    return {"node": node.name, "type": node.bl_idname, "location": list(node.location)}


def bl_node_connect(params):
    tree = _get_node_tree(params)
    from_node = tree.nodes.get(params["fromNode"])
    to_node = tree.nodes.get(params["toNode"])
    if not from_node or not to_node:
        raise ValueError("Source or target node not found")
    from_idx = params.get("fromOutput", 0)
    to_idx = params.get("toInput", 0)
    if isinstance(from_idx, str):
        from_socket = from_node.outputs[from_idx]
    else:
        from_socket = from_node.outputs[from_idx]
    if isinstance(to_idx, str):
        to_socket = to_node.inputs[to_idx]
    else:
        to_socket = to_node.inputs[to_idx]
    tree.links.new(from_socket, to_socket)
    return {"from": from_node.name, "to": to_node.name}


def bl_node_remove(params):
    tree = _get_node_tree(params)
    node_name = params["node"]
    node = tree.nodes.get(node_name)
    if not node:
        raise ValueError(f"Node not found: {node_name}")
    tree.nodes.remove(node)
    return {"removed": node_name}


def bl_node_set_value(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    input_name = params.get("input")
    value = params.get("value")
    if input_name and value is not None:
        inp = node.inputs.get(input_name)
        if inp:
            inp.default_value = value
    prop = params.get("property")
    prop_val = params.get("propertyValue")
    if prop and prop_val is not None:
        setattr(node, prop, prop_val)
    return {"node": node.name, "input": input_name, "value": value}


def bl_node_create_group(params):
    name = params.get("name", "NodeGroup")
    tree_type = params.get("treeType", "ShaderNodeTree")
    group = bpy.data.node_groups.new(name=name, type=tree_type)
    group.inputs.new('NodeSocketFloat', "Input")
    group.outputs.new('NodeSocketFloat', "Output")
    return {"name": group.name, "type": tree_type}


def bl_node_list(params):
    tree = _get_node_tree(params)
    nodes = [{"name": n.name, "type": n.bl_idname, "location": list(n.location), "muted": n.mute} for n in tree.nodes]
    return {"nodes": nodes, "count": len(nodes)}


def bl_node_link(params):
    return bl_node_connect(params)


def bl_node_set_location(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    loc = params.get("location", [0, 0])
    node.location = loc
    return {"node": node.name, "location": list(node.location)}


def bl_node_mute(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    mute = params.get("mute", True)
    node.mute = mute
    return {"node": node.name, "muted": mute}


def bl_node_duplicate(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    new_node = tree.nodes.new(type=node.bl_idname)
    new_node.location = (node.location[0] + 200, node.location[1])
    new_node.label = node.label + "_copy" if node.label else ""
    return {"original": node.name, "copy": new_node.name}


def node_handler_get_routes():
    return {
        "bl_node_add": bl_node_add,
        "bl_node_connect": bl_node_connect,
        "bl_node_remove": bl_node_remove,
        "bl_node_set_value": bl_node_set_value,
        "bl_node_create_group": bl_node_create_group,
        "bl_node_list": bl_node_list,
        "bl_node_link": bl_node_link,
        "bl_node_set_location": bl_node_set_location,
        "bl_node_mute": bl_node_mute,
        "bl_node_duplicate": bl_node_duplicate,
    }


# ============================================================
# Handler: object_handler
# ============================================================
"""BL Object Handler - 10 tools for object CRUD operations."""



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


def object_handler_get_routes():
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


# ============================================================
# Handler: particle_handler
# ============================================================
"""BL Particle Handler - 8 tools for particle system operations."""



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


def particle_handler_get_routes():
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


# ============================================================
# Handler: render_handler
# ============================================================
"""BL Render Handler - 10 tools for render settings."""



def bl_render_set_engine(params):
    engine = params.get("engine", "CYCLES").upper()
    if engine in ("CYCLES", "BLENDER_EEVEE", "BLENDER_EEVEE_NEXT", "BLENDER_WORKBENCH"):
        bpy.context.scene.render.engine = engine
    return {"engine": bpy.context.scene.render.engine}


def bl_render_set_resolution(params):
    scene = bpy.context.scene
    scene.render.resolution_x = params.get("width", 1920)
    scene.render.resolution_y = params.get("height", 1080)
    scene.render.resolution_percentage = params.get("percentage", 100)
    return {"width": scene.render.resolution_x, "height": scene.render.resolution_y}


def bl_render_set_samples(params):
    scene = bpy.context.scene
    samples = params.get("samples", 128)
    if scene.render.engine == 'CYCLES':
        scene.cycles.samples = samples
    else:
        scene.eevee.taa_render_samples = samples
    return {"samples": samples, "engine": scene.render.engine}


def bl_render_set_output(params):
    scene = bpy.context.scene
    scene.render.filepath = params.get("path", "//render/")
    fmt = params.get("format", "PNG").upper()
    scene.render.image_settings.file_format = fmt
    return {"path": scene.render.filepath, "format": fmt}


def bl_render_render(params):
    animation = params.get("animation", False)
    if animation:
        bpy.ops.render.render(animation=True)
    else:
        bpy.ops.render.render(write_still=True)
    return {"rendered": True, "animation": animation}


def bl_render_set_world_color(params):
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    if not world.use_nodes:
        world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        c = params.get("color", {"r": 0.05, "g": 0.05, "b": 0.05})
        bg.inputs["Color"].default_value = (c["r"], c["g"], c["b"], 1.0)
        bg.inputs["Strength"].default_value = params.get("strength", 1.0)
    return {"color": params.get("color"), "strength": params.get("strength", 1.0)}


def bl_render_set_film(params):
    scene = bpy.context.scene
    if scene.render.engine == 'CYCLES':
        scene.render.film_transparent = params.get("transparent", False)
    scene.render.use_border = params.get("useBorder", False)
    return {"transparent": params.get("transparent", False)}


def bl_render_set_color_management(params):
    scene = bpy.context.scene
    scene.view_settings.view_transform = params.get("viewTransform", "Filmic")
    scene.view_settings.look = params.get("look", "None")
    scene.view_settings.exposure = params.get("exposure", 0.0)
    scene.view_settings.gamma = params.get("gamma", 1.0)
    return {"viewTransform": scene.view_settings.view_transform}


def bl_render_set_denoising(params):
    scene = bpy.context.scene
    enable = params.get("enable", True)
    if scene.render.engine == 'CYCLES':
        scene.cycles.use_denoising = enable
        denoiser = params.get("denoiser", "OPENIMAGEDENOISE")
        scene.cycles.denoiser = denoiser
    return {"denoising": enable}


def bl_render_get_settings(params):
    scene = bpy.context.scene
    return {
        "engine": scene.render.engine,
        "resolution": [scene.render.resolution_x, scene.render.resolution_y],
        "samples": scene.cycles.samples if scene.render.engine == 'CYCLES' else 0,
        "outputPath": scene.render.filepath,
        "format": scene.render.image_settings.file_format,
    }


def render_handler_get_routes():
    return {
        "bl_render_set_engine": bl_render_set_engine,
        "bl_render_set_resolution": bl_render_set_resolution,
        "bl_render_set_samples": bl_render_set_samples,
        "bl_render_set_output": bl_render_set_output,
        "bl_render_render": bl_render_render,
        "bl_render_set_world_color": bl_render_set_world_color,
        "bl_render_set_film": bl_render_set_film,
        "bl_render_set_color_management": bl_render_set_color_management,
        "bl_render_set_denoising": bl_render_set_denoising,
        "bl_render_get_settings": bl_render_get_settings,
    }


# ============================================================
# Handler: scene_handler
# ============================================================
"""BL Scene Handler - 8 tools for scene management."""



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


def scene_handler_get_routes():
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


# ============================================================
# Handler: sculpt_handler
# ============================================================
"""BL Sculpt Handler - 8 tools for sculpting."""



def bl_sculpt_enable(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('SCULPT')
    return {"name": obj.name, "mode": "SCULPT"}


def bl_sculpt_set_brush(params):
    brush_name = params.get("brush", "SculptDraw")
    brush = bpy.data.brushes.get(brush_name)
    if brush:
        bpy.context.tool_settings.sculpt.brush = brush
    return {"brush": brush_name}


def bl_sculpt_set_strength(params):
    strength = params.get("strength", 0.5)
    ts = bpy.context.tool_settings.sculpt
    if ts.brush:
        ts.brush.strength = strength
    return {"strength": strength}


def bl_sculpt_set_radius(params):
    radius = params.get("radius", 50)
    ts = bpy.context.tool_settings.sculpt
    if ts.brush:
        ts.brush.size = radius
    return {"radius": radius}


def bl_sculpt_set_symmetry(params):
    sculpt = bpy.context.tool_settings.sculpt
    sculpt.use_symmetry_x = params.get("x", True)
    sculpt.use_symmetry_y = params.get("y", False)
    sculpt.use_symmetry_z = params.get("z", False)
    return {"x": sculpt.use_symmetry_x, "y": sculpt.use_symmetry_y, "z": sculpt.use_symmetry_z}


def bl_sculpt_dyntopo(params):
    enable = params.get("enable", True)
    if enable:
        if not bpy.context.sculpt_object.use_dynamic_topology_sculpting:
            bpy.ops.sculpt.dynamic_topology_toggle()
    else:
        if bpy.context.sculpt_object.use_dynamic_topology_sculpting:
            bpy.ops.sculpt.dynamic_topology_toggle()
    detail = params.get("detail", 12.0)
    bpy.context.scene.tool_settings.sculpt.detail_size = detail
    return {"dyntopo": enable, "detail": detail}


def bl_sculpt_mask(params):
    action = params.get("action", "clear").lower()
    if action == "clear":
        bpy.ops.paint.mask_flood_fill(mode='VALUE', value=0)
    elif action == "fill":
        bpy.ops.paint.mask_flood_fill(mode='VALUE', value=1)
    elif action == "invert":
        bpy.ops.paint.mask_flood_fill(mode='INVERT')
    return {"mask": action}


def bl_sculpt_remesh(params):
    obj = bpy.context.active_object
    voxel_size = params.get("voxelSize", 0.05)
    obj.data.remesh_voxel_size = voxel_size
    bpy.ops.object.voxel_remesh()
    return {"name": obj.name, "voxelSize": voxel_size, "vertices": len(obj.data.vertices)}


def sculpt_handler_get_routes():
    return {
        "bl_sculpt_enable": bl_sculpt_enable,
        "bl_sculpt_set_brush": bl_sculpt_set_brush,
        "bl_sculpt_set_strength": bl_sculpt_set_strength,
        "bl_sculpt_set_radius": bl_sculpt_set_radius,
        "bl_sculpt_set_symmetry": bl_sculpt_set_symmetry,
        "bl_sculpt_dyntopo": bl_sculpt_dyntopo,
        "bl_sculpt_mask": bl_sculpt_mask,
        "bl_sculpt_remesh": bl_sculpt_remesh,
    }


# ============================================================
# Handler: texture_paint_handler
# ============================================================
"""BL Texture Paint Handler - 5 tools for texture painting."""



def bl_texpaint_enable(params):
    obj = get_object(params["name"])
    select_only(obj)
    ensure_mode('TEXTURE_PAINT')
    return {"name": obj.name, "mode": "TEXTURE_PAINT"}


def bl_texpaint_set_brush(params):
    brush_name = params.get("brush", "TexDraw")
    brush = bpy.data.brushes.get(brush_name)
    if brush:
        bpy.context.tool_settings.image_paint.brush = brush
    size = params.get("size")
    if size and brush:
        brush.size = size
    strength = params.get("strength")
    if strength and brush:
        brush.strength = strength
    return {"brush": brush_name}


def bl_texpaint_set_color(params):
    ts = bpy.context.tool_settings.image_paint
    if ts.brush:
        c = params.get("color", {"r": 1, "g": 1, "b": 1})
        ts.brush.color = (c.get("r", 1), c.get("g", 1), c.get("b", 1))
    return {"color": params.get("color")}


def bl_texpaint_create_slot(params):
    obj = get_object(params["name"])
    select_only(obj)
    width = params.get("width", 1024)
    height = params.get("height", 1024)
    slot_name = params.get("slotName", "PaintTexture")
    img = bpy.data.images.new(slot_name, width=width, height=height)
    if obj.data.materials:
        mat = obj.data.materials[0]
        if mat.use_nodes:
            tree = mat.node_tree
            tex_node = tree.nodes.new('ShaderNodeTexImage')
            tex_node.image = img
    return {"name": obj.name, "texture": img.name, "size": [width, height]}


def bl_texpaint_save(params):
    name = params.get("image")
    if name:
        img = bpy.data.images.get(name)
        if img:
            path = params.get("path")
            if path:
                img.filepath_raw = path
                img.file_format = params.get("format", "PNG")
            img.save()
            return {"saved": img.name, "path": img.filepath_raw}
    bpy.ops.image.save_all_modified()
    return {"saved": "all_modified"}


def texture_paint_handler_get_routes():
    return {
        "bl_texpaint_enable": bl_texpaint_enable,
        "bl_texpaint_set_brush": bl_texpaint_set_brush,
        "bl_texpaint_set_color": bl_texpaint_set_color,
        "bl_texpaint_create_slot": bl_texpaint_create_slot,
        "bl_texpaint_save": bl_texpaint_save,
    }


# ============================================================
# Handler: uv_handler
# ============================================================
"""BL UV Handler - 8 tools for UV mapping operations."""



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


def uv_handler_get_routes():
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


# ============================================================
# Handler: vse_handler
# ============================================================
"""BL VSE Handler - 6 tools for Video Sequence Editor operations."""



def _ensure_vse():
    scene = bpy.context.scene
    if not scene.sequence_editor:
        scene.sequence_editor_create()
    return scene.sequence_editor


def bl_vse_add_strip(params):
    se = _ensure_vse()
    strip_type = params.get("type", "IMAGE").upper()
    channel = params.get("channel", 1)
    start = params.get("start", 1)
    path = params.get("path", "")

    if strip_type == "IMAGE" and path:
        strip = se.sequences.new_image(
            name=params.get("name", "Image"),
            filepath=path,
            channel=channel,
            frame_start=start,
        )
    elif strip_type == "MOVIE" and path:
        strip = se.sequences.new_movie(
            name=params.get("name", "Movie"),
            filepath=path,
            channel=channel,
            frame_start=start,
        )
    elif strip_type == "SOUND" and path:
        strip = se.sequences.new_sound(
            name=params.get("name", "Sound"),
            filepath=path,
            channel=channel,
            frame_start=start,
        )
    elif strip_type == "COLOR":
        strip = se.sequences.new_effect(
            name=params.get("name", "Color"),
            type='COLOR',
            channel=channel,
            frame_start=start,
            frame_end=params.get("end", start + 100),
        )
        c = params.get("color", {"r": 0, "g": 0, "b": 0})
        strip.color = (c.get("r", 0), c.get("g", 0), c.get("b", 0))
    else:
        raise ValueError(f"Unsupported strip type or missing path: {strip_type}")

    return {"strip": strip.name, "type": strip_type, "channel": channel, "start": start}


def bl_vse_cut(params):
    se = _ensure_vse()
    strip_name = params.get("strip")
    frame = params.get("frame", bpy.context.scene.frame_current)
    strip = se.sequences.get(strip_name)
    if not strip:
        raise ValueError(f"Strip not found: {strip_name}")
    # Select only this strip
    for s in se.sequences:
        s.select = False
    strip.select = True
    se.active_strip = strip
    bpy.context.scene.frame_set(frame)
    bpy.ops.sequencer.cut(frame=frame, type='SOFT')
    return {"cut_at": frame, "strip": strip_name}


def bl_vse_move(params):
    se = _ensure_vse()
    strip = se.sequences.get(params["strip"])
    if not strip:
        raise ValueError(f"Strip not found: {params['strip']}")
    channel = params.get("channel")
    offset = params.get("offset", 0)
    if channel is not None:
        strip.channel = channel
    strip.frame_start += offset
    return {"strip": strip.name, "channel": strip.channel, "start": strip.frame_start}


def bl_vse_set_speed(params):
    se = _ensure_vse()
    strip = se.sequences.get(params["strip"])
    if not strip:
        raise ValueError(f"Strip not found: {params['strip']}")
    speed = params.get("speed", 1.0)
    # Create speed effect
    for s in se.sequences:
        s.select = False
    strip.select = True
    effect = se.sequences.new_effect(
        name="Speed",
        type='SPEED',
        channel=strip.channel + 1,
        frame_start=strip.frame_start,
        frame_end=strip.frame_final_end,
        seq1=strip,
    )
    effect.speed_factor = speed
    return {"strip": strip.name, "speed": speed}


def bl_vse_add_effect(params):
    se = _ensure_vse()
    effect_type = params.get("type", "CROSS").upper()
    channel = params.get("channel", 3)
    start = params.get("start", 1)
    end = params.get("end", start + 30)
    strip1_name = params.get("strip1")
    strip2_name = params.get("strip2")

    kwargs = {
        "name": params.get("name", effect_type),
        "type": effect_type,
        "channel": channel,
        "frame_start": start,
        "frame_end": end,
    }
    if strip1_name:
        kwargs["seq1"] = se.sequences.get(strip1_name)
    if strip2_name:
        kwargs["seq2"] = se.sequences.get(strip2_name)

    effect = se.sequences.new_effect(**kwargs)
    return {"effect": effect.name, "type": effect_type}


def bl_vse_render(params):
    scene = bpy.context.scene
    output = params.get("output", "//render/video")
    fmt = params.get("format", "FFMPEG")
    scene.render.filepath = output
    scene.render.image_settings.file_format = fmt
    if fmt == "FFMPEG":
        scene.render.ffmpeg.format = params.get("container", "MPEG4")
        scene.render.ffmpeg.codec = params.get("codec", "H264")
    bpy.ops.render.render(animation=True)
    return {"rendered": True, "output": output, "format": fmt}


def vse_handler_get_routes():
    return {
        "bl_vse_add_strip": bl_vse_add_strip,
        "bl_vse_cut": bl_vse_cut,
        "bl_vse_move": bl_vse_move,
        "bl_vse_set_speed": bl_vse_set_speed,
        "bl_vse_add_effect": bl_vse_add_effect,
        "bl_vse_render": bl_vse_render,
    }


# ============================================================
# Character Handler: body_handler
# ============================================================
"""Character Body Handler - 12 tools for body shape manipulation via Shape Keys."""



def _get_char_mesh(params):
    name = params.get("character", params.get("name", ""))
    if name:
        return get_object(name)
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and obj.data.shape_keys:
            return obj
    raise ValueError("No character mesh found. Provide 'character' param or have a mesh with shape keys.")


def _set_shape_key(obj, key_name, value):
    if not obj.data.shape_keys:
        raise ValueError(f"{obj.name} has no shape keys")
    kb = obj.data.shape_keys.key_blocks.get(key_name)
    if not kb:
        raise ValueError(f"Shape key not found: {key_name}")
    kb.value = max(0.0, min(1.0, value))
    return kb.value



def _arcana_find_character(name=None):
    """Find character object. Checks arcana_type metadata. Supports both MPFB2 and fallback backends."""
    """Find a character object by name or by arcana_type metadata."""
    if name:
        obj = bpy.data.objects.get(name)
        if obj:
            return obj
    # Fallback: find first character
    for o in bpy.data.objects:
        if o.get("arcana_type") == "character":
            return o
    return None


def _arcana_generate_body_shapekeys(obj):
    """Generate body-customization shape keys on the given mesh object."""
    import mathutils

    mesh = obj.data
    # Add Basis if not present
    if not mesh.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)

    basis = mesh.shape_keys.key_blocks["Basis"]
    verts = mesh.vertices

    # Compute bounding box for normalized offsets
    xs = [v.co.x for v in verts]
    ys = [v.co.y for v in verts]
    zs = [v.co.z for v in verts]
    min_z, max_z = min(zs), max(zs)
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    height = max_z - min_z if max_z - min_z > 0.001 else 1.0
    width = max_x - min_x if max_x - min_x > 0.001 else 1.0
    mid_z = (min_z + max_z) / 2.0
    head_z = min_z + height * 0.85

    # --- Height ---
    sk = obj.shape_key_add(name="Height", from_mix=False)
    for i, v in enumerate(verts):
        sk.data[i].co = v.co * 1.1  # 10% taller at full value
    sk.value = 0.0

    # --- HeadSize ---
    sk = obj.shape_key_add(name="HeadSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz > 0.82:
            factor = (nz - 0.82) / 0.18
            offset = (v.co - mathutils.Vector((0, 0, v.co.z))) * 0.15 * factor
            sk.data[i].co = v.co + offset
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ShoulderWidth ---
    sk = obj.shape_key_add(name="ShoulderWidth", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.55 < nz < 0.85:
            factor = 1.0 - abs(nz - 0.7) / 0.15
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.12 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ChestSize ---
    sk = obj.shape_key_add(name="ChestSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.50 < nz < 0.75:
            factor = 1.0 - abs(nz - 0.62) / 0.12
            factor = max(0, min(1, factor))
            radial = mathutils.Vector((v.co.x, v.co.y, 0)).normalized()
            sk.data[i].co = v.co + radial * 0.04 * factor
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- WaistSize ---
    sk = obj.shape_key_add(name="WaistSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.38 < nz < 0.55:
            factor = 1.0 - abs(nz - 0.46) / 0.08
            factor = max(0, min(1, factor))
            radial = mathutils.Vector((v.co.x, v.co.y, 0)).normalized()
            sk.data[i].co = v.co + radial * 0.04 * factor
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- HipSize ---
    sk = obj.shape_key_add(name="HipSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.30 < nz < 0.48:
            factor = 1.0 - abs(nz - 0.38) / 0.08
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.1 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- Muscle ---
    sk = obj.shape_key_add(name="Muscle", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.15 < nz < 0.85:
            radial = mathutils.Vector((v.co.x, v.co.y, 0))
            dist = radial.length
            if dist > 0.01:
                sk.data[i].co = v.co + radial.normalized() * 0.025
            else:
                sk.data[i].co = v.co.copy()
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- BodyFat ---
    sk = obj.shape_key_add(name="BodyFat", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.10 < nz < 0.80:
            belly_factor = 1.0 - abs(nz - 0.45) / 0.35
            belly_factor = max(0, min(1, belly_factor))
            radial = mathutils.Vector((v.co.x, v.co.y, 0))
            dist = radial.length
            if dist > 0.01:
                sk.data[i].co = v.co + radial.normalized() * 0.05 * belly_factor
            else:
                sk.data[i].co = v.co.copy()
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ArmLength ---
    sk = obj.shape_key_add(name="ArmLength", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        nx = abs(v.co.x) / (width / 2) if width > 0.001 else 0
        if 0.40 < nz < 0.80 and nx > 0.35:
            arm_factor = (nx - 0.35) / 0.65
            arm_factor = min(1, arm_factor)
            direction = 1.0 if v.co.x > 0 else -1.0
            sk.data[i].co = v.co + mathutils.Vector((direction * 0.05 * arm_factor, 0, -0.02 * arm_factor))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- LegLength ---
    sk = obj.shape_key_add(name="LegLength", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz < 0.45:
            leg_factor = (0.45 - nz) / 0.45
            sk.data[i].co = v.co + mathutils.Vector((0, 0, -0.08 * leg_factor))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- EyeSize ---
    sk = obj.shape_key_add(name="EyeSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz > 0.88 and abs(v.co.x) > 0.01 and v.co.y < -0.02:
            factor = (nz - 0.88) / 0.06
            factor = min(1, max(0, factor))
            radial = mathutils.Vector((v.co.x, v.co.y + 0.05, 0)).normalized()
            sk.data[i].co = v.co + radial * 0.008 * factor
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- NoseSize ---
    sk = obj.shape_key_add(name="NoseSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.85 < nz < 0.93 and abs(v.co.x) < 0.03 and v.co.y < -0.05:
            factor = 1.0 - abs(nz - 0.89) / 0.04
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((0, -0.01 * factor, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- MouthWidth ---
    sk = obj.shape_key_add(name="MouthWidth", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.82 < nz < 0.87 and v.co.y < -0.03:
            factor = 1.0 - abs(nz - 0.845) / 0.025
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.15 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- JawWidth ---
    sk = obj.shape_key_add(name="JawWidth", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.78 < nz < 0.86:
            factor = 1.0 - abs(nz - 0.82) / 0.04
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.1 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ForeheadHeight ---
    sk = obj.shape_key_add(name="ForeheadHeight", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz > 0.92:
            factor = (nz - 0.92) / 0.08
            sk.data[i].co = v.co + mathutils.Vector((0, 0, 0.02 * factor))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0


def _arcana_ensure_skin_material(obj, gender="male"):
    """Create and assign a default skin material with Principled BSDF."""
    mat_name = f"ARCANA_Skin_{gender}"
    mat = bpy.data.materials.get(mat_name)
    if mat is None:
        mat = bpy.data.materials.new(name=mat_name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF") or mat.node_tree.nodes.get("鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ陷ｿ謔ｶ貂夂ｹ晢ｽｻ繝ｻ・ｹ髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｷ鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ陷ｿ荵滂ｽｩ蠢ゥF")
        if bsdf:
            # Default skin tones
            if gender == "female":
                bsdf.inputs["Base Color"].default_value = (0.87, 0.72, 0.62, 1.0)
            else:
                bsdf.inputs["Base Color"].default_value = (0.78, 0.61, 0.48, 1.0)
            bsdf.inputs["Roughness"].default_value = 0.55
            # Subsurface
            try:
                bsdf.inputs["Subsurface Weight"].default_value = 0.3
                bsdf.inputs["Subsurface Radius"].default_value = (0.8, 0.4, 0.25)
            except Exception:
                try:
                    bsdf.inputs["Subsurface"].default_value = 0.3
                except Exception:
                    pass
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def bl_char_set_body_proportion(params):
    """Alias: routes to bl_char_set_proportions."""
    return bl_char_set_proportions(params)


def bl_char_set_arm_length(params):
    """Set arm length via ArmLength shape key."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}
    value = max(0.0, min(1.0, float(params.get("length", params.get("value", 0.5)))))
    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("ArmLength")
        if sk:
            sk.value = value
    return {"success": True, "name": obj.name, "armLength": value}


def bl_char_set_leg_length(params):
    """Set leg length via LegLength shape key."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}
    value = max(0.0, min(1.0, float(params.get("length", params.get("value", 0.5)))))
    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("LegLength")
        if sk:
            sk.value = value
    return {"success": True, "name": obj.name, "legLength": value}


def bl_char_set_hand_size(params):
    """Set hand size (placeholder - adjusts scale of hand region)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}
    value = float(params.get("size", params.get("value", 0.5)))
    obj["arcana_hand_size"] = value
    return {"success": True, "name": obj.name, "handSize": value, "message": "Hand size stored (visual adjustment requires rigging)"}


def bl_char_set_foot_size(params):
    """Set foot size (placeholder - stores value for rigging)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}
    value = float(params.get("size", params.get("value", 0.5)))
    obj["arcana_foot_size"] = value
    return {"success": True, "name": obj.name, "footSize": value, "message": "Foot size stored (visual adjustment requires rigging)"}


def bl_char_set_neck(params):
    """Set neck properties (length, width) - placeholder."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}
    length = float(params.get("length", 0.5))
    width = float(params.get("width", 0.5))
    obj["arcana_neck_length"] = length
    obj["arcana_neck_width"] = width
    return {"success": True, "name": obj.name, "neckLength": length, "neckWidth": width}


def bl_char_set_torso(params):
    """Set torso proportions via ChestSize and WaistSize shape keys."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}
    result = {}
    if obj.data.shape_keys:
        chest = params.get("chestSize", params.get("chest"))
        if chest is not None:
            sk = obj.data.shape_keys.key_blocks.get("ChestSize")
            if sk:
                sk.value = max(0.0, min(1.0, float(chest)))
                result["chestSize"] = sk.value
        waist = params.get("waistSize", params.get("waist"))
        if waist is not None:
            sk = obj.data.shape_keys.key_blocks.get("WaistSize")
            if sk:
                sk.value = max(0.0, min(1.0, float(waist)))
                result["waistSize"] = sk.value
    return {"success": True, "name": obj.name, "torso": result}


# ============================================================
# MPFB2 Hybrid Integration
# ============================================================


# ============================================================
# MPFB2 Dynamic Asset Discovery
# ============================================================
_mpfb_asset_cache = {"hair": {}, "skins": {}, "clothes": {}, "_initialized": False}

def _discover_mpfb_assets(force_refresh=False):
    """Discover all installed MPFB2 assets using the official AssetService API.
    Works with any pack (official CC0 or third-party).
    Results are cached; call with force_refresh=True after installing new packs."""
    global _mpfb_asset_cache
    if _mpfb_asset_cache["_initialized"] and not force_refresh:
        return _mpfb_asset_cache
    try:
        from bl_ext.blender_org.mpfb.services.assetservice import AssetService

        _mpfb_asset_cache["hair"] = {}
        for p in AssetService.list_mhclo_assets("hair"):
            name = os.path.basename(os.path.dirname(p))
            _mpfb_asset_cache["hair"][name] = str(p)

        _mpfb_asset_cache["skins"] = {}
        for p in AssetService.list_mhmat_assets("skins"):
            name = os.path.basename(os.path.dirname(p))
            _mpfb_asset_cache["skins"][name] = str(p)

        _mpfb_asset_cache["clothes"] = {}
        for p in AssetService.list_mhclo_assets("clothes"):
            name = os.path.basename(os.path.dirname(p))
            _mpfb_asset_cache["clothes"][name] = str(p)

        _mpfb_asset_cache["_initialized"] = True
        print(f"[ARCANA] MPFB2 assets discovered: "
              f"{len(_mpfb_asset_cache['hair'])} hair, "
              f"{len(_mpfb_asset_cache['skins'])} skins, "
              f"{len(_mpfb_asset_cache['clothes'])} clothes")
    except Exception as e:
        print(f"[ARCANA] MPFB2 asset discovery failed: {e}")
    return _mpfb_asset_cache

def _mpfb_find_asset(category, query):
    """Find best matching asset by scored matching. Returns (name, path) or (None, None)."""
    assets = _discover_mpfb_assets().get(category, {})
    if not assets:
        return None, None
    q = query.lower().replace(" ", "_").replace("-", "_")
    # Exact match
    if q in assets:
        return q, assets[q]
    # Scored matching
    best_name, best_path, best_score = None, None, 0
    for name, fpath in assets.items():
        nl = name.lower()
        score = 0
        if nl == q:
            score = 100
        elif nl.startswith(q):
            score = 80
        elif q.startswith(nl):
            score = 75
        elif q in nl:
            score = 60
        elif nl in q:
            score = 55
        else:
            # Check each word in query
            words = q.split("_")
            matched = sum(1 for w in words if w and w in nl)
            if matched > 0:
                score = 20 + (matched * 10)
        if score > best_score:
            best_score = score
            best_name = name
            best_path = str(fpath)
    if best_score >= 40:
        return best_name, best_path
    return None, None

def _mpfb_find_skin_for_preset(preset, gender="female"):
    """Map a natural-language skin preset to the best available MPFB2 skin asset.
    Uses fuzzy matching against installed skin names."""
    assets = _discover_mpfb_assets().get("skins", {})
    if not assets:
        return None, None

    # Priority keywords per preset, gender-aware
    _preset_keywords = {
        "light":    ["young_caucasian_{g}", "toigo_light_skin_{g2}", "caucasian_{g}"],
        "fair":     ["young_caucasian_{g}", "toigo_light_skin_{g2}", "caucasian_{g}"],
        "pale":     ["toigo_light_skin_{g2}", "young_caucasian_{g}", "skalldyrssuppe_creamy"],
        "medium":   ["callharvey3d_midtoned", "middleage_caucasian_{g}", "caucasian_{g}"],
        "tan":      ["cutoff3d_indian_{g}", "middleage_asian_{g}", "asian_{g}"],
        "olive":    ["middleage_asian_{g}", "cutoff3d_indian_{g}", "asian_{g}"],
        "dark":     ["young_african_{g}", "middleage_african_{g}", "african_{g}"],
        "brown":    ["cutoff3d_indian_{g}", "middleage_asian_{g}"],
        "asian":    ["young_asian_{g}", "middleage_asian_{g}", "asian_{g}"],
        "african":  ["young_african_{g}", "middleage_african_{g}", "african_{g}"],
        "caucasian":["young_caucasian_{g}", "middleage_caucasian_{g}", "caucasian_{g}"],
        "freckles": ["toigo_light_skin_{g2}_freckles", "freckles"],
        "ginger":   ["toigo_light_skin_{g2}_ginger", "ginger", "flower-angel_red_head"],
        "makeup":   ["toigo_light_skin_{g2}_with_makeup", "makeup"],
    }
    g = gender.lower()
    g2 = "female" if g == "female" else "male"
    keywords = _preset_keywords.get(preset.lower(), [preset.lower()])

    for kw_template in keywords:
        kw = kw_template.replace("{g}", g).replace("{g2}", g2)
        for name, fpath in assets.items():
            if kw in name.lower():
                return name, str(fpath)
    # Last resort: any skin with gender match
    for name, fpath in assets.items():
        if g2 in name.lower():
            return name, str(fpath)
    # Absolute fallback: first available
    first_name = next(iter(assets))
    return first_name, assets[first_name]

def _has_mpfb():
    """Check if MPFB2 addon is available."""
    try:
        return hasattr(bpy.ops, 'mpfb') and hasattr(bpy.ops.mpfb, 'create_human')
    except Exception:
        return False


def _create_base_mpfb(params):
    """Create character using MPFB2 (high quality path)."""
    gender = params.get("gender", "male")
    style = params.get("style", "realistic")
    char_name = params.get("name", f"Character_{gender}_{style}")

    # MPFB2 only supports realistic; if stylized requested, log it
    if style in ("stylized", "anime"):
        print(f"[ARCANA] MPFB2 does not support '{style}' style, using realistic base")

    # Create human via MPFB2
    bpy.ops.mpfb.create_human()

    # Add rig for hair/clothing attachment
    try:
        if hasattr(bpy.ops.mpfb, "add_standard_rig"):
            bpy.ops.mpfb.add_standard_rig()
            print("[ARCANA] MPFB2 standard rig added")
    except Exception as e:
        print(f"[ARCANA] MPFB2 standard rig skipped: {e}")

    # After rig addition, active_object may be the Armature, not the mesh
    # Find the mesh object (MPFB2 creates "Human" mesh + armature)
    obj = None
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.data and hasattr(o.data, 'vertices') and len(o.data.vertices) > 1000:
            obj = o
            break
    if obj is None:
        obj = bpy.context.active_object
    if obj is None:
        return {"success": False, "message": "MPFB2 create_human failed"}

    obj.name = char_name

    # Set gender via MPFB2 properties if available
    try:
        if hasattr(obj, 'MPFB_GenderProperty'):
            if gender == "female":
                obj.MPFB_GenderProperty = 1.0
            else:
                obj.MPFB_GenderProperty = 0.0
        # Apply macro targets
        if hasattr(bpy.ops.mpfb, 'set_macro_detail'):
            if gender == "female":
                bpy.ops.mpfb.set_macro_detail(target="Gender", value=1.0)
            else:
                bpy.ops.mpfb.set_macro_detail(target="Gender", value=0.0)
    except Exception as e:
        print(f"[ARCANA] MPFB2 gender set warning: {e}")

    # Store metadata
    obj["arcana_gender"] = gender
    obj["arcana_style"] = style
    obj["arcana_type"] = "character"
    obj["arcana_backend"] = "mpfb2"

    # Apply default skin - use fallback material
    # (MPFB2 load_library_skin requires full .mhmat path, depends on user asset location)
    try:
        _arcana_ensure_skin_material(obj, gender)
        print(f"[ARCANA] Basic skin material applied for {gender}")
    except Exception as e:
        print(f"[ARCANA] Skin material skipped: {e}")

    vert_count = len(obj.data.vertices) if obj.data else 0
    sk_count = len(obj.data.shape_keys.key_blocks) - 1 if obj.data and obj.data.shape_keys else 0

    return {
        "success": True,
        "name": obj.name,
        "gender": gender,
        "style": style,
        "backend": "mpfb2",
        "vertices": vert_count,
        "shapeKeys": sk_count,
        "message": f"Character '{obj.name}' created via MPFB2 ({vert_count} verts, {sk_count} shape keys)"
    }


def bl_char_create_base(params):
    """Create character base body. Uses MPFB2 if available, otherwise Blender Studio meshes."""
    import mathutils
    gender = params.get("gender", "male")
    style = params.get("style", "realistic")

    # --- MPFB2 hybrid: prefer MPFB2 if installed ---
    if _has_mpfb():
        print(f"[ARCANA] MPFB2 detected, using high-quality path for {gender}/{style}")
        return _create_base_mpfb(params)
    print(f"[ARCANA] MPFB2 not found, using Blender Studio fallback for {gender}/{style}")

    # Resolve .blend asset path relative to addon file
    # Try multiple paths to find base mesh assets
    _possible_paths = [
        os.path.join(os.path.dirname(os.path.realpath(__file__)), "..", "assets", "human-base-meshes", "human-base-meshes-bundle-v1.4.1", "human_base_meshes_bundle.blend"),
        os.path.join(os.path.dirname(os.path.realpath(__file__)), "assets", "human-base-meshes", "human-base-meshes-bundle-v1.4.1", "human_base_meshes_bundle.blend"),
        r"H:\TOOL\geminicli\ARCANA\assets\human-base-meshes\human-base-meshes-bundle-v1.4.1\human_base_meshes_bundle.blend",
    ]
    blend_path = None
    for _p in _possible_paths:
        if os.path.exists(_p):
            blend_path = _p
            break
    if blend_path is None:
        blend_path = _possible_paths[-1]
    if not os.path.exists(blend_path):
        return {"success": False, "message": f"Base mesh file not found: {blend_path}"}

    # Map gender+style to object name
    mesh_map = {
        ("male", "realistic"): "GEO-body_male_realistic",
        ("female", "realistic"): "GEO-body_female_realistic",
        ("male", "stylized"): "GEO-body_male_stylized",
        ("male", "anime"): "GEO-body_male_stylized",
        ("female", "stylized"): "GEO-body_female_stylized",
        ("female", "anime"): "GEO-body_female_stylized",
    }
    src_name = mesh_map.get((gender, style))
    if not src_name:
        src_name = mesh_map.get((gender, "realistic"), "GEO-body_male_realistic")

    # Append object + children from .blend
    appended_objects = []
    with bpy.data.libraries.load(blend_path, link=False) as (data_from, data_to):
        # Find the main object and its eye children
        names_to_load = [n for n in data_from.objects if n == src_name or n.startswith(src_name + ".")]
        data_to.objects = names_to_load

    for obj in data_to.objects:
        if obj is not None:
            bpy.context.collection.objects.link(obj)
            appended_objects.append(obj.name)

    # Find main body object
    main_obj = bpy.data.objects.get(src_name)
    if main_obj is None:
        return {"success": False, "message": f"Failed to append {src_name}"}

    # Rename to user-friendly name
    char_name = params.get("name", f"Character_{gender}_{style}")
    main_obj.name = char_name

    # Re-parent eyes
    for obj_name in appended_objects:
        obj = bpy.data.objects.get(obj_name)
        if obj and obj != main_obj:
            obj.parent = main_obj

    # Select and make active
    bpy.ops.object.select_all(action='DESELECT')
    main_obj.select_set(True)
    bpy.context.view_layer.objects.active = main_obj

    # Generate Shape Keys for body customization
    _arcana_generate_body_shapekeys(main_obj)

    # Store metadata
    main_obj["arcana_gender"] = gender
    main_obj["arcana_style"] = style
    main_obj["arcana_type"] = "character"

    # Assign default skin material
    _arcana_ensure_skin_material(main_obj, gender)

    vert_count = len(main_obj.data.vertices)
    sk_count = len(main_obj.data.shape_keys.key_blocks) - 1 if main_obj.data.shape_keys else 0

    return {
        "success": True,
        "name": main_obj.name,
        "gender": gender,
        "style": style,
        "vertices": vert_count,
        "shapeKeys": sk_count,
        "objects": appended_objects,
        "message": f"Character '{main_obj.name}' created with {vert_count} vertices and {sk_count} shape keys"
    }


def bl_char_set_gender(params):
    obj = _get_char_mesh(params)
    gender = params.get("gender", "female")
    return {"character": obj.name, "gender": gender}


def bl_char_set_height(params):
    """Set character height in cm. Uses scale + Height shape key."""
    name = params.get("name") or params.get("target")
    height_cm = params.get("height", 170)

    obj = None
    if name:
        obj = bpy.data.objects.get(name)
    if obj is None:
        for o in bpy.data.objects:
            if o.get("arcana_type") == "character":
                obj = o
                break
    if obj is None:
        return {"success": False, "message": "Character not found"}

    # Base height reference: realistic meshes are ~1.75m tall at scale 1
    base_height = 175.0
    scale_factor = height_cm / base_height
    obj.scale = (scale_factor, scale_factor, scale_factor)

    # Propagate scale to sibling objects under same rig (hair, clothes)
    rig = obj.parent
    if rig:
        for child in rig.children:
            if child != obj and child.type == 'MESH':
                child.scale = (scale_factor, scale_factor, scale_factor)
                print(f"[ARCANA] Scale propagated to {child.name}")

    # Also set Height shape key proportionally
    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("Height")
        if sk:
            sk.value = max(0.0, min(1.0, (height_cm - 150) / 50.0))

    return {
        "success": True,
        "name": obj.name,
        "height": height_cm,
        "scale": round(scale_factor, 5),
        "message": f"Height set to {height_cm}cm (scale {scale_factor:.3f})"
    }


def bl_char_set_body_type(params):
    obj = _get_char_mesh(params)
    body_type = params.get("type", "average")
    presets = {
        "slim": {"Muscle": 0.2, "BodyFat": 0.1, "ShoulderWidth": 0.3, "HipSize": 0.3},
        "average": {"Muscle": 0.4, "BodyFat": 0.3, "ShoulderWidth": 0.5, "HipSize": 0.5},
        "athletic": {"Muscle": 0.7, "BodyFat": 0.15, "ShoulderWidth": 0.7, "HipSize": 0.4},
        "muscular": {"Muscle": 0.95, "BodyFat": 0.1, "ShoulderWidth": 0.9, "HipSize": 0.5},
        "curvy": {"Muscle": 0.3, "BodyFat": 0.5, "ShoulderWidth": 0.4, "HipSize": 0.8},
        "heavy": {"Muscle": 0.4, "BodyFat": 0.8, "ShoulderWidth": 0.6, "HipSize": 0.7},
    }
    values = presets.get(body_type, presets["average"])
    if obj.data.shape_keys:
        for k, v in values.items():
            kb = obj.data.shape_keys.key_blocks.get(k)
            if kb:
                kb.value = v
    return {"character": obj.name, "bodyType": body_type, "values": values}


def bl_char_set_style(params):
    obj = _get_char_mesh(params)
    style = params.get("style", "anime")
    return {"character": obj.name, "style": style}


def bl_char_set_proportions(params):
    """Set body proportions via shape keys: ShoulderWidth, ChestSize, WaistSize, HipSize."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    mapping = {
        "shoulderWidth": "ShoulderWidth",
        "chestSize": "ChestSize",
        "waistSize": "WaistSize",
        "hipSize": "HipSize",
    }
    result = {}
    if obj.data.shape_keys:
        for param_key, sk_name in mapping.items():
            val = params.get(param_key)
            if val is not None:
                sk = obj.data.shape_keys.key_blocks.get(sk_name)
                if sk:
                    sk.value = max(0.0, min(1.0, float(val)))
                    result[param_key] = sk.value

    return {"success": True, "name": obj.name, "proportions": result}


def bl_char_set_muscle(params):
    """Set muscle definition via Muscle shape key (0-1)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    value = max(0.0, min(1.0, float(params.get("muscle", params.get("value", 0.5)))))

    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("Muscle")
        if sk:
            sk.value = value

    return {"success": True, "name": obj.name, "muscle": value}


def bl_char_set_body_fat(params):
    # Enforce minimum body_fat of 0.3 for realistic proportions
    _raw_fat = params.get("value", 0.5)
    if isinstance(_raw_fat, (int, float)) and _raw_fat < 0.3:
        params["value"] = 0.3
        print(f"[ARCANA] body_fat clamped: {_raw_fat} -> 0.3 (minimum)")
    # --- original logic below ---
    """Set body fat via BodyFat shape key (0-1)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    value = max(0.0, min(1.0, float(params.get("bodyFat", params.get("value", 0.3)))))

    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("BodyFat")
        if sk:
            sk.value = value

    return {"success": True, "name": obj.name, "bodyFat": value}


def bl_char_set_limb_length(params):
    """Set arm and leg length via ArmLength/LegLength shape keys (0-1)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    result = {}
    if obj.data.shape_keys:
        arm = params.get("armLength")
        if arm is not None:
            sk = obj.data.shape_keys.key_blocks.get("ArmLength")
            if sk:
                sk.value = max(0.0, min(1.0, float(arm)))
                result["armLength"] = sk.value
        leg = params.get("legLength")
        if leg is not None:
            sk = obj.data.shape_keys.key_blocks.get("LegLength")
            if sk:
                sk.value = max(0.0, min(1.0, float(leg)))
                result["legLength"] = sk.value

    return {"success": True, "name": obj.name, "limbs": result}


def bl_char_set_hand_size(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    if obj.data.shape_keys:
        kb = obj.data.shape_keys.key_blocks.get("HandSize")
        if kb:
            kb.value = max(0.0, min(1.0, value))
    return {"character": obj.name, "handSize": value}


def bl_char_set_neck(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    if obj.data.shape_keys:
        kb = obj.data.shape_keys.key_blocks.get("NeckLength")
        if kb:
            kb.value = max(0.0, min(1.0, value))
    return {"character": obj.name, "neck": value}


def bl_char_set_accessory_slot(params):
    obj = _get_char_mesh(params)
    slot = params.get("slot", "head")
    item = params.get("item", "")
    # Store in custom property
    if "arcana_accessories" not in obj:
        obj["arcana_accessories"] = {}
    obj["arcana_accessories"][slot] = item
    return {"character": obj.name, "slot": slot, "item": item}


def body_handler_get_routes():
    return {
        "bl_char_create_base": bl_char_create_base,
        "bl_char_set_gender": bl_char_set_gender,
        "bl_char_set_height": bl_char_set_height,
        "bl_char_set_body_type": bl_char_set_body_type,
        "bl_char_set_style": bl_char_set_style,
        "bl_char_set_proportions": bl_char_set_proportions,
        "bl_char_set_muscle": bl_char_set_muscle,
        "bl_char_set_torso": bl_char_set_torso,
        "bl_char_set_foot_size": bl_char_set_foot_size,
        "bl_char_set_leg_length": bl_char_set_leg_length,
        "bl_char_set_arm_length": bl_char_set_arm_length,
        "bl_char_set_body_proportion": bl_char_set_body_proportion,
        "bl_char_set_body_fat": bl_char_set_body_fat,
        "bl_char_set_limb_length": bl_char_set_limb_length,
        "bl_char_set_hand_size": bl_char_set_hand_size,
        "bl_char_set_neck": bl_char_set_neck,
        "bl_char_set_accessory_slot": bl_char_set_accessory_slot,
    }


# ============================================================
# Character Handler: export_handler
# ============================================================
"""Character Export Handler - 5 tools for VRM/FBX export and validation."""

import os


# _get_char_mesh: see body_handler section (deduplicated)


def bl_char_export_vrm(params):
    obj = _get_char_mesh(params)
    select_only(obj)
    path = params.get("path", "//export/character.vrm")
    abs_path = bpy.path.abspath(path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    # Try VRM addon export
    try:
        bpy.ops.export_scene.vrm(filepath=abs_path)
        return {"character": obj.name, "exported": abs_path, "format": "VRM"}
    except AttributeError:
        # VRM addon not installed, export as glTF instead
        gltf_path = abs_path.replace(".vrm", ".glb")
        bpy.ops.export_scene.gltf(filepath=gltf_path, export_format='GLB')
        return {"character": obj.name, "exported": gltf_path, "format": "GLB", "note": "VRM addon not found, exported as GLB"}


def bl_char_export_fbx(params):
    obj = _get_char_mesh(params)
    select_only(obj)
    path = params.get("path", "//export/character.fbx")
    abs_path = bpy.path.abspath(path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    target = params.get("target", "unity").lower()
    if target == "unity":
        bpy.ops.export_scene.fbx(
            filepath=abs_path, use_selection=True,
            apply_scale_options='FBX_SCALE_ALL',
            axis_forward='-Z', axis_up='Y',
            add_leaf_bones=False, bake_anim=True,
        )
    elif target == "unreal":
        bpy.ops.export_scene.fbx(
            filepath=abs_path, use_selection=True,
            apply_scale_options='FBX_SCALE_ALL',
            axis_forward='X', axis_up='Z',
            add_leaf_bones=False, bake_anim=True,
        )
    else:
        bpy.ops.export_scene.fbx(filepath=abs_path, use_selection=True)
    return {"character": obj.name, "exported": abs_path, "format": "FBX", "target": target}


def bl_char_validate_avatar(params):
    obj = _get_char_mesh(params)
    issues = []
    warnings = []
    # Polygon count
    poly_count = len(obj.data.polygons)
    if poly_count > 70000:
        issues.append(f"Polygon count too high: {poly_count} (VRChat Poor: >70000)")
    elif poly_count > 32000:
        warnings.append(f"Polygon count high: {poly_count} (VRChat Medium: >32000)")
    # Material count
    mat_count = len(obj.data.materials)
    if mat_count > 8:
        warnings.append(f"Too many materials: {mat_count} (recommend <= 4)")
    # Shape keys
    sk_count = len(obj.data.shape_keys.key_blocks) if obj.data.shape_keys else 0
    # Bones
    armature = obj.find_armature()
    bone_count = len(armature.data.bones) if armature else 0
    if bone_count > 256:
        warnings.append(f"High bone count: {bone_count}")
    # Rank estimate
    if poly_count <= 32000 and mat_count <= 4:
        rank = "Good"
    elif poly_count <= 70000 and mat_count <= 8:
        rank = "Medium"
    else:
        rank = "Poor"
    return {
        "character": obj.name, "valid": len(issues) == 0,
        "rank": rank, "polygons": poly_count, "materials": mat_count,
        "shapeKeys": sk_count, "bones": bone_count,
        "issues": issues, "warnings": warnings,
    }


def bl_char_optimize(params):
    obj = _get_char_mesh(params)
    select_only(obj)
    results = {}
    # Decimate if requested
    target_polys = params.get("targetPolygons")
    if target_polys and len(obj.data.polygons) > target_polys:
        ratio = target_polys / len(obj.data.polygons)
        mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
        mod.ratio = ratio
        bpy.ops.object.modifier_apply(modifier=mod.name)
        results["decimated"] = len(obj.data.polygons)
    # Merge by distance
    if params.get("mergeVertices", False):
        bpy.ops.object.mode_set(mode='EDIT')
        bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.mesh.remove_doubles(threshold=0.0001)
        bpy.ops.object.mode_set(mode='OBJECT')
        results["mergedVertices"] = True
    return {"character": obj.name, "optimized": results, "finalPolygons": len(obj.data.polygons)}


def bl_char_setup_spring_bone(params):
    obj = _get_char_mesh(params)
    armature = obj.find_armature()
    if not armature:
        raise ValueError("No armature found for spring bone setup")
    bone_names = params.get("bones", [])
    stiffness = params.get("stiffness", 0.5)
    gravity = params.get("gravity", 0.1)
    damping = params.get("damping", 0.4)
    spring_data = {
        "bones": bone_names,
        "stiffness": stiffness,
        "gravity": gravity,
        "damping": damping,
    }
    armature["arcana_spring_bones"] = str(spring_data)
    return {"armature": armature.name, "springBones": spring_data, "boneCount": len(bone_names)}


def export_handler_get_routes():
    return {
        "bl_char_export_vrm": bl_char_export_vrm,
        "bl_char_export_fbx": bl_char_export_fbx,
        "bl_char_validate_avatar": bl_char_validate_avatar,
        "bl_char_optimize": bl_char_optimize,
        "bl_char_setup_spring_bone": bl_char_setup_spring_bone,
    }


# ============================================================
# Character Handler: expression_handler
# ============================================================
"""Character Expression Handler - 8 tools for shape keys and expressions."""

import json as json_mod


# _get_char_mesh: see body_handler section (deduplicated)


UNIFIED_EXPRESSIONS = [
    "eyeBlinkLeft","eyeBlinkRight","eyeLookDownLeft","eyeLookDownRight",
    "eyeLookInLeft","eyeLookInRight","eyeLookOutLeft","eyeLookOutRight",
    "eyeLookUpLeft","eyeLookUpRight","eyeSquintLeft","eyeSquintRight",
    "eyeWideLeft","eyeWideRight",
    "jawForward","jawLeft","jawRight","jawOpen",
    "mouthClose","mouthFunnel","mouthPucker","mouthLeft","mouthRight",
    "mouthSmileLeft","mouthSmileRight","mouthFrownLeft","mouthFrownRight",
    "mouthDimpleLeft","mouthDimpleRight","mouthStretchLeft","mouthStretchRight",
    "mouthRollLower","mouthRollUpper","mouthShrugLower","mouthShrugUpper",
    "mouthPressLeft","mouthPressRight","mouthLowerDownLeft","mouthLowerDownRight",
    "mouthUpperUpLeft","mouthUpperUpRight",
    "browDownLeft","browDownRight","browInnerUp","browOuterUpLeft","browOuterUpRight",
    "cheekPuff","cheekSquintLeft","cheekSquintRight",
    "noseSneerLeft","noseSneerRight",
    "tongueOut",
    "headLeft","headRight","headUp","headDown","headRollLeft","headRollRight",
    "eyeClosedLeft","eyeClosedRight",
    "mouthRaiserLower","mouthRaiserUpper",
    "jawMoveLeft","jawMoveRight","jawClench",
    "lipSuckLower","lipSuckUpper","lipFunnelLower","lipFunnelUpper",
    "cheekSuck","mouthTightener",
]


def bl_char_create_unified_shapekeys(params):
    obj = _get_char_mesh(params)
    if not obj.data.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)
    created = []
    for expr in UNIFIED_EXPRESSIONS:
        if not obj.data.shape_keys.key_blocks.get(expr):
            obj.shape_key_add(name=expr, from_mix=False)
            created.append(expr)
    return {"character": obj.name, "created": len(created), "total": len(obj.data.shape_keys.key_blocks), "keys": created}


def bl_char_set_shapekey(params):
    obj = _get_char_mesh(params)
    key_name = params["key"]
    value = params.get("value", 0.0)
    if not obj.data.shape_keys:
        raise ValueError(f"{obj.name} has no shape keys")
    kb = obj.data.shape_keys.key_blocks.get(key_name)
    if not kb:
        raise ValueError(f"Shape key not found: {key_name}")
    kb.value = max(0.0, min(1.0, value))
    return {"character": obj.name, "key": key_name, "value": kb.value}


def bl_char_set_expression_preset(params):
    obj = _get_char_mesh(params)
    preset = params.get("preset", "smile")
    presets = {
        "smile": {"mouthSmileLeft": 0.8, "mouthSmileRight": 0.8, "cheekSquintLeft": 0.3, "cheekSquintRight": 0.3},
        "sad": {"mouthFrownLeft": 0.7, "mouthFrownRight": 0.7, "browInnerUp": 0.5},
        "angry": {"browDownLeft": 0.8, "browDownRight": 0.8, "jawClench": 0.5, "noseSneerLeft": 0.4, "noseSneerRight": 0.4},
        "surprised": {"eyeWideLeft": 0.9, "eyeWideRight": 0.9, "jawOpen": 0.6, "browOuterUpLeft": 0.7, "browOuterUpRight": 0.7},
        "wink": {"eyeBlinkLeft": 1.0, "mouthSmileLeft": 0.5, "mouthSmileRight": 0.3},
        "neutral": {},
    }
    values = presets.get(preset, presets["neutral"])
    if obj.data.shape_keys:
        # Reset all expression keys
        for kb in obj.data.shape_keys.key_blocks:
            if kb.name != "Basis":
                kb.value = 0.0
        for k, v in values.items():
            kb = obj.data.shape_keys.key_blocks.get(k)
            if kb:
                kb.value = v
    return {"character": obj.name, "preset": preset, "values": values}


def bl_char_setup_viseme(params):
    obj = _get_char_mesh(params)
    visemes = ["vrc.v_sil","vrc.v_PP","vrc.v_FF","vrc.v_TH","vrc.v_DD",
               "vrc.v_kk","vrc.v_CH","vrc.v_SS","vrc.v_nn","vrc.v_RR",
               "vrc.v_aa","vrc.v_E","vrc.v_ih","vrc.v_oh","vrc.v_ou"]
    if not obj.data.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)
    created = []
    for v in visemes:
        if not obj.data.shape_keys.key_blocks.get(v):
            obj.shape_key_add(name=v, from_mix=False)
            created.append(v)
    return {"character": obj.name, "visemes": len(created), "total": len(visemes)}


def bl_char_create_custom_shapekey(params):
    obj = _get_char_mesh(params)
    name = params.get("keyName", "Custom")
    if not obj.data.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)
    sk = obj.shape_key_add(name=name, from_mix=False)
    return {"character": obj.name, "shapeKey": sk.name}


def bl_char_mirror_shapekey(params):
    obj = _get_char_mesh(params)
    source = params["source"]
    if not obj.data.shape_keys:
        raise ValueError("No shape keys")
    kb = obj.data.shape_keys.key_blocks.get(source)
    if not kb:
        raise ValueError(f"Shape key not found: {source}")
    if "Left" in source:
        target_name = source.replace("Left", "Right")
    elif "Right" in source:
        target_name = source.replace("Right", "Left")
    else:
        target_name = source + "_mirror"
    target = obj.data.shape_keys.key_blocks.get(target_name)
    if not target:
        target = obj.shape_key_add(name=target_name, from_mix=False)
    target.value = kb.value
    return {"source": source, "target": target_name, "value": kb.value}


def bl_char_batch_set_shapekeys(params):
    obj = _get_char_mesh(params)
    keys = params.get("keys", {})
    results = {}
    if obj.data.shape_keys:
        for k, v in keys.items():
            kb = obj.data.shape_keys.key_blocks.get(k)
            if kb:
                kb.value = max(0.0, min(1.0, v))
                results[k] = kb.value
    return {"character": obj.name, "set": results, "count": len(results)}


def bl_char_export_expressions(params):
    obj = _get_char_mesh(params)
    if not obj.data.shape_keys:
        raise ValueError("No shape keys")
    data = {}
    for kb in obj.data.shape_keys.key_blocks:
        if kb.name != "Basis":
            data[kb.name] = kb.value
    path = params.get("path")
    if path:
        with open(path, 'w') as f:
            json_mod.dump(data, f, indent=2)
    return {"character": obj.name, "expressions": data, "count": len(data), "exported": path or "memory"}


def expression_handler_get_routes():
    return {
        "bl_char_create_unified_shapekeys": bl_char_create_unified_shapekeys,
        "bl_char_set_shapekey": bl_char_set_shapekey,
        "bl_char_set_expression_preset": bl_char_set_expression_preset,
        "bl_char_setup_viseme": bl_char_setup_viseme,
        "bl_char_create_custom_shapekey": bl_char_create_custom_shapekey,
        "bl_char_mirror_shapekey": bl_char_mirror_shapekey,
        "bl_char_batch_set_shapekeys": bl_char_batch_set_shapekeys,
        "bl_char_export_expressions": bl_char_export_expressions,
    }


# ============================================================
# Character Handler: face_handler
# ============================================================
"""Character Face Handler - 15 tools for facial feature manipulation."""



# _get_char_mesh: see body_handler section (deduplicated)


def _set_sk(obj, key_name, value):
    if obj.data.shape_keys:
        kb = obj.data.shape_keys.key_blocks.get(key_name)
        if kb:
            kb.value = max(0.0, min(1.0, value))
            return kb.value
    return None


def bl_char_set_face_outline(params):
    obj = _get_char_mesh(params)
    shape = params.get("shape", "oval")
    presets = {"round": 0.2, "oval": 0.5, "square": 0.7, "heart": 0.4, "triangle": 0.6}
    val = presets.get(shape, 0.5)
    _set_sk(obj, "FaceOutline", val)
    return {"character": obj.name, "faceOutline": shape}


def bl_char_set_jaw(params):
    obj = _get_char_mesh(params)
    width = params.get("width", 0.5)
    height = params.get("height", 0.5)
    _set_sk(obj, "JawWidth", width)
    _set_sk(obj, "JawHeight", height)
    return {"character": obj.name, "jaw": {"width": width, "height": height}}


def bl_char_set_cheekbone(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    _set_sk(obj, "Cheekbone", value)
    return {"character": obj.name, "cheekbone": value}


def bl_char_set_eye_shape(params):
    """Set eye shape via EyeSize shape key."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    result = {}
    if obj.data.shape_keys:
        for param_key, sk_name in [("eyeSize", "EyeSize")]:
            val = params.get(param_key)
            if val is not None:
                sk = obj.data.shape_keys.key_blocks.get(sk_name)
                if sk:
                    sk.value = max(0.0, min(1.0, float(val)))
                    result[param_key] = sk.value

    return {"success": True, "name": obj.name, "eyes": result}


def bl_char_set_eyelid(params):
    obj = _get_char_mesh(params)
    double = params.get("doubleFold", 0.5)
    droop = params.get("droop", 0.3)
    _set_sk(obj, "EyelidDouble", double)
    _set_sk(obj, "EyelidDroop", droop)
    return {"character": obj.name, "eyelid": {"doubleFold": double, "droop": droop}}


def bl_char_set_pupil(params):
    obj = _get_char_mesh(params)
    color = params.get("color", {"r": 0.3, "g": 0.2, "b": 0.1})
    size = params.get("size", 0.5)
    pattern = params.get("pattern", "default")
    heterochromia = params.get("heterochromia", False)
    obj["arcana_pupil"] = {
        "color": color, "size": size, "pattern": pattern, "heterochromia": heterochromia
    }
    return {"character": obj.name, "pupil": obj["arcana_pupil"]}


def bl_char_set_eyebrow(params):
    obj = _get_char_mesh(params)
    thickness = params.get("thickness", 0.5)
    arch = params.get("arch", 0.5)
    spacing = params.get("spacing", 0.5)
    _set_sk(obj, "BrowThickness", thickness)
    _set_sk(obj, "BrowArch", arch)
    _set_sk(obj, "BrowSpacing", spacing)
    return {"character": obj.name, "eyebrow": {"thickness": thickness, "arch": arch}}


def bl_char_set_nose(params):
    obj = _get_char_mesh(params)
    width = params.get("width", 0.5)
    height = params.get("height", 0.5)
    bridge = params.get("bridge", 0.5)
    tip = params.get("tip", 0.5)
    _set_sk(obj, "NoseWidth", width)
    _set_sk(obj, "NoseHeight", height)
    _set_sk(obj, "NoseBridge", bridge)
    _set_sk(obj, "NoseTip", tip)
    return {"character": obj.name, "nose": {"width": width, "height": height, "bridge": bridge, "tip": tip}}


def bl_char_set_mouth(params):
    obj = _get_char_mesh(params)
    width = params.get("width", 0.5)
    thickness = params.get("lipThickness", 0.5)
    cupid = params.get("cupidBow", 0.5)
    _set_sk(obj, "MouthWidth", width)
    _set_sk(obj, "LipThickness", thickness)
    _set_sk(obj, "CupidBow", cupid)
    return {"character": obj.name, "mouth": {"width": width, "lipThickness": thickness}}


def bl_char_set_ear(params):
    obj = _get_char_mesh(params)
    size = params.get("size", 0.5)
    pointy = params.get("pointy", 0.0)
    _set_sk(obj, "EarSize", size)
    _set_sk(obj, "EarPointy", pointy)
    return {"character": obj.name, "ear": {"size": size, "pointy": pointy}}


def bl_char_set_forehead(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    _set_sk(obj, "Forehead", value)
    return {"character": obj.name, "forehead": value}


def bl_char_set_chin(params):
    obj = _get_char_mesh(params)
    length = params.get("length", 0.5)
    width = params.get("width", 0.5)
    _set_sk(obj, "ChinLength", length)
    _set_sk(obj, "ChinWidth", width)
    return {"character": obj.name, "chin": {"length": length, "width": width}}


def bl_char_set_temple(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    _set_sk(obj, "TempleWidth", value)
    return {"character": obj.name, "temple": value}


def bl_char_set_nasolabial(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.3)
    _set_sk(obj, "NasolabialFold", value)
    return {"character": obj.name, "nasolabial": value}


def bl_char_set_face_preset(params):
    obj = _get_char_mesh(params)
    preset = params.get("preset", "anime")
    presets = {
        "anime": {"EyeSize": 0.8, "NoseHeight": 0.3, "NoseWidth": 0.3, "MouthWidth": 0.4, "FaceOutline": 0.4, "ChinLength": 0.3},
        "realistic": {"EyeSize": 0.5, "NoseHeight": 0.5, "NoseWidth": 0.5, "MouthWidth": 0.5, "FaceOutline": 0.5, "ChinLength": 0.5},
        "chibi": {"EyeSize": 0.95, "NoseHeight": 0.1, "NoseWidth": 0.2, "MouthWidth": 0.35, "FaceOutline": 0.3, "ChinLength": 0.2},
    }
    values = presets.get(preset, presets["anime"])
    if obj.data.shape_keys:
        for k, v in values.items():
            kb = obj.data.shape_keys.key_blocks.get(k)
            if kb:
                kb.value = v
    return {"character": obj.name, "preset": preset, "values": values}


def face_handler_get_routes():
    return {
        "bl_char_set_face_outline": bl_char_set_face_outline,
        "bl_char_set_jaw": bl_char_set_jaw,
        "bl_char_set_cheekbone": bl_char_set_cheekbone,
        "bl_char_set_eye_shape": bl_char_set_eye_shape,
        "bl_char_set_eyelid": bl_char_set_eyelid,
        "bl_char_set_pupil": bl_char_set_pupil,
        "bl_char_set_eyebrow": bl_char_set_eyebrow,
        "bl_char_set_nose": bl_char_set_nose,
        "bl_char_set_mouth": bl_char_set_mouth,
        "bl_char_set_ear": bl_char_set_ear,
        "bl_char_set_forehead": bl_char_set_forehead,
        "bl_char_set_chin": bl_char_set_chin,
        "bl_char_set_temple": bl_char_set_temple,
        "bl_char_set_nasolabial": bl_char_set_nasolabial,
        "bl_char_set_face_preset": bl_char_set_face_preset,
    }


# ============================================================
# Character Handler: hair_handler
# ============================================================
"""Character Hair Handler - 10 tools for hair style/color/physics."""



# _get_char_mesh: see body_handler section (deduplicated)


def bl_char_set_hair_style(params):
    """Set hair style v7. MPFB2 hair assets if available, otherwise UV Sphere fallback."""
    import math
    import mathutils

    # --- MPFB2 hair path ---
    if _has_mpfb():
        _name = params.get("name") or params.get("target")
        _obj = _arcana_find_character(_name)
        if _obj is not None and _obj.get("arcana_backend") == "mpfb2":
            try:
                style = params.get("style", "medium")
                # Map ARCANA style names to MPFB2 hair asset names
                # Dynamic asset discovery (no hardcoded paths)
                print(f"[ARCANA] Hair style requested: '{style}'")
                _hair_style_hints = {
                    "long": ["long01", "o4saken_long01"],
                    "long_straight": ["long01", "o4saken_long01"],
                    "long_wavy": ["o4saken_long01", "long01"],
                    "long_curly": ["o4saken_long01", "long01"],
                    "straight": ["cortu_straight_bangs", "culturalibre_hair_01", "long01"],
                    "wavy": ["culturalibre_hair_05", "culturalibre_hair_06"],
                    "curly": ["culturalibre_hair_06", "culturalibre_hair_05"],
                    "bob": ["bob01", "bob02", "toigo_blunt_bob", "littleright_bobcut_hair"],
                    "bob_bangs": ["toigo_blunt_bob_with_bangs", "toigo_curled_under_bob_with_bangs"],
                    "short": ["short01", "short02", "short03", "short04"],
                    "bun": ["rehmanpolanski_hair_bun_brown", "elvs_reverse_french_braid_bun"],
                    "braids": ["braid01", "elvs_double_mh_braid", "elvs_french_braid_variation"],
                    "braid": ["braid01", "elvs_double_mh_braid"],
                    "ponytail": ["ponytail01"],
                    "afro": ["afro01"],
                    "messy": ["cortu_shaggy_green_hair", "cortu_short_messy_hair"],
                    "anime": ["learning_anime_hair"],
                    "medium": ["culturalibre_hair_01", "culturalibre_hair_02", "faydaen_hair_1"],
                    "pixie": ["short01", "short02"],
                    "twintail": ["culturalibre_hair_05", "culturalibre_hair_06"],
                    "twin_tails": ["culturalibre_hair_05", "culturalibre_hair_06"],
                    "hime_cut": ["long01", "o4saken_long01"],
                    "headband": ["sonntag78_blond_with_headband"],
                    "french_braid": ["elvs_french_braid_variation", "elvs_unkempt_french_braid"],
                    "cloud": ["cortu_strawberry_cloud_hair"],
                    "jungle": ["sonntag78_junglebook_hair"],
                }
                _hair_name, _hair_path = None, None
                _hints = _hair_style_hints.get(style, [style])
                for _hint in _hints:
                    _hair_name, _hair_path = _mpfb_find_asset("hair", _hint)
                    if _hair_path:
                        break
                if not _hair_path:
                    # Fallback: first available hair
                    _all_hair = _discover_mpfb_assets().get("hair", {})
                    if _all_hair:
                        _hair_name = next(iter(_all_hair))
                        _hair_path = _all_hair[_hair_name]
                if _hair_path:
                    bpy.ops.mpfb.load_library_clothes(filepath=_hair_path)
                    # Sync hair scale with character body
                    for _child in bpy.data.objects:
                        if _child.name.startswith(_obj.name + '.') and _child.type == 'MESH' and _child != _obj:
                            _child.scale = _obj.scale.copy()
                            print(f"[ARCANA] Hair '{_child.name}' scale synced to {_obj.scale[:]}")
                return {
                    "character": _obj.name,
                    "style": style,
                    "backend": "mpfb2",
                    "message": f"MPFB2 hair '{_hair_name}' applied"
                }
            except Exception as e:
                print(f"[ARCANA] MPFB2 hair failed ({e}), falling back to UV Sphere")
    # --- Fallback: UV Sphere hair ---
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    style = params.get("hairStyle", params.get("style", "short"))
    color_hex = params.get("color", "#2B1B0E")

    # Remove existing hair
    for child in list(obj.children):
        if child.get("arcana_part") == "hair":
            bpy.data.objects.remove(child, do_unlink=True)

    if style in ("bald", "none"):
        return {"success": True, "name": obj.name, "style": "bald"}

    # --- HEAD DETECTION (v4 neck method) ---
    mesh = obj.data
    world_mat = obj.matrix_world
    world_verts = [world_mat @ v.co for v in mesh.vertices]

    max_z = max(v.z for v in world_verts)
    min_z = min(v.z for v in world_verts)
    body_height = max_z - min_z
    if body_height < 0.01:
        return {"success": False, "message": "Invalid body mesh"}

    num_slices = 50
    slice_height = body_height / num_slices
    neck_z = max_z - body_height * 0.2
    min_width = 999
    for s in range(int(num_slices * 0.7), int(num_slices * 0.92)):
        z_lo = min_z + s * slice_height
        z_hi = z_lo + slice_height
        band = [v for v in world_verts if z_lo <= v.z < z_hi]
        if len(band) < 4:
            continue
        width_x = max(v.x for v in band) - min(v.x for v in band)
        if width_x < min_width:
            min_width = width_x
            neck_z = (z_lo + z_hi) / 2

    head_verts = [v for v in world_verts if v.z > neck_z]
    if len(head_verts) < 10:
        head_verts = [v for v in world_verts if v.z > max_z - body_height * 0.15]

    head_cx = sum(v.x for v in head_verts) / len(head_verts)
    head_cy = sum(v.y for v in head_verts) / len(head_verts)
    head_top_z = max(v.z for v in head_verts)
    head_bot_z = min(v.z for v in head_verts)
    head_height = head_top_z - head_bot_z

    dists = [math.sqrt((v.x - head_cx)**2 + (v.y - head_cy)**2) for v in head_verts]
    dists.sort()
    head_radius = dists[int(len(dists) * 0.85)]
    if head_radius > body_height * 0.12:
        head_radius = body_height * 0.09

    # Also measure front-back depth of head
    head_front_y = min(v.y for v in head_verts)
    head_back_y = max(v.y for v in head_verts)

    # --- CREATE SPHERE ---
    hair_r = head_radius * 1.05
    cap_center_z = head_top_z - head_height * 0.30

    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=hair_r,
        segments=48, ring_count=24,
        location=(head_cx, head_cy, cap_center_z)
    )
    hair_obj = bpy.context.active_object
    hair_obj.name = f"{obj.name}_Hair"
    hair_obj["arcana_part"] = "hair"
    hair_obj["arcana_hair_style"] = style

    hair_mesh = hair_obj.data

    # --- FACE CUT: elliptical opening instead of flat plane ---
    # In local coords, sphere is centered at origin
    # Face is in -Y direction (front), opening shaped like an oval
    verts_to_delete = set()

    forehead_z = hair_r * 0.25   # above this = keep (top of head)
    chin_z = -hair_r * 0.65      # below this in front = remove

    for v in hair_mesh.vertices:
        lx, ly, lz = v.co.x, v.co.y, v.co.z

        # Face opening: front half, below forehead
        if ly < 0 and lz < forehead_z:
            # Elliptical test: how much of face to expose
            # More open at center, less at sides
            face_width = hair_r * 0.75 * (1.0 - (lz - chin_z) / (forehead_z - chin_z))
            face_width = max(face_width, hair_r * 0.3)
            if abs(lx) < face_width and ly < -hair_r * 0.3:
                verts_to_delete.add(v.index)

        # Remove bottom vertices based on style
        if style in ("buzz", "short", "pixie"):
            if lz < -hair_r * 0.55:
                verts_to_delete.add(v.index)
        elif style in ("medium", "bob", "short_bob"):
            if lz < -hair_r * 0.7 and ly < 0:
                verts_to_delete.add(v.index)

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')

    for vi in verts_to_delete:
        if vi < len(hair_mesh.vertices):
            hair_mesh.vertices[vi].select = True

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.delete(type='VERT')
    bpy.ops.object.mode_set(mode='OBJECT')

    hair_mesh = hair_obj.data

    # --- STYLE DEFORMATION ---
    if style in ("long", "long_straight", "very_long"):
        drop = head_height * (2.5 if "very" in style else 1.5)
        for v in hair_mesh.vertices:
            lz = v.co.z
            if lz < 0:
                t = min(abs(lz) / hair_r, 1.0)
                # Pull down with quadratic curve
                v.co.z -= drop * t * t
                # Slight narrowing as hair falls
                v.co.x *= 1.0 - t * 0.15
                # Back hair extends further
                if v.co.y > 0:
                    v.co.z -= drop * t * 0.3
                    v.co.y += drop * t * 0.08

    elif style in ("bob", "short_bob"):
        drop = head_height * 0.35
        for v in hair_mesh.vertices:
            if v.co.z < 0:
                t = min(abs(v.co.z) / hair_r, 1.0)
                v.co.z -= drop * t
                v.co.x *= 1.0 + t * 0.12
                # Inward curl at tips
                if t > 0.6:
                    curl = (t - 0.6) / 0.4
                    v.co.x *= 1.0 - curl * 0.2

    elif style == "ponytail":
        for v in hair_mesh.vertices:
            if v.co.y > hair_r * 0.15 and v.co.z < hair_r * 0.2:
                t = min(v.co.y / hair_r, 1.0)
                v.co.y += head_height * 1.0 * t
                v.co.z -= head_height * 0.8 * t
                v.co.x *= max(0.2, 1.0 - t * 0.8)

    elif style == "mohawk":
        for v in hair_mesh.vertices:
            dx = abs(v.co.x) / hair_r if hair_r > 0 else 0
            if dx > 0.2:
                v.co.z -= dx * hair_r * 0.9
            else:
                v.co.z += hair_r * 0.7 * (1.0 - dx / 0.2)
            v.co.x *= max(0.12, 1.0 - (1.0 - dx) * 0.8)

    elif style in ("short", "buzz", "pixie"):
        for v in hair_mesh.vertices:
            if v.co.z < -hair_r * 0.3:
                v.co.z = -hair_r * 0.3
            v.co.x *= 0.97
            v.co.y *= 0.97

    # --- PARENT ---
    hair_obj.parent = obj
    hair_obj.matrix_parent_inverse = obj.matrix_world.inverted()

    # --- MATERIAL ---
    mat_hair = bpy.data.materials.new(name=f"ARCANA_Hair_{obj.name}")
    mat_hair.use_nodes = True
    bsdf = None
    for node in mat_hair.node_tree.nodes:
        if node.type == 'BSDF_PRINCIPLED':
            bsdf = node
            break
    if bsdf:
        hex_c = color_hex.lstrip('#')
        if len(hex_c) == 6:
            r, g, b = int(hex_c[0:2],16)/255, int(hex_c[2:4],16)/255, int(hex_c[4:6],16)/255
        else:
            r, g, b = 0.17, 0.11, 0.05
        bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
        bsdf.inputs["Roughness"].default_value = 0.3
        try:
            bsdf.inputs["Specular IOR Level"].default_value = 0.5
        except Exception:
            pass
    hair_obj.data.materials.append(mat_hair)

    # Smooth shading
    bpy.ops.object.select_all(action='DESELECT')
    hair_obj.select_set(True)
    bpy.context.view_layer.objects.active = hair_obj
    bpy.ops.object.shade_smooth()

    return {
        "success": True,
        "name": obj.name,
        "hairObject": hair_obj.name,
        "style": style,
        "color": color_hex,
        "hairRadius": round(hair_r, 4),
        "headRadius": round(head_radius, 4),
        "headHeight": round(head_height, 4),
        "neckZ": round(neck_z, 4),
        "bodyHeight": round(body_height, 4),
        "message": f"Hair style '{style}' applied to {obj.name}"
    }

def bl_char_set_hair_length(params):
    obj = _get_char_mesh(params)
    front = params.get("frontCm", 15)
    side = params.get("sideCm", 20)
    back = params.get("backCm", 25)
    obj["arcana_hair_length"] = {"front": front, "side": side, "back": back}
    for ps in obj.particle_systems:
        if ps.settings.type == 'HAIR':
            avg = (front + side + back) / 3.0
            ps.settings.hair_length = avg / 100.0
    return {"character": obj.name, "hairLength": {"front": front, "side": side, "back": back}}


def bl_char_set_hair_color(params):
    obj = _get_char_mesh(params)
    preset = params.get("preset", "")
    color = params.get("color")
    presets = {
        "black": {"r": 0.02, "g": 0.02, "b": 0.02},
        "brown": {"r": 0.35, "g": 0.2, "b": 0.1},
        "blonde": {"r": 0.9, "g": 0.8, "b": 0.5},
        "red": {"r": 0.6, "g": 0.15, "b": 0.05},
        "ash": {"r": 0.6, "g": 0.58, "b": 0.55},
        "platinum_blonde": {"r": 0.95, "g": 0.92, "b": 0.85},
        "pink": {"r": 0.95, "g": 0.5, "b": 0.6},
        "lavender": {"r": 0.7, "g": 0.55, "b": 0.85},
        "silver": {"r": 0.8, "g": 0.8, "b": 0.82},
        "blue": {"r": 0.2, "g": 0.3, "b": 0.8},
        "green": {"r": 0.2, "g": 0.7, "b": 0.3},
        "white": {"r": 0.95, "g": 0.95, "b": 0.95},
    }
    final_color = presets.get(preset, color or presets["brown"])
    obj["arcana_hair_color"] = final_color
    mat_name = f"{obj.name}_Hair"
    mat = bpy.data.materials.get(mat_name)
    if not mat:
        mat = bpy.data.materials.new(mat_name)
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (final_color["r"], final_color["g"], final_color["b"], 1.0)
    return {"character": obj.name, "hairColor": final_color, "preset": preset}


def bl_char_set_hair_gradient(params):
    obj = _get_char_mesh(params)
    gradient_type = params.get("type", "ombre")
    root_color = params.get("rootColor", {"r": 0.2, "g": 0.1, "b": 0.05})
    tip_color = params.get("tipColor", {"r": 0.9, "g": 0.8, "b": 0.5})
    obj["arcana_hair_gradient"] = {"type": gradient_type, "root": root_color, "tip": tip_color}
    return {"character": obj.name, "gradient": obj["arcana_hair_gradient"]}


def bl_char_set_hair_highlight(params):
    obj = _get_char_mesh(params)
    color = params.get("highlightColor", {"r": 1, "g": 0.8, "b": 0.5})
    amount = params.get("amount", 0.3)
    obj["arcana_hair_highlight"] = {"color": color, "amount": amount}
    return {"character": obj.name, "highlight": obj["arcana_hair_highlight"]}


def bl_char_set_hair_volume(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    obj["arcana_hair_volume"] = value
    for ps in obj.particle_systems:
        if ps.settings.type == 'HAIR':
            ps.settings.root_radius = 0.5 + value * 0.5
            ps.settings.tip_radius = 0.1 + value * 0.2
    return {"character": obj.name, "volume": value}


def bl_char_set_hair_shine(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    obj["arcana_hair_shine"] = value
    mat_name = f"{obj.name}_Hair"
    mat = bpy.data.materials.get(mat_name)
    if mat and mat.use_nodes:
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Roughness"].default_value = 1.0 - value * 0.7
    return {"character": obj.name, "shine": value}


def bl_char_set_hair_physics(params):
    obj = _get_char_mesh(params)
    stiffness = params.get("stiffness", 0.5)
    damping = params.get("damping", 0.5)
    gravity = params.get("gravity", 1.0)
    obj["arcana_hair_physics"] = {"stiffness": stiffness, "damping": damping, "gravity": gravity}
    return {"character": obj.name, "physics": obj["arcana_hair_physics"]}


def bl_char_set_hair_parting(params):
    obj = _get_char_mesh(params)
    side = params.get("side", "center")
    obj["arcana_hair_parting"] = side
    return {"character": obj.name, "parting": side}


def bl_char_set_hair_accessory(params):
    obj = _get_char_mesh(params)
    accessory = params.get("type", "ribbon")
    color = params.get("color", {"r": 1, "g": 0, "b": 0})
    position = params.get("position", "top")
    if "arcana_hair_accessories" not in obj:
        obj["arcana_hair_accessories"] = []
    acc = {"type": accessory, "color": color, "position": position}
    obj["arcana_hair_accessories"] = str(acc)
    return {"character": obj.name, "accessory": acc}


def hair_handler_get_routes():
    return {
        "bl_char_set_hair_style": bl_char_set_hair_style,
        "bl_char_set_hair_length": bl_char_set_hair_length,
        "bl_char_set_hair_color": bl_char_set_hair_color,
        "bl_char_set_hair_gradient": bl_char_set_hair_gradient,
        "bl_char_set_hair_highlight": bl_char_set_hair_highlight,
        "bl_char_set_hair_volume": bl_char_set_hair_volume,
        "bl_char_set_hair_shine": bl_char_set_hair_shine,
        "bl_char_set_hair_physics": bl_char_set_hair_physics,
        "bl_char_set_hair_parting": bl_char_set_hair_parting,
        "bl_char_set_hair_accessory": bl_char_set_hair_accessory,
    }


# ============================================================
# Character Handler: char_material_handler
# ============================================================
"""Character Material Handler - 8 tools for skin, makeup, tattoo, etc."""



# _get_char_mesh: see body_handler section (deduplicated)


def _get_or_create_skin_mat(obj):
    mat_name = f"{obj.name}_Skin"
    mat = bpy.data.materials.get(mat_name)
    if not mat:
        mat = bpy.data.materials.new(mat_name)
        mat.use_nodes = True
        if mat.name not in [m.name for m in obj.data.materials]:
            obj.data.materials.append(mat)
    return mat


def bl_char_set_skin_color(params):
    # --- MPFB2 skin path ---
    obj_check = _get_char_mesh(params)
    if _has_mpfb() and obj_check.get("arcana_backend") == "mpfb2":
        skin_name = params.get("mpfb_skin", "")
        preset = params.get("preset", "").lower()
        _gender = obj_check.get("arcana_gender", "female")
        # Dynamic skin discovery (no hardcoded paths)
        if not skin_name and preset:
            skin_name, _skin_path = _mpfb_find_skin_for_preset(preset, _gender)
        elif skin_name:
            skin_name, _skin_path = _mpfb_find_asset("skins", skin_name)
        else:
            skin_name, _skin_path = None, None
        if _skin_path:
            try:
                bpy.ops.mpfb.load_library_skin(filepath=_skin_path)
                return {
                    "success": True,
                    "name": obj_check.name,
                    "preset": preset or str(skin_name),
                    "backend": "mpfb2",
                    "message": f"MPFB2 skin '{skin_name}' applied"
                }
            except Exception as e:
                print(f"[ARCANA] MPFB2 skin not applied ({skin_name}), using material color")
        # MPFB2 skin assets not installed or failed - fall through to material color
    # --- Fallback: material color (original logic below) ---
    """Set skin color by preset name or custom RGB. Updates Principled BSDF Base Color."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    presets = {
        "fair":   (0.94, 0.82, 0.74, 1.0),
        "light":  (0.87, 0.72, 0.62, 1.0),
        "medium": (0.78, 0.61, 0.48, 1.0),
        "olive":  (0.68, 0.52, 0.38, 1.0),
        "tan":    (0.59, 0.42, 0.30, 1.0),
        "brown":  (0.45, 0.30, 0.20, 1.0),
        "dark":   (0.32, 0.20, 0.13, 1.0),
        "deep":   (0.22, 0.13, 0.08, 1.0),
    }

    preset = params.get("preset", "").lower()
    if preset in presets:
        color = presets[preset]
    else:
        r = float(params.get("r", 0.78))
        g = float(params.get("g", 0.61))
        b = float(params.get("b", 0.48))
        color = (r, g, b, 1.0)

    # Apply to all materials on the object
    for mat_slot in obj.material_slots:
        mat = mat_slot.material
        if mat and mat.use_nodes:
            for node in mat.node_tree.nodes:
                if node.type == 'BSDF_PRINCIPLED':
                    node.inputs["Base Color"].default_value = color
                    try:
                        node.inputs["Subsurface Radius"].default_value = (color[0]*0.9, color[1]*0.6, color[2]*0.4)
                    except Exception:
                        pass

    return {"success": True, "name": obj.name, "color": list(color[:3]), "preset": preset or "custom"}


def bl_char_set_skin_texture(params):
    obj = _get_char_mesh(params)
    texture = params.get("texture", "smooth")
    obj["arcana_skin_texture"] = texture
    return {"character": obj.name, "skinTexture": texture}


def bl_char_add_mole(params):
    obj = _get_char_mesh(params)
    position = params.get("position", "left_cheek")
    size = params.get("size", 0.3)
    if "arcana_moles" not in obj:
        obj["arcana_moles"] = ""
    existing = obj["arcana_moles"]
    obj["arcana_moles"] = f"{existing};{position}:{size}" if existing else f"{position}:{size}"
    return {"character": obj.name, "mole": {"position": position, "size": size}}


def bl_char_set_makeup(params):
    obj = _get_char_mesh(params)
    makeup = {}
    for key in ["eyeshadow", "blush", "lipColor", "eyeliner", "foundation"]:
        val = params.get(key)
        if val is not None:
            makeup[key] = val
    obj["arcana_makeup"] = str(makeup)
    return {"character": obj.name, "makeup": makeup}


def bl_char_set_eye_material(params):
    obj = _get_char_mesh(params)
    iris_color = params.get("irisColor", {"r": 0.3, "g": 0.2, "b": 0.1})
    sclera_color = params.get("scleraColor", {"r": 1, "g": 1, "b": 1})
    pupil_size = params.get("pupilSize", 0.5)
    mat_name = f"{obj.name}_Eyes"
    mat = bpy.data.materials.get(mat_name)
    if not mat:
        mat = bpy.data.materials.new(mat_name)
        mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (iris_color["r"], iris_color["g"], iris_color["b"], 1.0)
        bsdf.inputs["Roughness"].default_value = 0.1
        bsdf.inputs["Clearcoat"].default_value = 1.0 if hasattr(bsdf.inputs, "Clearcoat") else 0
    return {"character": obj.name, "eyeMaterial": {"iris": iris_color, "pupilSize": pupil_size}}


def bl_char_set_nail(params):
    obj = _get_char_mesh(params)
    color = params.get("color", {"r": 0.9, "g": 0.5, "b": 0.5})
    style = params.get("style", "normal")
    obj["arcana_nail"] = {"color": color, "style": style}
    return {"character": obj.name, "nail": obj["arcana_nail"]}


def bl_char_add_tattoo(params):
    obj = _get_char_mesh(params)
    position = params.get("position", "right_arm")
    design = params.get("design", "tribal")
    size = params.get("size", 0.5)
    if "arcana_tattoos" not in obj:
        obj["arcana_tattoos"] = ""
    existing = obj["arcana_tattoos"]
    entry = f"{position}:{design}:{size}"
    obj["arcana_tattoos"] = f"{existing};{entry}" if existing else entry
    return {"character": obj.name, "tattoo": {"position": position, "design": design, "size": size}}


def bl_char_add_scar(params):
    obj = _get_char_mesh(params)
    position = params.get("position", "left_cheek")
    scar_type = params.get("type", "slash")
    length = params.get("length", 0.5)
    if "arcana_scars" not in obj:
        obj["arcana_scars"] = ""
    existing = obj["arcana_scars"]
    entry = f"{position}:{scar_type}:{length}"
    obj["arcana_scars"] = f"{existing};{entry}" if existing else entry
    return {"character": obj.name, "scar": {"position": position, "type": scar_type, "length": length}}




# ============================================================
# Character Handler: clothing_handler
# ============================================================
"""Character Clothing Handler - 3 tools for MPFB2 clothing management."""


def bl_char_set_clothing(params):
    """Apply clothing to character. Uses MPFB2 clothes library if available."""
    obj = _get_char_mesh(params)

    # --- MPFB2 clothing path ---
    if _has_mpfb() and obj.get("arcana_backend") == "mpfb2":
        # Accept individual slots or a list
        slots = {}
        for slot in ["top", "bottom", "shoes", "dress", "suit", "hat",
                      "glasses", "gloves", "mask", "underwear", "socks",
                      "outfit", "accessory"]:
            val = params.get(slot)
            if val:
                slots[slot] = val

        # Also accept a direct "clothes" list
        clothes_list = params.get("clothes", [])
        if isinstance(clothes_list, str):
            clothes_list = [clothes_list]

        applied = []
        errors = []

        # Map natural language to MPFB2 asset names
        _clothing_hints = {
            "tshirt": "female_casualsuit01", "t_shirt": "female_casualsuit01",
            "casual": "female_casualsuit01", "casual_suit": "female_casualsuit01",
            "elegant": "female_elegantsuit01", "elegant_suit": "female_elegantsuit01",
            "sport": "female_sportsuit01", "sportswear": "female_sportsuit01",
            "formal": "female_elegantsuit01", "dress": "female_elegantsuit01",
            "work": "male_worksuit01", "worksuit": "male_worksuit01",
            "suit": "male_casualsuit01",
            "hat": "fedora01", "fedora": "fedora01", "cap": "fedora_cocked",
            "shoes": "shoes01", "boots": "shoes03", "heels": "shoes02",
            "sneakers": "shoes04", "sandals": "shoes05", "flats": "shoes06",
        }
        # Resolve natural names to actual asset names
        _resolved_slots = {}
        for slot, asset_name in slots.items():
            _resolved = _clothing_hints.get(asset_name.lower(), asset_name)
            _resolved_slots[slot] = _resolved
        slots = _resolved_slots

        # Apply individual slot items via MPFB2
        for slot, asset_name in slots.items():
            try:
                _cloth_name, _cloth_path = _mpfb_find_asset('clothes', asset_name)
                if _cloth_path:
                    bpy.ops.mpfb.load_library_clothes(filepath=_cloth_path)
                else:
                    raise FileNotFoundError(f'Asset {asset_name} not found in installed packs')
                applied.append({"slot": slot, "asset": asset_name})
            except Exception as e:
                errors.append({"slot": slot, "asset": asset_name, "error": str(e)})

        # Apply clothes list
        for item in clothes_list:
            try:
                bpy.ops.mpfb.load_library_clothes(filepath=item)
                applied.append({"slot": "custom", "asset": item})
            except Exception as e:
                errors.append({"slot": "custom", "asset": item, "error": str(e)})


        # Sync scale for all newly loaded clothing/accessories
        if obj and obj.parent:
            for _child in obj.parent.children:
                if _child != obj and _child.type == 'MESH' and _child.scale[:] != obj.scale[:]:
                    _child.scale = obj.scale.copy()
                    print(f"[ARCANA] Clothing '{_child.name}' scale synced to {obj.scale[:]}")
        # Store metadata
        if "arcana_clothing" not in obj:
            obj["arcana_clothing"] = ""
        existing = obj["arcana_clothing"]
        new_items = ",".join([a["asset"] for a in applied])
        obj["arcana_clothing"] = f"{existing},{new_items}" if existing else new_items

        return {
            "success": len(applied) > 0,
            "character": obj.name,
            "applied": applied,
            "errors": errors,
            "backend": "mpfb2",
            "message": f"Applied {len(applied)} clothing items" + (f" ({len(errors)} failed)" if errors else "")
        }

    # --- Fallback: no MPFB2, store metadata only ---
    clothing_info = {}
    for slot in ["top", "bottom", "shoes", "dress", "suit", "hat",
                  "glasses", "gloves", "mask", "outfit"]:
        val = params.get(slot)
        if val:
            clothing_info[slot] = val
    obj["arcana_clothing"] = str(clothing_info)

    return {
        "success": True,
        "character": obj.name,
        "clothing": clothing_info,
        "backend": "fallback",
        "message": "Clothing metadata stored (install MPFB2 + asset packs for actual 3D clothing)"
    }


def bl_char_remove_clothing(params):
    """Remove clothing from character."""
    obj = _get_char_mesh(params)
    slot = params.get("slot", "all")

    if _has_mpfb() and obj.get("arcana_backend") == "mpfb2":
        removed = []
        # Find child objects that are clothing
        for child in list(obj.children):
            is_clothing = (child.get("MPFB_clothes") or
                          child.get("mpfb_type") == "clothes" or
                          "clothes" in child.name.lower())
            if is_clothing:
                if slot == "all" or slot.lower() in child.name.lower():
                    removed.append(child.name)
                    bpy.data.objects.remove(child, do_unlink=True)

        obj["arcana_clothing"] = ""
        return {
            "success": True,
            "character": obj.name,
            "removed": removed,
            "message": f"Removed {len(removed)} clothing items"
        }

    obj["arcana_clothing"] = ""
    return {"success": True, "character": obj.name, "removed": [], "message": "Clothing metadata cleared"}


def bl_char_list_clothing(params):
    """List available clothing assets (dynamically discovered from installed packs)."""
    result = {
        "mpfb2_available": _has_mpfb(),
        "categories": {},
        "all_assets": [],
        "total": 0,
    }

    if _has_mpfb():
        assets = _discover_mpfb_assets()
        clothes = assets.get("clothes", {})
        result["all_assets"] = sorted(clothes.keys())
        result["total"] = len(clothes)
        # Auto-categorize by name patterns
        cats = {"tops": [], "pants": [], "shoes": [], "dresses": [], "suits": [],
                "hats": [], "accessories": [], "other": []}
        for name in sorted(clothes.keys()):
            nl = name.lower()
            if any(k in nl for k in ["shirt", "top", "sweater", "blouse", "tank", "vest", "jacket", "coat"]):
                cats["tops"].append(name)
            elif any(k in nl for k in ["pant", "jean", "short", "skirt", "trouser", "legging"]):
                cats["pants"].append(name)
            elif any(k in nl for k in ["shoe", "boot", "sandal", "heel", "flat", "sneaker", "slipper"]):
                cats["shoes"].append(name)
            elif any(k in nl for k in ["dress", "gown", "robe"]):
                cats["dresses"].append(name)
            elif any(k in nl for k in ["suit", "tux", "formal"]):
                cats["suits"].append(name)
            elif any(k in nl for k in ["hat", "cap", "fedora", "helmet", "hood", "beanie"]):
                cats["hats"].append(name)
            elif any(k in nl for k in ["glass", "necklace", "ring", "watch", "belt", "scarf", "tie"]):
                cats["accessories"].append(name)
            else:
                cats["other"].append(name)
        result["categories"] = {k: v for k, v in cats.items() if v}

    else:
        result["note"] = "Install MPFB2 and download CC0 asset packs for 3D clothing"

    return result



def bl_char_list_hair(params):
    """List all available hair assets (dynamically discovered)."""
    if not _has_mpfb():
        return {"mpfb2_available": False, "hair": [], "total": 0,
                "note": "MPFB2 not installed. Only UV Sphere fallback available."}
    assets = _discover_mpfb_assets()
    hair = assets.get("hair", {})
    return {
        "mpfb2_available": True,
        "hair": sorted(hair.keys()),
        "total": len(hair),
        "note": "Use exact asset names with bl_char_set_hair_style (style param) or bl_char_set_hair_style mpfb_hair param."
    }


def bl_char_list_skins(params):
    """List all available skin assets (dynamically discovered)."""
    if not _has_mpfb():
        return {"mpfb2_available": False, "skins": [], "total": 0,
                "note": "MPFB2 not installed. Only material color fallback available."}
    assets = _discover_mpfb_assets()
    skins = assets.get("skins", {})
    return {
        "mpfb2_available": True,
        "skins": sorted(skins.keys()),
        "total": len(skins),
        "presets": ["light", "fair", "medium", "tan", "olive", "dark", "brown",
                    "asian", "african", "caucasian", "freckles", "ginger", "makeup"],
        "note": "Use presets with bl_char_set_skin_color (preset param) or exact asset names (mpfb_skin param)."
    }

def clothing_handler_get_routes():
    return {
        "bl_char_set_clothing": bl_char_set_clothing,
        "bl_char_remove_clothing": bl_char_remove_clothing,
        "bl_char_list_clothing": bl_char_list_clothing,
        "bl_char_list_hair": bl_char_list_hair,
        "bl_char_list_skins": bl_char_list_skins,
    }

def char_material_handler_get_routes():
    return {
        "bl_char_set_skin_color": bl_char_set_skin_color,
        "bl_char_set_skin_texture": bl_char_set_skin_texture,
        "bl_char_add_mole": bl_char_add_mole,
        "bl_char_set_makeup": bl_char_set_makeup,
        "bl_char_set_eye_material": bl_char_set_eye_material,
        "bl_char_set_nail": bl_char_set_nail,
        "bl_char_add_tattoo": bl_char_add_tattoo,
        "bl_char_add_scar": bl_char_add_scar,
    }


# ============================================================
# register_all_handlers
# ============================================================
def register_all_handlers():
    """Register all tool handlers, aliases, and not-implemented."""
    register_routes(animation_handler_get_routes())
    register_routes(armature_handler_get_routes())
    register_routes(camera_handler_get_routes())
    register_routes(compositor_handler_get_routes())
    register_routes(geometry_nodes_handler_get_routes())
    register_routes(grease_pencil_handler_get_routes())
    register_routes(light_handler_get_routes())
    register_routes(material_handler_get_routes())
    register_routes(mesh_handler_get_routes())
    register_routes(modifier_handler_get_routes())
    register_routes(node_handler_get_routes())
    register_routes(object_handler_get_routes())
    register_routes(particle_handler_get_routes())
    register_routes(render_handler_get_routes())
    register_routes(scene_handler_get_routes())
    register_routes(sculpt_handler_get_routes())
    register_routes(texture_paint_handler_get_routes())
    register_routes(uv_handler_get_routes())
    register_routes(vse_handler_get_routes())
    register_routes(body_handler_get_routes())
    register_routes(export_handler_get_routes())
    register_routes(expression_handler_get_routes())
    register_routes(face_handler_get_routes())
    register_routes(hair_handler_get_routes())
    register_routes(char_material_handler_get_routes())
    register_routes(clothing_handler_get_routes())
    register_aliases({
            # bl_object: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ
            "bl_object_visibility": "bl_object_set_visibility",
            "bl_object_get_info": "bl_object_list",
            "bl_object_join": "bl_mesh_join",
            "bl_object_separate": "bl_mesh_separate",
    
            # bl_sculpt: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ
            "bl_sculpt_enter_mode": "bl_sculpt_enable",
            "bl_sculpt_mask_operations": "bl_sculpt_mask",
    
            # bl_mesh: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｮ・ｫ繝ｻ・ｲ郢晢ｽｻ繝ｻ・｢鬮｣蛹・ｽｽ・ｳ髫ｶ螢ｹ繝ｻ繝ｻ・ｽ繝ｻ・｢髣包ｽｵ雋翫ｑ・ｽ・ｽ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ鬮ｫ・ｰ騾搾ｽｲ繝ｻ・ｻ郢晢ｽｻ郢晢ｽｻ鬯ｯ・ｩ陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｲ鬮ｯ譎｢・ｽ・ｲ郢晢ｽｻ繝ｻ・ｨ鬩包ｽｶ闔ｨ竏壹・郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ鬩幢ｽ｢繝ｻ・ｧ髫ｰ繝ｻ竏槭・・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｿ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｿ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE            "bl_mesh_merge": "bl_mesh_merge_vertices",
            "bl_mesh_recalc_normals": "bl_mesh_flip_normals",
            "bl_mesh_smooth": "bl_mesh_smooth_shade",
            "bl_mesh_loop_cut": "bl_mesh_subdivide",
            "bl_mesh_uv_unwrap": "bl_uv_unwrap",
    
            # bl_material: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ
            "bl_material_set_texture": "bl_material_add_texture",
    
            # bl_animation: 鬯ｮ・ｫ繝ｻ・ｶ髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｻ驛｢・ｧ隰・∞・ｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｿ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｯ貅ｽ謠ｴ繝ｻ・ｲmature鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｼ髫ｲ蟶幢ｽ､・ｷ郢晢ｽｻ
            "bl_anim_create_bone": "bl_armature_add_bone",
            "bl_anim_add_ik": "bl_armature_set_ik",
    
            # bl_light: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ
            "bl_light_set_power": "bl_light_set_energy",
    
            # bl_scene: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ / 鬯ｮ・ｫ繝ｻ・ｶ髯具ｽｹ郢晢ｽｻ繝ｻ・ｽ繝ｻ・ｻ驛｢・ｧ隰・∞・ｽ・ｽ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｿ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬮ｫ・ｰ騾搾ｽｲ繝ｻ・ｻ隶鯉ｽ｢邵ｺ遏ｩ・ｩ蟷｢・ｽ・｢髫ｴ荵励・繝ｻ・ｽ繝ｻ・ｸ鬮｣逍ｲ・ｩ・ｸ繝ｻ・ｽ繝ｻ・ｦ鬯ｩ蟷｢・ｽ・｢髫ｴ蜿門ｾ励・・ｽ繝ｻ・ｳ郢晢ｽｻ繝ｻ・ｨ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｼ髫ｲ蟶幢ｽ､・ｷ郢晢ｽｻ
            "bl_scene_set_units": "bl_scene_set_unit",
            "bl_scene_set_frame_range": "bl_anim_set_frame_range",
            "bl_scene_set_world": "bl_render_set_world_color",
    
            # bl_compositor: 鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ陷ｿ蜴・ｽｽ・ｨ隰夲ｽｵ繝ｻ・ｽ繝ｻ・ｹ髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ竏ｫ・ｵ・ｶ髫伜､懶ｽｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ (bl_compositor_ vs bl_comp_)
            "bl_compositor_enable": "bl_comp_enable",
            "bl_compositor_add_node": "bl_comp_add_node",
            "bl_compositor_connect": "bl_comp_connect",
    
            # bl_grease_pencil: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ
            "bl_gp_set_line_width": "bl_gp_set_thickness",
    
            # bl_texture_paint: 鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ陷ｿ蜴・ｽｽ・ｨ隰夲ｽｵ繝ｻ・ｽ繝ｻ・ｹ髫ｴ蠑ｱ繝ｻ繝ｻ・ｽ繝ｻ・ｼ髫ｴ竏ｫ・ｵ・ｶ髫伜､懶ｽｩ蟷｢・ｽ・｢髫ｴ謫ｾ・ｽ・ｴ驛｢譎｢・ｽ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｹ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ (bl_tpaint_ vs bl_texpaint_)
            "bl_tpaint_enter_mode": "bl_texpaint_enable",
            "bl_tpaint_set_brush": "bl_texpaint_set_brush",
    
            # bl_render: ID鬯ｮ・ｯ雋・ｽｷ隴ｯ竏壹・繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｮ鬯ｮ・ｯ隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮ
            "bl_render_execute": "bl_render_render",
            "bl_render_color_management": "bl_render_set_color_management",
            "bl_render_set_denoise": "bl_render_set_denoising",
        })
    register_not_implemented([
            # bl_object
            "bl_object_set_origin",
    
            # bl_mesh
            "bl_mesh_bevel",
            "bl_mesh_export",
    
            # bl_material
            "bl_material_add_node",
            "bl_material_remove",
    
            # bl_modifier
            "bl_mod_wireframe",
            "bl_mod_decimate",
    
            # bl_sculpt
            "bl_sculpt_apply_stroke",
            "bl_sculpt_face_sets",
    
            # bl_animation
            "bl_anim_add_nla_track",
            "bl_anim_bake",
            "bl_anim_export",
    
            # bl_camera
            "bl_camera_track_to",
            "bl_camera_set_bg_image",
    
            # bl_light
            "bl_light_set_size",
            "bl_light_set_type",
    
            # bl_scene
            "bl_scene_create_collection",
            "bl_scene_move_to_collection",
    
            # bl_compositor (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_compositor_add_glare",
            "bl_compositor_add_color_correction",
            "bl_compositor_add_denoise",
            "bl_compositor_add_vignette",
    
            # bl_grease_pencil (鬯ｯ・ｯ繝ｻ・ｩ郢晢ｽｻ繝ｻ・･鬮ｯ譎｢・｣・ｰ鬮ｮ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・､鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・｡鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ陷茨ｽｷ繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｽE鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_gp_create_object",
            "bl_gp_draw_stroke",
            "bl_gp_add_effect",
            "bl_gp_set_onion_skinning",
            "bl_gp_animate",
            "bl_gp_export",
    
            # bl_geometry_nodes (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_geonodes_set_input",
            "bl_geonodes_add_scatter_setup",
            "bl_geonodes_add_array_setup",
            "bl_geonodes_add_deform_node",
            "bl_geonodes_add_curve_setup",
            "bl_geonodes_list_tree",
    
            # bl_texture_paint (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_tpaint_apply_stroke",
            "bl_tpaint_fill_layer",
            "bl_tpaint_save_image",
    
            # bl_render (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_render_add_aov",
            "bl_render_toggle_compositor",
            "bl_render_add_view_layer",
    
            # bl_uv (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_uv_rotate",
            "bl_uv_scale",
    
            # bl_vse (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_vse_add_transition",
            "bl_vse_cut_strip",
            "bl_vse_set_strip_properties",
            "bl_vse_render_animation",
    
            # bl_particle (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_particle_set_gravity",
            "bl_particle_set_render",
    
            # bl_node (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｫ鬯ｮ・ｯ隴擾ｽｴ郢晢ｽｻ郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｾ鬯ｮ・ｯ雋翫ｑ・ｽ・ｽ繝ｻ・｢鬮ｫ・ｲ陝ｶ蟷｢・ｽ・ｲ繝ｻ・ｩ驛｢譎｢・ｽ・ｻ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ鬩幢ｽ｢隴趣ｽ｢繝ｻ・ｽ繝ｻ・ｻ
            "bl_node_delete",
            "bl_node_arrange",
            "bl_node_add_mix",
            "bl_node_add_tex_coord",
            "bl_node_set_output",
    
            # bl_armature (鬯ｩ蟷｢・ｽ・｢髫ｴ諠ｹ・ｸ讖ｸ・ｽ・ｹ繝ｻ・ｲ郢晢ｽｻ闕ｳ・ｻ繝ｻ・ｸ繝ｻ・ｷ郢晢ｽｻ繝ｻ・ｹ郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｰ鬯ｩ蟷｢・ｽ・｢郢晢ｽｻ繝ｻ・ｧ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・､鬯ｩ蟷｢・ｽ・｢髫ｴ雜｣・ｽ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｳ鬯ｮ・ｯ陷ｿ・･繝ｻ・ｹ繝ｻ・｢郢晢ｽｻ繝ｻ・ｽ郢晢ｽｻ繝ｻ・ｴ鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｮID鬯ｩ謳ｾ・ｽ・ｵ郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｨ鬯ｮ・｣陋ｹ繝ｻ・ｽ・ｽ繝ｻ・ｳ鬮ｯ諛ｶ・ｽ・｣郢晢ｽｻ繝ｻ・ｺ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｸ郢晢ｽｻ邵ｺ・､・つ鬯ｯ・ｮ繝ｻ・｢郢晢ｽｻ繝ｻ・ｾ驛｢譎｢・ｽ・ｻ郢晢ｽｻ繝ｻ・ｴ)
            "bl_armature_delete_bone",
            "bl_armature_set_parent_bone",
            "bl_armature_weight_paint",
            "bl_armature_pose_mode",
            "bl_armature_add_constraint",
            "bl_armature_add_ik",
            "bl_armature_get_info",
        ])
    r = get_registered_count()
    a = get_alias_count()
    n = get_not_implemented_count()
    print(f"[ARCANA] {r} handlers + {a} aliases registered ({n} not-implemented tracked)")

# ============================================================
# execute_code tool (BlenderMCP inspired)
# ============================================================
def bl_execute_code(params):
    """Execute arbitrary Python code in Blender. Use with caution."""
    code = params.get("code", "")
    if not code:
        raise ValueError("No code provided")
    namespace = {"bpy": bpy, "mathutils": mathutils}
    capture = io.StringIO()
    with redirect_stdout(capture):
        exec(code, namespace)
    return {"executed": True, "output": capture.getvalue()}

# ============================================================
# ArcanaBridge
# ============================================================
"""
ARCANA Bridge - WebSocket client for Blender <-> ARCANA Server communication.
Runs WebSocket in a background thread, dispatches commands to bpy via timer.
"""


# WebSocket: Blender bundled Python may not have websockets, so we use socket

_bridge_instance = None
_command_queue = queue.Queue()
_response_queue = queue.Queue()


def get_bridge():
    return _bridge_instance


def connect(host="localhost", port=9879):
    global _bridge_instance
    if _bridge_instance and _bridge_instance.connected:
        _bridge_instance.close()
    _bridge_instance = ArcanaBridge(host, port)
    _bridge_instance.start()


def disconnect():
    global _bridge_instance
    if _bridge_instance:
        _bridge_instance.close()
        _bridge_instance = None


def register_handlers():
    if bpy.app.timers.is_registered(_process_commands):
        return
    bpy.app.timers.register(_process_commands, persistent=True)


def unregister_handlers():
    if bpy.app.timers.is_registered(_process_commands):
        bpy.app.timers.unregister(_process_commands)


def _process_commands():
    """Timer callback - runs in main thread, safe to call bpy."""
    max_per_tick = 10
    processed = 0
    while not _command_queue.empty() and processed < max_per_tick:
        try:
            msg = _command_queue.get_nowait()
            _handle_command(msg)
            processed += 1
        except queue.Empty:
            break
    return 0.05  # 50ms interval



def _json_safe(obj):
    """Make an object JSON-serializable by converting problematic types."""
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [_json_safe(v) for v in obj]
    elif isinstance(obj, (int, float, bool, str, type(None))):
        return obj
    else:
        return str(obj)

def _handle_command(msg):
    """Route incoming command to appropriate handler."""
    try:
        data = json.loads(msg) if isinstance(msg, str) else msg
        cmd_id = data.get("id", "unknown")
        tool_id = data.get("tool", "")
        params = data.get("params", {})

        result = route_command(tool_id, params)

        response = {
            "id": cmd_id,
            "success": True,
            "result": result
        }
    except Exception as e:
        response = {
            "id": data.get("id", "unknown") if isinstance(data, dict) else "unknown",
            "success": False,
            "error": str(e)
        }

    bridge = get_bridge()
    if bridge and bridge.connected:
        bridge.send(json.dumps(_json_safe(response)))


class ArcanaBridge:
    """WebSocket client that connects to ARCANA MCP Server."""

    def __init__(self, host="localhost", port=9879):
        self.host = host
        self.port = port
        self.connected = False
        self.tool_count = 238
        self.cmd_count = 0
        self._socket = None
        self._thread = None
        self._running = False

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def close(self):
        self._running = False
        self.connected = False
        if self._socket:
            try:
                self._socket.close()
            except:
                pass
            self._socket = None

    def send(self, data):
        if not self._socket or not self.connected:
            return
        try:
            self._ws_send(data)
        except Exception as e:
            print(f"[ARCANA] Send error: {e}")
            self.connected = False

    def _run(self):
        """Background thread: connect and listen."""
        retry_delay = 1
        max_retry = 30

        while self._running:
            try:
                self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self._socket.settimeout(5)
                self._socket.connect((self.host, self.port))

                # WebSocket handshake
                if not self._ws_handshake():
                    raise ConnectionError("WebSocket handshake failed")

                self.connected = True
                self._socket.settimeout(1)
                retry_delay = 1
                print(f"[ARCANA] Connected to {self.host}:{self.port}")

                # Send registration
                reg = json.dumps({
                    "type": "register",
                    "editor": "blender",
                    "version": bpy.app.version_string,
                    "tools": self.tool_count
                })
                self._ws_send(reg)

                # Listen loop
                while self._running and self.connected:
                    try:
                        msg = self._ws_recv()
                        if msg is None:
                            continue
                        if msg == "":
                            # Connection closed
                            break
                        self.cmd_count += 1
                        _command_queue.put(msg)
                    except socket.timeout:
                        continue
                    except Exception as e:
                        print(f"[ARCANA] Recv error: {e}")
                        break

            except Exception as e:
                if self._running:
                    print(f"[ARCANA] Connection failed: {e}, retry in {retry_delay}s")

            self.connected = False
            if self._socket:
                try:
                    self._socket.close()
                except:
                    pass
                self._socket = None

            if self._running:
                time.sleep(retry_delay)
                retry_delay = min(retry_delay * 2, max_retry)

    def _ws_handshake(self):
        """Perform WebSocket upgrade handshake."""
        key = base64.b64encode(os.urandom(16)).decode('utf-8')
        handshake = (
            f"GET / HTTP/1.1\r\n"
            f"Host: {self.host}:{self.port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n"
            f"Sec-WebSocket-Protocol: arcana\r\n"
            f"\r\n"
        )
        self._socket.sendall(handshake.encode('utf-8'))

        response = b""
        while b"\r\n\r\n" not in response:
            chunk = self._socket.recv(4096)
            if not chunk:
                return False
            response += chunk

        return b"101" in response

    def _ws_send(self, data):
        """Send a WebSocket text frame (client must mask)."""
        payload = data.encode('utf-8')
        frame = bytearray()
        frame.append(0x81)  # FIN + text opcode

        length = len(payload)
        if length < 126:
            frame.append(0x80 | length)  # MASK bit set
        elif length < 65536:
            frame.append(0x80 | 126)
            frame.extend(struct.pack(">H", length))
        else:
            frame.append(0x80 | 127)
            frame.extend(struct.pack(">Q", length))

        mask = os.urandom(4)
        frame.extend(mask)
        masked = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        frame.extend(masked)

        self._socket.sendall(bytes(frame))

    def _ws_recv(self):
        """Receive a WebSocket frame."""
        try:
            header = self._recv_exact(2)
            if not header:
                return ""

            opcode = header[0] & 0x0F
            if opcode == 0x8:  # Close
                return ""
            if opcode == 0x9:  # Ping
                self._ws_send_pong()
                return None

            masked = bool(header[1] & 0x80)
            length = header[1] & 0x7F

            if length == 126:
                length = struct.unpack(">H", self._recv_exact(2))[0]
            elif length == 127:
                length = struct.unpack(">Q", self._recv_exact(8))[0]

            if masked:
                mask = self._recv_exact(4)
                data = self._recv_exact(length)
                data = bytearray(b ^ mask[i % 4] for i, b in enumerate(data))
            else:
                data = self._recv_exact(length)

            if opcode == 0x1:  # Text
                return data.decode('utf-8')
            return None

        except socket.timeout:
            raise
        except Exception:
            return ""

    def _ws_send_pong(self):
        """Send pong frame."""
        frame = bytearray([0x8A, 0x80])  # FIN + pong, masked, 0 length
        frame.extend(os.urandom(4))  # mask key
        self._socket.sendall(bytes(frame))

    def _recv_exact(self, n):
        """Receive exactly n bytes."""
        data = bytearray()
        while len(data) < n:
            chunk = self._socket.recv(n - len(data))
            if not chunk:
                return None
            data.extend(chunk)
        return bytes(data)


# ============================================================
# UI Panel & Operators
# ============================================================

class ArcanaPreferences(bpy.types.AddonPreferences):
    bl_idname = __name__
    host: StringProperty(name="Host", default="localhost")
    port: IntProperty(name="Port", default=9879, min=1024, max=65535)
    auto_connect: BoolProperty(name="Auto Connect on Startup", default=False)
    def draw(self, context):
        layout = self.layout
        layout.prop(self, "host")
        layout.prop(self, "port")
        layout.prop(self, "auto_connect")

class ARCANA_PT_MainPanel(bpy.types.Panel):
    bl_label = "ARCANA"
    bl_idname = "ARCANA_PT_main"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "ARCANA"
    def draw(self, context):
        layout = self.layout
        bridge = get_bridge()
        if bridge and bridge.connected:
            layout.label(text="Status: Connected", icon="LINKED")
            layout.operator("arcana.disconnect", text="Disconnect", icon="UNLINKED")
            layout.label(text=f"Tools: {bridge.tool_count}")
            layout.label(text=f"Commands: {bridge.cmd_count}")
        else:
            layout.label(text="Status: Disconnected", icon="UNLINKED")
            layout.operator("arcana.connect", text="Connect", icon="LINKED")

class ARCANA_OT_Connect(bpy.types.Operator):
    bl_idname = "arcana.connect"
    bl_label = "Connect to ARCANA"
    def execute(self, context):
        prefs = context.preferences.addons[__name__].preferences
        connect(prefs.host, prefs.port)
        self.report({"INFO"}, f"Connecting to ARCANA at {prefs.host}:{prefs.port}")
        return {"FINISHED"}

class ARCANA_OT_Disconnect(bpy.types.Operator):
    bl_idname = "arcana.disconnect"
    bl_label = "Disconnect from ARCANA"
    def execute(self, context):
        disconnect()
        self.report({"INFO"}, "Disconnected from ARCANA")
        return {"FINISHED"}

_classes = (ArcanaPreferences, ARCANA_PT_MainPanel, ARCANA_OT_Connect, ARCANA_OT_Disconnect)

def register():
    for cls in _classes:
        bpy.utils.register_class(cls)
    register_handlers()
    register_all_handlers()
    register_route("bl_execute_code", bl_execute_code)
    print("[ARCANA] Single-file addon registered")

def unregister():
    disconnect()
    unregister_handlers()
    for cls in reversed(_classes):
        bpy.utils.unregister_class(cls)
    print("[ARCANA] Single-file addon unregistered")

if __name__ == "__main__":
    register()