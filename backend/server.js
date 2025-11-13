require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const footballDataService = require('./services/footballDataService');
const simulationEngine = require('./services/simulationEngine');
const walletService = require('./services/walletService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const leagues = new Map();
const drafts = new Map();
const teams = new Map();
const matches = new Map();

// ============= API ROUTES =============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Get all players
app.get('/api/players', async (req, res) => {
  try {
    const { source, players } = await footballDataService.getPlayers();
    res.json({ source, players });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all teams
app.get('/api/teams', async (req, res) => {
  try {
    const { source, teams } = await footballDataService.getTeams();
    res.json({ source, teams });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available matches
app.get('/api/matches', async (req, res) => {
  try {
    const { source, matches } = await footballDataService.getMatches();
    res.json({ source, matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============= LEAGUE ROUTES =============

// Create a new league
app.post('/api/leagues', (req, res) => {
  const { name, size, commissionerId } = req.body;

  const leagueId = uuidv4();
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const league = {
    id: leagueId,
    name,
    size: size || 4,
    commissionerId,
    inviteCode,
    status: 'SETUP',
    players: [commissionerId],
    created: new Date()
  };

  leagues.set(leagueId, league);

  res.json({ league });
});

// Join league with invite code
app.post('/api/leagues/join', (req, res) => {
  const { inviteCode, userId } = req.body;

  const league = Array.from(leagues.values()).find(l => l.inviteCode === inviteCode);

  if (!league) {
    return res.status(404).json({ error: 'League not found' });
  }

  if (league.players.includes(userId)) {
    return res.status(400).json({ error: 'Already in league' });
  }

  if (league.players.length >= league.size) {
    return res.status(400).json({ error: 'League is full' });
  }

  league.players.push(userId);

  res.json({ league });
});

// Get league details
app.get('/api/leagues/:leagueId', (req, res) => {
  const league = leagues.get(req.params.leagueId);

  if (!league) {
    return res.status(404).json({ error: 'League not found' });
  }

  res.json({ league });
});

// Start draft
app.post('/api/leagues/:leagueId/draft/start', async (req, res) => {
  const league = leagues.get(req.params.leagueId);

  if (!league) {
    return res.status(404).json({ error: 'League not found' });
  }

  const { players } = await footballDataService.getPlayers();

  const draftId = uuidv4();
  const draft = {
    id: draftId,
    leagueId: league.id,
    players: league.players,
    availablePlayers: players.map(p => p.id),
    picks: [],
    currentPick: 0,
    currentPlayer: league.players[0],
    status: 'ACTIVE',
    pickTimer: 30,
    created: new Date()
  };

  drafts.set(draftId, draft);
  league.draftId = draftId;
  league.status = 'DRAFTING';

  res.json({ draft });
});

// Make draft pick
app.post('/api/drafts/:draftId/pick', (req, res) => {
  const { playerId, userId } = req.body;
  const draft = drafts.get(req.params.draftId);

  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }

  if (draft.currentPlayer !== userId) {
    return res.status(400).json({ error: 'Not your turn' });
  }

  if (!draft.availablePlayers.includes(playerId)) {
    return res.status(400).json({ error: 'Player not available' });
  }

  // Record pick
  draft.picks.push({
    userId,
    playerId,
    pickNumber: draft.currentPick + 1,
    timestamp: new Date()
  });

  // Remove player from available
  draft.availablePlayers = draft.availablePlayers.filter(p => p !== playerId);

  // Move to next pick (snake draft)
  draft.currentPick++;
  const round = Math.floor(draft.currentPick / draft.players.length);
  const isReversed = round % 2 === 1;
  const positionInRound = draft.currentPick % draft.players.length;

  if (isReversed) {
    draft.currentPlayer = draft.players[draft.players.length - 1 - positionInRound];
  } else {
    draft.currentPlayer = draft.players[positionInRound];
  }

  // Check if draft is complete (8 players per team)
  if (draft.picks.length >= draft.players.length * 8) {
    draft.status = 'COMPLETED';

    // Create teams
    draft.players.forEach(userId => {
      const userPicks = draft.picks.filter(p => p.userId === userId).map(p => p.playerId);
      teams.set(`${draft.leagueId}-${userId}`, {
        userId,
        leagueId: draft.leagueId,
        squad: userPicks
      });
    });
  }

  res.json({ draft });
});

// ============= MATCH ROUTES =============

// Create a quick match
app.post('/api/matches/quick', (req, res) => {
  const { userId, opponentId } = req.body;

  // Charge entry fee
  const charge = walletService.chargeMatchEntry(userId, 'head-to-head');
  if (!charge.success) {
    return res.status(402).json({ error: charge.message, balance: charge.balance });
  }

  const matchId = uuidv4();
  const match = {
    id: matchId,
    type: 'QUICK',
    homeUserId: userId,
    awayUserId: opponentId,
    status: 'SETUP',
    created: new Date()
  };

  matches.set(matchId, match);

  res.json({ match });
});

// Start match simulation
app.post('/api/matches/:matchId/start', async (req, res) => {
  const match = matches.get(req.params.matchId);

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  const homeTeam = teams.get(`${match.leagueId || 'quick'}-${match.homeUserId}`);
  const awayTeam = teams.get(`${match.leagueId || 'quick'}-${match.awayUserId}`);

  if (!homeTeam || !awayTeam) {
    return res.status(400).json({ error: 'Teams not set up' });
  }

  // Generate home/away team IDs
  const homeTeamId = Math.floor(Math.random() * 8) + 1;
  const awayTeamId = Math.floor(Math.random() * 8) + 1;

  const simulation = simulationEngine.startSimulation(
    match.id,
    homeTeamId,
    awayTeamId,
    homeTeam.squad,
    awayTeam.squad,
    io
  );

  match.status = 'LIVE';

  res.json({ match, simulation: { status: 'STARTED' } });
});

// Use tactical boost
app.post('/api/matches/:matchId/boost', (req, res) => {
  const { team, boostType, minute } = req.body;

  const result = simulationEngine.useBoost(
    req.params.matchId,
    team,
    boostType,
    minute
  );

  res.json(result);
});

// Get match status
app.get('/api/matches/:matchId', (req, res) => {
  const match = matches.get(req.params.matchId);

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  const simulation = simulationEngine.getSimulation(match.id);

  res.json({ match, simulation });
});

// ============= WALLET ROUTES =============

// Get wallet
app.get('/api/wallet/:userId', (req, res) => {
  const wallet = walletService.getWallet(req.params.userId);
  res.json({ wallet });
});

// Get transactions
app.get('/api/wallet/:userId/transactions', (req, res) => {
  const transactions = walletService.getTransactions(req.params.userId);
  res.json({ transactions });
});

// Purchase coins
app.post('/api/wallet/:userId/purchase', (req, res) => {
  const { packageId } = req.body;
  const result = walletService.purchaseCoins(req.params.userId, packageId);
  res.json(result);
});

// Get coin packages
app.get('/api/wallet/packages', (req, res) => {
  const packages = walletService.getCoinPackages();
  res.json({ packages });
});

// ============= WEBSOCKET =============

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-match', (matchId) => {
    socket.join(matchId);
    console.log(`Socket ${socket.id} joined match ${matchId}`);
  });

  socket.on('leave-match', (matchId) => {
    socket.leave(matchId);
    console.log(`Socket ${socket.id} left match ${matchId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============= START SERVER =============

server.listen(PORT, () => {
  console.log(`
  ⚽ Football Frenzy Backend Server
  🚀 Server running on http://localhost:${PORT}
  🔌 WebSocket ready for real-time match simulation
  📊 Data source: ${footballDataService.useDummyData ? 'DUMMY DATA' : 'REAL API'}
  `);
});

module.exports = { app, server, io };
