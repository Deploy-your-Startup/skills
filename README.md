# Deploy Your Startup skills

Optional agent skills for Startup Factory. Install only the integrations you
want; the base Factory does not require Maestri.

| Skill                                              | Purpose                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [factory-maestri](skills/factory-maestri/SKILL.md) | Set up a local portfolio canvas with Claude, connected notes and a reusable Partitura |

## Install

From the Factory root, with Node.js/npm installed:

```sh
npx --yes skills@1.7.4 add Deploy-your-Startup/skills --skill factory-maestri -a claude-code -a codex --copy -y
```

This installs into the project, not globally. Start a new agent session and ask:
“Use factory-maestri to set up this Factory in Maestri.” Add only the agents you
use with `-a`. To review the feature before merge, replace the source with the
local checkout path or `https://github.com/Deploy-your-Startup/skills/tree/feat/maestri-factory`.

Installation adds instructions and a helper; it does not install Maestri, sign
into Claude, launch an agent or alter your canvas. Invoke the skill for setup.
The helper needs Node.js 24+, the Factory's registry interface and yq. Maestri
and the chosen coding agent must be installed for canvas setup. Complete account
authentication in the agent's own login flow.

The deployment skill remains bundled with the Startup CLI through
`startup skills install`. Maestri's own vendor skills are not copied here.

## Verify and contribute

```sh
mise install
npm ci
mise run lint
mise run test
```

Tests run the helper against the real Factory registry reader with neutral
populated, empty, missing and malformed registries. They check the snapshot,
read-only behavior and failure behavior. The fixture reader is from the MIT
licensed Factory template at revision
`1b234110588fbc79fc244c57653b66bcd1bed7dd`.

Native-app checks are separate: confirm the workspace path, inspect the saved
Partitura's terminal/notes/connections, find it in the library, and request an
authenticated agent response. The initial local trial verified workspace and
Partitura creation; the authenticated response remained blocked by login.
No automated native-app or paid-provider E2E is claimed.

Keep helpers and references within each skill so installation copies everything
it needs. Submit changes through pull requests, with lint/test evidence and
remaining manual checks. Never include personal registry data or exported canvases.
