"""
ARCANA Handlers - auto-register all tool handlers.
"""

from ..utils.command_router import (
    register_routes,
    register_aliases,
    register_not_implemented,
    get_registered_count,
    get_alias_count,
    get_not_implemented_count,
)


def register_all():
    """Import and register all handler modules."""
    from . import (
        object_handler,
        mesh_handler,
        material_handler,
        modifier_handler,
        sculpt_handler,
        animation_handler,
        camera_handler,
        light_handler,
        render_handler,
        scene_handler,
        node_handler,
        uv_handler,
        particle_handler,
        armature_handler,
        grease_pencil_handler,
        geometry_nodes_handler,
        compositor_handler,
        texture_paint_handler,
        vse_handler,
    )
    from .character import (
        body_handler,
        face_handler,
        hair_handler,
        material_handler as char_material_handler,
        expression_handler,
        export_handler,
    )

    modules = [
        object_handler, mesh_handler, material_handler, modifier_handler,
        sculpt_handler, animation_handler, camera_handler, light_handler,
        render_handler, scene_handler, node_handler, uv_handler,
        particle_handler, armature_handler, grease_pencil_handler,
        geometry_nodes_handler, compositor_handler, texture_paint_handler,
        vse_handler,
        body_handler, face_handler, hair_handler, char_material_handler,
        expression_handler, export_handler,
    ]

    for mod in modules:
        if hasattr(mod, 'get_routes'):
            register_routes(mod.get_routes())

    # =========================================================
    # エイリアス: サーバー側ツールID → プラグイン側ルートキー
    # 意味的に同等な操作のみ登録する
    # =========================================================
    register_aliases({
        # bl_object: ID微差
        "bl_object_visibility": "bl_object_set_visibility",
        "bl_object_get_info": "bl_object_list",
        "bl_object_join": "bl_mesh_join",
        "bl_object_separate": "bl_mesh_separate",

        # bl_sculpt: ID微差
        "bl_sculpt_enter_mode": "bl_sculpt_enable",
        "bl_sculpt_mask_operations": "bl_sculpt_mask",

        # bl_mesh: ID微差（意味が同等なもののみ）
        "bl_mesh_merge": "bl_mesh_merge_vertices",
        "bl_mesh_recalc_normals": "bl_mesh_flip_normals",
        "bl_mesh_smooth": "bl_mesh_smooth_shade",
        "bl_mesh_loop_cut": "bl_mesh_subdivide",
        "bl_mesh_uv_unwrap": "bl_uv_unwrap",

        # bl_material: ID微差
        "bl_material_set_texture": "bl_material_add_texture",

        # bl_animation: 機能がarmature側に存在
        "bl_anim_create_bone": "bl_armature_add_bone",
        "bl_anim_add_ik": "bl_armature_set_ik",

        # bl_light: ID微差
        "bl_light_set_power": "bl_light_set_energy",

        # bl_scene: ID微差 / 機能が別ハンドラに存在
        "bl_scene_set_units": "bl_scene_set_unit",
        "bl_scene_set_frame_range": "bl_anim_set_frame_range",
        "bl_scene_set_world": "bl_render_set_world_color",

        # bl_compositor: プレフィックス差 (bl_compositor_ vs bl_comp_)
        "bl_compositor_enable": "bl_comp_enable",
        "bl_compositor_add_node": "bl_comp_add_node",
        "bl_compositor_connect": "bl_comp_connect",

        # bl_grease_pencil: ID微差
        "bl_gp_set_line_width": "bl_gp_set_thickness",

        # bl_texture_paint: プレフィックス差 (bl_tpaint_ vs bl_texpaint_)
        "bl_tpaint_enter_mode": "bl_texpaint_enable",
        "bl_tpaint_set_brush": "bl_texpaint_set_brush",

        # bl_render: ID微差
        "bl_render_execute": "bl_render_render",
        "bl_render_color_management": "bl_render_set_color_management",
        "bl_render_set_denoise": "bl_render_set_denoising",
    })

    # =========================================================
    # 未実装: サーバー側に定義があるがプラグイン側に
    # 対応ハンドラがないツール。明示的にエラーを返す。
    # =========================================================
    register_not_implemented([
        # bl_object
        "bl_object_set_origin",

        # bl_mesh
        "bl_mesh_bevel",
        "bl_mesh_export",

        # bl_material
        "bl_material_add_node",
        "bl_material_remove",

        # bl_modifier
        "bl_mod_wireframe",
        "bl_mod_decimate",

        # bl_sculpt
        "bl_sculpt_apply_stroke",
        "bl_sculpt_face_sets",

        # bl_animation
        "bl_anim_add_nla_track",
        "bl_anim_bake",
        "bl_anim_export",

        # bl_camera
        "bl_camera_track_to",
        "bl_camera_set_bg_image",

        # bl_light
        "bl_light_set_size",
        "bl_light_set_type",

        # bl_scene
        "bl_scene_create_collection",
        "bl_scene_move_to_collection",

        # bl_compositor (プラグイン側に対応なし)
        "bl_compositor_add_glare",
        "bl_compositor_add_color_correction",
        "bl_compositor_add_denoise",
        "bl_compositor_add_vignette",

        # bl_grease_pencil (重複ファイル分・プラグイン側に対応なし)
        "bl_gp_create_object",
        "bl_gp_draw_stroke",
        "bl_gp_add_effect",
        "bl_gp_set_onion_skinning",
        "bl_gp_animate",
        "bl_gp_export",

        # bl_geometry_nodes (プラグイン側に対応なし)
        "bl_geonodes_set_input",
        "bl_geonodes_add_scatter_setup",
        "bl_geonodes_add_array_setup",
        "bl_geonodes_add_deform_node",
        "bl_geonodes_add_curve_setup",
        "bl_geonodes_list_tree",

        # bl_texture_paint (プラグイン側に対応なし)
        "bl_tpaint_apply_stroke",
        "bl_tpaint_fill_layer",
        "bl_tpaint_save_image",

        # bl_render (プラグイン側に対応なし)
        "bl_render_add_aov",
        "bl_render_toggle_compositor",
        "bl_render_add_view_layer",

        # bl_uv (プラグイン側に対応なし)
        "bl_uv_rotate",
        "bl_uv_scale",

        # bl_vse (プラグイン側に対応なし)
        "bl_vse_add_transition",
        "bl_vse_cut_strip",
        "bl_vse_set_strip_properties",
        "bl_vse_render_animation",

        # bl_particle (プラグイン側に対応なし)
        "bl_particle_set_gravity",
        "bl_particle_set_render",

        # bl_node (プラグイン側に対応なし)
        "bl_node_delete",
        "bl_node_arrange",
        "bl_node_add_mix",
        "bl_node_add_tex_coord",
        "bl_node_set_output",

        # bl_armature (プラグイン側のIDと不一致)
        "bl_armature_delete_bone",
        "bl_armature_set_parent_bone",
        "bl_armature_weight_paint",
        "bl_armature_pose_mode",
        "bl_armature_add_constraint",
        "bl_armature_add_ik",
        "bl_armature_get_info",
    ])

    r = get_registered_count()
    a = get_alias_count()
    n = get_not_implemented_count()
    print(f"[ARCANA] {r} handlers + {a} aliases registered ({n} not-implemented tracked)")
