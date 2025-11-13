const { v4: uuidv4 } = require('uuid');

class WalletService {
  constructor() {
    // In-memory storage for MVP (replace with database in production)
    this.wallets = new Map();
    this.ledger = [];
  }

  // Create a new wallet for a user
  createWallet(userId) {
    if (this.wallets.has(userId)) {
      return this.wallets.get(userId);
    }

    const wallet = {
      userId,
      balance: 10, // Starting bonus: 10 coins
      created: new Date()
    };

    this.wallets.set(userId, wallet);

    // Log the creation bonus
    this.addLedgerEntry(userId, 10, 'SIGNUP_BONUS', 'Account creation bonus');

    return wallet;
  }

  // Get user's wallet
  getWallet(userId) {
    let wallet = this.wallets.get(userId);
    if (!wallet) {
      wallet = this.createWallet(userId);
    }
    return wallet;
  }

  // Add coins to wallet
  addCoins(userId, amount, reason, description) {
    const wallet = this.getWallet(userId);
    wallet.balance += amount;
    this.addLedgerEntry(userId, amount, reason, description);
    return wallet;
  }

  // Deduct coins from wallet
  deductCoins(userId, amount, reason, description) {
    const wallet = this.getWallet(userId);

    if (wallet.balance < amount) {
      return {
        success: false,
        message: 'Insufficient coins',
        balance: wallet.balance
      };
    }

    wallet.balance -= amount;
    this.addLedgerEntry(userId, -amount, reason, description);

    return {
      success: true,
      balance: wallet.balance
    };
  }

  // Add entry to ledger (append-only)
  addLedgerEntry(userId, delta, reason, description) {
    const entry = {
      id: uuidv4(),
      userId,
      delta,
      reason,
      description,
      timestamp: new Date(),
      balanceAfter: this.wallets.get(userId).balance
    };

    this.ledger.push(entry);
    return entry;
  }

  // Get transaction history
  getTransactions(userId, limit = 20) {
    return this.ledger
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Handle match entry fee
  chargeMatchEntry(userId, matchType = 'league') {
    const fee = 1; // 1 coin per match
    return this.deductCoins(
      userId,
      fee,
      'MATCH_ENTRY',
      `Entry fee for ${matchType} match`
    );
  }

  // Reward match winner
  rewardMatchWinner(userId, matchType = 'league') {
    // In head-to-head, winner gets both entry fees
    // In league, it's just for progression
    const reward = matchType === 'head-to-head' ? 2 : 0;

    if (reward > 0) {
      return this.addCoins(
        userId,
        reward,
        'MATCH_WIN',
        `Reward for winning ${matchType} match`
      );
    }

    return this.getWallet(userId);
  }

  // Purchase coins (IAP simulation)
  purchaseCoins(userId, packageId) {
    const packages = {
      small: { coins: 10, price: 1.00 },
      medium: { coins: 50, price: 4.50 },
      large: { coins: 120, price: 10.00 }
    };

    const pkg = packages[packageId];
    if (!pkg) {
      return { success: false, message: 'Invalid package' };
    }

    // In production, verify IAP receipt here
    this.addCoins(
      userId,
      pkg.coins,
      'PURCHASE',
      `Purchased ${packageId} coin package (${pkg.coins} coins)`
    );

    return {
      success: true,
      coins: pkg.coins,
      balance: this.getWallet(userId).balance
    };
  }

  // Referral bonus
  applyReferralBonus(referrerId, refereeId) {
    const bonus = 5;

    this.addCoins(referrerId, bonus, 'REFERRAL', 'Referral bonus');
    this.addCoins(refereeId, bonus, 'REFERRAL', 'Referred by friend bonus');

    return {
      referrer: this.getWallet(referrerId),
      referee: this.getWallet(refereeId)
    };
  }

  // Get coin packages for purchase
  getCoinPackages() {
    return [
      { id: 'small', coins: 10, price: 1.00, popular: false },
      { id: 'medium', coins: 50, price: 4.50, popular: true },
      { id: 'large', coins: 120, price: 10.00, popular: false }
    ];
  }
}

module.exports = new WalletService();
