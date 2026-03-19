#!/usr/bin/env node
/**
 * phase-d-patch.js — MPFB2 Dynamic Asset Discovery
 * Replaces all hardcoded asset paths with MPFB2 AssetService API calls.
 * Adds _discover_mpfb_assets(), bl_char_list_hair, bl_char_list_skins.
 * Works with any installed pack (official or third-party).
 */
const fs = require("fs");
const path = require("path");

const ADDON = path.join(__dirname, "addon.py");
let src = fs.readFileSync(ADDON, "utf-8");
const origLen = src.length;
let changes = 0;

function replace(label, search, replacement) {
  if (src.includes(search)) {
    src = src.replace(search, replacement);
    changes++;
    console.log("[OK]  ", label);
  } else {
    console.log("[SKIP]", label, "(search string not found)");
  }
}

// ========================================================
// 1. Insert _discover_mpfb_assets() before _has_mpfb()
// ========================================================
const DISCOVER_FN = `
# ============================================================
# MPFB2 Dynamic Asset Discovery
# ============================================================
_mpfb_asset_cache = {"hair": {}, "skins": {}, "clothes": {}, "_initialized": False}

def _discover_mpfb_assets(force_refresh=False):
    """Discover all installed MPFB2 assets using the official AssetService API.
    Works with any pack (official CC0 or third-party).
    Results are cached; call with force_refresh=True after installing new packs."""
    global _mpfb_asset_cache
    if _mpfb_asset_cache["_initialized"] and not force_refresh:
        return _mpfb_asset_cache
    try:
        from bl_ext.blender_org.mpfb.services.assetservice import AssetService

        _mpfb_asset_cache["hair"] = {}
        for p in AssetService.list_mhclo_assets("hair"):
            name = os.path.basename(os.path.dirname(p))
            _mpfb_asset_cache["hair"][name] = p

        _mpfb_asset_cache["skins"] = {}
        for p in AssetService.list_mhmat_assets("skins"):
            name = os.path.basename(os.path.dirname(p))
            _mpfb_asset_cache["skins"][name] = p

        _mpfb_asset_cache["clothes"] = {}
        for p in AssetService.list_mhclo_assets("clothes"):
            name = os.path.basename(os.path.dirname(p))
            _mpfb_asset_cache["clothes"][name] = p

        _mpfb_asset_cache["_initialized"] = True
        print(f"[ARCANA] MPFB2 assets discovered: "
              f"{len(_mpfb_asset_cache['hair'])} hair, "
              f"{len(_mpfb_asset_cache['skins'])} skins, "
              f"{len(_mpfb_asset_cache['clothes'])} clothes")
    except Exception as e:
        print(f"[ARCANA] MPFB2 asset discovery failed: {e}")
    return _mpfb_asset_cache

def _mpfb_find_asset(category, query):
    """Find best matching asset by name fragment. Case-insensitive partial match.
    category: 'hair', 'skins', or 'clothes'
    Returns (asset_name, full_path) or (None, None)."""
    assets = _discover_mpfb_assets().get(category, {})
    q = query.lower().replace(" ", "_").replace("-", "_")
    # Exact match first
    if q in assets:
        return q, assets[q]
    # Partial match
    for name, fpath in assets.items():
        if q in name.lower():
            return name, fpath
    return None, None

def _mpfb_find_skin_for_preset(preset, gender="female"):
    """Map a natural-language skin preset to the best available MPFB2 skin asset.
    Uses fuzzy matching against installed skin names."""
    assets = _discover_mpfb_assets().get("skins", {})
    if not assets:
        return None, None

    # Priority keywords per preset, gender-aware
    _preset_keywords = {
        "light":    ["young_caucasian_{g}", "toigo_light_skin_{g2}", "caucasian_{g}"],
        "fair":     ["young_caucasian_{g}", "toigo_light_skin_{g2}", "caucasian_{g}"],
        "pale":     ["toigo_light_skin_{g2}", "young_caucasian_{g}", "skalldyrssuppe_creamy"],
        "medium":   ["callharvey3d_midtoned", "middleage_caucasian_{g}", "caucasian_{g}"],
        "tan":      ["cutoff3d_indian_{g}", "middleage_asian_{g}", "asian_{g}"],
        "olive":    ["middleage_asian_{g}", "cutoff3d_indian_{g}", "asian_{g}"],
        "dark":     ["young_african_{g}", "middleage_african_{g}", "african_{g}"],
        "brown":    ["cutoff3d_indian_{g}", "middleage_asian_{g}"],
        "asian":    ["young_asian_{g}", "middleage_asian_{g}", "asian_{g}"],
        "african":  ["young_african_{g}", "middleage_african_{g}", "african_{g}"],
        "caucasian":["young_caucasian_{g}", "middleage_caucasian_{g}", "caucasian_{g}"],
        "freckles": ["toigo_light_skin_{g2}_freckles", "freckles"],
        "ginger":   ["toigo_light_skin_{g2}_ginger", "ginger", "flower-angel_red_head"],
        "makeup":   ["toigo_light_skin_{g2}_with_makeup", "makeup"],
    }
    g = gender.lower()
    g2 = "female" if g == "female" else "male"
    keywords = _preset_keywords.get(preset.lower(), [preset.lower()])

    for kw_template in keywords:
        kw = kw_template.replace("{g}", g).replace("{g2}", g2)
        for name, fpath in assets.items():
            if kw in name.lower():
                return name, fpath
    # Last resort: any skin with gender match
    for name, fpath in assets.items():
        if g2 in name.lower():
            return name, fpath
    # Absolute fallback: first available
    first_name = next(iter(assets))
    return first_name, assets[first_name]

`;

