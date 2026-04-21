/**
 * One-off codemod: replace bridge.send + manual ToolResult with bridgeSendAsToolResult.
 * Skips recipe_pipeline.ts (chained sends). Re-run is safe (idempotent-ish).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsDir = path.join(__dirname, "../src/tools");

const SKIP = new Set(["recipe_pipeline.ts"]);

function addImport(src) {
  if (src.includes("bridgeSendAsToolResult")) return src;
  const needle = 'import { bridge } from "../bridge";';
  if (!src.includes(needle)) return src;
  return src.replace(
    needle,
    `${needle}\nimport { bridgeSendAsToolResult } from "../core/bridgeToolResult";`
  );
}

function transform(src, fname) {
  if (SKIP.has(fname) || !src.includes("bridge.send")) return src;
  let s = addImport(src);
  const orig = s;

  // { try { return await bridge.send("ed", "tool", params); } catch (error: any) { ... } }
  s = s.replace(
    /\{\s*try\s*\{\s*return\s+await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*\}\s*catch\s*\(error:\s*any\)\s*\{\s*return\s*\{\s*success:\s*false,\s*message:\s*`Error:\s*\$\{error\.message\}`\s*\};\s*\}\s*\}/g,
    "{ return bridgeSendAsToolResult(\"$1\", \"$2\", $3) }"
  );

  // Multiline: const result = await bridge.send ... return { success: true, message: ..., data: result }; catch (error|e)
  s = s.replace(
    /try\s*\{\s*\r?\n\s*const\s+result\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*\r?\n\s*return\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*result\s*\};\s*\r?\n\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*\r?\n\s*return\s*\{\s*success:\s*false,\s*message:\s*`(?:Failed|Error):\s*\$\{[^}]+\}`\s*\};\s*\r?\n\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts});`;
    }
  );

  // Multiline: const r = await ... return r ? { success: true, message: ..., data: r } : { success: false, message: "..." };
  s = s.replace(
    /try\s*\{\s*\r?\n\s*const\s+r\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*\r?\n\s*return\s+r\s*\?\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*r\s*\}\s*\r?\n\s*:\s*\{\s*success:\s*false,\s*message:\s*(?:"(?:\\.|[^"])*")\s*\};\s*\r?\n\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*\r?\n\s*return\s*\{\s*success:\s*false,\s*message:\s*`Error:\s*\$\{[^}]+\}`\s*\};\s*\r?\n\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts});`;
    }
  );

  // One-line: try { const r = await bridge.send(...); return { success: true, message: ..., data: r }; } catch (e: any) { return { success: false, message: e.message }; }
  s = s.replace(
    /try\s*\{\s*const\s+r\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*return\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*r\s*\};\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*return\s*\{\s*success:\s*false,\s*message:\s*\w+\.message\s*\};\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts})`;
    }
  );

  // One-line: try { const r = await ...; return r ? { success: true, message: ..., data: r } : { success: false, message: "..." }; } catch (error: any) { ... }
  s = s.replace(
    /try\s*\{\s*const\s+r\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*return\s*r\s*\?\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*r\s*\}\s*:\s*\{\s*success:\s*false,\s*message:\s*(?:"(?:\\.|[^"])*")\s*\};\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*return\s*\{\s*success:\s*false,\s*message:\s*`Error:\s*\$\{[^}]+\}`\s*\};\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts})`;
    }
  );

  // bl_execute style: const result ... return result ? { ... } : { ... };
  s = s.replace(
    /try\s*\{\s*\r?\n\s*const\s+result\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*\r?\n\s*return\s*result\s*\?\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*result\s*\}\s*\r?\n\s*:\s*\{\s*success:\s*false,\s*message:\s*(?:"(?:\\.|[^"])*")\s*\};\s*\r?\n\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*\r?\n\s*return\s*\{\s*success:\s*false,\s*message:\s*`Error:\s*\$\{[^}]+\}`\s*\};\s*\r?\n\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts});`;
    }
  );

  // Multiline: const result ... single-line return { success, message, data }; catch (e) { message: e.message }
  s = s.replace(
    /try\s*\{\s*\r?\n\s*const\s+result\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\{\}|\w+)\);\s*\r?\n\s*return\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*result\s*\};\s*\r?\n\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*\r?\n\s*return\s*\{\s*success:\s*false,\s*message:\s*\w+\.message\s*\};\s*\r?\n\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts});`;
    }
  );

  // Multiline expanded return (scene.ts style) + catch with template failure message
  s = s.replace(
    /try\s*\{\s*\r?\n\s*const\s+result\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*\r?\n\s*return\s*\{\s*\r?\n\s*success:\s*true,\s*\r?\n\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*\r?\n\s*data:\s*result\s*\r?\n\s*\};\s*\r?\n\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*\r?\n\s*return\s*\{\s*\r?\n\s*success:\s*false,\s*\r?\n\s*message:\s*`(?:[^\\`]|\\.)*`\s*\r?\n\s*\};\s*\r?\n\s*\}/g,
    (_, editor, plugin, pname, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: (_, ${pname}) => ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, ${opts});`;
    }
  );

  // try { const result ... const msg = ...; return { success: true, message: msg, data }; } catch
  s = s.replace(
    /try\s*\{\s*\r?\n\s*const\s+result\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*\r?\n\s*const\s+msg\s*=\s*([^;]+);\s*\r?\n\s*return\s*\{\s*success:\s*true,\s*message:\s*msg,\s*data:\s*result\s*\};\s*\r?\n\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*\r?\n\s*return\s*\{\s*success:\s*false,\s*message:\s*`(?:[^\\`]|\\.)*`\s*\};\s*\r?\n\s*\}/g,
    (_, editor, plugin, pname, msgExpr) =>
      `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, { successMessage: (_, ${pname}) => ${msgExpr} });`
  );

  // One-line: async () => { try { const r = await bridge.send(..., {}); ... } catch (e: any) { return { success: false, message: e.message }; } }
  s = s.replace(
    /handler:\s*async\s*\(\)\s*=>\s*\{\s*try\s*\{\s*const\s+r\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\{\})\);\s*return\s*\{\s*success:\s*true,\s*message:\s*((?:"(?:\\.|[^"])*")|(?:`(?:\\.|[^`])*`)),\s*data:\s*r\s*\};\s*\}\s*catch\s*\(\w+:\s*any\)\s*\{\s*return\s*\{\s*success:\s*false,\s*message:\s*\w+\.message\s*\};\s*\}\s*\}/g,
    (_, editor, plugin, emptyObj, msgLit) => {
      const opts = msgLit.startsWith("`")
        ? `{ successMessage: ${msgLit} }`
        : `{ successMessage: ${msgLit} }`;
      return `handler: async () => bridgeSendAsToolResult("${editor}", "${plugin}", ${emptyObj}, ${opts})`;
    }
  );

  // One-line: ternary success message (no outer backticks), e.g. p.play ? "Playing" : "Stopped"
  s = s.replace(
    /try\s*\{\s*const\s+r\s*=\s*await\s+bridge\.send\("(unity|blender|unreal)",\s*"([^"]+)",\s*(\w+)\);\s*return\s*r\s*\?\s*\{\s*success:\s*true,\s*message:\s*([^,]+?),\s*data:\s*r\s*\}\s*:\s*\{\s*success:\s*false,\s*message:\s*"Failed"\s*\};\s*\}\s*catch\s*\(error:\s*any\)\s*\{\s*return\s*\{\s*success:\s*false,\s*message:\s*`Error:\s*\$\{error\.message\}`\s*\};\s*\}/g,
    (_, editor, plugin, pname, msgExpr) =>
      `return bridgeSendAsToolResult("${editor}", "${plugin}", ${pname}, { successMessage: (_, ${pname}) => (${msgExpr}) })`
  );

  if (s === orig && !src.includes("bridgeSendAsToolResult")) return src;
  return s;
}

function main() {
  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".ts"));
  let changed = 0;
  for (const f of files) {
    const fp = path.join(toolsDir, f);
    const before = fs.readFileSync(fp, "utf8");
    const after = transform(before, f);
    if (after !== before) {
      fs.writeFileSync(fp, after);
      changed++;
      console.log("updated", f);
    }
  }
  console.log("done, files changed:", changed);
}

main();
