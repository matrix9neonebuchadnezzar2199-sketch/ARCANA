"""BL Material Handler - 8 tools for material operations."""

import bpy
from ..utils.bpy_helpers import get_object


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


def get_routes():
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
