import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const helper = fileURLToPath(
  new URL("../skills/factory-maestri/scripts/portfolio.mjs", import.meta.url),
);
function factory(yaml) {
  const root = mkdtempSync(join(tmpdir(), "factory skills "));
  mkdirSync(join(root, "scripts"));
  cpSync(
    new URL("fixtures/registry.sh", import.meta.url),
    join(root, "scripts/registry.sh"),
  );
  if (yaml !== undefined) writeFileSync(join(root, "projects.yaml"), yaml);
  return root;
}
function run(root) {
  return spawnSync(process.execPath, [helper, root], { encoding: "utf8" });
}

test("GIVEN a populated Factory WHEN generating THEN every registry entry appears without exposing remotes or changing files", () => {
  const yaml = `projects:
  - name: alpha
    repo: https://example.invalid/private.git
    deployed: true
    url: alpha.example
    kubectl_context: private-context
  - name: beta
    repo: https://example.invalid/beta.git
tooling:
  - name: cli
    repo: https://example.invalid/cli.git
`;
  const root = factory(yaml);
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /2 startups · 1 tooling repositories/);
    assert.match(
      result.stdout,
      /alpha \| \[Open website\]\(https:\/\/alpha.example\) \| Yes/,
    );
    assert.match(result.stdout, /beta \| No website configured \| No/);
    assert.match(result.stdout, /projects\/tooling\/cli/);
    assert.doesNotMatch(result.stdout, /private-context|example.invalid/);
    assert.equal(readFileSync(join(root, "projects.yaml"), "utf8"), yaml);
    assert.deepEqual(readdirSync(root).sort(), ["projects.yaml", "scripts"]);
    writeFileSync(join(root, "projects.yaml"), "projects: []\ntooling: []\n");
    const refreshed = run(root);
    assert.equal(refreshed.status, 0, refreshed.stderr);
    assert.match(refreshed.stdout, /0 startups · 0 tooling repositories/);
    assert.doesNotMatch(refreshed.stdout, /alpha|beta/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

for (const [scenario, yaml] of [
  ["missing", undefined],
  ["malformed", "projects: [private-invalid-value"],
]) {
  test(`GIVEN a ${scenario} registry WHEN generating THEN fail without a partial portfolio or leaked YAML`, () => {
    const root = factory(yaml);
    try {
      const result = run(root);
      assert.equal(result.status, 1);
      assert.equal(result.stdout, "");
      assert.doesNotMatch(result.stderr, /private-invalid-value/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}

test("GIVEN special characters in registry names WHEN generating THEN Markdown cannot inject a new table column or HTML", () => {
  const root = factory(
    'projects:\n  - name: "demo|<tag>&"\n    repo: example\ntooling: []\n',
  );
  try {
    const result = run(root);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /demo&#124;&lt;tag&gt;&amp;/);
    assert.doesNotMatch(result.stdout, /<tag>/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("GIVEN no Factory argument WHEN invoking THEN print usage and fail", () => {
  const result = spawnSync(process.execPath, [helper], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
});

test("GIVEN websites and an undeployed startup WHEN planning portals THEN emit desktop and mobile views only for configured URLs", () => {
  const root = factory(
    "projects:\n  - name: alpha\n    repo: example\n    url: alpha.example\n  - name: beta\n    repo: example\ntooling: []\n",
  );
  try {
    const result = spawnSync(
      process.execPath,
      [helper, root, "--portals-json"],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(JSON.parse(result.stdout), [
      {
        name: "alpha Desktop",
        url: "https://alpha.example",
        width: 1440,
        height: 900,
        userAgent: "desktop",
      },
      {
        name: "alpha Mobile",
        url: "https://alpha.example",
        width: 390,
        height: 844,
        userAgent: "ios",
      },
    ]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

for (const domain of [
  "javascript:alert(1)",
  "https://alpha.example",
  "user:secret@alpha.example",
  "alpha.example/path",
  "alpha.example)bad",
]) {
  test(`GIVEN invalid hostname ${domain} WHEN generating THEN reject it without publishing a link`, () => {
    const root = factory(
      `projects:\n  - name: alpha\n    repo: example\n    url: "${domain}"\ntooling: []\n`,
    );
    try {
      const result = run(root);
      assert.equal(result.status, 1);
      assert.equal(result.stdout, "");
      assert.match(result.stderr, /Invalid website hostname/);
      assert.doesNotMatch(result.stderr, /secret@/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}
