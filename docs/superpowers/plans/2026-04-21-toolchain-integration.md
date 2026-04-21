# Toolchain Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Claude Code and Cursor to GitHub and Supabase via MCP servers, and verify the Vercel auto-deploy pipeline.

**Architecture:** MCP servers are configured globally so both Claude Code and Cursor can call GitHub and Supabase APIs directly from chat. Vercel is already linked to GitHub; we verify it's deploying correctly.

**Tech Stack:** Claude Code MCP (`~/.claude/settings.json`), Cursor MCP (`~/.cursor/mcp.json`), `@modelcontextprotocol/server-github`, `@supabase/mcp-server-supabase`, Vercel CLI / dashboard.

---

### Task 1: Add MCP servers to Claude Code

**Files:**
- Modify: `C:/Users/user/.claude/settings.json`

- [ ] **Step 1: Read current settings**

Open `C:/Users/user/.claude/settings.json`. Current contents:
```json
{
  "enabledPlugins": {
    "playwright@claude-plugins-official": true,
    "superpowers@claude-plugins-official": true,
    "context7@claude-plugins-official": true
  },
  "extraKnownMarketplaces": {
    "claude-plugins-official": {
      "source": {
        "source": "git",
        "url": "https://github.com/anthropics/claude-plugins-official.git"
      }
    }
  },
  "autoUpdatesChannel": "latest"
}
```

- [ ] **Step 2: Add mcpServers block**

Replace the file contents with (substituting real token values):
```json
{
  "enabledPlugins": {
    "playwright@claude-plugins-official": true,
    "superpowers@claude-plugins-official": true,
    "context7@claude-plugins-official": true
  },
  "extraKnownMarketplaces": {
    "claude-plugins-official": {
      "source": {
        "source": "git",
        "url": "https://github.com/anthropics/claude-plugins-official.git"
      }
    }
  },
  "autoUpdatesChannel": "latest",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<GITHUB_PAT>"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref", "gcuvqqymvdzldndjrede"],
      "env": {
        "SUPABASE_SERVICE_ROLE_KEY": "<SUPABASE_SERVICE_ROLE_KEY>"
      }
    }
  }
}
```

- [ ] **Step 3: Verify MCP servers load**

Run:
```bash
claude mcp list
```
Expected output lists both `github` and `supabase` as connected servers.

---

### Task 2: Add MCP servers to Cursor

**Files:**
- Create: `C:/Users/user/.cursor/mcp.json`

- [ ] **Step 1: Create mcp.json**

Create `C:/Users/user/.cursor/mcp.json` with:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<GITHUB_PAT>"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref", "gcuvqqymvdzldndjrede"],
      "env": {
        "SUPABASE_SERVICE_ROLE_KEY": "<SUPABASE_SERVICE_ROLE_KEY>"
      }
    }
  }
}
```

- [ ] **Step 2: Restart Cursor**

Close and reopen Cursor. Navigate to Settings → MCP (or check the MCP panel) to confirm both servers appear as connected.

---

### Task 3: Verify Vercel pipeline

**Files:** none

- [ ] **Step 1: Check latest deployment**

Visit https://vercel.com/dashboard and confirm the `sukui-no-te` project shows a successful deployment from the latest commit on `main`.

- [ ] **Step 2: Test auto-deploy**

Make a trivial change in the repo (e.g. add a comment to `style.css`), push to `main`:
```bash
cd C:/Users/user/projects/sukui-no-te
git add style.css
git commit -m "chore: verify vercel auto-deploy"
git push origin main
```

- [ ] **Step 3: Confirm deployment triggered**

In the Vercel dashboard, a new deployment should appear within ~30 seconds and reach "Ready" status. Note the live URL.

- [ ] **Step 4: Revert trivial change (optional)**

If the comment added in Step 2 was noise, revert it:
```bash
git revert HEAD --no-edit
git push origin main
```

---

## Tokens reference (do not commit — apply directly to config files)

| Key | Where used |
|---|---|
| GitHub PAT | `GITHUB_PERSONAL_ACCESS_TOKEN` in both config files |
| Supabase service role key | `SUPABASE_SERVICE_ROLE_KEY` in both config files |
