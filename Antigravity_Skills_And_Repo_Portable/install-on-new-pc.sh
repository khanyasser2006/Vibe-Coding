#!/usr/bin/env bash
set -e

echo "======================================================================"
echo "   CINE GLACIER REPO & ANTIGRAVITY SKILLS - UNIX / MAC INSTALLER"
echo "======================================================================"
echo

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_GEMINI="$HOME/.gemini"
DEST_CONFIG="$DEST_GEMINI/config"
DEST_AGY="$DEST_GEMINI/antigravity"

echo "Target Destination: $DEST_GEMINI"
echo "Source:             $SCRIPT_DIR"
echo

mkdir -p "$DEST_CONFIG"
mkdir -p "$DEST_AGY/hooks"

# 1. Copy skills and configs
if [ -d "$SCRIPT_DIR/skills_and_configs/gemini_config" ]; then
    echo "[*] Copying Skills, Plugins, and Agents to $DEST_CONFIG..."
    cp -R "$SCRIPT_DIR/skills_and_configs/gemini_config/"* "$DEST_CONFIG/"
    echo "[OK] Skills & Plugins installed!"
fi

# 2. Copy hooks
if [ -d "$SCRIPT_DIR/skills_and_configs/antigravity_hooks" ]; then
    echo "[*] Copying Hooks to $DEST_AGY/hooks..."
    cp -R "$SCRIPT_DIR/skills_and_configs/antigravity_hooks/"* "$DEST_AGY/hooks/"
    echo "[OK] Antigravity hooks installed!"
fi

# 3. Copy settings
if [ -f "$SCRIPT_DIR/skills_and_configs/antigravity_settings/settings.json" ]; then
    cp "$SCRIPT_DIR/skills_and_configs/antigravity_settings/settings.json" "$DEST_AGY/settings.json"
    echo "[OK] Settings file copied!"
fi

# 4. Install repo
if [ -f "$SCRIPT_DIR/repo/package.json" ]; then
    echo "[*] Installing repository dependencies..."
    cd "$SCRIPT_DIR/repo"
    npm install
    echo "[OK] Repo ready!"
fi

echo
echo "======================================================================"
echo "Installation complete!"
echo "To run the app:"
echo "  cd repo && npm run dev"
echo "  OR"
echo "  cd repo && docker compose up"
echo "======================================================================"
