"""BL VSE Handler - 6 tools for Video Sequence Editor operations."""

import bpy


def _ensure_vse():
    scene = bpy.context.scene
    if not scene.sequence_editor:
        scene.sequence_editor_create()
    return scene.sequence_editor


def bl_vse_add_strip(params):
    se = _ensure_vse()
    strip_type = params.get("type", "IMAGE").upper()
    channel = params.get("channel", 1)
    start = params.get("start", 1)
    path = params.get("path", "")

    if strip_type == "IMAGE" and path:
        strip = se.sequences.new_image(
            name=params.get("name", "Image"),
            filepath=path,
            channel=channel,
            frame_start=start,
        )
    elif strip_type == "MOVIE" and path:
        strip = se.sequences.new_movie(
            name=params.get("name", "Movie"),
            filepath=path,
            channel=channel,
            frame_start=start,
        )
    elif strip_type == "SOUND" and path:
        strip = se.sequences.new_sound(
            name=params.get("name", "Sound"),
            filepath=path,
            channel=channel,
            frame_start=start,
        )
    elif strip_type == "COLOR":
        strip = se.sequences.new_effect(
            name=params.get("name", "Color"),
            type='COLOR',
            channel=channel,
            frame_start=start,
            frame_end=params.get("end", start + 100),
        )
        c = params.get("color", {"r": 0, "g": 0, "b": 0})
        strip.color = (c.get("r", 0), c.get("g", 0), c.get("b", 0))
    else:
        raise ValueError(f"Unsupported strip type or missing path: {strip_type}")

    return {"strip": strip.name, "type": strip_type, "channel": channel, "start": start}


def bl_vse_cut(params):
    se = _ensure_vse()
    strip_name = params.get("strip")
    frame = params.get("frame", bpy.context.scene.frame_current)
    strip = se.sequences.get(strip_name)
    if not strip:
        raise ValueError(f"Strip not found: {strip_name}")
    # Select only this strip
    for s in se.sequences:
        s.select = False
    strip.select = True
    se.active_strip = strip
    bpy.context.scene.frame_set(frame)
    bpy.ops.sequencer.cut(frame=frame, type='SOFT')
    return {"cut_at": frame, "strip": strip_name}


def bl_vse_move(params):
    se = _ensure_vse()
    strip = se.sequences.get(params["strip"])
    if not strip:
        raise ValueError(f"Strip not found: {params['strip']}")
    channel = params.get("channel")
    offset = params.get("offset", 0)
    if channel is not None:
        strip.channel = channel
    strip.frame_start += offset
    return {"strip": strip.name, "channel": strip.channel, "start": strip.frame_start}


def bl_vse_set_speed(params):
    se = _ensure_vse()
    strip = se.sequences.get(params["strip"])
    if not strip:
        raise ValueError(f"Strip not found: {params['strip']}")
    speed = params.get("speed", 1.0)
    # Create speed effect
    for s in se.sequences:
        s.select = False
    strip.select = True
    effect = se.sequences.new_effect(
        name="Speed",
        type='SPEED',
        channel=strip.channel + 1,
        frame_start=strip.frame_start,
        frame_end=strip.frame_final_end,
        seq1=strip,
    )
    effect.speed_factor = speed
    return {"strip": strip.name, "speed": speed}


def bl_vse_add_effect(params):
    se = _ensure_vse()
    effect_type = params.get("type", "CROSS").upper()
    channel = params.get("channel", 3)
    start = params.get("start", 1)
    end = params.get("end", start + 30)
    strip1_name = params.get("strip1")
    strip2_name = params.get("strip2")

    kwargs = {
        "name": params.get("name", effect_type),
        "type": effect_type,
        "channel": channel,
        "frame_start": start,
        "frame_end": end,
    }
    if strip1_name:
        kwargs["seq1"] = se.sequences.get(strip1_name)
    if strip2_name:
        kwargs["seq2"] = se.sequences.get(strip2_name)

    effect = se.sequences.new_effect(**kwargs)
    return {"effect": effect.name, "type": effect_type}


def bl_vse_render(params):
    scene = bpy.context.scene
    output = params.get("output", "//render/video")
    fmt = params.get("format", "FFMPEG")
    scene.render.filepath = output
    scene.render.image_settings.file_format = fmt
    if fmt == "FFMPEG":
        scene.render.ffmpeg.format = params.get("container", "MPEG4")
        scene.render.ffmpeg.codec = params.get("codec", "H264")
    bpy.ops.render.render(animation=True)
    return {"rendered": True, "output": output, "format": fmt}


def get_routes():
    return {
        "bl_vse_add_strip": bl_vse_add_strip,
        "bl_vse_cut": bl_vse_cut,
        "bl_vse_move": bl_vse_move,
        "bl_vse_set_speed": bl_vse_set_speed,
        "bl_vse_add_effect": bl_vse_add_effect,
        "bl_vse_render": bl_vse_render,
    }
