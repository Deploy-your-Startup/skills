# Shared skills

Keep installable skills under skills/<name>/SKILL.md, with helpers beside the
skill. Use neutral fixtures; never commit owner portfolios, domains, credentials,
canvas exports or machine paths. Vendor-specific skills remain with their vendor.
The deployment skill stays in the CLI repository because it is versioned with
CLI behavior; this repository holds optional integrations.

Use feature branches and pull requests. Before completion run mise run lint and
mise run test. Tests must exercise actual helper processes and observable output.
Document manual native-app/authentication gaps separately from automated checks.
CI runs the same commands. No browser E2E applies to this command-line generator.
