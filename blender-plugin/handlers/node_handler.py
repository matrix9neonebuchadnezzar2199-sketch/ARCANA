"""BL Node Handler - 10 tools for shader/compositor node operations."""

import bpy
from ..utils.bpy_helpers import get_object


def _get_node_tree(params):
    mat_name = params.get("material")
    if mat_name:
        mat = bpy.data.materials.get(mat_name)
        if not mat or not mat.use_nodes:
            raise ValueError(f"Material not found or no nodes: {mat_name}")
        return mat.node_tree
    tree_name = params.get("tree")
    if tree_name:
        tree = bpy.data.node_groups.get(tree_name)
        if not tree:
            raise ValueError(f"Node tree not found: {tree_name}")
        return tree
    raise ValueError("Specify 'material' or 'tree'")


def bl_node_add(params):
    tree = _get_node_tree(params)
    node_type = params.get("type", "ShaderNodeMath")
    node = tree.nodes.new(type=node_type)
    loc = params.get("location", [0, 0])
    node.location = loc
    name = params.get("name")
    if name:
        node.name = name
        node.label = name
    return {"node": node.name, "type": node.bl_idname, "location": list(node.location)}


def bl_node_connect(params):
    tree = _get_node_tree(params)
    from_node = tree.nodes.get(params["fromNode"])
    to_node = tree.nodes.get(params["toNode"])
    if not from_node or not to_node:
        raise ValueError("Source or target node not found")
    from_idx = params.get("fromOutput", 0)
    to_idx = params.get("toInput", 0)
    if isinstance(from_idx, str):
        from_socket = from_node.outputs[from_idx]
    else:
        from_socket = from_node.outputs[from_idx]
    if isinstance(to_idx, str):
        to_socket = to_node.inputs[to_idx]
    else:
        to_socket = to_node.inputs[to_idx]
    tree.links.new(from_socket, to_socket)
    return {"from": from_node.name, "to": to_node.name}


def bl_node_remove(params):
    tree = _get_node_tree(params)
    node_name = params["node"]
    node = tree.nodes.get(node_name)
    if not node:
        raise ValueError(f"Node not found: {node_name}")
    tree.nodes.remove(node)
    return {"removed": node_name}


def bl_node_set_value(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    input_name = params.get("input")
    value = params.get("value")
    if input_name and value is not None:
        inp = node.inputs.get(input_name)
        if inp:
            inp.default_value = value
    prop = params.get("property")
    prop_val = params.get("propertyValue")
    if prop and prop_val is not None:
        setattr(node, prop, prop_val)
    return {"node": node.name, "input": input_name, "value": value}


def bl_node_create_group(params):
    name = params.get("name", "NodeGroup")
    tree_type = params.get("treeType", "ShaderNodeTree")
    group = bpy.data.node_groups.new(name=name, type=tree_type)
    group.inputs.new('NodeSocketFloat', "Input")
    group.outputs.new('NodeSocketFloat', "Output")
    return {"name": group.name, "type": tree_type}


def bl_node_list(params):
    tree = _get_node_tree(params)
    nodes = [{"name": n.name, "type": n.bl_idname, "location": list(n.location), "muted": n.mute} for n in tree.nodes]
    return {"nodes": nodes, "count": len(nodes)}


def bl_node_link(params):
    return bl_node_connect(params)


def bl_node_set_location(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    loc = params.get("location", [0, 0])
    node.location = loc
    return {"node": node.name, "location": list(node.location)}


def bl_node_mute(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    mute = params.get("mute", True)
    node.mute = mute
    return {"node": node.name, "muted": mute}


def bl_node_duplicate(params):
    tree = _get_node_tree(params)
    node = tree.nodes.get(params["node"])
    if not node:
        raise ValueError(f"Node not found: {params['node']}")
    new_node = tree.nodes.new(type=node.bl_idname)
    new_node.location = (node.location[0] + 200, node.location[1])
    new_node.label = node.label + "_copy" if node.label else ""
    return {"original": node.name, "copy": new_node.name}


def get_routes():
    return {
        "bl_node_add": bl_node_add,
        "bl_node_connect": bl_node_connect,
        "bl_node_remove": bl_node_remove,
        "bl_node_set_value": bl_node_set_value,
        "bl_node_create_group": bl_node_create_group,
        "bl_node_list": bl_node_list,
        "bl_node_link": bl_node_link,
        "bl_node_set_location": bl_node_set_location,
        "bl_node_mute": bl_node_mute,
        "bl_node_duplicate": bl_node_duplicate,
    }
