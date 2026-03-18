"""BL Geometry Nodes Handler - 10 tools for geometry node operations."""

import bpy
from ..utils.bpy_helpers import get_object, select_only


def bl_geonodes_create_tree(params):
    name = params.get("name", "GeometryNodes")
    tree = bpy.data.node_groups.new(name=name, type='GeometryNodeTree')
    # Add default input/output
    tree.inputs.new('NodeSocketGeometry', "Geometry")
    tree.outputs.new('NodeSocketGeometry', "Geometry")
    input_node = tree.nodes.new('NodeGroupInput')
    output_node = tree.nodes.new('NodeGroupOutput')
    input_node.location = (-300, 0)
    output_node.location = (300, 0)
    tree.links.new(input_node.outputs[0], output_node.inputs[0])
    return {"name": tree.name}


def bl_geonodes_add_node(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    node_type = params.get("type", "GeometryNodeMeshCube")
    node = tree.nodes.new(type=node_type)
    loc = params.get("location", [0, 0])
    node.location = loc
    name = params.get("name")
    if name:
        node.label = name
    return {"node": node.name, "type": node.bl_idname, "location": list(node.location)}


def bl_geonodes_connect(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    from_node = tree.nodes.get(params["fromNode"])
    to_node = tree.nodes.get(params["toNode"])
    if not from_node or not to_node:
        raise ValueError("Node not found")
    from_idx = params.get("fromOutput", 0)
    to_idx = params.get("toInput", 0)
    tree.links.new(from_node.outputs[from_idx], to_node.inputs[to_idx])
    return {"linked": True}


def bl_geonodes_set_value(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
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


def bl_geonodes_add_group_input(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    socket_type = params.get("socketType", "NodeSocketFloat")
    name = params.get("inputName", "Value")
    tree.inputs.new(socket_type, name)
    return {"tree": tree.name, "input": name, "type": socket_type}


def bl_geonodes_add_group_output(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    socket_type = params.get("socketType", "NodeSocketFloat")
    name = params.get("outputName", "Result")
    tree.outputs.new(socket_type, name)
    return {"tree": tree.name, "output": name, "type": socket_type}


def bl_geonodes_assign(params):
    obj = get_object(params["object"])
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    mod = None
    for m in obj.modifiers:
        if m.type == 'NODES':
            mod = m
            break
    if not mod:
        mod = obj.modifiers.new(name="GeometryNodes", type='NODES')
    mod.node_group = tree
    return {"object": obj.name, "tree": tree.name}


def bl_geonodes_list_nodes(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    nodes = [{"name": n.name, "type": n.bl_idname, "location": list(n.location)} for n in tree.nodes]
    return {"tree": tree.name, "nodes": nodes, "count": len(nodes)}


def bl_geonodes_remove_node(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    node_name = params["node"]
    node = tree.nodes.get(node_name)
    if not node:
        raise ValueError(f"Node not found: {node_name}")
    tree.nodes.remove(node)
    return {"tree": tree.name, "removed": node_name}


def bl_geonodes_duplicate(params):
    tree_name = params["tree"]
    tree = bpy.data.node_groups.get(tree_name)
    if not tree:
        raise ValueError(f"Node tree not found: {tree_name}")
    new_tree = tree.copy()
    new_name = params.get("newName")
    if new_name:
        new_tree.name = new_name
    return {"original": tree.name, "copy": new_tree.name}


def get_routes():
    return {
        "bl_geonodes_create_tree": bl_geonodes_create_tree,
        "bl_geonodes_add_node": bl_geonodes_add_node,
        "bl_geonodes_connect": bl_geonodes_connect,
        "bl_geonodes_set_value": bl_geonodes_set_value,
        "bl_geonodes_add_group_input": bl_geonodes_add_group_input,
        "bl_geonodes_add_group_output": bl_geonodes_add_group_output,
        "bl_geonodes_assign": bl_geonodes_assign,
        "bl_geonodes_list_nodes": bl_geonodes_list_nodes,
        "bl_geonodes_remove_node": bl_geonodes_remove_node,
        "bl_geonodes_duplicate": bl_geonodes_duplicate,
    }
