import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const TOOLS_DIR = join("src", "tools");
const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith(".ts") && f !== "_template.ts");

let totalFixed = 0;
let totalFiles = 0;

for (const fileName of files) {
  const filePath = join(TOOLS_DIR, fileName);
  let content = readFileSync(filePath, "utf-8");

  // Skip files that already have try/catch
  if (/try\s*\{/.test(content)) {
    console.log(`[skip] ${fileName} (already has try/catch)`);
    continue;
  }

  let fixCount = 0;

  // Pattern A: one-liner handler
  // handler: async (p) => { const r = await bridge.send(...); return r ? {...} : {...}; }
  content = content.replace(
    /handler:\s*async\s*\((\w+)\)\s*=>\s*\{\s*const\s+(\w+)\s*=\s*await\s+bridge\.send\(([^)]+)\);\s*return\s+\2\s*\?\s*\{([^}]+)\}\s*:\s*\{([^}]+)\};\s*\}/g,
    (match, param, resVar, sendArgs, successBody, failBody) => {
      fixCount++;
      return `handler: async (${param}) => { try { const ${resVar} = await bridge.send(${sendArgs}); return ${resVar} ? {${successBody}} : {${failBody}}; } catch (error: any) { return { success: false, message: \`Error: \${error.message}\` }; } }`;
    }
  );

  // Pattern B: multi-line handler without try/catch
  // Match handler blocks that have await bridge.send but no try
  content = content.replace(
    /handler:\s*async\s*\((\w+)\)\s*=>\s*\{([\s\S]*?await\s+bridge\.send\([\s\S]*?)\n(\s*)\}/g,
    (match, param, body, indent) => {
      // Don't double-wrap if already fixed by Pattern A
      if (body.includes("try {")) return match;
      fixCount++;
      const indented = body.split("\n").map(line => "  " + line).join("\n");
      return `handler: async (${param}) => {\n${indent}  try {${indented}\n${indent}  } catch (error: any) {\n${indent}    return { success: false, message: \`Error: \${error.message}\` };\n${indent}  }\n${indent}}`;
    }
  );

  if (fixCount > 0) {
    writeFileSync(filePath, content, "utf-8");
    console.log(`[fix] ${fileName}: ${fixCount} handlers wrapped`);
    totalFixed += fixCount;
    totalFiles++;
  } else {
    console.log(`[none] ${fileName}: no matching patterns found`);
  }
}

console.log(`\n[完了] ${totalFiles} files / ${totalFixed} handlers fixed`);
console.log("次: npm run build");
