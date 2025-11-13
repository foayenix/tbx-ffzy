// Test script to simulate a league game
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testLeagueGame() {
  console.log('🎮 Starting Football Frenzy League Game Test\n');

  try {
    // Step 1: Create two users
    const user1 = 'test_user_' + Math.random().toString(36).substr(2, 9);
    const user2 = 'test_user_' + Math.random().toString(36).substr(2, 9);

    console.log(`👤 User 1: ${user1}`);
    console.log(`👤 User 2: ${user2}\n`);

    // Step 2: User 1 creates wallet
    console.log('💰 Creating wallets...');
    const wallet1 = await axios.get(`${API_BASE}/wallet/${user1}`);
    const wallet2 = await axios.get(`${API_BASE}/wallet/${user2}`);
    console.log(`   User 1 balance: ${wallet1.data.wallet.balance} coins`);
    console.log(`   User 2 balance: ${wallet2.data.wallet.balance} coins\n`);

    // Step 3: User 1 creates a league
    console.log('🏆 Creating league...');
    const leagueRes = await axios.post(`${API_BASE}/leagues`, {
      name: 'Test League',
      size: 2,
      commissionerId: user1
    });
    const league = leagueRes.data.league;
    console.log(`   League ID: ${league.id}`);
    console.log(`   Invite Code: ${league.inviteCode}\n`);

    // Step 4: User 2 joins the league
    console.log('👋 User 2 joining league...');
    await axios.post(`${API_BASE}/leagues/join`, {
      inviteCode: league.inviteCode,
      userId: user2
    });
    console.log('   ✓ User 2 joined successfully\n');

    // Step 5: Start the draft
    console.log('📝 Starting draft...');
    const draftRes = await axios.post(`${API_BASE}/leagues/${league.id}/draft/start`);
    const draft = draftRes.data.draft;
    console.log(`   Draft ID: ${draft.id}`);
    console.log(`   Players to draft: 2 x 8 = 16 picks\n`);

    // Step 6: Get available players
    const playersRes = await axios.get(`${API_BASE}/players`);
    const allPlayers = playersRes.data.players;
    console.log(`   Available players: ${allPlayers.length}\n`);

    // Step 7: Simulate draft (16 picks total: 8 per team)
    console.log('⚡ Drafting players...\n');
    let currentDraft = draft;
    let pickCount = 0;

    while (currentDraft.status === 'ACTIVE' && pickCount < 16) {
      const currentUser = currentDraft.currentPlayer;
      const availablePlayers = allPlayers.filter(p =>
        currentDraft.availablePlayers.includes(p.id)
      );

      if (availablePlayers.length === 0) break;

      // Pick the highest form player
      const bestPlayer = availablePlayers.sort((a, b) => b.form - a.form)[0];

      console.log(`   Pick ${pickCount + 1}: ${currentUser === user1 ? 'User 1' : 'User 2'} selects ${bestPlayer.name} (${bestPlayer.position})`);

      const pickRes = await axios.post(`${API_BASE}/drafts/${draft.id}/pick`, {
        playerId: bestPlayer.id,
        userId: currentUser
      });

      currentDraft = pickRes.data.draft;
      pickCount++;

      await sleep(100); // Small delay
    }

    console.log(`\n   ✓ Draft completed! Status: ${currentDraft.status}`);

    if (currentDraft.matchId) {
      console.log(`   ✓ Match auto-created: ${currentDraft.matchId}\n`);

      // Step 8: Get match details
      console.log('⚽ Fetching match...');
      const matchRes = await axios.get(`${API_BASE}/matches/${currentDraft.matchId}`);
      const match = matchRes.data.match;
      console.log(`   Match ID: ${match.id}`);
      console.log(`   Type: ${match.type}`);
      console.log(`   Status: ${match.status}`);
      console.log(`   Home: User 1`);
      console.log(`   Away: User 2\n`);

      console.log('🎯 TEST COMPLETED SUCCESSFULLY! ✓\n');
      console.log('Summary:');
      console.log(`  - League created with invite code: ${league.inviteCode}`);
      console.log(`  - 2 users joined and drafted 8 players each`);
      console.log(`  - Match created automatically: ${match.id}`);
      console.log(`  - Status: ${match.status}`);
      console.log('\n💡 To test in browser:');
      console.log('   1. Start backend: cd backend && npm start');
      console.log('   2. Start frontend: cd frontend && npm start');
      console.log('   3. Open http://localhost:3000');
      console.log('   4. Create league and share invite code with another browser tab\n');

    } else {
      console.log('   ⚠️  Warning: Match not created after draft\n');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    console.error('\nMake sure the backend server is running:');
    console.error('  cd backend && npm start\n');
  }
}

// Run the test
testLeagueGame();
