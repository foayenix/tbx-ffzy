# ⚽ Football Frenzy - Quick Start Guide

## 🎮 What You've Got

A fully functional fantasy football game with:
- **Real-time match simulation** (matches finish in ~3 minutes)
- **Draft system** with 30-second timers
- **Tactical boosts** for strategic gameplay
- **Coin economy** (start with 10 free coins)
- **Two game modes**: League Play & Quick Match
- **Beautiful UI** optimized for web and mobile

## 🚀 Run It Now (2 minutes)

### Terminal 1 - Backend Server
```bash
cd backend
npm install
npm start
```

Wait for:
```
⚽ Football Frenzy Backend Server
🚀 Server running on http://localhost:3001
📊 Data source: DUMMY DATA
```

### Terminal 2 - Frontend App
```bash
cd frontend
npm install
npm start
```

Game opens automatically at **http://localhost:3000**

## 🎯 Try These First

### 1. Quick Match (Fastest Way to Play)
1. Click **"Start Quick Match"**
2. Draft 8 players (pick whoever looks good!)
3. Watch the match simulate live
4. Use a tactical boost when you see the right moment
5. See if you win!

### 2. Create a League
1. Click **"Create League"**
2. Copy the invite code (e.g., "ABC123")
3. Open another browser tab (incognito) to join as Player 2
4. Paste invite code and join
5. Back in first tab, click **"Start Draft"**
6. Take turns drafting players
7. Watch the match!

### 3. Check Your Wallet
1. Click on the **🪙 Coins** in the header
2. See your starting 10 coins
3. View transaction history
4. Try "purchasing" more coins (simulated for demo)

## 📊 Data Sources

### Currently Using: Dummy Data
- 32 realistic players (Haaland, Salah, De Bruyne, etc.)
- 8 teams (Man City, Arsenal, Liverpool, etc.)
- Generated match events with realistic stats
- **Perfect for demos and testing**

### Want Real Data?
1. Get a free API key from https://www.football-data.org/
2. Create `.env` file: `FOOTBALL_DATA_API_KEY=your_key`
3. Restart backend
4. Real Premier League data will be fetched

## 🎮 Gameplay Tips

### Drafting
- Look for high **Form** (8.0+) and **xG** (0.5+ for attackers)
- Balance your squad: 2-3 FWD, 3-4 MID, 2 DEF, 1 GK
- Timer autopicks if you don't choose (picks highest form)

### Tactical Boosts
- **All-Out Attack**: Use when you're behind and need goals
- **Park The Bus**: Use when you're ahead to protect your lead
- Timing is everything - watch the score and momentum

### Scoring
- Goals: +5 pts, Assists: +3 pts
- Clean Sheets (DEF/GK): +4 pts
- Saves: +1 pt
- Yellow Card: -1 pt, Red Card: -3 pts

## 🏗️ What's Built

✅ Complete backend API (Express + Socket.IO)
✅ Real-time match simulation engine
✅ Draft system with snake order
✅ Coin wallet with transactions
✅ Tactical boosts (2 types)
✅ League creation & joining
✅ Quick match mode
✅ Live match events feed
✅ Responsive mobile-first UI
✅ Dummy data with 32 players
✅ API integration ready

## 📱 Mobile Ready

Open on your phone:
1. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Open `http://YOUR_IP:3000` on your phone
3. Play the game on mobile!

## 🐛 Troubleshooting

**"Port already in use"**
- Change backend port in `.env`: `PORT=3002`
- Frontend will prompt for alternate port

**"Module not found"**
- Run `npm install` in both backend/ and frontend/

**"Can't connect to backend"**
- Make sure backend is running on port 3001
- Check browser console for errors

**"Draft not starting"**
- Need at least 2 players in league
- Commissioner must click "Start Draft"

## 📖 Full Documentation

- **README.md** - Complete game design, architecture, API docs
- **SETUP.md** - Detailed setup instructions
- **This file** - Quick start for impatient people

## 🎯 Next Steps

1. **Test both game modes** thoroughly
2. **Try on mobile** to see responsive design
3. **Add real API key** to fetch live data
4. **Read README.md** for architecture details
5. **Customize** players, teams, or rules
6. **Deploy** to Railway/Heroku for public demo

## 💡 Demo Tips

**For Investors/Users:**
- Show Quick Match first (fastest to understand)
- Highlight real-time simulation
- Demonstrate tactical boost timing
- Show mobile responsive design

**For Developers:**
- Walk through project structure
- Show WebSocket events in browser dev tools
- Explain simulation engine logic
- Demo API integration switching

## 🚀 Ready to Play?

Game should be running at **http://localhost:3000**

Your user ID is auto-generated and saved in localStorage.
You start with **10 free coins**.
Each match costs **1 coin** to enter.

**Have fun and enjoy your working prototype!** ⚽🏆

---

Questions? Check README.md or open an issue!
