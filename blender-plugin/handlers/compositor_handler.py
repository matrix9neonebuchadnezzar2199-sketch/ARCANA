"""BL Compositor Handler - 7 tools for compositor node operations."""

import bpy


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


def get_routes():
    return {
        "bl_comp_enable": bl_comp_enable,
        "bl_comp_add_node": bl_comp_add_node,
        "bl_comp_connect": bl_comp_connect,
        "bl_comp_set_value": bl_comp_set_value,
        "bl_comp_add_filter": bl_comp_add_filter,
        "bl_comp_set_mix": bl_comp_set_mix,
        "bl_comp_list_nodes": bl_comp_list_nodes,
    }
