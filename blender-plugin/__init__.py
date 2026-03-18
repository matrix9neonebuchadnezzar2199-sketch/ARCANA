bl_info = {
    "name": "ARCANA Bridge",
    "author": "ARCANA Project",
    "version": (6, 0, 0),
    "blender": (3, 6, 0),
    "location": "View3D > Sidebar > ARCANA",
    "description": "Connect Blender to ARCANA MCP Server via WebSocket",
    "category": "Development",
}

import bpy
from bpy.props import StringProperty, IntProperty, BoolProperty
from . import arcana_bridge


class ArcanaPreferences(bpy.types.AddonPreferences):
    bl_idname = __package__

    host: StringProperty(name="Host", default="localhost")
    port: IntProperty(name="Port", default=9879, min=1024, max=65535)
    auto_connect: BoolProperty(name="Auto Connect on Startup", default=False)

    def draw(self, context):
        layout = self.layout
        layout.prop(self, "host")
        layout.prop(self, "port")
        layout.prop(self, "auto_connect")


class ARCANA_PT_MainPanel(bpy.types.Panel):
    bl_label = "ARCANA"
    bl_idname = "ARCANA_PT_main"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = "ARCANA"

    def draw(self, context):
        layout = self.layout
        bridge = arcana_bridge.get_bridge()

        if bridge and bridge.connected:
            layout.label(text="Status: Connected", icon='LINKED')
            layout.operator("arcana.disconnect", text="Disconnect", icon='UNLINKED')
            layout.label(text=f"Tools: {bridge.tool_count}")
            layout.label(text=f"Commands executed: {bridge.cmd_count}")
        else:
            layout.label(text="Status: Disconnected", icon='UNLINKED')
            layout.operator("arcana.connect", text="Connect", icon='LINKED')


class ARCANA_OT_Connect(bpy.types.Operator):
    bl_idname = "arcana.connect"
    bl_label = "Connect to ARCANA"

    def execute(self, context):
        prefs = context.preferences.addons[__package__].preferences
        arcana_bridge.connect(prefs.host, prefs.port)
        self.report({'INFO'}, f"Connecting to ARCANA at {prefs.host}:{prefs.port}")
        return {'FINISHED'}


class ARCANA_OT_Disconnect(bpy.types.Operator):
    bl_idname = "arcana.disconnect"
    bl_label = "Disconnect from ARCANA"

    def execute(self, context):
        arcana_bridge.disconnect()
        self.report({'INFO'}, "Disconnected from ARCANA")
        return {'FINISHED'}


classes = (
    ArcanaPreferences,
    ARCANA_PT_MainPanel,
    ARCANA_OT_Connect,
    ARCANA_OT_Disconnect,
)


def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    arcana_bridge.register_handlers()
    from .handlers import register_all
    register_all()
    print("[ARCANA] Blender plugin registered")


def unregister():
    arcana_bridge.disconnect()
    arcana_bridge.unregister_handlers()
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
    print("[ARCANA] Blender plugin unregistered")


if __name__ == "__main__":
    register()

