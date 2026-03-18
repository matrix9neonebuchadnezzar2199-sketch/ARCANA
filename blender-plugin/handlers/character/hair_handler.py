"""Character Hair Handler - 10 tools for hair style/color/physics."""

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


def bl_char_set_hair_style(params):
    obj = _get_char_mesh(params)
    style = params.get("style", "straight")
    obj["arcana_hair_style"] = style
    return {"character": obj.name, "hairStyle": style}


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


def get_routes():
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
