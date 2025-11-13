const axios = require('axios');
const dummyData = require('../data/dummyData');

class FootballDataService {
  constructor() {
    this.apiKey = process.env.FOOTBALL_DATA_API_KEY;
    this.apiUrl = process.env.FOOTBALL_DATA_API_URL || 'https://api.football-data.org/v4';
    this.useDummyData = !this.apiKey;

    if (this.useDummyData) {
      console.log('⚠️  No API key found - using DUMMY DATA');
    } else {
      console.log('✅ API key found - will fetch REAL DATA');
    }
  }

  async getMatches() {
    if (this.useDummyData) {
      return {
        source: 'dummy',
        matches: dummyData.matches
      };
    }

    try {
      const response = await axios.get(`${this.apiUrl}/matches`, {
        headers: { 'X-Auth-Token': this.apiKey },
        params: {
          competitions: 'PL', // Premier League
          status: 'SCHEDULED,FINISHED'
        }
      });

      return {
        source: 'api',
        matches: this.transformApiMatches(response.data.matches)
      };
    } catch (error) {
      console.error('Error fetching from API, falling back to dummy data:', error.message);
      return {
        source: 'dummy',
        matches: dummyData.matches
      };
    }
  }

  async getPlayers() {
    if (this.useDummyData) {
      return {
        source: 'dummy',
        players: dummyData.players
      };
    }

    // For MVP, always use dummy players even with API
    // Real API doesn't provide xG and form data easily
    return {
      source: 'dummy',
      players: dummyData.players
    };
  }

  async getTeams() {
    if (this.useDummyData) {
      return {
        source: 'dummy',
        teams: dummyData.teams
      };
    }

    try {
      const response = await axios.get(`${this.apiUrl}/competitions/PL/teams`, {
        headers: { 'X-Auth-Token': this.apiKey }
      });

      return {
        source: 'api',
        teams: this.transformApiTeams(response.data.teams)
      };
    } catch (error) {
      console.error('Error fetching teams from API:', error.message);
      return {
        source: 'dummy',
        teams: dummyData.teams
      };
    }
  }

  transformApiMatches(apiMatches) {
    return apiMatches.map(match => ({
      id: match.id,
      homeTeam: match.homeTeam.id,
      awayTeam: match.awayTeam.id,
      homeTeamName: match.homeTeam.name,
      awayTeamName: match.awayTeam.name,
      date: match.utcDate,
      status: match.status,
      events: [], // API doesn't provide detailed events in free tier
      finalScore: match.score.fullTime.home !== null ? {
        home: match.score.fullTime.home,
        away: match.score.fullTime.away
      } : null
    }));
  }

  transformApiTeams(apiTeams) {
    return apiTeams.map(team => ({
      id: team.id,
      name: team.name,
      shortName: team.tla,
      crest: team.crest || '⚽'
    }));
  }

  generateMatchEvents(homeTeamId, awayTeamId) {
    return dummyData.generateMatchEvents(homeTeamId, awayTeamId);
  }
}

module.exports = new FootballDataService();
