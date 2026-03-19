// phase-a-patch.js — Phase A: Replace cube-based character creation with Blender Studio base meshes
const fs = require('fs');
const path = require('path');

const ADDON_PATH = path.join(__dirname, 'addon.py');
let addon = fs.readFileSync(ADDON_PATH, 'utf8');

// ============================================================
// 1. Find bl_char_create_base function and replace it entirely
// ============================================================
const OLD_CREATE_BASE_RE = /def bl_char_create_base\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_CREATE_BASE = `def bl_char_create_base(params):
    """Create character base body from Blender Studio Human Base Meshes (CC0)."""
    import mathutils
    gender = params.get("gender", "male")
    style = params.get("style", "realistic")

    # Resolve .blend asset path relative to addon file
    addon_dir = os.path.dirname(os.path.realpath(__file__))
    blend_path = os.path.join(
        addon_dir, "assets", "human-base-meshes",
        "human-base-meshes-bundle-v1.4.1",
        "human_base_meshes_bundle.blend"
    )
    if not os.path.exists(blend_path):
        return {"success": False, "message": f"Base mesh file not found: {blend_path}"}

    # Map gender+style to object name
    mesh_map = {
        ("male", "realistic"): "GEO-body_male_realistic",
        ("female", "realistic"): "GEO-body_female_realistic",
        ("male", "stylized"): "GEO-body_male_stylized",
        ("male", "anime"): "GEO-body_male_stylized",
        ("female", "stylized"): "GEO-body_female_stylized",
        ("female", "anime"): "GEO-body_female_stylized",
    }
    src_name = mesh_map.get((gender, style))
    if not src_name:
        src_name = mesh_map.get((gender, "realistic"), "GEO-body_male_realistic")

    # Append object + children from .blend
    appended_objects = []
    with bpy.data.libraries.load(blend_path, link=False) as (data_from, data_to):
        # Find the main object and its eye children
        names_to_load = [n for n in data_from.objects if n == src_name or n.startswith(src_name + ".")]
        data_to.objects = names_to_load

    for obj in data_to.objects:
        if obj is not None:
            bpy.context.collection.objects.link(obj)
            appended_objects.append(obj.name)

    # Find main body object
    main_obj = bpy.data.objects.get(src_name)
    if main_obj is None:
        return {"success": False, "message": f"Failed to append {src_name}"}

    # Rename to user-friendly name
    char_name = params.get("name", f"Character_{gender}_{style}")
    main_obj.name = char_name

    # Re-parent eyes
    for obj_name in appended_objects:
        obj = bpy.data.objects.get(obj_name)
        if obj and obj != main_obj:
            obj.parent = main_obj

    # Select and make active
    bpy.ops.object.select_all(action='DESELECT')
    main_obj.select_set(True)
    bpy.context.view_layer.objects.active = main_obj

    # Generate Shape Keys for body customization
    _arcana_generate_body_shapekeys(main_obj)

    # Store metadata
    main_obj["arcana_gender"] = gender
    main_obj["arcana_style"] = style
    main_obj["arcana_type"] = "character"

    # Assign default skin material
    _arcana_ensure_skin_material(main_obj, gender)

    vert_count = len(main_obj.data.vertices)
    sk_count = len(main_obj.data.shape_keys.key_blocks) - 1 if main_obj.data.shape_keys else 0

    return {
        "success": True,
        "name": main_obj.name,
        "gender": gender,
        "style": style,
        "vertices": vert_count,
        "shapeKeys": sk_count,
        "objects": appended_objects,
        "message": f"Character '{main_obj.name}' created with {vert_count} vertices and {sk_count} shape keys"
    }

`;

