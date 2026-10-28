#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";

const args = process.argv.slice(2);
if (
  ![1, 2].includes(args.length) ||
  (args.length === 2 && args[1] !== "--portals-json") ||
  args[0] === "--help"
) {
  console[args[0] === "--help" ? "log" : "error"](
    "Usage: node portfolio.mjs <factory-root> [--portals-json]\nPrint a linked portfolio or desktop/mobile portal plan; writes no files.",
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
  let websites;
  try {
    websites = new Map(read("websites"));
  } catch {
    throw new Error(
      "Website registry interface unavailable. Update the Factory registry.sh to a version supporting websites.",
    );
  }
  const website = (name) => {
    const domain = websites.get(name);
    if (!domain) return null;
    // The Factory registry stores bare public hostnames, never credentials or paths.
    if (
      !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(
        domain,
      )
    ) {
      throw new Error(
        "Invalid website hostname in registry. Use a bare public domain without scheme, path or credentials.",
      );
    }
    return `https://${domain.toLowerCase()}`;
  };
  const urls = new Map(startups.map(([name]) => [name, website(name)]));
  if (args[1] === "--portals-json") {
    console.log(
      JSON.stringify(
        startups.flatMap(([name]) => {
          const url = urls.get(name);
          return url
            ? [
                {
                  name: `${name} Desktop`,
                  url,
                  width: 1440,
                  height: 900,
                  userAgent: "desktop",
                },
                {
                  name: `${name} Mobile`,
                  url,
                  width: 390,
                  height: 844,
                  userAgent: "ios",
                },
              ]
            : [];
        }),
        null,
        2,
      ),
    );
    process.exit(0);
  }
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
      "| Startup | Website | Deployment recorded | Local repository |",
      "| --- | --- | --- | --- |",
      ...startups.map(
        ([name, , deployed]) =>
          `| ${cell(name)} | ${urls.get(name) ? `[Open website](${urls.get(name)})` : "No website configured"} | ${deployed === "true" ? "Yes" : "No"} | projects/startups/${cell(name)} |`,
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
    /^(Not a Factory:|Website registry interface|Invalid website hostname)/.test(
      error.message,
    )
      ? error.message
      : "Cannot read the Factory registry. Check scripts/registry.sh, YAML validity and yq installation.",
  );
  process.exitCode = 1;
}
