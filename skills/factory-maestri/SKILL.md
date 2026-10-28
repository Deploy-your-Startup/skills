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
Factory's installed yq and a registry.sh supporting the `websites` command; generate the overview with the bundled helper:

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

## Website previews

For each configured website, add a named Desktop portal (1440×900) and a Mobile
portal (390×844, iOS user agent), arranged side by side per startup. Keep startups
without URLs in the linked overview as “No website configured”; never infer URLs
from repository names. The helper includes HTTPS links and can print a structured
plan with `--portals-json`. An older registry interface fails with an update
instruction rather than silently omitting websites. Update the Factory through
its reviewed template update process; do not silently replace owner scripts.

Use the installed Maestri portal skill/help for supported commands. In a real
Maestri terminal context, `maestri portal create URL "Name" --size 390x844` creates
one view; `maestri portal ua "Name" ios` sets mobile emulation. Check `maestri list`
first and reuse matching portals. Pass names/URLs as distinct process arguments,
never interpolate registry values into shell code. Outside Maestri, use the UI;
do not fabricate terminal identity or enable a network API just for setup.

### Required gallery layout

Treat layout as part of setup, not optional polish. Use registry order and a
repeatable two-column gallery of startup pairs. Within each pair put Desktop on
the left and Mobile on the right, with their top edges aligned. Use roughly
120 canvas units between devices, 360 between startup pairs and 240 between
rows (in addition to the full card height, including browser chrome). Never
stack portals at the default creation position. Keep the agent and notes in a
separate control area to the left, with at least 320 units of clear space before
the gallery. Grow the canvas vertically as the portfolio grows.

Group each desktop/mobile pair with the native Group command (Cmd+G on macOS)
and name it with an ordinal and startup name. Native group headings stay readable
at overview zoom; verify the group contains only its two intended portals.
Each pair needs a readable startup title and a clearly accessible website link. Keep
labels large enough to read at the overview zoom. Use concise notes for the
control area; expand the portfolio note so its website links are visible instead
of leaving a tiny scrolling card. Leave the initial view centered on the gallery
at the largest zoom that fits the complete overview. The owner can zoom into a
pair to read page text at normal scale; do not promise that every website's body
text can be read simultaneously in an overview.

Use supported native layout controls. The portal CLI creates and resizes views
but does not place them in this gallery. If positions are not exposed by the
installed CLI, arrange them through the UI. “Tidy” can separate overlaps but may
sort by dimensions: it does not preserve desktop/mobile pairs. After every move,
inspect the new state before reusing coordinates; canvas layout and zoom can
change. Do not report a finished gallery if UI access is unavailable.

Keep the gallery free of connection lines by default. Connect a preview to the
chosen agent only for a concrete browsing task, and remove temporary setup-agent
connections once creation is complete. Keep the persistent agent/brief connections
inside the control area. Confirm each portal's actual viewport and loading result;
distinguish a responsive preview from a full-page screenshot. Report unavailable
websites without bypassing TLS errors or changing production.

Before saving, visually inspect the whole canvas and one pair at readable zoom:
all registered websites have exactly two views, no overlaps, no clipped labels,
consistent alignment and spacing, the domain links are visible, and notes and
terminals do not cover previews. Save only after these checks pass. On refresh,
reuse existing pairs, preserve deliberate owner placement, and place new pairs
in the next free gallery slot. Never create a second stack of duplicate portals.

## Save and verify

Exclude temporary setup terminals and commands from the reusable template.
Save the terminal, both notes, website portals, groups and their connections as a workspace-scoped
Partitura named **Factory Portfolio**, unless the owner chooses another name.
Inspect the saved selection's Details: one terminal with its intended startup
command, two notes, two website portals per configured URL and the intended connections. Right-clicking a terminal can narrow a
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