// ============================================================
// 2. Helper: _arcana_generate_body_shapekeys
//    Creates shape keys by programmatically displacing vertices
// ============================================================
const SHAPEKEY_HELPER = `
def _arcana_generate_body_shapekeys(obj):
    """Generate body-customization shape keys on the given mesh object."""
    import mathutils

    mesh = obj.data
    # Add Basis if not present
    if not mesh.shape_keys:
        obj.shape_key_add(name="Basis", from_mix=False)

    basis = mesh.shape_keys.key_blocks["Basis"]
    verts = mesh.vertices

    # Compute bounding box for normalized offsets
    xs = [v.co.x for v in verts]
    ys = [v.co.y for v in verts]
    zs = [v.co.z for v in verts]
    min_z, max_z = min(zs), max(zs)
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    height = max_z - min_z if max_z - min_z > 0.001 else 1.0
    width = max_x - min_x if max_x - min_x > 0.001 else 1.0
    mid_z = (min_z + max_z) / 2.0
    head_z = min_z + height * 0.85

    # --- Height ---
    sk = obj.shape_key_add(name="Height", from_mix=False)
    for i, v in enumerate(verts):
        sk.data[i].co = v.co * 1.1  # 10% taller at full value
    sk.value = 0.0

    # --- HeadSize ---
    sk = obj.shape_key_add(name="HeadSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz > 0.82:
            factor = (nz - 0.82) / 0.18
            offset = (v.co - mathutils.Vector((0, 0, v.co.z))) * 0.15 * factor
            sk.data[i].co = v.co + offset
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ShoulderWidth ---
    sk = obj.shape_key_add(name="ShoulderWidth", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.55 < nz < 0.85:
            factor = 1.0 - abs(nz - 0.7) / 0.15
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.12 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ChestSize ---
    sk = obj.shape_key_add(name="ChestSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.50 < nz < 0.75:
            factor = 1.0 - abs(nz - 0.62) / 0.12
            factor = max(0, min(1, factor))
            radial = mathutils.Vector((v.co.x, v.co.y, 0)).normalized()
            sk.data[i].co = v.co + radial * 0.04 * factor
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- WaistSize ---
    sk = obj.shape_key_add(name="WaistSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.38 < nz < 0.55:
            factor = 1.0 - abs(nz - 0.46) / 0.08
            factor = max(0, min(1, factor))
            radial = mathutils.Vector((v.co.x, v.co.y, 0)).normalized()
            sk.data[i].co = v.co + radial * 0.04 * factor
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- HipSize ---
    sk = obj.shape_key_add(name="HipSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.30 < nz < 0.48:
            factor = 1.0 - abs(nz - 0.38) / 0.08
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.1 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- Muscle ---
    sk = obj.shape_key_add(name="Muscle", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.15 < nz < 0.85:
            radial = mathutils.Vector((v.co.x, v.co.y, 0))
            dist = radial.length
            if dist > 0.01:
                sk.data[i].co = v.co + radial.normalized() * 0.025
            else:
                sk.data[i].co = v.co.copy()
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- BodyFat ---
    sk = obj.shape_key_add(name="BodyFat", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.10 < nz < 0.80:
            belly_factor = 1.0 - abs(nz - 0.45) / 0.35
            belly_factor = max(0, min(1, belly_factor))
            radial = mathutils.Vector((v.co.x, v.co.y, 0))
            dist = radial.length
            if dist > 0.01:
                sk.data[i].co = v.co + radial.normalized() * 0.05 * belly_factor
            else:
                sk.data[i].co = v.co.copy()
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ArmLength ---
    sk = obj.shape_key_add(name="ArmLength", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        nx = abs(v.co.x) / (width / 2) if width > 0.001 else 0
        if 0.40 < nz < 0.80 and nx > 0.35:
            arm_factor = (nx - 0.35) / 0.65
            arm_factor = min(1, arm_factor)
            direction = 1.0 if v.co.x > 0 else -1.0
            sk.data[i].co = v.co + mathutils.Vector((direction * 0.05 * arm_factor, 0, -0.02 * arm_factor))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- LegLength ---
    sk = obj.shape_key_add(name="LegLength", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz < 0.45:
            leg_factor = (0.45 - nz) / 0.45
            sk.data[i].co = v.co + mathutils.Vector((0, 0, -0.08 * leg_factor))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- EyeSize ---
    sk = obj.shape_key_add(name="EyeSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz > 0.88 and abs(v.co.x) > 0.01 and v.co.y < -0.02:
            factor = (nz - 0.88) / 0.06
            factor = min(1, max(0, factor))
            radial = mathutils.Vector((v.co.x, v.co.y + 0.05, 0)).normalized()
            sk.data[i].co = v.co + radial * 0.008 * factor
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- NoseSize ---
    sk = obj.shape_key_add(name="NoseSize", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.85 < nz < 0.93 and abs(v.co.x) < 0.03 and v.co.y < -0.05:
            factor = 1.0 - abs(nz - 0.89) / 0.04
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((0, -0.01 * factor, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- MouthWidth ---
    sk = obj.shape_key_add(name="MouthWidth", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.82 < nz < 0.87 and v.co.y < -0.03:
            factor = 1.0 - abs(nz - 0.845) / 0.025
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.15 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- JawWidth ---
    sk = obj.shape_key_add(name="JawWidth", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if 0.78 < nz < 0.86:
            factor = 1.0 - abs(nz - 0.82) / 0.04
            factor = max(0, min(1, factor))
            sk.data[i].co = v.co + mathutils.Vector((v.co.x * 0.1 * factor, 0, 0))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0

    # --- ForeheadHeight ---
    sk = obj.shape_key_add(name="ForeheadHeight", from_mix=False)
    for i, v in enumerate(verts):
        nz = (v.co.z - min_z) / height
        if nz > 0.92:
            factor = (nz - 0.92) / 0.08
            sk.data[i].co = v.co + mathutils.Vector((0, 0, 0.02 * factor))
        else:
            sk.data[i].co = v.co.copy()
    sk.value = 0.0


def _arcana_ensure_skin_material(obj, gender="male"):
    """Create and assign a default skin material with Principled BSDF."""
    mat_name = f"ARCANA_Skin_{gender}"
    mat = bpy.data.materials.get(mat_name)
    if mat is None:
        mat = bpy.data.materials.new(name=mat_name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF") or mat.node_tree.nodes.get("プリンシプルBSDF")
        if bsdf:
            # Default skin tones
            if gender == "female":
                bsdf.inputs["Base Color"].default_value = (0.87, 0.72, 0.62, 1.0)
            else:
                bsdf.inputs["Base Color"].default_value = (0.78, 0.61, 0.48, 1.0)
            bsdf.inputs["Roughness"].default_value = 0.55
            # Subsurface
            try:
                bsdf.inputs["Subsurface Weight"].default_value = 0.3
                bsdf.inputs["Subsurface Radius"].default_value = (0.8, 0.4, 0.25)
            except Exception:
                try:
                    bsdf.inputs["Subsurface"].default_value = 0.3
                except Exception:
                    pass
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

`;

