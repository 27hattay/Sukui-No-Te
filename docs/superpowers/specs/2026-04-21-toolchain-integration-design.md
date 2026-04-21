# Toolchain Integration Design
**Date:** 2026-04-21  
**Project:** Sukui No Te (救いの手)  
**Repo:** github.com/27hattay/sukui-no-te

## Goal

Wire Claude Code and Cursor into GitHub and Supabase via MCP servers, and verify the Vercel → GitHub auto-deploy pipeline is functioning correctly.

## Scope

- MCP server setup for Claude Code (global `~/.claude/settings.json`)
- MCP server setup for Cursor (`~/.cursor/mcp.json`)
- Vercel + GitHub pipeline verification

Out of scope: contact form, Supabase table creation, any site feature changes.

---

## Section 1: MCP Servers

Two MCP servers added globally so Claude Code and Cursor can interact with GitHub and Supabase directly from chat.

### GitHub MCP
- Package: `@modelcontextprotocol/server-github`
- Requires: GitHub Personal Access Token (classic, `repo` scope)
- Capabilities: read repos, create/read issues and PRs, push files

### Supabase MCP
- Package: `@supabase/mcp-server-supabase`
- Project ref: `gcuvqqymvdzldndjrede`
- Requires: Supabase service role key (Settings → API in Supabase dashboard)
- Capabilities: create tables, run SQL, read/write rows, inspect schema

### Target configs

**Claude Code** — added to `~/.claude/settings.json` under `mcpServers`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref", "gcuvqqymvdzldndjrede"],
      "env": { "SUPABASE_SERVICE_ROLE_KEY": "<key>" }
    }
  }
}
```

**Cursor** — added to `~/.cursor/mcp.json` (same structure):
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "<token>" }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref", "gcuvqqymvdzldndjrede"],
      "env": { "SUPABASE_SERVICE_ROLE_KEY": "<key>" }
    }
  }
}
```

---

## Section 2: Vercel + GitHub Pipeline Verification

Vercel is already connected. This step confirms:

1. Vercel project is linked to `27hattay/sukui-no-te` on the `main` branch
2. Auto-deploy triggers on push to `main`
3. Live URL reflects the latest commit
4. No missing env vars blocking the build

No env vars are required for the current site (Supabase anon key is hardcoded in `supabase.js` — acceptable since anon keys are designed to be public-facing).

If misconfigured, fix and re-verify. If green, document the live URL.

---

## What the user needs to provide before implementation

| Item | Where to find it |
|---|---|
| GitHub PAT (classic, `repo` scope) | github.com → Settings → Developer Settings → Personal Access Tokens |
| Supabase service role key | supabase.com → Project → Settings → API → `service_role` |
