// Test script to watch a full match simulation
const axios = require('axios');
const io = require('socket.io-client');

const API_BASE = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testMatchSimulation() {
  console.log('⚽ Football Frenzy - Live Match Simulation Test\n');
  console.log('━'.repeat(60) + '\n');

  try {
    // Step 1: Create league and draft
    console.log('📋 SETUP PHASE');
    console.log('━'.repeat(60));

    const user1 = 'test_user_' + Math.random().toString(36).substr(2, 9);
    const user2 = 'test_user_' + Math.random().toString(36).substr(2, 9);

    console.log(`👤 User 1 (Home): ${user1.substring(0, 15)}...`);
    console.log(`👤 User 2 (Away): ${user2.substring(0, 15)}...\n`);

    // Create league
    const leagueRes = await axios.post(`${API_BASE}/leagues`, {
      name: 'Simulation Test League',
      size: 2,
      commissionerId: user1
    });
    const league = leagueRes.data.league;

    // Join league
    await axios.post(`${API_BASE}/leagues/join`, {
      inviteCode: league.inviteCode,
      userId: user2
    });

    // Start draft
    const draftRes = await axios.post(`${API_BASE}/leagues/${league.id}/draft/start`);
    let draft = draftRes.data.draft;

    // Get players
    const playersRes = await axios.get(`${API_BASE}/players`);
    const allPlayers = playersRes.data.players;

    // Quick draft
    console.log('⚡ DRAFT PHASE (Fast Mode)');
    console.log('━'.repeat(60));
    for (let i = 0; i < 16; i++) {
      const availablePlayers = allPlayers.filter(p =>
        draft.availablePlayers.includes(p.id)
      );
      const player = availablePlayers[0];

      const pickRes = await axios.post(`${API_BASE}/drafts/${draft.id}/pick`, {
        playerId: player.id,
        userId: draft.currentPlayer
      });
      draft = pickRes.data.draft;

      const userNum = draft.currentPlayer === user1 ? 1 : 2;
      console.log(`  Pick ${(i + 1).toString().padStart(2)}: User ${userNum} → ${player.name.padEnd(25)} (${player.position})`);
    }

    console.log('\n✓ Draft Complete!\n');

    if (!draft.matchId) {
      console.error('❌ Error: No match created after draft');
      return;
    }

    // Step 2: Connect to match via WebSocket
    console.log('🔌 MATCH SIMULATION');
    console.log('━'.repeat(60));

    const matchId = draft.matchId;
    console.log(`Match ID: ${matchId}`);
    console.log(`Starting simulation...\n`);

    // Connect socket
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: false
    });

    // Wait for connection
    await new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('✓ Connected to WebSocket\n');
        resolve();
      });
    });

    // Join match room
    socket.emit('join-match', matchId);

    // Track match state
    let homeScore = 0;
    let awayScore = 0;
    let homePoints = 0;
    let awayPoints = 0;
    let currentMinute = 0;
    let eventCount = 0;
    let matchEnded = false;

    // Listen to match events
    socket.on('match-event', (data) => {
      eventCount++;
      const minute = data.minute;
      const event = data.event;

      let eventSymbol = '';
      let eventText = '';

      switch(event.type) {
        case 'GOAL':
          eventSymbol = '⚽';
          eventText = `GOAL! Player #${event.playerId}`;
          break;
        case 'ASSIST':
          eventSymbol = '🎯';
          eventText = `Assist by Player #${event.playerId}`;
          break;
        case 'SAVE':
          eventSymbol = '🧤';
          eventText = `Save by GK #${event.playerId}`;
          break;
        case 'YELLOW_CARD':
          eventSymbol = '🟨';
          eventText = `Yellow card for Player #${event.playerId}`;
          break;
        case 'RED_CARD':
          eventSymbol = '🟥';
          eventText = `Red card for Player #${event.playerId}`;
          break;
      }

      console.log(`${minute.toString().padStart(2)}'  ${eventSymbol}  ${eventText}${event.boosted ? ' ⚡ BOOSTED!' : ''}`);

      homeScore = data.score.home;
      awayScore = data.score.away;
    });

    socket.on('score-update', (data) => {
      currentMinute = data.minute;
      homePoints = data.homePoints;
      awayPoints = data.awayPoints;

      // Show score every 15 minutes
      if (currentMinute % 15 === 0 && currentMinute > 0) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`${currentMinute}' │ Score: ${homeScore}-${awayScore} │ Fantasy Points: ${homePoints}-${awayPoints}`);
        console.log(`${'─'.repeat(60)}\n`);
      }
    });

    socket.on('match-end', (data) => {
      matchEnded = true;
      console.log(`\n${'━'.repeat(60)}`);
      console.log('🏁 FULL TIME!');
      console.log(`${'━'.repeat(60)}`);
      console.log(`\n📊 FINAL RESULT:`);
      console.log(`   Match Score:   ${data.homeScore} - ${data.awayScore}`);
      console.log(`   Fantasy Points: ${data.homePoints} - ${data.awayPoints}`);

      let winnerText = '';
      if (data.winner === 'home') {
        winnerText = '🏆 User 1 (Home) WINS!';
      } else if (data.winner === 'away') {
        winnerText = '🏆 User 2 (Away) WINS!';
      } else {
        winnerText = '🤝 It\'s a DRAW!';
      }
      console.log(`\n   ${winnerText}`);
      console.log(`\n   Total Events: ${eventCount}`);
      console.log(`\n${'━'.repeat(60)}\n`);

      socket.disconnect();
    });

    // Start the match
    await axios.post(`${API_BASE}/matches/${matchId}/start`);

    // Wait for match to end (90 minutes * 2 seconds per minute = 180 seconds max)
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (matchEnded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);

      // Timeout after 200 seconds
      setTimeout(() => {
        if (!matchEnded) {
          clearInterval(checkInterval);
          console.log('\n⚠️  Match simulation timeout\n');
          socket.disconnect();
          resolve();
        }
      }, 200000);
    });

    console.log('✅ TEST COMPLETED SUCCESSFULLY!\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    console.error('\nStack:', error.stack);
  }
}

// Run the test
testMatchSimulation();
