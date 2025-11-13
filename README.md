# ⚽ Football Frenzy - Fast-Paced Fantasy Football Game

Football Frenzy is a modern, fast-paced fantasy football game where players draft squads of real EPL players and compete in simulated matches that finish in minutes, not months. Think "TikTok-length fantasy football" - quick sessions, instant results, and tactical boosts for high-stakes decisions.

## 🎮 Game Features

### Core Gameplay
- **Fast Draft System**: 8-player squads, 30-second pick timers, AI-assisted picks
- **Tactical Boosts**: One per match - All-Out Attack or Park The Bus
- **Real-Time Simulation**: Matches simulate minute-by-minute with live events
- **Coin Economy**: 1 coin per match entry, earn or purchase coins
- **Two Game Modes**:
  - **League Play**: Create/join leagues, draft, compete in mini-seasons
  - **Head-to-Head**: Quick matches vs friends or auto-matched opponents

### Key Features
- Snake draft with autopick fallback
- Live match events (goals, assists, saves, cards)
- Points-based scoring system
- Clean, mobile-first UI
- Real-time WebSocket updates
- Wallet & transaction history
- Dummy data OR real API integration

## 🏗️ Project Structure

```
tbx-ffzy/
├── backend/
│   ├── server.js                 # Main Express server with Socket.IO
│   ├── package.json
│   ├── data/
│   │   └── dummyData.js         # Dummy football data (players, teams, matches)
│   └── services/
│       ├── footballDataService.js  # API integration (dummy or real)
│       ├── simulationEngine.js     # Match simulation engine
│       └── walletService.js        # Coin economy & transactions
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js                   # Main app with routing
        ├── App.css
        ├── index.js
        ├── index.css
        ├── services/
        │   ├── api.js               # Axios API client
        │   └── socket.js            # Socket.IO client
        └── components/
            ├── Home.js/.css         # Home page with game modes
            ├── LeagueSetup.js/.css  # League creation & joining
            ├── Draft.js/.css        # Draft interface
            ├── Match.js/.css        # Live match simulation
            └── Wallet.js/.css       # Coin wallet & purchases
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Optional: Football Data API key (get one at https://www.football-data.org/)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd tbx-ffzy
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure environment (optional)**
```bash
# In the root directory, copy .env.example to .env
cp .env.example .env

# Edit .env and add your Football Data API key (optional)
# If not provided, the game uses dummy data
FOOTBALL_DATA_API_KEY=your_api_key_here
```

### Running the Game

**Option 1: Run both servers separately (recommended for development)**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

The game will open at `http://localhost:3000`

**Option 2: Quick start script**
```bash
# From root directory
npm run dev  # (if you create a package.json in root)
```

## 🎯 How to Play

### League Mode
1. Click "Create League" on the home page
2. Share the 6-character invite code with friends
3. Once 2+ players join, commissioner starts the draft
4. Draft 8 players (30s per pick, autopick if time expires)
5. Watch matches simulate in real-time
6. Use your tactical boost at the perfect moment
7. Win points to climb the league table

### Quick Match Mode
1. Click "Start Quick Match"
2. Pay 1 coin entry fee
3. Quick draft with shorter timers
4. Play a single match
5. Winner takes all!

### Scoring System
- Goal: +5 points
- Assist: +3 points
- Clean Sheet (DEF/GK): +4 points
- Save (GK): +1 point
- Yellow Card: -1 point
- Red Card: -3 points

### Tactical Boosts
Use once per match:
- **All-Out Attack**: +10% xG for FWD/MID for 10 minutes
- **Park The Bus**: -15% opponent xG for 10 minutes

## 💰 Coin Economy

### Earning Coins
- Account creation: +10 coins (one-time)
- Referrals: +5 coins for both users
- Match wins (head-to-head): +2 coins

### Spending Coins
- Match entry: 1 coin per match
- Special transfers: 2 coins
- Emergency re-draft: 5 coins

### Purchasing Coins
- Small: 10 coins - £1.00
- Medium: 50 coins - £4.50
- Large: 120 coins - £10.00

