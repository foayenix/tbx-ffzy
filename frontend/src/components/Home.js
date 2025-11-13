import React, { useState } from 'react';
import './Home.css';
import api from '../services/api';

function Home({ userId, onNavigate }) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateLeague = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/leagues', {
        name: 'My League',
        size: 4,
        commissionerId: userId
      });

      onNavigate('league-setup', response.data.league);
    } catch (err) {
      setError('Failed to create league');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async () => {
    if (!inviteCode) {
      setError('Please enter an invite code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/leagues/join', {
        inviteCode: inviteCode.toUpperCase(),
        userId
      });

      onNavigate('league-setup', response.data.league);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join league');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickMatch = () => {
    onNavigate('draft', { type: 'quick' });
  };

  return (
    <div className="home">
      <div className="hero">
        <h2 className="hero-title">Welcome to Football Frenzy!</h2>
        <p className="hero-subtitle">
          Fast-paced fantasy football. Draft your squad, use tactical boosts, and win in minutes!
        </p>
      </div>

      <div className="game-modes">
        <div className="card mode-card">
          <div className="mode-icon">🏆</div>
          <h3>League Play</h3>
          <p>Create or join a league, draft players, and compete in a mini-season with friends</p>

          <div className="mode-actions">
            <button
              className="btn-primary btn-large btn-block"
              onClick={handleCreateLeague}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create League'}
            </button>

            <div className="divider">OR</div>

            <div className="join-league">
              <input
                type="text"
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={6}
                disabled={loading}
              />
              <button
                className="btn-secondary btn-large"
                onClick={handleJoinLeague}
                disabled={loading || !inviteCode}
              >
                Join League
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="card mode-card">
          <div className="mode-icon">⚡</div>
          <h3>Quick Match</h3>
          <p>Draft a small squad and play a quick head-to-head match in under 3 minutes</p>

          <button
            className="btn-success btn-large btn-block"
            onClick={handleQuickMatch}
            disabled={loading}
          >
            Start Quick Match
          </button>

          <div className="mode-info">
            <div className="info-item">
              <span className="info-label">Entry Fee:</span>
              <span className="info-value">🪙 1 Coin</span>
            </div>
            <div className="info-item">
              <span className="info-label">Duration:</span>
              <span className="info-value">~3 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <h3>How It Works</h3>
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-number">1</div>
            <h4>Draft Your Squad</h4>
            <p>Pick 8 players in 30 seconds each. AI suggests top picks based on form and stats.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">2</div>
            <h4>Watch The Match</h4>
            <p>Real match events simulate minute-by-minute. Your players earn points for goals, assists, and more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">3</div>
            <h4>Use Tactical Boosts</h4>
            <p>One boost per match! Choose All-Out Attack or Park The Bus at the perfect moment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