replace(
  "1. Insert _discover_mpfb_assets before _has_mpfb",
  "def _has_mpfb():",
  DISCOVER_FN + "def _has_mpfb():"
);

// ========================================================
// 2. Replace hardcoded hair map in bl_char_set_hair_style
// ========================================================
const OLD_HAIR = `                _mpfb_hair_base = r"C:/Users/owner/AppData/Roaming/Blender Foundation/Blender/5.1/extensions/.user/blender_org/mpfb/data/hair"
                _mpfb_hair_map = {
                    "long": "culturalibre_hair_01/culturalibre_hair_01.mhclo",
                    "straight": "culturalibre_hair_02/culturalibre_hair_02.mhclo",
                    "wavy": "culturalibre_hair_05/culturalibre_hair_05.mhclo",
                    "curly": "culturalibre_hair_06/culturalibre_hair_06.mhclo",
                    "bob": "littleright_bobcut_hair/littleright_bobcut_hair.mhclo",
                    "short": "cortu_short_messy_hair/cortu_short_messy_hair.mhclo",
                    "bun": "rehmanpolanski_hair_bun_brown/rehmanpolanski_hair_bun_brown.mhclo",
                    "messy": "cortu_shaggy_green_hair/cortu_shaggy_green_hair.mhclo",
                    "anime": "learning_anime_hair/learning_anime_hair.mhclo",
                    "medium": "faydaen_hair_1/faydaen_hair_1.mhclo",
                    "jungle": "sonntag78_junglebook_hair/sonntag78_junglebook_hair.mhclo",
                    "cloud": "cortu_strawberry_cloud_hair/cortu_strawberry_cloud_hair.mhclo",
                }
                _hair_rel = _mpfb_hair_map.get(style, "culturalibre_hair_01/culturalibre_hair_01.mhclo")
                _hair_full = os.path.join(_mpfb_hair_base, _hair_rel)
                bpy.ops.mpfb.load_library_clothes(filepath=_hair_full)`;

const NEW_HAIR = `                # Dynamic asset discovery (no hardcoded paths)
                _hair_style_hints = {
                    "long": ["long", "culturalibre_hair_01"],
                    "straight": ["straight", "culturalibre_hair_02"],
                    "wavy": ["wavy", "culturalibre_hair_05"],
                    "curly": ["curly", "culturalibre_hair_06"],
                    "bob": ["bob", "bobcut"],
                    "short": ["short", "short_messy"],
                    "bun": ["bun"],
                    "braids": ["braid"],
                    "ponytail": ["ponytail", "pony"],
                    "afro": ["afro"],
                    "messy": ["messy", "shaggy"],
                    "anime": ["anime"],
                    "medium": ["faydaen", "medium"],
                    "pixie": ["pixie", "short"],
                    "twintail": ["twintail", "twin"],
                    "hime_cut": ["hime"],
                }
                _hair_name, _hair_path = None, None
                _hints = _hair_style_hints.get(style, [style])
                for _hint in _hints:
                    _hair_name, _hair_path = _mpfb_find_asset("hair", _hint)
                    if _hair_path:
                        break
                if not _hair_path:
                    # Fallback: first available hair
                    _all_hair = _discover_mpfb_assets().get("hair", {})
                    if _all_hair:
                        _hair_name = next(iter(_all_hair))
                        _hair_path = _all_hair[_hair_name]
                if _hair_path:
                    bpy.ops.mpfb.load_library_clothes(filepath=_hair_path)`;

