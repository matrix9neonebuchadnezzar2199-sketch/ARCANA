"""Character Export Handler - 5 tools for VRM/FBX export and validation."""

import bpy
import os
from ...utils.bpy_helpers import get_object, select_only


def _get_char_mesh(params):
    name = params.get("character", params.get("name", ""))
    if name:
        return get_object(name)
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and obj.data.shape_keys:
            return obj
    raise ValueError("No character mesh found")


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


def get_routes():
    return {
        "bl_char_export_vrm": bl_char_export_vrm,
        "bl_char_export_fbx": bl_char_export_fbx,
        "bl_char_validate_avatar": bl_char_validate_avatar,
        "bl_char_optimize": bl_char_optimize,
        "bl_char_setup_spring_bone": bl_char_setup_spring_bone,
    }
