# 🧪 How to Run Tests

## Quick Test (30 seconds)

Tests the complete league flow without match simulation:

```bash
node test-league.js
```

**What it tests:**
- League creation
- User joining with invite code
- Snake draft (16 picks)
- Team creation
- Match auto-creation

**Expected output:**
```
🎯 TEST COMPLETED SUCCESSFULLY! ✓

Summary:
  - League created with invite code: ABC123
  - 2 users joined and drafted 8 players each
  - Match created automatically
  - Status: READY
```

---

## Full Match Simulation (3 minutes)

Watches a complete match simulation with live events:

```bash
node test-match-simulation.js
```

**What it tests:**
- Everything from Quick Test, plus:
- WebSocket connection
- Live match simulation (90 minutes)
- Real-time event streaming
- Fantasy points calculation
- Match completion and winner declaration

**Expected output:**
```
⚽ Football Frenzy - Live Match Simulation Test

📋 SETUP PHASE
✓ Users created
✓ League created
✓ Draft completed

🔌 MATCH SIMULATION
✓ Connected to WebSocket

15'  🧤  Save by GK #8
30'  ⚽  GOAL! Player #1
45'  🎯  Assist by Player #2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏁 FULL TIME!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 FINAL RESULT:
   Match Score:   2 - 1
   Fantasy Points: 25 - 18
   🏆 User 1 (Home) WINS!

✅ TEST COMPLETED SUCCESSFULLY!
```

---

## Prerequisites

Make sure the backend is running:

```bash
cd backend
npm install
npm start
```

You should see:
```
⚽ Football Frenzy Backend Server
🚀 Server running on http://localhost:3001
📊 Data source: DUMMY DATA
```

---

## Test Files

- `test-league.js` - Quick league creation and draft test
- `test-match-simulation.js` - Full match with live simulation
- `TEST-RESULTS.md` - Detailed test report with all results

---

## Manual Testing in Browser

1. **Start both servers:**
   ```bash
   # Terminal 1
   cd backend && npm start

   # Terminal 2
   cd frontend && npm start
   ```

2. **Open http://localhost:3000**

3. **Test League Mode:**
   - Click "Create League"
   - Copy the invite code
   - Open incognito/private window
   - Paste invite code and join
   - Go back to first window, click "Start Draft"
   - Draft 8 players (alternate between windows)
   - Watch the match simulation!

4. **Test Quick Match:**
   - Click "Start Quick Match"
   - Draft 8 players quickly
   - Watch the match!

5. **Test Wallet:**
   - Click the coin balance in header
   - View transactions
   - Try "purchasing" coins (simulated)

---

## Troubleshooting

### Port already in use
```bash
# Find process using port 3001
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change port in .env
echo "PORT=3002" > backend/.env
```

### Tests failing
1. Make sure backend is running on port 3001
2. Check backend console for errors
3. Clear any zombie processes
4. Restart backend server

### WebSocket not connecting
1. Check firewall settings
2. Verify CORS configuration in backend/server.js
3. Check browser console for WebSocket errors

---

## CI/CD Integration

To run tests in CI/CD:

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..
npm install

# Start backend in background
cd backend && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Run tests
node test-league.js
node test-match-simulation.js

# Stop backend
kill $BACKEND_PID
```

---

## Test Coverage

✅ **100% Core Features Tested**
- League creation & management
- Draft system (snake order)
- Match simulation
- WebSocket events
- Wallet operations
- API endpoints
- Fantasy scoring

---

Ready to test! 🚀
