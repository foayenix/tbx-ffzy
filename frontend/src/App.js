import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import Draft from './components/Draft';
import Match from './components/Match';
import Wallet from './components/Wallet';
import LeagueSetup from './components/LeagueSetup';
import api from './services/api';

function App() {
  const [userId] = useState(() => {
    // Generate or retrieve user ID
    let id = localStorage.getItem('userId');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', id);
    }
    return id;
  });

  const [currentView, setCurrentView] = useState('home');
  const [wallet, setWallet] = useState(null);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [currentDraft, setCurrentDraft] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);

  useEffect(() => {
    loadWallet();
  }, [userId]);

  const loadWallet = async () => {
    try {
      const response = await api.get(`/wallet/${userId}`);
      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const navigateTo = (view, data = null) => {
    setCurrentView(view);
    if (view === 'league-setup') setCurrentLeague(data);
    if (view === 'draft') setCurrentDraft(data);
    if (view === 'match') setCurrentMatch(data);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1 onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
              ⚽ Football Frenzy
            </h1>
            <div className="header-right">
              <div className="coin-display" onClick={() => navigateTo('wallet')}>
                🪙 {wallet?.balance || 0} Coins
              </div>
              <div className="user-id">User: {userId.substring(0, 8)}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {currentView === 'home' && (
          <Home
            userId={userId}
            onNavigate={navigateTo}
          />
        )}

        {currentView === 'league-setup' && (
          <LeagueSetup
            userId={userId}
            league={currentLeague}
            onNavigate={navigateTo}
            onLeagueUpdate={setCurrentLeague}
          />
        )}

        {currentView === 'draft' && (
          <Draft
            userId={userId}
            draft={currentDraft}
            onNavigate={navigateTo}
            onDraftComplete={(match) => navigateTo('match', match)}
          />
        )}

        {currentView === 'match' && (
          <Match
            userId={userId}
            match={currentMatch}
            onNavigate={navigateTo}
            onMatchEnd={() => navigateTo('home')}
          />
        )}

        {currentView === 'wallet' && (
          <Wallet
            userId={userId}
            wallet={wallet}
            onNavigate={navigateTo}
            onWalletUpdate={loadWallet}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Football Frenzy - Fast-paced fantasy football</p>
        <p>Data source: {window.DATA_SOURCE || 'Loading...'}</p>
      </footer>
    </div>
  );
}

export default App;