## 🔌 API Integration

### Using Dummy Data (Default)
The game works out-of-the-box with realistic dummy data for:
- 32 players across 8 teams
- Multiple matches with events
- Realistic xG, form, and stats

### Using Real Football Data API
1. Get a free API key from https://www.football-data.org/
2. Add to `.env`: `FOOTBALL_DATA_API_KEY=your_key`
3. Restart the backend server
4. The game will automatically fetch real Premier League data

**Note**: The free tier has limited match event data, so simulation still uses generated events based on team stats.

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express**: REST API
- **Socket.IO**: Real-time match simulation
- **Axios**: HTTP client for football data API

### Frontend
- **React 18**: UI framework
- **Socket.IO Client**: Real-time updates
- **Axios**: API calls
- **CSS3**: Styling with gradients and animations

### Data
- In-memory storage (MVP) - replace with PostgreSQL/MongoDB for production
- Football Data API (optional)
- Dummy data generator

## 📱 Mobile-First Design

The UI is optimized for mobile devices with:
- Responsive layouts
- Touch-friendly buttons
- Gradient backgrounds
- Glass-morphism effects
- Smooth animations

## 🚧 Future Enhancements

### MVP+
- [ ] Persistent database (PostgreSQL)
- [ ] User authentication (email/password)
- [ ] Push notifications for match starts
- [ ] League standings & playoffs
- [ ] Match replays & highlights

### Advanced Features
- [ ] AI Draft Co-Pilot with ML
- [ ] Boost Timing Advisor
- [ ] Live commentary generation (LLM)
- [ ] Player embeddings for recommendations
- [ ] Global leaderboards
- [ ] Seasonal resets with rewards
- [ ] Social sharing (highlight reels)
- [ ] Real-time live data feeds

## 🧪 Testing

```bash
# Backend tests (add later)
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 API Endpoints

### Players & Teams
- `GET /api/players` - Get all players
- `GET /api/teams` - Get all teams
- `GET /api/matches` - Get available matches

### Leagues
- `POST /api/leagues` - Create a league
- `POST /api/leagues/join` - Join with invite code
- `GET /api/leagues/:id` - Get league details

### Draft
- `POST /api/leagues/:id/draft/start` - Start draft
- `POST /api/drafts/:id/pick` - Make draft pick

### Matches
- `POST /api/matches/quick` - Create quick match
- `POST /api/matches/:id/start` - Start simulation
- `POST /api/matches/:id/boost` - Use tactical boost
- `GET /api/matches/:id` - Get match status

### Wallet
- `GET /api/wallet/:userId` - Get wallet balance
- `GET /api/wallet/:userId/transactions` - Get transaction history
- `POST /api/wallet/:userId/purchase` - Purchase coins
- `GET /api/wallet/packages` - Get coin packages

### WebSocket Events
- `join-match` - Join match room
- `leave-match` - Leave match room
- `match-event` - Receive match event
- `score-update` - Receive score update
- `match-end` - Match finished

## 🤝 Contributing

This is an MVP prototype. To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - feel free to use this for learning or building your own fantasy sports game!

## 🙏 Acknowledgments

- Football data provided by https://www.football-data.org/
- Inspired by fantasy football and quick-play mobile games
- Built as a prototype for fast-paced fantasy sports gaming

## ⚠️ Important Notes

### Legal & Compliance
- **No real money gambling**: Coins are non-redeemable and cannot be exchanged for money
- **No official licensing**: Avoid official club crests/photos without licenses
- **Data usage**: Clear disclaimers about data sources and no affiliation

### Production Readiness
This is an MVP prototype. For production:
- Replace in-memory storage with a real database
- Add proper authentication & authorization
- Implement rate limiting & security measures
- Set up monitoring & logging
- Add comprehensive error handling
- Implement proper IAP verification
- Add GDPR/privacy compliance
- Set up CI/CD pipeline

---

**Ready to play?** Start the servers and visit `http://localhost:3000`

**Questions?** Open an issue or contact the development team.

**Have fun and may the best squad win!** ⚽🏆
