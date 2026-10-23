# Security Policy

## Supported Versions

Only the latest version deployed from the `main` branch is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x (main) | :white_check_mark: |
| < 1.0.0 | :x:                |

## Data Security & Integrity

- **Client-Side State**: All edits made inside the in-game Boss Mode CV Studio are strictly scoped to the visitor's local browser memory (`localStorage`). Visitors cannot overwrite, mutate, or alter the canonical master career record (`career-data.json`) or source repository.
- **Admin Verification**: Administrative JSON download is protected by employee CPF verification (`141604`).
- **Zero Remote Dependencies**: The core 16-bit visual art assets, sprite sheets, and audio synthesizers are generated procedurally on HTML5 canvas and Web Audio API with zero untrusted external asset pipelines.

## Reporting a Vulnerability

If you discover a security vulnerability or sensitive information exposure:

1. **Do not create a public GitHub issue.**
2. Please send a report directly to: **`tarafderrajdeep@gmail.com`**
3. Include detailed reproduction steps and affected components.
4. Reports are acknowledged within 48 hours.
