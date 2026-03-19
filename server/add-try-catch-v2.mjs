import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const TOOLS_DIR = join("src", "tools");
const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith(".ts") && f !== "_template.ts");

let totalFixed = 0, totalFiles = 0;

for (const fileName of files) {
  const filePath = join(TOOLS_DIR, fileName);
  const content = readFileSync(filePath, "utf-8");

  if (/try\s*\{/.test(content)) {
    console.log(`[skip] ${fileName}`);
    continue;
  }

  // Split into lines for precise manipulation
  const lines = content.split("\n");
  const newLines = [];
  let fixCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match one-liner: handler: async (p) => { const r = await ... }
    const oneLineMatch = line.match(
      /^(\s*)handler:\s*async\s*\((\w+)\)\s*=>\s*\{(.+)\}(,?)$/
    );

    if (oneLineMatch && line.includes("await bridge.send") && !line.includes("try")) {
      const [, indent, param, body, comma] = oneLineMatch;
      newLines.push(`${indent}handler: async (${param}) => {`);
      newLines.push(`${indent}  try {`);
      // Split body by semicolons but keep them
      const statements = body.trim().split(/;\s*/).filter(s => s.trim());
      for (const stmt of statements) {
        newLines.push(`${indent}    ${stmt.trim()};`);
      }
      newLines.push(`${indent}  } catch (error: any) {`);
      newLines.push(`${indent}    return { success: false, message: \`Error: \${error.message}\` };`);
      newLines.push(`${indent}  }`);
      newLines.push(`${indent}}${comma}`);
      fixCount++;
      continue;
    }

    // Match multi-line handler start: handler: async (p) => {
    const multiStart = line.match(/^(\s*)handler:\s*async\s*\((\w+)\)\s*=>\s*\{\s*$/);
    if (multiStart && !line.includes("try")) {
      // Look ahead to find matching closing brace and check for bridge.send
      let braceCount = 1;
      let j = i + 1;
      const bodyLines = [];
      let hasBridgeSend = false;

      while (j < lines.length && braceCount > 0) {
        const l = lines[j];
        if (l.includes("bridge.send")) hasBridgeSend = true;
        for (const ch of l) {
          if (ch === "{") braceCount++;
          if (ch === "}") braceCount--;
        }
        if (braceCount > 0) {
          bodyLines.push(l);
        } else {
          // This is the closing line
          break;
        }
        j++;
      }

      if (hasBridgeSend) {
        const [, indent, param] = multiStart;
        const closingLine = lines[j] || "";
        const comma = closingLine.trim().endsWith("},") ? "," : "";

        newLines.push(`${indent}handler: async (${param}) => {`);
        newLines.push(`${indent}  try {`);
        for (const bl of bodyLines) {
          newLines.push(`  ${bl}`);
        }
        newLines.push(`${indent}  } catch (error: any) {`);
        newLines.push(`${indent}    return { success: false, message: \`Error: \${error.message}\` };`);
        newLines.push(`${indent}  }`);
        newLines.push(`${indent}}${comma}`);
        fixCount++;
        i = j; // skip processed lines
        continue;
      }
    }

    newLines.push(line);
  }

  if (fixCount > 0) {
    writeFileSync(filePath, newLines.join("\n"), "utf-8");
    console.log(`[fix] ${fileName}: ${fixCount} handlers`);
    totalFixed += fixCount;
    totalFiles++;
  } else {
    console.log(`[none] ${fileName}`);
  }
}

console.log(`\n[完了] ${totalFiles} files / ${totalFixed} handlers fixed`);
