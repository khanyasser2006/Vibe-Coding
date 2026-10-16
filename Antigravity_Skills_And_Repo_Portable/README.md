# 📦 Ciné Haute Glacerie & Antigravity Skills Portable Migration Package

This package contains **everything** needed to transfer the **Ciné Haute Glacerie** web application and all **82+ Antigravity/Gemini Skills, Plugins, and Agents** to another PC.

---

## 📁 Package Contents

```text
Antigravity_Export_Bundle/
├── repo/                             # Complete project codebase (clean, without node_modules)
│   ├── src/                          # All components, pages, data, context, animations
│   ├── public/                       # Images, videos, 60fps frame sequences, icons
│   ├── Dockerfile                    # Container configuration for Docker deployment
│   ├── docker-compose.yml            # Container orchestration config
│   ├── package.json                  # Dependencies (Vite 6.4.3, React 18, GSAP, Tailwind)
│   └── vite.config.js                # Hardened configuration & security headers
├── skills_and_configs/               # All installed Antigravity customizations
│   ├── gemini_config/
│   │   ├── skills/                   # 82+ custom skills (GSD core, taste, impeccable, etc.)
│   │   ├── plugins/                  # Installed plugins (science, chrome-devtools, etc.)
│   │   ├── agents/                   # Agent prompts and roles
│   │   └── config.json               # Plugin registry and permissions
│   ├── antigravity_hooks/            # GSD session, commit, and boundary hooks
│   └── antigravity_settings/         # Antigravity IDE settings & MCP configs
├── install-on-new-pc.bat             # ⚡ One-click installer for Windows
├── install-on-new-pc.ps1             # ⚡ PowerShell installer for Windows
├── install-on-new-pc.sh              # ⚡ Shell installer for macOS / Linux
├── run-app.bat                       # 🚀 One-click dev server launcher
└── README.md                         # This file
```

---

## 🚀 How to Install on Your New PC

### Option 1: One-Click Windows Setup (Recommended)
1. Copy this folder or the `.zip` archive to your new PC and extract it.
2. Double-click **`install-on-new-pc.bat`** (or right-click `install-on-new-pc.ps1` -> *Run with PowerShell*).
3. The script will:
   - Copy all 82+ skills, agents, and plugins to your new PC's `%USERPROFILE%\.gemini\` directory.
   - Set up the Antigravity hooks and settings.
   - Run `npm install` inside the `repo/` directory.
4. Double-click **`run-app.bat`** to start developing!

---

### Option 2: Docker Container (No Node.js Required)
If you have **Docker Desktop** installed on your new PC:
1. Open a terminal in the `repo/` directory:
   ```bash
   cd repo
   docker compose up --build
   ```
2. Open your browser at **`http://localhost:5173`**.

---

### Option 3: Manual Installation
1. **Restore Skills:**
   - Copy everything inside `skills_and_configs/gemini_config/` into `C:\Users\<YourUsername>\.gemini\config\` (or `~/.gemini/config/` on Mac/Linux).
   - Copy everything inside `skills_and_configs/antigravity_hooks/` into `C:\Users\<YourUsername>\.gemini\antigravity\hooks\`.
   - Copy `skills_and_configs/antigravity_settings/settings.json` into `C:\Users\<YourUsername>\.gemini\antigravity\settings.json`.
2. **Run the Repo:**
   ```bash
   cd repo
   npm install
   npm run dev
   ```

---

## 🛡️ Skills Included in this Bundle (82 Total)
- **GSD (Git. Ship. Done) Framework:** `gsd-new-project`, `gsd-plan-phase`, `gsd-execute-phase`, `gsd-verify-work`, `gsd-ship`, `gsd-autonomous`, `gsd-manager`, etc.
- **Roo Code Autonomous Framework:** Architect, Code, Ask, Debug, Issue Fixer, PR Fixer modes.
- **Ralph Loop:** Externalized autonomous state tracking (`PRD.md`, `progress.txt`).
- **Design & UI Intelligence:** `taste`, `impeccable`, `huashu-design`, `ui-ux-pro-max`, `smooth-video-scroll`.
- **Quality & Review:** `coderabbit-code-review`, `coderabbit-autofix`, `playwright-testing`.
- **Science & Research:** `alphafold`, `alphagenome`, `chembl`, `pubmed`, `uniprot`, `string-db`, and more.
