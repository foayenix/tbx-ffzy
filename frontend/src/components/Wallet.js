import React, { useState, useEffect } from 'react';
import './Wallet.css';
import api from '../services/api';

function Wallet({ userId, wallet, onNavigate, onWalletUpdate }) {
  const [packages, setPackages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const [packagesRes, transactionsRes] = await Promise.all([
        api.get('/wallet/packages'),
        api.get(`/wallet/${userId}/transactions`)
      ]);

      setPackages(packagesRes.data.packages);
      setTransactions(transactionsRes.data.transactions);
      setLoading(false);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    try {
      await api.post(`/wallet/${userId}/purchase`, { packageId });
      onWalletUpdate();
      loadData();
    } catch (error) {
      console.error('Error purchasing coins:', error);
    }
  };

  if (loading) {
    return (
      <div className="wallet loading">
        <div className="spinner"></div>
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="wallet">
      <div className="wallet-header card">
        <h2>Your Wallet</h2>
        <div className="balance-display">
          <div className="balance-label">Current Balance</div>
          <div className="balance-amount">
            🪙 {wallet?.balance || 0} Coins
          </div>
        </div>
      </div>

      <div className="coin-packages">
        <h3>Purchase Coins</h3>
        <div className="packages-grid">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className={`package-card ${pkg.popular ? 'popular' : ''}`}
            >
              {pkg.popular && <div className="popular-badge">Most Popular</div>}

              <div className="package-coins">
                🪙 {pkg.coins}
              </div>
              <div className="package-coins-label">Coins</div>

              <div className="package-price">
                £{pkg.price.toFixed(2)}
              </div>

              <button
                className="btn-primary btn-block"
                onClick={() => handlePurchase(pkg.id)}
              >
                Purchase
              </button>

              {pkg.popular && (
                <div className="package-value">
                  Best Value!
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="purchase-note">
          In a real app, this would integrate with App Store / Play Store IAP
        </div>
      </div>

      <div className="transactions-section card">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="no-transactions">
            No transactions yet
          </div>
        ) : (
          <div className="transactions-list">
            {transactions.map(tx => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-reason">
                    {tx.reason.replace(/_/g, ' ')}
                  </div>
                  <div className="transaction-description">
                    {tx.description}
                  </div>
                  <div className="transaction-date">
                    {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className={`transaction-amount ${tx.delta > 0 ? 'positive' : 'negative'}`}>
                  {tx.delta > 0 ? '+' : ''}{tx.delta} 🪙
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="btn-secondary btn-large"
        onClick={() => onNavigate('home')}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Wallet;
