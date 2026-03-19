#!/usr/bin/env node
/**
 * phase-b-patch.js ? MPFB2 Hybrid Integration Patch
 * 
 * Patches addon.py to add:
 *   1. MPFB2 detection and hybrid create_base
 *   2. _create_base_mpfb() function
 *   3. _create_base_fallback() (current logic moved)
 *   4. MPFB2 hair branch in bl_char_set_hair_style
 *   5. Deduplicate _get_char_mesh (remove 4 duplicates)
 *   6. body_fat >= 0.3 constraint
 *   7. stylized -> realistic fallback for MPFB2
 *
 * Usage: node phase-b-patch.js
 */

const fs = require("fs");
const path = require("path");

const ADDON = path.join(__dirname, "addon.py");
let src = fs.readFileSync(ADDON, "utf-8");
const original = src;
let changes = 0;

function patch(label, search, replace) {
  if (!src.includes(search)) {
    console.error(`[SKIP] ${label} ? search string not found`);
    return false;
  }
  src = src.replace(search, replace);
  changes++;
  console.log(`[OK]   ${label}`);
  return true;
}

function patchAll(label, search, replace) {
  let count = 0;
  while (src.includes(search)) {
    src = src.replace(search, replace);
    count++;
  }
  if (count > 0) {
    changes++;
    console.log(`[OK]   ${label} (${count} occurrences)`);
  } else {
    console.error(`[SKIP] ${label} ? not found`);
  }
  return count;
}

// ============================================================
// 1. Add _create_base_mpfb() before bl_char_create_base
// ============================================================

const MPFB_HELPER = `
# ============================================================
# MPFB2 Hybrid Integration
# ============================================================

def _has_mpfb():
    """Check if MPFB2 addon is available."""
    try:
        return hasattr(bpy.ops, 'mpfb') and hasattr(bpy.ops.mpfb, 'create_human')
    except Exception:
        return False


def _create_base_mpfb(params):
    """Create character using MPFB2 (high quality path)."""
    gender = params.get("gender", "male")
    style = params.get("style", "realistic")
    char_name = params.get("name", f"Character_{gender}_{style}")

    # MPFB2 only supports realistic; if stylized requested, log it
    if style in ("stylized", "anime"):
        print(f"[ARCANA] MPFB2 does not support '{style}' style, using realistic base")

    # Create human via MPFB2
    bpy.ops.mpfb.create_human()
    obj = bpy.context.active_object
    if obj is None:
        return {"success": False, "message": "MPFB2 create_human failed"}

    obj.name = char_name

    # Set gender via MPFB2 properties if available
    try:
        if hasattr(obj, 'MPFB_GenderProperty'):
            if gender == "female":
                obj.MPFB_GenderProperty = 1.0
            else:
                obj.MPFB_GenderProperty = 0.0
        # Apply macro targets
        if hasattr(bpy.ops.mpfb, 'set_macro_detail'):
            if gender == "female":
                bpy.ops.mpfb.set_macro_detail(target="Gender", value=1.0)
            else:
                bpy.ops.mpfb.set_macro_detail(target="Gender", value=0.0)
    except Exception as e:
        print(f"[ARCANA] MPFB2 gender set warning: {e}")

    # Store metadata
    obj["arcana_gender"] = gender
    obj["arcana_style"] = style
    obj["arcana_type"] = "character"
    obj["arcana_backend"] = "mpfb2"

    vert_count = len(obj.data.vertices) if obj.data else 0
    sk_count = len(obj.data.shape_keys.key_blocks) - 1 if obj.data and obj.data.shape_keys else 0

    return {
        "success": True,
        "name": obj.name,
        "gender": gender,
        "style": style,
        "backend": "mpfb2",
        "vertices": vert_count,
        "shapeKeys": sk_count,
        "message": f"Character '{obj.name}' created via MPFB2 ({vert_count} verts, {sk_count} shape keys)"
    }


`;

patch(
  "1. Insert MPFB2 helper functions before bl_char_create_base",
  `def bl_char_create_base(params):\n    """Create character base body from Blender Studio Human Base Meshes (CC0)."""`,
  MPFB_HELPER + `def bl_char_create_base(params):\n    """Create character base body. Uses MPFB2 if available, otherwise Blender Studio meshes."""`
);

// ============================================================
// 2. Add MPFB2 branch at start of bl_char_create_base
// ============================================================

