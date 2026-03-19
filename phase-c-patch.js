#!/usr/bin/env node
/**
 * phase-c-patch.js ? MPFB2 Skin/Clothing Integration
 *
 * Patches addon.py to add:
 *   1. MPFB2 skin branch in bl_char_set_skin_color
 *   2. New bl_char_set_clothing function (MPFB2 clothes + fallback)
 *   3. New bl_char_remove_clothing function
 *   4. New bl_char_list_clothing function
 *   5. Register new clothing tools in char_material_handler_get_routes
 *   6. Register clothing handler in register_all_handlers
 *   7. Bump version to 6.3.0
 *
 * Usage: node phase-c-patch.js
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

// ============================================================
// 1. MPFB2 skin branch in bl_char_set_skin_color
// ============================================================

patch(
  "1. Add MPFB2 skin branch in bl_char_set_skin_color",
  `def bl_char_set_skin_color(params):`,
  `def bl_char_set_skin_color(params):
    # --- MPFB2 skin path ---
    obj_check = _get_char_mesh(params)
    if _has_mpfb() and obj_check.get("arcana_backend") == "mpfb2":
        skin_name = params.get("mpfb_skin", "")
        preset = params.get("preset", "").lower()
        # Map common presets to MPFB2 skin asset names
        _mpfb_skin_map = {
            "light": "toigo_light_skin_male_bronze",
            "fair": "toigo_light_skin_male_bronze",
            "medium": "callharvey3d_midtoned_female",
            "tan": "cutoff3d_indian_female_enhanced",
            "dark": "mindfront_skin_male_african_middleage",
            "brown": "cutoff3d_indian_female_enhanced",
            "pale": "toigo_light_skin_male_bronze",
            "olive": "callharvey3d_midtoned_female",
        }
        if not skin_name and preset:
            skin_name = _mpfb_skin_map.get(preset, "")
        if skin_name:
            try:
                bpy.ops.mpfb.load_library_skin(filepath=skin_name)
                return {
                    "success": True,
                    "name": obj_check.name,
                    "preset": preset or skin_name,
                    "backend": "mpfb2",
                    "message": f"MPFB2 skin '{skin_name}' applied"
                }
            except Exception as e:
                print(f"[ARCANA] MPFB2 skin failed ({e}), falling back to material color")
    # --- Fallback: material color (original logic below) ---`
);

// ============================================================
// 2. New clothing handler section before char_material_handler_get_routes
// ============================================================

const CLOTHING_HANDLER = `

# ============================================================
# Character Handler: clothing_handler
# ============================================================
"""Character Clothing Handler - 3 tools for MPFB2 clothing management."""


def bl_char_set_clothing(params):
    """Apply clothing to character. Uses MPFB2 clothes library if available."""
    obj = _get_char_mesh(params)

    # --- MPFB2 clothing path ---
    if _has_mpfb() and obj.get("arcana_backend") == "mpfb2":
        # Accept individual slots or a list
        slots = {}
        for slot in ["top", "bottom", "shoes", "dress", "suit", "hat",
                      "glasses", "gloves", "mask", "underwear", "socks",
                      "outfit", "accessory"]:
            val = params.get(slot)
            if val:
                slots[slot] = val

        # Also accept a direct "clothes" list
        clothes_list = params.get("clothes", [])
        if isinstance(clothes_list, str):
            clothes_list = [clothes_list]

        applied = []
        errors = []

        # Apply individual slot items via MPFB2
        for slot, asset_name in slots.items():
            try:
                bpy.ops.mpfb.load_library_clothes(filepath=asset_name)
                applied.append({"slot": slot, "asset": asset_name})
            except Exception as e:
                errors.append({"slot": slot, "asset": asset_name, "error": str(e)})

        # Apply clothes list
        for item in clothes_list:
            try:
                bpy.ops.mpfb.load_library_clothes(filepath=item)
                applied.append({"slot": "custom", "asset": item})
            except Exception as e:
                errors.append({"slot": "custom", "asset": item, "error": str(e)})

        # Store metadata
        if "arcana_clothing" not in obj:
            obj["arcana_clothing"] = ""
        existing = obj["arcana_clothing"]
        new_items = ",".join([a["asset"] for a in applied])
        obj["arcana_clothing"] = f"{existing},{new_items}" if existing else new_items

        return {
            "success": len(applied) > 0,
            "character": obj.name,
            "applied": applied,
            "errors": errors,
            "backend": "mpfb2",
            "message": f"Applied {len(applied)} clothing items" + (f" ({len(errors)} failed)" if errors else "")
        }

    # --- Fallback: no MPFB2, store metadata only ---
    clothing_info = {}
    for slot in ["top", "bottom", "shoes", "dress", "suit", "hat",
                  "glasses", "gloves", "mask", "outfit"]:
        val = params.get(slot)
        if val:
            clothing_info[slot] = val
    obj["arcana_clothing"] = str(clothing_info)

    return {
        "success": True,
        "character": obj.name,
        "clothing": clothing_info,
        "backend": "fallback",
        "message": "Clothing metadata stored (install MPFB2 + asset packs for actual 3D clothing)"
    }


def bl_char_remove_clothing(params):
    """Remove clothing from character."""
    obj = _get_char_mesh(params)
    slot = params.get("slot", "all")

    if _has_mpfb() and obj.get("arcana_backend") == "mpfb2":
        removed = []
        # Find child objects that are clothing
        for child in list(obj.children):
            is_clothing = (child.get("MPFB_clothes") or
                          child.get("mpfb_type") == "clothes" or
                          "clothes" in child.name.lower())
            if is_clothing:
                if slot == "all" or slot.lower() in child.name.lower():
                    removed.append(child.name)
                    bpy.data.objects.remove(child, do_unlink=True)

        obj["arcana_clothing"] = ""
        return {
            "success": True,
            "character": obj.name,
            "removed": removed,
            "message": f"Removed {len(removed)} clothing items"
        }

    obj["arcana_clothing"] = ""
    return {"success": True, "character": obj.name, "removed": [], "message": "Clothing metadata cleared"}


def bl_char_list_clothing(params):
    """List available clothing assets."""
    result = {
        "mpfb2_available": _has_mpfb(),
        "categories": {}
    }

    if _has_mpfb():
        # Common MPFB2 CC0 clothing assets organized by category
        result["categories"] = {
            "tops": [
                "cortu_green_basic_tshirt", "cortu_grey_basic_tshirt",
                "cortu_light_blue_basic_tshirt", "cortu_basic_sweater",
                "toigo_cowl_top", "toigo_crop_top", "toigo_halter_top",
            ],
            "pants": [
                "cortu_cargo_pants", "cortu_jeans_shorts",
                "toigo_harem_pants", "toigo_wool_pants",
            ],
            "shoes": [
                "cortu_floppy_overknee_shoes", "cortu_t_bar",
                "toigo_ankle_boots_female", "toigo_ankle_boots_male",
                "toigo_ballet_flats", "toigo_flats", "toigo_stiletto_booties",
            ],
            "dresses": [
                "toigo_bodice_dress_with_lace_ruffle_skirt",
                "toigo_camisole_dress_with_full_skirt",
                "toigo_cut_out_dress", "toigo_halter_dress_knee_length",
                "toigo_shift_dress", "mindfront_kimono",
            ],
            "suits_formal": [
                "toigo_female_suit", "toigo_male_suit_3",
                "toigo_suit_with_dinner_jacket", "toigo_suit_with_jacket_and_bowtie",
            ],
            "suits_fantasy": [
                "culturalibre_hero_suit_1", "culturalibre_hero_suit_2",
                "culturalibre_heroine_suit_2", "joachip_cyborg_suit",
                "matcreator_mc_scifi_armor_guardian", "matcreator_mc_scifi_armor_helios",
                "rehmanpolanski_viking_tunic", "rehmanpolanski_viking_pants",
                "slayer227_spider_gwen", "thegreatengineer_galactic_warrior_uniform",
            ],
            "hats": ["hat_assets_available_with_hats01_pack"],
            "glasses": ["glasses_assets_available_with_glasses01_pack"],
            "gloves": ["gloves_assets_available_with_gloves01_pack"],
        }
        result["note"] = "Asset names can be passed directly to bl_char_set_clothing"
    else:
        result["note"] = "Install MPFB2 and download CC0 asset packs for 3D clothing"

    return result


def clothing_handler_get_routes():
    return {
        "bl_char_set_clothing": bl_char_set_clothing,
        "bl_char_remove_clothing": bl_char_remove_clothing,
        "bl_char_list_clothing": bl_char_list_clothing,
    }

`;

patch(
  "2. Insert clothing handler section",
  `def char_material_handler_get_routes():`,
  CLOTHING_HANDLER + `def char_material_handler_get_routes():`
);

// ============================================================
// 3. Register clothing handler in register_all_handlers
// ============================================================

patch(
  "3. Register clothing handler in register_all_handlers",
  `    register_routes(char_material_handler_get_routes())`,
  `    register_routes(char_material_handler_get_routes())
    register_routes(clothing_handler_get_routes())`
);

// ============================================================
// 4. Add MPFB2 skin asset loading helper
// ============================================================

patch(
  "4. Add MPFB2 skin asset helper in _create_base_mpfb",
  `    obj["arcana_backend"] = "mpfb2"

    vert_count`,
  `    obj["arcana_backend"] = "mpfb2"

    # Apply default skin based on gender if skins pack is loaded
    try:
        if gender == "female":
            bpy.ops.mpfb.load_library_skin(filepath="callharvey3d_midtoned_female")
        else:
            bpy.ops.mpfb.load_library_skin(filepath="mindfront_aksel_skin")
    except Exception as e:
        print(f"[ARCANA] MPFB2 default skin not applied: {e}")

    vert_count`
);

// ============================================================
// 5. Update tool count in README badge (832 -> 835)
// ============================================================
// 3 new tools: bl_char_set_clothing, bl_char_remove_clothing, bl_char_list_clothing
// Skip this ? README badge update can be separate

// ============================================================
// 6. Bump version
// ============================================================

patch(
  "5. Bump addon version to 6.3.0",
  `"version": (6, 2, 0),`,
  `"version": (6, 3, 0),`
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
