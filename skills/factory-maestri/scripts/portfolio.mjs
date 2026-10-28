#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
if (args.length !== 1 || args[0] === "--help") {
  console[args[0] === "--help" ? "log" : "error"](
    "Usage: node portfolio.mjs <factory-root>\nPrint a local portfolio snapshot as Markdown; writes no files.",
  );
  process.exit(args[0] === "--help" ? 0 : 1);
}
const root = resolve(args[0]);
try {
  for (const name of ["projects.yaml", "scripts/registry.sh"]) {
    if (!existsSync(join(root, name)))
      throw new Error(`Not a Factory: missing ${name}`);
  }
  const read = (section) =>
    execFileSync("bash", [join(root, "scripts/registry.sh"), section], {
      cwd: root,
      encoding: "utf8",
      timeout: 30000,
      stdio: ["ignore", "pipe", "pipe"],
    })
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((row) => row.split("\t"));
  const startups = read("startups");
  const tooling = read("tooling");
  const cell = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("|", "&#124;");
  console.log(
    [
      "# Factory Portfolio",
      "",
      "Snapshot from projects.yaml. Deployment labels are registry entries, not live health checks.",
      "",
      `${startups.length} startups · ${tooling.length} tooling repositories`,
      "",
      "| Startup | Deployment recorded | Local repository |",
      "| --- | --- | --- |",
      ...startups.map(
        ([name, , deployed]) =>
          `| ${cell(name)} | ${deployed === "true" ? "Yes" : "No"} | projects/startups/${cell(name)} |`,
      ),
      "",
      "## Tooling",
      "",
      ...tooling.map(
        ([name]) => `- ${cell(name)} — projects/tooling/${cell(name)}`,
      ),
      "",
    ].join("\n"),
  );
} catch (error) {
  // Do not echo parser diagnostics that might contain private registry values.
  console.error(
    error.message.startsWith("Not a Factory:")
      ? error.message
      : "Cannot read the Factory registry. Check scripts/registry.sh, YAML validity and yq installation.",
  );
  process.exitCode = 1;
}
