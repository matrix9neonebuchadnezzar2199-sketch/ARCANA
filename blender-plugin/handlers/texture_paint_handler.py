"""BL Texture Paint Handler - 5 tools for texture painting."""

import bpy
from ..utils.bpy_helpers import get_object, select_only, ensure_mode


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


def get_routes():
    return {
        "bl_texpaint_enable": bl_texpaint_enable,
        "bl_texpaint_set_brush": bl_texpaint_set_brush,
        "bl_texpaint_set_color": bl_texpaint_set_color,
        "bl_texpaint_create_slot": bl_texpaint_create_slot,
        "bl_texpaint_save": bl_texpaint_save,
    }
