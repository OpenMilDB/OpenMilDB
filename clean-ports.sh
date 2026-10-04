#!/bin/bash

# Clear terminal screen
clear

echo "=========================================================="
echo "🔴 FORCE PURGING LOCKED OPENMILDB DEPLOYMENT PROCESSES"
echo "=========================================================="

# 1. Brutally clear whatever hidden process is hijacking port 3000
echo "🧹 Clearing network socket locks on port 3000..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is occupied. Requesting administrator authentication to break the network socket lock:"
    sudo kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    echo "✅ Port 3000 cleared."
else
    echo "✨ Port 3000 was already free."
fi

# 2. Sweep out all orphan Electron backend frame windows from memory
echo "💀 Terminating orphan Electron runtime environments..."
killall -9 Electron 2>/dev/null || true
echo "✅ Electron processes purged."

# 3. Sweep out any lingering dead-locked Node execution threads
echo "🛸 Sweeping out hanging Node execution threads..."
killall -9 node 2>/dev/null || true
echo "✅ Node thread processes wiped clean."

echo "=========================================================="
echo "🚀 SYSTEM RESET COMPLETE: RUN 'npx vite' TO START CLEAN"
echo "=========================================================="
