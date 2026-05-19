#!/usr/bin/env bash
set -euo pipefail

WORKSPACE_DIR="/workspaces/NextStepCV"

cd "$WORKSPACE_DIR"

echo "[devcontainer] Running post-create bootstrap..."

# Backend dependencies (Python)
if [ -f backend/requirements.txt ] && [ -s backend/requirements.txt ]; then
  echo "[devcontainer] Installing backend Python dependencies with uv..."
  uv pip install --system -r backend/requirements.txt
else
  echo "[devcontainer] Skipping backend dependency install (backend/requirements.txt missing or empty)."
fi

# Frontend dependencies (Node)
if [ -f frontend/package.json ]; then
  echo "[devcontainer] Installing frontend dependencies with pnpm..."
  cd frontend
  pnpm install
  cd "$WORKSPACE_DIR"
else
  echo "[devcontainer] Skipping frontend dependency install (frontend/package.json not found)."
fi

echo "[devcontainer] Post-create bootstrap completed."