// ============================================================
// 3. Replace bl_char_set_height to work with new shape keys
// ============================================================
const OLD_SET_HEIGHT_RE = /def bl_char_set_height\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_HEIGHT = `def bl_char_set_height(params):
    """Set character height in cm. Uses scale + Height shape key."""
    name = params.get("name") or params.get("target")
    height_cm = params.get("height", 170)

    obj = None
    if name:
        obj = bpy.data.objects.get(name)
    if obj is None:
        for o in bpy.data.objects:
            if o.get("arcana_type") == "character":
                obj = o
                break
    if obj is None:
        return {"success": False, "message": "Character not found"}

    # Base height reference: realistic meshes are ~1.75m tall at scale 1
    base_height = 175.0
    scale_factor = height_cm / base_height
    obj.scale = (scale_factor, scale_factor, scale_factor)

    # Also set Height shape key proportionally
    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("Height")
        if sk:
            sk.value = max(0.0, min(1.0, (height_cm - 150) / 50.0))

    return {
        "success": True,
        "name": obj.name,
        "height": height_cm,
        "scale": round(scale_factor, 5),
        "message": f"Height set to {height_cm}cm (scale {scale_factor:.3f})"
    }

`;

// ============================================================
// 4. Replace bl_char_set_proportions
// ============================================================
const OLD_SET_PROPORTIONS_RE = /def bl_char_set_proportions\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_PROPORTIONS = `def bl_char_set_proportions(params):
    """Set body proportions via shape keys: ShoulderWidth, ChestSize, WaistSize, HipSize."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    mapping = {
        "shoulderWidth": "ShoulderWidth",
        "chestSize": "ChestSize",
        "waistSize": "WaistSize",
        "hipSize": "HipSize",
    }
    result = {}
    if obj.data.shape_keys:
        for param_key, sk_name in mapping.items():
            val = params.get(param_key)
            if val is not None:
                sk = obj.data.shape_keys.key_blocks.get(sk_name)
                if sk:
                    sk.value = max(0.0, min(1.0, float(val)))
                    result[param_key] = sk.value

    return {"success": True, "name": obj.name, "proportions": result}

`;