replace("2. Replace hardcoded hair map", OLD_HAIR, NEW_HAIR);

// ========================================================
// 3. Replace hardcoded skin map in bl_char_set_skin_color
// ========================================================
const OLD_SKIN = `        skin_name = params.get("mpfb_skin", "")
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
            skin_name = _skin_map.get(preset, "")
        if skin_name:
            try:
                _full_path = os.path.join(_mpfb_skin_base, skin_name)
                bpy.ops.mpfb.load_library_skin(filepath=_full_path)`;

const NEW_SKIN = `        skin_name = params.get("mpfb_skin", "")
        preset = params.get("preset", "").lower()
        _gender = obj_check.get("arcana_gender", "female")
        # Dynamic skin discovery (no hardcoded paths)
        if not skin_name and preset:
            skin_name, _skin_path = _mpfb_find_skin_for_preset(preset, _gender)
        elif skin_name:
            skin_name, _skin_path = _mpfb_find_asset("skins", skin_name)
        else:
            skin_name, _skin_path = None, None
        if _skin_path:
            try:
                bpy.ops.mpfb.load_library_skin(filepath=_skin_path)`;

replace("3. Replace hardcoded skin map", OLD_SKIN, NEW_SKIN);

// ========================================================
// 4. Fix skin return message (remove old variable refs)
// ========================================================
replace(
  "4. Fix skin success return preset field",
  `                    "preset": preset or skin_name,`,
  `                    "preset": preset or str(skin_name),`
);

replace(
  "4b. Fix skin fallback message",
  `[ARCANA] MPFB2 skin asset not available ({skin_name}), using material color`,
  `[ARCANA] MPFB2 skin not applied ({skin_name}), using material color`
);

// ========================================================
// 5. Replace bl_char_set_clothing MPFB2 section
// ========================================================
const OLD_CLOTHING_LOAD = `        # Load each clothing item via MPFB2
        loaded = []
        failed = []
        for slot, asset_name in all_items.items():
            try:
                bpy.ops.mpfb.load_library_clothes(filepath=asset_name)
                loaded.append({"slot": slot, "asset": asset_name})
            except Exception as e:
                failed.append({"slot": slot, "asset": asset_name, "error": str(e)})`;

const NEW_CLOTHING_LOAD = `        # Load each clothing item via MPFB2 (dynamic path resolution)
        loaded = []
        failed = []
        for slot, asset_name in all_items.items():
            try:
                _cloth_name, _cloth_path = _mpfb_find_asset("clothes", asset_name)
                if _cloth_path:
                    bpy.ops.mpfb.load_library_clothes(filepath=_cloth_path)
                    loaded.append({"slot": slot, "asset": _cloth_name})
                else:
                    failed.append({"slot": slot, "asset": asset_name, "error": "Asset not found in installed packs"})
            except Exception as e:
                failed.append({"slot": slot, "asset": asset_name, "error": str(e)})`;

replace("5. Replace clothing MPFB2 load section", OLD_CLOTHING_LOAD, NEW_CLOTHING_LOAD);

// ========================================================
// 6. Replace bl_char_list_clothing with dynamic version
// ========================================================
const OLD_LIST_CLOTHING = `def bl_char_list_clothing(params):
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
                "toigo_ankle_boots_female", "toigo_ankle_boots_male",`;

