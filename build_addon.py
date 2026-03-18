"""
ARCANA Bridge - Single-file addon generator
Combines all blender-plugin files into one addon.py
"""
import os
import re

BASE = r"H:\TOOL\geminicli\ARCANA\blender-plugin"
OUT = r"H:\TOOL\geminicli\ARCANA\addon.py"

def read_file(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return f.read()

def strip_imports(code, remove_relative=True):
    """Remove relative imports and duplicate stdlib imports."""
    lines = code.split("\n")
    result = []
    for line in lines:
        stripped = line.strip()
        if remove_relative and stripped.startswith("from .."):
            continue
        if remove_relative and stripped.startswith("from ."):
            continue
        result.append(line)
    return "\n".join(result)

def extract_after_imports(code):
    """Get code after the docstring and imports block."""
    code = strip_imports(code)
    return code

# ============================================================
# Read all source files
# ============================================================
bpy_helpers = read_file(os.path.join(BASE, "utils", "bpy_helpers.py"))
command_router = read_file(os.path.join(BASE, "utils", "command_router.py"))
arcana_bridge = read_file(os.path.join(BASE, "arcana_bridge.py"))
init_file = read_file(os.path.join(BASE, "__init__.py"))

handler_dir = os.path.join(BASE, "handlers")
char_dir = os.path.join(handler_dir, "character")

handler_files = sorted([
    f for f in os.listdir(handler_dir)
    if f.endswith(".py") and f != "__init__.py"
])

char_files = sorted([
    f for f in os.listdir(char_dir)
    if f.endswith(".py") and f != "__init__.py"
])

handlers_init = read_file(os.path.join(handler_dir, "__init__.py"))

# ============================================================
# Build addon.py
# ============================================================
output = []

# 1. bl_info
output.append('"""')
output.append('ARCANA Bridge - Single-file Blender Add-on')
output.append('Auto-generated from blender-plugin/ sources.')
output.append('Connects Blender to ARCANA MCP Server via WebSocket.')
output.append('"""')
output.append('')
output.append('bl_info = {')
output.append('    "name": "ARCANA Bridge",')
output.append('    "author": "ARCANA Project",')
output.append('    "version": (6, 1, 0),')
output.append('    "blender": (3, 6, 0),')
output.append('    "location": "View3D > Sidebar > ARCANA",')
output.append('    "description": "Connect Blender to ARCANA MCP Server via WebSocket",')
output.append('    "category": "Development",')
output.append('}')
output.append('')

# 2. All imports
output.append('import bpy')
output.append('import mathutils')
output.append('import json')
output.append('import threading')
output.append('import time')
output.append('import queue')
output.append('import socket')
output.append('import struct')
output.append('import hashlib')
output.append('import base64')
output.append('import os')
output.append('import math')
output.append('import traceback')
output.append('import io')
output.append('from contextlib import redirect_stdout')
output.append('from bpy.props import StringProperty, IntProperty, BoolProperty')
output.append('')

# 3. bpy_helpers (strip docstring header and imports)
output.append('# ' + '='*60)
output.append('# bpy_helpers')
output.append('# ' + '='*60)
helpers = strip_imports(bpy_helpers)
# Remove duplicate imports already declared
for line in helpers.split("\n"):
    s = line.strip()
    if s.startswith("import bpy") or s.startswith("import mathutils"):
        continue
    output.append(line)
output.append('')

# 4. command_router
output.append('# ' + '='*60)
output.append('# command_router')
output.append('# ' + '='*60)
router = strip_imports(command_router)
for line in router.split("\n"):
    output.append(line)
output.append('')

# 5. All handlers
for hf in handler_files:
    mod_name = hf.replace(".py", "")
    output.append('# ' + '='*60)
    output.append(f'# Handler: {mod_name}')
    output.append('# ' + '='*60)
    code = read_file(os.path.join(handler_dir, hf))
    code = strip_imports(code)
    for line in code.split("\n"):
        s = line.strip()
        if s.startswith("import bpy") or s.startswith("import math"):
            continue
        output.append(line)
    output.append('')

# 6. Character handlers
for cf in char_files:
    mod_name = cf.replace(".py", "")
    output.append('# ' + '='*60)
    output.append(f'# Character Handler: {mod_name}')
    output.append('# ' + '='*60)
    code = read_file(os.path.join(char_dir, cf))
    code = strip_imports(code)
    for line in code.split("\n"):
        s = line.strip()
        if s.startswith("import bpy") or s.startswith("import math"):
            continue
        output.append(line)
    output.append('')

# 7. register_all from handlers/__init__.py - extract aliases and not_implemented
output.append('# ' + '='*60)
output.append('# register_all_handlers')
output.append('# ' + '='*60)
output.append('def register_all_handlers():')
output.append('    """Register all tool handlers, aliases, and not-implemented."""')
output.append('    modules_routes = [')
for hf in handler_files:
    mod_name = hf.replace(".py", "")
    fn = f"{mod_name.replace('_handler','')}_get_routes"
    output.append(f'        {mod_name}_get_routes,')
output.append('    ]')
# Actually, all handlers use get_routes() function name, so we collect them
# Let's use a different approach - just call get_routes for each known module

# Rewrite: collect all get_routes calls
output.pop()  # remove modules_routes end
while output[-1].strip().startswith('modules_routes') or output[-1].strip().endswith('_get_routes,'):
    output.pop()
output.pop()  # remove modules_routes = [

# Simpler approach: list all get_routes functions by handler name
# Since they share function names, we need to rename them
# Actually the problem is all handlers define get_routes() with the same name

# We need to rename get_routes in each handler to unique names
# Let's go back and fix this

print("NOTE: All handler files define get_routes() - need unique names!")
print("Renaming get_routes -> <module>_get_routes in output...")

# Go back through output and rename get_routes functions
renamed_output = []
current_handler = None
for line in output:
    if line.startswith('# Handler: ') or line.startswith('# Character Handler: '):
        current_handler = line.split(': ')[1].strip()
    if current_handler and line.strip().startswith('def get_routes('):
        line = line.replace('def get_routes(', f'def {current_handler}_get_routes(')
    renamed_output.append(line)

output = renamed_output

# Now write register_all_handlers
output.append('def register_all_handlers():')
output.append('    """Register all tool handlers, aliases, and not-implemented."""')

all_handlers = [hf.replace(".py","") for hf in handler_files] + [cf.replace(".py","") for cf in char_files]
for h in all_handlers:
    output.append(f'    register_routes({h}_get_routes())')

# Extract aliases and not_implemented from handlers/__init__.py
in_aliases = False
in_not_impl = False
paren_depth = 0
for line in handlers_init.split("\n"):
    if "register_aliases({" in line:
        in_aliases = True
        output.append('    register_aliases({')
        continue
    if "register_not_implemented([" in line:
        in_not_impl = True
        output.append('    register_not_implemented([')
        continue
    if in_aliases:
        output.append('    ' + line)
        if line.strip() == '})':
            in_aliases = False
    if in_not_impl:
        output.append('    ' + line)
        if line.strip() == '])':
            in_not_impl = False

output.append('    r = get_registered_count()')
output.append('    a = get_alias_count()')
output.append('    n = get_not_implemented_count()')
output.append('    print(f"[ARCANA] {r} handlers + {a} aliases registered ({n} not-implemented tracked)")')
output.append('')

# 8. execute_code tool (NEW - inspired by BlenderMCP)
output.append('# ' + '='*60)
output.append('# execute_code tool (BlenderMCP inspired)')
output.append('# ' + '='*60)
output.append('def bl_execute_code(params):')
output.append('    """Execute arbitrary Python code in Blender. Use with caution."""')
output.append('    code = params.get("code", "")')
output.append('    if not code:')
output.append('        raise ValueError("No code provided")')
output.append('    namespace = {"bpy": bpy, "mathutils": mathutils}')
output.append('    capture = io.StringIO()')
output.append('    with redirect_stdout(capture):')
output.append('        exec(code, namespace)')
output.append('    return {"executed": True, "output": capture.getvalue()}')
output.append('')

# 9. ArcanaBridge class (from arcana_bridge.py, stripped)
output.append('# ' + '='*60)
output.append('# ArcanaBridge')
output.append('# ' + '='*60)
bridge_code = strip_imports(arcana_bridge)
for line in bridge_code.split("\n"):
    s = line.strip()
    if s.startswith("import ") or s.startswith("from "):
        continue
    # Fix: route_command is now in global scope
    if "from .utils.command_router import route_command" in s:
        continue
    output.append(line)
output.append('')

# 10. UI classes (from __init__.py)
output.append('# ' + '='*60)
output.append('# UI Panel & Operators')
output.append('# ' + '='*60)
output.append('')
output.append('class ArcanaPreferences(bpy.types.AddonPreferences):')
output.append('    bl_idname = __name__')
output.append('    host: StringProperty(name="Host", default="localhost")')
output.append('    port: IntProperty(name="Port", default=9879, min=1024, max=65535)')
output.append('    auto_connect: BoolProperty(name="Auto Connect on Startup", default=False)')
output.append('    def draw(self, context):')
output.append('        layout = self.layout')
output.append('        layout.prop(self, "host")')
output.append('        layout.prop(self, "port")')
output.append('        layout.prop(self, "auto_connect")')
output.append('')
output.append('class ARCANA_PT_MainPanel(bpy.types.Panel):')
output.append('    bl_label = "ARCANA"')
output.append('    bl_idname = "ARCANA_PT_main"')
output.append('    bl_space_type = "VIEW_3D"')
output.append('    bl_region_type = "UI"')
output.append('    bl_category = "ARCANA"')
output.append('    def draw(self, context):')
output.append('        layout = self.layout')
output.append('        bridge = get_bridge()')
output.append('        if bridge and bridge.connected:')
output.append('            layout.label(text="Status: Connected", icon="LINKED")')
output.append('            layout.operator("arcana.disconnect", text="Disconnect", icon="UNLINKED")')
output.append('            layout.label(text=f"Tools: {bridge.tool_count}")')
output.append('            layout.label(text=f"Commands: {bridge.cmd_count}")')
output.append('        else:')
output.append('            layout.label(text="Status: Disconnected", icon="UNLINKED")')
output.append('            layout.operator("arcana.connect", text="Connect", icon="LINKED")')
output.append('')
output.append('class ARCANA_OT_Connect(bpy.types.Operator):')
output.append('    bl_idname = "arcana.connect"')
output.append('    bl_label = "Connect to ARCANA"')
output.append('    def execute(self, context):')
output.append('        prefs = context.preferences.addons[__name__].preferences')
output.append('        connect(prefs.host, prefs.port)')
output.append('        self.report({"INFO"}, f"Connecting to ARCANA at {prefs.host}:{prefs.port}")')
output.append('        return {"FINISHED"}')
output.append('')
output.append('class ARCANA_OT_Disconnect(bpy.types.Operator):')
output.append('    bl_idname = "arcana.disconnect"')
output.append('    bl_label = "Disconnect from ARCANA"')
output.append('    def execute(self, context):')
output.append('        disconnect()')
output.append('        self.report({"INFO"}, "Disconnected from ARCANA")')
output.append('        return {"FINISHED"}')
output.append('')

# 11. register / unregister
output.append('_classes = (ArcanaPreferences, ARCANA_PT_MainPanel, ARCANA_OT_Connect, ARCANA_OT_Disconnect)')
output.append('')
output.append('def register():')
output.append('    for cls in _classes:')
output.append('        bpy.utils.register_class(cls)')
output.append('    register_handlers()')
output.append('    register_all_handlers()')
output.append('    register_route("bl_execute_code", bl_execute_code)')
output.append('    print("[ARCANA] Single-file addon registered")')
output.append('')
output.append('def unregister():')
output.append('    disconnect()')
output.append('    unregister_handlers()')
output.append('    for cls in reversed(_classes):')
output.append('        bpy.utils.unregister_class(cls)')
output.append('    print("[ARCANA] Single-file addon unregistered")')
output.append('')
output.append('if __name__ == "__main__":')
output.append('    register()')

# Write
with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(output))

print(f"Generated: {OUT}")
print(f"Lines: {len(output)}")
