#!/bin/bash
# ============================================================
# Yokota Fix - Deploy & Test Script
# Run this on the Linux server
# ============================================================

echo ""
echo "============================================================"
echo "  STEP 1: Pull latest changes"
echo "============================================================"

echo ""
echo "--- Pulling yokota_api ---"
cd /home/logiaborneo/yokota_api && git pull
echo ""
echo "--- Pulling dcs ---"
cd /home/logiaborneo/dcs && git pull

echo ""
echo "============================================================"
echo "  STEP 2: Restart PM2 services"
echo "============================================================"

echo ""
echo "--- Restarting yokota_api (port 8127) ---"
pm2 restart yokota_api
echo ""
echo "--- Restarting dcs ---"
pm2 restart dcs

echo ""
echo "--- Waiting 3 seconds for services to start ---"
sleep 3

echo ""
echo "--- PM2 status ---"
pm2 list

echo ""
echo "============================================================"
echo "  STEP 3: Test upstream 8127 service (station 59, date 20260819)"
echo "============================================================"

echo ""
echo "--- Checking 8127 health ---"
curl -s http://127.0.0.1:8127/health | python3 -m json.tool 2>/dev/null || echo "Health check failed"

echo ""
echo "--- Fetching station 59 data from 8127 (first 2 records) ---"
curl -s http://127.0.0.1:8127/api/station/59/date/20260819 | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    records = data.get('data', []) if isinstance(data, dict) else data
    print(f'Total records: {len(records)}')
    print(f'Files: {data.get(\"filePaths\", \"N/A\")}')
    for r in records[:2]:
        print(f'  controllerId={r.get(\"controllerId\",\"?\")} folder={r.get(\"folder\",\"?\")} torque={r.get(\"torque\",\"?\")} time={r.get(\"timeDate\",\"?\")}')
    if len(records) > 2:
        print(f'  ... and {len(records)-2} more records')
except Exception as e:
    print(f'Parse error: {e}')
" 2>/dev/null

echo ""
echo "============================================================"
echo "  STEP 4: Test DCS API for engine NG60753"
echo "============================================================"

echo ""
echo "--- Fetching Yokota data for NG60753 ---"
curl -s http://localhost:5081/api/yokota/NG60753 | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        print(f'Total matched records: {len(data)}')
        print('')
        # Group by tool
        tools = {}
        for r in data:
            key = r.get('tool_name', 'UNKNOWN')
            tools.setdefault(key, []).append(r)
        for tool_name, records in tools.items():
            folder = records[0].get('configured_folder', records[0].get('folder', '?'))
            station = records[0].get('station', '?')
            print(f'  Tool: {tool_name}')
            print(f'    Station={station} | Controller={folder} | Records={len(records)}')
            for r in records:
                print(f'      {r.get(\"timeDate\",\"?\")} | torque={r.get(\"torque\",\"?\")} | judgement={r.get(\"judgement\",\"?\")} | folder={r.get(\"folder\",\"?\")}')
            print('')
    elif isinstance(data, dict):
        print(f'Response: {json.dumps(data, indent=2)}')
    else:
        print(f'Unexpected: {data}')
except Exception as e:
    print(f'Parse error: {e}')
    print(sys.stdin.read())
" 2>/dev/null

echo ""
echo "============================================================"
echo "  STEP 5: Check for duplication (CRITICAL TEST)"
echo "============================================================"

echo ""
echo "--- Checking if any timeDate appears under multiple tools ---"
curl -s http://localhost:5081/api/yokota/NG60753 | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if not isinstance(data, list):
        print('No list data returned')
        sys.exit(0)
    # Check for duplicate timestamps across tools
    time_to_tools = {}
    for r in data:
        t = r.get('timeDate', '')
        tool = r.get('tool_name', '?')
        time_to_tools.setdefault(t, set()).add(tool)
    duplicates = {t: tools for t, tools in time_to_tools.items() if len(tools) > 1}
    if duplicates:
        print('❌ DUPLICATION FOUND! Same timestamp under multiple tools:')
        for t, tools in duplicates.items():
            print(f'   {t} -> {list(tools)}')
    else:
        print('✅ NO DUPLICATION - Each timestamp belongs to exactly one tool')
    # Verify EGR COOLER specifically
    egr = [r for r in data if 'EGR COOLER' in r.get('tool_name', '')]
    if egr:
        print(f'')
        print(f'✅ EGR COOLER BOLT & NUT: {len(egr)} records found')
        for r in egr:
            print(f'   {r.get(\"timeDate\")} | configured_folder={r.get(\"configured_folder\",\"?\")}')
    else:
        print(f'⚠️  EGR COOLER: No records found')
except Exception as e:
    print(f'Error: {e}')
" 2>/dev/null

echo ""
echo "============================================================"
echo "  STEP 6: Check PM2 logs for errors"
echo "============================================================"

echo ""
echo "--- Last 20 lines of yokota_api logs ---"
pm2 logs yokota_api --lines 20 --nostream 2>/dev/null || echo "Could not read yokota_api logs"

echo ""
echo "--- Last 20 lines of dcs logs (Yokota related) ---"
pm2 logs dcs --lines 30 --nostream 2>/dev/null | grep -i "yokota" || echo "No Yokota log lines found"

echo ""
echo "============================================================"
echo "  DONE"
echo "============================================================"
echo ""
echo "If everything looks good, test more engines:"
echo "  curl http://localhost:5081/api/yokota/<ENGINE_NUMBER> | python3 -m json.tool"
echo ""


echo "=== 1. PM2 INFO ==="
pm2 describe dcs | grep -E "script path|pm_cwd|status"
pm2 describe yokota_api | grep -E "script path|pm_cwd|status"

echo "=== 2. MOUNT INFO ==="
ls -la /mnt/yokota/AppData/0053/ 2>/dev/null || echo "Cannot list /mnt/yokota/AppData/0053/"

echo "=== 3. CURRENT USER & DIR ==="
whoami
pwd