// ============================================================
// 5. Replace bl_char_set_muscle
// ============================================================
const OLD_SET_MUSCLE_RE = /def bl_char_set_muscle\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_MUSCLE = `def bl_char_set_muscle(params):
    """Set muscle definition via Muscle shape key (0-1)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    value = max(0.0, min(1.0, float(params.get("muscle", params.get("value", 0.5)))))

    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("Muscle")
        if sk:
            sk.value = value

    return {"success": True, "name": obj.name, "muscle": value}

`;

// ============================================================
// 6. Replace bl_char_set_body_fat
// ============================================================
const OLD_SET_BODY_FAT_RE = /def bl_char_set_body_fat\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_BODY_FAT = `def bl_char_set_body_fat(params):
    """Set body fat via BodyFat shape key (0-1)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    value = max(0.0, min(1.0, float(params.get("bodyFat", params.get("value", 0.3)))))

    if obj.data.shape_keys:
        sk = obj.data.shape_keys.key_blocks.get("BodyFat")
        if sk:
            sk.value = value

    return {"success": True, "name": obj.name, "bodyFat": value}

`;

// ============================================================
// 7. Replace bl_char_set_limb_length
// ============================================================
const OLD_SET_LIMB_RE = /def bl_char_set_limb_length\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_LIMB = `def bl_char_set_limb_length(params):
    """Set arm and leg length via ArmLength/LegLength shape keys (0-1)."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    result = {}
    if obj.data.shape_keys:
        arm = params.get("armLength")
        if arm is not None:
            sk = obj.data.shape_keys.key_blocks.get("ArmLength")
            if sk:
                sk.value = max(0.0, min(1.0, float(arm)))
                result["armLength"] = sk.value
        leg = params.get("legLength")
        if leg is not None:
            sk = obj.data.shape_keys.key_blocks.get("LegLength")
            if sk:
                sk.value = max(0.0, min(1.0, float(leg)))
                result["legLength"] = sk.value

    return {"success": True, "name": obj.name, "limbs": result}

`;

// ============================================================
// 8. Replace bl_char_set_eye_shape
// ============================================================
const OLD_SET_EYE_RE = /def bl_char_set_eye_shape\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_EYE = `def bl_char_set_eye_shape(params):
    """Set eye shape via EyeSize shape key."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    result = {}
    if obj.data.shape_keys:
        for param_key, sk_name in [("eyeSize", "EyeSize")]:
            val = params.get(param_key)
            if val is not None:
                sk = obj.data.shape_keys.key_blocks.get(sk_name)
                if sk:
                    sk.value = max(0.0, min(1.0, float(val)))
                    result[param_key] = sk.value

    return {"success": True, "name": obj.name, "eyes": result}

`;

