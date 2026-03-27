#!/bin/bash
# === Daily Agent & Skill Collector ===
# Wird jeden Abend automatisch ausgeführt.
# Sammelt, sortiert und pusht via Claude Code CLI.

set -e

PROJECT_DIR="$HOME/plant-care-game"
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/daily-collect-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"

echo "=== Daily Collect: $(date) ===" | tee "$LOG_FILE"

# 1. Bash-Script sammelt die Rohdaten
echo "Schritt 1: Repos einsammeln..." | tee -a "$LOG_FILE"
cd "$PROJECT_DIR"
bash scripts/collect-agents.sh 2>&1 | tee -a "$LOG_FILE"

# 2. Claude Code CLI sortiert und pusht
echo "" | tee -a "$LOG_FILE"
echo "Schritt 2: Claude Code sortiert..." | tee -a "$LOG_FILE"
claude --print -p "/collect" 2>&1 | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "=== Fertig: $(date) ===" | tee -a "$LOG_FILE"
