// Dummy Football Data for Football Frenzy MVP

const teams = [
  { id: 1, name: 'Manchester City', shortName: 'MCI', crest: '🔵' },
  { id: 2, name: 'Arsenal', shortName: 'ARS', crest: '🔴' },
  { id: 3, name: 'Liverpool', shortName: 'LIV', crest: '🔴' },
  { id: 4, name: 'Manchester United', shortName: 'MUN', crest: '🔴' },
  { id: 5, name: 'Chelsea', shortName: 'CHE', crest: '🔵' },
  { id: 6, name: 'Tottenham', shortName: 'TOT', crest: '⚪' },
  { id: 7, name: 'Newcastle', shortName: 'NEW', crest: '⚫' },
  { id: 8, name: 'Brighton', shortName: 'BRI', crest: '🔵' }
];

const players = [
  // Manchester City
  { id: 1, name: 'Erling Haaland', team: 1, position: 'FWD', price: 12, xG: 0.85, form: 9.2 },
  { id: 2, name: 'Kevin De Bruyne', team: 1, position: 'MID', price: 10, xG: 0.35, form: 8.8 },
  { id: 3, name: 'Ruben Dias', team: 1, position: 'DEF', price: 6, xG: 0.05, form: 8.0 },
  { id: 4, name: 'Ederson', team: 1, position: 'GK', price: 5, xG: 0, form: 8.5 },

  // Arsenal
  { id: 5, name: 'Bukayo Saka', team: 2, position: 'MID', price: 9, xG: 0.45, form: 8.9 },
  { id: 6, name: 'Gabriel Jesus', team: 2, position: 'FWD', price: 8, xG: 0.65, form: 8.1 },
  { id: 7, name: 'William Saliba', team: 2, position: 'DEF', price: 5, xG: 0.03, form: 8.7 },
  { id: 8, name: 'Aaron Ramsdale', team: 2, position: 'GK', price: 5, xG: 0, form: 7.8 },

  // Liverpool
  { id: 9, name: 'Mohamed Salah', team: 3, position: 'FWD', price: 11, xG: 0.75, form: 9.0 },
  { id: 10, name: 'Darwin Nunez', team: 3, position: 'FWD', price: 8, xG: 0.68, form: 7.5 },
  { id: 11, name: 'Trent Alexander-Arnold', team: 3, position: 'DEF', price: 7, xG: 0.08, form: 8.2 },
  { id: 12, name: 'Alisson', team: 3, position: 'GK', price: 5, xG: 0, form: 8.6 },

  // Manchester United
  { id: 13, name: 'Marcus Rashford', team: 4, position: 'FWD', price: 9, xG: 0.62, form: 8.3 },
  { id: 14, name: 'Bruno Fernandes', team: 4, position: 'MID', price: 9, xG: 0.38, form: 8.4 },
  { id: 15, name: 'Lisandro Martinez', team: 4, position: 'DEF', price: 5, xG: 0.02, form: 8.1 },
  { id: 16, name: 'Andre Onana', team: 4, position: 'GK', price: 5, xG: 0, form: 7.6 },

  // Chelsea
  { id: 17, name: 'Cole Palmer', team: 5, position: 'MID', price: 8, xG: 0.42, form: 8.5 },
  { id: 18, name: 'Nicolas Jackson', team: 5, position: 'FWD', price: 7, xG: 0.58, form: 7.8 },
  { id: 19, name: 'Reece James', team: 5, position: 'DEF', price: 6, xG: 0.06, form: 7.9 },
  { id: 20, name: 'Robert Sanchez', team: 5, position: 'GK', price: 4, xG: 0, form: 7.2 },

  // Tottenham
  { id: 21, name: 'Son Heung-min', team: 6, position: 'FWD', price: 10, xG: 0.70, form: 8.8 },
  { id: 22, name: 'James Maddison', team: 6, position: 'MID', price: 8, xG: 0.32, form: 8.2 },
  { id: 23, name: 'Cristian Romero', team: 6, position: 'DEF', price: 5, xG: 0.04, form: 7.9 },
  { id: 24, name: 'Guglielmo Vicario', team: 6, position: 'GK', price: 4, xG: 0, form: 7.7 },

  // Newcastle
  { id: 25, name: 'Alexander Isak', team: 7, position: 'FWD', price: 9, xG: 0.72, form: 8.6 },
  { id: 26, name: 'Anthony Gordon', team: 7, position: 'MID', price: 7, xG: 0.38, form: 8.0 },
  { id: 27, name: 'Sven Botman', team: 7, position: 'DEF', price: 5, xG: 0.03, form: 8.1 },
  { id: 28, name: 'Nick Pope', team: 7, position: 'GK', price: 5, xG: 0, form: 8.3 },

  // Brighton
  { id: 29, name: 'Joao Pedro', team: 8, position: 'FWD', price: 7, xG: 0.55, form: 7.9 },
  { id: 30, name: 'Kaoru Mitoma', team: 8, position: 'MID', price: 7, xG: 0.36, form: 7.8 },
  { id: 31, name: 'Lewis Dunk', team: 8, position: 'DEF', price: 4, xG: 0.04, form: 7.5 },
  { id: 32, name: 'Jason Steele', team: 8, position: 'GK', price: 4, xG: 0, form: 7.4 }
];

