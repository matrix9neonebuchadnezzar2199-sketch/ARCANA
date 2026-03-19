import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const TOOLS_DIR = join("src", "tools");
const targets = [
  "bl_character_body.ts", "bl_character_export.ts", "bl_character_expression.ts",
  "bl_character_face.ts", "bl_character_hair.ts", "bl_character_material.ts",
  "image_to_3d.ts", "ue_metahuman.ts", "unity_vrchat.ts"
];

let totalFixed = 0, totalFiles = 0;

for (const fileName of targets) {
  const filePath = join(TOOLS_DIR, fileName);
  let content = readFileSync(filePath, "utf-8");
  let fixCount = 0;

  // Pattern A: arrow shorthand (no braces)
  // handler: async (params) => bridge.send(...),
  content = content.replace(
    /handler:\s*async\s*\((\w+)\)\s*=>\s*(bridge\.send\([^)]+\))\s*,/g,
    (match, param, sendCall) => {
      fixCount++;
      return `handler: async (${param}) => { try { return await ${sendCall}; } catch (error: any) { return { success: false, message: \`Error: \${error.message}\` }; } },`;
    }
  );

  // Pattern B: typed params handler: async (params: any) => {
  // Use balanced brace matching
  const handlerRegex = /handler:\s*async\s*\((\w+):\s*any\)\s*=>\s*\{/g;
  let match;
  const replacements = [];

  while ((match = handlerRegex.exec(content)) !== null) {
    const bodyStart = match.index + match[0].length;
    const param = match[1];
    let depth = 1, pos = bodyStart;
    while (pos < content.length && depth > 0) {
      if (content[pos] === "{") depth++;
      if (content[pos] === "}") depth--;
      if (depth > 0) pos++;
    }
    const body = content.substring(bodyStart, pos).trim();
    if (!body.includes("try {")) {
      replacements.push({
        from: bodyStart,
        to: pos,
        replacement: ` try { ${body} } catch (error: any) { return { success: false, message: \`Error: \${error.message}\` }; } `
      });
      fixCount++;
    }
  }

  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    content = content.substring(0, r.from) + r.replacement + content.substring(r.to);
  }

  if (fixCount > 0) {
    writeFileSync(filePath, content, "utf-8");
    console.log(`[fix] ${fileName}: ${fixCount} handlers`);
    totalFixed += fixCount;
    totalFiles++;
  } else {
    console.log(`[none] ${fileName}`);
  }
}

console.log(`\n[完了] ${totalFiles} files / ${totalFixed} handlers fixed`);
