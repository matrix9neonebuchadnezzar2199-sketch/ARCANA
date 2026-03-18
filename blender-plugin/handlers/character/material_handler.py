"""Character Material Handler - 8 tools for skin, makeup, tattoo, etc."""

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
    obj = _get_char_mesh(params)
    preset = params.get("preset", "")
    color = params.get("color")
    presets = {
        "fair": {"r": 0.95, "g": 0.87, "b": 0.8},
        "light": {"r": 0.9, "g": 0.78, "b": 0.65},
        "medium": {"r": 0.76, "g": 0.6, "b": 0.45},
        "olive": {"r": 0.68, "g": 0.55, "b": 0.38},
        "tan": {"r": 0.6, "g": 0.45, "b": 0.3},
        "brown": {"r": 0.45, "g": 0.3, "b": 0.2},
        "dark": {"r": 0.3, "g": 0.2, "b": 0.13},
        "deep": {"r": 0.2, "g": 0.12, "b": 0.08},
    }
    final = presets.get(preset, color or presets["light"])
    mat = _get_or_create_skin_mat(obj)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (final["r"], final["g"], final["b"], 1.0)
        bsdf.inputs["Subsurface"].default_value = 0.15
    return {"character": obj.name, "skinColor": final}


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


def get_routes():
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
