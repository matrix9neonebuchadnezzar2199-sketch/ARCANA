import { readFileSync } from "fs";
import { join } from "path";

/**
 * MCP `initialize` / logs / bridge handshake — keep aligned with package.json `version`.
 */
function readPackageVersion(): string {
  try {
    const pkgPath = join(__dirname, "..", "package.json");
    const v = JSON.parse(readFileSync(pkgPath, "utf8"))?.version;
    return typeof v === "string" ? v : "0.1.0";
  } catch {
    return "0.1.0";
  }
}

export const ARCANA_SERVER_VERSION = readPackageVersion();
