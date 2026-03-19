const fs = require('fs');
let a = fs.readFileSync('H:/TOOL/geminicli/ARCANA/addon.py', 'utf8');

// Find the bl_char_create_base function and fix the path resolution
const oldPattern = /addon_dir = os\.path\.dirname\(os\.path\.realpath\(__file__\)\)\s*\n\s*blend_path = os\.path\.join\(\s*\n\s*addon_dir,\s*"\.\.?",\s*"assets",\s*"human-base-meshes",\s*\n\s*"human-base-meshes-bundle-v1\.4\.1",\s*\n\s*"human_base_meshes_bundle\.blend"\s*\n\s*\)/s;

const newCode = `# Try multiple paths to find base mesh assets
    _possible_paths = [
        os.path.join(os.path.dirname(os.path.realpath(__file__)), "..", "assets", "human-base-meshes", "human-base-meshes-bundle-v1.4.1", "human_base_meshes_bundle.blend"),
        os.path.join(os.path.dirname(os.path.realpath(__file__)), "assets", "human-base-meshes", "human-base-meshes-bundle-v1.4.1", "human_base_meshes_bundle.blend"),
        r"H:\\TOOL\\geminicli\\ARCANA\\assets\\human-base-meshes\\human-base-meshes-bundle-v1.4.1\\human_base_meshes_bundle.blend",
    ]
    blend_path = None
    for _p in _possible_paths:
        if os.path.exists(_p):
            blend_path = _p
            break
    if blend_path is None:
        blend_path = _possible_paths[-1]`;

if (oldPattern.test(a)) {
    a = a.replace(oldPattern, newCode);
    fs.writeFileSync('H:/TOOL/geminicli/ARCANA/addon.py', a, 'utf8');
    console.log('[OK] Path resolution fixed (regex match)');
} else {
    console.log('[WARN] Regex did not match. Searching manually...');
    
    // Find the line and do a simpler replacement
    const lines = a.split('\n');
    let startIdx = -1;
    let endIdx = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('addon_dir = os.path.dirname(os.path.realpath(__file__))') && startIdx === -1) {
            // Check if this is inside bl_char_create_base
            let found = false;
            for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
                if (lines[j].includes('bl_char_create_base')) { found = true; break; }
            }
            if (!found) continue;
            startIdx = i;
        }
        if (startIdx >= 0 && lines[i].includes('human_base_meshes_bundle.blend')) {
            endIdx = i;
            break;
        }
    }
    
    if (startIdx >= 0 && endIdx >= 0) {
        // Get indentation
        const indent = lines[startIdx].match(/^(\s*)/)[1];
        const replacement = [
            indent + '# Try multiple paths to find base mesh assets',
            indent + '_possible_paths = [',
            indent + '    os.path.join(os.path.dirname(os.path.realpath(__file__)), "..", "assets", "human-base-meshes", "human-base-meshes-bundle-v1.4.1", "human_base_meshes_bundle.blend"),',
            indent + '    os.path.join(os.path.dirname(os.path.realpath(__file__)), "assets", "human-base-meshes", "human-base-meshes-bundle-v1.4.1", "human_base_meshes_bundle.blend"),',
            indent + '    r"H:\\TOOL\\geminicli\\ARCANA\\assets\\human-base-meshes\\human-base-meshes-bundle-v1.4.1\\human_base_meshes_bundle.blend",',
            indent + ']',
            indent + 'blend_path = None',
            indent + 'for _p in _possible_paths:',
            indent + '    if os.path.exists(_p):',
            indent + '        blend_path = _p',
            indent + '        break',
            indent + 'if blend_path is None:',
            indent + '    blend_path = _possible_paths[-1]',
        ];
        
        lines.splice(startIdx, endIdx - startIdx + 1, ...replacement);
        fs.writeFileSync('H:/TOOL/geminicli/ARCANA/addon.py', lines.join('\n'), 'utf8');
        console.log(`[OK] Path resolution fixed (lines ${startIdx + 1}-${endIdx + 1} replaced)`);
    } else {
        console.log('[FAIL] Could not find path code.');
        console.log('startIdx:', startIdx, 'endIdx:', endIdx);
        // Show context around human_base_meshes_bundle.blend
        const idx = a.indexOf('human_base_meshes_bundle.blend');
        if (idx >= 0) {
            console.log('Context around blend path:');
            console.log(a.substring(Math.max(0, idx - 400), idx + 100));
        }
    }
}
