"""BL Render Handler - 10 tools for render settings."""

import bpy


def bl_render_set_engine(params):
    engine = params.get("engine", "CYCLES").upper()
    if engine in ("CYCLES", "BLENDER_EEVEE", "BLENDER_EEVEE_NEXT", "BLENDER_WORKBENCH"):
        bpy.context.scene.render.engine = engine
    return {"engine": bpy.context.scene.render.engine}


def bl_render_set_resolution(params):
    scene = bpy.context.scene
    scene.render.resolution_x = params.get("width", 1920)
    scene.render.resolution_y = params.get("height", 1080)
    scene.render.resolution_percentage = params.get("percentage", 100)
    return {"width": scene.render.resolution_x, "height": scene.render.resolution_y}


def bl_render_set_samples(params):
    scene = bpy.context.scene
    samples = params.get("samples", 128)
    if scene.render.engine == 'CYCLES':
        scene.cycles.samples = samples
    else:
        scene.eevee.taa_render_samples = samples
    return {"samples": samples, "engine": scene.render.engine}


def bl_render_set_output(params):
    scene = bpy.context.scene
    scene.render.filepath = params.get("path", "//render/")
    fmt = params.get("format", "PNG").upper()
    scene.render.image_settings.file_format = fmt
    return {"path": scene.render.filepath, "format": fmt}


def bl_render_render(params):
    animation = params.get("animation", False)
    if animation:
        bpy.ops.render.render(animation=True)
    else:
        bpy.ops.render.render(write_still=True)
    return {"rendered": True, "animation": animation}


def bl_render_set_world_color(params):
    world = bpy.context.scene.world
    if not world:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    if not world.use_nodes:
        world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        c = params.get("color", {"r": 0.05, "g": 0.05, "b": 0.05})
        bg.inputs["Color"].default_value = (c["r"], c["g"], c["b"], 1.0)
        bg.inputs["Strength"].default_value = params.get("strength", 1.0)
    return {"color": params.get("color"), "strength": params.get("strength", 1.0)}


def bl_render_set_film(params):
    scene = bpy.context.scene
    if scene.render.engine == 'CYCLES':
        scene.render.film_transparent = params.get("transparent", False)
    scene.render.use_border = params.get("useBorder", False)
    return {"transparent": params.get("transparent", False)}


def bl_render_set_color_management(params):
    scene = bpy.context.scene
    scene.view_settings.view_transform = params.get("viewTransform", "Filmic")
    scene.view_settings.look = params.get("look", "None")
    scene.view_settings.exposure = params.get("exposure", 0.0)
    scene.view_settings.gamma = params.get("gamma", 1.0)
    return {"viewTransform": scene.view_settings.view_transform}


def bl_render_set_denoising(params):
    scene = bpy.context.scene
    enable = params.get("enable", True)
    if scene.render.engine == 'CYCLES':
        scene.cycles.use_denoising = enable
        denoiser = params.get("denoiser", "OPENIMAGEDENOISE")
        scene.cycles.denoiser = denoiser
    return {"denoising": enable}


def bl_render_get_settings(params):
    scene = bpy.context.scene
    return {
        "engine": scene.render.engine,
        "resolution": [scene.render.resolution_x, scene.render.resolution_y],
        "samples": scene.cycles.samples if scene.render.engine == 'CYCLES' else 0,
        "outputPath": scene.render.filepath,
        "format": scene.render.image_settings.file_format,
    }


def get_routes():
    return {
        "bl_render_set_engine": bl_render_set_engine,
        "bl_render_set_resolution": bl_render_set_resolution,
        "bl_render_set_samples": bl_render_set_samples,
        "bl_render_set_output": bl_render_set_output,
        "bl_render_render": bl_render_render,
        "bl_render_set_world_color": bl_render_set_world_color,
        "bl_render_set_film": bl_render_set_film,
        "bl_render_set_color_management": bl_render_set_color_management,
        "bl_render_set_denoising": bl_render_set_denoising,
        "bl_render_get_settings": bl_render_get_settings,
    }
