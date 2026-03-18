"""BL Grease Pencil Handler - 8 tools for grease pencil operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only


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


def get_routes():
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
