import React, { useState, useEffect } from 'react';
import './Match.css';
import { getSocket } from '../services/socket';

function Match({ userId, match, onNavigate, onMatchEnd }) {
  const [simulation, setSimulation] = useState(null);
  const [events, setEvents] = useState([]);
  const [boostUsed, setBoostUsed] = useState(false);
  const [selectedBoost, setSelectedBoost] = useState(null);

  useEffect(() => {
    const socket = getSocket();

    // Join match room
    socket.emit('join-match', match.id);

    // Listen for match events
    socket.on('match-event', (data) => {
      setEvents(prev => [...prev, data]);
    });

    socket.on('score-update', (data) => {
      setSimulation(prev => ({ ...prev, ...data }));
    });

    socket.on('match-end', (data) => {
      setSimulation(prev => ({ ...prev, ...data, status: 'FINISHED' }));
      setTimeout(() => {
        onMatchEnd();
      }, 5000);
    });

    return () => {
      socket.emit('leave-match', match.id);
      socket.off('match-event');
      socket.off('score-update');
      socket.off('match-end');
    };
  }, [match.id, onMatchEnd]);

  const handleUseBoost = async (boostType) => {
    if (boostUsed || !simulation) return;

    const socket = getSocket();
    socket.emit('use-boost', {
      matchId: match.id,
      team: 'home', // Simplified for MVP
      boostType,
      minute: simulation.currentMinute
    });

    setBoostUsed(true);
    setSelectedBoost(null);
  };

  const boosts = [
    {
      type: 'ALL_OUT_ATTACK',
      name: 'All-Out Attack',
      icon: '⚡',
      description: '+10% xG for FWD/MID for 10 minutes'
    },
    {
      type: 'PARK_THE_BUS',
      name: 'Park The Bus',
      icon: '🛡️',
      description: '-15% opponent xG for 10 minutes'
    }
  ];

  if (!simulation) {
    return (
      <div className="match">
        <div className="card loading">
          <div className="spinner"></div>
          <p>Starting match simulation...</p>
        </div>
      </div>
    );
  }

  const isLive = simulation.status === 'LIVE';
  const isFinished = simulation.status === 'FINISHED';

  return (
    <div className="match">
      <div className="match-header card">
        <div className="match-status">
          {isLive && <span className="live-badge">🔴 LIVE</span>}
          {isFinished && <span className="finished-badge">✓ FINISHED</span>}
          <span className="minute">Minute {simulation.currentMinute || 0}'</span>
        </div>

        <div className="scoreboard">
          <div className="team home">
            <div className="team-name">Your Squad</div>
            <div className="score">{simulation.homeScore || 0}</div>
            <div className="points">{simulation.homePoints || 0} pts</div>
          </div>

          <div className="vs">VS</div>

          <div className="team away">
            <div className="team-name">Opponent</div>
            <div className="score">{simulation.awayScore || 0}</div>
            <div className="points">{simulation.awayPoints || 0} pts</div>
          </div>
        </div>

        {isFinished && (
          <div className="match-result">
            {simulation.winner === 'home' && (
              <div className="winner-banner win">
                🏆 YOU WIN! 🏆
              </div>
            )}
            {simulation.winner === 'away' && (
              <div className="winner-banner loss">
                Better luck next time!
              </div>
            )}
            {simulation.winner === 'draw' && (
              <div className="winner-banner draw">
                It's a Draw!
              </div>
            )}
          </div>
        )}
      </div>

      {isLive && !boostUsed && (
        <div className="boosts-section card">
          <h3>Tactical Boosts (Use Once)</h3>
          <div className="boosts-grid">
            {boosts.map(boost => (
              <div
                key={boost.type}
                className={`boost-card ${selectedBoost === boost.type ? 'selected' : ''}`}
                onClick={() => setSelectedBoost(boost.type)}
              >
                <div className="boost-icon">{boost.icon}</div>
                <div className="boost-name">{boost.name}</div>
                <div className="boost-description">{boost.description}</div>

                {selectedBoost === boost.type && (
                  <button
                    className="btn-success btn-boost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseBoost(boost.type);
                    }}
                  >
                    Activate Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {boostUsed && (
        <div className="boost-used card">
          ✓ Tactical boost activated!
        </div>
      )}

      <div className="events-feed card">
        <h3>Match Events</h3>
        <div className="events-list">
          {events.length === 0 && (
            <div className="no-events">Waiting for match events...</div>
          )}

          {events.slice().reverse().map((event, index) => (
            <div key={index} className="event-item">
              <span className="event-minute">{event.minute}'</span>
              <span className="event-icon">
                {event.event.type === 'GOAL' && '⚽'}
                {event.event.type === 'ASSIST' && '🅰️'}
                {event.event.type === 'SAVE' && '🧤'}
                {event.event.type === 'YELLOW_CARD' && '🟨'}
                {event.event.type === 'RED_CARD' && '🟥'}
              </span>
              <span className="event-description">
                {event.event.type} - Player #{event.event.playerId}
                {event.event.boosted && ' (BOOSTED!)'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {isFinished && (
        <button
          className="btn-primary btn-large btn-block"
          onClick={() => onNavigate('home')}
        >
          Back to Home
        </button>
      )}
    </div>
  );
}

export default Match;
