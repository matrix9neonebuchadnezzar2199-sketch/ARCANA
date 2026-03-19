import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const TOOLS_DIR = join("src", "tools");
const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith(".ts") && f !== "_template.ts");
let totalFixed = 0, totalFiles = 0;

for (const fileName of files) {
  const filePath = join(TOOLS_DIR, fileName);
  let content = readFileSync(filePath, "utf-8");

  if (/try\s*\{/.test(content)) {
    console.log(`[skip] ${fileName}`);
    continue;
  }

  let fixCount = 0;

  // Strategy: find "handler: async (p) => {" then find the balanced closing "}"
  // Replace the body with try/catch wrapped version
  const handlerRegex = /handler:\s*async\s*\((\w+)\)\s*=>\s*\{/g;
  let match;
  const replacements = [];

  while ((match = handlerRegex.exec(content)) !== null) {
    const startIdx = match.index;
    const bodyStart = match.index + match[0].length;
    const param = match[1];

    // Find balanced closing brace
    let depth = 1;
    let pos = bodyStart;
    while (pos < content.length && depth > 0) {
      if (content[pos] === "{") depth++;
      if (content[pos] === "}") depth--;
      if (depth > 0) pos++;
    }
    // pos is now at the closing }

    const body = content.substring(bodyStart, pos).trim();

    // Only wrap if it has bridge.send and no try
    if (body.includes("bridge.send") && !body.includes("try {")) {
      const wrapped = ` try { ${body} } catch (error: any) { return { success: false, message: \`Error: \${error.message}\` }; } `;
      replacements.push({
        from: bodyStart,
        to: pos,
        replacement: wrapped
      });
      fixCount++;
    }
  }

  // Apply replacements in reverse order to preserve indices
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
