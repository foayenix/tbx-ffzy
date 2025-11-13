const { players } = require('../data/dummyData');

class SimulationEngine {
  constructor() {
    this.activeSimulations = new Map();
  }

  // Calculate points for a player based on match events
  calculatePlayerPoints(playerId, events) {
    let points = 0;
    const playerEvents = events.filter(e => e.playerId === playerId);
    const player = players.find(p => p.id === playerId);

    if (!player) return 0;

    playerEvents.forEach(event => {
      switch (event.type) {
        case 'GOAL':
          points += 5;
          break;
        case 'ASSIST':
          points += 3;
          break;
        case 'SAVE':
          points += 1;
          break;
        case 'YELLOW_CARD':
          points -= 1;
          break;
        case 'RED_CARD':
          points -= 3;
          break;
      }
    });

    // Clean sheet bonus for DEF and GK
    if (player.position === 'DEF' || player.position === 'GK') {
      const teamId = player.team;
      const goalsAgainst = events.filter(
        e => e.type === 'GOAL' && e.teamId !== teamId
      ).length;

      if (goalsAgainst === 0) {
        points += 4;
      }
    }

    return points;
  }

  // Apply tactical boost effects
  applyBoost(boost, events, minute) {
    if (!boost || minute < boost.startMinute || minute > boost.endMinute) {
      return events;
    }

    const modifiedEvents = [...events];

    if (boost.type === 'ALL_OUT_ATTACK') {
      // Increase xG for team's attackers by 10%
      modifiedEvents.forEach(event => {
        if (event.type === 'GOAL' && event.teamId === boost.teamId) {
          const player = players.find(p => p.id === event.playerId);
          if (player && (player.position === 'FWD' || player.position === 'MID')) {
            event.boosted = true;
          }
        }
      });
    } else if (boost.type === 'PARK_THE_BUS') {
      // Reduce opponent xG by 15%
      modifiedEvents.forEach(event => {
        if (event.type === 'GOAL' && event.teamId !== boost.teamId) {
          if (Math.random() < 0.15) {
            event.type = 'SAVE'; // Convert goal to save
            event.blocked = true;
          }
        }
      });
    }

    return modifiedEvents;
  }

  // Start a match simulation
  startSimulation(matchId, homeTeamId, awayTeamId, homeSquad, awaySquad, io) {
    const events = require('../data/dummyData').generateMatchEvents(homeTeamId, awayTeamId);

    const simulation = {
      matchId,
      homeTeamId,
      awayTeamId,
      homeSquad,
      awaySquad,
      events,
      currentMinute: 0,
      homeScore: 0,
      awayScore: 0,
      homePoints: 0,
      awayPoints: 0,
      boosts: { home: null, away: null },
      status: 'LIVE'
    };

    this.activeSimulations.set(matchId, simulation);

    // Simulate minute by minute
    const interval = setInterval(() => {
      simulation.currentMinute += 1;

      // Check for events at this minute
      const currentEvents = events.filter(e => e.minute === simulation.currentMinute);

      currentEvents.forEach(event => {
        // Apply boost effects
        const modifiedEvent = this.applyBoost(
          event.teamId === homeTeamId ? simulation.boosts.home : simulation.boosts.away,
          [event],
          simulation.currentMinute
        )[0];

        // Update score
        if (modifiedEvent.type === 'GOAL') {
          if (event.teamId === homeTeamId) {
            simulation.homeScore++;
          } else {
            simulation.awayScore++;
          }

          // Add assist event
          if (event.assisted) {
            events.push({
              minute: event.minute,
              type: 'ASSIST',
              playerId: event.assisted,
              teamId: event.teamId
            });
          }
        }

        // Emit event to clients
        io.to(matchId).emit('match-event', {
          minute: simulation.currentMinute,
          event: modifiedEvent,
          score: {
            home: simulation.homeScore,
            away: simulation.awayScore
          }
        });
      });

      // Calculate current points
      simulation.homePoints = homeSquad.reduce((total, playerId) => {
        return total + this.calculatePlayerPoints(playerId, events);
      }, 0);

      simulation.awayPoints = awaySquad.reduce((total, playerId) => {
        return total + this.calculatePlayerPoints(playerId, events);
      }, 0);

      // Emit score update
      io.to(matchId).emit('score-update', {
        minute: simulation.currentMinute,
        homeScore: simulation.homeScore,
        awayScore: simulation.awayScore,
        homePoints: simulation.homePoints,
        awayPoints: simulation.awayPoints
      });

      // End simulation at 90 minutes
      if (simulation.currentMinute >= 90) {
        clearInterval(interval);
        simulation.status = 'FINISHED';

        io.to(matchId).emit('match-end', {
          homeScore: simulation.homeScore,
          awayScore: simulation.awayScore,
          homePoints: simulation.homePoints,
          awayPoints: simulation.awayPoints,
          winner: simulation.homePoints > simulation.awayPoints ? 'home' :
                  simulation.awayPoints > simulation.homePoints ? 'away' : 'draw'
        });
      }
    }, 2000); // 2 seconds per minute (90 minutes = 3 real minutes)

    return simulation;
  }

  // Apply a tactical boost
  useBoost(matchId, team, boostType, startMinute) {
    const simulation = this.activeSimulations.get(matchId);
    if (!simulation) return { success: false, message: 'Match not found' };

    const boost = {
      type: boostType,
      teamId: team === 'home' ? simulation.homeTeamId : simulation.awayTeamId,
      startMinute,
      endMinute: startMinute + 10
    };

    if (team === 'home') {
      if (simulation.boosts.home) {
        return { success: false, message: 'Boost already used' };
      }
      simulation.boosts.home = boost;
    } else {
      if (simulation.boosts.away) {
        return { success: false, message: 'Boost already used' };
      }
      simulation.boosts.away = boost;
    }

    return { success: true, boost };
  }

  getSimulation(matchId) {
    return this.activeSimulations.get(matchId);
  }

  stopSimulation(matchId) {
    this.activeSimulations.delete(matchId);
  }
}

module.exports = new SimulationEngine();
