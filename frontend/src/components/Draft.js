import React, { useState, useEffect } from 'react';
import './Draft.css';
import api from '../services/api';

function Draft({ userId, draft, onNavigate, onDraftComplete }) {
  const [players, setPlayers] = useState([]);
  const [currentDraft, setCurrentDraft] = useState(draft);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [myPicks, setMyPicks] = useState([]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    if (!currentDraft?.id) return;

    // Poll for draft updates
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/api/drafts/${currentDraft.id}`);
        setCurrentDraft(response.data.draft);

        if (response.data.draft.status === 'COMPLETED' && response.data.draft.matchId) {
          clearInterval(interval);
          onDraftComplete({ id: response.data.draft.matchId, leagueId: response.data.draft.leagueId });
        }

        // Update my picks
        const picks = response.data.draft.picks
          .filter(p => p.userId === userId)
          .map(p => p.playerId);
        setMyPicks(picks);
      } catch (error) {
        console.error('Error fetching draft:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDraft?.id, userId, onDraftComplete]);

  useEffect(() => {
    // Timer countdown
    if (currentDraft?.currentPlayer === userId && currentDraft?.status === 'ACTIVE') {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            autoPickPlayer();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentDraft?.currentPlayer, currentDraft?.status, userId]);

  const loadPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data.players);
      setLoading(false);
    } catch (error) {
      console.error('Error loading players:', error);
      setLoading(false);
    }
  };

  const autoPickPlayer = async () => {
    const availablePlayers = players.filter(p =>
      currentDraft.availablePlayers.includes(p.id)
    );

    if (availablePlayers.length > 0) {
      // Auto-pick highest form player
      const bestPlayer = availablePlayers.sort((a, b) => b.form - a.form)[0];
      handlePick(bestPlayer.id);
    }
  };

  const handlePick = async (playerId) => {
    if (currentDraft.currentPlayer !== userId) return;

    try {
      const response = await api.post(`/drafts/${currentDraft.id}/pick`, {
        playerId,
        userId
      });

      setCurrentDraft(response.data.draft);
      setSelectedPlayer(null);
      setTimer(30);
    } catch (error) {
      console.error('Error making pick:', error);
    }
  };

  const getPlayerById = (id) => players.find(p => p.id === id);

  const availablePlayers = players.filter(p =>
    currentDraft?.availablePlayers?.includes(p.id)
  );

  const isMyTurn = currentDraft?.currentPlayer === userId;
  const pickNumber = (currentDraft?.currentPick || 0) + 1;

  if (loading) {
    return (
      <div className="draft loading">
        <div className="spinner"></div>
        <p>Loading players...</p>
      </div>
    );
  }

  if (!currentDraft) {
    return (
      <div className="draft">
        <div className="card">
          <h2>Starting Draft...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="draft">
      <div className="draft-header card">
        <div className="draft-info">
          <div className="pick-counter">
            <span className="label">Pick #{pickNumber}</span>
            <span className="players-picked">
              {currentDraft.picks.length} / {(currentDraft.players?.length || 0) * 8}
            </span>
          </div>

          <div className="turn-indicator">
            {isMyTurn ? (
              <div className="your-turn">
                <span className="pulse">🎯</span>
                <span>YOUR TURN</span>
                <span className="timer">{timer}s</span>
              </div>
            ) : (
              <div className="waiting">
                <span className="spinner-small"></span>
                <span>Waiting for pick...</span>
              </div>
            )}
          </div>
        </div>

        <div className="my-picks">
          <h3>Your Squad ({myPicks.length}/8)</h3>
          <div className="squad-positions">
            {myPicks.map((playerId, index) => {
              const player = getPlayerById(playerId);
              return (
                <div key={index} className="picked-player">
                  <span className="position-badge">{player?.position}</span>
                  <span className="player-name">{player?.name}</span>
                </div>
              );
            })}
            {Array.from({ length: 8 - myPicks.length }).map((_, i) => (
              <div key={`empty-${i}`} className="picked-player empty">
                <span className="player-name">Empty slot</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="available-players">
        <h3>Available Players ({availablePlayers.length})</h3>

        <div className="position-filters">
          <button className="filter-btn active">All</button>
          <button className="filter-btn">FWD</button>
          <button className="filter-btn">MID</button>
          <button className="filter-btn">DEF</button>
          <button className="filter-btn">GK</button>
        </div>

        <div className="players-grid">
          {availablePlayers.map(player => (
            <div
              key={player.id}
              className={`player-card ${selectedPlayer === player.id ? 'selected' : ''} ${!isMyTurn ? 'disabled' : ''}`}
              onClick={() => isMyTurn && setSelectedPlayer(player.id)}
            >
              <div className="player-header">
                <span className="position-badge">{player.position}</span>
                <span className="form-badge">
                  {player.form.toFixed(1)} ⭐
                </span>
              </div>

              <div className="player-name">{player.name}</div>

              <div className="player-stats">
                <div className="stat">
                  <span className="stat-label">xG</span>
                  <span className="stat-value">{player.xG.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Price</span>
                  <span className="stat-value">{player.price}M</span>
                </div>
              </div>

              {selectedPlayer === player.id && isMyTurn && (
                <button
                  className="btn-success btn-pick"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePick(player.id);
                  }}
                >
                  Pick Player
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Draft;