const matches = [
  {
    id: 1,
    homeTeam: 1,
    awayTeam: 2,
    date: '2025-01-15T15:00:00Z',
    status: 'FINISHED',
    events: [
      { minute: 12, type: 'GOAL', playerId: 1, teamId: 1, assisted: 2 },
      { minute: 28, type: 'GOAL', playerId: 6, teamId: 2, assisted: 5 },
      { minute: 45, type: 'YELLOW_CARD', playerId: 3, teamId: 1 },
      { minute: 58, type: 'GOAL', playerId: 2, teamId: 1, assisted: null },
      { minute: 72, type: 'SAVE', playerId: 4, teamId: 1 },
      { minute: 81, type: 'GOAL', playerId: 1, teamId: 1, assisted: 2 },
      { minute: 90, type: 'SAVE', playerId: 8, teamId: 2 }
    ],
    finalScore: { home: 3, away: 1 }
  },
  {
    id: 2,
    homeTeam: 3,
    awayTeam: 4,
    date: '2025-01-15T17:30:00Z',
    status: 'FINISHED',
    events: [
      { minute: 8, type: 'GOAL', playerId: 9, teamId: 3, assisted: 11 },
      { minute: 23, type: 'GOAL', playerId: 13, teamId: 4, assisted: 14 },
      { minute: 35, type: 'SAVE', playerId: 12, teamId: 3 },
      { minute: 52, type: 'GOAL', playerId: 10, teamId: 3, assisted: null },
      { minute: 67, type: 'YELLOW_CARD', playerId: 15, teamId: 4 },
      { minute: 88, type: 'GOAL', playerId: 9, teamId: 3, assisted: 10 }
    ],
    finalScore: { home: 3, away: 1 }
  },
  {
    id: 3,
    homeTeam: 5,
    awayTeam: 6,
    date: '2025-01-16T12:30:00Z',
    status: 'SCHEDULED',
    events: [],
    finalScore: null
  },
  {
    id: 4,
    homeTeam: 7,
    awayTeam: 8,
    date: '2025-01-16T15:00:00Z',
    status: 'SCHEDULED',
    events: [],
    finalScore: null
  }
];

// Generate realistic match events for simulation
function generateMatchEvents(homeTeamId, awayTeamId) {
  const events = [];
  const homeTeamPlayers = players.filter(p => p.team === homeTeamId);
  const awayTeamPlayers = players.filter(p => p.team === awayTeamId);

  // Simulate 90 minutes
  for (let minute = 1; minute <= 90; minute += Math.floor(Math.random() * 8) + 3) {
    const eventType = Math.random();

    if (eventType < 0.15) { // 15% chance of goal attempt
      const isHome = Math.random() > 0.5;
      const teamPlayers = isHome ? homeTeamPlayers : awayTeamPlayers;
      const attackers = teamPlayers.filter(p => p.position === 'FWD' || p.position === 'MID');

      if (attackers.length > 0) {
        const scorer = attackers[Math.floor(Math.random() * attackers.length)];
        const isGoal = Math.random() < scorer.xG;

        if (isGoal) {
          const assister = teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
          events.push({
            minute,
            type: 'GOAL',
            playerId: scorer.id,
            teamId: scorer.team,
            assisted: Math.random() > 0.3 ? assister.id : null
          });
        } else {
          // Save by goalkeeper
          const opponentTeam = isHome ? awayTeamPlayers : homeTeamPlayers;
          const gk = opponentTeam.find(p => p.position === 'GK');
          if (gk) {
            events.push({
              minute,
              type: 'SAVE',
              playerId: gk.id,
              teamId: gk.team
            });
          }
        }
      }
    } else if (eventType < 0.20) { // 5% chance of yellow card
      const isHome = Math.random() > 0.5;
      const teamPlayers = isHome ? homeTeamPlayers : awayTeamPlayers;
      const player = teamPlayers[Math.floor(Math.random() * teamPlayers.length)];

      events.push({
        minute,
        type: 'YELLOW_CARD',
        playerId: player.id,
        teamId: player.team
      });
    }
  }

  return events.sort((a, b) => a.minute - b.minute);
}

module.exports = {
  teams,
  players,
  matches,
  generateMatchEvents
};
