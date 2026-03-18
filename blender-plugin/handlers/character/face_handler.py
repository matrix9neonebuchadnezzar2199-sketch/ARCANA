"""Character Face Handler - 15 tools for facial feature manipulation."""

import bpy
from ...utils.bpy_helpers import get_object


def _get_char_mesh(params):
    name = params.get("character", params.get("name", ""))
    if name:
        return get_object(name)
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and obj.data.shape_keys:
            return obj
    raise ValueError("No character mesh found")


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
    obj = _get_char_mesh(params)
    size = params.get("size", 0.5)
    spacing = params.get("spacing", 0.5)
    angle = params.get("angle", 0.5)
    height = params.get("height", 0.5)
    _set_sk(obj, "EyeSize", size)
    _set_sk(obj, "EyeSpacing", spacing)
    _set_sk(obj, "EyeAngle", angle)
    _set_sk(obj, "EyeHeight", height)
    return {"character": obj.name, "eyes": {"size": size, "spacing": spacing, "angle": angle, "height": height}}


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


def get_routes():
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
