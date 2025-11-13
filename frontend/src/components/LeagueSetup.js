import React, { useState, useEffect } from 'react';
import './LeagueSetup.css';
import api from '../services/api';

function LeagueSetup({ userId, league, onNavigate, onLeagueUpdate }) {
  const [currentLeague, setCurrentLeague] = useState(league);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Poll for league updates
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/leagues/${league.id}`);
        setCurrentLeague(response.data.league);
        onLeagueUpdate(response.data.league);
      } catch (error) {
        console.error('Error fetching league:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [league.id, onLeagueUpdate]);

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(currentLeague.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartDraft = async () => {
    try {
      const response = await api.post(`/leagues/${currentLeague.id}/draft/start`);
      onNavigate('draft', response.data.draft);
    } catch (error) {
      console.error('Error starting draft:', error);
    }
  };

  const isCommissioner = userId === currentLeague.commissionerId;
  const isReady = currentLeague.players.length >= 2;

  return (
    <div className="league-setup">
      <div className="card">
        <h2>{currentLeague.name}</h2>

        <div className="league-info">
          <div className="info-row">
            <span className="label">League Size:</span>
            <span className="value">{currentLeague.size} players</span>
          </div>
          <div className="info-row">
            <span className="label">Current Players:</span>
            <span className="value">{currentLeague.players.length}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className="value status">{currentLeague.status}</span>
          </div>
        </div>

        <div className="invite-section">
          <h3>Invite Players</h3>
          <p>Share this code with friends to join:</p>

          <div className="invite-code-box">
            <div className="invite-code">{currentLeague.inviteCode}</div>
            <button
              className="btn-secondary"
              onClick={handleCopyInviteCode}
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        <div className="players-list">
          <h3>Players in League</h3>
          <div className="players-grid">
            {currentLeague.players.map((playerId, index) => (
              <div key={playerId} className="player-chip">
                <span className="player-number">{index + 1}</span>
                <span className="player-name">
                  {playerId.substring(0, 10)}
                  {playerId === userId && ' (You)'}
                  {playerId === currentLeague.commissionerId && ' 👑'}
                </span>
              </div>
            ))}

            {Array.from({ length: currentLeague.size - currentLeague.players.length }).map((_, i) => (
              <div key={`empty-${i}`} className="player-chip empty">
                <span className="player-name">Waiting...</span>
              </div>
            ))}
          </div>
        </div>

        {isCommissioner && (
          <div className="commissioner-actions">
            <button
              className="btn-success btn-large btn-block"
              onClick={handleStartDraft}
              disabled={!isReady}
            >
              {isReady ? 'Start Draft' : `Waiting for more players (min 2)`}
            </button>
          </div>
        )}

        {!isCommissioner && (
          <div className="waiting-message">
            <div className="spinner"></div>
            <p>Waiting for commissioner to start the draft...</p>
          </div>
        )}
      </div>

      <button className="btn-secondary" onClick={() => onNavigate('home')}>
        Back to Home
      </button>
    </div>
  );
}

export default LeagueSetup;