// ============================================================
// 9. Replace bl_char_set_skin_color (already partially works, improve it)
// ============================================================
const OLD_SET_SKIN_RE = /def bl_char_set_skin_color\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_SKIN = `def bl_char_set_skin_color(params):
    """Set skin color by preset name or custom RGB. Updates Principled BSDF Base Color."""
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    presets = {
        "fair":   (0.94, 0.82, 0.74, 1.0),
        "light":  (0.87, 0.72, 0.62, 1.0),
        "medium": (0.78, 0.61, 0.48, 1.0),
        "olive":  (0.68, 0.52, 0.38, 1.0),
        "tan":    (0.59, 0.42, 0.30, 1.0),
        "brown":  (0.45, 0.30, 0.20, 1.0),
        "dark":   (0.32, 0.20, 0.13, 1.0),
        "deep":   (0.22, 0.13, 0.08, 1.0),
    }

    preset = params.get("preset", "").lower()
    if preset in presets:
        color = presets[preset]
    else:
        r = float(params.get("r", 0.78))
        g = float(params.get("g", 0.61))
        b = float(params.get("b", 0.48))
        color = (r, g, b, 1.0)

    # Apply to all materials on the object
    for mat_slot in obj.material_slots:
        mat = mat_slot.material
        if mat and mat.use_nodes:
            for node in mat.node_tree.nodes:
                if node.type == 'BSDF_PRINCIPLED':
                    node.inputs["Base Color"].default_value = color
                    try:
                        node.inputs["Subsurface Radius"].default_value = (color[0]*0.9, color[1]*0.6, color[2]*0.4)
                    except Exception:
                        pass

    return {"success": True, "name": obj.name, "color": list(color[:3]), "preset": preset or "custom"}

`;

// ============================================================
// 10. Replace bl_char_set_hair_style with actual mesh generation
// ============================================================
const OLD_SET_HAIR_STYLE_RE = /def bl_char_set_hair_style\(params\):[\s\S]*?(?=\ndef bl_char_)/;
const NEW_SET_HAIR_STYLE = `def bl_char_set_hair_style(params):
    """Set hair style. Creates a basic hair mesh on the character's head."""
    import math
    name = params.get("name") or params.get("target")
    obj = _arcana_find_character(name)
    if obj is None:
        return {"success": False, "message": "Character not found"}

    style = params.get("hairStyle", params.get("style", "short"))
    color_hex = params.get("color", "#2B1B0E")

    # Remove existing hair
    for child in list(obj.children):
        if child.get("arcana_part") == "hair":
            bpy.data.objects.remove(child, do_unlink=True)

    # Get head top position from bounding box
    bbox = [obj.matrix_world @ mathutils.Vector(c) for c in obj.bound_box]
    top_z = max(v.z for v in bbox)
    center_x = sum(v.x for v in bbox) / 8
    center_y = sum(v.y for v in bbox) / 8

    # Hair length based on style
    length_map = {
        "buzz": 0.02, "short": 0.06, "medium": 0.15,
        "long": 0.30, "very_long": 0.50, "ponytail": 0.35,
        "bob": 0.12, "pixie": 0.08, "mohawk": 0.12,
    }
    length = length_map.get(style, 0.15)

    # Create hair cap mesh (hemisphere)
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.105,
        segments=24, ring_count=12,
        location=(center_x, center_y, top_z - 0.02)
    )
    hair_obj = bpy.context.active_object
    hair_obj.name = f"{obj.name}_Hair"
    hair_obj["arcana_part"] = "hair"
    hair_obj["arcana_hair_style"] = style

    # Remove bottom half
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')
    mesh = hair_obj.data
    for v in mesh.vertices:
        if v.co.z < -0.01:
            v.select = True
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.delete(type='VERT')
    bpy.ops.object.mode_set(mode='OBJECT')

    # Scale for style
    if style in ("long", "very_long"):
        hair_obj.scale.z = 1.0 + length * 2
        hair_obj.scale.x = 1.05
        hair_obj.scale.y = 1.05
    elif style == "mohawk":
        hair_obj.scale.z = 2.0
        hair_obj.scale.x = 0.3
    elif style == "ponytail":
        hair_obj.scale.y = 1.5

    # Parent to character
    hair_obj.parent = obj

    # Hair material
    mat = bpy.data.materials.new(name=f"ARCANA_Hair_{obj.name}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF") or mat.node_tree.nodes.get("プリンシプルBSDF")
    if bsdf:
        # Parse hex color
        hex_c = color_hex.lstrip('#')
        if len(hex_c) == 6:
            r, g, b = int(hex_c[0:2],16)/255, int(hex_c[2:4],16)/255, int(hex_c[4:6],16)/255
        else:
            r, g, b = 0.17, 0.11, 0.05
        bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
        bsdf.inputs["Roughness"].default_value = 0.45
    hair_obj.data.materials.append(mat)

    # Smooth shading
    for poly in hair_obj.data.polygons:
        poly.use_smooth = True

    return {
        "success": True,
        "name": obj.name,
        "hairObject": hair_obj.name,
        "style": style,
        "color": color_hex,
        "message": f"Hair style '{style}' applied to {obj.name}"
    }

`;

