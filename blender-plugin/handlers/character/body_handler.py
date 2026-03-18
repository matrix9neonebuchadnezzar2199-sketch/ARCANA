"""Character Body Handler - 12 tools for body shape manipulation via Shape Keys."""

import bpy
from ...utils.bpy_helpers import get_object, select_only


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


def bl_char_create_base(params):
    gender = params.get("gender", "female").lower()
    style = params.get("style", "anime").lower()
    bpy.ops.mesh.primitive_cube_add()
    obj = bpy.context.active_object
    obj.name = f"Character_{gender}_{style}"
    sk = obj.shape_key_add(name="Basis", from_mix=False)
    body_keys = [
        "Height", "HeadSize", "NeckLength", "ShoulderWidth", "ChestSize",
        "WaistSize", "HipSize", "ArmLength", "LegLength", "HandSize",
        "FootSize", "Muscle", "BodyFat", "TorsoLength",
    ]
    for key_name in body_keys:
        obj.shape_key_add(name=key_name, from_mix=False)
    return {"character": obj.name, "gender": gender, "style": style, "shapeKeys": len(obj.data.shape_keys.key_blocks)}


def bl_char_set_gender(params):
    obj = _get_char_mesh(params)
    gender = params.get("gender", "female")
    return {"character": obj.name, "gender": gender}


def bl_char_set_height(params):
    obj = _get_char_mesh(params)
    height_cm = params.get("height", 160)
    scale_factor = height_cm / 160.0
    obj.scale = (scale_factor, scale_factor, scale_factor)
    if obj.data.shape_keys:
        kb = obj.data.shape_keys.key_blocks.get("Height")
        if kb:
            kb.value = (height_cm - 140) / 60.0
    return {"character": obj.name, "height": height_cm, "scale": scale_factor}


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
    obj = _get_char_mesh(params)
    results = {}
    if obj.data.shape_keys:
        for key in ["ShoulderWidth", "ChestSize", "WaistSize", "HipSize"]:
            val = params.get(key[0].lower() + key[1:])
            if val is not None:
                kb = obj.data.shape_keys.key_blocks.get(key)
                if kb:
                    kb.value = max(0.0, min(1.0, val))
                    results[key] = kb.value
    return {"character": obj.name, "proportions": results}


def bl_char_set_muscle(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.5)
    if obj.data.shape_keys:
        kb = obj.data.shape_keys.key_blocks.get("Muscle")
        if kb:
            kb.value = max(0.0, min(1.0, value))
    return {"character": obj.name, "muscle": value}


def bl_char_set_body_fat(params):
    obj = _get_char_mesh(params)
    value = params.get("value", 0.3)
    if obj.data.shape_keys:
        kb = obj.data.shape_keys.key_blocks.get("BodyFat")
        if kb:
            kb.value = max(0.0, min(1.0, value))
    return {"character": obj.name, "bodyFat": value}


def bl_char_set_limb_length(params):
    obj = _get_char_mesh(params)
    results = {}
    if obj.data.shape_keys:
        for key in ["ArmLength", "LegLength"]:
            val = params.get(key[0].lower() + key[1:])
            if val is not None:
                kb = obj.data.shape_keys.key_blocks.get(key)
                if kb:
                    kb.value = max(0.0, min(1.0, val))
                    results[key] = kb.value
    return {"character": obj.name, "limbs": results}


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


def get_routes():
    return {
        "bl_char_create_base": bl_char_create_base,
        "bl_char_set_gender": bl_char_set_gender,
        "bl_char_set_height": bl_char_set_height,
        "bl_char_set_body_type": bl_char_set_body_type,
        "bl_char_set_style": bl_char_set_style,
        "bl_char_set_proportions": bl_char_set_proportions,
        "bl_char_set_muscle": bl_char_set_muscle,
        "bl_char_set_body_fat": bl_char_set_body_fat,
        "bl_char_set_limb_length": bl_char_set_limb_length,
        "bl_char_set_hand_size": bl_char_set_hand_size,
        "bl_char_set_neck": bl_char_set_neck,
        "bl_char_set_accessory_slot": bl_char_set_accessory_slot,
    }
