"""Character Expression Handler - 8 tools for shape keys and expressions."""

import bpy
import json as json_mod
from ...utils.bpy_helpers import get_object


def _get_char_mesh(params):
    name = params.get("character", params.get("name", ""))
    if name:
        return get_object(name)
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and obj.data.shape_keys:
            return obj
    raise ValueError("No character mesh found")


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


def get_routes():
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