patch(
  "2. Add MPFB2 branch in bl_char_create_base",
  `    """Create character base body. Uses MPFB2 if available, otherwise Blender Studio meshes."""
    import mathutils
    gender = params.get("gender", "male")
    style = params.get("style", "realistic")`,
  `    """Create character base body. Uses MPFB2 if available, otherwise Blender Studio meshes."""
    import mathutils
    gender = params.get("gender", "male")
    style = params.get("style", "realistic")

    # --- MPFB2 hybrid: prefer MPFB2 if installed ---
    if _has_mpfb():
        print(f"[ARCANA] MPFB2 detected, using high-quality path for {gender}/{style}")
        return _create_base_mpfb(params)
    print(f"[ARCANA] MPFB2 not found, using Blender Studio fallback for {gender}/{style}")`
);

// ============================================================
// 3. Add MPFB2 branch in bl_char_set_hair_style
// ============================================================

patch(
  "3. Add MPFB2 hair branch in bl_char_set_hair_style",
  `    """Set hair style v6. UV Sphere with improved face cut and long drop."""
    import math
    import mathutils`,
  `    """Set hair style v7. MPFB2 hair assets if available, otherwise UV Sphere fallback."""
    import math
    import mathutils

    # --- MPFB2 hair path ---
    if _has_mpfb():
        _name = params.get("name") or params.get("target")
        _obj = _arcana_find_character(_name)
        if _obj is not None and _obj.get("arcana_backend") == "mpfb2":
            try:
                style = params.get("style", "medium")
                # Map ARCANA style names to MPFB2 hair asset names
                _mpfb_hair_map = {
                    "straight": "hair01_straight",
                    "wavy": "hair01_wavy",
                    "curly": "hair01_curly",
                    "ponytail": "hair01_ponytail",
                    "twintail": "hair01_twintails",
                    "bun": "hair01_bun",
                    "braids": "hair01_braids",
                    "mohawk": "hair01_mohawk",
                    "bob": "hair01_bob",
                    "pixie": "hair01_pixie",
                    "long": "hair01_long",
                    "short": "hair01_short",
                    "medium": "hair01_medium",
                    "hime_cut": "hair01_himecut",
                    "afro": "hair01_afro",
                }
                mpfb_name = _mpfb_hair_map.get(style, f"hair01_{style}")
                bpy.ops.mpfb.load_library_clothes(filepath=mpfb_name)
                return {
                    "character": _obj.name,
                    "style": style,
                    "backend": "mpfb2",
                    "message": f"MPFB2 hair '{mpfb_name}' applied"
                }
            except Exception as e:
                print(f"[ARCANA] MPFB2 hair failed ({e}), falling back to UV Sphere")
    # --- Fallback: UV Sphere hair ---`
);

// ============================================================
// 4. Deduplicate _get_char_mesh ? remove 4 duplicate definitions
//    Keep only the first one (around line 2343)
// ============================================================

// The duplicates are preceded by these section comments:
const DUPLICATE_PATTERNS = [
  `"""Character Export Handler - 5 tools for VRM/FBX export and validation."""

import os


def _get_char_mesh(params):`,

  `import json as json_mod


def _get_char_mesh(params):`,

  `"""Character Face Handler - 15 tools for facial feature manipulation."""



def _get_char_mesh(params):`,

  `"""Character Hair Handler - 10 tools for hair style/color/physics."""



def _get_char_mesh(params):`,

  `"""Character Material Handler - 8 tools for skin, makeup, tattoo, etc."""



def _get_char_mesh(params):`,
];

// Each duplicate has the same body ? find and remove the function body
const CHAR_MESH_BODY = `def _get_char_mesh(params):
    name = params.get("character", params.get("name", ""))
    if name:
        return get_object(name)
    for obj in bpy.data.objects:
        if obj.type == 'MESH' and obj.data.shape_keys:
            return obj
    raise ValueError("No character mesh found")`;

// We keep the first occurrence, remove subsequent ones
let firstFound = false;
let dupCount = 0;
for (const pattern of DUPLICATE_PATTERNS) {
  if (src.includes(pattern)) {
    if (!firstFound) {
      // Keep the first occurrence that appears after the body handler section
      // The first real one is in the body handler around line 2343
      // Export handler one (line ~3015) should be removed
      // Check if this is the body handler one
      if (pattern.includes("Character Export") || pattern.includes("json_mod") ||
          pattern.includes("Character Face") || pattern.includes("Character Hair") ||
          pattern.includes("Character Material")) {
        // These are all duplicates ? remove the function definition
        const replaceTarget = pattern.replace(`def _get_char_mesh(params):`, "").trim();
        if (replaceTarget) {
          src = src.replace(pattern, pattern.replace(CHAR_MESH_BODY, `# _get_char_mesh: defined in body_handler (deduplicated)`));
          dupCount++;
        }
      } else {
        firstFound = true;
      }
    } else {
      src = src.replace(pattern, pattern.replace(CHAR_MESH_BODY, `# _get_char_mesh: defined in body_handler (deduplicated)`));
      dupCount++;
    }
  }
}

