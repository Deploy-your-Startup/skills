---
name: factory-maestri
description: Set up or refresh a Startup Factory portfolio workspace in Maestri with a coding agent, registry overview, connected brief and reusable Partitura. Use when the owner requests this optional Factory integration, not for generic Maestri tasks or application scaffolding.
---

# Factory in Maestri

Create a local, reusable portfolio canvas rooted in the owner's Factory. Read
that Factory's AGENTS.md and VISION.md. The registry and canvas contents remain
owner data; this skill contains no portfolio defaults.

## Prepare the portfolio

Find the intended Factory root with projects.yaml and scripts/registry.sh.
Review the registry before executing its local script. Use Node.js 24+ and the
Factory's installed yq; generate the overview with the bundled helper:

```sh
node <installed-skill>/scripts/portfolio.mjs <factory-root>
```

The helper prints Markdown and writes nothing. Capture its output as a native
Maestri note. If a file is useful, save it only in a verified Git-ignored local
directory. Refresh by rerunning the helper and updating the existing note.
Deployment labels are registry assertions, not live health checks. Do not query
production or change registry deployment fields as part of canvas setup.

## Configure Maestri

Reuse a matching workspace and terminal before creating new ones. Resolve and
confirm the workspace's working directory; inline path editors may need Enter
before Save. Prefer Maestri's installed CLI and its local skills when available.
Run `maestri list` and `maestri workspace list` to discover accessible state.
These commands require a Maestri terminal context; the CLI being present does
not authorize fabricating a terminal identity or enabling Maestro privileges.
Outside Maestri, use the available native UI automation, or give the user the
specific remaining UI steps. Never invent or overwrite Maestri's private JSON
configuration. If the app is absent, install from its official website only
within the user's setup request: https://www.themaestri.app/.

Use the owner's requested coding agent, or Claude Code by default. Check that
the CLI is installed and inspect authentication without printing credentials.
Preserve the selected account and permission settings; do not add permission
bypass flags. A running terminal is not proof of authentication. If login is
needed, open the normal login flow and let the owner complete account steps.

For Claude, preserve an existing CLAUDE.md. If absent, add an `@AGENTS.md` import
with the owner's repository conventions. Do not enable automatic two-way file
sync over existing instructions.

Arrange one coding-agent terminal and two connected notes:

- **Portfolio:** the helper output, marked as a snapshot of the registry.
- **Start here:** a short task brief: read AGENTS.md, VISION.md, projects.yaml and
  connected notes; summarize the portfolio in the owner's language; ask which
  startup to work on before changing application code. Include the refresh
  command with the actual installed helper path.

A branch or floor of the hub does not isolate the separate repositories under
projects/. Before application edits, inspect that repository's status and rules
and choose appropriate isolation. Do not create branches just to view a portfolio.

## Save and verify

Save the terminal, both notes and both connections as a workspace-scoped
Partitura named **Factory Portfolio**, unless the owner chooses another name.
Inspect the saved selection's Details: one terminal with its intended startup
command, two notes and two connections. Right-clicking a terminal can narrow a
multi-selection; verify the actual saved contents. Do not duplicate an existing
Partitura on retry; update it when the user requested refresh, otherwise reuse it.

Verify the Partitura appears in the library and the workspace has the intended
directory. With authenticated Claude, request a short read-only summary of the
connected notes to test the connection. Do not claim that response was verified
when login is pending. Explain how to reopen the workspace and insert the saved
Partitura through the book icon. Inserting it starts another terminal: the
already configured workspace can be used directly without inserting a copy.

Report app installation, workspace/template creation and authenticated agent
verification separately. These are local setup checks, not deployment evidence.
Keep exported Partituras private when they embed portfolio notes.

For current UI/CLI differences consult the official [workspace guide](https://www.themaestri.app/en/docs/workspaces),
[connections](https://www.themaestri.app/en/docs/connections) and
[Partituras](https://www.themaestri.app/en/docs/partituras), or installed Maestri
skill/help documentation. Do not redistribute the vendor's skills in this repo.