const NEW_LIST_CLOTHING = `def bl_char_list_clothing(params):
    """List available clothing assets (dynamically discovered from installed packs)."""
    result = {
        "mpfb2_available": _has_mpfb(),
        "categories": {},
        "all_assets": [],
        "total": 0,
    }

    if _has_mpfb():
        assets = _discover_mpfb_assets()
        clothes = assets.get("clothes", {})
        result["all_assets"] = sorted(clothes.keys())
        result["total"] = len(clothes)
        # Auto-categorize by name patterns
        cats = {"tops": [], "pants": [], "shoes": [], "dresses": [], "suits": [],
                "hats": [], "accessories": [], "other": []}
        for name in sorted(clothes.keys()):
            nl = name.lower()
            if any(k in nl for k in ["shirt", "top", "sweater", "blouse", "tank", "vest", "jacket", "coat"]):
                cats["tops"].append(name)
            elif any(k in nl for k in ["pant", "jean", "short", "skirt", "trouser", "legging"]):
                cats["pants"].append(name)
            elif any(k in nl for k in ["shoe", "boot", "sandal", "heel", "flat", "sneaker", "slipper"]):
                cats["shoes"].append(name)
            elif any(k in nl for k in ["dress", "gown", "robe"]):
                cats["dresses"].append(name)
            elif any(k in nl for k in ["suit", "tux", "formal"]):
                cats["suits"].append(name)
            elif any(k in nl for k in ["hat", "cap", "fedora", "helmet", "hood", "beanie"]):
                cats["hats"].append(name)
            elif any(k in nl for k in ["glass", "necklace", "ring", "watch", "belt", "scarf", "tie"]):
                cats["accessories"].append(name)
            else:
                cats["other"].append(name)
        result["categories"] = {k: v for k, v in cats.items() if v}`;

replace("6. Replace bl_char_list_clothing with dynamic version", OLD_LIST_CLOTHING, NEW_LIST_CLOTHING);

// Remove the rest of the old hardcoded list (find closing section)
const OLD_LIST_TAIL = `            "glasses": [
                "toigo_glasses01_female", "toigo_glasses01_male",
            ],
        }
    else:
        result["note"] = "Install MPFB2 and download CC0 asset packs for 3D clothing"

    return result`;

const NEW_LIST_TAIL = `    else:
        result["note"] = "Install MPFB2 and download CC0 asset packs for 3D clothing"

    return result`;

replace("6b. Clean up old list tail", OLD_LIST_TAIL, NEW_LIST_TAIL);

// ========================================================
// 7. Add bl_char_list_hair and bl_char_list_skins tools
// ========================================================
const NEW_LIST_TOOLS = `
def bl_char_list_hair(params):
    """List all available hair assets (dynamically discovered)."""
    if not _has_mpfb():
        return {"mpfb2_available": False, "hair": [], "total": 0,
                "note": "MPFB2 not installed. Only UV Sphere fallback available."}
    assets = _discover_mpfb_assets()
    hair = assets.get("hair", {})
    return {
        "mpfb2_available": True,
        "hair": sorted(hair.keys()),
        "total": len(hair),
        "note": "Use exact asset names with bl_char_set_hair_style (style param) or bl_char_set_hair_style mpfb_hair param."
    }


def bl_char_list_skins(params):
    """List all available skin assets (dynamically discovered)."""
    if not _has_mpfb():
        return {"mpfb2_available": False, "skins": [], "total": 0,
                "note": "MPFB2 not installed. Only material color fallback available."}
    assets = _discover_mpfb_assets()
    skins = assets.get("skins", {})
    return {
        "mpfb2_available": True,
        "skins": sorted(skins.keys()),
        "total": len(skins),
        "presets": ["light", "fair", "medium", "tan", "olive", "dark", "brown",
                    "asian", "african", "caucasian", "freckles", "ginger", "makeup"],
        "note": "Use presets with bl_char_set_skin_color (preset param) or exact asset names (mpfb_skin param)."
    }

`;

replace(
  "7. Add bl_char_list_hair and bl_char_list_skins",
  "def clothing_handler_get_routes():",
  NEW_LIST_TOOLS + "def clothing_handler_get_routes():"
);

// ========================================================
// 8. Register new tools in clothing_handler_get_routes
// ========================================================
replace(
  "8. Register list_hair and list_skins in routes",
  `        "bl_char_list_clothing": bl_char_list_clothing,
    }`,
  `        "bl_char_list_clothing": bl_char_list_clothing,
        "bl_char_list_hair": bl_char_list_hair,
        "bl_char_list_skins": bl_char_list_skins,
    }`
);

// ========================================================
// 9. Bump version to 6.4.0
// ========================================================
replace(
  "9. Bump version to 6.4.0",
  `"version": (6, 3, 0),`,
  `"version": (6, 4, 0),`
);

// ========================================================
// Write result
// ========================================================
fs.writeFileSync(ADDON, src, "utf-8");
console.log(`\n${changes} changes applied.`);
console.log(`Size: ${origLen} -> ${src.length} bytes (${src.length > origLen ? "+" : ""}${src.length - origLen})`);