// ============================================================
// 11. Add _arcana_find_character helper function
// ============================================================
const FIND_CHARACTER_HELPER = `
def _arcana_find_character(name=None):
    """Find a character object by name or by arcana_type metadata."""
    if name:
        obj = bpy.data.objects.get(name)
        if obj:
            return obj
    # Fallback: find first character
    for o in bpy.data.objects:
        if o.get("arcana_type") == "character":
            return o
    return None

`;


// ============================================================
// APPLY ALL PATCHES
// ============================================================

console.log("Patching addon.py...");
let patchCount = 0;

// Insert helper functions before the first bl_char_ function
const firstCharFunc = addon.indexOf("def bl_char_create_base(");
if (firstCharFunc < 0) {
    console.error("ERROR: Could not find bl_char_create_base in addon.py");
    process.exit(1);
}

// Insert helpers just before bl_char_create_base
addon = addon.slice(0, firstCharFunc) + FIND_CHARACTER_HELPER + SHAPEKEY_HELPER + addon.slice(firstCharFunc);
console.log("[1] Inserted _arcana_find_character and _arcana_generate_body_shapekeys helpers");
patchCount++;

// Now replace each function
const replacements = [
    [OLD_CREATE_BASE_RE, NEW_CREATE_BASE, "bl_char_create_base"],
    [OLD_SET_HEIGHT_RE, NEW_SET_HEIGHT, "bl_char_set_height"],
    [OLD_SET_PROPORTIONS_RE, NEW_SET_PROPORTIONS, "bl_char_set_proportions"],
    [OLD_SET_MUSCLE_RE, NEW_SET_MUSCLE, "bl_char_set_muscle"],
    [OLD_SET_BODY_FAT_RE, NEW_SET_BODY_FAT, "bl_char_set_body_fat"],
    [OLD_SET_LIMB_RE, NEW_SET_LIMB, "bl_char_set_limb_length"],
    [OLD_SET_EYE_RE, NEW_SET_EYE, "bl_char_set_eye_shape"],
    [OLD_SET_SKIN_RE, NEW_SET_SKIN, "bl_char_set_skin_color"],
    [OLD_SET_HAIR_STYLE_RE, NEW_SET_HAIR_STYLE, "bl_char_set_hair_style"],
];

for (const [regex, replacement, name] of replacements) {
    if (regex.test(addon)) {
        addon = addon.replace(regex, replacement);
        console.log(`[${++patchCount}] Replaced ${name}`);
    } else {
        console.warn(`[WARN] Could not find ${name} - skipping`);
    }
}

// Add 'import os' at top if not present
if (!addon.includes("import os\n") && !addon.includes("import os\r\n")) {
    addon = "import os\n" + addon;
    console.log(`[${++patchCount}] Added 'import os' to top`);
}

// Ensure 'import mathutils' is available (Blender provides it, but add a comment)
if (!addon.includes("import mathutils")) {
    // mathutils is available inside Blender, no need for top-level import
    // The functions import it locally
    console.log("[INFO] mathutils imported locally in functions (Blender built-in)");
}

// Write patched file
fs.writeFileSync(ADDON_PATH, addon, 'utf8');
console.log(`\n[OK] addon.py patched with ${patchCount} changes`);
console.log("File size: " + (fs.statSync(ADDON_PATH).size / 1024).toFixed(1) + " KB");