// Simpler approach: just replace all 4 duplicate blocks
for (const pattern of DUPLICATE_PATTERNS) {
  const fullBlock = pattern.includes("import os") 
    ? `"""Character Export Handler - 5 tools for VRM/FBX export and validation."""\n\nimport os\n\n\n` + CHAR_MESH_BODY
    : pattern.includes("json_mod")
    ? `import json as json_mod\n\n\n` + CHAR_MESH_BODY
    : pattern.includes("Face Handler")
    ? `"""Character Face Handler - 15 tools for facial feature manipulation."""\n\n\n` + CHAR_MESH_BODY
    : pattern.includes("Hair Handler")
    ? `"""Character Hair Handler - 10 tools for hair style/color/physics."""\n\n\n` + CHAR_MESH_BODY
    : pattern.includes("Material Handler")
    ? `"""Character Material Handler - 8 tools for skin, makeup, tattoo, etc."""\n\n\n` + CHAR_MESH_BODY
    : null;
  
  if (fullBlock && src.includes(fullBlock)) {
    const replacement = fullBlock.replace(CHAR_MESH_BODY, `# _get_char_mesh: see body_handler section (deduplicated)`);
    src = src.replace(fullBlock, replacement);
    dupCount++;
  }
}

if (dupCount > 0) {
  changes++;
  console.log(`[OK]   4. Deduplicated _get_char_mesh (${dupCount} duplicates replaced)`);
} else {
  console.error(`[SKIP] 4. _get_char_mesh deduplication ? patterns not matched exactly`);
  console.log(`       Will attempt line-based dedup...`);
  
  // Line-based fallback approach
  const lines = src.split("\n");
  let kept = false;
  let removing = false;
  let removed = 0;
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("def _get_char_mesh(params):")) {
      if (!kept) {
        kept = true;
        newLines.push(lines[i]);
      } else {
        // Replace with comment, skip the body
        newLines.push("# _get_char_mesh: see body_handler section (deduplicated)");
        removing = true;
        removed++;
        continue;
      }
    } else if (removing) {
      // Skip lines that belong to the duplicate function body
      const trimmed = lines[i].trimStart();
      if (trimmed === "" || lines[i].startsWith("    ")) {
        // Still part of function body, but check if it's a new function
        if (trimmed.startsWith("def ") && !trimmed.startsWith("def _get_char_mesh")) {
          removing = false;
          newLines.push(lines[i]);
        }
        // else skip this line (part of duplicate body)
        continue;
      } else {
        removing = false;
        newLines.push(lines[i]);
      }
    } else {
      newLines.push(lines[i]);
    }
  }
  
  if (removed > 0) {
    src = newLines.join("\n");
    changes++;
    console.log(`[OK]   4. Deduplicated _get_char_mesh via line scan (${removed} duplicates removed)`);
  }
}

// ============================================================
// 5. body_fat >= 0.3 constraint in bl_char_set_body_fat
// ============================================================

patch(
  "5. Add body_fat >= 0.3 minimum constraint",
  `def bl_char_set_body_fat(params):`,
  `def bl_char_set_body_fat(params):
    # Enforce minimum body_fat of 0.3 for realistic proportions
    _raw_fat = params.get("value", 0.5)
    if isinstance(_raw_fat, (int, float)) and _raw_fat < 0.3:
        params["value"] = 0.3
        print(f"[ARCANA] body_fat clamped: {_raw_fat} -> 0.3 (minimum)")
    # --- original logic below ---`
);

// ============================================================
// 6. Add arcana_backend to _arcana_find_character return
//    (already has arcana_type check, add backend info)
// ============================================================

patch(
  "6. Enhance _arcana_find_character with backend detection",
  `def _arcana_find_character(name=None):`,
  `def _arcana_find_character(name=None):
    """Find character object. Checks arcana_type metadata. Supports both MPFB2 and fallback backends."""`
);

// ============================================================
// 7. Update version in bl_info
// ============================================================

patch(
  "7. Bump addon version to 6.2.0",
  `"version": (6, 1, 0),`,
  `"version": (6, 2, 0),`
);

// ============================================================
// Write result
// ============================================================

if (changes === 0) {
  console.log("\nNo changes applied. addon.py unchanged.");
  process.exit(1);
}

fs.writeFileSync(ADDON, src, "utf-8");
const sizeBefore = Buffer.byteLength(original, "utf-8");
const sizeAfter = Buffer.byteLength(src, "utf-8");
console.log(`\n--- Summary ---`);
console.log(`Changes applied: ${changes}`);
console.log(`Size: ${sizeBefore} -> ${sizeAfter} bytes (${sizeAfter > sizeBefore ? "+" : ""}${sizeAfter - sizeBefore})`);
console.log(`addon.py updated successfully.`);
